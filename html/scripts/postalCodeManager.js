// import { sendToWebSocket, isWebSocketConnected, pendingPostalCodes, requestPendingCounts } from './websocket.js';
import { isPointInPolygon, setLassoMode } from './lasso.js';

const LOADING_MODE = 'loading';
const DELIVERY_MODE = 'delivery';
const COOKIE_NAME = 'selectedPostalCodes';
const EXPANDED_COUNTRIES_COOKIE = 'expandedCountries';

let currentMode = 'loading';
const loadingPostalCodes = new Set();
const deliveryPostalCodes = new Set();
const postalCodeCounts = new Map();
let expandedCountries = {
    [LOADING_MODE]: new Set(),
    [DELIVERY_MODE]: new Set()
};

let isPostalCodeClicksEnabled = true;

export function setupPostalCodeClicks() {
    document.getElementById('map-container').addEventListener('click', handlePostalCodeClick);
}

function handlePostalCodeClick(e) {
    if (!isPostalCodeClicksEnabled) return;
    
    if (e.target.tagName === 'path') {
        const postalCode = e.target.id || 'Unknown';
        const parentGroup = e.target.closest('g');
        const parentId = parentGroup ? parentGroup.id : 'No parent';
        console.log(`Clicked path: ${postalCode}, Parent group: ${parentId}`);
        const mode = currentMode;
        togglePostalCode(e.target, postalCode, mode);
    }
}

export function togglePostalCode(pathElement, postalCode, mode, isFromLasso = false) {
    const targetSet = mode === 'loading' ? loadingPostalCodes : deliveryPostalCodes;
    const hiddenSet = mode === 'loading' ? deliveryPostalCodes : loadingPostalCodes;

    if (isFromLasso) {
        // Always add when using lasso
        hiddenSet.delete(postalCode);
        targetSet.add(postalCode);
        pathElement.classList.remove('selected', 'loading', 'delivery');
        pathElement.classList.add('selected', mode);
        // sendToWebSocket('select', postalCode);
    } else {
        // Toggle when clicking individually
        if (targetSet.has(postalCode)) {
            targetSet.delete(postalCode);
            pathElement.classList.remove('selected', mode);
            // sendToWebSocket('deselect', postalCode);
        } else {
            hiddenSet.delete(postalCode);
            targetSet.add(postalCode);
            pathElement.classList.remove('selected', 'loading', 'delivery');
            pathElement.classList.add('selected', mode);
            // sendToWebSocket('select', postalCode);

            // Check if "select countries" toggle is on
            if (document.getElementById('select-countries').checked) {
                const parentGroup = pathElement.closest('g');
                const country = parentGroup ? parentGroup.id : null;
                if (country) {
                    addAllPostalCodes(country, mode);
                }
            }
        }
    }

    const selectedColor = mode === 'loading' ? document.getElementById('loading-color').value : document.getElementById('delivery-color').value;
    pathElement.style.fill = targetSet.has(postalCode) ? selectedColor : '';

    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

export function updatePostalCodeLists() {
    updateList('loading-list', loadingPostalCodes);
    updateList('delivery-list', deliveryPostalCodes);
}

function updateList(listId, postalCodes) {
    const list = document.getElementById(listId);
    list.innerHTML = '';

    if (postalCodes.size > 0) {
        const clearAllButton = document.createElement('button');
        clearAllButton.className = 'clear-all-button';
        clearAllButton.innerHTML = '<i class="fas fa-trash-alt"></i> Clear All';
        clearAllButton.addEventListener('click', () => clearAllPostalCodes(postalCodes));
        list.appendChild(clearAllButton);
    }

    const groupedPostalCodes = groupPostalCodesByCountry(postalCodes);
    const mode = listId === 'loading-list' ? LOADING_MODE : DELIVERY_MODE;

    for (const [country, codes] of Object.entries(groupedPostalCodes)) {
        const countryElement = document.createElement('div');
        countryElement.className = 'country-group';
        
        const countryHeader = document.createElement('div');
        countryHeader.className = 'country-header';
        const isExpanded = expandedCountries[mode].has(country);
        countryHeader.innerHTML = `
            <button class="toggle-btn" aria-expanded="${isExpanded}" title="${isExpanded ? 'Collapse' : 'Expand'}">
                <i class="fas fa-chevron-${isExpanded ? 'down' : 'right'}"></i>
            </button>
            <h3>${country} (${codes.length})</h3>
            <button class="add-all-btn" title="Add all postal codes">
                <i class="fas fa-plus-circle"></i>
            </button>
            <button class="remove-country-btn" title="Remove all postal codes for this country">
                <i class="fas fa-minus-circle"></i>
            </button>
        `;
        countryElement.appendChild(countryHeader);
        
        const codesUl = document.createElement('ul');
        codesUl.className = 'postal-codes-list';
        codesUl.style.display = isExpanded ? 'block' : 'none';
        codes.forEach(postalCode => {
            const li = document.createElement('li');
            li.setAttribute('data-postal-code', postalCode);
            const pathElement = document.getElementById(postalCode);
            const isValidPostalCode = pathElement !== null;

            li.innerHTML = `
                ${postalCode}
                <button class="delete-btn" title="Remove ${postalCode}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            if (!isValidPostalCode) {
                li.classList.add('greyed-out'); // Add class for greyed-out style
            }
            li.addEventListener('mouseenter', () => highlightPostalCode(postalCode, true));
            li.addEventListener('mouseleave', () => highlightPostalCode(postalCode, false));
            li.querySelector('.delete-btn').addEventListener('click', () => removePostalCode(postalCode));
            codesUl.appendChild(li);
        });
        
        countryElement.appendChild(codesUl);
        list.appendChild(countryElement);

        countryHeader.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-btn')) {
                const toggleBtn = countryHeader.querySelector('.toggle-btn');
                toggleBtn.setAttribute('aria-expanded', !isExpanded);
                toggleBtn.title = isExpanded ? 'Expand' : 'Collapse';
                toggleBtn.querySelector('i').className = `fas fa-chevron-${isExpanded ? 'right' : 'down'}`;
                toggleCountryExpansion(country, mode);
            }
        });

        countryHeader.querySelector('.add-all-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            addAllPostalCodes(country, mode);
        });

        countryHeader.querySelector('.remove-country-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            removeAllPostalCodes(country, mode);
        });
    }
}

function groupPostalCodesByCountry(postalCodes) {
    const grouped = {};
    
    postalCodes.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            const parentGroup = pathElement.closest('g');
            const country = parentGroup ? parentGroup.id : 'Unknown';
            if (!grouped[country]) {
                grouped[country] = [];
            }
            grouped[country].push(postalCode);
        } else {
            // If postal code is not found, add it to the 'Hidden' category
            if (!grouped['Hidden']) {
                grouped['Hidden'] = [];
            }
            grouped['Hidden'].push(postalCode);
            console.warn(`Postal code not found: ${postalCode}`);
        }

    });
    if (grouped['Hidden'] && grouped['Hidden'].length === 0) {
        console.warn('i should delete hidden');
        delete grouped['Hidden'];
    }
    // Move the 'Hidden' group to the end
    if (grouped['Hidden']) {
        const hiddenGroup = grouped['Hidden'];
        delete grouped['Hidden'];
        grouped['Hidden'] = hiddenGroup;
    }
    return grouped;
}

function getColorForCount(count) {
    count = Math.max(0, Math.min(99, count));
    const percentage = count / 99;
    const r = Math.round(255 * (1 - percentage));
    const g = Math.round(255 * percentage);
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
}

function removePostalCode(postalCode) {
    loadingPostalCodes.delete(postalCode);
    deliveryPostalCodes.delete(postalCode);
    postalCodeCounts.delete(postalCode);
    const pathElement = document.getElementById(postalCode);
    if (pathElement) {
        pathElement.classList.remove('selected', 'loading', 'delivery');
        pathElement.style.fill = '';
    }
    updatePostalCodeLists();
    saveSelectedPostalCodes();
    // sendToWebSocket('deselect', postalCode);
}

function clearAllPostalCodes(postalCodes) {
    postalCodes.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            pathElement.classList.remove('selected', 'loading', 'delivery');
            pathElement.style.fill = '';
        }
        // sendToWebSocket('deselect', postalCode);
    });
    postalCodes.clear();
    postalCodeCounts.clear();
    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

function highlightPostalCode(postalCode, highlight) {
    const pathElement = document.getElementById(postalCode);
    if (pathElement) {
        if (highlight) {
            pathElement.style.stroke = '#ff0000';
            pathElement.style.strokeWidth = '2px';
            pathElement.style.fillOpacity = '0.7';
        } else {
            pathElement.style.stroke = '';
            pathElement.style.strokeWidth = '';
            pathElement.style.fillOpacity = '';
        }
    }
}

export function updatePostalCodeCount(postalCode, count) {
    postalCodeCounts.set(postalCode, count);
    updatePostalCodeLists();
}

export function setMode(mode) {
    currentMode = mode;
    document.getElementById('loading-mode').classList.toggle('active', mode === 'loading');
    document.getElementById('delivery-mode').classList.toggle('active', mode === 'delivery');
    setLassoMode(mode); // Add this line to update the lasso mode
}

export function loadSelectedPostalCodes() {
    return new Promise((resolve, reject) => {
        try {
            loadExpandedCountries();
            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith(`${COOKIE_NAME}=`));
            if (cookieValue) {
                const data = JSON.parse(cookieValue.split('=')[1]);
                loadPostalCodesFromData(data[LOADING_MODE], loadingPostalCodes, LOADING_MODE);
                loadPostalCodesFromData(data[DELIVERY_MODE], deliveryPostalCodes, DELIVERY_MODE);
                updatePostalCodeLists();
                // Update the colors for the loaded postal codes
                updatePostalCodeSelectionColor('loading', document.getElementById('loading-color').value);
                updatePostalCodeSelectionColor('delivery', document.getElementById('delivery-color').value);
                // if (isWebSocketConnected) {
                //     requestPendingCounts();
                // }
            }
            resolve();
        } catch (error) {
            console.error('Error loading postal codes:', error);
            reject(error);
        }
    });
}

function loadPostalCodesFromData(data, targetSet, mode) {
    data.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        targetSet.add(postalCode);
        if (pathElement) {
            
            // pendingPostalCodes.add(postalCode);
        } else {
            console.warn(`Postal code not found: ${postalCode}`);
        }
    });
}

function saveSelectedPostalCodes() {

    // this should also save "hidden" postal codes
    const data = {
        [LOADING_MODE]: Array.from(loadingPostalCodes),
        [DELIVERY_MODE]: Array.from(deliveryPostalCodes)
    };
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(data)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

export function getSelectedPostalCodes() {
    return {
        loading: Array.from(loadingPostalCodes),
        delivery: Array.from(deliveryPostalCodes)
    };
}

export function toggleCountryExpansion(country, mode) {
    if (expandedCountries[mode].has(country)) {
        expandedCountries[mode].delete(country);
    } else {
        expandedCountries[mode].add(country);
    }
    saveExpandedCountries();
    updatePostalCodeLists();
}

function saveExpandedCountries() {
    const data = {
        [LOADING_MODE]: Array.from(expandedCountries[LOADING_MODE]),
        [DELIVERY_MODE]: Array.from(expandedCountries[DELIVERY_MODE])
    };
    document.cookie = `${EXPANDED_COUNTRIES_COOKIE}=${JSON.stringify(data)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function loadExpandedCountries() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${EXPANDED_COUNTRIES_COOKIE}=`));
    if (cookieValue) {
        const data = JSON.parse(cookieValue.split('=')[1]);
        expandedCountries[LOADING_MODE] = new Set(data[LOADING_MODE] || []);
        expandedCountries[DELIVERY_MODE] = new Set(data[DELIVERY_MODE] || []);
    }
}

function addAllPostalCodes(country, mode) {
    const allPaths = document.querySelectorAll(`#map-container svg g#${country} path`);
    const targetSet = mode === LOADING_MODE ? loadingPostalCodes : deliveryPostalCodes;
    const hiddenSet = mode === LOADING_MODE ? deliveryPostalCodes : loadingPostalCodes;

    allPaths.forEach(path => {
        const postalCode = path.id;
        if (postalCode) {
            hiddenSet.delete(postalCode);
            targetSet.add(postalCode);
            path.classList.remove('selected', 'loading', 'delivery');
            path.classList.add('selected', mode);
            // Update the fill color for the added postal code
            const selectedColor = mode === 'loading' ? document.getElementById('loading-color').value : document.getElementById('delivery-color').value;
            path.style.fill = selectedColor; // Set the fill color for the postal code
            // sendToWebSocket('select', postalCode);
        }
    });

    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

function removeAllPostalCodes(country, mode) {
    console.log(`Removing all postal codes for country: ${country}, mode: ${mode}`);
    const targetSet = mode === LOADING_MODE ? loadingPostalCodes : deliveryPostalCodes;
    
    // First, remove all postal codes that start with the country code
    const postalCodesToRemove = Array.from(targetSet).filter(code => {
        const pathElement = document.getElementById(code);
        return pathElement && pathElement.closest(`g#${country}`);
    });

    postalCodesToRemove.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            targetSet.delete(postalCode);
            pathElement.classList.remove('selected', mode);
            pathElement.style.fill = '';
            // sendToWebSocket('deselect', postalCode);
        }
    });

    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

export function disablePostalCodeClicks() {
    console.log("Postal code clicks have been disabled.");
    isPostalCodeClicksEnabled = false;
}

export function enablePostalCodeClicks() {
    console.log("Postal code clicks have been enabled.");
    isPostalCodeClicksEnabled = true;
}

// Add event listeners for color pickers
document.getElementById('loading-color').addEventListener('input', (e) => {
    const color = e.target.value;
    // document.getElementById('loading-mode').style.backgroundColor = color; // Update button color
    updatePostalCodeSelectionColor('loading', color); // Update selection color
});

document.getElementById('delivery-color').addEventListener('input', (e) => {
    const color = e.target.value;
    // document.getElementById('delivery-mode').style.backgroundColor = color; // Update button color
    updatePostalCodeSelectionColor('delivery', color); // Update selection color
});

// Function to update postal code selection color
function updatePostalCodeSelectionColor(mode, color) {
    const postalCodes = mode === 'loading' ? loadingPostalCodes : deliveryPostalCodes;
    postalCodes.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            pathElement.style.fill = color; // Update the fill color of the postal code
        }
    });
}
