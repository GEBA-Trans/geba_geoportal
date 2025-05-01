import { showError } from './main.js';
import { selectionSize } from './settings.js';
import { getPathPoints, isPointInPolygon, mergePolygons } from './polygonUtils.js';
import { drawPolygon, drawBBoxRect } from './svgDebugUtils.js';
import { getSelectedPostalCodes } from './postalCodeManager.js';
import { setMode } from './postalCodeManager.js';

// Expands the current selection by a configurable size, highlights expanded areas, and adds intersecting polygons to the selection.
export function growSelection() {
    // Determine active and other mode
    const isLoadingMode = document.getElementById('loading-mode')?.classList.contains('active');
    const activeMode = isLoadingMode ? 'loading' : 'delivery';
    const otherMode = isLoadingMode ? 'delivery' : 'loading';

    // Select all visible paths in the current mode if none are selected
    let selectedPaths = Array.from(document.querySelectorAll(`#map-container svg path.selected.${activeMode}`));
    if (selectedPaths.length === 0) {
        // Select all visible paths in the current mode
        selectedPaths = Array.from(document.querySelectorAll(`#map-container svg path.${activeMode}`)).filter(path =>
            path.style.display !== 'none' &&
            (!path.closest('g') || path.closest('g').style.display !== 'none')
        );
        // Mark them as selected
        selectedPaths.forEach(path => {
            const postalCode = path.id || 'Unknown';
            addToSelection(path, postalCode);
            path.classList.add('selected', activeMode);
        });
    }
    if (selectedPaths.length === 0) {
        showError(`No postal codes are available in the current mode (${activeMode}) to expand.`);
        return;
    }

    // Set of already selected ids in the active mode
    const alreadySelected = new Set(selectedPaths.map(p => p.id));

    // Only consider as candidates: not already selected in active mode, not selected in other mode, and visible
    const candidatePaths = Array.from(document.querySelectorAll('#map-container svg path')).filter(path =>
        !alreadySelected.has(path.id) &&
        !(path.classList.contains('selected') && path.classList.contains(otherMode)) &&
        path.style.display !== 'none' &&
        (!path.closest('g') || path.closest('g').style.display !== 'none')
    );

    // Precompute expanded polygons for each selected path
    const expandedPolygonsBySelected = selectedPaths.map(selectedPath => {
        const { points } = getPathPoints(selectedPath);
        const expandedPolygonCollection = createExpandedPolygonCollection(points);
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
        drawBBoxRect({ x: minX, y: minY, width: maxX - minX, height: maxY - minY }, 'blue', `debug-selection-bbox-${selectedPath.id}`);
        return { selectedPath, expandedPolygonCollection };
    });

    // UI: indicator and controls
    const indicator = document.getElementById('grow-selection-indicator');
    const progressText = document.getElementById('grow-selection-progress');
    if (indicator) indicator.style.display = 'flex';
    const sidebar = document.getElementById('sidebar');
    const zoomControls = document.getElementById('zoom-controls');
    if (sidebar) sidebar.style.display = 'none';
    if (zoomControls) zoomControls.style.display = 'none';
    const batchSize = 10;
    let batchIndex = 0;
    const totalBatches = Math.ceil(candidatePaths.length / batchSize);

    function updateProgress() {
        if (progressText) {
            progressText.textContent = `Selected: ${alreadySelected.size} | Batch: ${Math.min(batchIndex / batchSize + 1, totalBatches)}/${totalBatches}`;
        }
    }
    updateProgress();

    function processBatch() {
        const batch = candidatePaths.slice(batchIndex, batchIndex + batchSize);
        batch.forEach((path, idx) => {
            let bbox = path.getBBox();
            bbox = {
                x: bbox.x - 2 * selectionSize,
                y: bbox.y - 2 * selectionSize,
                width: bbox.width + 4 * selectionSize,
                height: bbox.height + 4 * selectionSize
            };
            expandedPolygonsBySelected.forEach(({ expandedPolygonCollection, selectedPath }) => {
                // Compute selection bbox
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                expandedPolygonCollection.forEach(poly => {
                    poly.forEach(p => {
                        minX = Math.min(minX, p.x);
                        minY = Math.min(minY, p.y);
                        maxX = Math.max(maxX, p.x);
                        maxY = Math.max(maxY, p.y);
                    });
                });
                const selectionBBox = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
                // Fast AABB overlap
                const overlaps = !(
                    bbox.x + bbox.width < selectionBBox.x ||
                    bbox.x > selectionBBox.x + selectionBBox.width ||
                    bbox.y + bbox.height < selectionBBox.y ||
                    bbox.y > selectionBBox.y + selectionBBox.height
                );
                drawBBoxRect(bbox, overlaps ? 'green' : 'red', `debug-path-bbox-${selectedPath.id}-${batchIndex + idx}`);
                if (!overlaps) return;
                // Expanded polygons for candidate
                const { points } = getPathPoints(path, false);
                const targetExpandedPolygons = createExpandedPolygonCollection(points);
                targetExpandedPolygons.forEach((expandedPolygon, idx2) => {
                    drawPolygon(expandedPolygon, 'rgba(255, 162, 0, 0.5)', `path-${path.id}-expanded-${selectedPath.id}-${batchIndex + idx}-${idx2}`);
                });
                // Intersection test
                const isInExpandedPolygon = expandedPolygonCollection.some(expandedPolygon =>
                    targetExpandedPolygons.some(targetPolygon =>
                        targetPolygon.some(point => isPointInPolygon(point, expandedPolygon))
                    )
                );
                if (isInExpandedPolygon) {
                    // All selection/deselection logic is handled by addToSelection (from areaSelector.js), which calls into postalCodeManager.js
                    const postalCode = path.id || 'Unknown';
                    addToSelection(path, postalCode);
                    path.classList.add('selected', activeMode);
                    alreadySelected.add(path.id);
                }
            });
        });
        batchIndex += batchSize;
        updateProgress();
        if (typeof reloadSelectedPostalCodes === 'function') reloadSelectedPostalCodes();
        if (batchIndex < candidatePaths.length) {
            setTimeout(processBatch, 0);
        } else {
            if (indicator) indicator.style.display = 'none';
            if (sidebar) sidebar.style.display = '';
            if (zoomControls) zoomControls.style.display = '';
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
