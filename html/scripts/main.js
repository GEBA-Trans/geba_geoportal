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
            setupLookupButton();
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