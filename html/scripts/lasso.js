export let isLassoActive = false;

let lassoPoints = [];
let svgElement;
let togglePostalCodeCallback;

export function setupLassoSelect(svg, togglePostalCodeFunc) {
    svgElement = svg;
    togglePostalCodeCallback = togglePostalCodeFunc;
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
    const lassoStatus = document.getElementById('lasso-status');
    lassoButton.innerHTML = isLassoActive ? '<i class="fas fa-times" style="color: red;"></i>' : '<i class="fas fa-draw-polygon"></i>';
    lassoButton.title = isLassoActive ? 'Cancel Lasso' : 'Lasso Select';

    // Show or hide the lasso status message
    lassoStatus.style.display = isLassoActive ? 'flex' : 'none';

    // Apply grayscale to unselected postal codes
    if (isLassoActive) {
        const paths = document.querySelectorAll('#map-container svg path');
        paths.forEach(path => {
            if (!path.classList.contains('selected')) {
                path.style.filter = 'grayscale(75%)';
            }
        });
    } else {
        // Remove grayscale filter when lasso is inactive
        const paths = document.querySelectorAll('#map-container svg path');
        paths.forEach(path => {
            path.style.filter = '';
        });
    }
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
    paths.forEach(path => {
        const isInLasso = isPathInLasso(path);
        if (isInLasso) {
            const postalCode = path.id || 'Unknown';
            togglePostalCodeCallback(path, postalCode);
            path.classList.add('selected'); // Ensure selected paths are marked
            path.style.filter = ''; // Remove grayscale for selected paths
        }
    });
}

function isPathInLasso(path) {
    const pathPoints = getPathPoints(path);
    return pathPoints.some(point => isPointInPolygon(point, lassoPoints));
}

function getPathPoints(path) {
    const points = [];
    const pathLength = path.getTotalLength();
    const step = pathLength / 4; // Adjust this number to balance accuracy and performance
    console.log('Path Length:', pathLength); // Debug: log the total length of the path
    console.log('Step Size:', step); // Debug: log the step size for point sampling
    for (let i = 0; i <= pathLength; i += step) {
        const point = path.getPointAtLength(i);
        // Check if the point is already in the array
        if (!points.some(p => p.x === point.x && p.y === point.y)) {
            points.push(point);
            console.log(`Point ${i}:`, point); // Debug: log each sampled point
        }
    }
    console.log('Total Points Collected:', points.length); // Debug: log the total number of points collected
    return points;
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
    drawLasso();
    selectPathsInLasso();
    clearLasso();
    // toggleLasso();
}

function debugLasso() {
    // console.log('Lasso Points:', lassoPoints);
    // console.log('SVG Element:', svgElement);
    const lasso = svgElement.querySelector('#lasso');
    // console.log('Lasso Element:', lasso);
    if (lasso) {
        // console.log('Lasso Attributes:', lasso.attributes);
    }
}