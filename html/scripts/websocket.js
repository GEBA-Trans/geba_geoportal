import { updatePostalCodeCount, updatePostalCodeLists } from '../script.js';

let socket;
let isWebSocketConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 3;
let pendingWebSocketMessages = [];
let pendingPostalCodes = new Set();

function connectWebSocket() {
    socket = new WebSocket('ws://lx-dev:1880/ws/map');

    socket.onopen = function(event) {
        console.log('WebSocket connection established');
        isWebSocketConnected = true;
        reconnectAttempts = 0;
        requestPendingCounts();
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

export { connectWebSocket, sendToWebSocket, isWebSocketConnected, pendingPostalCodes, requestPendingCounts };