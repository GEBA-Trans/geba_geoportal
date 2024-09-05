export async function loadSVG() {
    try {
        const response = await fetch('map.svg');
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