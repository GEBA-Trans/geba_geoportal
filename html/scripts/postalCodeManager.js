import { sendToWebSocket, isWebSocketConnected, pendingPostalCodes, requestPendingCounts } from './websocket.js';

const LOADING_MODE = 'loading';
const DELIVERY_MODE = 'delivery';
const COOKIE_NAME = 'selectedPostalCodes';

let currentMode = 'loading';
const loadingPostalCodes = new Set();
const deliveryPostalCodes = new Set();
const postalCodeCounts = new Map();

export function setupPostalCodeClicks() {
    document.getElementById('map-container').addEventListener('click', (e) => {
        if (e.target.tagName === 'path') {
            const postalCode = e.target.id || 'Unknown';
            togglePostalCode(e.target, postalCode);
        }
    });
}

export function togglePostalCode(pathElement, postalCode, isInitialLoad = false) {
    const targetSet = currentMode === 'loading' ? loadingPostalCodes : deliveryPostalCodes;
    const otherSet = currentMode === 'loading' ? deliveryPostalCodes : loadingPostalCodes;

    if (targetSet.has(postalCode)) {
        targetSet.delete(postalCode);
        pathElement.classList.remove('selected', currentMode);
        sendToWebSocket('deselect', postalCode);
    } else {
        otherSet.delete(postalCode);
        targetSet.add(postalCode);
        pathElement.classList.remove('selected', 'loading', 'delivery');
        pathElement.classList.add('selected', currentMode);
        sendToWebSocket('select', postalCode);
    }

    pathElement.style.fill = '';

    if (!isInitialLoad) {
        updatePostalCodeLists();
        saveSelectedPostalCodes();
    }
}

export function updatePostalCodeLists() {
    updateList('loading-list', loadingPostalCodes);
    updateList('delivery-list', deliveryPostalCodes);
}

function updateList(listId, postalCodes) {
    const list = document.getElementById(listId);
    list.innerHTML = '';

    if (postalCodes.size > 0) {
        const clearAllButton = document.createElement('button');
        clearAllButton.className = 'clear-all-button';
        clearAllButton.innerHTML = '<i class="fas fa-trash-alt"></i> Clear All';
        clearAllButton.addEventListener('click', () => clearAllPostalCodes(postalCodes));
        list.appendChild(clearAllButton);
    }

    postalCodes.forEach(postalCode => {
        const li = document.createElement('li');
        li.setAttribute('data-postal-code', postalCode);
        const count = postalCodeCounts.get(postalCode);
        const countDisplay = count !== undefined ? `(${count}) ` : 
            pendingPostalCodes.has(postalCode) ? '<i class="fas fa-spinner fa-spin"></i> ' : '';
        const color = count !== undefined ? getColorForCount(count) : '#000';
        li.innerHTML = `
            <span class="count" style="color: ${color};">${countDisplay}</span>${postalCode}
            <button class="delete-btn" title="Remove ${postalCode}">
                <i class="fas fa-times"></i>
            </button>
        `;
        li.addEventListener('mouseenter', () => highlightPostalCode(postalCode, true));
        li.addEventListener('mouseleave', () => highlightPostalCode(postalCode, false));
        li.querySelector('.delete-btn').addEventListener('click', () => removePostalCode(postalCode));
        list.appendChild(li);
    });
}

function getColorForCount(count) {
    count = Math.max(0, Math.min(99, count));
    const percentage = count / 99;
    const r = Math.round(255 * (1 - percentage));
    const g = Math.round(255 * percentage);
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
}

function removePostalCode(postalCode) {
    loadingPostalCodes.delete(postalCode);
    deliveryPostalCodes.delete(postalCode);
    postalCodeCounts.delete(postalCode);
    const pathElement = document.getElementById(postalCode);
    if (pathElement) {
        pathElement.classList.remove('selected', 'loading', 'delivery');
        pathElement.style.fill = '';
    }
    updatePostalCodeLists();
    saveSelectedPostalCodes();
    sendToWebSocket('deselect', postalCode);
}

function clearAllPostalCodes(postalCodes) {
    postalCodes.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            pathElement.classList.remove('selected', 'loading', 'delivery');
            pathElement.style.fill = '';
        }
        sendToWebSocket('deselect', postalCode);
    });
    postalCodes.clear();
    postalCodeCounts.clear();
    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

function highlightPostalCode(postalCode, highlight) {
    const pathElement = document.getElementById(postalCode);
    if (pathElement) {
        if (highlight) {
            pathElement.style.stroke = '#ff0000';
            pathElement.style.strokeWidth = '2px';
            pathElement.style.fillOpacity = '0.7';
        } else {
            pathElement.style.stroke = '';
            pathElement.style.strokeWidth = '';
            pathElement.style.fillOpacity = '';
        }
    }
}

export function updatePostalCodeCount(postalCode, count) {
    postalCodeCounts.set(postalCode, count);
    updatePostalCodeLists();
}

export function setMode(mode) {
    currentMode = mode;
    document.getElementById('loading-mode').classList.toggle('active', mode === 'loading');
    document.getElementById('delivery-mode').classList.toggle('active', mode === 'delivery');
}

export function loadSelectedPostalCodes() {
    try {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${COOKIE_NAME}=`));
        if (cookieValue) {
            const data = JSON.parse(cookieValue.split('=')[1]);
            loadPostalCodesFromData(data[LOADING_MODE], loadingPostalCodes, LOADING_MODE);
            loadPostalCodesFromData(data[DELIVERY_MODE], deliveryPostalCodes, DELIVERY_MODE);
            updatePostalCodeLists();
            if (isWebSocketConnected) {
                requestPendingCounts();
            }
        }
    } catch (error) {
        console.error('Error loading postal codes:', error);
    }
}

function loadPostalCodesFromData(data, targetSet, mode) {
    data.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            targetSet.add(postalCode);
            pathElement.classList.add('selected', mode);
            pendingPostalCodes.add(postalCode);
        }
    });
}

function saveSelectedPostalCodes() {
    const data = {
        [LOADING_MODE]: Array.from(loadingPostalCodes),
        [DELIVERY_MODE]: Array.from(deliveryPostalCodes)
    };
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(data)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

export function getSelectedPostalCodes() {
    return {
        loading: Array.from(loadingPostalCodes),
        delivery: Array.from(deliveryPostalCodes)
    };
}