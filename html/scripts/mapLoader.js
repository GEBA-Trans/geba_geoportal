import { triggerZoomVisible } from './zoomPan.js';

const TOGGLE_STATES_COOKIE = 'countryToggleStates';

// Debug label positions collector
let existingLabels = {};
let debugLabels = {};

function isDevelopment() {
    return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

function updateDebugConsole() {
    const debugDiv = document.getElementById('debug-console');
    const pre = document.getElementById('debug-json-output');
    if (!debugDiv || !pre) return;
    // Only show debug console on localhost
    if (isDevelopment()) {
        debugDiv.style.display = 'block';
    }
    // Merge existingLabels and debugLabels
    const mergedLabels = JSON.parse(JSON.stringify(existingLabels));
    for (const key in debugLabels) {
        if (!mergedLabels[key]) mergedLabels[key] = [];
        mergedLabels[key] = mergedLabels[key].concat(debugLabels[key]);
    }
    pre.textContent = JSON.stringify(mergedLabels, null, 2);
}
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const copyBtn = document.getElementById('copy-debug-json');
        if (copyBtn) {
            copyBtn.onclick = () => {
                const pre = document.getElementById('debug-json-output');
                if (pre) {
                    // Try modern clipboard API
                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(pre.textContent).then(() => {
                            copyBtn.textContent = 'Copied!';
                            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
                        });
                    } else {
                        // Fallback for older browsers
                        const textarea = document.createElement('textarea');
                        textarea.value = pre.textContent;
                        document.body.appendChild(textarea);
                        textarea.select();
                        try {
                            document.execCommand('copy');
                            copyBtn.textContent = 'Copied!';
                            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
                        } catch (err) {}
                        document.body.removeChild(textarea);
                    }
                }
            };
        }

        const undoBtn = document.getElementById('undo-debug-json');
        if (undoBtn) {
            undoBtn.onclick = () => {
                // Remove the last label position added (from debugLabels)
                const keys = Object.keys(debugLabels);
                if (keys.length > 0) {
                    const lastKey = keys[keys.length - 1];
                    if (debugLabels[lastKey].length > 0) {
                        debugLabels[lastKey].pop();
                        if (debugLabels[lastKey].length === 0) {
                            delete debugLabels[lastKey];
                        }
                        updateDebugConsole();
                        // Remove and redraw debug labels
                        const svgElement = document.querySelector('#map-container svg');
                        if (svgElement) renderDebugLabels(svgElement);
                    }
                }
            };
        }
    });
}

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

        // Fetch polylabel positions if available
        existingLabels = {};
        debugLabels = {};
        try {
            const labelPosResponse = await fetch('data/labelPositions.json');
            if (labelPosResponse.ok) {
                existingLabels = await labelPosResponse.json();
            }
        } catch (e) {
            // If not found, fallback to bbox
        }

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
            // Support multiple label positions per region
            let labelEntries = existingLabels[path.id];
            if (labelEntries && !Array.isArray(labelEntries)) {
                labelEntries = [labelEntries];
            }
            if (labelEntries && Array.isArray(labelEntries)) {
                labelEntries.forEach((pos, idx) => {
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.textContent = path.id.substring(3); // Remove the first three characters from the path's ID
                    text.setAttribute("x", pos.x);
                    text.setAttribute("y", pos.y);
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("font-size", `${10 * textZoom}`);
                    // Only color blue on localhost
                    text.setAttribute("fill", isDevelopment() ? "#0074D9" : "black");
                    text.setAttribute("pointer-events", "none");
                    let parentGroup = path.parentElement;
                    if (parentGroup.tagName !== 'g') {
                        parentGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        path.parentElement.insertBefore(parentGroup, path);
                        parentGroup.appendChild(path);
                    }
                    parentGroup.appendChild(text);
                });
            } else {
                // fallback to bbox center if no label positions
                const bbox = path.getBBox();
                const labelX = bbox.x + bbox.width / 2;
                const labelY = bbox.y + bbox.height / 2;
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.textContent = path.id.substring(3);
                text.setAttribute("x", labelX);
                text.setAttribute("y", labelY);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("font-size", `${10 * textZoom}`);
                text.setAttribute("fill", "black");
                text.setAttribute("pointer-events", "none");
                let parentGroup = path.parentElement;
                if (parentGroup.tagName !== 'g') {
                    parentGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    path.parentElement.insertBefore(parentGroup, path);
                    parentGroup.appendChild(path);
                }
                parentGroup.appendChild(text);
            }

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
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
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
                crosshairs(svgElement, cx, cy, 18 * textZoom, bbox, path.id);
            });

            path.addEventListener('mouseout', () => {
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
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

                // Hide crosshair group
                const crosshairGroup = svgElement.querySelector('#crosshair-group');
                if (crosshairGroup) crosshairGroup.style.display = 'none';
            });

            // Add click event for easy label position copy
            path.addEventListener('click', (event) => {
                if (isDevelopment()) {
                    // Get SVG coordinates from click event
                    const svgPoint = svgElement.createSVGPoint();
                    svgPoint.x = event.clientX;
                    svgPoint.y = event.clientY;
                    const ctm = svgElement.getScreenCTM().inverse();
                    const pointerSVG = svgPoint.matrixTransform(ctm);
                    // Add to debugLabels
                    if (!debugLabels[path.id]) debugLabels[path.id] = [];
                    debugLabels[path.id].push({ x: pointerSVG.x, y: pointerSVG.y });
                    updateDebugConsole();
                    renderDebugLabels(svgElement, textZoom);
                    // Log in copy-paste format for convenience
                    console.log(`"${path.id}": { "x": ${pointerSVG.x}, "y": ${pointerSVG.y } }`);
                }
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

        renderDebugLabels(svgElement, textZoom);

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

// Show two contra-rotating half circles at the given SVG x, y and a dotted box around the given bbox
export function crosshairs(svgElement, x, y, radius = 10, bbox = null, pathId = null) {
    // console.log('[CROSSHAIR DEBUG] x:', x, 'y:', y, 'id:', pathId); // Debug output for label placement
    let group = svgElement.querySelector('#crosshair-group');
    if (!group) {
        group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', 'crosshair-group');
        svgElement.appendChild(group);
    }
 
    // Add or update a dotted box around the path's bbox
    let borderRect = svgElement.querySelector('#crosshair-border-rect');
    const hoverLabelGroup = svgElement.querySelector('#hover-label-group');
    if (!borderRect) {
        borderRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        borderRect.setAttribute('id', 'crosshair-border-rect');
        borderRect.setAttribute('fill', 'none');
        borderRect.setAttribute('stroke', '#0d6efd');
        borderRect.setAttribute('stroke-width', '2');
        borderRect.setAttribute('stroke-dasharray', '6,4');
        borderRect.setAttribute('pointer-events', 'none');
        if (hoverLabelGroup) {
            svgElement.insertBefore(borderRect, hoverLabelGroup);
        } else {
            svgElement.appendChild(borderRect);
        }
    } else {
        if (hoverLabelGroup) {
            svgElement.insertBefore(borderRect, hoverLabelGroup);
        } else {
            svgElement.appendChild(borderRect);
        }
    }
    if (bbox) {
        borderRect.setAttribute('x', bbox.x);
        borderRect.setAttribute('y', bbox.y);
        borderRect.setAttribute('width', bbox.width);
        borderRect.setAttribute('height', bbox.height);
        borderRect.style.display = '';
    } else {
        borderRect.style.display = 'none';
    }
    // Make crosshair group and its children non-clickable
    group.setAttribute('pointer-events', 'none');

    return group;
}

function renderDebugLabels(svgElement, textZoom = 2) {
    // Remove all previous debug label elements
    const oldDebugs = svgElement.querySelectorAll('.debug-label-text');
    oldDebugs.forEach(el => el.remove());
    // Draw new debug labels
    for (const key in debugLabels) {
        debugLabels[key].forEach((pos, idx) => {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.textContent = key.substring(3); // Remove the first three characters from the path's ID
            text.setAttribute("x", pos.x);
            text.setAttribute("y", pos.y);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("font-size", `${10 * textZoom}`);
            text.setAttribute("fill", "red");
            text.setAttribute("class", "debug-label-text");
            text.setAttribute("pointer-events", "none");
            // Add to the SVG root so it's always visible
            svgElement.appendChild(text);
        });
    }
}

