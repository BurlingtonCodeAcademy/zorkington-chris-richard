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
  constructor(name, description, canPickUp, pickUpText, inventoryText){
    this.name = name;
    this.description = description;
    this.canPickUp = canPickUp;
    this.pickUpText = pickUpText;
    this.inventoryText = inventoryText;
  }
}
const paper = new Item(
"Seven Days", 
"Some kind of newspaper", 
true,
`You pick up the paper and leaf through it looking for comics and ignoring the articles, just like everybody else does.`,
"You are carrying seven days, Vermonts Alt-Weekly"
);

const sign = new Item(
  "Sign", 
  "Welcome to Burlington Code Academy! Come on up to the third floor. If the door is locked, use the code 12345",
  false,
  "",
  "",
);


//Rooms
let mainSt = new Room(
  "182 Main St.",
  `You are standing on Main Street between Church and South Winooski.
  There is a door here. A keypad sits on the handle.
  On the door is a handwritten sign.`,
  [sign],
  ['mainSt', 'foyer'])

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
     }

  class Player {
    constructor(currentState, playerInventory) {
      this.currentState = currentState
      this.playerInventory = playerInventory
    }

    get actions(actionToDo, item) {
      return this[actionToDo] ? this.actionToDo(item) : `I do not know how to do ${actionToDo}`
    }

    look(itemName) {
      console.log([currentState].description);
    }

    read(itemName){
      let item = lookUpItems[itemName];
      let currentRoom = roomLookupTable[player.currentState];
      console.log({currentState: this.currentState}); //this is currently undefined... why?
      console.log(roomLookupTable[player.currentState].inventory); //this is currently undefined... why?
      console.log(currentRoom.roomInventory.includes(item));
      if (player.playerInventory.includes(item) || currentRoom.roomInventory.includes(item)){
       console.log(item.description);
     }else{
       console.log(`You dont have ${itemName}`);
     }
      getInput();
    }
  }
  //player
  let player = {
    currentState: 'mainSt',
    playerInventory: [],
  //Will need to add functions for interacting - pickUp, drop, look, read, etc...
  actions: {
    look(){
      console.log([currentState].description);
    },
    read(itemName){
      let item = lookUpItems[itemName];
      let currentRoom = roomLookupTable[player.currentState];
      console.log({currentState: this.currentState}); //this is currently undefined... why?
      console.log(roomLookupTable[player.currentState].inventory); //this is currently undefined... why?
      console.log(currentRoom.roomInventory.includes(item));
      if (player.playerInventory.includes(item) || currentRoom.roomInventory.includes(item)){
       console.log(item.description);
     }else{
       console.log(`You dont have ${itemName}`);
     }
        getInput();
      }
    },
    enter(code) {
      if(code === '12345'){ //move to MainSt actions
        console.log('Success! The door opens. You enter the foyer and the door shuts behind you.')
        enterState('foyer');
      } else {
        console.log(`Bzzzzt! The door is still locked.`);
        getInput();
      }
    },
    take(itemName){ 
      let item = lookUpItems[itemName];
      let currentRoom = roomLookupTable[player.currentState];

      if(item.canPickUp && currentRoom.inventory.includes(item)){
        let index = currentRoom.roomInventory.indexOf(itemName); //finds the item in the roomInventory
        currentRoom.roomInventory.splice(index, 1); //removes the item from the roomInventory
        player.playerInventory.push(currentRoom.roomInventory[index]); //pushes the item to the playerInventory based on the index
        console.log(`You took the ${itemName}`);
        getInput();
      }
    //   if(Object.keys(roomLookupTable[player.currentState].actions).includes(action + " " + itemName)){
    //     console.log(roomLookupTable[player.currentState].actions[action + " " + itemName]);
    //     getInput();
    //   } else if(roomLookupTable[player.currentState].roomInventory.includes(itemName)){
    //     console.log(player.playerInventory);
    //     let index = roomLookupTable[player.currentState].roomInventory.indexOf(itemName); //finds the item in the roomInventory
    //     player.playerInventory.push(roomLookupTable[player.currentState].roomInventory[index]); //pushes the item to the playerInventory based on the index
    //     roomLookupTable[player.currentState].roomInventory.splice(index, 1); //removes the item from the roomInventory
    //     console.log(`You took the ${itemName}`);
    //     getInput();
    //   } else {
    //   console.log(`I'm sorry I can't take the ${itemName}`);
    //   getInput();
    //  }
    }, 
    
    drop(itemName){ 
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





function enterState(newState) {
  //console.log(`enterState with ${newState} as the argument`)
  let validTransitions = roomLookupTable[player.currentState].canChangeTo;
  if (validTransitions.includes(newState)) {
    player.currentState = roomLookupTable[newState];
    console.log(player.currentState.description);
    getInput();
  } else {
    throw 'Invalid state transition attempted - from ' + player.currentState + ' to ' + newState;
  }
}

function start() {
  console.log("Please enter your commands as two words. For example 'open door' or 'read sign'.");
  player.currentState = 'mainSt';
  enterState('mainSt');
}

async function getInput() {
  let input = await ask("What would you like to do?\n>_");
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
  }else if(Object.keys(player.actions).includes(arg1)){player.actions[arg1](arg1, arg2); 
  }else if(arg1 === 'read'){player.action.read(lookUpItems[arg2]);
  }else if(arg1 === 'take'){player.action.take(lookUpItems[arg2]);
  }else if(arg1 === 'open'){player.action.open(lookUpItems[arg2]);
  }else if(arg1 === 'drop'){player.action.drop(lookUpItems[arg2]);
  }else if(arg1 === 'look'){player.action.look();
  }else{
    console.log(`I'm sorry I don't know how to ${arrInput.join(" ")}`);
  }
  getInput();
}



start();