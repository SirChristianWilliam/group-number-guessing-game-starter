$(handleReady);

function handleReady() {
  console.log("jquery is loaded!")
  loadItems('none'); //On page load, show the empty information 
  $('#myForm').on('submit',submitOn);
}

//Global variable objects
const pastGuesses = [];

let winner = {
  player1: false,
  player2: false
}
let highOrLow = {
  player1: "low",
  player2: "low"
}
//Global variable objects.

//loadItems is our render
let coolio= "";

function loadItems(win) {
   let winEnum = {
    'winP1':0,
    'winP2':1,
    'none':2
  }

if(win == 'winP1') {
  coolio = "SUP";
}else if (win == 'winP2') {
  coolio = "HAAAAAY";
}else {
  coolio = "";
}
  $('#rowContent').text('');
      for(let i=0; i<pastGuesses.length; ++i/* let x of pastGuesses */) {

        $('#rowContent').append(`
        <tr id="${i}">
          <td>${pastGuesses[i].player1}</td>
          <td>${pastGuesses[i].player2}</td>
          <td id="coolVar"> ${coolio}</td>
          <td>Hello </td>
        </tr>
        `);
      }

  switch(winEnum[win]) {
    case 0: 
      console.log('PLAYER ONE WINNER');
       break;
    case 1: 
      console.log('PLAYER TWO WINNER');
 
      break;
    default: 
      console.log('NO ONE WINS');
 
      
  }

  $('#chris').empty();
  $('#adam').empty();

}

function submitOn(evt) {
  evt.preventDefault();

  let guesses = {
    player1: $('#chris').val(),
    player2: $('#adam').val()
  }

  pastGuesses.push(guesses);
  $('#container').empty();
  $('#container').append ( `
    Player 1 guess: ${guesses.player1} <br>
    Player 2 guess: ${guesses.player2} <br>
  `)

  $.ajax({
    url: './info',
    method: 'POST',
    data: guesses
  })
  .then((response) => {
    console.log("sending guesses over", response);
    useWinner();
  })
  .catch(err => {
    console.log("POST /info error", err);
  })
}

function useWinner() {
  $.ajax({
    url: './info',
    method: 'GET'
  })
  .then ((response) => {
    winner = response;
    if(winner.player1 == true) {
      loadItems('winP1');
    } else if (winner.player2 == true) {
      loadItems('winP2');
    }
    else {
      setHighLow();
      loadItems('none');
    }
  })
 }

 function setHighLow() {
  $.ajax({
    url: './getInfo',
    method: 'GET'
  })
  .then((response) => {
    highOrLow = response;
  })
 }
