function getColorVariation(color, factor) {
    // Convert hex color to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Calculate variation
    const newR = Math.min(255, Math.max(0, Math.floor(r * factor)));
    const newG = Math.min(255, Math.max(0, Math.floor(g * factor)));
    const newB = Math.min(255, Math.max(0, Math.floor(b * factor)));

    // Convert back to hex
    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

export async function loadSVG(textZoom = 1) {
    try {
        // Parse the URL to get the map filename
        const urlParams = new URLSearchParams(window.location.search);
        const mapFilename = urlParams.get('map') || 'GEBA_MAP_BENELUX.svg';

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
            svgElement.appendChild(text); // Append the text to the SVG

            // Set the fill color based on the path's ID
            const countryId = path.id; // Assuming path.id corresponds to the keys in colors.json
            if (colors[countryId]) {
                path.setAttribute("fill", colors[countryId]); // Override fill color

                // Color sub-paths with a variation
                const subPaths = path.querySelectorAll('path'); // Select sub-paths
                subPaths.forEach(subPath => {
                    const variationColor = getColorVariation(colors[countryId], 0.8); // Lighter shade
                    subPath.setAttribute("fill", variationColor); // Set variation color
                });
            }

            // Add hover effect with debug info
            path.addEventListener('mouseover', () => {
                console.log(`Mouse over path: ${path.id}, increasing font size to ${14 * textZoom}`); // Debug info
                text.setAttribute("font-size", `${14 * textZoom}`); // Increase font size on hover
            });
            path.addEventListener('mouseout', () => {
                console.log(`Mouse out of path: ${path.id}, resetting font size to ${10 * textZoom}`); // Debug info
                text.setAttribute("font-size", `${10 * textZoom}`); // Reset font size when not hovering
            });
        });

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
