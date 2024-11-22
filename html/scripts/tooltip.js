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

export function initializeTooltips() {
    const tooltipElements = [
        { element: document.getElementById('country-count'), tooltipText: 'Click to add individual countries', placement: 'top' },
        { element: document.getElementById('region-label'), tooltipText: 'Select Regions of countries', placement: 'bottom' },
        { element: document.getElementById('lookup-button'), tooltipText: 'Lookup in Mitoz', placement: 'top' },
        { element: document.getElementById('zoom-in'), tooltipText: 'Zoom in', placement: 'top' },
        { element: document.getElementById('zoom-out'), tooltipText: 'Zoom out', placement: 'top' },
        { element: document.getElementById('zoom-factor'), tooltipText: 'Currend zoom', placement: 'top' },
        { element: document.getElementById('reset-zoom'), tooltipText: 'Reset zoom to 1', placement: 'top' },
        { element: document.getElementById('zoom-visible'), tooltipText: 'Zoom to visible area', placement: 'top' },
        { element: document.getElementById('lasso-group'), tooltipText: 'Toggle lasso tool', placement: 'top' }
    ];

    tooltipElements.forEach(({ element, tooltipText, placement }) => {
        // console.log('Initializing tooltip for element:', element);
        initializeTooltip(element, tooltipText, placement);
    });
}