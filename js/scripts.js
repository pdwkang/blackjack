//---------------------------------
//---------------------------------
//-------------GLOBALS-------------
var theDeck = createDeck(6);  //save whatever function returned
var playerHands = [];
var dealerHands = [];


$(document).ready(function(){
	$('.deal-button').click(function(){
		playerHands.push(theDeck[0]);
		playerHands.push(theDeck[2]);

		placeCard('player', 'one', playerHands[0]);
		placeCard('player', 'two', playerHands[1]);
		console.log(playerHands)
		dealerHands.push(theDeck[1]);
		dealerHands.push(theDeck[3]);

		placeCard('dealer', 'one', dealerHands[0]);
		placeCard('dealer', 'two', dealerHands[1]);

	});

	$('.hit-button').click(function(){

	});

	$('.stand-button').click(function(){
	});

	$('.split-button').click(function(){
	});

	$('.doubleDown-button').click(function(){
	});

	$('.shuffle-button').click(function(){
		shuffleDeck();
	});
});


function createDeck(numberOfDecks){
	var newDeck =[];
	var suits = ['h','s','d','c'];
	for(let i=0; i<numberOfDecks; i++){
		for(let j=0; j<suits.length; j++){
			for(let k=1; k<=13; k++){
				newDeck.push(k + suits[j]);
			}	
		}
	};	return newDeck;
	console.log(newDeck)
}


function shuffleDeck(){
	for (let i = 0; i<10000; i++){
		var random1 = Math.floor(Math.random() * theDeck.length);
		var random2 = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[random1];
		theDeck[random1] = theDeck[random2];
		theDeck[random2] = temp;
	}
};

function placeCard(who, where, whatCard){
	var classSelector = '.' + who + '-cards .card-' + where;
	$(classSelector).html('<img src="images/' + whatCard + '.png">');
	console.log(whatCard)
}















shuffleDeck();