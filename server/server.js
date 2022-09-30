const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;
 // track player guesses
let players = {
  player1: 0,
  player2: 0
}
let whoWon = {
  player1: false,
  player2: false
}
let HL = {
  player1: "low",
  player2: "low"
}

// keep random number to be guessed
let randO = randomGen(1, 25);

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

// GET START
app.get('/info', (req, res) => {
  console.log('IN /info');
  res.send(whoWon);

  whoWon = {
    player1: false,
    player2: false
  }
})

app.get('/getInfo', (req,res) => {
  console.log('IN /getInfo');
  res.send(HL);
})
// GET END

// POST START
app.post('/info', (req, res) => {
  console.log('IN FIRST POST', req.body);
  console.log("THE RANDOM NUMBER IS",randO)
  players.player1 = Number(req.body.player1);
  players.player2 = Number(req.body.player2);
  compareWinners();

  res.sendStatus(201);
})

app.post('/reset', (req, res) => {
  console.log('RESETTING GAME', req.body);
  reset();

  res.sendStatus(201);
})

// POST END
// ------ ROUTES ------

app.listen(PORT, () => {
  console.log ('Server is running on port', PORT)
})

// FUNCTIONS

// randomGen() randomly generate a number between 1-25
function randomGen(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// compare() compare guesses by players to random number
function compareWinners() {

  if(players.player1 == randO) {
    whoWon.player1 = true;
  }

  if(players.player2 == randO) {
    whoWon.player2 = true;
  }

  HL.player1 = players.player1 > randO ? 'high' : 'low';
  HL.player2 = players.player2 > randO ? 'high' : 'low';
  
  console.log(players, whoWon, HL);
}

// reset() reset game state to new start
function reset() {
  randO = randomGen(1, 25);
}