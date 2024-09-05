import { loadSVG } from './mapLoader.js';
import { initializeZoomPan, setupZoomControls, setupPanning } from './zoomPan.js';
import { setupPostalCodeClicks, loadSelectedPostalCodes, setMode, togglePostalCode } from './postalCodeManager.js';
import { setupModeToggle, setupLookupButton, ensureControlsVisibility } from './uiSetup.js';
import { connectWebSocket } from './websocket.js';
import { setupLassoSelect } from './lasso.js';
import { initializeTruckGame } from './truckGame.js'; // Add this import

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
            setupLookupButton();
            initializeTruckGame(svgElement); // Add this line
            setMode('loading');
            return loadSelectedPostalCodes();
        })
        .then(() => {
            console.log('Postal codes loaded');
            ensureControlsVisibility();
        })
        .catch(error => console.error('Error initializing app:', error));
}

document.addEventListener('DOMContentLoaded', initializeApp);