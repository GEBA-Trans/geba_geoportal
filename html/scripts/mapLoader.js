import { triggerZoomVisible } from './zoomPan.js';

const TOGGLE_STATES_COOKIE = 'countryToggleStates';

export function getColorVariation(color, factor) {
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
    // console.log(`Toggling visibility for country: ${country}, isVisible: ${isVisible}`);
    
    // Get both the country group and any paths that start with the country code
    const countryGroup = document.querySelector(`g[id="${country}"]`);
    const paths = document.querySelectorAll(`path[id^="${country}"]`);
    
    // console.log(`Found country group:`, countryGroup);
    // console.log(`Found ${paths.length} paths for country ${country}`);
    
    // Toggle visibility of the country group if it exists
    if (countryGroup) {
        countryGroup.style.display = isVisible ? 'block' : 'none';
    }
    
    // Toggle visibility of individual paths
    paths.forEach(path => {
        // console.log(`Setting display: ${isVisible ? 'block' : 'none'} for path:`, path);
        path.style.display = isVisible ? 'block' : 'none';
    });

    // Update toggle all checkbox state
    const toggleAllCheckbox = document.getElementById('toggle-all-countries');
    const allToggles = Array.from(document.querySelectorAll('.country-item input[type="checkbox"]'));
    const allChecked = allToggles.every(toggle => toggle.checked);
    toggleAllCheckbox.checked = allChecked;

    // Update the counter
    updateCountryCount();

    // Save toggle states after each change
    saveToggleStates();

    // Trigger zoom to visible after toggling the country visibility
    triggerZoomVisible();
}

function updateCountryCount() {
    const allToggles = Array.from(document.querySelectorAll('.country-item input[type="checkbox"]'));
    const selectedCount = allToggles.filter(toggle => toggle.checked).length;
    const totalCount = allToggles.length;
    document.getElementById('country-count').textContent = `${selectedCount} / ${totalCount}`;
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
    updateCountryCount(); // Initial count update
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

export async function loadSVG(textZoom = 2) {
    try {
        // Show loader
        document.getElementById('loader').style.display = 'flex';

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
        
        // Store the original 'd' attribute for each path
        const paths = svgElement.querySelectorAll('path');
        paths.forEach(path => {
            path.setAttribute('data-original-d', path.getAttribute('d'));
        });

        // Add a top-level hover label group (hidden by default)
        let hoverLabelGroup = svgElement.querySelector('#hover-label-group');
        if (!hoverLabelGroup) {
            hoverLabelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            hoverLabelGroup.setAttribute('id', 'hover-label-group');
            hoverLabelGroup.style.pointerEvents = 'none';
            hoverLabelGroup.style.display = 'none';

            const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bgRect.setAttribute('id', 'hover-label-bg');
            bgRect.setAttribute('rx', '8');
            bgRect.setAttribute('ry', '8');
            bgRect.setAttribute('fill', '#0d6efd'); // Bootstrap primary color
            bgRect.setAttribute('stroke', '#fff');
            bgRect.setAttribute('stroke-width', '1');
            hoverLabelGroup.appendChild(bgRect);

            const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            labelText.setAttribute('id', 'hover-label-text');
            labelText.setAttribute('fill', '#fff');
            labelText.setAttribute('font-size', `${14 * textZoom}`);
            labelText.setAttribute('font-weight', 'bold');
            labelText.setAttribute('text-anchor', 'middle');
            labelText.setAttribute('alignment-baseline', 'middle');
            hoverLabelGroup.appendChild(labelText);

            svgElement.appendChild(hoverLabelGroup);
        }
        const hoverLabelBg = svgElement.querySelector('#hover-label-bg');
        const hoverLabelText = svgElement.querySelector('#hover-label-text');

        // Add labels for each path
        paths.forEach(path => {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = path.id.substring(3); // Remove the first three characters from the path's ID
            text.setAttribute("x", path.getBBox().x + path.getBBox().width / 2); // Center the text
            text.setAttribute("y", path.getBBox().y + path.getBBox().height / 2); // Center the text
            text.setAttribute("text-anchor", "middle"); // Center alignment
            text.setAttribute("font-size", `${10 * textZoom}`); // Set font size based on text zoom
            text.setAttribute("fill", "black"); // Set text color
            text.setAttribute("pointer-events", "none"); // Prevent text from being selectable
            // Remove initial visibility hidden so text is visible by default
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
            // console.log(`Processing path ID: ${path.id}, countryId: ${countryId}`); // Debug info for path ID
            
            // Check for countryId first
            if (colors[countryId]) {
                const variationColor = getColorVariation(colors[countryId], 0.8 + (Math.random() * 0.2)); // Lighter shade with slight randomness
                path.setAttribute("fill", variationColor); // Set variation color
                // console.log(`Setting fill color for ${countryId}: ${variationColor}`); // Debug info
            } 
            
            // Check for offset color only if path ID contains '-'
            if (path.id.includes('-')) { // Check if ID contains '-' for offset color
                const parentCountryId = path.parentElement.id; // Get parent country ID
                // console.log(`Parent country ID: ${parentCountryId}`); // Debug info for parent country ID
                if (colors[parentCountryId]) {
                    const offsetVariationColor = getColorVariation(colors[parentCountryId], 0.8 + (Math.random() * 0.2)); // Offset variation with slight randomness
                    path.setAttribute("fill", offsetVariationColor); // Set offset variation color
                    // console.log(`Setting offset fill color for ${parentCountryId}: ${offsetVariationColor}`); // Debug info
                } else {
                    // console.log(`No color found for parent country ID: ${parentCountryId}`); // Debug info if no color found
                }
            }

            // Add hover effect with enhanced visibility
            path.addEventListener('mouseover', (event) => {
                text.setAttribute("font-weight", "bold");
                text.setAttribute("fill", "white");
                document.getElementById('map-container').style.cursor = 'pointer';
                const postalCode = path.id;
                // Show label and attach to mouse
                function updateLabelPosition(e) {
                    const svgPoint = svgElement.createSVGPoint();
                    svgPoint.x = e.clientX;
                    svgPoint.y = e.clientY;
                    const ctm = svgElement.getScreenCTM().inverse();
                    const pointerSVG = svgPoint.matrixTransform(ctm);
                    const offsetX = 8 * textZoom;
                    const offsetY = 12 * textZoom;
                    const textBBox = hoverLabelText.getBBox();
                    const padX = 7 * textZoom;
                    const padY = 8 * textZoom;
                    const widthPad = 14 * textZoom;
                    const heightPad = 14 * textZoom;
                    const boxW = textBBox.width + widthPad;
                    const boxH = textBBox.height + heightPad;
                    const boxX = pointerSVG.x + offsetX;
                    const boxY = pointerSVG.y - offsetY - boxH;
                    hoverLabelBg.setAttribute('x', boxX);
                    hoverLabelBg.setAttribute('y', boxY);
                    hoverLabelBg.setAttribute('width', boxW);
                    hoverLabelBg.setAttribute('height', boxH);
                    // Set tspans with correct offset
                    hoverLabelText.innerHTML = '';
                    const countryTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                    countryTspan.setAttribute('x', boxX + boxW / 2);
                    countryTspan.setAttribute('y', boxY + padY + (10 * textZoom));
                    countryTspan.setAttribute('font-size', `${10 * textZoom}`);
                    countryTspan.setAttribute('font-weight', 'normal');
                    countryTspan.textContent = path.parentElement.id;
                    const codeTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                    codeTspan.setAttribute('x', boxX + boxW / 2);
                    codeTspan.setAttribute('y', boxY + padY + (10 * textZoom) + 16 * textZoom);
                    codeTspan.setAttribute('font-size', `${18 * textZoom}`);
                    codeTspan.setAttribute('font-weight', 'bold');
                    codeTspan.textContent = postalCode;
                    hoverLabelText.appendChild(countryTspan);
                    hoverLabelText.appendChild(codeTspan);
                }
                // Initial position
                updateLabelPosition(event);
                svgElement.addEventListener('mousemove', updateLabelPosition);
                hoverLabelGroup.style.display = '';
                hoverLabelGroup.parentNode.appendChild(hoverLabelGroup);
                // Store for removal
                path._hoverMoveHandler = updateLabelPosition;

                // Show crosshairs at the original path center
                const bbox = path.getBBox();
                const cx = bbox.x + bbox.width / 2;
                const cy = bbox.y + bbox.height / 2;
                crosshairs(svgElement, cx, cy, 18 * textZoom, '#0d6efd', 2);
            });

            path.addEventListener('mouseout', () => {
                text.setAttribute("font-weight", "normal");
                text.setAttribute("fill", "black");
                document.getElementById('map-container').style.cursor = '';
                text.textContent = path.id.substring(3);
                hoverLabelGroup.style.display = 'none';
                // Remove mousemove handler
                if (path._hoverMoveHandler) {
                    svgElement.removeEventListener('mousemove', path._hoverMoveHandler);
                    path._hoverMoveHandler = null;
                }

                // Hide crosshair circle
                const crosshairCircle = svgElement.querySelector('#crosshair-circle');
                if (crosshairCircle) crosshairCircle.style.display = 'none';
            });

            loadedCountries.push(countryId);

            // Simplify paths
            simplifyPath(path);
        });

        // Create country list with toggles
        // console.log('Loaded countries:', [...new Set(loadedCountries)]);
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
                updateCountryCount(); // Update count on change
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

        // Hide loader
        document.getElementById('loader').style.display = 'none';

        return { svgElement, originalViewBox };
    } catch (error) {
        console.error('Error loading SVG:', error);

        // Hide loader in case of error
        document.getElementById('loader').style.display = 'none';

        throw error;
    }
}

function simplifyPath(path) {
    const length = path.getTotalLength();
    const points = [];
    const step = length / 8; // Increase step size to reduce number of points checked
    for (let i = 0; i <= length; i += step) {
        const point = path.getPointAtLength(i);
        points.push(`${point.x},${point.y}`);
    }
    const simplifiedD = `M${points.join(' L')} Z`;
    path.setAttribute('data-simplified-d', simplifiedD);
}

// Show a circle at the given SVG x, y with the given radius and color
export function crosshairs(svgElement, x, y, radius = 18, color = '#0d6efd', strokeWidth = 2) {
    let crosshairCircle = svgElement.querySelector('#crosshair-circle');
    if (!crosshairCircle) {
        crosshairCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        crosshairCircle.setAttribute('id', 'crosshair-circle');
        crosshairCircle.setAttribute('fill', 'none');
        svgElement.appendChild(crosshairCircle);
    }
    crosshairCircle.setAttribute('cx', x);
    crosshairCircle.setAttribute('cy', y);
    crosshairCircle.setAttribute('r', radius);
    crosshairCircle.setAttribute('stroke', color);
    crosshairCircle.setAttribute('stroke-width', strokeWidth);
    crosshairCircle.style.display = '';
    return crosshairCircle;
}

