import { sendToWebSocket, isWebSocketConnected, pendingPostalCodes, requestPendingCounts } from './websocket.js';

const LOADING_MODE = 'loading';
const DELIVERY_MODE = 'delivery';
const COOKIE_NAME = 'selectedPostalCodes';
const EXPANDED_COUNTRIES_COOKIE = 'expandedCountries';

let currentMode = 'loading';
const loadingPostalCodes = new Set();
const deliveryPostalCodes = new Set();
const postalCodeCounts = new Map();
let expandedCountries = {
    [LOADING_MODE]: new Set(),
    [DELIVERY_MODE]: new Set()
};

export function setupPostalCodeClicks() {
    document.getElementById('map-container').addEventListener('click', (e) => {
        if (e.target.tagName === 'path') {
            const postalCode = e.target.id || 'Unknown';
            const parentGroup = e.target.closest('g');
            const parentId = parentGroup ? parentGroup.id : 'No parent';
            console.log(`Clicked path: ${postalCode}, Parent group: ${parentId}`);
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

    const groupedPostalCodes = groupPostalCodesByCountry(postalCodes);
    const mode = listId === 'loading-list' ? LOADING_MODE : DELIVERY_MODE;

    for (const [country, codes] of Object.entries(groupedPostalCodes)) {
        const countryElement = document.createElement('div');
        countryElement.className = 'country-group';
        
        const countryHeader = document.createElement('div');
        countryHeader.className = 'country-header';
        const isExpanded = expandedCountries[mode].has(country);
        countryHeader.innerHTML = `
            <button class="toggle-btn" aria-expanded="${isExpanded}" title="${isExpanded ? 'Collapse' : 'Expand'}">
                <i class="fas fa-chevron-${isExpanded ? 'down' : 'right'}"></i>
            </button>
            <h3>${country} (${codes.length})</h3>
            <button class="add-all-btn" title="Add all postal codes">
                <i class="fas fa-plus-circle"></i>
            </button>
        `;
        countryElement.appendChild(countryHeader);
        
        const codesUl = document.createElement('ul');
        codesUl.className = 'postal-codes-list';
        codesUl.style.display = isExpanded ? 'block' : 'none';
        codes.forEach(postalCode => {
            const li = document.createElement('li');
            li.setAttribute('data-postal-code', postalCode);
            const count = postalCodeCounts.get(postalCode);
            const countDisplay = count !== undefined ? `(${count}) ` : 
                pendingPostalCodes.has(postalCode) ? '<i class="fas fa-spinner fa-spin"></i> ' : '';
            const color = count !== undefined ? getColorForCount(count) : '#000';
            li.innerHTML = `
                ${postalCode}<span class="count" style="color: ${color};">${countDisplay}</span>
                <button class="delete-btn" title="Remove ${postalCode}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            li.addEventListener('mouseenter', () => highlightPostalCode(postalCode, true));
            li.addEventListener('mouseleave', () => highlightPostalCode(postalCode, false));
            li.querySelector('.delete-btn').addEventListener('click', () => removePostalCode(postalCode));
            codesUl.appendChild(li);
        });
        
        countryElement.appendChild(codesUl);
        list.appendChild(countryElement);

        countryHeader.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-btn')) {
                const toggleBtn = countryHeader.querySelector('.toggle-btn');
                toggleBtn.setAttribute('aria-expanded', !isExpanded);
                toggleBtn.title = isExpanded ? 'Expand' : 'Collapse';
                toggleBtn.querySelector('i').className = `fas fa-chevron-${isExpanded ? 'right' : 'down'}`;
                toggleCountryExpansion(country, mode);
            }
        });

        countryHeader.querySelector('.add-all-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            addAllPostalCodes(country, mode);
        });
    }
}

function groupPostalCodesByCountry(postalCodes) {
    const grouped = {};
    postalCodes.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            const parentGroup = pathElement.closest('g');
            const country = parentGroup ? parentGroup.id : 'Unknown';
            if (!grouped[country]) {
                grouped[country] = [];
            }
            grouped[country].push(postalCode);
        }
    });
    return grouped;
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
    return new Promise((resolve, reject) => {
        try {
            loadExpandedCountries();
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
            resolve();
        } catch (error) {
            console.error('Error loading postal codes:', error);
            reject(error);
        }
    });
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

export function toggleCountryExpansion(country, mode) {
    if (expandedCountries[mode].has(country)) {
        expandedCountries[mode].delete(country);
    } else {
        expandedCountries[mode].add(country);
    }
    saveExpandedCountries();
    updatePostalCodeLists();
}

function saveExpandedCountries() {
    const data = {
        [LOADING_MODE]: Array.from(expandedCountries[LOADING_MODE]),
        [DELIVERY_MODE]: Array.from(expandedCountries[DELIVERY_MODE])
    };
    document.cookie = `${EXPANDED_COUNTRIES_COOKIE}=${JSON.stringify(data)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadExpandedCountries() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${EXPANDED_COUNTRIES_COOKIE}=`));
    if (cookieValue) {
        const data = JSON.parse(cookieValue.split('=')[1]);
        expandedCountries[LOADING_MODE] = new Set(data[LOADING_MODE] || []);
        expandedCountries[DELIVERY_MODE] = new Set(data[DELIVERY_MODE] || []);
    }
}

function addAllPostalCodes(country, mode) {
    const allPaths = document.querySelectorAll(`#map-container svg g#${country} path`);
    const targetSet = mode === LOADING_MODE ? loadingPostalCodes : deliveryPostalCodes;
    const otherSet = mode === LOADING_MODE ? deliveryPostalCodes : loadingPostalCodes;

    allPaths.forEach(path => {
        const postalCode = path.id;
        if (postalCode) {
            otherSet.delete(postalCode);
            targetSet.add(postalCode);
            path.classList.remove('selected', 'loading', 'delivery');
            path.classList.add('selected', mode);
            sendToWebSocket('select', postalCode);
        }
    });

    updatePostalCodeLists();
    saveSelectedPostalCodes();
}