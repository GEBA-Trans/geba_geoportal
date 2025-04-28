import { showError } from './main.js';
import { selectionSize } from './settings.js';
import { getPathPoints, isPointInPolygon } from './polygonUtils.js';

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
            };

            // Check bbox overlap
            const overlaps = !(
                bbox.x + bbox.width < selectionBBox.x ||
                bbox.x > selectionBBox.x + selectionBBox.width ||
                bbox.y + bbox.height < selectionBBox.y ||
                bbox.y > selectionBBox.y + selectionBBox.height
            );

            drawBBoxRect(
                { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
                overlaps ? 'green' : 'red',
                `debug-path-bbox-${idx}`
            );

            if (!overlaps) {
                return;
            }

            const { points } = getPathPoints(path, false);
            const targetExpandedPolygons = createExpandedPolygonCollection(points);

            targetExpandedPolygons.forEach((expandedPolygon, idx2) => {
                drawPolygon(expandedPolygon, 'rgba(255, 162, 0, 0.5)', `path-${path.id}-expanded-${idx2}`);
            });

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

    if (typeof reloadSelectedPostalCodes === 'function') reloadSelectedPostalCodes();
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
    const allPoints = [...polygon1, ...polygon2];
    return mergePointSetsToHull(allPoints);
}

function mergePointSetsToHull(points) {
    points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const mergeHulls = (hull1, hull2) => {
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
        return lower.concat(upper);
    };
    let mergedHull = [];
    for (let i = 0; i < points.length - 1; i++) {
        const pair = [points[i], points[i + 1]];
        const pairHull = mergeHulls(pair, []);
        mergedHull = mergeHulls(mergedHull, pairHull);
    }
    return mergedHull;
}

function drawPolygon(polygon, color, id) {
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

function createExpandedPolygonCollection(polygon, expansionDiameter = selectionSize) {
    const expandedPolygons = [];
    const expansionRadius = expansionDiameter * 2;
    polygon.forEach((point, index) => {
        const expandedPoints = [];
        for (let angle = 0; angle < 360; angle += 45) {
            const radians = (Math.PI / 180) * angle;
            const x = point.x + expansionRadius * Math.cos(radians);
            const y = point.y + expansionRadius * Math.sin(radians);
            expandedPoints.push({ x, y });
        }
        expandedPolygons.push(expandedPoints);
    });
    return expandedPolygons;
}

function drawBBoxRect(bbox, color, id) {
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

// These must be provided by the main script
let addToSelection, reloadSelectedPostalCodes;
export function setGrowSelectionDeps(deps) {
    addToSelection = deps.addToSelection;
    reloadSelectedPostalCodes = deps.reloadSelectedPostalCodes;
}
