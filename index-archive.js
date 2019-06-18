/*~~~~~~~~~~~~~~~~~~~~ Begin Boiler Plate ~~~~~~~~~~~~~~~~~~*/
const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
/*~~~~~~~~~~~~~~~~~~~~~~End Boiler Plate~~~~~~~~~~~~~~~~~~~~*/

// remember the StateMachine lecture
// https://bootcamp.burlingtoncodeacademy.com/lessons/cs/state-machines
let states = {
  'roomOne': { 
    canChangeTo: ['roomTwo'], 
    name: "182 Main St.",
    description: `You are standing on Main Street between Church and South Winooski.
     There is a door here. A keypad sits on the handle.
     On the door is a handwritten sign.`,
    actions: ["read", "sign", "take", "open", "door", "enter", "code", "12345", "key"],
    lockStatus: "locked",
    unlock : function(){
      this.lockStatus = "unlocked"
      console.log("Success! The door opens. You enter the foyer and the door shuts behind you.");
      playerObject.changeRoom(this.canChangeTo);
    },
    read: function(){
      console.log(`\nThe sign says "Welcome to Burlington Code Academy! Come on 
      up to the third floor. If the door is locked, use the code
      12345."\n`);
    },
    take: function() {
      console.log(`\nThat would be selfish. How will other students find their way?`);
    },
    inventory: null,
    doorLocked: '\nThe door is locked. There is a keypad on the door handle.',
    
    ifChecks: function(arr) {
      if(arr.includes("read") && arr.includes("sign")) {
        this.read();
        play();
      } 
      if(arr.includes("take") && arr.includes("sign")) {
        this.take();
        play();
      } 
      if(arr.includes("open") && arr.includes("door") && this.lockStatus === "locked") {
        console.log(this.doorLocked);
        play();
      } 
      if((arr.includes("enter") || arr.includes("key")) && arr.includes("code")){
        if(arr.includes("12345")) {
            this.unlock();
            play();
        }else{
          console.log("Bzzzzt! The door is still locked.");
          play();
        }
      }
      else {
        console.log(`Sorry, I don't know how to ${arr.join(" ")}.`);
        play();
      }
    }  
  },
    'roomTwo': { canChangeTo: [ 'roomThree' ] },
    'roomThree': { canChangeTo: [ 'roomOne' ] }
};

//Currently not using
function enterState(newState) {
  let validTransitions = states[currentState].canChangeTo;
  if (validTransitions.includes(newState)) {
    currentState = newState;
  } else {
    throw 'Invalid state transition attempted - from ' + currentState + ' to ' + newState;
  }
}

start();

function start() {
  console.log(`182 Main St.
  You are standing on Main Street between Church and South Winooski.
There is a door here. A keypad sits on the handle.
On the door is a handwritten sign.`);
play();
    // process.exit();
}

async function play() {
  let answer = await ask("What would you like to do?\n>_");
  let answerArr = answer.split(" ");
  states[playerObject.currentState].ifChecks(answerArr); //This function will need to be more general and could take the answerArr and the currentState
  
}

// let roomOne = {
//   name: "182 Main St.",
//   description: `You are standing on Main Street between Church and South Winooski.
//   There is a door here. A keypad sits on the handle.
//   On the door is a handwritten sign.`,
//   actions: ["read", "sign", "take", "open", "door", "enter", "code", "12345", "key"],
//   canChangeTo: ['roomTwo'],
//   lockStatus: "locked",
//   unlock : function(){
//     this.lockStatus = "unlocked"
//     console.log("Success! The door opens. You enter the foyer and the door shuts behind you.");
//     playerObject.changeRoom(this.canChangeTo);
//   },
//   read: function(){
//     console.log(`\nThe sign says "Welcome to Burlington Code Academy! Come on 
//     up to the third floor. If the door is locked, use the code
//     12345."`);
//   },
//   take: function() {
//     console.log(`\nThat would be selfish. How will other students find their way?`);
//   },
//   inventory: null,
//   doorLocked: '\nThe door is locked. There is a keypad on the door handle.',
  
//   roomOneChecks: function(arr) {
//     if(arr.includes("read") && arr.includes("sign")) {
//       playerObject.currentState.read();
//       play();
//     } 
//     if(arr.includes("take") && arr.includes("sign")) {
//       playerObject.currentState.take();
//       play();
//     } 
//     if(arr.includes("open") && arr.includes("door") && playerObject.currentState.lockStatus === "locked") {
//       console.log(playerObject.currentState.doorLocked);
//       play();
//     } 
//     if((arr.includes("enter") || arr.includes("key")) && arr.includes("code")){
//       if(arr.includes("12345")) {
//           playerObject.currentState.unlock();
//           play();
//       }else{
//         console.log("Bzzzzt! The door is still locked.");
//         play();
//       }
//     }
//     else {
//       console.log(`Sorry, I don't know how to ${arr.join(" ")}.`);
//       play();
//     }
//   }  
// }

let roomTwo = {
  name: "182 Main St. - Foyer",
  description: `You are in a foyer. Or maybe it's an antechamber. Or a 
  vestibule. Or an entryway. Or an atrium. Or a narthex.
  But let's forget all that fancy flatlander vocabulary,
  and just call it a foyer. In Vermont, this is pronounced
  "FO-ee-yurr".`,
  actions: [],
  canChangeTo: ['roomOne', 'roomThree'],
  lockStatus: "unlocked",
  unlock : function(){
    playerObject.changeRoom(this.canChangeTo);
  },
  read: function(){
    console.log(`\nText for Seven Days`);
  },
  take: function() {
    console.log(`\nYou pick up the Seven Days`);
    //function that removes the Seven Days from the room inventory (set value to null?) and creates it in the player inventory
  },
  inventory: {
    "Seven Days": `A copy of Seven Days lies in a corner.` //Object.key(roomTwo.inventory).forEach=>(key){console.log(key)}
  },
  doorLocked: '\nThe door is locked. There is a keypad on the door handle.',
  
  roomTwoChecks: function(arr) {
    if(arr.includes("read") && arr.includes("sign")) {
      playerObject.currentState.read();
      play();
    } 
    if(arr.includes("take") && arr.includes("sign")) {
      playerObject.currentState.take();
      play();
    } 
    if(arr.includes("open") && arr.includes("door") && playerObject.currentState.lockStatus === "locked") {
      console.log(playerObject.currentState.doorLocked);
      play();
    } 
    if((arr.includes("enter") || arr.includes("key")) && arr.includes("code")){
      if(arr.includes("12345")) {
          playerObject.currentState.unlock();
          play();
      }else{
        console.log("Bzzzzt! The door is still locked.");
        play();
      }
    }
    else {
      console.log(`Sorry, I don't know how to ${arr.join(" ")}.`);
      play();
    }
  }  
}

// let states = {
//   "green": {canChangeTo: ["yellow"]},
//   "yellow": {canChangeTo: ["red"]},
//   "red": {canChangeTo: ["green"]}
// }

// let currentState = "green";

// function enterState(newState) {
//   let validTransitions = states[currentState].canChangeTo;
//   if (validTransitions.includes(newState)) {
//     currentState = newState;
//   } else {
//     throw "Invalid state transition attempted - from " + currentState + " to " + newState;
//   }
// }


let playerObject = {
  inventory: [],
  currentState: 'roomOne',
  changeRoom: function(newState){
    let validTransitions = states[this.currentState].canChangeTo;
    console.log("validTransitions = " + validTransitions)
    if (validTransitions.includes(newState)) {
          this.currentState = newState;
    } else {
        throw "Invalid state transition attempted - from " + [this.currentState] + " to " + newState;
    } 
  }
}


//Saving for later
// class Room {
//   constructor(name, description, actions, canChangeTo, lockStatus){
//   this.name = name;
//   this.description = description;
//   this.actions = actions;
//   this.canChangeTo = canChangeTo;
//   this.lockStatus = lockStatus;
// }
//let roomOne = new Room()



