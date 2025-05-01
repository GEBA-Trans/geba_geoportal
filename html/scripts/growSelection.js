import { showError } from './main.js';
import { selectionSize } from './settings.js';
import { getPathPoints, isPointInPolygon, mergePolygons } from './polygonUtils.js';
import { drawPolygon, drawBBoxRect } from './svgDebugUtils.js';

// Expands the current selection by a configurable size, highlights expanded areas, and adds intersecting polygons to the selection.
export function growSelection() {
    const selectedPaths = Array.from(document.querySelectorAll('#map-container svg path.selected'));
    if (selectedPaths.length === 0) {
        showError('No selected polygons to expand. Please select an area first.');
        console.warn('DEV: No selected polygons to expand.');
        return;
    }

    // Keep track of all paths that are already selected to skip them
    const alreadySelected = new Set(selectedPaths.map(p => p.id));
    let anyNewSelected = false;

    selectedPaths.forEach((selectedPath, selectedIdx) => {
        const { points: selectedPoints } = getPathPoints(selectedPath);
        const expandedPolygonCollection = createExpandedPolygonCollection(selectedPoints);
        expandedPolygonCollection.forEach((expandedPolygon, index) => {
            drawPolygon(expandedPolygon, 'rgb(211, 15, 246)', `expanded-polygon-${selectedPath.id}-${index}`);
        });

        // Calculate the bounding box for all expanded polygons
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        expandedPolygonCollection.forEach(poly => {
            poly.forEach(p => {
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x);
                maxY = Math.max(maxY, p.y);
            });
        });
        const selectionBBox = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
        drawBBoxRect(selectionBBox, 'blue', `debug-selection-bbox-${selectedPath.id}`);

        // Check all map paths for intersection with expanded selection
        const paths = document.querySelectorAll('#map-container svg path');
        paths.forEach((path, idx) => {
            if (alreadySelected.has(path.id)) return; // Skip already selected paths
            if (path.style.display === 'none') return;
            const parentGroup = path.closest('g');
            if (parentGroup && parentGroup.style.display === 'none') return;

            // Expand the path's bounding box for intersection testing
            let bbox = path.getBBox();
            bbox = {
                x: bbox.x - 2 * selectionSize,
                y: bbox.y - 2 * selectionSize,
                width: bbox.width + 4 * selectionSize,
                height: bbox.height + 4 * selectionSize
            };
            const overlaps = !(
                bbox.x + bbox.width < selectionBBox.x ||
                bbox.x > selectionBBox.x + selectionBBox.width ||
                bbox.y + bbox.height < selectionBBox.y ||
                bbox.y > selectionBBox.y + selectionBBox.height
            );
            drawBBoxRect(bbox, overlaps ? 'green' : 'red', `debug-path-bbox-${selectedPath.id}-${idx}`);
            if (!overlaps) return;

            // Get the points of the current path and create expanded polygons
            const { points } = getPathPoints(path, false);
            const targetExpandedPolygons = createExpandedPolygonCollection(points);
            targetExpandedPolygons.forEach((expandedPolygon, idx2) => {
                drawPolygon(expandedPolygon, 'rgba(255, 162, 0, 0.5)', `path-${path.id}-expanded-${selectedPath.id}-${idx2}`);
            });
            // Check if any expanded polygon of the path intersects with the expanded selection
            const isInExpandedPolygon = expandedPolygonCollection.some(expandedPolygon =>
                targetExpandedPolygons.some(targetPolygon =>
                    targetPolygon.some(point => isPointInPolygon(point, expandedPolygon))
                )
            );
            if (isInExpandedPolygon) {
                const postalCode = path.id || 'Unknown';
                addToSelection(path, postalCode);
                path.classList.add('selected');
                alreadySelected.add(path.id); // Mark as selected to skip in future iterations
                anyNewSelected = true;
            }
        });
    });
    if (typeof reloadSelectedPostalCodes === 'function' && anyNewSelected) reloadSelectedPostalCodes();
}

// Returns the merged polygon of all currently selected paths, or null if none are selected.
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

// For each point in the input polygon, creates a polygon of points around it to simulate expansion.
function createExpandedPolygonCollection(polygon, expansionDiameter = selectionSize) {
    const expandedPolygons = [];
    const expansionRadius = expansionDiameter * 2;
    polygon.forEach(point => {
        const expandedPoints = [];
        for (let angle = 0; angle < 360; angle += 45) {
            const radians = (Math.PI / 180) * angle;
            expandedPoints.push({
                x: point.x + expansionRadius * Math.cos(radians),
                y: point.y + expansionRadius * Math.sin(radians)
            });
        }
        expandedPolygons.push(expandedPoints);
    });
    return expandedPolygons;
}

// These will be set by setGrowSelectionDeps
let addToSelection = () => {}, reloadSelectedPostalCodes = () => {};

// Sets the dependencies required by growSelection for selection management.
export function setGrowSelectionDeps(deps) {
    addToSelection = deps.addToSelection;
    reloadSelectedPostalCodes = deps.reloadSelectedPostalCodes;
}
