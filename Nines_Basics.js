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

function shuffleArray(array) {
  for (let i = array.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function threebythree(array) {
  for (let i = 0; i < 8; i = i + 3) {
    console.log(array[i] + " - " + array[i + 1] + " - " + array[i + 2]);
  }
}

function crossSum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum = sum + array[i];
  }
  return sum;
}

const x = 9;
let check = 0;

const ninesClean = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const nines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
//let shuffledNines = nines.sort((a, b) => 0.5 - Math.random());
const shuffledNines = shuffleArray(nines);

const row1 = [shuffledNines[0], shuffledNines[1], shuffledNines[2]];
const row2 = [shuffledNines[3], shuffledNines[4], shuffledNines[5]];
const row3 = [shuffledNines[6], shuffledNines[7], shuffledNines[8]];
const column1 = [shuffledNines[0], shuffledNines[3], shuffledNines[6]];
const column2 = [shuffledNines[1], shuffledNines[4], shuffledNines[7]];
const column3 = [shuffledNines[2], shuffledNines[5], shuffledNines[8]];
const diagonalLeft = [shuffledNines[0], shuffledNines[4], shuffledNines[8]];
const diagonalRight = [shuffledNines[2], shuffledNines[4], shuffledNines[6]];

/*for (let i = 0; i < x; i++) {
  check = Math.floor(Math.random() * 9) + 1;
  if (i > 0) {
    nines[i] = addNewRandomNumber(nines, check);
  } else {
    nines[i] = check;
  }

  //console.log(nines);

  console.log("Nines Array at Position [" + i + "]: " + nines[i] + " !");
  if (arrayCheck(nines, check)) {
    console.log("But we already have this in our array.");
  }
}
*/

console.log("Base Array: " + ninesClean);
console.log("Shuffled Array: " + shuffledNines);

/*console.log(
  shuffledNines[0] + " - " + shuffledNines[1] + " - " + shuffledNines[2]
);
console.log(
  shuffledNines[3] + " - " + shuffledNines[4] + " - " + shuffledNines[5]
);
console.log(
  shuffledNines[6] + " - " + shuffledNines[7] + " - " + shuffledNines[8]
);
*/
console.log("Three by three:");
threebythree(shuffledNines);
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
