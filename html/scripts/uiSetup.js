import { setMode, MODES } from './postalCodeManager.js';
import { lookupCompanies } from './websocket.js';

export function setupModeToggle() {
    MODES.forEach(mode => {
        const button = document.getElementById(`${mode}-mode`);
        if (button) {
            button.addEventListener('click', () => setMode(mode));
        }
    });
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