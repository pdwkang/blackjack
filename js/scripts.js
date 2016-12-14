// ------------------------	
// --------GLOBALS---------
// ------------------------	
var theDeck = [];
var dealerHands = [];
var playerHands = [];
var newDeal = true;


$(document).ready(function(){
	// get deal working
	$('.deal-button').click(function(){
		createDeck();
		shuffleDeck();
		playerHands.push(theDeck[0]);
		dealerHands.push(theDeck[1]);
		playerHands.push(theDeck[2]);
		dealerHands.push(theDeck[3]);

		// put the first card in the players hands
		placeCard(playerHands[0], 'player', 'one')
		// put the second card in the players hands
		placeCard(playerHands[1], 'player', 'two')
		placeCard(dealerHands[0], 'dealer', 'one')
		calculateTotal('player', playerHands);
		calculateTotal('dealer', dealerHands);
		newDeal = false;
		//have to reset dealcount later when hand ends
	});

	$('.hit-button').click(function(){
		playerHands.push(theDeck[4]);
		placeCard(playerHands[2], 'player', 'three')
		calculateTotal('player', playerHands);

	});

	// $('.doubleDown-button').click(function(){
	// });
	// $('.split-button').click(function(){
	// });

	$('.stand-button').click(function(){
		placeCard(dealerHands[1], 'dealer', 'two')
		newDeal = false;
	});	
})








function createDeck(){
	// fill the deck with: 52 cards, 4 suits(h,s,d,c), 1-13(11 = J, 12 = Q, 13 = K)
	var suits = ['h','s','d','c'];
	// loop thru all 4 suits(suits array)
	for(let s = 0; s < suits.length; s++){
		// loop thru all 13 cards for each suits
		for(let c = 1; c <= 13; c++){
			theDeck.push(c + suits[s])
		}
	}
}


function shuffleDeck(){
	for(let i = 0; i<5000; i++){
		var randomCard1 = Math.floor(Math.random()*26);
		var randomCard2 = Math.floor(Math.random()*26)+26;
		var temp = theDeck[randomCard1];
		theDeck[randomCard1] = theDeck[randomCard2];
		theDeck[randomCard2] = temp;
	}
}




function placeCard(whatCard, who, whichSlot){
	var classToTarget = "." + who + '-cards .card-' + whichSlot;
	$(classToTarget).html('<img src="images/' + whatCard + '.png">');
	$(classToTarget).hide();
	
	if(classToTarget === ".dealer-cards .card-one"){
		$(classToTarget).delay(600).slideDown('slow');	
	}else if(classToTarget === ".player-cards .card-two"){
		$(classToTarget).delay(1200).slideDown('slow');	
	}else if((classToTarget === ".dealer-cards .card-two")&&(newDeal)){
		$(classToTarget).hide();
	}else{
		$(classToTarget).slideDown('slow');	
	}
}


function calculateTotal(who, theirHand){
	var cardvalue = 0;
	var total = 0;
	for(let i = 0; i< theirHand.length; i++){
		if((newDeal)&&(who==='dealer')&&(i===1)){
		}else{
			cardValue = Number(theirHand[i].slice(0, -1))
			if(cardValue>10){cardValue=10};
			if((cardValue===1)&&(total<11)){cardValue=11
			};
			total += cardValue;
		}
	}
	var classToTarget = '.' + who + '-total-number';
	$(classToTarget).text(total);
}
// get deal working
// Shuffle the new deck
// Update the DOM with the player cards
// Get hit working
// Put the card in the right place
// Update the total
// Check if the player busted
// Get stand working
// Run the dealer “hit” until it has more than 16
// Once dealer has more than 16, checkwin
// Post a message after checkwin


