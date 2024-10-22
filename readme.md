# Interactive World Map

## Overview
The Interactive World Map is a web application that allows users to explore different regions of the world through an interactive SVG map. Users can zoom in and out, select regions, and view postal codes dynamically.

## Features
- **Interactive Zoom and Pan**: Users can zoom in and out of the map and pan around to explore different areas.
- **Region Selection**: A dropdown menu allows users to select different regions to view.
- **Postal Code Management**: Users can click on postal codes to select or deselect them, with visual feedback on their selections.
- **WebSocket Integration**: Real-time updates for postal code counts and transport companies.

## Technologies Used
- HTML
- CSS
- JavaScript
- WebSocket
- SVG

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   Make sure you have Docker installed. Then, run:
   ```bash
   docker-compose up
   ```

3. **Access the Application**:
   Open your web browser and navigate to `http://localhost:8080` to view the application.

## Usage
- Use the zoom controls to navigate the map.
- Select a region from the dropdown to load the corresponding map.
- Click on postal codes to select or deselect them.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
