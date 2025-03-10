import chalk from "chalk";
import promptSync from "prompt-sync";

// To do:
// create class for game instances
// decide on all the necessary internal info
// make constructor
// handle getter and setter
// implement all the necessary game functions
// create a functionality to log and pass game data
// implement game IDs to easily identify and test them

// A function to implement the Fisher–Yates shuffle for arrays - code snippet found online
function shuffleArray(arr) {
  let array = [...arr];
  for (let i = array.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// a function to get the game configuration based on a gameID
// format being the nines slot configuration as well as the starting slot
function decodeGameID(sessionID) {
  let [arrayStr, startSlot] = sessionID.split("_");
  let nineArray = arrayStr.split("").map(Number); // Convert string digits back to numbers
  return { nineArray, startingSlot: Number(startSlot) };
}

// A function that calculates the cross sum of a given set of numbers as an array
function crossSum(array) {
  return array.reduce((sum, number) => sum + number, 0);
}

class NinesGame {
  // an array to showcase the prizes available for each cross sum
  prizes = [
    { sum: 6, prize: 10000 },
    { sum: 7, prize: 36 },
    { sum: 8, prize: 720 },
    { sum: 9, prize: 360 },
    { sum: 10, prize: 80 },
    { sum: 11, prize: 252 },
    { sum: 12, prize: 108 },
    { sum: 13, prize: 72 },
    { sum: 14, prize: 54 },
    { sum: 15, prize: 180 },
    { sum: 16, prize: 72 },
    { sum: 17, prize: 180 },
    { sum: 18, prize: 119 },
    { sum: 19, prize: 36 },
    { sum: 20, prize: 306 },
    { sum: 21, prize: 1080 },
    { sum: 22, prize: 144 },
    { sum: 23, prize: 1800 },
    { sum: 24, prize: 3600 },
  ];

  nineArray = [];
  startingSlot;
  visibles = [];

  constructor(gameID = null) {
    // basic idea, change still maybe
    if (gameID) {
      let { nineArray, startingSlot } = decodeGameID(gameID);
      this.nineArray = nineArray;
      this.startingSlot = startingSlot;
    } else {
      this.nineArray = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      this.startingSlot = Math.floor(Math.random() * 9) + 1;
    }

    this.visibles = [this.startingSlot - 1];
  }

  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////

  get nineArray() {
    return this.nineArray;
  }

  get startingSlot() {
    return this.startingSlot;
  }

  get visibles() {
    return this.visibles;
  }

  get row1() {
    return [this.nineArray[0], this.nineArray[1], this.nineArray[2]];
  }

  get row2() {
    return [this.nineArray[3], this.nineArray[4], this.nineArray[5]];
  }

  get row3() {
    return [this.nineArray[6], this.nineArray[7], this.nineArray[8]];
  }

  get column1() {
    return [this.nineArray[0], this.nineArray[3], this.nineArray[6]];
  }

  get column2() {
    return [this.nineArray[1], this.nineArray[4], this.nineArray[7]];
  }

  get column3() {
    return [this.nineArray[2], this.nineArray[4], this.nineArray[8]];
  }

  get diagonalLeft() {
    return [this.nineArray[0], this.nineArray[4], this.nineArray[8]];
  }

  get diagonalRight() {
    return [this.nineArray[2], this.nineArray[4], this.nineArray[6]];
  }

  get controlInformation() {}

  get gameID() {
    return this.nineArray.join("") + "_" + this.startingSlot;
  }

  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////

  // makes a slot visible, the visib argument should be formatted for array input, so slot 3 -> pass 2
  addVisible(visib) {
    const tempArray = [...this.visibles];
    tempArray.push(visib);
    this.visibles = tempArray;
  }

  prizeFromSum(sumNumber) {
    const index = this.prizes.findIndex((prize) => prize.sum === sumNumber);

    if (index !== -1) {
      return this.prizes[index].prize;
    } else {
      // a console log for an error should be here, or throwing one
      return null;
    }
  }

  prizeFromSet(setNumbers) {
    const sumNumber = crossSum(setNumbers);
    return this.prizeFromSum(sumNumber);
  }

  checkVisible(visib) {
    if (visib <= 9 && visib >= 1) {
      if (this.visibles.includes(visib - 1)) {
        return false;
      } else {
        return true;
      }
    }
  }

  revealSlotManually() {
    let unrevealed = false;
    let input = "";

    do {
      input = prompt(chalk.blue("Which slot do you want to reveal? (1-9) "));
      input = parseInt(input);
      unrevealed = this.checkVisible(input);
    } while (!unrevealed);

    this.addVisible(input - 1);
  }

  gameStart() {
    //print out with only start revealed
    // 3x: reveal new number, print out again
    // select final set
    // prize display
  }

  // A funtion to output an array containing nine elements in a three by three format to showcase rows and columns better
  threebythreeAll() {
    for (let i = 0; i < 9; i += 3) {
      console.log(
        chalk.magentaBright(this.nineArray[i]) +
          " - " +
          chalk.magentaBright(this.nineArray[i + 1]) +
          " - " +
          chalk.magentaBright(this.nineArray[i + 2])
      );
    }
  }

  // A funtion to output an array containing nine elements in a three by three format to showcase rows and columns better
  threebythree(array) {
    for (let i = 0; i < 9; i += 3) {
      console.log(
        chalk.magentaBright(array[i]) +
          " - " +
          chalk.magentaBright(array[i + 1]) +
          " - " +
          chalk.magentaBright(array[i + 2])
      );
    }
  }

  // This function aims to display a set of nine numbers, but only for numbers present in the highlights array, anything else will be marked with an X
  threebythreeHighlighted(highlights) {
    // create a Set which houses the only slots to be highlighted
    const tempHighlights = new Set(highlights);
    // create a temporary array, mapping its contents by using the Set and either marking it as green or just an X
    const tempArray = this.nineArray.map((num, index) =>
      tempHighlights.has(index) ? chalk.green(num) : "X"
    );

    // data log cut test
    this.threebythree(tempArray);
  }
}

console.log(chalk.red("TEST"));

const prompt = promptSync();

let testGame = new NinesGame();
console.log(testGame.nineArray);
console.log(testGame.startingSlot);
console.log(testGame.visibles);
console.log(testGame.gameID);

let testGame2 = new NinesGame("123456789_1");
console.log(testGame2.nineArray);
console.log(testGame2.startingSlot);
testGame2.addVisible(1);
console.log(testGame2.visibles);
console.log(testGame2.gameID);
console.log(chalk.red("----"));
console.log(testGame2.prizeFromSet([1, 2, 3]));
console.log(testGame2.prizeFromSum(24));
console.log(testGame2.column3);
console.log(testGame2.prizeFromSet(testGame2.column3));
testGame2.threebythreeAll();
console.log(testGame2.visibles);
testGame2.threebythreeHighlighted(testGame2.visibles);
console.log(testGame2.checkVisible(3));
testGame2.revealSlotManually(); /// here
console.log(testGame2.checkVisible(3));
console.log(testGame2.visibles);
testGame2.threebythreeHighlighted(testGame2.visibles);
testGame2.revealSlotManually();
console.log(testGame2.visibles);
testGame2.threebythreeHighlighted(testGame2.visibles);
