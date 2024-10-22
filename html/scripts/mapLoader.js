export async function loadSVG(textZoom = 1) {
    try {
        // Parse the URL to get the map filename
        const urlParams = new URLSearchParams(window.location.search);
        const mapFilename = urlParams.get('map') || 'GEBA_MAP_BENELUX.svg';

        // Update the path to include the 'maps' subfolder
        const mapPath = `maps/${mapFilename}`;

        // Set the selected option in the dropdown
        const regionSelect = document.getElementById('regions');

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
