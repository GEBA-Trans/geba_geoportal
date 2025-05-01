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
    const candidatePaths = [];
    const expandedPolygonsBySelected = [];

    // Precompute expanded polygons for each selected path
    selectedPaths.forEach(selectedPath => {
        const { points: selectedPoints } = getPathPoints(selectedPath);
        const expandedPolygonCollection = createExpandedPolygonCollection(selectedPoints);
        expandedPolygonsBySelected.push({ selectedPath, expandedPolygonCollection });
        // Draw debug polygons for each selected path
        expandedPolygonCollection.forEach((expandedPolygon, index) => {
            drawPolygon(expandedPolygon, 'rgb(211, 15, 246)', `expanded-polygon-${selectedPath.id}-${index}`);
        });
        // Draw debug bbox for the expanded area
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
    });

    // Collect all candidate paths (not already selected, visible)
    const allPaths = Array.from(document.querySelectorAll('#map-container svg path'));
    allPaths.forEach(path => {
        if (alreadySelected.has(path.id)) return;
        if (path.style.display === 'none') return;
        const parentGroup = path.closest('g');
        if (parentGroup && parentGroup.style.display === 'none') return;
        candidatePaths.push(path);
    });

    const batchSize = 10;
    let batchIndex = 0;
    let anyNewSelected = false;

    function processBatch() {
        const batch = candidatePaths.slice(batchIndex, batchIndex + batchSize);
        batch.forEach((path, idx) => {
            // Expand the path's bounding box for intersection testing
            let bbox = path.getBBox();
            bbox = {
                x: bbox.x - 2 * selectionSize,
                y: bbox.y - 2 * selectionSize,
                width: bbox.width + 4 * selectionSize,
                height: bbox.height + 4 * selectionSize
            };
            // Draw debug bbox for the candidate path
            // We'll color it green if it overlaps any expanded selection, red otherwise (updated below)
            let overlapsAny = false;
            for (const { expandedPolygonCollection, selectedPath } of expandedPolygonsBySelected) {
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
                // Fast AABB overlap
                const overlaps = !(
                    bbox.x + bbox.width < selectionBBox.x ||
                    bbox.x > selectionBBox.x + selectionBBox.width ||
                    bbox.y + bbox.height < selectionBBox.y ||
                    bbox.y > selectionBBox.y + selectionBBox.height
                );
                if (overlaps) overlapsAny = true;
                // Draw debug bbox for candidate path
                drawBBoxRect(bbox, overlaps ? 'green' : 'red', `debug-path-bbox-${selectedPath.id}-${batchIndex + idx}`);
                if (!overlaps) continue;
                // Get the points of the current path and create expanded polygons
                const { points } = getPathPoints(path, false);
                const targetExpandedPolygons = createExpandedPolygonCollection(points);
                // Draw debug polygons for the candidate path
                targetExpandedPolygons.forEach((expandedPolygon, idx2) => {
                    drawPolygon(expandedPolygon, 'rgba(255, 162, 0, 0.5)', `path-${path.id}-expanded-${selectedPath.id}-${batchIndex + idx}-${idx2}`);
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
                    alreadySelected.add(path.id);
                    anyNewSelected = true;
                    break; // No need to check other expanded polygons for this path
                }
            }
        });
        batchIndex += batchSize;
        if (typeof reloadSelectedPostalCodes === 'function') reloadSelectedPostalCodes();
        if (batchIndex < candidatePaths.length) {
            setTimeout(processBatch, 0); // Schedule next batch
        }
    }
    processBatch();
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
