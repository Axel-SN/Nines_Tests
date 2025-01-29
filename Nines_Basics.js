// Test functions from the first attempts at creating a randomized array, kept here in case they are useful for now

function arrayCheck(array, number) {
  let breakpoint = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] == number) {
      breakpoint++;
    }
    if (breakpoint > 1) return true;
  }
  return false;
}

function printArray(array) {
  for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
  }
}

function addNewRandomNumber(array, number) {
  if (array.includes(number)) {
    return number;
  } else {
    return addNewRandomNumber(array, Math.floor(Math.random() * 9) + 1);
  }
}

// end of test functions

// A function to implement the Fisher–Yates shuffle for arrays - code snippet found online
function shuffleArray(array) {
  for (let i = array.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// A funtion to output an array containing nine elements in a three by three format to showcase rows and columns better
function threebythree(array) {
  for (let i = 0; i < 8; i = i + 3) {
    console.log(array[i] + " - " + array[i + 1] + " - " + array[i + 2]);
  }
}

// This function aims to display a set of nine numbers, but only for numbers present in the args array, anything else will be marked with an X
function threebythreeNines(nineArray, args) {
  let tempArray = [];

  for (let i = 0; i < nineArray.length; i++) {
    if (args.includes(i)) {
      tempArray.push(nineArray[i]);
    } else {
      tempArray.push("X");
    }
  }

  threebythree(tempArray);
}

// A function that calculates the cross sum of a given set of numbers as an array
function crossSum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum = sum + array[i];
  }
  return sum;
}

// A function that uses a passed value of a cross sum and returns the given element index of the prizes array to be used
function prizeSelect(prizes, value) {
  for (let b = 0; b < prizes.length; b++) {
    if (prizes[b].sum == value) {
      return b;
    }
  }
  return 0;
}

// A function that is supposed to simulate the player choosing three spots to reveal, the only accepted inputs should be unrevealed numbers, to not have to deal with edge cases and faulty inputs.
// Refactored version of the revealing function.
function revealing2(nineArray, visibles) {
  let input;
  for (let i = 0; i < 3; i++) {
    input = prompt("\x1b[34mWhich one do you want to reveal? \x1b[0m");
    input = parseInt(input);
    //console.log("input: " + input);
    if (nineArray.includes(input) && !visibles.includes(input - 1)) {
      visibles.push(input - 1);
      //console.log("for1: " + input + " i: " + i);
    } else if (nineArray.includes(input) && visibles.includes(input - 1)) {
      console.log("This slot is already revealed!");
      i--;
      //console.log("for2: " + input + " i: " + i);
    } else {
      console.log(
        "\x1b[35m Please select a slot (1, 2, 3, 4, 5, 6, 7, 8, 9) that is not revealed yet."
      );
      i--;
      //console.log("for3: " + input + " i: " + i);
    }
    console.log(visibles);
    threebythreeNines(nineArray, visibles);
  }
}

// This function aims to have the player select which set to choose as their final answer. The player will be asked to input a valid set, otherwise they will contiuously get asked to input a valid one. The output message will be the selected set, its cross sum and the prize
function setSelect2(nineArray, prizes) {
  let sumString = ". The cross sum is: ";
  let prizeString = ". Your prize is: ";
  let selectString = " was selected! Your numbers are: ";
  let input;
  let flag = true;
  const row1 = [nineArray[0], nineArray[1], nineArray[2]];
  const row2 = [nineArray[3], nineArray[4], nineArray[5]];
  const row3 = [nineArray[6], nineArray[7], nineArray[8]];
  const column1 = [nineArray[0], nineArray[3], nineArray[6]];
  const column2 = [nineArray[1], nineArray[4], nineArray[7]];
  const column3 = [nineArray[2], nineArray[5], nineArray[8]];
  const diagonalLeft = [nineArray[0], nineArray[4], nineArray[8]];
  const diagonalRight = [nineArray[2], nineArray[4], nineArray[6]];
  const optionsFull = [
    { name: "row1", set: row1 },
    { name: "row2", set: row2 },
    { name: "row3", set: row3 },
    { name: "column1", set: column1 },
    { name: "column2", set: column2 },
    { name: "column3", set: column3 },
    { name: "diagonal left", set: diagonalLeft },
    { name: "diagonal right", set: diagonalRight },
  ];

  do {
    input = prompt(
      "\x1b[34mWhich set of three numbers do you want to choose? (Allowed inputs are: row1, row2, row3, column1, column2, column3, diagonal left, diagonal right) \x1b[0m"
    );
    if (optionsFull.some((x) => x.name === input)) {
      inputFound = optionsFull.find((x) => x.name === input).set;
      console.log(
        input +
          selectString +
          inputFound +
          sumString +
          crossSum(inputFound) +
          prizeString +
          prizes[prizeSelect(prizes, crossSum(inputFound))].prize
      );
      flag = false;
    } else {
      console.log(
        "\x1b[35m Please type in a valid input: (Allowed inputs are: row1, row2, row3, column1, colum2, column3, diagonal left, diagonal right) \x1b[0m"
      );
    }
  } while (flag);
}

// Function that starts the game.
function gameStart(nineArray, args, prizes) {
  revealing2(nineArray, args);
  setSelect2(nineArray, prizes);
}

// Actual start of things //

// variables
const pv = "Prize if you chose ";
const startValue = Math.floor(Math.random() * 9);
// initialize the usage of the prompt function to allow for user input
const prompt = require("prompt-sync")();

// an array to showcase the prizes available for each cross sum
const prizes = [
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

// create a basic array of nine numbers, then create a shuffled array for each instance of a nines game
const ninesClean = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const nines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const shuffledNines = shuffleArray(nines);
const ninesFull = [
  { value: shuffledNines[0], visib: false },
  { value: shuffledNines[1], visib: false },
  { value: shuffledNines[2], visib: false },
  { value: shuffledNines[3], visib: false },
  { value: shuffledNines[4], visib: false },
  { value: shuffledNines[5], visib: false },
  { value: shuffledNines[6], visib: false },
  { value: shuffledNines[7], visib: false },
  { value: shuffledNines[8], visib: false },
];
const visibles = [];
visibles.push(startValue);
ninesFull[startValue].visib = true;

// define the structures for rows, columns and diagonals in a given set of nines by creating multiple arrays
const row1 = [shuffledNines[0], shuffledNines[1], shuffledNines[2]];
const row2 = [shuffledNines[3], shuffledNines[4], shuffledNines[5]];
const row3 = [shuffledNines[6], shuffledNines[7], shuffledNines[8]];
const rows = [row1, row2, row3];
const column1 = [shuffledNines[0], shuffledNines[3], shuffledNines[6]];
const column2 = [shuffledNines[1], shuffledNines[4], shuffledNines[7]];
const column3 = [shuffledNines[2], shuffledNines[5], shuffledNines[8]];
const columns = [column1, column2, column3];
const diagonalLeft = [shuffledNines[0], shuffledNines[4], shuffledNines[8]];
const diagonalRight = [shuffledNines[2], shuffledNines[4], shuffledNines[6]];
const diagonals = [diagonalLeft, diagonalRight];
const setsFull = [
  { name: "row1", set: row1 },
  { name: "row2", set: row2 },
  { name: "row3", set: row3 },
  { name: "column1", set: column1 },
  { name: "column2", set: column2 },
  { name: "column3", set: column3 },
  { name: "diagonal left", set: diagonalLeft },
  { name: "diagonal right", set: diagonalRight },
];

// Control outputs //
console.log("\x1b[32m //// CONTROL OUTPUTS //// \x1b[0m");

// output the base array and the shuffled array
console.log("Base Array: " + ninesClean);
console.log("Shuffled Array: " + shuffledNines);
//console.log(ninesFull);
console.log("startvalue: " + startValue);
console.log(visibles);

// output the array in a three be three row/column format for better visualization
console.log("Three by three:");
threebythree(shuffledNines);
//console.log("Three by three with hidden:");
//threebythreeNines(shuffledNines, visibles);
//threebythreeNines(shuffledNines, [1, 3, 5, 6, 7, 8]);

// calculate and output the cross sum of each row, column and diagonal
console.log("Cross sum of row1: " + crossSum(row1));
console.log("Cross sum of row2: " + crossSum(row2));
console.log("Cross sum of row3: " + crossSum(row3));
console.log("Cross sum of column1: " + crossSum(column1));
console.log("Cross sum of column2: " + crossSum(column2));
console.log("Cross sum of column3: " + crossSum(column3));
console.log(
  "Cross sum of diagonal Upper left to lower right: " + crossSum(diagonalLeft)
);
console.log(
  "Cross sum of diagonal Upper right to lower left: " + crossSum(diagonalRight)
);

// Show the prize of each cross sum for the given set of nines
setsFull.forEach(function (set) {
  console.log(
    pv +
      set.name +
      " = " +
      crossSum(set.set) +
      ": " +
      prizes[prizeSelect(prizes, crossSum(set.set))].prize
  );
});

console.log("\x1b[32m //// Start of the game //// \x1b[0m");
console.log("\x1b[34mThree by three with hidden: \x1b[0m");
threebythreeNines(shuffledNines, visibles);
gameStart(shuffledNines, visibles, prizes);
console.log("\x1b[32m //// End of the game //// \x1b[0m");
