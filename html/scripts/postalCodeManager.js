import { isPointInPolygon } from './polygonUtils.js';
import { getColorVariation } from './mapLoader.js'; // Add this import
import { showError } from './main.js';
import { setToolMode, isAreaSelectorActive } from './areaSelector.js';

export const MODES = ['loading', 'delivery', 'selected'];
const STORAGE_NAME = 'selectedPostalCodes';
const EXPANDED_COUNTRIES_COOKIE = 'expandedCountries';

let currentMode = 'loading';
const postalCodeState = MODES.reduce((acc, mode) => {
    acc[mode] = {
        postalCodes: new Set(),
        expandedCountries: new Set()
    };
    return acc;
}, {});

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
        const mode = currentMode;
        togglePostalCode(e.target, postalCode, mode);
    }
}

export function togglePostalCode(pathElement, postalCode, mode, isFromLasso = false) {
    const targetSet = postalCodeState[mode].postalCodes;
    const hiddenSets = MODES.filter(m => m !== mode).map(m => postalCodeState[m].postalCodes);

    if (isFromLasso) {
        hiddenSets.forEach(set => set.delete(postalCode));
        targetSet.add(postalCode);
        pathElement.classList.remove(...MODES);
        pathElement.classList.add('selected', mode);
    } else {
        if (targetSet.has(postalCode)) {
            targetSet.delete(postalCode);
            pathElement.classList.remove('selected', mode);

            if (document.getElementById('select-countries').checked) {
                const parentGroup = pathElement.closest('g');
                const country = parentGroup ? parentGroup.id : null;
                if (country) {
                    removeAllPostalCodes(country, mode);
                }
            }
        } else {
            hiddenSets.forEach(set => set.delete(postalCode));
            targetSet.add(postalCode);
            pathElement.classList.remove(...MODES);
            pathElement.classList.add('selected', mode);

            if (document.getElementById('select-countries').checked) {
                const parentGroup = pathElement.closest('g');
                const country = parentGroup ? parentGroup.id : null;
                if (country) {
                    addAllPostalCodes(country, mode);
                }
            }
        }
    }

    const selectedColor = document.getElementById(`${mode}-color`).value;
    pathElement.style.fill = targetSet.has(postalCode) ? selectedColor : '';

    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

export function updatePostalCodeLists() {
    MODES.forEach(mode => {
        updateList(`${mode}-list`, postalCodeState[mode].postalCodes, mode);
    });
}

function updateList(listId, postalCodes, mode) {
    const list = document.getElementById(listId);
    list.innerHTML = '';

    if (postalCodes.size > 0) {
        const clearAllButton = document.createElement('button');
        clearAllButton.className = 'clear-selected-button';
        clearAllButton.innerHTML = '<i class="fas fa-trash-alt"></i> Clear All';
        clearAllButton.addEventListener('click', () => clearAllPostalCodes(postalCodes));
        list.appendChild(clearAllButton);
    }

    const groupedPostalCodes = groupPostalCodesByCountry(postalCodes);

    for (const [country, codes] of Object.entries(groupedPostalCodes)) {
        const countryElement = document.createElement('div');
        countryElement.className = 'country-group';
        
        const countryHeader = document.createElement('div');
        countryHeader.className = 'country-header';
        const isExpanded = postalCodeState[mode].expandedCountries.has(country);
        countryHeader.innerHTML = `
            <button class="toggle-btn" aria-expanded="${isExpanded}" title="${isExpanded ? 'Collapse' : 'Expand'}">
                <i class="fas fa-chevron-${isExpanded ? 'down' : 'right'}"></i>
            </button>
            <h3>${country} (${codes.length})</h3>
            <button class="add-all-btn" title="Add all postal codes" >
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
                li.classList.add('greyed-out');
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
            if (!grouped['Hidden']) {
                grouped['Hidden'] = [];
            }
            grouped['Hidden'].push(postalCode);
            console.warn('DEV: Postal code not found:', postalCode);
        }
    });
    if (grouped['Hidden'] && grouped['Hidden'].length === 0) {
        delete grouped['Hidden'];
    }
    if (grouped['Hidden']) {
        const hiddenGroup = grouped['Hidden'];
        delete grouped['Hidden'];
        grouped['Hidden'] = hiddenGroup;
    }
    return grouped;
}

function removePostalCode(postalCode) {
    MODES.forEach(mode => postalCodeState[mode].postalCodes.delete(postalCode));
    const pathElement = document.getElementById(postalCode);
    if (pathElement) {
        pathElement.classList.remove(...MODES);
        pathElement.style.fill = '';
        highlightPostalCode(postalCode, false);
    }
    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

function clearAllPostalCodes(postalCodes) {
    postalCodes.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            pathElement.classList.remove(...MODES);
            pathElement.style.fill = '';
            if (typeof isAreaSelectorActive !== 'undefined' && isAreaSelectorActive) {
                pathElement.style.filter = 'grayscale(75%)';
            }
        }
    });
    postalCodes.clear();
    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

function highlightPostalCode(postalCode, highlight) {
    const pathElement = document.getElementById(postalCode);
    if (pathElement) {
        if (highlight) {
            pathElement.style.stroke = '#ff0000';
            pathElement.style.strokeWidth = '4px';
            pathElement.style.fillOpacity = '0.7';
            pathElement.style.animation = 'highlight 1s infinite';
        } else {
            pathElement.style.stroke = '';
            pathElement.style.strokeWidth = '';
            pathElement.style.fillOpacity = '';
            pathElement.style.animation = '';
        }
    }
}

export function updatePostalCodeCount(postalCode, count) {
    postalCodeState[currentMode].postalCodes.add(postalCode);
    updatePostalCodeLists();
}

export function setMode(mode) {
    currentMode = mode;
    MODES.forEach(m => {
        document.getElementById(`${m}-mode`).classList.toggle('active', mode === m);
    });
    setToolMode(mode);
}

export function loadSelectedPostalCodes() {
    return new Promise((resolve, reject) => {
        try {
            loadExpandedCountries();

            MODES.forEach(mode => postalCodeState[mode].postalCodes.clear());

            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(STORAGE_NAME)) {
                    const [_, mode, country] = key.split('_');
                    const postalCodes = JSON.parse(localStorage.getItem(key));
                    loadPostalCodesFromData(postalCodes, postalCodeState[mode].postalCodes, mode, country);
                }
            });

            updatePostalCodeLists();
            MODES.forEach(mode => {
                updatePostalCodeSelectionColor(mode, document.getElementById(`${mode}-color`).value);
            });
            document.querySelectorAll('#map-container svg path').forEach(path => {
                path.classList.remove(...MODES);
            });
            MODES.forEach(mode => {
                postalCodeState[mode].postalCodes.forEach(postalCode => {
                    const path = document.getElementById(postalCode);
                    if (path) {
                        path.classList.add('selected', mode);
                    }
                });
            });
            resolve();
        } catch (error) {
            showError('Failed to load postal codes. Please refresh the page.');
            console.error('DEV: Error loading postal codes:', error);
            reject(error);
        }
    });
}

function loadPostalCodesFromData(data, targetSet, mode, country) {
    if (!Array.isArray(data)) {
        showError('Invalid data format for postal codes.');
        console.error('DEV: Invalid data format for postal codes:', data);
        return;
    }

    data.forEach(postalCode => {
        const fullPostalCode = country + postalCode;
        const pathElement = document.getElementById(fullPostalCode);
        targetSet.add(fullPostalCode);
        if (!pathElement) {
            console.warn(`Postal code not found: ${fullPostalCode}`);
        }
    });
}

function saveSelectedPostalCodes() {
    const data = MODES.reduce((acc, mode) => {
        acc[mode] = Array.from(postalCodeState[mode].postalCodes);
        return acc;
    }, {});

    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_NAME)) {
            localStorage.removeItem(key);
        }
    });

    Object.keys(data).forEach(mode => {
        const postalCodes = data[mode];
        const groupedByCountry = postalCodes.reduce((acc, code) => {
            const country = code.slice(0, 2);
            if (!acc[country]) acc[country] = [];
            acc[country].push(code.slice(2));
            return acc;
        }, {});

        Object.keys(groupedByCountry).forEach(country => {
            const storageKey = `${STORAGE_NAME}_${mode}_${country}`;
            localStorage.setItem(storageKey, JSON.stringify(groupedByCountry[country]));
        });
    });
}

function saveExpandedCountries() {
    const data = MODES.reduce((acc, mode) => {
        acc[mode] = Array.from(postalCodeState[mode].expandedCountries);
        return acc;
    }, {});
    localStorage.setItem(EXPANDED_COUNTRIES_COOKIE, JSON.stringify(data));
}

function loadExpandedCountries() {
    const data = JSON.parse(localStorage.getItem(EXPANDED_COUNTRIES_COOKIE));
    if (data) {
        MODES.forEach(mode => {
            postalCodeState[mode].expandedCountries = new Set(data[mode] || []);
        });
    }
}

export function getSelectedPostalCodes() {
    return MODES.reduce((acc, mode) => {
        acc[mode] = Array.from(postalCodeState[mode].postalCodes);
        return acc;
    }, {});
}

export function toggleCountryExpansion(country, mode) {
    const expandedCountries = postalCodeState[mode].expandedCountries;
    if (expandedCountries.has(country)) {
        expandedCountries.delete(country);
    } else {
        expandedCountries.add(country);
    }
    saveExpandedCountries();
    updatePostalCodeLists();
}

export function addAllPostalCodes(country, mode) {
    const allPaths = document.querySelectorAll(`#map-container svg g#${country} path`);
    const targetSet = postalCodeState[mode].postalCodes;
    const hiddenSets = MODES.filter(m => m !== mode).map(m => postalCodeState[m].postalCodes);

    allPaths.forEach(path => {
        const postalCode = path.id;
        if (postalCode) {
            hiddenSets.forEach(set => set.delete(postalCode));
            targetSet.add(postalCode);
            path.classList.remove(...MODES);
            path.classList.add('selected', mode);
            const selectedColor = document.getElementById(`${mode}-color`).value;
            path.style.fill = selectedColor;
            path.style.filter = '';
        }
    });

    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

function removeAllPostalCodes(country, mode) {
    const targetSet = postalCodeState[mode].postalCodes;
    
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
            if (isAreaSelectorActive) {
                pathElement.style.filter = 'grayscale(75%)';
            }
        }
    });

    updatePostalCodeLists();
    saveSelectedPostalCodes();
}

export function disablePostalCodeClicks() {
    isPostalCodeClicksEnabled = false;
}

export function enablePostalCodeClicks() {
    isPostalCodeClicksEnabled = true;
}

document.getElementById('loading-color').addEventListener('input', (e) => {
    const color = e.target.value;
    updatePostalCodeSelectionColor('loading', color);
});

document.getElementById('delivery-color').addEventListener('input', (e) => {
    const color = e.target.value;
    updatePostalCodeSelectionColor('delivery', color);
});

document.getElementById('selected-color').addEventListener('input', (e) => {
    const color = e.target.value;
    updatePostalCodeSelectionColor('selected', color);
});

function updatePostalCodeSelectionColor(mode, color) {
    const postalCodes = postalCodeState[mode].postalCodes;
    const countryColors = new Map();

    postalCodes.forEach(postalCode => {
        const pathElement = document.getElementById(postalCode);
        if (pathElement) {
            const parentGroup = pathElement.closest('g');
            const country = parentGroup ? parentGroup.id : 'Unknown';
            if (!countryColors.has(country)) {
                countryColors.set(country, getColorVariation(color, 0.7 + (Math.random() * 0.3)));
            }
            pathElement.style.fill = countryColors.get(country);
        }
    });
}

export function reloadSelectedPostalCodes() {
    loadSelectedPostalCodes().then(() => {
    }).catch(error => {
        showError('Failed to reload selected postal codes. Please refresh the page.');
        console.error('DEV: Error reloading selected postal codes:', error);
    });
}
