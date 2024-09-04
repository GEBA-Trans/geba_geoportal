let isLassoActive = false;
let lassoPoints = [];
let svgElement;
let togglePostalCodeCallback;

function setupLassoSelect(svg, togglePostalCodeFunc) {
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
            togglePostalCodeCallback(path, postalCode);
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

export { setupLassoSelect };