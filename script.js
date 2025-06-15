let correctAnswers = 0;
let totalAnswers = 0;
let realStartups = [];
let fakeStartups = [];
let gameActive = true;

const gameContainer = document.getElementById('gameContainer');
const resultSection = document.getElementById('resultSection');
const resultMessage = document.getElementById('resultMessage');
const correctSpan = document.getElementById('correct');
const totalSpan = document.getElementById('total');
const percentageSpan = document.getElementById('percentage');

async function loadStartupData() {
    const [realResponse, fakeResponse] = await Promise.all([fetch('realstartups.json'), fetch('fakestartups.json')]);
    realStartups = await realResponse.json();
    fakeStartups = await fakeResponse.json();
    loadNewRound();
}

function loadNewRound() {
    resultSection.style.display = 'none';
    gameActive = true;

    const realStartup = realStartups[Math.floor(Math.random() * realStartups.length)];
    const fakeStartup = fakeStartups[Math.floor(Math.random() * fakeStartups.length)];

    const cards = gameContainer.querySelectorAll('.card');
    const isFirstCardReal = Math.random() < 0.5;
    const startups = isFirstCardReal ? [realStartup, fakeStartup] : [fakeStartup, realStartup];

    cards.forEach((card, index) => {
        const startup = startups[index];
        const isReal = (index === 0 && isFirstCardReal) || (index === 1 && !isFirstCardReal);

        card.querySelector('.startup-name').textContent = startup.name;
        card.querySelector('.startup-description').innerHTML = `${startup.description}<br><br><span class="funding-info">${startup.funding}</span>`;

        card.className = 'card';
        card.onclick = () => makeGuess(isReal, card);
    });
}

function makeGuess(isCorrect, clickedCard) {
    if (!gameActive) return;

    gameActive = false;
    totalAnswers++;

    const cards = gameContainer.querySelectorAll('.card');

    if (isCorrect) {
        correctAnswers++;
        resultMessage.textContent = '✔️ That is (allegedly) a real startup.';
        resultMessage.className = 'result-message correct';
        clickedCard.classList.add('correct');

        cards.forEach(card => {
            card.classList.add('disabled');
            if (card !== clickedCard) {
                card.classList.add('incorrect');
            }
        })

    } else {
        resultMessage.textContent = '❌ That was AI generated. Though it should be real!';
        resultMessage.className = 'result-message incorrect';
        clickedCard.classList.add('incorrect');

        cards.forEach(card => {
            card.classList.add('disabled');
            if (card !== clickedCard) {
                card.classList.add('correct');
            }
        });
    }

    updateScore();
    resultSection.style.display = 'block';
}

function updateScore() {
    correctSpan.textContent = correctAnswers;
    totalSpan.textContent = totalAnswers;
    const percentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
    percentageSpan.textContent = `${percentage}%`;
}

document.getElementById('nextBtn').addEventListener('click', loadNewRound);
document.addEventListener('DOMContentLoaded', loadStartupData);
document.getElementById("year").innerHTML = ("© " + new Date().getFullYear() + " All rights reserved.");