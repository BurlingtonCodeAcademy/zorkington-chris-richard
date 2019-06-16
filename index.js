/*~~~~~~~~~~~~~~~~~~~~ Begin Boiler Plate ~~~~~~~~~~~~~~~~~~*/
const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
/*~~~~~~~~~~~~~~~~~~~~~~End Boiler Plate~~~~~~~~~~~~~~~~~~~~*/

//Classes
class Room {
  constructor(name, description, inventory, canChangeTo, actions){
  this.name = name;
  this.description = description;
  this.roomInventory = inventory;
  this.canChangeTo = canChangeTo;
  this.actions = actions;
  //this.actions = actions;
  }
}

class Item{
  constructor(name, description, canPickUp){
    this.name = name;
    this.description = description;
    this.canPickUp = canPickUp;
  }
}

//Rooms
let roomOne = new Room(
  "182 Main St.",
  `You are standing on Main Street between Church and South Winooski.
  There is a door here. A keypad sits on the handle.
  On the door is a handwritten sign.`,
  {'read sign': `The sign says "Welcome to Burlington Code Academy! Come on 
  up to the third floor. If the door is locked, use the code
  12345."`},
  ['roomTwo'],
  {12345: 'roomTwo', 'take sign': "That would be selfish, how would other students find their way?", 'open door': `The door is locked. There is a keypad on the door handle.`} 
);

let roomTwo = new Room(
  '182 Main St. - Foyer',
  `You are in a foyer. Or maybe it's an antechamber. Or a 
  vestibule. Or an entryway. Or an atrium. Or a narthex.
  But let's forget all that fancy flatlander vocabulary,
  and just call it a foyer. In Vermont, this is pronounced
  "FO-ee-yurr".
  A copy of Seven Days lies in a corner.`,
  {'seven days': `You pick up the paper and leaf through it looking for comics 
  and ignoring the articles, just like everybody else does.`}, //inventory
  ['roomOne', 'roomThree'],
  {} //actions
  );

  //Do we need a lookup table for [current].description to work? Marshall mentioned that you can't have the first 
  //key be a variable unless you use a lookup table to convert the string to an object by naming itself
  const roomLookupTable = {
    roomOne: roomOne,
    roomTwo: roomTwo,
    //roomThree: roomThree
  }

  
  //player
  let player = {
    currentState: 'roomOne',
    playerInventory: [],
  //Will need to add functions for interacting - pickUp, drop, look, read, etc...
  actions: {
    look(){
      console.log([currentState].description);
    },
    read(action, itemName){
      //console.log(`The value of passed argument in the read function was: ${itemName}`);
      if(Object.keys(roomLookupTable[player.currentState].roomInventory).includes(action + " " + itemName)){
        console.log(roomLookupTable[player.currentState].roomInventory[action + " " + itemName]);
        getInput();
      } else {
        console.log(`I'm sorry I can't read the ${itemName}`);
        getInput();
      }
    },
    enter(action, code) {
      if(code === '12345'){
        console.log('Success! The door opens. You enter the foyer and the door shuts behind you.')
        enterState(roomLookupTable[player.currentState].actions[code]);
      } else {
        console.log(`Bzzzzt! The door is still locked.`);
        getInput();
      }
    },
    take(action, itemName){ 
      if(Object.keys(roomLookupTable[player.currentState].actions).includes(action + " " + itemName)){
      console.log(roomLookupTable[player.currentState].actions[action + " " + itemName]);
      getInput();
      } else {
      console.log(`I'm sorry I can't take the ${itemName}`);
      getInput();
     }
    }, 

    open(action, itemName) {
      if(Object.keys(roomLookupTable[player.currentState].actions).includes(action + " " + itemName)){
        console.log(roomLookupTable[player.currentState].actions[action + " " + itemName]);
        getInput();
        } else {
        console.log(`I'm sorry I can't open the ${itemName}`);
        getInput();
       }
    }
  }
}



function enterState(newState) {
  //console.log(`enterState with ${newState} as the argument`)
  let validTransitions = roomLookupTable[player.currentState].canChangeTo;
  if (validTransitions.includes(newState)) {
    player.currentState = newState;
    newRoom();
  } else {
    throw 'Invalid state transition attempted - from ' + player.currentState + ' to ' + newState;
  }
}

function start() {
  console.log("Please enter your commands as two words. For example 'open door' or 'read sign'.");
  //console.log(`currentState is: ${player.currentState}.`);
  newRoom();
}

function newRoom(){
  console.log(`${roomLookupTable[player.currentState].description}`);
  getInput();
}

async function getInput() {
  let input = await ask("What would you like to do?\n>_");
  let arrInput = input.toLowerCase().split(" ");
  checkInput(arrInput[0], arrInput[arrInput.length-1], arrInput);
}


function checkInput(arg1, arg2, arrInput){
  if(Object.keys(player.actions).includes(arg1)){
    //console.log(`The player action array does include: ${arg1}`);
    player.actions[arg1](arg1, arg2);
  }else{
    console.log(`I'm sorry I don't know how to ${arrInput}`);
    getInput();
  }
}



start();