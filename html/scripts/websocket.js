import { updatePostalCodeCount, updatePostalCodeLists, getSelectedPostalCodes } from './postalCodeManager.js';

let socket;
let lookupSocket;
let isWebSocketConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 3;
let pendingWebSocketMessages = [];
let pendingPostalCodes = new Set();

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
        // requestPendingCounts();
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
            updateCompanyTable(data);
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
        console.error('Error parsing WebSocket message:', error);
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
    
    const payload = {
        loadingPostalCodes: selectedPostalCodes.loading,
        deliveryPostalCodes: selectedPostalCodes.delivery
    };

    if (lookupSocket.readyState === WebSocket.OPEN) {
        lookupSocket.send(JSON.stringify(payload));
    } else {
        console.error('Lookup WebSocket is not open');
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
            console.error('Error parsing saved postal codes:', error);
        }
    }
    
    return { loading: [], delivery: [] };
}

function updateCompanyTable(data) {
    const tableBody = document.getElementById('company-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    if (!data || typeof data !== 'object') {
        console.error('Invalid data received from lookup WebSocket');
        return;
    }

    let companies = data.companies || data;

    if (!Array.isArray(companies)) {
        console.error('Companies data is not an array:', companies);
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
            console.warn('Invalid company data:', company);
        }
    });
}

export { connectWebSocket, sendToWebSocket, isWebSocketConnected, pendingPostalCodes, requestPendingCounts, lookupCompanies };