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
    console.log(roomLookupTable[this.currentState].description);
    getInput();
  }

  read(item){
   if(roomLookupTable[this.currentState].roomInventory.includes(lookUpItems[item]) || this.playerInventory.includes(lookUpItems[item])){
    console.log(lookUpItems[item].description);
   }else{
      console.log(`I'm sorry I can't read the ${item}`);
   }
    getInput();
  }

  take(item){
    if(roomLookupTable[this.currentState].roomInventory.includes(lookUpItems[item]) && lookUpItems[item].canPickUp){
      let index = roomLookupTable[this.currentState].roomInventory.indexOf(lookUpItems[item])
      this.playerInventory.push(roomLookupTable[this.currentState].roomInventory[index]);
      // console.log(this.playerInventory);
      console.log(lookUpItems[item].pickUpText)
    }else if(roomLookupTable[this.currentState].roomInventory.includes(lookUpItems[item])){
      console.log(lookUpItems[item].pickUpText);
    }else{
      console.log(`I'm sorry I can't take the ${item}.`);
    }
    getInput();
  } 

  drop(item){ 
    if(player.playerInventory.includes(lookUpItems[item])){
      //console.log(`The player does have ${item} in their inventory`);
      let index = player.playerInventory.indexOf(lookUpItems[item]);
      roomLookupTable[this.currentState].roomInventory.push(player.playerInventory[index]); 
      player.playerInventory.splice(index, 1);;
      console.log(`You dropped the ${item}`);
      getInput();
    } else {
    console.log(`I'm sorry you can't drop the ${itemName}`);
    getInput();
   }
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
    if(roomLookupTable[this.currentState] === mainSt && number === '12345'){
      console.log(`Success! The door opens. You enter the foyer and the door
      shuts behind you.`);
      enterState('foyer', 'mainSt');
    }else if(roomLookupTable[this.currentState] === mainSt && number !== '12345'){
      console.log(`Bzzzzt! The door is still locked.`);
      getInput();
    }else{
      console.log('There is no keypad on this side.');
      getInput();
    }
  }

  inventory(){
    if(player.playerInventory.length < 1){
      console.log("You have nothing.")
      return getInput();
    } else {
      player.playerInventory.forEach(function(element) {
        console.log(element.inventoryText);
      });
      return getInput();
    }
  }
  move(newState){
    if(Object.keys(roomLookupTable).includes(newState) && this.currentState !== "mainSt"){
    console.log(this.currentState);
      enterState(newState, this.currentState);
    console.log(this.currentState.description)
    } else {
      console.log(`I can't move to ${newState}`)
    }
   getInput();
  }

  async xyzzy(){
    let newRoom = await ask("Which room would you like to go to mainSt or foyer?")
    if(Object.keys(roomLookupTable).includes(newRoom)){
      this.currentState = newRoom;
      console.log(roomLookupTable[player.currentState].name);
      console.log(roomLookupTable[player.currentState].description);
    }else{
          console.log(`That isn't a choice. Please try again`);
          return xyzzy();
  }
   return getInput();
  }
}

//Items
const paper = new Item(
"Seven Days", 
"Some kind of newspaper with bands you've never heard of.", 
true,
`You pick up the paper and leaf through it looking for comics and ignoring the articles, just like everybody else does.`,
"You are carrying Seven Days, Vermonts Alt-Weekly",
"You flip through the pages. Nothing catches your eye."
);

const sign = new Item(
  "Sign", 
  `Welcome to Burlington Code Academy! Come on 
up to the third floor. If the door is locked, use the code 
12345`,
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
['street', 'roomThree'],
);

  //Do we need a lookup table for [current].description to work? Marshall mentioned that you can't have the first 
  //key be a variable unless you use a lookup table to convert the strimovng to an object by naming itself
  const roomLookupTable = {
    mainSt: mainSt,
    foyer: foyer,
    "street": mainSt
    //roomThree: roomThree
  }
  
  let player = new Player(
    'street',
    []
    );
  
  const lookUpItems = {
     paper: paper,
     "seven days": paper,
     sign: sign,
     door: door,
     }

//Transition between rooms
function enterState(newState, currentRoom) {
   // console.log(roomLookupTable[currentRoom].canChangeTo)
  // console.log(`Entering enterState() the currenState is: ${roomLookupTable[currentRoom].canChangeTo}`);
  // console.log(`enterState with ${newState} as the argument`);
  if(roomLookupTable[currentRoom].canChangeTo.includes(newState)){
    player.currentState = newState;
    console.log(roomLookupTable[player.currentState].name);
    console.log(roomLookupTable[player.currentState].description);
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
  let input = await ask("\nWhat would you like to do?\n>_");
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