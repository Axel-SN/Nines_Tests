// importing chalk for better visibility in
import chalk from "chalk";
import promptSync from "prompt-sync";

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
    console.log(
      chalk.magentaBright(array[i]) +
        " - " +
        chalk.magentaBright(array[i + 1]) +
        " - " +
        chalk.magentaBright(array[i + 2])
    );
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
function revealing2(nineArray, visibles, prizes, fullNines) {
  let input;
  for (let i = 0; i < 3; i++) {
    // with user input
    /*
    input = prompt(chalk.blue("Which one do you want to reveal? "));
    input = parseInt(input);
    */

    // with function
    input = solverPrimitive(nineArray, visibles, prizes, fullNines, false, 2);

    //console.log("input: " + input);
    if (nineArray.includes(input) && !visibles.includes(input - 1)) {
      visibles.push(input - 1);
      //console.log("for1: " + input + " i: " + i);
    } else if (nineArray.includes(input) && visibles.includes(input - 1)) {
      console.log(chalk.red("This slot is already revealed!"));
      i--;
      //console.log("for2: " + input + " i: " + i);
    } else {
      console.log(
        chalk.red(
          "Please select a slot (1, 2, 3, 4, 5, 6, 7, 8, 9) that is not revealed yet."
        )
      );
      i--;
      //console.log("for3: " + input + " i: " + i);
    }
    // control output to check if the revealed slots are correct
    //console.log(visibles);
    threebythreeNines(nineArray, visibles);
    console.log("--- next step ---");
    solverPrimitive(nineArray, visibles, prizes, fullNines, false, 0);
  }
}

// This function aims to have the player select which set to choose as their final answer. The player will be asked to input a valid set, otherwise they will contiuously get asked to input a valid one. The output message will be the selected set, its cross sum and the prize
function setSelect2(nineArray, prizes, visibles, fullNines) {
  let sumString = ". The cross sum is: ";
  let prizeString = ". Your prize is: ";
  let selectString = " was selected! Your numbers are: ";
  let input;
  let inputFound;
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
    // with user input
    /*
    input = prompt(
      chalk.blue(
        "Which set of three numbers do you want to choose? (Allowed inputs are: row1, row2, row3, column1, column2, column3, diagonal left, diagonal right) "
      )
    );
    */

    // using function input
    input = solverPrimitive(nineArray, visibles, prizes, fullNines, false, 1);

    if (optionsFull.some((x) => x.name === input)) {
      inputFound = optionsFull.find((x) => x.name === input).set;
      console.log(
        chalk.yellow(input) +
          selectString +
          chalk.yellow(inputFound) +
          sumString +
          chalk.greenBright(crossSum(inputFound)) +
          prizeString +
          chalk.greenBright(
            prizes[prizeSelect(prizes, crossSum(inputFound))].prize
          )
      );
      flag = false;
    } else {
      console.log(
        chalk.red(
          "Please type in a valid input: (Allowed inputs are: row1, row2, row3, column1, colum2, column3, diagonal left, diagonal right)"
        )
      );
    }
  } while (flag);
}

// Function to return all currently urevealed number slots of a given set of nine numbers
function unrevealed(nineArray, visibles) {
  const nine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let toCut = [];
  let leftovers = [];

  for (let i = 0; i < visibles.length; i++) {
    toCut.push(nineArray[visibles[i]]);
  }

  leftovers = nine.filter(function (element) {
    return !toCut.includes(element);
  });

  return leftovers;
  //console.log("to cut: " + toCut);
  //console.log("leftovers: " + leftovers);
}

// function to get the slots of a given set
function slotsFromName(name) {
  switch (name) {
    case "row1":
      return [1, 2, 3];
      break;
    case "row2":
      return [4, 5, 6];
      break;
    case "row3":
      return [7, 8, 9];
      break;
    case "column1":
      return [1, 4, 7];
      break;
    case "column2":
      return [2, 5, 8];
      break;
    case "column3":
      return [3, 6, 9];
      break;
    case "diagonal left":
      return [1, 5, 9];
      break;
    case "diagonal right":
      return [3, 5, 7];
      break;
    default:
      console.log(chalk.red("I think something broke"));
      return [123, 123, 123];
  }
}

// function to tally value amounts for given slots
function slotValue(optionsArray) {
  let data = [
    { number: 1, value: 0 },
    { number: 2, value: 0 },
    { number: 3, value: 0 },
    { number: 4, value: 0 },
    { number: 5, value: 0 },
    { number: 6, value: 0 },
    { number: 7, value: 0 },
    { number: 8, value: 0 },
    { number: 9, value: 0 },
  ];

  optionsArray.forEach(function (set) {
    set.slots.forEach(function (slot) {
      switch (slot) {
        case 1:
          data[0].value += set.value;
          break;
        case 2:
          data[1].value += set.value;
          break;
        case 3:
          data[2].value += set.value;
          break;
        case 4:
          data[3].value += set.value;
          break;
        case 5:
          data[4].value += set.value;
          break;
        case 6:
          data[5].value += set.value;
          break;
        case 7:
          data[6].value += set.value;
          break;
        case 8:
          data[7].value += set.value;
          break;
        case 9:
          data[8].value += set.value;
          break;
        default:
          console.log(chalk.red("I think we shouldnt be here..."));
          break;
      }
    });
  });

  //console.log("// slotvalues//");
  //console.log(data);

  //console.log("// slotvalues SORTED//");
  //console.log(data.sort((a, b) => b.value - a.value));

  //return data.sort((a, b) => b.value - a.value);

  return data;
}

// function to trim an options array by the visible numbers
// does not work as intended, needs to filter based on SLOT POSITION - NOT NUMBER !!!!!
function trimOptions(opts, fulln, visibs) {
  let toTrim = [];
  let trimmedOpts = opts;
  let index = -99;
  for (let i = 0; i < visibs.length; i++) {
    toTrim.push(fulln[visibs[i]]);
  }

  //console.log("// numbers to trim: " + toTrim);

  visibs.forEach(function (trimmer) {
    index = trimmedOpts.findIndex((x) => x.number == trimmer + 1);
    if (index > -1) {
      trimmedOpts.splice(index, 1);
    }
  });

  //console.log(chalk.red("errr lets see?"));
  //console.log(trimmedOpts);

  return trimmedOpts;
}

// primitive solving function tests
// try to ascertain results for a fully revealed set
// try to ascertain possible results for sets only missing one numbers
// try to ascertain possible results for sets missing two numbers
// attempt to ascertain possible high roll results (123, 789) for completely unknown sets of three numbers
function solverPrimitive(nineArray, visibles, prizes, ninesFull, log, flag) {
  let toCut = [];

  let amount = 0;
  let count = 0;

  let options = [];

  let best = { option: "abc", value: 0 };

  for (let i = 0; i < visibles.length; i++) {
    toCut.push(nineArray[visibles[i]]);
  }

  for (let j = 0; j < visibles.length; j++) {
    ninesFull[visibles[j]].visib = true;
  }

  let leftovers = unrevealed(nineArray, visibles);

  // control output
  //console.log(ninesFull);
  if (log) {
    console.log("leftovers: " + leftovers);
  }

  const row1 = [ninesFull[0], ninesFull[1], ninesFull[2]];
  const row2 = [ninesFull[3], ninesFull[4], ninesFull[5]];
  const row3 = [ninesFull[6], ninesFull[7], ninesFull[8]];
  const column1 = [ninesFull[0], ninesFull[3], ninesFull[6]];
  const column2 = [ninesFull[1], ninesFull[4], ninesFull[7]];
  const column3 = [ninesFull[2], ninesFull[5], ninesFull[8]];
  const diagonalLeft = [ninesFull[0], ninesFull[4], ninesFull[8]];
  const diagonalRight = [ninesFull[2], ninesFull[4], ninesFull[6]];

  const sets = [
    { name: "row1", set: row1, slots: [1, 2, 3] },
    { name: "row2", set: row2, slots: [4, 5, 6] },
    { name: "row3", set: row3, slots: [7, 8, 9] },
    { name: "column1", set: column1, slots: [1, 4, 7] },
    { name: "column2", set: column2, slots: [2, 5, 8] },
    { name: "column3", set: column3, slots: [3, 6, 9] },
    { name: "diagonal left", set: diagonalLeft, slots: [1, 5, 9] },
    { name: "diagonal right", set: diagonalRight, slots: [3, 5, 7] },
  ];

  sets.forEach(function (element) {
    if (element.set[0].visib && element.set[1].visib && element.set[2].visib) {
      if (log) {
        //console.log("Current element: " + element.name);
        console.log(chalk.magentaBright("Full set detected! " + element.name));

        //console.log(element.set);

        //console.log("aaa " + element.set[0].value);

        console.log(
          chalk.green(
            "Value if you choose this option: " +
              crossSum([
                element.set[0].value,
                element.set[1].value,
                element.set[2].value,
              ]) +
              ": " +
              prizes[
                prizeSelect(
                  prizes,
                  crossSum([
                    element.set[0].value,
                    element.set[1].value,
                    element.set[2].value,
                  ])
                )
              ].prize
          )
        );
      }

      options.push({
        option: element.name,
        value:
          prizes[
            prizeSelect(
              prizes,
              crossSum([
                element.set[0].value,
                element.set[1].value,
                element.set[2].value,
              ])
            )
          ].prize,
        slots: slotsFromName(element.name),
      });
    } else if (
      (element.set[0].visib && element.set[1].visib && !element.set[2].visib) ||
      (element.set[1].visib && element.set[2].visib && !element.set[0].visib) ||
      (element.set[0].visib && element.set[2].visib && !element.set[1].visib)
    ) {
      let twos = [];

      amount = 0;
      count = 0;

      if (element.set[0].visib) {
        twos.push(element.set[0].value);
      }
      if (element.set[1].visib) {
        twos.push(element.set[1].value);
      }
      if (element.set[2].visib) {
        twos.push(element.set[2].value);
      }

      if (log) {
        //console.log("twos: " + twos);
        //console.log("Current element: " + element.name);
        console.log(
          chalk.magentaBright("Almost full set detected! " + element.name)
        );
      }
      leftovers.forEach(function (left) {
        if (log) {
          console.log(
            "Possible crossum: " +
              (crossSum(twos) + left) +
              " with the prize: " +
              prizes[prizeSelect(prizes, crossSum(twos) + left)].prize
          );
        }
        count++;
        amount =
          amount + prizes[prizeSelect(prizes, crossSum(twos) + left)].prize;
      });
      if (log) {
        console.log("Amount of options: " + count);
        console.log("Total prize amounts: " + amount);
        console.log(
          chalk.green(
            "Average value of choosing this option: " + amount / count
          )
        );
      }
      options.push({
        option: element.name,
        value: amount / count,
        slots: slotsFromName(element.name),
      });
    } else if (
      !element.set[0].visib &&
      !element.set[1].visib &&
      !element.set[2].visib
    ) {
      if (
        leftovers.includes(1) &&
        leftovers.includes(2) &&
        leftovers.includes(3)
      ) {
        options.push({
          option: element.name,
          value: 1001,
          slots: slotsFromName(element.name),
        });
      } else if (
        leftovers.includes(7) &&
        leftovers.includes(8) &&
        leftovers.includes(9)
      ) {
        options.push({
          option: element.name,
          value: 361,
          slots: slotsFromName(element.name),
        });
      } else if (
        leftovers.includes(6) &&
        leftovers.includes(8) &&
        leftovers.includes(9)
      ) {
        options.push({
          option: element.name,
          value: 180,
          slots: slotsFromName(element.name),
        });
      }
    } else if (
      element.set[0].visib &&
      !element.set[1].visib &&
      !element.set[2].visib
    ) {
      if ([1, 2, 3].includes(element.set[0].value)) {
        let threes = [1, 2, 3];
        //console.log(chalk.red("///////"));
        //console.log("Current element ONLY ONE: " + element.name);
        //console.log(chalk.red("///////"));
        let index = threes.indexOf(element.set[0].value);
        if (index > -1) {
          threes.splice(index, 1);
        }
        //console.log("///threes right now///: " + threes);
        //console.log(element.set);
        if (leftovers.includes(threes[0]) && leftovers.includes(threes[1])) {
          //console.log("//pushing//");
          options.push({
            option: element.name,
            value: 1002,
            slots: slotsFromName(element.name),
          });
        }
      } else if ([7, 8, 9].includes(element.set[0].value)) {
        let threes = [7, 8, 9];
        //console.log(chalk.red("///////"));
        //console.log("Current element ONLY ONE: " + element.name);
        //console.log(chalk.red("///////"));
        let index = threes.indexOf(element.set[0].value);
        if (index > -1) {
          threes.splice(index, 1);
        }
        //console.log("///threes right now///: " + threes);
        //console.log(element.set);
        if (leftovers.includes(threes[0]) && leftovers.includes(threes[1])) {
          //console.log("//pushing//");
          options.push({
            option: element.name,
            value: 362,
            slots: slotsFromName(element.name),
          });
        }
      }
    } else if (
      !element.set[0].visib &&
      element.set[1].visib &&
      !element.set[2].visib
    ) {
      if ([1, 2, 3].includes(element.set[1].value)) {
        let threes = [1, 2, 3];
        //console.log(chalk.red("///////"));
        //console.log("Current element ONLY ONE: " + element.name);
        //console.log(chalk.red("///////"));

        let index = threes.indexOf(element.set[1].value);
        if (index > -1) {
          threes.splice(index, 1);
        }
        //console.log("///threes right now///: " + threes);
        if (leftovers.includes(threes[0]) && leftovers.includes(threes[1])) {
          //console.log("//pushing//");
          options.push({
            option: element.name,
            value: 1002,
            slots: slotsFromName(element.name),
          });
        }
      } else if ([7, 8, 9].includes(element.set[1].value)) {
        let threes = [7, 8, 9];
        //console.log(chalk.red("///////"));
        //console.log("Current element ONLY ONE: " + element.name);
        //console.log(chalk.red("///////"));

        let index = threes.indexOf(element.set[1].value);
        if (index > -1) {
          threes.splice(index, 1);
        }
        //console.log("///threes right now///: " + threes);
        if (leftovers.includes(threes[0]) && leftovers.includes(threes[1])) {
          //console.log("//pushing//");
          options.push({
            option: element.name,
            value: 362,
            slots: slotsFromName(element.name),
          });
        }
      }
    } else if (
      !element.set[0].visib &&
      !element.set[1].visib &&
      element.set[2].visib
    ) {
      if ([1, 2, 3].includes(element.set[2].value)) {
        let threes = [1, 2, 3];
        //console.log(chalk.red("///////"));
        //console.log("Current element ONLY ONE: " + element.name);
        //console.log(element);
        //console.log(chalk.red("///////"));
        let index = threes.indexOf(element.set[2].value);
        if (index > -1) {
          threes.splice(index, 1);
        }
        //console.log("///threes right now///: " + threes);
        if (leftovers.includes(threes[0]) && leftovers.includes(threes[1])) {
          options.push({
            option: element.name,
            value: 1002,
            slots: slotsFromName(element.name),
          });
        }
      } else if ([7, 8, 9].includes(element.set[2].value)) {
        let threes = [7, 8, 9];
        //console.log(chalk.red("///////"));
        //console.log("Current element ONLY ONE: " + element.name);
        //console.log(element);
        ///console.log(chalk.red("///////"));
        let index = threes.indexOf(element.set[2].value);
        if (index > -1) {
          threes.splice(index, 1);
        }
        //console.log("///threes right now///: " + threes);
        if (leftovers.includes(threes[0]) && leftovers.includes(threes[1])) {
          options.push({
            option: element.name,
            value: 362,
            slots: slotsFromName(element.name),
          });
        }
      }
    }
  });

  if (log) {
    console.log("all options:");
    console.log(options);
  }

  let slotvalues = slotValue(options);

  // control information for slotvalues
  //console.log("//slotvalues//");
  //console.log(slotvalues);

  /*
  slotvalues.forEach(function (sv) {
    visibles.forEach(function (vis) {
      if (sv.number == vis + 1) {
        let index = slotvalues.indexOf(vis + 1);
        slotvalues.splice(index, 1);
      }
    });
  });
  */

  //slotvalues = removeVisibles(slotvalues, visibles);

  let trimmedSlots = trimOptions(slotvalues, nineArray, visibles);

  /*
  if (log) {
  console.log("//visibless //");
  console.log(visibles);
  console.log("//slotvalues CUT//");
  console.log(trimmedSlots);
  console.log("/// Slotvalues SORTED ///");
    }
  */

  if (visibles.length < 4) {
    let slotvaluesSorted = slotvalues.sort((a, b) => b.value - a.value);

    if (flag == 2) {
      return slotvaluesSorted[0].number;
    }

    if (log) {
      console.log(
        chalk.blue("Unrevealed slot values sorted by value descending")
      );
      console.log(slotvaluesSorted);
    }
  }

  options.forEach(function (opt) {
    if (opt.value > best.value) {
      best.option = opt.option;
      best.value = opt.value;
    }
  });

  if (flag == 1) {
    return best.option;
  }

  if (visibles.length == 4) {
    if (log) {
      console.log(
        chalk.yellow(
          "The best option is: " +
            best.option +
            " - with an average prize of: " +
            best.value
        )
      );
    }
  }
}

// Function that starts the game.
function gameStart(nineArray, visibles, prizes, fullNines) {
  revealing2(nineArray, visibles, prizes, fullNines);
  //solverPrimitive(nineArray, visibles, prizes, fullNines, true, 0);
  setSelect2(nineArray, prizes, visibles, fullNines);
}

// Actual start of things //

// variables
const pv = "Prize if you chose ";
const startValue = Math.floor(Math.random() * 9);
// initialize the usage of the prompt function to allow for user input
//const prompt = require("prompt-sync")();
const prompt = promptSync();

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

// change const to let for testing
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
  { name: "row1", set: row1, slots: [1, 2, 3] },
  { name: "row2", set: row2, slots: [4, 5, 6] },
  { name: "row3", set: row3, slots: [7, 8, 9] },
  { name: "column1", set: column1, slots: [1, 4, 7] },
  { name: "column2", set: column2, slots: [2, 5, 8] },
  { name: "column3", set: column3, slots: [3, 6, 9] },
  { name: "diagonal left", set: diagonalLeft, slots: [1, 5, 9] },
  { name: "diagonal right", set: diagonalRight, slots: [3, 5, 7] },
];

// Control outputs //

//let promptInput = prompt(
//  chalk.red("Do you want to see all information? (yes=show, other=skip) ")
//);

let promptInput = "yes";

let boardValue = 0;

if (promptInput === "yes") {
  console.log(chalk.green(" //// CONTROL OUTPUTS ////"));

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
    "Cross sum of diagonal Upper right to lower left: " +
      crossSum(diagonalRight)
  );
}
// Show the prize of each cross sum for the given set of nines
setsFull.forEach(function (set) {
  if (promptInput === "yes") {
    console.log(
      pv +
        set.name +
        " = " +
        crossSum(set.set) +
        ": " +
        prizes[prizeSelect(prizes, crossSum(set.set))].prize
    );
  }
  boardValue =
    boardValue + prizes[prizeSelect(prizes, crossSum(set.set))].prize;
});

// calculate the average prize value the user should be expecting on this given boards configuration (not accounting for the starting position)
console.log(
  chalk.blueBright(
    "Average achievable prize value on this board configuration: " +
      boardValue / 8
  )
);

// Game start
console.log(chalk.green(" //// Start of the game ////"));

console.log(chalk.blue("Three by three with hidden:"));

threebythreeNines(shuffledNines, visibles);
console.log("--- start ---");
solverPrimitive(shuffledNines, visibles, prizes, ninesFull, false, 0);
gameStart(shuffledNines, visibles, prizes, ninesFull);
console.log(
  chalk.blueBright(
    "Average achievable prize value on this board configuration: " +
      boardValue / 8
  )
);

/*
// For self start with test values //
shuffledNines = [4, 9, 1, 6, 2, 8, 5, 7, 3];
ninesFull = [
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
threebythreeNines(shuffledNines, [4]);
solverPrimitive(shuffledNines, [4], prizes, ninesFull, true, 0);
gameStart(shuffledNines, [4], prizes, ninesFull);
*/

console.log(chalk.green(" //// End of the game ////"));
