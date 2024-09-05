import { loadSVG } from './mapLoader.js';
import { initializeZoomPan, setupZoomControls, setupPanning } from './zoomPan.js';
import { setupPostalCodeClicks, loadSelectedPostalCodes, setMode, togglePostalCode } from './postalCodeManager.js';
import { setupModeToggle, setupLookupButton, ensureControlsVisibility } from './uiSetup.js';
import { connectWebSocket } from './websocket.js';
import { setupLassoSelect } from './lasso.js';

function initializeApp() {
    loadSVG()
        .then(({ svgElement, originalViewBox }) => {
            initializeZoomPan(svgElement, originalViewBox);
            connectWebSocket();
            setupPostalCodeClicks();
            setupZoomControls();
            setupPanning();
            setupLassoSelect(svgElement, togglePostalCode);
            setupModeToggle();
            setupLookupButton(); // Add this line
            setMode('loading'); // Set initial mode
            setTimeout(loadSelectedPostalCodes, 1000);
            ensureControlsVisibility();
        })
        .catch(error => console.error('Error initializing app:', error));
}

document.addEventListener('DOMContentLoaded', initializeApp);