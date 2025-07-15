import { useEffect, useState } from 'react';
import cardImages from './cardImages';

import './App.css';



function BlackJackTable(){
  // Dimensions of the screen
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const numberOfDecks = 2;
  // Player Hand
  const [playerHand, setPlayerHand] = useState([]);
  // Dealer Hand
  const [dealerHand, setDealerHand] = useState([]);
  // Deck of Cards
  const [deck, setDeck] = useState([]);
  // Players total money 
  const [playerMoney, setPlayerMoney] = useState(1000);
  // Players bet
  const [playerBet, setPlayerBet] = useState([]);
  // Playing the game
  const [inHand, setInHand] = useState(false);
  const [playerBust, setPlayerBust] = useState(false);
  const [currentGame, setCurrentGame] = useState(false);
  const [firstHand, setFirstHand] = useState(false);
  const [sameCard, setSameCard] = useState(false);
  const [gamePhase, setGamePhase] = useState('idle');
  // Has 4 phases idle, player-turn, dealer-turn, evaluate

  // Window size
  useEffect(() => {
    const handleResize = () =>{
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // [] means it should only be ran when the componenet mounts
  }, []);
  //                    General Deck Functions
  // ----------------------------------------------------------------------------------------------
function calculateBet(){
    let total = 0;
    for( let i = 0; i < playerBet.length; i++){
      total += parseInt(playerBet[i]);
    }
    return total;
  }

  // Removes the last element and returns the value of it
  // Does the same thing as pop, but affects the value being tracked
  function jsPop(){
    let newArray = deck;
    let lastValue = newArray.pop();
    setDeck(deck => newArray);
    return lastValue;
  };
  
  const shuffle_deck = () => {
    // Generate a new deck
    const newDeck = Array(52 * numberOfDecks).fill(0);
        for(var i = 0; i < 52 * numberOfDecks; i++){
          newDeck[i] = i % 52;
        }
    // Then shuffle the deck
    // Iterate over the array in reverse order
    for (let i = newDeck.length - 1; i > 0; i--) {

      // Generate Random Index
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    // Reset the values
    setDeck(deck => newDeck);
    setPlayerHand([-1, -1]);
    setDealerHand([-1, -1]);
  };

  //                    Core BlackJack Functions
  // ----------------------------------------------------------------------------------------------

  const deal_cards = () =>{
    if(calculateBet() > 0){ // Make sure the user puts money in to bet
    // Use the shuffled deck to deal 4 cards, 1 to player, 1 to dealer, 1 to player, 1 to dealer
    let firstCard = jsPop();
    let secondCard = jsPop();
    let thirdCard = jsPop();
    let fourthCard = jsPop();

    let newPlayerHand = [firstCard, thirdCard];
    let newDealerHand = [secondCard, fourthCard];
    
    // Set the hands of the dealer and the player
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setCurrentGame(true); // Currently in a game, so we should not deal a new set of cards
    setInHand(true); // We should play the game
    setPlayerBust(false); // Rest the players bust value
    setFirstHand(true);
    setGamePhase('player-turn');
    }
  };

  // Adds a card to the players hand
  const hit = (hand) => {
    // Check if the player is standing
    if(inHand){
      setFirstHand(false);
      let nextCard = jsPop();
      setPlayerHand(playerHand => [...playerHand, nextCard]);
    }
  };

  const stand = () => {
    setInHand(false);
    setGamePhase('dealer-turn');
  }

  // Adds a card to the dealers hand
  const dealer_hit = () => {
    let nextCard = jsPop();
    setDealerHand(dealerHand => [...dealerHand, nextCard]);
  };

  function calculateTotal(hand){
    let high_total = 0;
    let low_total = 0;
    let current = 0;
      // 0 -> Ace
      // 1 -> 2
      // 2 -> 3
      // 3 -> 4
      // ...
      // 9 -> 10
      // 10 -> 11 (J)
      // 11 -> 12 (Q)
      // 12 -> 13 (K)
    for(let i = 0; i < hand.length; i++){
      // Ace's are annoying because it can be 1 or 11
      current = hand[i] % 13; // This way the value of the card is calcualted correctly
      if (current === 0){
        high_total += 11;
        low_total += 1;
      }
      else if(current > 9){
        high_total += 10;
        low_total += 10;
      }
      else{
        high_total += current + 1;
        low_total += current + 1;
      }
      // Check if high_total is over 21, if it is set it to the low total
      if(high_total > 21){
        high_total = low_total;
      }
      
    }
    // Check high_toatl to make sure it is not above 21, if it is then return the lower total
    // The logic for busting will be in another function
    if(high_total > 21){
      return low_total;
    }
    else{
      return high_total;
    }
  };

  function timeout(delay){
    return new Promise( res => setTimeout(res, delay));
  }
  // Have a loop for when playing
    const evaluateGame = async () => {
    const dealerTotal = calculateTotal(dealerHand);
    const playerTotal = calculateTotal(playerHand);

    if(playerBust){
      // The player busted and lost
      setPlayerBet([]);
    }
    else if(dealerTotal > 21 || playerTotal > dealerTotal){
      // The player won
      setPlayerMoney(prev => prev + calculateBet());
    }
    else if(dealerTotal === playerTotal){
      // The dealer had the same number as player, so it was a tie
      // Do nothing because it is a push
    }
    else{
      // Anything else, the player lost
      setPlayerBet([]);
    }

    await timeout(1500);
    setGamePhase('idle');
    setCurrentGame(false);

  }
  // The useEffect is calcualted every rerender, which means everytime i press the button it renders
  useEffect(() => {
    if(gamePhase === 'evaluate'){
      evaluateGame();
    }
    if(gamePhase === 'idle'){
      // Display the shuffle and deal button
      if(deck.length < 32){
        shuffle_deck();
      }
    }

    if(gamePhase === 'dealer-turn'){
      if (calculateTotal(dealerHand) < 17 && !playerBust) {
      setTimeout(() => {
        dealer_hit();
      }, 1000); // allow time for UI to update
    } else {
      setGamePhase('evaluate');
    }
    }

    if(inHand && calculateTotal(playerHand) > 21){
      setPlayerBust(true);
      setInHand(false);
      setGamePhase('dealer-turn');
    }
  }, [gamePhase, playerHand, dealerHand]);



  //                    CARD Display Functions
  // ----------------------------------------------------------------------------------------------

  // Display the cards of a hand
  function displayHand(hand){
    let displayString = [];
    for(let i = 0; i < hand.length; i++){
      displayString.push(<DisplayCard cardValue={hand[i]} />);
    }
    return (
      <div className="hand">
        {displayString.map((item, index) => (
          <span key={index}>{item}</span>
        ))}
      </div>
    );
  };

  // Returns the name of the card in words
  function get_card_name(cardValue){
    switch (cardValue) {
    case 0:
      return 'ace';
    case 1:
      return 'two';
    case 2:
      return 'three';
    case 3:
      return 'four';
    case 4:
      return 'five';
    case 5:
      return 'six';
    case 6:
      return 'seven';
    case 7:
      return 'eight';
    case 8:
      return 'nine';
    case 9:
      return 'ten';
    case 10:
      return 'jack';
    case 11:
      return 'queen';
    case 12:
      return 'king';
    default:
      return 'blank';
    }
  };

  // Define the suit in words
  function get_suit_name(cardValue){
    switch(cardValue){
      case 0:
        return 'clubs';
        case 1:
          return 'spades';
        case 2:
          return 'diamonds';
        case 3:
          return 'hearts';
        default:
          return 'blank';
    }
  };

  // Creates the Display image and prints it to the screen
  function DisplayCard({cardValue}){
    // Get the appropriate values for the cards
    const value = get_card_name(cardValue % 13); // Will give the name of the card
    const suit = get_suit_name(Math.floor(cardValue / 13)); // Will give a value between 0-3

    // Find the image for each card
    const imageKey = `${suit}_of_${value}`;
    const imageSrc = cardImages[imageKey];

    // Return the image of said card
    return (
        <img src={imageSrc} alt={`${value} of ${suit}`} className='center-image' />
      );
  }

  // Dashboard Functions for displaying information
// ----------------------------------------------------------------------------------------------
  function BetAmountButton(props){
    function handle_betting(){
      // Add the current bet + the buttons amount to the players bet
      if(playerMoney >= props.amount){
        
        setPlayerBet(playerBet => [...playerBet, parseInt(props.amount)] );
        setPlayerMoney(playerMoney - props.amount);
      }
    }

    return (
      <><button className='betting_button' onClick={handle_betting}>BET {props.amount}</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>
    );
  }

function DisplayValues(props){  
  // Return a dashboard that displays the data
  function reset_bet(){
    setPlayerMoney(parseInt(calculateBet()) + parseInt(playerMoney));
    setPlayerBet([]);
  }
  function remove_last_bet(){
    if(playerBet.length > 0){
      let newBet = playerBet;
      let lastBet = newBet.pop();
      setPlayerMoney(playerMoney => playerMoney + parseInt(lastBet));
      setPlayerBet(newBet);
    }
    
  }
  return (
    // When editing the css you have to put it on the specific parts
    <div>
      <h1>Dashboard</h1>
      <p>Remaining Cards In Deck: {props.cardsRemaining}</p>
      <p>Money: {playerMoney}</p>
      <p>Bet: {calculateBet()}</p>
      <div>&nbsp;</div>
      {!currentGame &&<div>
      <button onClick={reset_bet}>Reset Bet</button>
      <button onClick={remove_last_bet}>Remove Last Bet</button>
      <div>&nbsp;</div>
      <span>
        <BetAmountButton amount='5'/>
        <BetAmountButton amount='10'/>
        <BetAmountButton amount='25'/>
        <BetAmountButton amount='50'/>
      </span>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <span>
        <BetAmountButton amount='100'/>
        <BetAmountButton amount='250'/>
        <BetAmountButton amount='500'/>
        <BetAmountButton amount='1000'/>
      </span>
      </div>}
    </div>
  );
} 
  //                          Return HTML
  // ----------------------------------------------------------------------------------------------
  
  return(
    <div className='container'>
      <div>
      {!currentGame ? <button className='cool_button' onClick={deal_cards}>Deal</button> : <button className='cool_button'> ----</button>}
      
      <p>Dealer Hand </p>
      {inHand ? <p><DisplayCard cardValue={dealerHand[0]} /><DisplayCard cardValue={-1}/></p> : <p>{displayHand(dealerHand)}</p>}
      {inHand ? <p>Dealer Total: {calculateTotal([dealerHand[0]])}</p> : <p>Dealer Total: {calculateTotal(dealerHand)}</p>}
      <p>Player Hand </p> 
      {currentGame && inHand ? <button onClick={hit}>Player Hit</button> : <p>&nbsp;</p>}
      {currentGame && inHand ?   <button onClick={stand}>Stand</button> : <></> }
      <p>{displayHand(playerHand)}</p>
      <p>Player Total: {calculateTotal(playerHand)}</p>
      </div>
  
      <DisplayValues cardsRemaining={deck.length} money={playerMoney}/>
    </div>
  );
  
}

/*
boiler plate for displaying the image
<img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
*/
function App() {
  return (
    <div>
      <header>
        <BlackJackTable></BlackJackTable>
        
      </header>
    </div>
  );
}

export default App;
