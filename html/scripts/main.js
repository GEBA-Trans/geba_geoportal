import { loadSVG, toggleCountryVisibility } from './mapLoader.js';
import { initializeZoomPan, setupZoomControls, setupPanning, triggerZoomVisible } from './zoomPan.js';
import { setupPostalCodeClicks, loadSelectedPostalCodes, setMode, togglePostalCode } from './postalCodeManager.js';
import { setupModeToggle, setupLookupButton } from './uiSetup.js';
import { connectWebSocket } from './websocket.js';
import { setupLassoSelect } from './lasso.js';

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

async function populateRegionDropdown() {
    try {
        const response = await fetch('data/regions.json');
        const regions = await response.json();
        const select = document.getElementById('regions');

        // Clear existing options
        select.innerHTML = '';

        regions.forEach(item => {
            if (item.optgroup) {
                // Create an optgroup
                const optgroup = document.createElement('optgroup');
                optgroup.label = item.optgroup;
                
                item.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    // Store countries data as a data attribute
                    if (option.countries) {
                        optionElement.dataset.countries = JSON.stringify(option.countries);
                    }
                    optgroup.appendChild(optionElement);
                });
                
                select.appendChild(optgroup);
            } else {
                // Create a regular option
                const option = document.createElement('option');
                option.value = item.value;
                option.textContent = item.text;
                select.appendChild(option);
            }
        });

        // Set the initial selected option based on the current URL
        const urlParams = new URLSearchParams(window.location.search);
        const currentMap = urlParams.get('map');
        // if (currentMap) {
        //     const value = `/?map=${currentMap}`;
        //     select.value = value;
        //     handleRegionChange(select.selectedOptions[0]);
        // }

        // Add event listener to handle selection change
        select.addEventListener('change', (event) => {
            const selectedOption = event.target.selectedOptions[0];
            handleRegionChange(selectedOption);
        });
    } catch (error) {
        console.error('Error populating region dropdown:', error);
    }
}

function handleRegionChange(selectedOption) {
    if (!selectedOption) return;

    // Get the current map from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentMap = urlParams.get('map');
    
    // Get the selected map value (strip the "/?map=" prefix)
    const selectedMap = selectedOption.value.replace('/?map=', '');

    // Only redirect if the map is actually different
    if (selectedMap && selectedMap !== currentMap && !selectedOption.dataset.countries) {
        window.location.href = selectedOption.value;
        return;
    }

    // Otherwise, just toggle the countries without page reload
    const countries = selectedOption.dataset.countries ? 
        JSON.parse(selectedOption.dataset.countries) : [];

    // Get all country toggles
    const countryToggles = document.querySelectorAll('.country-item input[type="checkbox"]');
    
    // Toggle countries based on selection
    countryToggles.forEach(toggle => {
        const countryItem = toggle.closest('.country-item');
        const countryName = countryItem.querySelector('span').textContent;
        
        // Check if the country should be visible for this region
        const shouldBeVisible = countries.length === 0 || 
            countries.some(c => countryName.toLowerCase().includes(c.toLowerCase()));
        
        // Only toggle if the state is different
        if (toggle.checked !== shouldBeVisible) {
            toggle.checked = shouldBeVisible;
            toggleCountryVisibility(countryName, shouldBeVisible);
        }
    });

    // Trigger zoom to visible after toggling the region
    triggerZoomVisible();
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
            console.log('Postal codes loaded');
            // ensureControlsVisibility();
        })
        .catch(error => console.error('Error initializing app:', error));
}

function initializeTooltip(element, tooltipText, placement) {
    console.log('Initializing tooltip:', element, tooltipText, placement);
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
        console.log('Mouse entered:', element);
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        popperInstance.update().then(() => {
            console.log('Popper updated:', tooltip);
        });
    });

    element.addEventListener('mouseleave', () => {
        console.log('Mouse left:', element);
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    });

    // Log to confirm event listeners are attached
    console.log('Event listeners attached for:', element);
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
    const tooltipElements = [
        { element: document.getElementById('country-count'), tooltipText: 'Click to add individual countries', placement: 'top' },
        { element: document.getElementById('region-label'), tooltipText: 'Region Label Tooltip', placement: 'bottom' },
        { element: document.getElementById('lookup-button'), tooltipText: 'Lookup in Mitoz', placement: 'top' },
        { element: document.getElementById('zoom-controls'), tooltipText: 'zoom-controls', placement: 'top' },
        { element: document.getElementById('lasso-active-indicator'), tooltipText: 'lasso-active-indicator', placement: 'bottom' },
        { element: document.getElementById('zoom-in'), tooltipText: 'zoom up', placement: 'top' },
        { element: document.getElementById('zoom-factor'), tooltipText: 'Increase zoom', placement: 'top' }
    ];

    tooltipElements.forEach(({ element, tooltipText, placement }) => {
        console.log('Initializing tooltip for element:', element);
        initializeTooltip(element, tooltipText, placement);
    });

    // Add event listener to close the lookup results
    document.querySelector('#lookup-results .lookup-close-btn').addEventListener('click', function() {
        document.getElementById('lookup-results').style.display = 'none';
    });
});
