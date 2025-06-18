let correctAnswers = 0;
let totalAnswers = 0;
let realStartups = [];
let fakeStartups = [];
let gameActive = true;
let usedRealStartups = [];
let usedFakeStartups = [];

const gameContainer = document.getElementById('gameContainer');
const resultSection = document.getElementById('resultSection');
const resultMessage = document.getElementById('resultMessage');
const correctSpan = document.getElementById('correct');
const totalSpan = document.getElementById('total');
const percentageSpan = document.getElementById('percentage');
const scoreSummary = document.getElementById('scoreSummary');


async function loadStartupData() {
    const [realResponse, fakeResponse] = await Promise.all([fetch('realstartups.json'), fetch('fakestartups.json')]);
    realStartups = await realResponse.json();
    fakeStartups = await fakeResponse.json();
    loadNewRound();
}

function getRandomUnusedStartup(startups, usedStartups) {
    const availableStartups = startups.filter(startup => !usedStartups.some(used => used.name === startup.name));

    if (availableStartups.length === 0) {
        usedStartups.length = 0;
        return startups[Math.floor(Math.random() * startups.length)];
    }

    return availableStartups[Math.floor(Math.random() * availableStartups.length)];
}

function loadNewRound() {
    resultSection.style.display = 'none';
    scoreSummary.style.display = 'none';
    gameActive = true;

    const realStartup = getRandomUnusedStartup(realStartups, usedRealStartups);
    const fakeStartup = getRandomUnusedStartup(fakeStartups, usedFakeStartups);

    usedRealStartups.push(realStartup);
    usedFakeStartups.push(fakeStartup);

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

    if (totalAnswers % 5 === 0) {
        setTimeout(showScoreSummary, 900);
    } else {
        resultSection.style.display = 'block';
    }
}

function updateScore() {
    correctSpan.textContent = correctAnswers;
    totalSpan.textContent = totalAnswers;
    const percentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
    percentageSpan.textContent = `${percentage}%`;
}

function showScoreSummary() {
    const finalScoreElement = document.getElementById('finalScore');
    const scoreMessageElement = document.getElementById('scoreMessage');

    gameContainer.style.display = 'none';
    resultSection.style.display = 'none';
    scoreSummary.style.display = 'block';

    finalScoreElement.textContent = `🎯 ${correctAnswers} / ${totalAnswers}`;

    if (correctAnswers / totalAnswers >= 0.9) {
        scoreMessageElement.textContent = 'Y Combinator GOAT! 🚀';
    } else if (correctAnswers / totalAnswers >= 0.6) {
        scoreMessageElement.textContent = 'One pivot away from Demo Day!';
    } else {
        scoreMessageElement.textContent = "YC this YC that Y can't we C any revenue?";
    }
}

function shareOnTwitter() {
    const text = `I just scored ${correctAnswers}/${totalAnswers} on "VC or GPT" - can you tell the difference between real startups and AI-generated ones? VCorGPT.com`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

function shareOnWhatsApp() {
    const text = `I just scored ${correctAnswers}/${totalAnswers} on "VC or GPT" - can you tell the difference between real startups and AI-generated ones? VCorGPT.com`;
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
}

function continueGame() {
    scoreSummary.style.display = 'none';
    gameContainer.style.display = 'flex';
    loadNewRound();
}

document.getElementById('nextBtn').addEventListener('click', loadNewRound);
document.addEventListener('DOMContentLoaded', loadStartupData);
document.getElementById("year").innerHTML = ("© " + new Date().getFullYear() + " All rights reserved.");