import { loadSVG } from './mapLoader.js';
import { initializeZoomPan, setupZoomControls, setupPanning, triggerZoomVisible } from './zoomPan.js';
import { setupPostalCodeClicks, loadSelectedPostalCodes, setMode, togglePostalCode } from './postalCodeManager.js';
import { setupModeToggle, setupLookupButton } from './uiSetup.js';
import { connectWebSocket } from './websocket.js';
import { setupAreaSelector } from './areaSelector.js';
import { initializeTooltips } from './tooltip.js';
import { populateRegionDropdown, handleRegionChange } from './regionManager.js';
import { exportPostalCodeNeighbours } from './exportNeighbours.js';

function initializeApp() {
    loadSVG()
        .then(({ svgElement, originalViewBox }) => {
            initializeZoomPan(svgElement, originalViewBox);
            connectWebSocket(); // Ensure WebSocket connection is established
            setupPostalCodeClicks();
            setupZoomControls();
            setupPanning();
            setupAreaSelector(svgElement, togglePostalCode);
            setupModeToggle();
            setupLookupButton();
            setMode('loading');
            return loadSelectedPostalCodes();
        })
        .then(() => {
            // Initialize export functionality
            document.getElementById('export-neighbours-button').addEventListener('click', exportPostalCodeNeighbours);
        })
        .catch(error => {
            if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                console.error('Error initializing app:', error);
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    populateRegionDropdown();

    // Move the select-countries event listener here
    document.getElementById('select-countries').addEventListener('change', function() {
        const selectModeText = document.getElementById('select-mode-text');
        if (this.checked) {
            selectModeText.innerHTML = '<i class="fas fa-globe"></i> Selecting Countries';
        } else {
            selectModeText.innerHTML = '<i class="fas fa-map-marker-alt"></i> Selecting Postal Codes';
        }
    });

    // Add event listener to toggle the visibility of the country list
    document.getElementById('country-count').addEventListener('click', function() {
        const countryList = document.getElementById('country-list');
        countryList.classList.toggle('visible');
    });

    // Initialize tooltips
    initializeTooltips();

    // Add event listener to close the lookup results
    document.querySelector('#lookup-results .lookup-close-btn').addEventListener('click', function() {
        document.getElementById('lookup-results').style.display = 'none';
    });
});

// Global error display utility
export function showError(message, timeout = 5000) {
    const errorBar = document.getElementById('global-error');
    const errorMsg = document.getElementById('global-error-message');
    if (!errorBar || !errorMsg) return;
    errorMsg.textContent = message;
    errorBar.style.display = 'block';
    // Hide on click
    errorBar.onclick = () => { errorBar.style.display = 'none'; };
    // Auto-hide after timeout
    if (timeout > 0) {
        setTimeout(() => { errorBar.style.display = 'none'; }, timeout);
    }
}
