/////////////////////////////
/////////////////////////////
///////BLACKJACK GAME////////
/////////////////////////////
/////////////////////////////
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
var myCoin = 0;
var myBet = 0; // later get input from user
var didIWin = false;

$(document).ready(function(){
	$('.deal-button').click(function(){
		theDeck = createDeck(1)
		if((!hitCounter)&&(myBet>0)){
			$('.player-total-number').show()
			$('.arrow').hide();
			// $('.theWholeWorld').hide();
			reset();
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
				secondPair.push(playerHands[lastCardIndex]);
				hitCounter = 10;
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
			&&(Number(playerHands[1].slice(0, -1))===1)){
			if(myCoin>=myBet){
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
				checkWin2();
			}else{describeAction('NOT ENOUGH COINS TO SPLIT!')}
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
				if(calculateTotal(playerHands,'player') < 22){
					playerHands.push(theDeck.shift());		
					var lastCardIndex = playerHands.length-1;
					var slotForNewCard = playerHands.length;
					placeCard('player', slotForNewCard, playerHands[lastCardIndex]);
					calculateTotal(playerHands, 'player');
				}else{
					checkWin()  //if this runs, hitcounter = 0
				};
			//stand-button code copied below
				if(hitCounter!==0){  // if bust hit condition wud be 0 so this wont run
					hitCounter=2
					placeCard('dealer', 2, dealerHands[dealerHands.length - 1]);
					if(calculateTotal(playerHands,'player') < 21){
						var	dealerTotal = calculateTotal(dealerHands, 'dealer');
						while(dealerTotal<17){
							dealerHands.push(theDeck.shift())
							var lastCardIndex1 = dealerHands.length - 1;
							var slotForNewCard1 = dealerHands.length;
							placeCard('dealer', slotForNewCard1, dealerHands[lastCardIndex1]);
							dealerTotal = calculateTotal(dealerHands, 'dealer');
						}
					}
					hitCounter = 4
					checkWin();
				}
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
		$('.bet-wrapper, .action, .crow, .arrow, .game-background').fadeOut('slow');
		$(this).hide();
	})	
	$('.hide-rules').click(function(){
		$('.rule-description').slideUp(1000);
		$('.bet-wrapper, .rules, .action, .crow, .arrow, .game-background').fadeIn('slow');
	})		
});
function displayMoney(){
	$('#myCoin').html(myCoin);
	$('#betAmount').html(myBet);
}
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
}
//////////////////
/////GAME LOG/////
//////////////////
var gamelog = 1
function describeAction(aa){
	setTimeout(function(){
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
	gamelog++}, 900)
} 

function shuffleDeck(){
	for(let i = 0; i<10000; i++){
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
	var flipThis = '.' + who + '-cards .bj-tile-inner.card' + where; 
	if(classSelector === ".dealer-cards .card-1"){
		setTimeout(function(){
			$(flipThis).show()}, 800)
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 1200);
		// $(flipThis).delay(800).toggleClass('flip');
	}else if(classSelector === ".player-cards .card-2"){
		// $(classSelector).delay(1200).slideDown('slow');
		setTimeout(function(){
			$(flipThis).show()}, 1200)
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 1600);
	}else if(classSelector === ".player-cards .card-1"){
		setTimeout(function(){
			$(flipThis).show()}, 400)
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 800);						
	}else if(classSelector === ".player-cards .card-3"){
		$(flipThis).show()
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 400)
	}else if(classSelector === ".dealer-cards .card-2"){
		if(!hitCounter){
			setTimeout(function(){
				$(flipThis).show()}, 1600);		
		dealerCard2 = classSelector;
		valueOfDC2 ='<img src="images/' + whatCard + '.png">';
		}else{
			$(dealerCard2).html(valueOfDC2);
			$(flipThis).show()
			setTimeout(function(){
				$(flipThis).toggleClass('flip')}, 800)
		}
	}else if(classSelector === ".dealer-cards .card-3"){
		setTimeout(function(){
			$(flipThis).show()}, 800);		
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 1200);		
	}else if(classSelector === ".dealer-cards .card-4"){
		setTimeout(function(){
			$(flipThis).show()}, 1200);
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 1600);		
	}else if(classSelector === ".dealer-cards .card-5"){
		setTimeout(function(){
			$(flipThis).show()}, 1600);
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 2000);		
	}else if(classSelector === ".dealer-cards .card-6"){						
		setTimeout(function(){
			$(flipThis).show()}, 2000);
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 2400);		
	}else if((classSelector === ".player-cards .card-3")&&
		(hitCounter===6)){
		$(flipThis).show()
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 1200);		
	}else if((classSelector === ".player-cards .card-5")&&
		(hitCounter===6)){
		$(flipThis).show()
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 1800);		
	}else{
		$(flipThis).show()
		setTimeout(function(){
			$(flipThis).toggleClass('flip')}, 400);		
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
	return total
}
function checkWin(){
	hitCounter=2;
	var playerTotal = calculateTotal(playerHands, 'player');
	var dealerTotal = calculateTotal(dealerHands, 'dealer');
	if(playerTotal>21){
			describeAction('BETTER LUCK NEXT HAND!')
			$('.arrow').show();			
	}else if(dealerTotal>21){
		myCoin += (myBet*2)
			describeAction('YOU WON ' + myBet + ' COINS!')
			$('.arrow').show();			
	}else{
		if(playerTotal>dealerTotal){
			myCoin += (myBet*2);
			if((playerHands.length ===2)&&(playerTotal===21)){
			myCoin += myBet/2;
			// console.log('blackjack you won +' + myBet/2)
			describeAction('BLACKJACK! +' + (myBet/2) +' COINS!')
			}
			// console.log('you won ' + myBet)
			describeAction('YOU WON ' + myBet + ' COINS!')
			$('.arrow').show();			
		}else if(dealerTotal>playerTotal){
			// console.log('dealer wins')
			describeAction('BETTER LUCK NEXT HAND!')
			$('.arrow').show();			
		}else{
			myCoin += myBet
			describeAction('PUSH! IT\'S A TIE!')
			$('.arrow').show();			
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
			$('.arrow').show();			
	}else if(dealerTotal>21){
			describeAction('YOU WON ' + myBet + ' ON HAND #2')
			$('.arrow').show();			
			myCoin += (myBet*2)
	}else{
		if(player2>dealerTotal){
			describeAction('YOU WON ' + myBet + ' ON HAND #2')
			$('.arrow').show();			
			myCoin += (myBet*2)
		}else if(dealerTotal>player2){
			describeAction('YOU LOST HAND #2')
			$('.arrow').show();			
		}else{
			describeAction('YOU PUSHED HAND #2')
			$('.arrow').show();			
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
	$('.bj-tile-inner').removeClass('flip')
	$('.bj-tile-inner').hide()
	shuffleDeck();
}




//////////////////
//////////////////
// MEMORY GAME //
//////////////////
//////////////////
var cards = [
'<img src="images/card1.jpg">',
'<img src="images/card2.jpg">',
'<img src="images/card3.jpg">',
'<img src="images/card4.jpg">',
'<img src="images/card5.jpg">',
'<img src="images/card6.jpg">',
'<img src="images/card7.jpg">',
'<img src="images/card8.jpg">',
'<img src="images/card9.jpg">',
'<img src="images/card10.jpg">',
'<img src="images/card11.jpg">',
'<img src="images/card12.jpg">',
];

var startDrawing = false;
$(document).ready(function(){
	setTimeout(function(){
		$('.mg-tile-inner').toggleClass('flip')}, 500);
	setTimeout(function(){
		for(let i=0; i<gridSize; i++){
			setTimeout(function(){
				var tempClass = '.c' + i
				$(tempClass).toggleClass('flip')}, i*150)};
		canClick = true;
		}, 2700)

	var gridSize = 12;
	var mgHTML = '';
	var card = ''
	var cardLocation = [];
	// push numbers into array as many as gridsize
	for(let i=0; i<gridSize; i++){
		cardLocation.push([i]);
	}

	for(let i=0; i<9000; i++){
		var random1 = Math.floor(Math.random() * cardLocation.length);
		var random2 = Math.floor(Math.random() * cardLocation.length);
		var temp = cardLocation[random1];
		cardLocation[random1] = cardLocation[random2];
		cardLocation[random2] = temp;
	}

	for(let i=0; i<gridSize; i++){
		card = cards[Math.floor(cardLocation[i]/2)];
		mgHTML += '<div class="mg-tile col-sm-3">';
			mgHTML += '<div class="mg-tile-inner c' + i +'">';
				mgHTML += '<div class="mg-front">'+card+'</div>';
				mgHTML += '<div class="mg-back"></div>';
			mgHTML += '</div>';
		mgHTML += '</div>';
	}
   
    $('.mg-contents').html("MATCH ALL FOR +2000 COINS<br>" + mgHTML +
    	'<button class="skip-button frame">SKIP</button>');


	var canClick = false;
	var matchCounter = 0;
	$('.mg-tile-inner').click(function(){
	    if(canClick){    
 		   	$(this).toggleClass('flip');
    		var cardsUp = $('.flip');
    		if(cardsUp.length == 2){
    			canClick = false;
    			var cardsUpImages = cardsUp.find('.mg-front img');
				if(cardsUpImages[0].src == cardsUpImages[1].src){
    				cardsUp.addClass('matched');
    				cardsUp.removeClass('flip');
					canClick = true;
					matchCounter++;
    			}else{
    				setTimeout(function(){
    					cardsUp.removeClass('flip')
    					canClick = true;
    				}, 600)
    			}
    		};
    		if(matchCounter===6){
				$('.universe').show()    			
				$('.mg-contents').hide();
				$('.circle').fadeOut();
				$('.hideThis').show()
				$('.theWholeWorld').fadeIn(1000);
				clearInterval(spinSpin);
				$('.arrow').show();
				$('.crow').show();
				startDrawing = true;
   				for(let i = 0; i<60; i++){
					setTimeout(function(){
						myCoin += 50;
						displayMoney();
						$('#myCoin').toggleClass('color-orange');
					}, i*90 + 1500)
				};
			}   	 			
   	 	}
    });
	$('.skip-button').click(function(){
		$('.universe').show()    			
		$('.mg-contents').addClass('.flip2').hide();
		$('.circle').fadeOut();
		$('.hideThis').show()
		$('.theWholeWorld').fadeIn(1000);
		clearInterval(spinSpin);
		$('.arrow').show();
		$('.crow').show();
		startDrawing = true;
		for(let i = 0; i<50; i++){
			setTimeout(function(){
				myCoin += 20;
				displayMoney();
				$('#myCoin').toggleClass('color-orange');
			}, i*50 + 1500)
		};
	})
});

var colorCounter = 0
function changeColor(){
	colorCounter++
	if(colorCounter===1){$('.mg-front, .mg-back').css({'border-color':'red'})};
	if(colorCounter===2){$('.mg-front, .mg-back').css({'border-color':'white'})}
	if(colorCounter===3){$('.mg-front, .mg-back').css({'border-color':'blue'})}
	if(colorCounter===4){$('.mg-front, .mg-back').css({'border-color':'skyblue'})}
	if(colorCounter===5){$('.mg-front, .mg-back').css({'border-color':'green'})}
	if(colorCounter===6){$('.mg-front, .mg-back').css({'border-color':'yellow'})}
	if(colorCounter===7){$('.mg-front, .mg-back').css({'border-color':'orange'})
		colorCounter = 0;}	
}
var spinSpin = setInterval(changeColor, 300)

/////////////////////////////
/////////////////////////////
///characters descriptions///
/////////////////////////////
/////////////////////////////
$(document).ready(function(){
var characters = [
	{ "name": "Sansa Stark",
	  "description": "Daughter of Eddard and Catelyn Stark"
	},
	{
	  "name": "Jaime Lannister",
	  "description": "The Kingslayer-Knight of the Kingsgaurd"
	},
	{
	  "name": "Brandon \"Bran\" Stark",
	  "description": "Son of Eddard and Catelyn Stark"
	},
	{
	  "name": "Jon Snow",
	  "description": "Bastard son of Eddard Stark.. or is he?"
	},
	{
	  "name": "Tyrion Lannister",
	  "description": "Son of Tywin Lannister-The Imp"
	},
	{
	  "name": "Arya Stark",
	  "description": "Daughter of Eddard and Catelyn Stark"
	},
	{
	  "name": "Queen Cersei Baratheon",
	  "description": "Daughter of Tywin Lannister-Light of the West"
	},
	{
	  "name": "Joffrey Baratheon",
	  "description": "Heir to the Iron Throne"
	},
	{
	  "name": "Daenerys Targaryen",
	  "description": "Mother of Dragons-Khaleesi-The Unburnt"
	},
	{
	  "name": "Robb Stark",
	  "description": "Son of Eddard and Catelyn Stark"        
	},
	{
	  "name": "Catelyn Stark",
	  "description": "Married to Eddard Stark-Daughter of Hoster Tully"
	},
	{ "name": "Paul Kang",
	  "description": "Son of Moonsig and Yookyung Kang"
	}
];

var charactersHTML =''
	for(let i=0; i<characters.length; i++){
		if(i===0){charactersHTML += '<div class="item active">'
		}else{charactersHTML += '<div class="item">'};
		charactersHTML += '<div class="GOTchar">'
		charactersHTML += '<span class="blue">' +characters[i].name + ":</span> " + characters[i].description
		charactersHTML += '</div></div>'
		$('.carousel-inner').html(charactersHTML)
	}
})

