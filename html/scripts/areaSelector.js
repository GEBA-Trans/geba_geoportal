import { disablePostalCodeClicks, enablePostalCodeClicks, addAllPostalCodes, reloadSelectedPostalCodes } from './postalCodeManager.js';
import { selectionSize } from './settings.js';
import { growSelection, setGrowSelectionDeps } from './growSelection.js';
import { isBBoxInPolygon, isPathInSelection } from './polygonUtils.js';
import { drawPolygon, drawBBoxRect } from './svgDebugUtils.js';

export let isAreaSelectorActive = false;

let currentMode;
let selectionPoints = [];
let svgElement;
let addPostalCodeCallback;

// Store handler references for cleanup
let lassoButtonHandler, lassoIndicatorHandler, svgMouseDownHandler, svgMouseMoveHandler, documentMouseUpHandler;

export function setupLassoSelector(svg, addPostalCodeFunc) {
    svgElement = svg;
    addPostalCodeCallback = addPostalCodeFunc;
    // Try new IDs first, fallback to old lasso IDs if not found
    let lassoButton = document.getElementById('area-selector-button') || document.getElementById('lasso-button');
    let lassoIndicatorButton = document.getElementById('area-selector-active-indicator') || document.getElementById('lasso-active-indicator');

    if (!lassoButton || !lassoIndicatorButton) {
        console.warn('[areaSelector] Selector buttons not found. Please check your HTML IDs.');
        return;
    }

    // Store handlers for removal
    lassoButtonHandler = toggleLassoSelector;
    lassoIndicatorHandler = toggleLassoSelector;
    svgMouseDownHandler = startLassoSelection;
    svgMouseMoveHandler = updateLassoSelection;
    documentMouseUpHandler = endLassoSelection;

    lassoButton.addEventListener('click', lassoButtonHandler);
    lassoIndicatorButton.addEventListener('click', lassoIndicatorHandler);
    svgElement.addEventListener('mousedown', svgMouseDownHandler);
    svgElement.addEventListener('mousemove', svgMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
}

// Cleanup function to remove all event listeners
export function destroyLassoSelect() {
    const lassoButton = document.getElementById('lasso-button');
    const lassoIndicatorButton = document.getElementById('lasso-active-indicator');
    if (lassoButton && lassoButtonHandler) lassoButton.removeEventListener('click', lassoButtonHandler);
    if (lassoIndicatorButton && lassoIndicatorHandler) lassoIndicatorButton.removeEventListener('click', lassoIndicatorHandler);
    if (svgElement && svgMouseDownHandler) svgElement.removeEventListener('mousedown', svgMouseDownHandler);
    if (svgElement && svgMouseMoveHandler) svgElement.removeEventListener('mousemove', svgMouseMoveHandler);
    document.removeEventListener('mouseup', documentMouseUpHandler);
}

// Add this new function to set the current mode
export function setToolMode(mode) {
    currentMode = mode;
}

// Helper to update path styles and listeners
function updatePathStyles(isActive) {
    const paths = document.querySelectorAll('#map-container svg path');
    paths.forEach(path => {
        if (isActive) {
            if (!path.classList.contains('selected')) {
                path.style.filter = 'grayscale(75%)';
            }
            path.classList.add('crosshair-cursor');
        } else {
            path.style.filter = '';
            path.classList.remove('crosshair-cursor');
        }
    });
}

function updatePathMouseover(isActive) {
    const paths = document.querySelectorAll('#map-container svg path');
    paths.forEach(path => {
        if (isActive) {
            path.addEventListener('mouseover', crosshairMouseover);
        } else {
            path.removeEventListener('mouseover', crosshairMouseover);
        }
    });
}

function crosshairMouseover(e) {
    if (isAreaSelectorActive) {
        e.currentTarget.classList.add('crosshair-cursor');
    }
}

function toggleLassoSelector() {
    isAreaSelectorActive = !isAreaSelectorActive;
    const lassoButton = document.getElementById('lasso-button');
    const lassoStatus = document.getElementById('lasso-status');
    const lassoIndicator = document.getElementById('lasso-active-indicator');
    lassoButton.innerHTML = isAreaSelectorActive ? '<i class="fas fa-times icon-cancel"></i>' : '<i class="fas fa-highlighter"></i>';
    lassoButton.title = isAreaSelectorActive ? 'Cancel Lasso' : 'Lasso Select';
    lassoStatus.classList.toggle('lasso-status-visible', isAreaSelectorActive);
    lassoStatus.classList.toggle('lasso-status-hidden', !isAreaSelectorActive);
    if (lassoIndicator) {
        lassoIndicator.style.display = isAreaSelectorActive ? 'block' : 'none';
    }

    const mapContainer = document.getElementById('map-container');
    mapContainer.classList.toggle('lasso-active', isAreaSelectorActive);
    mapContainer.classList.toggle('lasso-inactive', !isAreaSelectorActive);

    if (isAreaSelectorActive) {
        disablePostalCodeClicks();
    } else {
        enablePostalCodeClicks();
    }
    updatePathStyles(isAreaSelectorActive);
    updatePathMouseover(isAreaSelectorActive);
}

function startLassoSelection(e) {
    // console.log('Start Lasso');
    if (!isAreaSelectorActive) return;
    e.preventDefault();
    const point = getLassoSVGPoint(e.clientX, e.clientY);
    selectionPoints = [point];
}

function updateLassoSelection(e) {
    if (!isAreaSelectorActive || selectionPoints.length === 0) return;
    e.preventDefault();
    const point = getLassoSVGPoint(e.clientX, e.clientY);
    selectionPoints.push(point);
    drawLasso();
}

function getLassoSVGPoint(x, y) {
    const pt = svgElement.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svgElement.getScreenCTM().inverse());
}

function drawLasso() {
    let existingLasso = svgElement.querySelector('#lasso');
    if (existingLasso) existingLasso.remove();

    const lasso = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    lasso.setAttribute('id', 'lasso');
    lasso.setAttribute('points', selectionPoints.map(p => `${p.x},${p.y}`).join(' '));
    // Use mode color for lasso
    let color = '#ff0000'; // fallback
    if (currentMode === 'loading') {
        const loadingColorInput = document.getElementById('loading-color');
        if (loadingColorInput) color = loadingColorInput.value;
    } else if (currentMode === 'delivery') {
        const deliveryColorInput = document.getElementById('delivery-color');
        if (deliveryColorInput) color = deliveryColorInput.value;
    }
    lasso.setAttribute('fill', color + '22'); // 13% opacity
    lasso.setAttribute('stroke', color);
    lasso.setAttribute('stroke-width', '2');
    lasso.setAttribute('vector-effect', 'non-scaling-stroke');
    svgElement.appendChild(lasso);
    // Debug: draw the lasso polygon as well
    if (selectionPoints.length > 2) {
        drawPolygon(selectionPoints, color, 'debug-lasso-polygon');
        // Draw debug bbox around lasso using svgDebugUtils
        let minX = Math.min(...selectionPoints.map(p => p.x));
        let minY = Math.min(...selectionPoints.map(p => p.y));
        let maxX = Math.max(...selectionPoints.map(p => p.x));
        let maxY = Math.max(...selectionPoints.map(p => p.y));
        const bbox = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
        drawBBoxRect(bbox, '#ffa500', 'debug-lasso-bbox');
    } else {
        // Remove debug bbox if not enough points
        drawBBoxRect({x:0,y:0,width:0,height:0}, '#ffa500', 'debug-lasso-bbox');
    }
}

function selectLassoedPathsInSelection() {

    const paths = document.querySelectorAll('#map-container svg path');
    const selectCountries = document.getElementById('select-countries').checked;

    paths.forEach(path => {
        if (path.style.display === 'none') return;
        const parentGroup = path.closest('g');
        if (parentGroup && parentGroup.style.display === 'none') return;



        // Expand bbox by selectionSize
        let bbox = path.getBBox();
        bbox = {
            x: bbox.x - selectionSize,
            y: bbox.y - selectionSize,
            width: bbox.width + 2 * selectionSize,
            height: bbox.height + 2 * selectionSize
        };

        if (isBBoxInPolygon(bbox, selectionPoints)) {
            const isInSelection = isPathInSelection(path, selectionPoints);
            if (isInSelection) {

                const postalCode = path.id || 'Unknown';
                addToSelection(path, postalCode);
                path.classList.add('selected');
                path.style.filter = '';

                if (selectCountries && parentGroup) {
                    const country = parentGroup.id;
                    addAllPostalCodes(country, currentMode);
                }
            }
        }
    });

}

function clearLasso() {
    const lasso = svgElement.querySelector('#lasso');
    if (lasso) lasso.remove();
    selectionPoints = [];
}

function endLassoSelection(e) {
    if (!isAreaSelectorActive || selectionPoints.length === 0) return;
    e.preventDefault();
    const point = getLassoSVGPoint(e.clientX, e.clientY);
    selectionPoints.push(point);

    // If the user clicks without dragging, end the lasso
    if (selectionPoints.length === 2 && selectionPoints[0].x === selectionPoints[1].x && selectionPoints[0].y === selectionPoints[1].y) {
        clearLasso();
        return;
    }

    drawLasso();

    selectLassoedPathsInSelection();
    clearLasso();
    reloadSelectedPostalCodes(); // Add this line to reload selected postal codes after lasso selection
    // Remove debug points after a short delay
    setTimeout(() => {
        const debugGroup = svgElement.querySelector('#debug-points');
        if (debugGroup) {
            svgElement.removeChild(debugGroup);
        }
    }, 2000);

}


// New function to add to selection
function addToSelection(path, postalCode) {
    if (!path.classList.contains('selected') || !path.classList.contains(currentMode)) {
        addPostalCodeCallback(path, postalCode, currentMode, true); // Add 'true' to indicate it's from lasso
    }
}

// Set up dependencies for growSelection, so it can access selection logic and utility functions from this module
setGrowSelectionDeps({
    addToSelection,
    reloadSelectedPostalCodes
});

// Hook up the grow selection and clear debug polygons buttons
// (growSelection is now imported)
document.getElementById('grow-selection-button').addEventListener('click', growSelection);
document.getElementById('clear-expansion-button').addEventListener('click', clearAllDebugPolygons);

function clearAllDebugPolygons() {
    // Clear debug polygons and circles
    const debugElements = svgElement.querySelectorAll('[id^="debug-circle-"], #original-polygon, #expanded-polygon');
    debugElements.forEach(element => element.remove());
}
