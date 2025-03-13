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
  structure = [];
  prize;

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
    this.structure = [
      { name: "row1", set: this.row1, slots: [1, 2, 3] },
      { name: "row2", set: this.row2, slots: [4, 5, 6] },
      { name: "row3", set: this.row3, slots: [7, 8, 9] },
      { name: "column1", set: this.column1, slots: [1, 4, 7] },
      { name: "column2", set: this.column2, slots: [2, 5, 8] },
      { name: "column3", set: this.column3, slots: [3, 6, 9] },
      { name: "diagonal left", set: this.diagonalLeft, slots: [1, 5, 9] },
      { name: "diagonal right", set: this.diagonalRight, slots: [3, 5, 7] },
    ];
    this.prize = null;
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
    return [this.nineArray[2], this.nineArray[5], this.nineArray[8]];
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
    /* const tempArray = [...this.visibles];
    tempArray.push(visib);
    this.visibles = tempArray; */
    this.visibles.push(visib);
  }

  // alwasy pre format slot 1 -> pass 0
  checkIfVisible(visib) {
    if (this.visibles.includes(visib)) {
      return true;
    }
    return false;
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

  revealSlotManually() {
    let unrevealed = false;
    let input = "";
    let nineSet = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    do {
      input = prompt(chalk.blue("Which slot do you want to reveal? (1-9) "));
      input = parseInt(input);
      if (nineSet.has(input - 1)) {
        unrevealed = !this.checkIfVisible(input - 1);
        if (unrevealed) {
          console.log("Slot " + input + " was revealed!");
          this.addVisible(input - 1);
          this.threebythreeHighlighted(this.visibles);
        } else {
          console.log(chalk.red("This slot is already revealed!"));
        }
      } else {
        console.log(
          chalk.red(
            "Please select a slot (1, 2, 3, 4, 5, 6, 7, 8, 9) that is not revealed yet."
          )
        );
      }
    } while (!unrevealed);
  }

  chooseSetManually() {
    let input = "";
    let choiceMade = false;
    let result = 0;
    let winningText = ""; /// Adjust this, make it much easier and clearer
    let options = new Set([
      "row1",
      "row2",
      "row3",
      "column1",
      "column2",
      "column3",
      "diagonal left",
      "diagonal right",
    ]);

    do {
      input = prompt(
        chalk.blue(
          "Which set of three numbers do you want to choose? (Allowed inputs are: row1, row2, row3, column1, column2, column3, diagonal left, diagonal right) "
        )
      );
      if (options.has(input)) {
        choiceMade = true;
      } else {
        console.log(
          chalk.red(
            "Please type in a valid input: (Allowed inputs are: row1, row2, row3, column1, colum2, column3, diagonal left, diagonal right)"
          )
        );
      }
    } while (!choiceMade);

    this.structure.forEach((n) => {
      if (n.name === input) {
        result = crossSum(n.set);
        winningText =
          n.name +
          " was picked: " +
          n.set +
          " => " +
          result +
          " => " +
          this.prizeFromSet(n.set) +
          " is your prize.";
        this.prize = this.prizeFromSet(n.set);
        this.threebythreeFinal([
          n.slots[0] - 1,
          n.slots[1] - 1,
          n.slots[2] - 1,
        ]);
        console.log(winningText);
        console.log("end");
      }
    });
  }

  getGameResult() {
    return {
      nineArray: [...this.nineArray],
      visibles: [...this.visibles],
      prize: this.prize,
    };
  }

  gameStart() {
    //print out with only start revealed
    // 3x: reveal new number, print out again
    // select final set
    // prize display
    // testing:
    this.threebythreeHighlighted(this.visibles);
    console.log(this.visibles);
    console.log("First reveal:");
    this.revealSlotManually();
    console.log("Second reveal:");
    this.revealSlotManually();
    console.log("Third reveal:");
    this.revealSlotManually();
    console.log("Set choice:");
    this.chooseSetManually();
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

  // function to log out the fully revealed array, colouring the selected final set to mark it
  threebythreeFinal(input) {
    const colourSlots = [...input];

    // create array for coloured numbers, map the different colours on the index based on being included in colourslots
    const tempColours = this.nineArray.map((num, index) =>
      colourSlots.includes(index)
        ? chalk.yellowBright(num)
        : chalk.magentaBright(num)
    );
    this.threebythree(tempColours);
  }
}

console.log(chalk.red("TEST"));

const prompt = promptSync();

/* let testGame = new NinesGame();
console.log(testGame.nineArray);
console.log(testGame.startingSlot);
console.log(testGame.visibles);
console.log(testGame.gameID); */

let testGame = new NinesGame();
let testGame2 = new NinesGame("614735892_4");
/* console.log(testGame2.nineArray);
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
testGame2.chooseSetManually();
console.log(testGame2.structure[0]);
 */
const gameHistory = [];
console.log(testGame.visibles);
testGame.gameStart();
gameHistory.push(testGame.getGameResult());
console.log(gameHistory);
