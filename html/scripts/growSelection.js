import { showError } from './main.js';
import { selectionSize } from './settings.js';
import { getPathPoints, isPointInPolygon, mergePolygons, mergePointSetsToHull } from './polygonUtils.js';
import { drawPolygon, drawBBoxRect } from './svgDebugUtils.js';

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

// These must be provided by the main script
let addToSelection, reloadSelectedPostalCodes;
export function setGrowSelectionDeps(deps) {
    addToSelection = deps.addToSelection;
    reloadSelectedPostalCodes = deps.reloadSelectedPostalCodes;
}
