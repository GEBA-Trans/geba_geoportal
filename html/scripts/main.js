import { loadSVG, toggleCountryVisibility } from './mapLoader.js';
import { initializeZoomPan, setupZoomControls, setupPanning, triggerZoomVisible } from './zoomPan.js';
import { setupPostalCodeClicks, loadSelectedPostalCodes, setMode, togglePostalCode } from './postalCodeManager.js';
import { setupModeToggle, setupLookupButton } from './uiSetup.js';
import { connectWebSocket } from './websocket.js';
import { setupLassoSelect } from './lasso.js';
import { initializeTooltips } from './tooltip.js';
import { populateRegionDropdown, handleRegionChange } from './regionManager.js';
import { exportPostalCodeneighbours } from './exportNeighbours.js';

async function loadRegionOptions() {
    try {
        const response = await fetch('data/regions.json');
        const regions = await response.json();
        const selectElement = document.getElementById('regions');

        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region.value;
            option.textContent = region.text;
            selectElement.appendChild(option);
        });

        selectElement.addEventListener('change', function() {
            if (this.value) {
                window.location.href = this.value;
            }
        });
    } catch (error) {
        console.error('Error loading region options:', error);
    }
}

function initializeApp() {
    loadSVG()
        .then(({ svgElement, originalViewBox }) => {
            initializeZoomPan(svgElement, originalViewBox);
            connectWebSocket(); // Ensure WebSocket connection is established
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
            // Initialize export functionality
            document.getElementById('export-neighbours-button').addEventListener('click', exportPostalCodeneighbours);
        })
        .catch(error => console.error('Error initializing app:', error));
}

function initializeTooltip(element, tooltipText, placement) {
    // console.log('Initializing tooltip:', element, tooltipText, placement);
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);

    const popperInstance = Popper.createPopper(element, tooltip, {
        placement: placement, // Use the placement value
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 8],
                },
            },
        ],
    });

    element.addEventListener('mouseenter', () => {
        // console.log('Mouse entered:', element);
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        popperInstance.update().then(() => {
            // console.log('Popper updated:', tooltip);
        });
    });

    element.addEventListener('mouseleave', () => {
        // console.log('Mouse left:', element);
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    });

    // Log to confirm event listeners are attached
    // console.log('Event listeners attached for:', element);
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
