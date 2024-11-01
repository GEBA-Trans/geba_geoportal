const TOGGLE_STATES_COOKIE = 'countryToggleStates';

function getColorVariation(color, factor) {
    // Convert hex color to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Calculate variation with more difference
    const newR = Math.min(255, Math.max(0, Math.floor(r * factor + (factor > 1 ? 10 : -10))));
    const newG = Math.min(255, Math.max(0, Math.floor(g * factor + (factor > 1 ? 10 : -10))));
    const newB = Math.min(255, Math.max(0, Math.floor(b * factor + (factor > 1 ? 10 : -10))));

    // Convert back to hex
    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

export function toggleCountryVisibility(country, isVisible) {
    console.log(`Toggling visibility for country: ${country}, isVisible: ${isVisible}`);
    
    // Get both the country group and any paths that start with the country code
    const countryGroup = document.querySelector(`g[id="${country}"]`);
    const paths = document.querySelectorAll(`path[id^="${country}"]`);
    
    console.log(`Found country group:`, countryGroup);
    console.log(`Found ${paths.length} paths for country ${country}`);
    
    // Toggle visibility of the country group if it exists
    if (countryGroup) {
        countryGroup.style.display = isVisible ? 'block' : 'none';
    }
    
    // Toggle visibility of individual paths
    paths.forEach(path => {
        console.log(`Setting display: ${isVisible ? 'block' : 'none'} for path:`, path);
        path.style.display = isVisible ? 'block' : 'none';
    });

    // Update toggle all checkbox state
    const toggleAllCheckbox = document.getElementById('toggle-all-countries');
    const allToggles = Array.from(document.querySelectorAll('.country-item input[type="checkbox"]'));
    const allChecked = allToggles.every(toggle => toggle.checked);
    toggleAllCheckbox.checked = allChecked;

    // Save toggle states after each change
    saveToggleStates();
}

function setupToggleAll() {
    const toggleAllCheckbox = document.getElementById('toggle-all-countries');
    toggleAllCheckbox.addEventListener('change', (e) => {
        const isVisible = e.target.checked;
        const countryToggles = document.querySelectorAll('.country-item input[type="checkbox"]');
        
        countryToggles.forEach(toggle => {
            if (toggle.checked !== isVisible) {
                toggle.checked = isVisible;
                const countryItem = toggle.closest('.country-item');
                const countryName = countryItem.querySelector('span').textContent;
                toggleCountryVisibility(countryName, isVisible);
            }
        });
    });
}

function saveToggleStates() {
    const toggleStates = {};
    document.querySelectorAll('.country-item input[type="checkbox"]').forEach(toggle => {
        const countryName = toggle.closest('.country-item').querySelector('span').textContent;
        toggleStates[countryName] = toggle.checked;
    });
    document.cookie = `${TOGGLE_STATES_COOKIE}=${JSON.stringify(toggleStates)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadToggleStates() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${TOGGLE_STATES_COOKIE}=`));
    
    if (cookieValue) {
        const toggleStates = JSON.parse(cookieValue.split('=')[1]);
        Object.entries(toggleStates).forEach(([country, isVisible]) => {
            // Use a more reliable selector
            const countryItem = Array.from(document.querySelectorAll('.country-item'))
                .find(item => item.querySelector('span').textContent === country);
            const toggle = countryItem?.querySelector('input[type="checkbox"]');
            
            if (toggle) {
                toggle.checked = isVisible;
                toggleCountryVisibility(country, isVisible);
            }
        });
    }
}

export async function loadSVG(textZoom = 1) {
    try {
        const loadedCountries = []; // Initialize the array here

        // Parse the URL to get the map filename
        const urlParams = new URLSearchParams(window.location.search);
        const mapFilename = urlParams.get('map') || 'GEBA_MAP_EU.svg';

        // Update the path to include the 'maps' subfolder
        const mapPath = `maps/${mapFilename}`;

        // Set the selected option in the dropdown
        const regionSelect = document.getElementById('regions');

        // Fetch colors from the JSON file
        const colorsResponse = await fetch('data/colors.json');
        const colors = await colorsResponse.json();

        const response = await fetch(mapPath);
        const svgContent = await response.text();
        document.getElementById('map-container').innerHTML += svgContent;
        const svgElement = document.querySelector('#map-container svg');
        
        // Add labels for each path
        const paths = svgElement.querySelectorAll('path');
        paths.forEach(path => {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = path.id.substring(3); // Remove the first three characters from the path's ID
            text.setAttribute("x", path.getBBox().x + path.getBBox().width / 2); // Center the text
            text.setAttribute("y", path.getBBox().y + path.getBBox().height / 2); // Center the text
            text.setAttribute("text-anchor", "middle"); // Center alignment
            text.setAttribute("font-size", `${10 * textZoom}`); // Set font size based on text zoom
            text.setAttribute("fill", "black"); // Set text color
            text.setAttribute("pointer-events", "none"); // Prevent text from being selectable
    // Find the parent group or create one if it doesn't exist
    let parentGroup = path.parentElement;
    if (parentGroup.tagName !== 'g') {
        // If path isn't in a group, wrap it in one
        parentGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        path.parentElement.insertBefore(parentGroup, path);
        parentGroup.appendChild(path);
    }
    
    // Add the text to the same group as the path
    parentGroup.appendChild(text);

            // Set the fill color based on the path's ID or group's ID
            const countryId = path.id.includes('-') ? path.parentElement.id : path.id; // Check if ID contains '-' and look at parent if true
            console.log(`Processing path ID: ${path.id}, countryId: ${countryId}`); // Debug info for path ID
            
            // Check for countryId first
            if (colors[countryId]) {
                const variationColor = getColorVariation(colors[countryId], 0.8 + (Math.random() * 0.2)); // Lighter shade with slight randomness
                path.setAttribute("fill", variationColor); // Set variation color
                console.log(`Setting fill color for ${countryId}: ${variationColor}`); // Debug info
            } 
            
            // Check for offset color only if path ID contains '-'
            if (path.id.includes('-')) { // Check if ID contains '-' for offset color
                const parentCountryId = path.parentElement.id; // Get parent country ID
                console.log(`Parent country ID: ${parentCountryId}`); // Debug info for parent country ID
                if (colors[parentCountryId]) {
                    const offsetVariationColor = getColorVariation(colors[parentCountryId], 0.8 + (Math.random() * 0.2)); // Offset variation with slight randomness
                    path.setAttribute("fill", offsetVariationColor); // Set offset variation color
                    console.log(`Setting offset fill color for ${parentCountryId}: ${offsetVariationColor}`); // Debug info
                } else {
                    console.log(`No color found for parent country ID: ${parentCountryId}`); // Debug info if no color found
                }
            }

            // Add hover effect with debug info
            path.addEventListener('mouseover', () => {
                text.setAttribute("font-size", `${14 * textZoom}`); // Increase font size on hover
            });
            path.addEventListener('mouseout', () => {
                text.setAttribute("font-size", `${10 * textZoom}`); // Reset font size when not hovering
            });

            loadedCountries.push(countryId);
        });

        // Create country list with toggles
        console.log('Loaded countries:', [...new Set(loadedCountries)]);
        const countryListElement = document.getElementById('countries');
        countryListElement.innerHTML = '';

        // Sort the unique countries alphabetically
        const sortedCountries = [...new Set(loadedCountries)].sort((a, b) => 
            a.localeCompare(b, undefined, {sensitivity: 'base'})
        );

        sortedCountries.forEach(country => {
            const listItem = document.createElement('li');
            listItem.className = 'country-item';
            
            const container = document.createElement('div');
            container.className = 'country-container';
            
            const countryName = document.createElement('span');
            countryName.textContent = country;
            
            const toggleLabel = document.createElement('label');
            toggleLabel.className = 'switch';
            
            const toggleInput = document.createElement('input');
            toggleInput.type = 'checkbox';
            toggleInput.checked = true;
            
            const toggleSpan = document.createElement('span');
            toggleSpan.className = 'slider';
            
            toggleInput.addEventListener('change', (e) => {
                console.log(`Toggle changed for country ${country}:`, e.target.checked);
                toggleCountryVisibility(country, e.target.checked);
            });
            
            toggleLabel.appendChild(toggleInput);
            toggleLabel.appendChild(toggleSpan);
            
            container.appendChild(countryName);
            container.appendChild(toggleLabel);
            
            listItem.appendChild(container);
            countryListElement.appendChild(listItem);
        });

        setupToggleAll();
        // Move loadToggleStates() after the country list is created
        setTimeout(() => loadToggleStates(), 0); // Use setTimeout to ensure DOM is ready

        const viewBox = svgElement.viewBox.baseVal;
        const originalViewBox = {
            x: viewBox.x,
            y: viewBox.y,
            width: viewBox.width,
            height: viewBox.height
        };
        return { svgElement, originalViewBox };
    } catch (error) {
        console.error('Error loading SVG:', error);
        throw error;
    }
}

document.getElementById('map-container').addEventListener('mouseover', (event) => {
    const path = event.target.closest('path');
    if (path) {
        const text = document.getElementById(`text-${path.id}`);
        if (text) {
            text.setAttribute("font-size", "14");
        }
    }
});

document.getElementById('map-container').addEventListener('mouseout', (event) => {
    const path = event.target.closest('path');
    if (path) {
        const text = document.getElementById(`text-${path.id}`);
        if (text) {
            text.setAttribute("font-size", "10");
        }
    }
});
