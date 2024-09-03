let currentZoom = 1;
const zoomStep = 0.2;
let svgElement;
let isDragging = false;
let startX, startY;
let viewBox = { x: 0, y: 0, width: 0, height: 0 };
let originalViewBox;
let isLassoActive = false;
let lassoPoints = [];

fetch('map.svg')
    .then(response => response.text())
    .then(svgContent => {
        document.getElementById('map-container').innerHTML = svgContent;
        svgElement = document.querySelector('#map-container svg');
        setupPostalCodeClicks();
        setupZoomControls();
        setupPanning();
        setupLassoSelect();
        viewBox = svgElement.viewBox.baseVal;
        originalViewBox = { x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height };
    });

const selectedPostalCodes = new Set();

function setupPostalCodeClicks() {
    const paths = document.querySelectorAll('#map-container svg path');
    paths.forEach(path => {
        path.addEventListener('click', (e) => {
            const postalCode = e.target.id || 'Unknown';
            togglePostalCode(e.target, postalCode);
        });
    });
}

function togglePostalCode(pathElement, postalCode) {
    if (selectedPostalCodes.has(postalCode)) {
        removePostalCode(postalCode);
    } else {
        selectedPostalCodes.add(postalCode);
        pathElement.classList.add('selected');
    }
    updateSelectedPostalCodesList();
}

function updateSelectedPostalCodesList() {
    const postalCodeList = document.getElementById('postcodes-list');
    postalCodeList.innerHTML = '';
    selectedPostalCodes.forEach(postalCode => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${postalCode}
            <button class="delete-btn" title="Remove ${postalCode}" style="display: none;">
                <i class="fas fa-times"></i>
            </button>
        `;
        li.addEventListener('mouseenter', () => {
            li.querySelector('.delete-btn').style.display = 'inline-block';
        });
        li.addEventListener('mouseleave', () => {
            li.querySelector('.delete-btn').style.display = 'none';
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
    currentZoom = Math.max(0.5, Math.min(currentZoom, 4)); // Limit zoom between 0.5x and 4x

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
    document.addEventListener('mouseup', endLasso); // Change this line
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
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
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
    toggleLasso(); // Deactivate lasso after selection
}
