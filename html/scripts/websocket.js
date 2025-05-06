import { updatePostalCodeCount, updatePostalCodeLists, getSelectedPostalCodes, MODES } from './postalCodeManager.js';
import { showError } from './main.js';

let socket;
let lookupSocket;
let neighboursocket;
let isWebSocketConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 3;
let pendingWebSocketMessages = [];
let pendingPostalCodes = new Set();
let pendingNeighborMessages = []; // Queue for pending neighbor WebSocket messages

function connectWebSocket() {
    console.log('Attempting to connect to WebSocket at wss://' + window.location.hostname + '/ws/map');
    let protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let port = window.location.protocol === 'https:' ? '' : ':1880';
    // 'lx-dev:8080' remove any port number
    let cleanHost = window.location.host.split(':')[0];
    let wsUrl = protocol + '//' + cleanHost + port;

    socket = new WebSocket(wsUrl + `/ws/map`);

    socket.onopen = function(event) {
        console.log('WebSocket connection established');
        isWebSocketConnected = true;
        reconnectAttempts = 0;
        processPendingWebSocketMessages();
    };

    socket.onmessage = function(event) {
        const message = event.data;
        displayWebSocketMessage(message);
    };

    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    socket.onclose = function(event) {
        console.log('WebSocket connection closed');
        isWebSocketConnected = false;
        attemptReconnect();
    };

    // Connect to the lookup WebSocket
    lookupSocket = new WebSocket(wsUrl + `/ws/lookup`); // This line should be corrected

    lookupSocket.onopen = function(event) {
        console.log('Lookup WebSocket connection established');
    };

    lookupSocket.onmessage = function(event) {
        try {
            const data = JSON.parse(event.data);
            updateResultsTable(data);
            showLookupResults(); // Show the lookup results
        } catch (error) {
            console.error('Error parsing lookup WebSocket message:', error);
        }
    };

    lookupSocket.onerror = function(error) {
        console.error('Lookup WebSocket error:', error);
    };

    lookupSocket.onclose = function(event) {
        console.log('Lookup WebSocket connection closed');
    };

    // connect to neighbor websocket

    neighboursocket = new WebSocket(wsUrl + `/ws/points`);
    console.log('Attempting to connect to Neighbor WebSocket at:', wsUrl + `/ws/points`);

    neighboursocket.onopen = function(event) {
        console.log('Neighbor WebSocket connection established');
        // Process any pending messages
        while (pendingNeighborMessages.length > 0) {
            const message = pendingNeighborMessages.shift();
            try {
                neighboursocket.send(message);
                console.log('Sent queued message to Neighbor WebSocket:', message);
            } catch (error) {
                console.error('Error sending queued message to Neighbor WebSocket:', error);
            }
        }
    };

    neighboursocket.onerror = function(error) {
        console.error('DEV: Neighbor WebSocket error:', error);
        showError('Neighbor connection error. Please check your network or try again later.');
    };

    neighboursocket.onclose = function(event) {
        console.log('Neighbor WebSocket connection closed. Code:', event.code, 'Reason:', event.reason);
        showError('Neighbor connection closed. Some features may not work.');
    }
}

function sendToneighboursocket(payload) {
    const message = JSON.stringify(payload);
    if (neighboursocket.readyState === WebSocket.OPEN) {
        neighboursocket.send(message);
    } else {
        console.error('Neighbor WebSocket is not open, queuing message');
        pendingNeighborMessages.push(message); // Queue the message
    }
}

function attemptReconnect() {
    if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(connectWebSocket, 5000);
    } else {
        console.log('Max reconnect attempts reached. Giving up.');
        alert('WebSocket connection lost. Please refresh the page to try again.');
    }
}

function displayWebSocketMessage(message) {
    try {
        const data = JSON.parse(message);
        if (data.action === 'select' && data.postalCode && data.count !== undefined) {
            updatePostalCodeCount(data.postalCode, data.count);
            pendingPostalCodes.delete(data.postalCode);
            updatePostalCodeLists();
        }
    } catch (error) {
        showError('Received invalid data from server. Please refresh the page.');
        console.error('DEV: Error parsing WebSocket message:', error);
    }
}

function sendToWebSocket(action, postalCode) {
    const message = JSON.stringify({ action, postalCode });
    if (isWebSocketConnected) {
        socket.send(message);
    } else {
        pendingWebSocketMessages.push(message);
    }
}

function requestPendingCounts() {
    pendingPostalCodes.forEach(postalCode => {
        sendToWebSocket('select', postalCode);
    });
}

function processPendingWebSocketMessages() {
    while (pendingWebSocketMessages.length > 0) {
        const message = pendingWebSocketMessages.shift();
        socket.send(message);
    }
}

function lookupCompanies() {
    const selectedPostalCodes = getSelectedPostalCodes();
    const payload = {};
    MODES.forEach(mode => {
        payload[`${mode}PostalCodes`] = selectedPostalCodes[mode];
    });
    if (lookupSocket.readyState === WebSocket.OPEN) {
        lookupSocket.send(JSON.stringify(payload));
    } else {
        showError('Lookup connection is not open. Please try again later.');
        console.error('DEV: Lookup WebSocket is not open');
    }
}

function getSavedPostalCodes() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('selectedPostalCodes='));
    if (cookieValue) {
        try {
            return JSON.parse(cookieValue.split('=')[1]);
        } catch (error) {
            showError('Failed to load saved postal codes. Please clear your cookies and try again.');
            console.error('DEV: Error parsing saved postal codes:', error);
        }
    }
    return { loading: [], delivery: [] };
}

function updateResultsTable(data) {
    const tableBody = document.getElementById('company-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    if (!data || typeof data !== 'object') {
        showError('Invalid data received from lookup.');
        console.error('DEV: Invalid data received from lookup WebSocket');
        return;
    }
    let companies = data.companies || data;
    if (!Array.isArray(companies)) {
        showError('Company data is not in the expected format.');
        console.error('DEV: Companies data is not an array:', companies);
        return;
    }
    companies.forEach(company => {
        if (typeof company === 'object' && company !== null) {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = company.name || 'N/A';
            row.insertCell(1).textContent = company.fleetSize || 'N/A';
            row.insertCell(2).textContent = company.coverageArea || 'N/A';
            row.insertCell(3).textContent = company.rating || 'N/A';
        } else {
            console.warn('DEV: Invalid company data:', company);
        }
    });
}

function showLookupResults() {
    document.getElementById('lookup-results').style.display = 'block';
}

function updateNeighborTable(neighbours) {
    const tableBody = document.getElementById('neighbor-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    neighbours.forEach(neighbor => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = neighbor.id || 'N/A';
        row.insertCell(1).textContent = neighbor.distance || 'N/A';
        row.insertCell(2).textContent = neighbor.details || 'N/A';
    });
}

export { connectWebSocket, sendToWebSocket, isWebSocketConnected, pendingPostalCodes, requestPendingCounts, lookupCompanies, sendToneighboursocket };