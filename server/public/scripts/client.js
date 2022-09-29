$(handleReady);

function handleReady() {
  console.log("jquery is loaded!")
  loadItems(); //On page load, show the empty information 
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
function loadItems() {
  $('#pastContainer').text('');
  for(let x of pastGuesses) {
    $('#pastContainer').append(`
     ${x.player1}<br>
    ${x.player2}<br>
    `);

    
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
    url: './getInfo',
    method: 'GET'
  })
  .then ((response) => {
    winner = response;
    if(winner.player1 == true || winner.player2 == true) {
      loadItems();
    } else {
      setHighLow();
      loadItems();
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
