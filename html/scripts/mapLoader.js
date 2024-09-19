export async function loadSVG() {
    try {
        // Parse the URL to get the map filename
        const urlParams = new URLSearchParams(window.location.search);
        const mapFilename = urlParams.get('map') || 'map.svg';

        // Set the selected option in the dropdown
        const regionSelect = document.getElementById('regions');
        if (mapFilename === 'GEBA_map_5.svg') {
            regionSelect.value = '/?map=GEBA_map_5.svg'; // Set to Europe
        } else if (mapFilename === 'GEBA_map_benelux.svg') {
            regionSelect.value = '/?map=GEBA_map_benelux.svg'; // Set to Benelux
        } else {
            regionSelect.value = ''; // Default option
        }

        const response = await fetch(mapFilename);
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
            text.setAttribute("font-size", "10"); // Set font size
            text.setAttribute("fill", "black"); // Set text color
            text.setAttribute("pointer-events", "none"); // Prevent text from being selectable
            svgElement.appendChild(text); // Append the text to the SVG

            // Add hover effect
            path.addEventListener('mouseover', () => {
                text.setAttribute("font-size", "14"); // Increase font size on hover
            });
            path.addEventListener('mouseout', () => {
                text.setAttribute("font-size", "10"); // Reset font size when not hovering
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