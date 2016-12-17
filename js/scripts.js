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
//  4: double down (doubling value of myBet)
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
for(var i =0; i<100; i++){
	$(".drago").animate({
	'marginLeft' : "+=5px" });}
	$(".drago").animateSprite({
    fps: 26,
    animations: {
        walkRight: [0, 1, 2, 3,, 4, 5,6, 6, 7, 8]
    },
    
    loop: true,
    complete: function(){
        // use complete only when you set animations with 'loop: false'
        alert("animation End");
    }
});



	

	$('.deal-button').click(function(){
		// $('.bet-square-wrapper').toggleClass('.flip2')
		if((!hitCounter)&&(myBet>0)){
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
			$('.player-total-number').show()
			$('.deal-button').addClass('flip');
			reset();
			// theDeck[0]='1s'
			// theDeck[1]='1d'			
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
			}else{
				describeAction('PRESS HIT OR STAND')
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
			{if(myCoin>=myBet){
			myCoin -= myBet
			placeCard('player', 4, playerHands[1]);
			$('.player-cards .card-2').html('');
			$('.player-cards .card-4').css({'border-left':'5px dashed black'})
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
			checkWin2();}else{describeAction('NOT ENOUGH COINS TO SPLIT!')}
		}else{
			describeAction('YOU CAN ONLY SPLIT ACES!')
		}		
	});

	$('.doubleDown-button').click(function(){
		if(hitCounter===1){
			myCoin -= myBet
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
			if(hitCounter!=2){  // if bust hit condition wud be 0 so this wont run
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
		if((myCoin >= 10)&&(hitCounter===0)){myBet += 10;
		myCoin -= 10}
		displayMoney();
	})
	$('.button50').click(function(){
		if((myCoin >= 50)&&(hitCounter===0)){myBet += 50; 
		myCoin -= 50}
		displayMoney();
	})
	$('.button100').click(function(){
		if((myCoin >= 100)&&(hitCounter===0)){myBet += 100;
		myCoin -= 100}
		displayMoney();
	})		
	$('.button500').click(function(){
		if((myCoin >= 500)&&(hitCounter===0)){myBet += 500; 
		myCoin -= 500}
		displayMoney();
	})

	$('.reset-bet').click(function(){
		if(hitCounter===0){
		myCoin += myBet;
		myBet = 0;
		displayMoney();}
	})

	$('.rules').click(function(){
		$('.rule-description').slideDown(1000);
		$('.bet-wrapper, .action, .fireball, .fireball2').fadeOut('slow');
		$(this).hide();
	})	

	$('.hide-rules').click(function(){
		$('.rule-description').slideUp(1000);
		$('.bet-wrapper, .rules, .action, .fireball, .fireball2').delay(800).fadeIn('slow');
		
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

// create divs describe action
var gamelog = 1
function describeAction(aa){
	var a8 = $('.action8').html();
	$('.action9').html(a8)
	var a7 = $('.action7').html();
	$('.action8').html(a7)
	var a6 = $('.action6').html();
	$('.action7').html(a6)
	var a5 = $('.action5').html();
	$('.action6').html(a5)
	var a4 = $('.action4').html();
	$('.action5').html(a4)
	var a3 = $('.action3').html();
	$('.action4').html(a3)
	var a2 = $('.action2').html();
	$('.action3').html(a2)
	var a1 = $('.action1').html();
	$('.action2').html(a1)
	$('.action1').html(gamelog + ": " + aa)		
	gamelog++
} 





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
			describeAction('BETTER LUCK NEXT HAND!')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();			
	}else if(dealerTotal>21){
		myCoin += (myBet*2)
			describeAction('YOU WON ' + myBet + 'COINS!')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
	}else{
		if(playerTotal>dealerTotal){
			myCoin += (myBet*2);
			if((playerHands.length ===2)&&(playerTotal===21)){
			myCoin += myBet/2;
			// console.log('blackjack you won +' + myBet/2)
			describeAction('BLACKJACK! +' + (myBet/2) +' COINS!')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
			}
			// console.log('you won ' + myBet)
			describeAction('YOU WON ' + myBet + ' COINS!')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
		}else if(dealerTotal>playerTotal){
			// console.log('dealer wins')
			describeAction('BETTER LUCK NEXT HAND!')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
		}else{
			myCoin += myBet
			describeAction('PUSH! IT\'S A TIE!')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
		}
	};
	hitCounter = 0;
	myBet = 0;
	displayMoney();
	$('.deal-button').removeClass('flip');
}

function checkWin2(){
	hitCounter=2;
	var player1 = calculateTotal(firstPair, 'player');
	var player2 = calculateTotal(secondPair, 'player');
	var dealerTotal = calculateTotal(dealerHands, 'dealer');
	if(player1>21){
			// console.log('first pair: dealer wins')
			describeAction('YOU LOST HAND #1')

	}else if(dealerTotal>21){
			describeAction('YOU WON ' + myBet + ' ON HAND #1')
			myCoin += (myBet*2)
	}else{
		if(player1>dealerTotal){
			describeAction('YOU WON ' + myBet + ' ON HAND #1')
			myCoin += (myBet*2)
		}else if(dealerTotal>player1){
			describeAction('YOU LOST HAND #1')
			
		}else{
			describeAction('YOU PUSHED HAND #1')
			myCoin += myBet
		}
	};

	if(player2>21){
			describeAction('YOU LOST HAND #2')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
	}else if(dealerTotal>21){
			describeAction('YOU WON ' + myBet + ' ON HAND #2')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
			myCoin += (myBet*2)
	}else{
		if(player2>dealerTotal){
			describeAction('YOU WON ' + myBet + ' ON HAND #2')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
			myCoin += (myBet*2)
		}else if(dealerTotal>player2){
			describeAction('YOU LOST HAND #2')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
		}else{
			describeAction('YOU PUSHED HAND #2')
			$('.fireball, .fireball2').toggleClass('rotate').toggle();
			myCoin += myBet
		}
	};
	myBet = 0;
	displayMoney();
	$('.deal-button').removeClass('flip');
	$('.player-total-number').hide()
	hitCounter = 0;		
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

