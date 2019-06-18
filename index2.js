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
  constructor(name, description, inventory, canChangeTo){
  this.name = name;
  this.description = description;
  this.roomInventory = inventory;
  this.canChangeTo = canChangeTo;
   }
}

class Item{
  constructor(name, description, canPickUp, pickUpText, inventoryText, openText){
    this.name = name;
    this.description = description;
    this.canPickUp = canPickUp;
    this.pickUpText = pickUpText;
    this.inventoryText = inventoryText;
    this.openText = openText;
  }
}

class Player {
  constructor(currentState, playerInventory) {
    this.currentState = currentState;
    this.playerInventory = playerInventory;
  }

  actions(actionToDo, item) {
     this[actionToDo] ? this[actionToDo](item) : console.log(`I do not know how to ${actionToDo}`);
     getInput();
  }

  look() {
    console.log(this.currentState.description);
    getInput();
  }

  read(item){
   if(this.currentState.roomInventory.includes(lookUpItems[item]) || this.playerInventory.includes(lookUpItems[item])){
    console.log(lookUpItems[item].description);
   }else{
      console.log(`I'm sorry I can't read the ${item}`);
   }
    getInput();
  }

  take(item){
    if(this.currentState.roomInventory.includes(lookUpItems[item]) && lookUpItems[item].canPickUp){
      this.playerInventory.push(this.currentState.roomInventory[this.currentState.roomInventory.indexOf(lookUpItems[item])]);
      // console.log(this.playerInventory);
      console.log(lookUpItems[item].pickUpText)
    }else if(this.currentState.roomInventory.includes(lookUpItems[item])){
      console.log(lookUpItems[item].pickUpText);
    }else{
      console.log(`I'm sorry I can't take the ${item}.`);
    }
    getInput();
  } 

  open(item){
    if(lookUpItems[item].openText){
    console.log(lookUpItems[item].openText);
    }else{
      console.log(`I'm sorry I can't open ${item}`)
    }
    getInput();
  }

  code(number){
    if(this.currentState === mainSt && number === '12345'){
      console.log(`Success! The door opens. You enter the foyer and the door
      shuts behind you.`);
      enterState('foyer', 'mainSt');
    }else{
      console.log(`Bzzzzt! The door is still locked.`);
      getInput();
    }
  }

  inventory(){
    if(player.playerInventory.length < 1){
      console.log("You have nothing.")
      return getInput();
    } else {
      player.playerInventory.forEach(function(element) {
        console.log(element.name);
      });
      return getInput();
    }
  }
}

//Player creation
let player = new Player(
'mainSt',
[]
);

//Items
const paper = new Item(
"Seven Days", 
"Some kind of newspaper", 
true,
`You pick up the paper and leaf through it looking for comics and ignoring the articles, just like everybody else does.`,
"You are carrying seven days, Vermonts Alt-Weekly",
"You flip through the pages. Nothing catches your eye."
);

const sign = new Item(
  "Sign", 
  "Welcome to Burlington Code Academy! Come on up to the third floor. If the door is locked, use the code 12345",
  false,
  "That would be selfish. How will other students find their way?",
  "",
  "",
);

const door = new Item(
  "door", 
  "182 Main St",
  false,
  "It's locked and I don't know how you'd carry it.",
  "",
  "The door is locked. There is a keypad on the door handle."
);

//Rooms
let mainSt = new Room(
  "182 Main St.",
  `You are standing on Main Street between Church and South Winooski.
  There is a door here. A keypad sits on the handle.
  On the door is a handwritten sign.`,
  [sign, door],
  ['mainSt', 'foyer']
  );

let foyer = new Room(
'182 Main St. - Foyer',
`You are in a foyer. Or maybe it's an antechamber. Or a 
vestibule. Or an entryway. Or an atrium. Or a narthex.
But let's forget all that fancy flatlander vocabulary,
and just call it a foyer. In Vermont, this is pronounced
"FO-ee-yurr".
A copy of Seven Days lies in a corner.`,
[paper],
['mainSt', 'roomThree'],
);

  //Do we need a lookup table for [current].description to work? Marshall mentioned that you can't have the first 
  //key be a variable unless you use a lookup table to convert the string to an object by naming itself
  const roomLookupTable = {
    mainSt: mainSt,
    foyer: foyer,
    //roomThree: roomThree
  }
  
  const lookUpItems = {
     paper: paper,
     "seven days": paper,
     sign: sign,
     door: door,
     }

//Transition between rooms
function enterState(newState, currentRoom) {
  // console.log(`Entering enterState() the currenState is: ${player.currentState}`);
  // console.log(`enterState with ${newState} as the argument`);
  if(roomLookupTable[currentRoom].canChangeTo.includes(newState)){
    player.currentState = roomLookupTable[newState];
    console.log(player.currentState.description);
    getInput();
  }else{
    throw 'Invalid state transition attempted - from ' + currentRoom + ' to ' + newState;
  }
}

function start() {
  console.log("Please enter your commands as two words. For example 'open door' or 'read sign'.");
  player.currentState = 'mainSt';
  enterState('mainSt', 'mainSt');
}

async function getInput() {
  let input = await ask("What would you like to do?\n>_");
  let arrInput = input.toLowerCase().split(" ");
  if(arrInput[1] === 'seven' && arrInput[2] === 'days'){
    arrInput.push('seven days');
  }
  if(arrInput.includes('enter', 'code') || arrInput.includes('key', 'in')){
    return player.code(arrInput[2]);
  }
  checkInput(arrInput[0], arrInput[arrInput.length-1], arrInput);
}


function checkInput(arg1, arg2, arrInput){
  if(arg1 === 'i' || (arg1 === 'take' && arg2 === 'inventory')){
      arg1 = 'inventory';
      // if(player.playerInventory.length < 1){
      //   console.log("You have nothing.")
      //   getInput();
      // } else {
      //   console.log(`You have: ${player.playerInventory.join(" ")}`)
      //   //console.log(player.playerInventory)
      //   getInput();
      // }
  } 
  player.actions(arg1, arg2);
}



start();