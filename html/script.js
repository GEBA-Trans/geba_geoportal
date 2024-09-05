import { setupLassoSelect, isLassoActive } from './scripts/lasso.js';

const zoomStep = 0.2;
let currentZoom = 1;
let svgElement;
let isDragging = false;
let startX, startY;
let viewBox = { x: 0, y: 0, width: 0, height: 0 };
let originalViewBox;
const postalCodeCounts = new Map();

function saveSelectedPostalCodes() {
    document.cookie = `selectedPostalCodes=${Array.from(selectedPostalCodes).join(',')}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

let isWebSocketConnected = false;
let pendingPostalCodes = new Set();

function loadSelectedPostalCodes() {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('selectedPostalCodes='));
    if (cookieValue) {
        const savedPostalCodes = cookieValue.split('=')[1].split(',');
        savedPostalCodes.forEach(postalCode => {
            const pathElement = document.getElementById(postalCode);
            if (pathElement) {
                selectedPostalCodes.add(postalCode);
                pathElement.classList.add('selected');
                pendingPostalCodes.add(postalCode);
            }
        });
        updateSelectedPostalCodesList();
        if (isWebSocketConnected) {
            requestPendingCounts();
        }
    }
}

async function loadSVG() {
    try {
        const response = await fetch('map.svg');
        const svgContent = await response.text();
        document.getElementById('map-container').innerHTML = svgContent;
        svgElement = document.querySelector('#map-container svg');
        connectWebSocket(); 
        setupPostalCodeClicks();
        setupZoomControls();
        setupPanning();
        setupLassoSelect(svgElement, togglePostalCode); // Pass svgElement and togglePostalCode
        viewBox = svgElement.viewBox.baseVal;
        originalViewBox = {
            x: viewBox.x,
            y: viewBox.y,
            width: viewBox.width,
            height: viewBox.height
        };
        
        // Delay loading of postal codes
        setTimeout(loadSelectedPostalCodes, 1000);
    } catch (error) {
        console.error('Error loading SVG:', error);
    }
}

loadSVG();

const selectedPostalCodes = new Set();

function setupPostalCodeClicks() {
    document.getElementById('map-container').addEventListener('click', (e) => {
        if (e.target.tagName === 'path') {
            const postalCode = e.target.id || 'Unknown';
            togglePostalCode(e.target, postalCode);
        }
    });
}

function togglePostalCode(pathElement, postalCode, isInitialLoad = false) {
    if (selectedPostalCodes.has(postalCode)) {
        sendToWebSocket('deselect', postalCode);
        removePostalCode(postalCode);
    } else {
        sendToWebSocket('select', postalCode);
        selectedPostalCodes.add(postalCode);
        pathElement.classList.add('selected');
    }
    if (!isInitialLoad) {
        updateSelectedPostalCodesList();
        saveSelectedPostalCodes();
    }
}

let pendingWebSocketMessages = [];

function sendToWebSocket(action, postalCode) {
    const message = JSON.stringify({ action, postalCode });
    if (isWebSocketConnected) {
        socket.send(message);
    } else {
        pendingWebSocketMessages.push(message);
    }
}

function updateSelectedPostalCodesList() {
    const postalCodeList = document.getElementById('postcodes-list');
    postalCodeList.innerHTML = '';
    
    if (selectedPostalCodes.size > 0) {
        const clearAllButton = document.createElement('button');
        clearAllButton.id = 'clear-all-button';
        clearAllButton.innerHTML = '<i class="fas fa-trash-alt"></i> Clear All';
        clearAllButton.addEventListener('click', clearAllPostalCodes);
        postalCodeList.appendChild(clearAllButton);
    }

    selectedPostalCodes.forEach(postalCode => {
        const li = document.createElement('li');
        li.setAttribute('data-postal-code', postalCode);
        const count = postalCodeCounts.get(postalCode);
        const countDisplay = count !== undefined ? `(${count}) ` : 
            pendingPostalCodes.has(postalCode) ? '<i class="fas fa-spinner fa-spin"></i> ' : '';
        const color = count !== undefined ? getColorForCount(count) : '#000';
        li.innerHTML = `
            <span class="count" style="color: ${color};">${countDisplay}</span>${postalCode}
            <button class="delete-btn" title="Remove ${postalCode}" style="display: none;">
                <i class="fas fa-times"></i>
            </button>
        `;
        li.addEventListener('mouseenter', () => {
            li.querySelector('.delete-btn').style.display = 'inline-block';
            highlightPostalCode(postalCode, true);
        });
        li.addEventListener('mouseleave', () => {
            li.querySelector('.delete-btn').style.display = 'none';
            highlightPostalCode(postalCode, false);
        });
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            removePostalCode(postalCode);
        });
        postalCodeList.appendChild(li);
    });
}

function removePostalCode(postalCode) {
    selectedPostalCodes.delete(postalCode);
    postalCodeCounts.delete(postalCode);
    const pathElement = document.getElementById(postalCode);
    if (pathElement) {
        pathElement.classList.remove('selected');
        pathElement.style.fill = ''; // Reset the fill color
    }
    updateSelectedPostalCodesList();
    saveSelectedPostalCodes();
    sendToWebSocket('deselect', postalCode);
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
    currentZoom += step;
    currentZoom = Math.max(0.5, Math.min(currentZoom, 4));

    const newWidth = viewBox.width / currentZoom;
    const newHeight = viewBox.height / currentZoom;
    const newX = viewBox.x + (viewBox.width - newWidth) / 2;
    const newY = viewBox.y + (viewBox.height - newHeight) / 2;

    viewBox = { x: newX, y: newY, width: newWidth, height: newHeight };
    svgElement.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
}

function resetView() {
    currentZoom = 1;
    viewBox = { ...originalViewBox };
    svgElement.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
}

function highlightPostalCode(postalCode, highlight) {
    const pathElement = document.getElementById(postalCode);
    console.log('Highlighting:', postalCode, highlight, pathElement);
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

function clearAllPostalCodes() {
    selectedPostalCodes.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            pathElement.classList.remove('selected');
            pathElement.style.fill = ''; // Reset the fill color
        }
        sendToWebSocket('deselect', postalCode);
    });
    selectedPostalCodes.clear();
    postalCodeCounts.clear();
    updateSelectedPostalCodesList();
    saveSelectedPostalCodes();
}

let socket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 3;

function connectWebSocket() {
    socket = new WebSocket('ws://lx-dev:1880/ws/map');

    socket.onopen = function(event) {
        console.log('WebSocket connection established');
        isWebSocketConnected = true;
        reconnectAttempts = 0;
        requestPendingCounts();
    };

    socket.onmessage = function(event) {
        const message = event.data;
        displayWebSocketMessage(message);
    };

    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    socket.onclose = function(event) {
        console.log('WebSocket connection closed');
        attemptReconnect();
    };
}

function attemptReconnect() {
    if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(connectWebSocket, 5000); // Wait 5 seconds before attempting to reconnect
    } else {
        console.log('Max reconnect attempts reached. Giving up.');
        // Optionally, you can notify the user that the connection has been lost
        alert('WebSocket connection lost. Please refresh the page to try again.');
    }
}

function displayWebSocketMessage(message) {
    try {
        const data = JSON.parse(message);
        if (data.action === 'select' && data.postalCode && data.count !== undefined) {
            updatePostalCodeCount(data.postalCode, data.count);
            pendingPostalCodes.delete(data.postalCode);
            updateSelectedPostalCodesList();
        }
    } catch (error) {
        console.error('Error parsing WebSocket message:', error);
    }
}

function updatePostalCodeCount(postalCode, count) {
    postalCodeCounts.set(postalCode, count);
    updatePostalCodeColor(postalCode, count);
}

function updatePostalCodeColor(postalCode, count) {
    const pathElement = document.getElementById(postalCode);
    if (pathElement) {
        const color = getColorForCount(count);
        pathElement.style.fill = color;
    }
}

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

function requestPendingCounts() {
    pendingPostalCodes.forEach(postalCode => {
        sendToWebSocket('select', postalCode);
    });
}

function processPendingWebSocketMessages() {
    while (pendingWebSocketMessages.length > 0) {
        const message = pendingWebSocketMessages.shift();
        socket.send(message);
    }
}
