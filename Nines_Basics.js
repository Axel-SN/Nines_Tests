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

//

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

// variables for quick testing purposes
const x = 9;
let check = 0;
const pv = "Prize if you chose ";

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

// create a basic array of 9 numbers, then create a shuffled array for each instance of a nines game
const ninesClean = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const nines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const shuffledNines = shuffleArray(nines);

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

// output the base array and the shuffled array
console.log("Base Array: " + ninesClean);
console.log("Shuffled Array: " + shuffledNines);

// output the array in a three be three row/column format for better visualization
console.log("Three by three:");
threebythree(shuffledNines);

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

for (let r = 0; r < rows.length; r++) {
  console.log(
    pv +
      "row" +
      (r + 1) +
      " = " +
      crossSum(rows[r]) +
      ": " +
      prizes[prizeSelect(prizes, crossSum(rows[r]))].prize
  );
}
for (let c = 0; c < columns.length; c++) {
  console.log(
    pv +
      "column" +
      (c + 1) +
      " = " +
      crossSum(rows[c]) +
      ": " +
      prizes[prizeSelect(prizes, crossSum(columns[c]))].prize
  );
}
for (let d = 0; d < diagonals.length; d++) {
  console.log(
    pv +
      "diagonal" +
      (d + 1) +
      " = " +
      crossSum(diagonals[d]) +
      ": " +
      prizes[prizeSelect(prizes, crossSum(diagonals[d]))].prize
  );
}
