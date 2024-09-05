import { setupLassoSelect, isLassoActive } from './scripts/lasso.js';
import { connectWebSocket, sendToWebSocket, isWebSocketConnected, pendingPostalCodes, requestPendingCounts, lookupCompanies } from './scripts/websocket.js';

const zoomStep = 0.2;
let currentZoom = 1;
let svgElement;
let isDragging = false;
let startX, startY;
let viewBox = { x: 0, y: 0, width: 0, height: 0 };
let originalViewBox = { x: 0, y: 0, width: 0, height: 0 };
const postalCodeCounts = new Map();

let currentMode = 'loading';
const loadingPostalCodes = new Set();
const deliveryPostalCodes = new Set();

// Constants
const LOADING_MODE = 'loading';
const DELIVERY_MODE = 'delivery';
const COOKIE_NAME = 'selectedPostalCodes';

function initializeApp() {
    loadSVG()
        .then(() => {
            connectWebSocket();
            setupPostalCodeClicks();
            setupZoomControls();
            setupPanning();
            setupLassoSelect(svgElement, togglePostalCode);
            setupModeToggle();
            setMode('loading'); // Set initial mode
            setTimeout(loadSelectedPostalCodes, 1000);
            ensureControlsVisibility(); // Add this line
        })
        .catch(error => console.error('Error initializing app:', error));
}

// Add this new function
function ensureControlsVisibility() {
    const controls = document.getElementById('controls');
    if (controls) {
        controls.style.display = 'block';
        controls.style.zIndex = '1000';
    }
}

// Modify the loadSVG function
async function loadSVG() {
    try {
        const response = await fetch('map.svg');
        const svgContent = await response.text();
        document.getElementById('map-container').innerHTML += svgContent; // Change this line
        svgElement = document.querySelector('#map-container svg');
        viewBox = svgElement.viewBox.baseVal;
        originalViewBox = {
            x: viewBox.x,
            y: viewBox.y,
            width: viewBox.width,
            height: viewBox.height
        };
    } catch (error) {
        console.error('Error loading SVG:', error);
        throw error;
    }
}

function saveSelectedPostalCodes() {
    const data = {
        [LOADING_MODE]: Array.from(loadingPostalCodes),
        [DELIVERY_MODE]: Array.from(deliveryPostalCodes)
    };
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(data)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadSelectedPostalCodes() {
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

function setupModeToggle() {
    const loadingButton = document.getElementById('loading-mode');
    const deliveryButton = document.getElementById('delivery-mode');

    loadingButton.addEventListener('click', () => setMode('loading'));
    deliveryButton.addEventListener('click', () => setMode('delivery'));
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('loading-mode').classList.toggle('active', mode === 'loading');
    document.getElementById('delivery-mode').classList.toggle('active', mode === 'delivery');
}

function setupPostalCodeClicks() {
    document.getElementById('map-container').addEventListener('click', (e) => {
        if (e.target.tagName === 'path') {
            const postalCode = e.target.id || 'Unknown';
            togglePostalCode(e.target, postalCode);
        }
    });
}

function togglePostalCode(pathElement, postalCode, isInitialLoad = false) {
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

    // Remove any inline fill style
    pathElement.style.fill = '';

    if (!isInitialLoad) {
        updatePostalCodeLists();
        saveSelectedPostalCodes();
    }
}

function updatePostalCodeLists() {
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

// Add this function back to get colors for the counts
function getColorForCount(count) {
    // Ensure count is between 0 and 99
    count = Math.max(0, Math.min(99, count));
    
    // Calculate the percentage (0 to 1)
    const percentage = count / 99;
    
    // Calculate RGB values
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
        pathElement.style.fill = ''; // Reset the fill color
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
            pathElement.style.fill = ''; // Reset the fill color
        }
        sendToWebSocket('deselect', postalCode);
    });
    postalCodes.clear();
    postalCodeCounts.clear();
    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

function setupZoomControls() {
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const resetZoom = document.getElementById('reset-zoom');

    zoomIn.addEventListener('click', () => zoom(zoomStep));
    zoomOut.addEventListener('click', () => zoom(-zoomStep));
    resetZoom.addEventListener('click', resetView);
}

function setupPanning() {
    const mapContainer = document.getElementById('map-container');

    mapContainer.addEventListener('mousedown', (e) => {
        if (!isLassoActive) {
            startDragging(e);
        }
    });
    mapContainer.addEventListener('mousemove', (e) => {
        if (!isLassoActive) {
            drag(e);
        }
    });
    mapContainer.addEventListener('mouseup', stopDragging);
    mapContainer.addEventListener('mouseleave', stopDragging);
}

function startDragging(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const dx = (e.clientX - startX) * viewBox.width / svgElement.clientWidth / currentZoom;
    const dy = (e.clientY - startY) * viewBox.height / svgElement.clientHeight / currentZoom;

    viewBox.x -= dx;
    viewBox.y -= dy;

    svgElement.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);

    startX = e.clientX;
    startY = e.clientY;
}

function stopDragging() {
    isDragging = false;
}

function zoom(step) {
    const newZoom = currentZoom + step;
    if (newZoom >= 0.5 && newZoom <= 4) {
        currentZoom = newZoom;

        const newWidth = originalViewBox.width / currentZoom;
        const newHeight = originalViewBox.height / currentZoom;
        const newX = viewBox.x + (viewBox.width - newWidth) / 2;
        const newY = viewBox.y + (viewBox.height - newHeight) / 2;

        viewBox = { x: newX, y: newY, width: newWidth, height: newHeight };
        svgElement.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
    }
}

function resetView() {
    currentZoom = 1;
    viewBox = { ...originalViewBox };
    svgElement.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
}

function highlightPostalCode(postalCode, highlight) {
    const pathElement = document.getElementById(postalCode);
    // console.log('Highlighting:', postalCode, highlight, pathElement);
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

function updatePostalCodeCount(postalCode, count) {
    postalCodeCounts.set(postalCode, count);
    updatePostalCodeLists();
}

// Export functions that need to be accessed by websocket.js
export { updatePostalCodeCount, updatePostalCodeLists };

document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for the lookup button
    const lookupButton = document.getElementById('lookup-button');
    lookupButton.addEventListener('click', lookupCompanies);
});

initializeApp();
