
import { getCards } from "./card-data.mjs";

const submitIdButton = document.getElementById('submit-id-button');
const idInput = document.getElementById('id-input');
const idWarning = document.getElementById('id-warning');

const bingoCards = getCards();

function handleCardToggling(e) {
    let elementToToggle = e.target.closest('.number-square-group');
    if (elementToToggle) {
        elementToToggle.classList.toggle('toggled');
    }
}

function showBingoCardForId(id) {
    const card = bingoCards.find(card => card.id === id);
    document.getElementsByClassName('bingo-card-main')[0].innerHTML = card.getSVG();
}

submitIdButton.addEventListener('click', () => {

    const isValidId = bingoCards.some(card => card.id === idInput.value);

    if (isValidId) {
        showBingoCardForId(idInput.value);
    } else {
        idWarning.innerHTML = 'This ID is invalid.';
    }

});

document.body.addEventListener('click', handleCardToggling);

window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave?';
});
