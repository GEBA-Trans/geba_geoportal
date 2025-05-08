// Store references for cleanup
const tooltipCleanupHandlers = [];

function isDevelopment() {
    return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

function initializeTooltip(element, tooltipText, placement) {
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

    // Store event handlers for cleanup
    const mouseEnterHandler = () => {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        popperInstance.update();
    };
    const mouseLeaveHandler = () => {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    };
    element.addEventListener('mouseenter', mouseEnterHandler);
    element.addEventListener('mouseleave', mouseLeaveHandler);
    // Store cleanup function
    tooltipCleanupHandlers.push(() => {
        element.removeEventListener('mouseenter', mouseEnterHandler);
        element.removeEventListener('mouseleave', mouseLeaveHandler);
        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
        if (isDevelopment()) {
            // Only show debug logs on localhost
        }
        popperInstance.destroy && popperInstance.destroy();
    });
}

export function cleanupTooltips() {
    tooltipCleanupHandlers.forEach(fn => fn());
    tooltipCleanupHandlers.length = 0;
}

export function initializeTooltips() {
    const tooltipElements = [
        { element: document.getElementById('country-count'), tooltipText: 'Click to add individual countries', placement: 'top' },
        { element: document.getElementById('region-label'), tooltipText: 'Select Regions of countries', placement: 'bottom' },
        { element: document.getElementById('lookup-button'), tooltipText: 'Lookup in Mitoz', placement: 'top' },
        { element: document.getElementById('zoom-in'), tooltipText: 'Zoom in', placement: 'top' },
        { element: document.getElementById('zoom-out'), tooltipText: 'Zoom out', placement: 'top' },
        { element: document.getElementById('zoom-factor'), tooltipText: 'Current zoom', placement: 'top' },
        { element: document.getElementById('reset-zoom'), tooltipText: 'Reset zoom to 1', placement: 'top' },
        { element: document.getElementById('zoom-visible'), tooltipText: 'Zoom to visible area', placement: 'top' },
        { element: document.getElementById('lasso-button'), tooltipText: 'Toggle lasso tool', placement: 'top' },
        { element: document.getElementById('grow-selection-button'), tooltipText: 'Expand selection area', placement: 'top' },
        { element: document.getElementById('clear-selected-button'), tooltipText: 'Clear selection area', placement: 'top' },
        { element: document.getElementById('mode-settings-lock'), tooltipText: 'Changing mode will delete the selected postal codes', placement: 'top' }
    ];

    tooltipElements.forEach(({ element, tooltipText, placement }) => {
        if (element) {
            initializeTooltip(element, tooltipText, placement);
        }
    });
}