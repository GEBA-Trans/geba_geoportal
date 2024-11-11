import { isLassoActive } from './lasso.js';

let svgElement;
let originalViewBox;
let currentZoom = 1.0;
let isDragging = false;
let startX, startY;
let viewBox;

const zoomStep = 0.2;

let zoomFactorDisplay; // Add this line

export function initializeZoomPan(svg, origViewBox) {
    svgElement = svg;
    originalViewBox = origViewBox;
    viewBox = { ...originalViewBox };

    // Store the original 'd' attribute for each path
    const paths = svgElement.querySelectorAll('path');
    paths.forEach(path => {
        path.setAttribute('data-original-d', path.getAttribute('d'));
    });
}

export function setupZoomControls() {
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const resetZoom = document.getElementById('reset-zoom');
    zoomFactorDisplay = document.getElementById('zoom-factor'); // Add this line

    zoomIn.addEventListener('click', () => zoom(zoomStep));
    zoomOut.addEventListener('click', () => zoom(-zoomStep));
    resetZoom.addEventListener('click', resetView);
    
    // Add mouse wheel zoom
    svgElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomDirection = e.deltaY < 0 ? zoomStep : -zoomStep;
        zoom(zoomDirection);
    });
}

export function setupPanning() {
    const mapContainer = document.getElementById('map-container');

    mapContainer.addEventListener('mousedown', startDragging);
    mapContainer.addEventListener('mousemove', drag);
    mapContainer.addEventListener('mouseup', stopDragging);
    mapContainer.addEventListener('mouseleave', stopDragging);
}

function startDragging(e) {
    if (!isLassoActive) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    }
}

function drag(e) {
    if (!isDragging || isLassoActive) return;
    e.preventDefault();

    requestAnimationFrame(() => {
        const dx = (e.clientX - startX) / currentZoom;
        const dy = (e.clientY - startY) / currentZoom;

        viewBox.x -= dx * (originalViewBox.width / svgElement.clientWidth);
        viewBox.y -= dy * (originalViewBox.height / svgElement.clientHeight);
        updateSvgViewBox();

        startX = e.clientX;
        startY = e.clientY;
    });
}

function stopDragging() {
    isDragging = false;
}

function zoom(step) {
    const newZoom = currentZoom + step;
    if (newZoom >= 0.5 && newZoom <= 15) { // Update max zoom if needed
        currentZoom = newZoom;

        const newWidth = originalViewBox.width / currentZoom;
        const newHeight = originalViewBox.height / currentZoom;
        const newX = viewBox.x + (viewBox.width - newWidth) / 2;
        const newY = viewBox.y + (viewBox.height - newHeight) / 2;

        viewBox = { x: newX, y: newY, width: newWidth, height: newHeight };
        updateSvgViewBox();

        // Update the zoom factor display
        zoomFactorDisplay.textContent = `Zoom: ${currentZoom.toFixed(1)}x`;

    }
}

function resetView() {
    currentZoom = 1;
    viewBox = { ...originalViewBox };
    updateSvgViewBox();
    
    // Update the zoom factor display
    zoomFactorDisplay.textContent = `Zoom: ${currentZoom.toFixed(1)}x`; // Add this line
}

function updateSvgViewBox() {
    if (svgElement && viewBox) {
        svgElement.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    }
}