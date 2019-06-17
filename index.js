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
const paper = new Item("seven days", "You are carrying seven days, Vermonts Alt-Weekly", `You pick up the paper and leaf through it looking for comics and ignoring the articles, just like everybody else does.`)

//Rooms
let MainSt = new Room(
  "182 Main St.",
  `You are standing on Main Street between Church and South Winooski.
  There is a door here. A keypad sits on the handle.
  On the door is a handwritten sign.`,
  ['test'],//move read sign to actions and make inventory an array
  ['foyer'],
  {'read sign': `The sign says "Welcome to Burlington Code Academy! Come on 
  up to the third floor. If the door is locked, use the code
  12345."`, 12345: 'foyer', 'take sign': "That would be selfish, how would other students find their way?", 'open door': `The door is locked. There is a keypad on the door handle.`} 
);

let foyer = new Room(
  '182 Main St. - Foyer',
  `You are in a foyer. Or maybe it's an antechamber. Or a 
  vestibule. Or an entryway. Or an atrium. Or a narthex.
  But let's forget all that fancy flatlander vocabulary,
  and just call it a foyer. In Vermont, this is pronounced
  "FO-ee-yurr".
  A copy of Seven Days lies in a corner.`,
  [paper], //inventory
  ['MainSt', 'roomThree'],
  {'seven days': paper.canPickUp} //actions
  );

  //Do we need a lookup table for [current].description to work? Marshall mentioned that you can't have the first 
  //key be a variable unless you use a lookup table to convert the string to an object by naming itself
  const roomLookupTable = {
    MainSt: MainSt,
    foyer: foyer,
    //roomThree: roomThree
  }

  
  //player
  let player = {
    currentState: 'MainSt',
    playerInventory: [],
  //Will need to add functions for interacting - pickUp, drop, look, read, etc...
  actions: {
    look(){
      console.log([currentState].description);
    },
    read(action, itemName){
      //console.log(`The value of passed argument in the read function was: ${itemName}`);
      if(Object.keys(roomLookupTable[player.currentState].actions).includes(action + " " + itemName)){
        console.log(roomLookupTable[player.currentState].actions[action + " " + itemName]);
        getInput();
      } else {
        console.log(`I'm sorry I can't read the ${itemName}`);
        getInput();
      }
    },
    enter(action, code) {
      if(code === '12345'){ //move to MainSt actions
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
      } else if(roomLookupTable[player.currentState].roomInventory.includes(itemName)){
        let index = roomLookupTable[player.currentState].roomInventory.indexOf(itemName); //finds the item in the roomInventory
        player.playerInventory.push(roomLookupTable[player.currentState].roomInventory[index]); //pushes the item to the playerInventory based on the index
        roomLookupTable[player.currentState].roomInventory.splice(index, 1); //removes the item from the roomInventory
        console.log(`You took the ${itemName}`);
        getInput();
      } else {
        console.log(roomLookupTable[player.currentState].roomInventory);
      console.log(`I'm sorry I can't take the ${itemName}`);
      getInput();
     }
    }, 
    
    drop(action, itemName){ 
      console.log(player.playerInventory);
      if(player.playerInventory.includes(itemName)){
        let index = player.playerInventory.indexOf(itemName);
        roomLookupTable[player.currentState].roomInventory.push(player.playerInventory[index]); 
        player.playerInventory.splice(index, 1);;
        console.log(`You dropped the ${itemName}`);
        getInput();
      } else {
      console.log(`I'm sorry you can't drop the ${itemName}`);
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
    }, 
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
  console.log(input);
  let arrInput = input.toLowerCase().split(" ");
  if(arrInput[1] === 'seven' && arrInput[2] === 'days'){
    arrInput.push('seven days');
  }
  checkInput(arrInput[0], arrInput[arrInput.length-1], arrInput);
}


function checkInput(arg1, arg2, arrInput){
  if(arg1 === 'i' || arg1 === 'inventory' || (arg1 === 'take' && arg2 === 'inventory')){
      if(player.playerInventory.length < 1){
        console.log("You have nothing.")
        getInput();
      } else {
        console.log(`You have: ${player.playerInventory.join(" ")}`)
        //console.log(player.playerInventory)
        getInput();
      }
  }else if(Object.keys(player.actions).includes(arg1)){
    player.actions[arg1](arg1, arg2);
  }else{
    console.log(`I'm sorry I don't know how to ${arrInput.join(" ")}`);
    getInput();
  }
}



start();