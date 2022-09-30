$(handleReady);

function handleReady() {
  console.log("jquery is loaded!")
  loadItems('none'); //On page load, show the empty information 

  $('#myForm').on('submit',submitOn);

  $('#resetBtn').on('click', resetClient);
}
//Global variable objects
let pastGuesses = {
  player1: 0,
  player2: 0,
  history: false
};

let i=1;

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
function loadItems(win) {

  let winEnum = {
    'winP1':0,
    'winP2':1,
    'none':2
  }

  if(pastGuesses.history) {
    $('#rowContent').append(`
    <tr id="${i}">
      <td>${pastGuesses.player1}</td>
      <td>${pastGuesses.player2}</td>
      <td>${highOrLow.player1}</td>
      <td>${highOrLow.player2}</td>
    </tr> 
    `);

    ++i;

    $('#response').empty();
    switch(winEnum[win]) {
    case 0: 
      console.log('PLAYER ONE WINNER');
      $(`#response`).append('<h1>PLAYER ONE WINNER!!!!!</h1>');

      $('#dancing').removeClass('hideIt');
      $('#dancing').addClass('shown');
      // $('#addGuess').prop('disabled', true);
      // $('#resetBtn').prop('disabled', false);
      break;
    case 1: 
      console.log('PLAYER TWO WINNER');
      $(`#response`).append('<h1>PLAYER TWO WINNER!!!!!</h2>');

       $('#dancing').removeClass('hideIt');
      $('#dancing').addClass('shown');

      // $('#addGuess').prop('disabled', true);
      // $('#resetBtn').prop('disabled', false);
      break;
    default: 
      console.log('NO ONE WINS');
      $(`#response`).append('<h1>TRY AGAIN</h2>');
    }
  }

  $('#rounds').empty();
  $('#rounds').append(`
    <h2>ROUND: ${i}</h2>
  `)

  $('#chris').empty();
  $('#adam').empty();

}

function submitOn(evt) {
  evt.preventDefault();

  let guesses = {
    player1: $('#chris').val(),
    player2: $('#adam').val()
  }

  pastGuesses = guesses;
  pastGuesses.history = true;

  $('#guesses').empty();
  $('#guesses').append ( `
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

  $('#chris').val('');
  $('#adam').val('');
}

function useWinner() {
  $.ajax({
    url: './info',
    method: 'GET'
  })
  .then ((response) => {
    winner = response;
    if(winner.player1) {
      loadItems('winP1');
    } else if (winner.player2) {
      loadItems('winP2');
    }
    else {
      setHighLow();
    }
  })
  .catch((err) => {
    console.log('Something went wrong! useWinner GET');
  })
}

function setHighLow() {
  $.ajax({
    url: './getInfo',
    method: 'GET'
  })
  .then((response) => {
    console.log('in setHighLow GET', response);
    highOrLow = response;
    loadItems('none');
  })
  .catch((error) => {
    console.log('Something went wrong! ; setHighLow GET');
  })
}

function resetClient() {
  $('#dancing').addClass('hideIt');

  $.ajax({
    url: '/reset',
    method: 'POST',
    data: {
      max: $('#numRange').val()
    }
  })
    .then((res) => {
      console.log('Resetting game!', res);
    
    })
    .catch((err) => {
      console.log('Something went wrong! resetClient', err);
    })

  i = 1;

  pastGuesses = {
    player1: 0,
    player2: 0,
    history: false
  }

  winner = {
    player1: false,
    player2: false
  }

  highOrLow = {
    player1: 'low',
    player2: 'low'
  }

  $('#guesses').empty();
  $('#guesses').append ( `
    Player 1 guess: 0 <br>
    Player 2 guess: 0 <br>
  `)

  $('#response').empty();
  $('#rowContent').empty();

  // $('#addGuess').prop('disabled', false);
  // $('#resetBtn').prop('disabled', true);

  $('#chris').val('');
  $('#adam').val('');

  loadItems('none');
}