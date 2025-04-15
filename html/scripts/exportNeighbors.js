import { growSelection } from './lasso.js';
import { sendToNeighborSocket } from './websocket.js'; // Import the function to send data to the neighbor WebSocket

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

        // Post path.id and neighbors to the neighbor WebSocket
        const payload = { id: path.id, neighbors };
        sendToNeighborSocket(payload);

        processedCount++;
        if (processedCount >= 50) {
            console.log('Debug limit reached. Stopping after 5 Path_IDs.');
            break; // Stop the loop after processing 5 Path_IDs
        }
    }

    // const csvContent = generateCSV(neighborsMap);
    // console.log('Generated CSV content:', csvContent);
    // downloadCSV(csvContent, 'postal_code_neighbors.csv');
    // console.log('CSV download triggered.');
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
