// Utility functions for drawing debug SVG shapes

export function drawPolygon(polygon, color, id) {
    if (!(location.hostname === 'localhost' || location.hostname === '127.0.0.1')) return;
    let existingPolygon = document.querySelector(`#${id}`);
    if (existingPolygon) existingPolygon.remove();
    const svgElement = document.querySelector('#map-container svg');
    const polygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygonElement.setAttribute('id', id);
    polygonElement.setAttribute('points', polygon.map(p => `${p.x},${p.y}`).join(' '));
    polygonElement.setAttribute('fill', color);
    polygonElement.setAttribute('stroke', '#000');
    polygonElement.setAttribute('stroke-width', '1');
    polygonElement.setAttribute('opacity', '0.5');
    svgElement.appendChild(polygonElement);
}

export function drawBBoxRect(bbox, color, id) {
    if (!(location.hostname === 'localhost' || location.hostname === '127.0.0.1')) return;
    let existingRect = document.querySelector(`#${id}`);
    if (existingRect) existingRect.remove();
    const svgElement = document.querySelector('#map-container svg');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('id', id);
    rect.setAttribute('x', bbox.x);
    rect.setAttribute('y', bbox.y);
    rect.setAttribute('width', bbox.width);
    rect.setAttribute('height', bbox.height);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', color);
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('stroke-dasharray', '4,2');
    svgElement.appendChild(rect);
}
