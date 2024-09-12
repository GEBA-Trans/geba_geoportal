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