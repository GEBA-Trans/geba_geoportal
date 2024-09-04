const zoomStep = 0.2;
let currentZoom = 1;
let svgElement;
let isDragging = false;
let startX, startY;
let viewBox = { x: 0, y: 0, width: 0, height: 0 };
let originalViewBox;
let isLassoActive = false;
let lassoPoints = [];

function saveSelectedPostalCodes() {
    document.cookie = `selectedPostalCodes=${Array.from(selectedPostalCodes).join(',')}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadSelectedPostalCodes() {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('selectedPostalCodes='));
    if (cookieValue) {
        const savedPostalCodes = cookieValue.split('=')[1].split(',');
        savedPostalCodes.forEach(postalCode => {
            const pathElement = document.getElementById(postalCode);
            if (pathElement) {
                togglePostalCode(pathElement, postalCode);
            }
        });
    }
}

async function loadSVG() {
    try {
        const response = await fetch('map.svg');
        const svgContent = await response.text();
        document.getElementById('map-container').innerHTML = svgContent;
        svgElement = document.querySelector('#map-container svg');
        setupPostalCodeClicks();
        setupZoomControls();
        setupPanning();
        setupLassoSelect();
        viewBox = svgElement.viewBox.baseVal;
        originalViewBox = { ...viewBox };
        loadSelectedPostalCodes();
        connectWebSocket(); // Add this line
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

function togglePostalCode(pathElement, postalCode) {
    if (selectedPostalCodes.has(postalCode)) {
        removePostalCode(postalCode);
        sendToWebSocket('deselect', postalCode);
    } else {
        selectedPostalCodes.add(postalCode);
        pathElement.classList.add('selected');
        sendToWebSocket('select', postalCode);
    }
    updateSelectedPostalCodesList();
    saveSelectedPostalCodes();
}

function sendToWebSocket(action, postalCode) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ action, postalCode });
        socket.send(message);
    } else {
        console.error('WebSocket is not connected');
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
        li.innerHTML = `
            ${postalCode}
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
    const pathElement = document.getElementById(postalCode);
    if (pathElement) {
        pathElement.classList.remove('selected');
    }
    updateSelectedPostalCodesList();
    saveSelectedPostalCodes();
    sendToWebSocket('deselect', postalCode); // Add this line
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
        if (!isLassoActive) startDragging(e);
    });
    mapContainer.addEventListener('mousemove', (e) => {
        if (!isLassoActive) drag(e);
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

function setupLassoSelect() {
    const lassoButton = document.getElementById('lasso-button');
    lassoButton.addEventListener('click', toggleLasso);

    svgElement.addEventListener('mousedown', startLasso);
    svgElement.addEventListener('mousemove', updateLasso);
    document.addEventListener('mouseup', endLasso);
}

function toggleLasso() {
    isLassoActive = !isLassoActive;
    svgElement.classList.toggle('lasso-active', isLassoActive);
    const lassoButton = document.getElementById('lasso-button');
    lassoButton.innerHTML = isLassoActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-draw-polygon"></i>';
    lassoButton.title = isLassoActive ? 'Cancel Lasso' : 'Lasso Select';
}

function startLasso(e) {
    if (!isLassoActive) return;
    e.preventDefault();
    const point = getSVGPoint(e.clientX, e.clientY);
    lassoPoints = [point];
}

function updateLasso(e) {
    if (!isLassoActive || lassoPoints.length === 0) return;
    e.preventDefault();
    const point = getSVGPoint(e.clientX, e.clientY);
    lassoPoints.push(point);
    drawLasso();
}

function getSVGPoint(x, y) {
    const pt = svgElement.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svgElement.getScreenCTM().inverse());
}

function drawLasso() {
    let existingLasso = svgElement.querySelector('#lasso');
    if (existingLasso) existingLasso.remove();

    const lasso = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lasso.setAttribute('id', 'lasso');
    lasso.setAttribute('d', `M ${lassoPoints.map(p => `${p.x},${p.y}`).join(' L ')}`);
    lasso.setAttribute('fill', 'none');
    lasso.setAttribute('stroke', 'black');
    lasso.setAttribute('stroke-width', '2');
    lasso.setAttribute('stroke-dasharray', '5,5');
    svgElement.appendChild(lasso);
}

function selectPathsInLasso() {
    const paths = document.querySelectorAll('#map-container svg path');
    paths.forEach(path => {
        if (isPathInLasso(path)) {
            const postalCode = path.id || 'Unknown';
            togglePostalCode(path, postalCode);
        }
    });
}

function isPathInLasso(path) {
    const bbox = path.getBBox();
    const points = [
        { x: bbox.x, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y + bbox.height },
        { x: bbox.x, y: bbox.y + bbox.height }
    ];
    return points.some(point => isPointInPolygon(point, lassoPoints));
}

function isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = [polygon[i].x, polygon[i].y];
        const [xj, yj] = [polygon[j].x, polygon[j].y];
        const intersect = ((yi > point.y) !== (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function clearLasso() {
    const lasso = svgElement.querySelector('#lasso');
    if (lasso) lasso.remove();
    lassoPoints = [];
}

function endLasso(e) {
    if (!isLassoActive || lassoPoints.length === 0) return;
    e.preventDefault();
    const point = getSVGPoint(e.clientX, e.clientY);
    lassoPoints.push(point);
    drawLasso();
    selectPathsInLasso();
    clearLasso();
    toggleLasso();
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
        }
        sendToWebSocket('deselect', postalCode); // Add this line
    });
    selectedPostalCodes.clear();
    updateSelectedPostalCodesList();
    saveSelectedPostalCodes();
}

let socket;

function connectWebSocket() {
    socket = new WebSocket('ws://localhost:1880/ws/map');

    socket.onopen = function(event) {
        console.log('WebSocket connection established');
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
        // Attempt to reconnect after a short delay
        setTimeout(connectWebSocket, 5000);
    };
}

function displayWebSocketMessage(message) {
    const messagesDiv = document.getElementById('websocket-messages');
    messagesDiv.innerHTML = ''; // Clear previous messages
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
}

// Call this function to initiate the WebSocket connection
connectWebSocket();
