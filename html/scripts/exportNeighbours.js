import { growSelection } from './lasso.js';
import { sendToneighboursocket } from './websocket.js'; // Import the function to send data to the neighbor WebSocket

export function exportPostalCodeneighbours() {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        console.log('Starting exportPostalCodeneighbours...');
    }
    const paths = document.querySelectorAll('#map-container svg path');
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        console.log(`Found ${paths.length} total paths.`);
    }
    const visiblePaths = Array.from(paths).filter(path => path.style.display !== 'none');
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        console.log(`Filtered to ${visiblePaths.length} visible paths.`);
    }
    const neighboursMap = new Map();

    let processedCount = 0; // Counter to limit processing

    // Skip all paths until we reach "IT-53"
    let skip = false;
    for (const path of visiblePaths) {
        if (skip) {
            if (path.id === 'IT-53') {
                skip = false;
            } else {
                continue;
            }
        }
        if (!path.id) {
            if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                console.warn('Skipping path without ID:', path);
            }
            continue;
        }
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            console.log(`Processing Path_ID: ${path.id}`);
        }
        // highlightPostalCode(path); // Visual feedback for the current Path_ID
        const neighbours = findneighbours(path, visiblePaths);
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            console.log(`Found ${neighbours.length} neighbours for Path_ID: ${path.id}`);
        }

        // Post path.id and neighbours to the neighbor WebSocket
        const payload = { id: path.id, neighbours };
        sendToneighboursocket(payload);

        // processedCount++;
        // if (processedCount >= 50) {
        //     if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        //         console.log('Debug limit reached. Stopping after 5 Path_IDs.');
        //     }
        //     break; // Stop the loop after processing 5 Path_IDs
        // }
    }

    // const csvContent = generateCSV(neighboursMap);
    // if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    //     console.log('Generated CSV content:', csvContent);
    // }
    // downloadCSV(csvContent, 'postal_code_neighbours.csv');
    // if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    //     console.log('CSV download triggered.');
    // }
}

function findneighbours(targetPath, paths) {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        console.log(`Finding neighbours for Path_ID: ${targetPath.id}`);
    }

    // Temporarily mark the target path as selected
    targetPath.classList.add('selected');

    // Use growSelection to expand the selection
    growSelection();

    // Cache selected paths in a Set for faster filtering
    const selectedPaths = new Set(
        Array.from(document.querySelectorAll('#map-container svg path.selected'))
    );

    // Collect neighbours by filtering the Set
    const neighbours = Array.from(selectedPaths)
        .filter(path => path !== targetPath && path.id) // Exclude the target path and ensure the path has an ID
        .map(path => path.id);

    // Reset the selection state
    targetPath.classList.remove('selected');
    selectedPaths.forEach(path => path.classList.remove('selected'));

    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        console.log(`neighbours found for Path_ID ${targetPath.id}:`, neighbours);
    }
    return neighbours;
}


// Ensure the export button is hooked up correctly
document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('export-neighbours-button');
    if (exportButton) {
        console.log('Export button found. Adding click event listener.');
        exportButton.addEventListener('click', exportPostalCodeneighbours);
    } else {
        console.error('Export button not found.');
    }
});
