//---------------------------------
//---------------------------------
//-------------GLOBALS-------------
var theDeck = createDeck(1);  //saves whatever function returned
var playerHands = [];
var dealerHands = [];
var firstPair=[];
var secondPair=[];
var dealerCard2
var valueOfDC2

var hitCounter = 0;
//  0: deal     
//  1: hit/stand/doubledown     
//  2: 
//  3: math for dealer two cards
//  4: double down (doubling the bet)
//  6: jquery splitting delay(split)
//  7: 2nd pair total calc(split) 
//	   and 1st pair hitting
//  8: 1st pair calculation(split)
//  9: 2nd pair hitting (split)      
// 10: 2nd pair final total calc   

var placeBet = true;
var myCoin = 1000;
var myBet = 0; // later get input from user
var didIWin = false;

$(document).ready(function(){
	$('.deal-button').click(function(){
		if((!hitCounter)&&(myBet>0)){
			$(this).removeClass('flip');
			$(this).addClass('flip');
			reset();
			// theDeck[0]='1s'
			// theDeck[1]='10h'			
			playerHands.push(theDeck.shift());
			playerHands.push(theDeck.shift());
			dealerHands.push(theDeck.shift());
			dealerHands.push(theDeck.shift());
			placeCard('player', 1, playerHands[0]);
			placeCard('player', 2, playerHands[1]);
			placeCard('dealer', 1, dealerHands[0]);
			placeCard('dealer', 2, dealerHands[1]);	
			calculateTotal(playerHands, 'player');
			calculateTotal(dealerHands, 'dealer');
			hitCounter=1;
			if(calculateTotal(playerHands, 'player')===21){
			placeCard('dealer', 2, dealerHands[1]);
			checkWin();
			}
		}
	});

	$('.hit-button').click(function(){
		$('.deal-button').removeClass('flip');
		if((hitCounter===1)||(hitCounter===2)){
			if(calculateTotal(playerHands,'player') < 21){
				playerHands.push(theDeck.shift());		
				var lastCardIndex = playerHands.length-1;
				var slotForNewCard = playerHands.length;
				placeCard('player', slotForNewCard, playerHands[lastCardIndex]);
				calculateTotal(playerHands, 'player');
				hitCounter=2
				if(calculateTotal(playerHands, 'player') >= 21){
					placeCard('dealer', 2, dealerHands[1]);
					checkWin();
				}
			}else{
				checkWin() // for blackjack
			}
			//first card during split			
		}else if(hitCounter===7){
			// console.log('aaa')
			if(calculateTotal(firstPair,'player') < 21){
				playerHands.push(theDeck.shift());		
				var lastCardIndex = playerHands.length-1;
				placeCard('player', 3, playerHands[lastCardIndex]);
				firstPair.push(playerHands[lastCardIndex])
				hitCounter = 8
				calculateTotal(firstPair, 'player1');
			}
			//second card during split
		}else if(hitCounter===9){
			if(calculateTotal(secondPair,'player') < 21){
				playerHands.push(theDeck.shift());		
				var lastCardIndex = playerHands.length-1;
				placeCard('player', 6, playerHands[lastCardIndex]);
				secondPair.push(playerHands[lastCardIndex])
				hitCounter = 10
				calculateTotal(secondPair, 'player2');
				//stay code
				if(hitCounter>0){
					placeCard('dealer', 2, dealerHands[dealerHands.length - 1]);		
					var	dealerTotal = calculateTotal(dealerHands, 'dealer');
					while(dealerTotal<17){
					dealerHands.push(theDeck.shift())
					var lastCardIndex = dealerHands.length - 1;
					var slotForNewCard = dealerHands.length;
					placeCard('dealer', slotForNewCard, dealerHands[lastCardIndex])
					dealerTotal = calculateTotal(dealerHands, 'dealer')
					}
				checkWin2();
				}				
			}
		}
	});

	$('.stand-button').click(function(){
		if(hitCounter>0){
			hitCounter = 3
			placeCard('dealer', 2, dealerHands[dealerHands.length - 1]);		
			var	dealerTotal = calculateTotal(dealerHands, 'dealer');
			while(dealerTotal<17){
				dealerHands.push(theDeck.shift())
				var lastCardIndex = dealerHands.length - 1;
				var slotForNewCard = dealerHands.length;
				placeCard('dealer', slotForNewCard, dealerHands[lastCardIndex])
				dealerTotal = calculateTotal(dealerHands, 'dealer')
			}
			if(hitCounter>5){checkWin2()}else{checkWin();}
		}
	});

	$('.split-button').click(function(){       // you only get one hit after split
		if((hitCounter===1)
			&&(Number(playerHands[0].slice(0, -1))===1)
			&&(Number(playerHands[1].slice(0, -1))===1))
			{
			placeCard('player', 4, playerHands[1]);
			$('.player-cards .card-2').html('');
			$('.player-cards .card-4').css({'border-left':'2px solid black'})
			playerHands.push(theDeck.shift());   //3th   [2]
			playerHands.push(theDeck.shift());   //4th   [3]
			hitCounter=6
			placeCard('player', 2, playerHands[2]);
			placeCard('player', 5, playerHands[3]);

			firstPair = [playerHands[0], playerHands[2]]   //first two cards after split
			secondPair = [playerHands[1], playerHands[3]]
			calculateTotal(firstPair, 'player1');
			hitCounter = 7;      // split condition
			calculateTotal(secondPair, 'player2');	
			// console.log(firstPair)
			placeCard('dealer', 2, dealerHands[dealerHands.length - 1]);		
			var	dealerTotal = calculateTotal(dealerHands, 'dealer');
			while(dealerTotal<17){
				dealerHands.push(theDeck.shift())
				var lastCardIndex = dealerHands.length - 1;
				var slotForNewCard = dealerHands.length;
				placeCard('dealer', slotForNewCard, dealerHands[lastCardIndex])
				dealerTotal = calculateTotal(dealerHands, 'dealer');}
			checkWin2();
		}		
	});

	$('.doubleDown-button').click(function(){
		console.log(hitCounter)
		if(hitCounter!==2){
			myBet = myBet * 2;
			displayMoney();
			if(hitCounter===1){
			if(calculateTotal(playerHands,'player') < 21){
				playerHands.push(theDeck.shift());		
				var lastCardIndex = playerHands.length-1;
				var slotForNewCard = playerHands.length;
				placeCard('player', slotForNewCard, playerHands[lastCardIndex]);
				calculateTotal(playerHands, 'player');
			}else {
				checkWin()  //if this runs, hitcounter = 0
			};
			//stand-button code copied below
			if(hitCounter>0){  // if bust hit condition wud be 0 so this wont run
				var tempFunc = placeCard('dealer', 2, dealerHands[dealerHands.length - 1]);
				if(calculateTotal(playerHands,'player') < 21){setTimeout(tempFunc, 5000);
					var	dealerTotal = calculateTotal(dealerHands, 'dealer');
					while(dealerTotal<17){
						dealerHands.push(theDeck.shift())
						var lastCardIndex = dealerHands.length - 1;
						var slotForNewCard = dealerHands.length;
						placeCard('dealer', slotForNewCard, dealerHands[lastCardIndex]);
						dealerTotal = calculateTotal(dealerHands, 'dealer');
					}
				}
				hitCounter = 4
			checkWin();}
			}		
		}
	});
	$('.button10').click(function(){
		if(myCoin >= 10){myBet += 10;
		myCoin -= 10}
		displayMoney();
	})
	$('.button50').click(function(){
		if(myCoin >= 50){myBet += 50; 
		myCoin -= 50}
		displayMoney();
	})
	$('.button100').click(function(){
		if(myCoin >= 100){myBet += 100;
		myCoin -= 100}
		displayMoney();
	})		
	$('.button500').click(function(){
		if(myCoin >= 500){myBet += 500; 
		myCoin -= 500}
		displayMoney();
	})

	$('.reset-bet').click(function(){
		myCoin += myBet;
		myBet = 0;
		displayMoney();
	})

});

function displayMoney(){
	$('#myCoin').html(myCoin);
	$('#betAmount').html(myBet);
}
// var dealerTotal = 0;

function createDeck(numberOfDecks){
	var newDeck =[];
	var suits = ['h','s','d','c'];
	for(let i=0; i<numberOfDecks; i++){
		for(let j=0; j<suits.length; j++){
			for(let k=1; k<=13; k++){
				newDeck.push(k + suits[j]);
			}	
		}
	};	return newDeck;}
function shuffleDeck(){
	for(let i = 0; i<10000; i++){
		var random1 = Math.floor(Math.random() * theDeck.length);
		var random2 = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[random1];
		theDeck[random1] = theDeck[random2];
		theDeck[random2] = temp;
	}};
function placeCard(who, where, whatCard){
	var classSelector = '.' + who + '-cards .card-' + where;
	$(classSelector).html('<img src="images/' + whatCard + '.png">');
	$(classSelector).hide();
	
	if(classSelector === ".dealer-cards .card-1"){
		$(classSelector).delay(600).slideDown('slow');	
	}else if(classSelector === ".player-cards .card-2"){
		$(classSelector).delay(1200).slideDown('slow');
	}else if(classSelector === ".player-cards .card-3"){
		$(classSelector).slideDown('slow');			
	}else if(classSelector === ".dealer-cards .card-2"){
		if(!hitCounter){
		$(classSelector).html('<img src="images/empty.png">');
		$(classSelector).delay(1800).fadeIn('slow');
		dealerCard2 = classSelector;
		valueOfDC2 ='<img src="images/' + whatCard + '.png">';
		}else{
		$(dealerCard2).html(valueOfDC2);
		$(dealerCard2).delay(400).slideDown('slow');
		}
	}else if(classSelector === ".dealer-cards .card-3"){
		$(classSelector).delay(600).slideDown('slow');	
	}else if(classSelector === ".dealer-cards .card-4"){
		$(classSelector).delay(1200).slideDown('slow');	
	}else if(classSelector === ".dealer-cards .card-5"){
		$(classSelector).delay(1800).slideDown('slow');
	}else if(classSelector === ".dealer-cards .card-6"){
		$(classSelector).delay(2400).slideDown('slow');							
	}else if((classSelector === ".player-cards .card-3")&&
		(hitCounter===6)){
		$(classSelector).delay(1200).slideDown('slow');	
	}else if((classSelector === ".player-cards .card-5")&&
		(hitCounter===6)){
		$(classSelector).delay(1800).slideDown('slow');							
	}else{$(classSelector).hide();
		$(classSelector).delay(100).slideDown('slow');
	}
}	

function calculateTotal(hand, who){
	var numberOfAces = 0;
	var total = 0;
	var cardValue = 0;
	for(let i=0; i<hand.length; i++){
		if((hitCounter<2)&&(who==='dealer')&&(i===1)){
			//leave it empty
		}else{
			cardValue = Number(hand[i].slice(0, -1))
			if(cardValue>10){cardValue=10};

			if(cardValue===1){
				numberOfAces++;
				cardValue = 11};
			total += cardValue;
		};

		if((total>21)&&(numberOfAces>0)){
			total -= 10;
			numberOfAces -= 1		
		}
	}
	var classSelector = '.' + who + '-total-number';
	if(hitCounter===6){
		$(classSelector).text(total);
	}else if(hitCounter===7){
		$(classSelector).text(total);
	}else if(hitCounter===8){
		$(classSelector).text(total);
		hitCounter = 9
	}else if(hitCounter===10){
		$(classSelector).text(total);
	}else{
		$(classSelector).text(total);	
	};
	if(hitCounter>6){
		$('.player-total-number').text("");			
	}
	return total}
function checkWin(){
	hitCounter=2;
	var playerTotal = calculateTotal(playerHands, 'player');
	var dealerTotal = calculateTotal(dealerHands, 'dealer');
	if(playerTotal>21){
			console.log('dealer wins')
	}else if(dealerTotal>21){
		myCoin += (myBet*2)
			console.log('you won ' + myBet)
	}else{
		if(playerTotal>dealerTotal){
			myCoin += (myBet*2);
			if((playerHands.length ===2)&&(playerTotal===21)){
			myCoin += myBet/2;
			console.log('blackjack you won +' + myBet/2)
			}
			console.log('you won ' + myBet)
		}else if(dealerTotal>playerTotal){
			console.log('dealer wins')
		}else{
			myCoin += myBet
		}
	};



	hitCounter = 0;
	myBet = 0;
	displayMoney();
}

function checkWin2(){
	hitCounter=2;
	var player1 = calculateTotal(firstPair, 'player');
	var player2 = calculateTotal(secondPair, 'player');
	var dealerTotal = calculateTotal(dealerHands, 'dealer');
	if(player1>21){
			console.log('first pair: dealer wins')
	}else if(dealerTotal>21){
			console.log('first pair: you win')
			myCoin += (myBet*2)
	}else{
		if(player1>dealerTotal){
			console.log('first pair: you win')
			myCoin += (myBet*2)
		}else if(dealerTotal>player1){
			console.log('first pair: dealer wins')
			
		}else{
			console.log('first pair: push')
			myCoin += myBet
		}
	};

	if(player2>21){
			console.log('second pair: dealer wins')
	}else if(dealerTotal>21){
			console.log('second pair: you win')
			myCoin += (myBet*2)
	}else{
		if(player2>dealerTotal){
			console.log('second pair: you win')
			myCoin += (myBet*2)
		}else if(dealerTotal>player2){
			console.log('second pair: dealer wins')
		}else{
			console.log('second pair: push')
			myCoin += myBet
		}
	};
	Coins -= myBet
	myBet = 0;
	displayMoney();
}

function reset(){
	// the player and dealer hand need to be reset
	playerHands = [];
	dealerHands = [];
	firstPair = [];
	secondPair = [];
	$('.card').html('');
	playerTotal = calculateTotal(playerHands, 'player');
	dealerTotal = calculateTotal(dealerHands, 'dealer')
	$('.dealer-total-number').text("")
	$('.player-total-number').text("")
	$('.player1-total-number').text("")
	$('.player2-total-number').text("")
	$('.player-cards .card-4').css({'border-left':'none'})
	shuffleDeck();
}










createDeck(1);
shuffleDeck();

