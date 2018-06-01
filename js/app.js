/*
 * Global constants and variables
 */
const CARD_CLASS_LIST = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb",
                         "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
const STAR_NUMBER = 3;
let gameStarted = false;
let openedCards = [];
let moveNumber = 0;
let timeCounter = 0;
let solvedCount = 0;
let timeOutSetting;

/*
 * Basic game flow
 */
document.addEventListener('DOMContentLoaded', function () {
    vex.defaultOptions.className = 'vex-theme-top';
    initGame();
});

function initGame(){
    createCardTable(shuffle(CARD_CLASS_LIST));
    createStars(STAR_NUMBER);
    document.querySelector(".restart").addEventListener("click", resetGame);
    document.querySelectorAll(".card").forEach(function(card){
        card.addEventListener("click", function(event) {
            card = event.target;
            // start game on first click
            if (!gameStarted) {
                gameStarted = true;
                timeCounter = 0;
                timeOutSetting = setTimeout(startTimer, 1000);
            }

            // if card can be flipped
            if (openedCards.length < 2){
                console.log(card);
                card.classList.toggle("open");
                card.classList.toggle("show");
                console.log(card);
                openedCards.push(card);
            }
            // check if cards match
            if (openedCards.length === 2){
                checkCardMatch();
            }
        });
    });
}

function checkCardMatch() {
    if (getCardClass(openedCards[0]) === getCardClass(openedCards[1])){
        solvedCount++;
        openedCards.forEach(function(card){
            animateCard(card, "rubberBand");
            card.classList.toggle("match");
        });
    } else {
        openedCards.forEach(function(card){
            animateCard(card, "shake");
        });
    }
    openedCards = [];
    countMove();
    console.log("current solved: " + solvedCount);
    if (solvedCount === 8){
        endGame();
    }
}

// reset game
function resetGame(){
    document.querySelector("ul.deck").innerHTML = "";
    document.querySelector("ul.stars").innerHTML = "";
    // Update Move Number Display
    moveNumber = -1;
    countMove();
    openedCards = [];
    timeCounter = 0;
    solvedCount = 0;
    gameStarted = false;
    clearTimeout(timeOutSetting);
    document.querySelector("#timer").innerHTML = 0;
    // initialize game
    initGame();
}

// game over
function endGame(){
    clearTimeout(timeOutSetting);
    // show prompt
    let stars = document.querySelectorAll(".fa-star").length;
    vex.dialog.confirm({
        message: `Congrats! You won the game with ${moveNumber} moves and ${stars}/3 star rating. Do you want to play again?`,
        callback: function(value){
            if (value){
                resetGame();
            }
        }
    });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Creation functions
 */
function createCardTable(cardClassList) {
    for (cardClass of cardClassList) {
        createCardElement(cardClass);
    }
}

function createCardElement(cardClass) {
    document.querySelector("ul.deck").insertAdjacentHTML('beforeend', `<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

function createStars(numOfStars) {
    for (let i = 0; i < numOfStars; i++) {
        document.querySelector("ul.stars").insertAdjacentHTML('beforeend', '<li class="card"><i class="fa fa-star"></i></li>');
    }
}

function getCardClass(card){
    return card.firstChild.className;
}

function animateCard(card, animateType) {
    card.classList.add("animated", "infinite", animateType);
	setTimeout(function () {
        card.classList.remove("open", "show", "animated", "infinite", animateType);
	}, 600);
}

// starts the timer
function startTimer(){
    timeCounter += 1;
    document.querySelector("#timer").innerHTML = timeCounter;
    timeOutSetting = setTimeout(startTimer, 1000);
}

// move count
function countMove(){
    moveNumber += 1;
    document.querySelector(".moves").innerHTML = moveNumber;
    updateStarRating(moveNumber);
}

// reduce star rating
function updateStarRating(moveNumber){
    let stars = document.querySelectorAll(".fa-star");

    if (stars.length === 1) { return; }

    if ((moveNumber - (STAR_NUMBER - stars.length) * 10 === 10)) {
        stars[stars.length - 1].classList.toggle("fa-star");
        stars[stars.length - 1].classList.toggle("fa-star-o");
    } 
}