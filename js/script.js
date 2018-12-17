'use strict';

var newGameButton = document.getElementById('new-game-button');
var roundsToWinInfo = document.getElementById('roundsToWinInfo');
var round = document.getElementById('result');
var gameWinnerInfo = document.getElementById('score');
var params = {
  playerMove: '',
  computerMove: '',
  wins: '',
  playerScore: 0,
  computerScore: 0,
  roundsAmount: '',
  gameStarted: false,
  counter: 0,
  progress: [],
};

 // funkcja startu gry

function startNewGame () {
  reset();
  showModal('rounds');
   params.gameStarted = true;
   var formButton = document.getElementById('ok');
   formButton.addEventListener('click',function(){
      params.roundsAmount = document.getElementById("form").value;
      hideModal(event);
      roundsToWinInfo.innerHTML = 'Rounds to win info '+params.roundsAmount;
      params.roundsAmount = parseInt(params.roundsAmount);
   });
}

function getComputerMove() {
  var possibleMoves = ['rock', 'paper', 'shears'];
  return possibleMoves[Math.floor(Math.random()*3)];
}

//funkcja która sprawdza wygrną komputera lub gracza

function checkRoundWinner(playerMoveArgument) {
  if(params.gameStarted === true) {
    params.playerMove = playerMoveArgument;
    params.computerMove = getComputerMove();
    params.wins =  'player';

    if (params.playerMove === params.computerMove) {
      params.wins = 'no one';
    } else if ((params.computerMove == 'rock' &&  params.playerMove == 'shears') ||
      (params.computerMove == 'shears' &&  params.playerMove == 'paper') ||
      (params.computerMove == 'paper' &&  params.playerMove == 'rock')) {
        params.wins = 'computer';
      }
    displayTheWinner(params.wins, params.playerMove,params.computerMove);
    converter(params.wins);
    showResults(params.playerScore,params.computerScore);
    saveRoundResult();
    if(params.computerScore === params.roundsAmount || params.playerScore === params.roundsAmount) {
      setGameEnd(params.playerScore,params.roundsAmount);
    }
  }
}

//funkcja wyswietlająca wynik rundy

function displayTheWinner(wins,playerMove,computerMove) {
  const output = document.getElementById('output');
  if (params.wins === 'player') {
      output.innerHTML = 'YOU WON! ' + 'You played '+params.playerMove+' Computer played '+params.computerMove;
  } else if(params.wins === 'computer'){
      output.innerHTML = 'COMPUTER WON!' + ' Computer played '+params.computerMove+' You played '+params.playerMove;
    } else {
      output.innerHTML = 'DROW!' + ' Computer played '+params.computerMove+' You played '+params.playerMove;
    }
}
function showResults(playerScore,computerScore) {
 round.innerHTML = 'Player score: '+params.playerScore+ ' - '+'Computer score: '+params.computerScore;
}
function converter(wins) {
  if(params.wins === 'player') {
    params.playerScore++;
  }
  else if(params.wins === 'computer'){
        params.computerScore++;
      }
   else {
     return null;
   }
}

function createResultObject () {
  var progressObject = {};
  progressObject.counter = params.counter;
  progressObject.playerMove = params.playerMove;
  progressObject.computerMove = params.computerMove;
  progressObject.roundScore = params.wins;
  progressObject.gameScore = params.playerScore + " - " + params.computerScore;
  return progressObject ;
}
function saveRoundResult () {
  params.progress.push(createResultObject());
}

function createTableContent () {
  var table = document.querySelector('#gameResults tbody');
  table.innerHTML = "";
  for(var i=0;i<params.progress.length;i++){
    var newRow = document.createElement('tr');
    var rowContent =
        '<td>'
          + params.progress[i].counter +
        '</td>' +
        '<td>'
          + params.progress[i].playerMove +
        '</td>' +
        '<td>'
          + params.progress[i].computerMove +
        '</td>' +
        '<td>'
          + params.progress[i].roundScore +
        '</td>' +
        '<td>'
          + params.progress[i].gameScore +
        '</td>';
    newRow.innerHTML = rowContent;
    table.appendChild(newRow);
  }
}

function setGameEnd (playerScore, roundAmount) {
   params.gameStarted = false;
   var header = document.querySelector("#score .content h3");
   createTableContent();
   if(params.playerScore === params.roundsAmount ) {
     header.innerHTML = 'YOU WON THE ENTIRE GAME!!!';
   }else {
     header.innerHTML = 'COMPUTER WON THE ENTIRE GAME!!!';
   }
   showModal('score');
}
function reset () {
  output.innerHTML = "";
  roundsToWinInfo.innerHTML = "";
  round.innerHTML = "";
  params.wins = '';
  params.computerScore = 0;
  params.playerScore = 0;
  params.counter = 0;
  params.progress = [];
  params.computerMove = '';
  params.playerMove = '';
}
// add event listeners  - buttons with a loop czyli guziki z pentelką

var playerMoveButtons = document.querySelectorAll('.player-move');
for (var i=0; i< playerMoveButtons.length; i++){
  var playerMoveButton = playerMoveButtons[i];
  playerMoveButton.addEventListener('click', function() {
    var clickedButton = event.target;
    var playerMove = clickedButton.getAttribute('data-move');
    if (params.gameStarted) {
      params.counter++;
      checkRoundWinner(playerMove);
    } else {
      showModal('game-over');
    }
  });
}

newGameButton.addEventListener('click', function() {
  startNewGame();
});

/* MODALs OPERATIONS */

var modals = document.getElementsByClassName('modal');

/* prevent for close modal after click inside modal */

for(var i = 0; i < modals.length; i++){
  modals[i].addEventListener('click', function(event){
    event.stopPropagation();
  });
}

function removeShowClass () {
  for(var i=0;i<modals.length;i++){
    var modal = modals[i];
    modal.classList.remove('show');
  }
}

var hideModal = function(event){
  event.preventDefault();
  document.querySelector('#modal-overlay').classList.remove('show');
};

var closeButtons = document.querySelectorAll('.modal .close');

for(var i = 0; i < closeButtons.length; i++){
  closeButtons[i].addEventListener('click', hideModal);
}
document.querySelector('#modal-overlay').addEventListener('click', hideModal);

var showModal = function(id) {
  removeShowClass();
  var modalToShow = modals.namedItem(id);
  modalToShow.classList.add('show');
  document.querySelector('#modal-overlay').classList.add('show');
};
