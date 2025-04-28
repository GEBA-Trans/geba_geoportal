import { disablePostalCodeClicks, enablePostalCodeClicks, addAllPostalCodes, reloadSelectedPostalCodes } from './postalCodeManager.js';
import { showError } from './main.js';
import { stepLength, selectionSize } from './settings.js';

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
    lassoButtonHandler = toggleSelector;
    lassoIndicatorHandler = toggleSelector;
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

function toggleSelector() {
    // console.log('Toggle Lasso');
    isAreaSelectorActive = !isAreaSelectorActive;

    // console.log('Lasso Active:', isLassoActive);
    const lassoButton = document.getElementById('lasso-button');
    const lassoStatus = document.getElementById('lasso-status');
    const lassoIndicator = document.getElementById('lasso-active-indicator');
    // Use class for icon color
    lassoButton.innerHTML = isAreaSelectorActive ? '<i class="fas fa-times icon-cancel"></i>' : '<i class="fas fa-highlighter"></i>';
    lassoButton.title = isAreaSelectorActive ? 'Cancel Lasso' : 'Lasso Select';

    // Use class for status visibility
    lassoStatus.classList.toggle('lasso-status-visible', isAreaSelectorActive);
    lassoStatus.classList.toggle('lasso-status-hidden', !isAreaSelectorActive);

    // Toggle lasso indicator visibility
    if (lassoIndicator) {
        lassoIndicator.style.display = isAreaSelectorActive ? 'block' : 'none';
    }

    const mapContainer = document.getElementById('map-container');
    mapContainer.classList.toggle('lasso-active', isAreaSelectorActive);
    mapContainer.classList.toggle('lasso-inactive', !isAreaSelectorActive);

    if (isAreaSelectorActive) {
        disablePostalCodeClicks(); // Disable clicks when lasso is active
        const paths = document.querySelectorAll('#map-container svg path');
        paths.forEach(path => {
            if (!path.classList.contains('selected')) {
                path.style.filter = 'grayscale(75%)';
            }
            path.classList.add('crosshair-cursor');
            path.addEventListener('mouseover', () => {
                if (isAreaSelectorActive) {
                    path.classList.add('crosshair-cursor');
                }
            });
        });

    } else {
        enablePostalCodeClicks(); // Enable clicks when lasso is inactive
        const paths = document.querySelectorAll('#map-container svg path');
        paths.forEach(path => {
            path.style.filter = '';
            path.classList.remove('crosshair-cursor');
        });
    }
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
}

function selectPathsInSelection() {

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
        }; // <-- BBOX: get the bounding box of the path and expand

        if (isBBoxInSelection(bbox)) {

            const isInSelection = isPathInSelection(path);

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
        } else {
        }
    });

}

function isBBoxInSelection(bbox) {
    const bboxPoints = [
        { x: bbox.x, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y },
        { x: bbox.x, y: bbox.y + bbox.height },
        { x: bbox.x + bbox.width, y: bbox.y + bbox.height }
    ];
    // <-- BBOX: check if any bbox corner is inside the lasso polygon
    return bboxPoints.some(point => isPointInPolygon(point, selectionPoints));
}

function isPathInSelection(path) {
    const { points } = getPathPoints(path);
    return points.some(point => isPointInPolygon(point, selectionPoints)) || isPointInPolygon(points[0], selectionPoints);
}

function getPathPoints(path, useSimplified = false) {
    const points = [];
    const dAttribute = useSimplified ? 'data-simplified-d' : 'd';
    const pathData = path.getAttribute(dAttribute);

    if (!pathData) {
        console.warn(`Path ${path.id} does not have a ${dAttribute} attribute.`);
        return { points, svg: path.ownerSVGElement };
    }

    const pathLength = path.getTotalLength();

    const svg = path.ownerSVGElement;
    for (let i = 0; i <= pathLength; i += stepLength) {
        const point = path.getPointAtLength(i);
        if (!points.some(p => p.x === point.x && p.y === point.y)) {
            points.push(point);
        }
    }
    return { points, svg };
}

export function isPointInPolygon(point, polygon) {
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

    selectPathsInSelection();
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

function getSelectionBoundingPolygon() {
    const selectedPaths = document.querySelectorAll('#map-container svg path.selected');
    if (selectedPaths.length === 0) return null;

    let mergedPolygon = [];

    selectedPaths.forEach(path => {
        const { points } = getPathPoints(path);
        mergedPolygon = mergePolygons(mergedPolygon, points);
    });

    return mergedPolygon;
}

function mergePolygons(polygon1, polygon2) {
    if (polygon1.length === 0) return polygon2;
    if (polygon2.length === 0) return polygon1;

    // Simple merging logic (convex hull)
    const allPoints = [...polygon1, ...polygon2];


    return mergePointSetsToHull(allPoints);
}

function mergePointSetsToHull(points) {

    // Sort points by x-coordinate (and y-coordinate as a tiebreaker)
    points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
    console.log('Points sorted:', points);

    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

    const mergeHulls = (hull1, hull2) => {
        console.log('Merging hulls:', hull1, hull2);
        const allPoints = [...hull1, ...hull2];
        allPoints.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

        const lower = [];
        for (const point of allPoints) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
                lower.pop();
            }
            lower.push(point);
        }

        const upper = [];
        for (let i = allPoints.length - 1; i >= 0; i--) {
            const point = allPoints[i];
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
                upper.pop();
            }
            upper.push(point);
        }

        upper.pop();
        lower.pop();
        const merged = lower.concat(upper);
        console.log('Merged hull:', merged);
        return merged;
    };

    let mergedHull = [];
    for (let i = 0; i < points.length - 1; i++) {
        const pair = [points[i], points[i + 1]];
        console.log(`Processing pair: ${i}`, pair);
        const pairHull = mergeHulls(pair, []); // Compute hull for the pair
        console.log(`Hull for pair ${i}:`, pairHull);
        mergedHull = mergeHulls(mergedHull, pairHull); // Merge with the existing hull
        console.log(`Merged hull after pair ${i}:`, mergedHull);
    }

    console.log('Final merged hull:', mergedHull);
    return mergedHull;
}

function drawPolygon(polygon, color, id) {

    if (!(location.hostname === 'localhost' || location.hostname === '127.0.0.1')) return;

    let existingPolygon = svgElement.querySelector(`#${id}`);
    if (existingPolygon) existingPolygon.remove();

    const polygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygonElement.setAttribute('id', id);
    polygonElement.setAttribute('points', polygon.map(p => `${p.x},${p.y}`).join(' '));
    polygonElement.setAttribute('fill', color);
    polygonElement.setAttribute('stroke', '#000');
    polygonElement.setAttribute('stroke-width', '1');
    polygonElement.setAttribute('opacity', '0.5');
    svgElement.appendChild(polygonElement);
}

export function growSelection() {
    const mergedPolygon = getSelectionBoundingPolygon();
    if (!mergedPolygon) {
        showError('No selected polygons to expand. Please select an area first.');
        console.warn('DEV: No selected polygons to expand.');
        return;
    }

    const expandedPolygonCollection = createExpandedPolygonCollection(mergedPolygon);
    expandedPolygonCollection.forEach((expandedPolygon, index) => {
        drawPolygon(expandedPolygon, 'rgb(211, 15, 246)', `expanded-polygon-${index}`);
    });

    // Compute the overall bbox for all expanded polygons
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    expandedPolygonCollection.forEach(poly => {
        poly.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
        });
    });
    // Expand selectionBBox by selectionSize
    const selectionBBox = {
        x: minX ,
        y: minY ,
        width: (maxX - minX) ,
        height: (maxY - minY)
    };
    // Draw the selection bbox in blue
    drawBBoxRect(selectionBBox, 'blue', 'debug-selection-bbox');

    const paths = document.querySelectorAll('#map-container svg path');

    paths.forEach((path, idx) => {
        if (!path.classList.contains('selected')) {
            if (path.style.display === 'none') return;
            const parentGroup = path.closest('g');
            if (parentGroup && parentGroup.style.display === 'none') return;

            // Expand bbox by double selectionSize to get the expanded bbox
            let bbox = path.getBBox();
            bbox = {
                x: bbox.x - 2 * selectionSize,
                y: bbox.y - 2 * selectionSize,
                width: bbox.width + 4 * selectionSize,
                height: bbox.height + 4 * selectionSize
            }; // <-- BBOX: get the bounding box of the path and expand

            // Check bbox overlap
            const overlaps = !(
                bbox.x + bbox.width < selectionBBox.x ||
                bbox.x > selectionBBox.x + selectionBBox.width ||
                bbox.y + bbox.height < selectionBBox.y ||
                bbox.y > selectionBBox.y + selectionBBox.height
            ); // <-- BBOX: compare path bbox to selection bbox

            // Draw the path's bbox: green if overlapping, red if not
            drawBBoxRect(
                { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
                overlaps ? 'green' : 'red',
                `debug-path-bbox-${idx}`
            );

            // Quickly exclude paths outside the expanded polygon's bounding box
            if (!overlaps) {
                return;
            }

            const { points } = getPathPoints(path, false); // Use simplified paths for targets

            // Expand the target path's polygon
            const targetExpandedPolygons = createExpandedPolygonCollection(points);

            // Draw the expanded polygons for debugging (optional)
            targetExpandedPolygons.forEach((expandedPolygon, idx2) => {
                drawPolygon(expandedPolygon, 'rgba(255, 162, 0, 0.5)', `path-${path.id}-expanded-${idx2}`);
            });

            // Check if any expanded polygon of the path intersects with any expanded selection polygon
            const isInExpandedPolygon = expandedPolygonCollection.some(expandedPolygon =>
                targetExpandedPolygons.some(targetPolygon =>
                    targetPolygon.some(point => isPointInPolygon(point, expandedPolygon))
                )
            );

            if (isInExpandedPolygon) {
                const postalCode = path.id || 'Unknown';
                addToSelection(path, postalCode);
                path.classList.add('selected');
            }
        }
    });

    reloadSelectedPostalCodes(); // Update the selection display

}

function createExpandedPolygonCollection(polygon, expansionDiameter = selectionSize) {
    // Create an array of expanded polygons
    const expandedPolygons = [];
    const expansionRadius = expansionDiameter * 2; // Use half the diameter for radius
    console.log('Expansion radius:', expansionRadius);
    polygon.forEach((point, index) => {
        const expandedPoints = [];

        // Generate points around the current point in a circular pattern
        for (let angle = 0; angle < 360; angle += 45) { // Adjust step size for smoother circles
            const radians = (Math.PI / 180) * angle;
            const x = point.x + expansionRadius * Math.cos(radians);
            const y = point.y + expansionRadius * Math.sin(radians);
            expandedPoints.push({ x, y });
        }
        expandedPolygons.push(expandedPoints);
    });


    return expandedPolygons;
}


// Helper to draw a bounding box rectangle for debugging
function drawBBoxRect(bbox, color, id) {

    // Only draw when running on localhost
    if (!(location.hostname === 'localhost' || location.hostname === '127.0.0.1')) return;

    // Remove existing rect with same id
    let existingRect = svgElement.querySelector(`#${id}`);
    if (existingRect) existingRect.remove();

    // Expand bbox by selectionSize for debug drawing as well
    const expandedBBox = {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height
    };

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('id', id);
    rect.setAttribute('x', expandedBBox.x);
    rect.setAttribute('y', expandedBBox.y);
    rect.setAttribute('width', expandedBBox.width);
    rect.setAttribute('height', expandedBBox.height);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', color);
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('stroke-dasharray', '4,2');
    svgElement.appendChild(rect);
}

// Hook up the grow selection and clear debug polygons buttons
document.getElementById('grow-selection-button').addEventListener('click', growSelection);
document.getElementById('clear-expansion-button').addEventListener('click', clearAllDebugPolygons);

function clearAllDebugPolygons() {
    // Clear debug polygons and circles
    const debugElements = svgElement.querySelectorAll('[id^="debug-circle-"], #original-polygon, #expanded-polygon');
    debugElements.forEach(element => element.remove());
}
