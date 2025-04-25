import { disablePostalCodeClicks, enablePostalCodeClicks, addAllPostalCodes, reloadSelectedPostalCodes } from './postalCodeManager.js';

export let isLassoActive = false;

// Add these variables at the top of the file
let debugCounters = {
    lassoPoints: 0,
    pathsChecked: 0,
    pathsSelected: 0,
    timeTaken: 0
};


let currentMode; // Add this line to keep track of the current mode
let lassoPoints = [];
let svgElement;
let addPostalCodeCallback;
const stepLength = 6 // Adjust this value to control the number of points 
const selectionSize = 3;





export function setupLassoSelect(svg, addPostalCodeFunc) {
    svgElement = svg;
    addPostalCodeCallback = addPostalCodeFunc;
    const lassoButton = document.getElementById('lasso-button');
    const lassoIndicatorButton = document.getElementById('lasso-active-indicator');
    lassoButton.addEventListener('click', toggleLasso);
    lassoIndicatorButton.addEventListener('click', toggleLasso);

    svgElement.addEventListener('mousedown', startLasso);
    svgElement.addEventListener('mousemove', updateLasso);
    document.addEventListener('mouseup', endLasso);
}

// Add this new function to set the current mode
export function setLassoMode(mode) {
    currentMode = mode;
}

function toggleLasso() {
    // console.log('Toggle Lasso');
    isLassoActive = !isLassoActive;

    // console.log('Lasso Active:', isLassoActive);
    const mapContainer = document.getElementById('map-container');
    mapContainer.classList.toggle('lasso-active', isLassoActive);

    const lassoActiveIndicator = document.getElementById('lasso-active-indicator');
    lassoActiveIndicator.style.display = isLassoActive ? 'block' : 'none';

    // Change cursor and background color based on lasso state
    if (isLassoActive) {
        disablePostalCodeClicks();
        mapContainer.style.cursor = 'crosshair'; // Cursor for lasso active
        mapContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // Change background color
    } else {
        enablePostalCodeClicks();
        mapContainer.style.cursor = 'grab'; // Cursor for pan hand when lasso is not active
        mapContainer.style.backgroundColor = ''; // Reset background color
    }

    const lassoButton = document.getElementById('lasso-button');
    const lassoStatus = document.getElementById('lasso-status');
    lassoButton.innerHTML = isLassoActive ? '<i class="fas fa-times" style="color: red;"></i>' : '<i class="fas fa-highlighter"></i>';
    lassoButton.title = isLassoActive ? 'Cancel Lasso' : 'Lasso Select';

    lassoStatus.style.display = isLassoActive ? 'flex' : 'none';

    if (isLassoActive) {
        const paths = document.querySelectorAll('#map-container svg path');
        paths.forEach(path => {
            if (!path.classList.contains('selected')) {
                path.style.filter = 'grayscale(75%)';
            }
            path.style.cursor = 'crosshair'; // Ensure cursor remains crosshair
            path.addEventListener('mouseover', () => {
                if (isLassoActive) {
                    path.style.cursor = 'crosshair'; // Ensure cursor remains crosshair on hover
                }
            });
        });
        debugCounters.timeTaken = 0; // Reset timeTaken when activating lasso
        showDebugCounters();
    } else {
        const paths = document.querySelectorAll('#map-container svg path');
        paths.forEach(path => {
            path.style.filter = '';
            path.style.cursor = ''; // Reset cursor
        });
        hideDebugCounters();
    }
}

function startLasso(e) {
    // console.log('Start Lasso');
    if (!isLassoActive) return;
    e.preventDefault();
    const point = getSVGPoint(e.clientX, e.clientY);
    lassoPoints = [point];
    lassoStartTime = performance.now(); // Record the start time
    debugCounters.lassoPoints = 1;
    updateDebugCounters();
}

function updateLasso(e) {
    if (!isLassoActive || lassoPoints.length === 0) return;
    e.preventDefault();
    const point = getSVGPoint(e.clientX, e.clientY);
    lassoPoints.push(point);
    debugCounters.lassoPoints = lassoPoints.length;
    updateDebugCounters();
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

    const lasso = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    lasso.setAttribute('id', 'lasso');
    lasso.setAttribute('points', lassoPoints.map(p => `${p.x},${p.y}`).join(' '));
    lasso.setAttribute('fill', 'rgba(255, 0, 0, 0.1)'); // Red fill with 10% opacity
    lasso.setAttribute('stroke', '#ff0000'); // Bright red stroke
    lasso.setAttribute('stroke-width', '2');
    lasso.setAttribute('vector-effect', 'non-scaling-stroke');
    svgElement.appendChild(lasso);
}

function selectPathsInLasso() {

    const paths = document.querySelectorAll('#map-container svg path');
    debugCounters.pathsChecked = 0;
    debugCounters.pathsSelected = 0;
    const selectCountries = document.getElementById('select-countries').checked;

    paths.forEach(path => {
        if (path.style.display === 'none') return;
        const parentGroup = path.closest('g');
        if (parentGroup && parentGroup.style.display === 'none') return;

        debugCounters.pathsChecked++;

        // Expand bbox by selectionSize
        let bbox = path.getBBox();
        bbox = {
            x: bbox.x - selectionSize,
            y: bbox.y - selectionSize,
            width: bbox.width + 2 * selectionSize,
            height: bbox.height + 2 * selectionSize
        }; // <-- BBOX: get the bounding box of the path and expand

        if (isBBoxInLasso(bbox)) { // <-- BBOX: compare bbox corners to lasso polygon

            const isInLasso = isPathInLasso(path);

            if (isInLasso) {
                debugCounters.pathsSelected++;
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

    updateDebugCounters(); // Update debug counters
}

function isBBoxInLasso(bbox) {
    const bboxPoints = [
        { x: bbox.x, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y },
        { x: bbox.x, y: bbox.y + bbox.height },
        { x: bbox.x + bbox.width, y: bbox.y + bbox.height }
    ];
    // <-- BBOX: check if any bbox corner is inside the lasso polygon
    return bboxPoints.some(point => isPointInPolygon(point, lassoPoints));
}

function isPathInLasso(path) {
    const { points } = getPathPoints(path);
    return points.some(point => isPointInPolygon(point, lassoPoints)) || isPointInPolygon(points[0], lassoPoints);
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

// Add this function to get the current zoom factor
function getZoomFactor() {
    const zoomFactorElement = document.getElementById('zoom-factor');
    if (zoomFactorElement) {
        const zoomText = zoomFactorElement.textContent;
        const zoomMatch = zoomText.match(/Zoom:\s*([\d.]+)x/);
        if (zoomMatch) {
            return parseFloat(zoomMatch[1]);
        }
    }
    return 1; // Default zoom factor
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
    lassoPoints = [];
}

function endLasso(e) {
    if (!isLassoActive || lassoPoints.length === 0) return;
    e.preventDefault();
    const point = getSVGPoint(e.clientX, e.clientY);
    lassoPoints.push(point);

    // If the user clicks without dragging, end the lasso
    if (lassoPoints.length === 2 && lassoPoints[0].x === lassoPoints[1].x && lassoPoints[0].y === lassoPoints[1].y) {
        clearLasso();
        return;
    }

    drawLasso();

    const endTime = performance.now();
    const timeTaken = endTime - lassoStartTime;
    debugCounters.timeTaken = timeTaken.toFixed(2); // Round to 2 decimal places

    selectPathsInLasso();
    updateDebugCounters(); // Update counters one last time
    clearLasso();
    reloadSelectedPostalCodes(); // Add this line to reload selected postal codes after lasso selection
    // Remove debug points after a short delay
    setTimeout(() => {
        const debugGroup = svgElement.querySelector('#debug-points');
        if (debugGroup) {
            svgElement.removeChild(debugGroup);
        }
    }, 2000);
    // Don't reset the timeTaken here

}

// Add this function to update the debug counters on screen
function updateDebugCounters() {
    let debugElement = document.getElementById('lasso-debug');
    if (!debugElement) {
        debugElement = document.createElement('div');
        debugElement.id = 'lasso-debug';
        debugElement.style.position = 'fixed';
        debugElement.style.top = '10px';
        debugElement.style.right = '10px';
        debugElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        debugElement.style.color = 'white';
        debugElement.style.padding = '10px';
        debugElement.style.borderRadius = '5px';
        debugElement.style.fontFamily = 'monospace';
        debugElement.style.zIndex = '1000';
        debugElement.style.cursor = 'pointer';
        document.body.appendChild(debugElement);

        // Add click event listener to hide debug counters
        debugElement.addEventListener('click', hideDebugCounters);
    }
    debugElement.innerHTML = `
        Lasso Points: ${debugCounters.lassoPoints}<br>
        Paths Checked: ${debugCounters.pathsChecked}<br>
        Paths Selected: ${debugCounters.pathsSelected}<br>
        Time Taken: ${debugCounters.timeTaken || '0.00'} ms<br>
        (Click to hide)
    `;
}

// Add this variable at the top of the file
let lassoStartTime;

function showDebugCounters() {
    const debugElement = document.getElementById('lasso-debug');
    if (debugElement) {
        debugElement.style.display = 'block';
    } else {
        updateDebugCounters();
    }
}

function hideDebugCounters() {
    const debugElement = document.getElementById('lasso-debug');
    if (debugElement) {
        debugElement.style.display = 'none';
    }
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


    return computeConvexHull(allPoints);
}















function computeConvexHull(points) {

    // return points; // Placeholder for the actual convex hull algorithm


    // console.log('Starting computeConvexHull with points:', points);

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
    const mergedPolygon = getSelectionBoundingPolygon(); // Use original polygon for selection
    if (!mergedPolygon) {
        console.warn('No selected polygons to expand.');
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
    let pathsChecked = 0;
    let pathsSelected = 0;

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

            pathsChecked++;
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
                pathsSelected++;
                const postalCode = path.id || 'Unknown';
                addToSelection(path, postalCode);
                path.classList.add('selected');
            }
            pathsChecked++;
        }
    });

    // Update debug counters
    debugCounters.pathsChecked = pathsChecked;
    debugCounters.pathsSelected = pathsSelected;
    updateDebugCounters(); // Refresh the lasso-debug div

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
