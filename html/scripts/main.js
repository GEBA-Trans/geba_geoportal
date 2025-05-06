import { loadSVG } from './mapLoader.js';
import { initializeZoomPan, setupZoomControls, setupPanning, triggerZoomVisible } from './zoomPan.js';
import { setupPostalCodeClicks, loadSelectedPostalCodes, setMode, togglePostalCode, MODES, updatePostalCodeLists, clearAllPostalCodes, clearAllForMode } from './postalCodeManager.js';
import { setupModeToggle, setupLookupButton } from './uiSetup.js';
import { connectWebSocket } from './websocket.js';
import { setupLassoSelector } from './areaSelector.js';
import { initializeTooltips } from './tooltip.js';
import { populateRegionDropdown, handleRegionChange } from './regionManager.js';
import { exportPostalCodeNeighbours } from './exportNeighbours.js';

const MODE_COOKIE = 'enabledModes';
let enabledModes = [...MODES];

function saveEnabledModes() {
    document.cookie = `${MODE_COOKIE}=${JSON.stringify(enabledModes)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadEnabledModes() {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(`${MODE_COOKIE}=`));
    if (cookieValue) {
        try {
            enabledModes = JSON.parse(cookieValue.split('=')[1]);
        } catch (e) {
            enabledModes = [...MODES];
        }
    } else {
        enabledModes = [...MODES];
    }
}

function syncModeGroupToggle() {
    const modegroupToggle = document.getElementById('select-modegroup');
    const modegroupText = document.getElementById('select-modegroup-text');
    if (!modegroupToggle || !modegroupText) return;
    const isSelected = enabledModes.length === 1 && enabledModes[0] === 'selected';
    modegroupToggle.checked = isSelected;
    modegroupText.innerHTML = isSelected
        ? '<i class="fas fa-location-arrow"></i> Single Select'
        : '<i class="fas fa-map-signs"></i> Loading/Delivery';
}

function renderModeUI() {
    console.log('Rendering mode UI...');
    const modeToggle = document.getElementById('mode-toggle');
    modeToggle.innerHTML = '';
    const listsContainer = document.getElementById('postalcode-lists');
    listsContainer.innerHTML = '';
    enabledModes.forEach((mode, idx) => {
        const button = document.createElement('button');
        button.id = `${mode}-mode`;
        button.className = '';
        button.innerHTML = `${mode.charAt(0).toUpperCase() + mode.slice(1)}\n<input type="color" id="${mode}-color" value="${mode === 'loading' ? '#f1c40f' : mode === 'delivery' ? '#3498db' : '#a259f7'}" class="color-picker">`;
        modeToggle.appendChild(button);
    });
    enabledModes.forEach(mode => {
        const container = document.createElement('div');
        container.id = `${mode}-postalcodes`;
        const h2 = document.createElement('h2');
        h2.textContent = `${mode.charAt(0).toUpperCase() + mode.slice(1)} PostalCodes`;
        const ul = document.createElement('ul');
        ul.id = `${mode}-list`;
        container.appendChild(h2);
        container.appendChild(ul);
        listsContainer.appendChild(container);
    });
    // Set the first enabled mode as selected (active)
    console.log('Enabled modes:', enabledModes);
    if (enabledModes.length > 0) {
        setMode(enabledModes[0]);
        console.log(`Setting mode to: ${enabledModes[0]}`);
        const firstBtn = document.getElementById(`${enabledModes[0]}-mode`);
        if (firstBtn) firstBtn.classList.add('active');
    }
    console.log('Rendering mode UI with enabled modes:', enabledModes);
    import('./uiSetup.js').then(({ setupModeToggle }) => setupModeToggle());
    updatePostalCodeLists();
    syncModeGroupToggle();
}

function clearDisabledModesPostalCodes() {
    MODES.forEach(mode => {
        if (!enabledModes.includes(mode)) {
            console.log(`Clearing postal codes for disabled mode: ${mode}`);
            clearAllForMode(mode);
        }
    });
}

function initializeApp() {
    loadSVG()
        .then(({ svgElement, originalViewBox }) => {
            initializeZoomPan(svgElement, originalViewBox);
            connectWebSocket(); // Ensure WebSocket connection is established
            setupPostalCodeClicks();
            setupZoomControls();
            setupPanning();
            setupLassoSelector(svgElement, togglePostalCode);
            setupModeToggle();
            setupLookupButton();
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

    // Show debug overlays button only on localhost
    const debugBtn = document.getElementById('clear-svg-debug-overlays-button');
    if (debugBtn && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        debugBtn.style.display = 'inline-block';
    }

    loadEnabledModes();
    renderModeUI();
    // clearDisabledModesPostalCodes();

    // Lock icon logic (replaces gear icon logic)
    const lockBtn = document.getElementById('mode-settings-lock');
    const lockIcon = document.getElementById('mode-lock-icon');
    const modegroupPanel = document.getElementById('select-modegroup-container');
    const modegroupSwitch = document.getElementById('select-modegroup');
    if (lockBtn && lockIcon && modegroupPanel && modegroupSwitch) {
        lockBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isDisabled = modegroupSwitch.disabled;
            modegroupSwitch.disabled = !isDisabled;
            modegroupPanel.classList.toggle('disabled', !isDisabled);
            lockIcon.classList.toggle('fa-lock-open', isDisabled);
            lockIcon.classList.toggle('fa-lock', !isDisabled);
        });
    }

    const modegroupToggle = document.getElementById('select-modegroup');
    console.log('Mode group toggle:', modegroupToggle);
    if (modegroupToggle) {
        modegroupToggle.addEventListener('change', function() {
            if (modegroupToggle.checked) {
                enabledModes = ['selected'];
            } else {
                enabledModes = ['loading', 'delivery'];
            }
            saveEnabledModes();
            renderModeUI();
            clearDisabledModesPostalCodes();
        });
    }
    syncModeGroupToggle();
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
