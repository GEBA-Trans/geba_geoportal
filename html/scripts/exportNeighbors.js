import { growSelection } from './lasso.js';

export function exportPostalCodeNeighbors() {
    console.log('Starting exportPostalCodeNeighbors...');
    const paths = document.querySelectorAll('#map-container svg path');
    console.log(`Found ${paths.length} total paths.`);
    const visiblePaths = Array.from(paths).filter(path => path.style.display !== 'none');
    console.log(`Filtered to ${visiblePaths.length} visible paths.`);
    const neighborsMap = new Map();

    let processedCount = 0; // Counter to limit processing

    for (const path of visiblePaths) {
        if (!path.id) {
            console.warn('Skipping path without ID:', path);
            continue;
        }
        console.log(`Processing Path_ID: ${path.id}`);
        // highlightPostalCode(path); // Visual feedback for the current Path_ID
        const neighbors = findNeighbors(path, visiblePaths);
        console.log(`Found ${neighbors.length} neighbors for Path_ID: ${path.id}`);

        neighborsMap.set(path.id, neighbors);

        processedCount++;
        if (processedCount >= 5) {
            console.log('Debug limit reached. Stopping after 5 Path_IDs.');
            break; // Stop the loop after processing 5 Path_IDs
        }
    }

    const csvContent = generateCSV(neighborsMap);
    console.log('Generated CSV content:', csvContent);
    downloadCSV(csvContent, 'postal_code_neighbors.csv');
    console.log('CSV download triggered.');
}

function findNeighbors(targetPath, paths) {
    console.log(`Finding neighbors for Path_ID: ${targetPath.id}`);
    
    // Temporarily mark the target path as selected
    targetPath.classList.add('selected');
    
    // Use growSelection to expand the selection and find neighbors
    growSelection();

    // Collect neighbors based on the newly selected paths
    const neighbors = Array.from(document.querySelectorAll('#map-container svg path.selected'))
        .filter(path => path !== targetPath && path.id) // Exclude the target path and ensure the path has an ID
        .map(path => path.id);

    // Reset the selection state
    targetPath.classList.remove('selected');
    document.querySelectorAll('#map-container svg path.selected').forEach(path => {
        if (path !== targetPath) {
            path.classList.remove('selected');
        }
    });

    console.log(`Neighbors found for Path_ID ${targetPath.id}:`, neighbors);
    return neighbors;
}

function areBoundingBoxesAdjacent(bbox1, bbox2) {
    const isAdjacent = (
        bbox1.x < bbox2.x + bbox2.width &&
        bbox1.x + bbox1.width > bbox2.x &&
        bbox1.y < bbox2.y + bbox2.height &&
        bbox1.y + bbox1.height > bbox2.y
    );
    console.log(`Checking adjacency:`, { bbox1, bbox2, isAdjacent });
    return isAdjacent;
}

function highlightPostalCode(path) {
    console.log(`Highlighting Path_ID: ${path.id}`);
    const bbox = path.getBBox();
    const svg = path.ownerSVGElement;

    // Create horizontal crosshair
    const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    horizontalLine.setAttribute('x1', bbox.x);
    horizontalLine.setAttribute('y1', bbox.y + bbox.height / 2);
    horizontalLine.setAttribute('x2', bbox.x + bbox.width);
    horizontalLine.setAttribute('y2', bbox.y + bbox.height / 2);
    horizontalLine.setAttribute('stroke', 'red');
    horizontalLine.setAttribute('stroke-width', '2');
    horizontalLine.setAttribute('id', 'crosshair-horizontal');
    svg.appendChild(horizontalLine);

    // Create vertical crosshair
    const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    verticalLine.setAttribute('x1', bbox.x + bbox.width / 2);
    verticalLine.setAttribute('y1', bbox.y);
    verticalLine.setAttribute('x2', bbox.x + bbox.width / 2);
    verticalLine.setAttribute('y2', bbox.y + bbox.height);
    verticalLine.setAttribute('stroke', 'red');
    verticalLine.setAttribute('stroke-width', '2');
    verticalLine.setAttribute('id', 'crosshair-vertical');
    svg.appendChild(verticalLine);

    console.log(`Crosshairs added for Path_ID: ${path.id}`);

    // Remove crosshairs after 500ms
    setTimeout(() => {
        const horizontal = document.getElementById('crosshair-horizontal');
        const vertical = document.getElementById('crosshair-vertical');
        if (horizontal) horizontal.remove();
        if (vertical) vertical.remove();
        console.log(`Crosshairs removed for Path_ID: ${path.id}`);
    }, 500);
}

function generateCSV(neighborsMap) {
    console.log('Generating CSV...');
    const rows = [['Path_ID', 'Neighbors']];
    neighborsMap.forEach((neighbors, postalCode) => {
        rows.push([postalCode, neighbors.join(';')]);
    });

    const csvContent = rows.map(row => row.join(',')).join('\n');
    console.log('CSV content generated.');
    return csvContent;
}

function downloadCSV(content, filename) {
    console.log(`Downloading CSV as ${filename}...`);
    const blob = new Blob([content], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('CSV download completed.');
}

// Ensure the export button is hooked up correctly
document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.querySelector('.export-neighbors-button');
    if (exportButton) {
        console.log('Export button found. Adding click event listener.');
        exportButton.addEventListener('click', exportPostalCodeNeighbors);
    } else {
        console.error('Export button not found.');
    }
});
