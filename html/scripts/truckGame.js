import { getSelectedPostalCodes, updatePostalCodeLists, disablePostalCodeClicks, enablePostalCodeClicks } from './postalCodeManager.js';

let isGameActive = false;
let currentChallenge = null;
let selectedPostalCodes = null;
let score = 0;
let attempts = 0;
const MAX_ATTEMPTS = 3;

export function initializeTruckGame(svgElement) {
    const truckGameButton = document.getElementById('truck-game');
    truckGameButton.addEventListener('click', () => toggleTruckGame(svgElement));
}

function toggleTruckGame(svgElement) {
    isGameActive = !isGameActive;
    if (isGameActive) {
        startGame(svgElement);
    } else {
        endGame(svgElement);
    }
}

function startGame(svgElement) {
    console.log('Starting truck game');
    
    disablePostalCodeClicks();
    
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('transport-companies').style.display = 'none';
    
    selectedPostalCodes = getSelectedPostalCodes();
    untoggleAllPostalCodes();
    
    const challengeArea = document.createElement('div');
    challengeArea.id = 'challenge-area';
    challengeArea.innerHTML = `
        <h2>Find the Postal Code</h2>
        <p id="current-challenge"></p>
        <p id="game-info">Score: <span id="score">0</span> | Attempts left: <span id="attempts-left">${MAX_ATTEMPTS}</span></p>
        <p id="clicked-info"></p>
    `;
    document.getElementById('transport-companies').insertAdjacentElement('afterend', challengeArea);
    
    svgElement.addEventListener('click', handlePostalCodeClick);
    
    score = 0;
    newChallenge();
}

function endGame(svgElement) {
    console.log('Ending truck game');
    
    enablePostalCodeClicks();
    
    document.getElementById('sidebar').style.display = 'block';
    document.getElementById('transport-companies').style.display = 'block';
    
    document.getElementById('challenge-area').remove();
    
    svgElement.removeEventListener('click', handlePostalCodeClick);
    
    restoreSelectedPostalCodes();
    clearAllColors();
}

function untoggleAllPostalCodes() {
    document.querySelectorAll('#map-container svg path').forEach(path => {
        path.classList.remove('selected', 'loading', 'delivery');
    });
    updatePostalCodeLists();
}

function restoreSelectedPostalCodes() {
    if (selectedPostalCodes) {
        document.querySelectorAll('#map-container svg path').forEach(path => {
            if (selectedPostalCodes.loading.includes(path.id)) {
                path.classList.add('selected', 'loading');
            } else if (selectedPostalCodes.delivery.includes(path.id)) {
                path.classList.add('selected', 'delivery');
            }
        });
        updatePostalCodeLists();
    }
}

function newChallenge() {
    const countries = Array.from(document.querySelectorAll('#map-container svg > g')).map(g => g.id);
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const postalCodes = Array.from(document.querySelectorAll(`#map-container svg > g#${randomCountry} path`)).map(path => path.id);
    const randomPostalCode = postalCodes[Math.floor(Math.random() * postalCodes.length)];
    
    currentChallenge = { country: randomCountry, postalCode: randomPostalCode };
    document.getElementById('current-challenge').textContent = `Find postal code ${randomPostalCode} in ${randomCountry}`;
    document.getElementById('clicked-info').textContent = '';
    attempts = 0;
    updateGameInfo();
}

function handlePostalCodeClick(event) {
    if (!isGameActive || !currentChallenge) return;
    
    const clickedPath = event.target.closest('path');
    if (!clickedPath) return;
    
    const clickedPostalCode = clickedPath.id;
    const clickedCountry = clickedPath.closest('g').id;
    
    document.getElementById('clicked-info').textContent = `Clicked: ${clickedPostalCode} in ${clickedCountry}`;
    
    if (clickedCountry === currentChallenge.country && clickedPostalCode === currentChallenge.postalCode) {
        clickedPath.style.fill = 'green';
        score += 10;
        setTimeout(() => {
            clearAllColors();
            newChallenge();
        }, 1000);
    } else {
        clickedPath.style.fill = 'red';
        score = Math.max(0, score - 1);
        attempts++;
        
        if (attempts >= MAX_ATTEMPTS) {
            const correctPath = document.getElementById(currentChallenge.postalCode);
            correctPath.style.fill = 'blue';
            setTimeout(() => {
                clearAllColors();
                newChallenge();
            }, 2000);
        }
    }
    
    updateGameInfo();
}

function updateGameInfo() {
    document.getElementById('score').textContent = score;
    document.getElementById('attempts-left').textContent = MAX_ATTEMPTS - attempts;
}

function clearAllColors() {
    document.querySelectorAll('#map-container svg path').forEach(path => {
        path.style.fill = '';
    });
}