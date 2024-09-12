import { setMode } from './postalCodeManager.js';
import { lookupCompanies } from './websocket.js';

export function setupModeToggle() {
    const loadingButton = document.getElementById('loading-mode');
    const deliveryButton = document.getElementById('delivery-mode');

    loadingButton.addEventListener('click', () => setMode('loading'));
    deliveryButton.addEventListener('click', () => setMode('delivery'));
}

export function setupLookupButton() {
    const lookupButton = document.getElementById('lookup-button');
    lookupButton.addEventListener('click', lookupCompanies);
}

// export function ensureControlsVisibility() {
//     const controls = document.getElementById('controls');
//     if (controls) {
//         controls.style.display = 'block';
//         controls.style.zIndex = '1000';
//     }
// }