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
      tempArray.push(chalk.green(nineArray[i]));
    } else {
      tempArray.push("X");
    }
  }

  // data log cut test
  //threebythree(tempArray);
}

// function to log out the fully revealed array, colouring the selected final set to mark it
function threebythreeFinal(nineArray, visibles, input) {
  let colourSlots = slotsFromName(input);
  let log1 = "";
  let log2 = "";
  let log3 = "";

  for (let i = 0; i < 8; i = i + 3) {
    if (colourSlots.includes(i + 1)) {
      log1 = chalk.yellowBright(nineArray[i]);
    } else {
      log1 = chalk.magentaBright(nineArray[i]);
    }

    if (colourSlots.includes(i + 2)) {
      log2 = chalk.yellowBright(nineArray[i + 1]);
    } else {
      log2 = chalk.magentaBright(nineArray[i + 1]);
    }

    if (colourSlots.includes(i + 3)) {
      log3 = chalk.yellowBright(nineArray[i + 2]);
    } else {
      log3 = chalk.magentaBright(nineArray[i + 2]);
    }

    console.log(log1 + " - " + log2 + " - " + log3);
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
  // alternative
  //if (prizes.some((x) => x.sum === value)) {
  //}

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
  // variable to toggle log showcases
  // this cuts out most logs besides set choice
  let log = false;
  // variable to toggle whether to automatically solve or allow the user to choose
  let userControl = false;
  let input;

  console.log("--- first reveal ---");
  for (let i = 0; i < 3; i++) {
    if (userControl) {
      // with user input
      // works !
      solverMathy(nineArray, visibles, prizes, fullNines, log, 0);
      input = prompt(chalk.blue("Which one do you want to reveal? "));
      input = parseInt(input);
    } else {
      // with function
      input = solverMathy(nineArray, visibles, prizes, fullNines, log, 2);
    }

    //console.log("input: " + input);
    if (nineArray.includes(input) && !visibles.includes(input - 1)) {
      visibles.push(input - 1);
      //console.log("for1: " + input + " i: " + i);
      console.log(chalk.yellowBright("Slot " + input + " was chosen."));
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
    if (i < 2) {
      console.log("--- next reveal ---");
    } else {
      console.log("--- set choice ---");
    }

    solverMathy(nineArray, visibles, prizes, fullNines, false, 0);
  }
}

// This function aims to have the player select which set to choose as their final answer. The player will be asked to input a valid set, otherwise they will contiuously get asked to input a valid one. The output message will be the selected set, its cross sum and the prize
function setSelect2(nineArray, prizes, visibles, fullNines) {
  // variable to toggle log showcases
  let log = false;
  // variable to toggle whether to automatically solve or allow the user to choose
  let userControl = false;
  let sumString = ". The cross sum is: ";
  let prizeString = ". Your prize is: ";
  let selectString = " was selected! Your numbers are: ";
  let input;
  let inputFound;
  let whileFlag = true;
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
    if (userControl) {
      // with user input
      // didnt work
      solverMathy(nineArray, visibles, prizes, fullNines, log, 3);
      input = prompt(
        chalk.blue(
          "Which set of three numbers do you want to choose? (Allowed inputs are: row1, row2, row3, column1, column2, column3, diagonal left, diagonal right) "
        )
      );
    } else {
      // using function input
      input = solverMathy(nineArray, visibles, prizes, fullNines, log, 1);
    }

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
      // datapush
      achieveds.push(prizes[prizeSelect(prizes, crossSum(inputFound))].prize);
      whileFlag = false;
    } else {
      console.log(
        chalk.red(
          "Please type in a valid input: (Allowed inputs are: row1, row2, row3, column1, colum2, column3, diagonal left, diagonal right)"
        )
      );
    }
  } while (whileFlag);

  threebythreeFinal(nineArray, visibles, input);
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
// this function is called
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

  // logs for slotvaluesstuff

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

// function to calculate the factorial of a number
function fact(n) {
  let res = 1;
  for (let i = 1; i <= n; i++) {
    res *= i;
  }
  return res;
}
// math based solving function
// calculate all possible results for sets with no, one, two or all three slots revealed
// use prize values and amount of options
// the log argument can either be true or false, and will print out all the information of the possible sets and slot choices and values
// the flag argument can be used to exit the function by returning either the most valuable set choice or the most valuable slot choice
// flag == 1 -> best set option, flag == 2 -> best slot option, flag == 3 for best set option log
function solverMathy(nineArray, visibles, prizes, ninesFull, log, flag) {
  let toCut = [];

  let amount = 0;
  let count = 0;

  let options = [];

  let crossSumLog = false;
  let optionsLog = false;

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
      // case for all elements being visible
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
      // case for only 2 elements are visible
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
        //if (log) {
        //console.log("twos: " + twos);
        //console.log("Current element: " + element.name);
        console.log(
          chalk.magentaBright("Almost full set detected! " + element.name)
        );
      }
      leftovers.forEach(function (left) {
        if (crossSumLog) {
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
      (element.set[0].visib &&
        !element.set[1].visib &&
        !element.set[2].visib) ||
      (!element.set[0].visib &&
        element.set[1].visib &&
        !element.set[2].visib) ||
      (!element.set[0].visib && !element.set[1].visib && element.set[2].visib)
    ) {
      // case for only one element being visible

      let possibles =
        fact(leftovers.length) / (fact(leftovers.length - 2) * fact(2));

      amount = 0;
      count = 0;

      let duoSets = [];
      let onlyOne = 999;

      for (let i = 0; i < leftovers.length - 1; i++) {
        for (let j = i + 1; j < leftovers.length; j++) {
          duoSets.push([leftovers[i], leftovers[j]]);
        }
      }
      if (log) {
        console.log(
          chalk.magentaBright("Only 1 Element visible in: " + element.name)
        );
      }
      //console.log(duoSets);

      if (element.set[0].visib) {
        onlyOne = element.set[0].value;
      } else if (element.set[1].visib) {
        onlyOne = element.set[1].value;
      } else if (element.set[2].visib) {
        onlyOne = element.set[2].value;
      }

      let oneDuo = [];

      duoSets.forEach(function (duo) {
        oneDuo = [onlyOne, duo[0], duo[1]];
        if (crossSumLog) {
          console.log(
            "Possible crossum: " +
              crossSum(oneDuo) +
              " with the prize: " +
              prizes[prizeSelect(prizes, crossSum(oneDuo))].prize
          );
        }
        count++;
        amount = amount + prizes[prizeSelect(prizes, crossSum(oneDuo))].prize;
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
      //
    } else if (
      !element.set[0].visib &&
      !element.set[1].visib &&
      !element.set[2].visib
    ) {
      // case for all three elements are invisible
      let possibles =
        fact(leftovers.length) / (fact(leftovers.length - 2) * fact(2));

      amount = 0;
      count = 0;

      let triSets = [];
      let onlyOne = 999;

      for (let i = 0; i < leftovers.length - 1; i++) {
        for (let j = i + 1; j < leftovers.length; j++) {
          for (let k = j + 1; k < leftovers.length; k++) {
            triSets.push([leftovers[i], leftovers[j], leftovers[k]]);
          }
        }
      }
      if (log) {
        console.log(
          chalk.magentaBright("All Elements invisible in: " + element.name)
        );
      }
      //console.log(triSets);

      triSets.forEach(function (tri) {
        if (crossSumLog) {
          console.log(
            "Possible crossum: " +
              crossSum(tri) +
              " with the prize: " +
              prizes[prizeSelect(prizes, crossSum(tri))].prize
          );
        }
        count++;
        amount = amount + prizes[prizeSelect(prizes, crossSum(tri))].prize;
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
    }
  });

  // if true

  // show all options: yes or no

  if (visibles.length == 4 && (flag == 0 || flag == 2) && optionsLog) {
    console.log("all options:");
    console.log(options);
  }

  let slotvalues = slotValue(options);

  // control information for slotvalues
  //console.log("//slotvalues//");
  //console.log(slotvalues);

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

    // if false
    if (log && visibles.length < 4) {
      console.log(
        chalk.blue("Unrevealed slot values sorted by value descending")
      );
      console.log(slotvaluesSorted);

      console.log(
        chalk.yellow(
          "The best slot to reveal is: " + slotvaluesSorted[0].number
        )
      );
    }

    if (flag == 2) {
      return slotvaluesSorted[0].number;
    }

    /*if (log) {
      console.log(
        chalk.blue("Unrevealed slot values sorted by value descending")
      );
      console.log(slotvaluesSorted);
    }*/
  }

  options.forEach(function (opt) {
    if (opt.value > best.value) {
      best.option = opt.option;
      best.value = opt.value;
    }
  });

  if (flag == 1 || flag == 3) {
    // if true

    console.log(
      chalk.yellow(
        "The best option is: " +
          best.option +
          " - with an average prize of: " +
          best.value
      )
    );

    return best.option;
  }

  // if false
  //if (visibles.length == 4) {
  //
  /*
  if (true) {
    console.log(
      chalk.yellow(
        "The best option is: " +
          best.option +
          " - with an average prize of: " +
          best.value
      )
    );
  }
  */
  //}
}

// Function that starts the game.
function gameStart(nineArray, visibles, prizes, fullNines) {
  revealing2(nineArray, visibles, prizes, fullNines);
  setSelect2(nineArray, prizes, visibles, fullNines);
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Actual start of things //
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// variables
const pv = "Prize if you chose ";

/* 
const startValue = Math.floor(Math.random() * 9);
// initialize the usage of the prompt function to allow for user input
//const prompt = require("prompt-sync")();
const prompt = promptSync();
// variable to enable or disable log printing during the game
let log = true;

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
  console.log("startvalue: " + startValue + " => Slot: " + (startValue + 1));
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

// to do
// use actual algorithm theory for value assignments, have all possible options as values

console.log(chalk.green(" //// Start of the game ////"));

console.log(chalk.blue("Three by three with hidden:"));

threebythreeNines(shuffledNines, visibles);
//console.log("--- start ---");
gameStart(shuffledNines, visibles, prizes, ninesFull);
console.log(
  chalk.blueBright(
    "Average achievable prize value on this board configuration was: " +
      boardValue / 8
  )
);

console.log(chalk.green(" //// End of the game ////"));

*/

//////////////////////////////////////////////////////////////////
/////////// REPETITION TESTS

let cycles = 10;

let startValue = 999;

let dataLog = [];

let startConfig = [];
let firstVisib = [];
let allVisibs = [];
let averages = [];
let onetwothree = [];
let seveneightnine = [];
let onetwothreeA = [];
let seveneightnineA = [];
let achieveds = [];

let ott = false;
let sen = false;
let ottA = false;
let senA = false;

// initialize the usage of the prompt function to allow for user input
//const prompt = require("prompt-sync")();
const prompt = promptSync();
// variable to enable or disable log printing during the game
let log = true;

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
let nines = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let ninesFull = [];
let shuffledNines = [];
let visibles = [];

let row1 = [];
let row2 = [];
let row3 = [];
let rows = [];
let column1 = [];
let column2 = [];
let column3 = [];
let columns = [];
let diagonalLeft = [];
let diagonalRight = [];
let diagonals = [];
let setsFull = [];

for (let loopp = 0; loopp < cycles; loopp++) {
  startValue = Math.floor(Math.random() * 9);

  ott = false;
  sen = false;
  ottA = false;
  senA = false;

  shuffledNines = shuffleArray(nines);

  // datapush
  firstVisib.push(startValue);
  startConfig.push(shuffledNines);

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
  visibles = [];
  visibles.push(startValue);
  ninesFull[startValue].visib = true;

  // define the structures for rows, columns and diagonals in a given set of nines by creating multiple arrays
  row1 = [shuffledNines[0], shuffledNines[1], shuffledNines[2]];
  row2 = [shuffledNines[3], shuffledNines[4], shuffledNines[5]];
  row3 = [shuffledNines[6], shuffledNines[7], shuffledNines[8]];
  rows = [row1, row2, row3];
  column1 = [shuffledNines[0], shuffledNines[3], shuffledNines[6]];
  column2 = [shuffledNines[1], shuffledNines[4], shuffledNines[7]];
  column3 = [shuffledNines[2], shuffledNines[5], shuffledNines[8]];
  columns = [column1, column2, column3];
  diagonalLeft = [shuffledNines[0], shuffledNines[4], shuffledNines[8]];
  diagonalRight = [shuffledNines[2], shuffledNines[4], shuffledNines[6]];
  diagonals = [diagonalLeft, diagonalRight];
  setsFull = [
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

  let promptInput = "no";

  let boardValue = 0;

  if (promptInput === "yes") {
    console.log(chalk.green(" //// CONTROL OUTPUTS ////"));

    // output the base array and the shuffled array
    console.log("Base Array: " + ninesClean);
    console.log("Shuffled Array: " + shuffledNines);
    //console.log(ninesFull);
    console.log("startvalue: " + startValue + " => Slot: " + (startValue + 1));
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
      "Cross sum of diagonal Upper left to lower right: " +
        crossSum(diagonalLeft)
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
  if (promptInput === "yes") {
    console.log(
      chalk.blueBright(
        "Average achievable prize value on this board configuration: " +
          boardValue / 8
      )
    );
  }

  console.log(chalk.green(" //// Start of the game ////"));

  console.log(chalk.blue("Three by three with hidden:"));

  threebythreeNines(shuffledNines, visibles);
  //console.log("--- start ---");
  gameStart(shuffledNines, visibles, prizes, ninesFull);
  console.log(
    chalk.blueBright(
      "Average achievable prize value on this board configuration was: " +
        boardValue / 8
    )
  );

  // datapush
  allVisibs.push(visibles);
  averages.push(boardValue / 8);

  setsFull.forEach(function (set) {
    if (crossSum(set.set) == 6) {
      ott = true;
    } else if (crossSum(set.set) == 24) {
      sen = true;
    }
  });

  onetwothree.push(ott);
  seveneightnine.push(sen);

  if (achieveds[loopp] == 10000 && ott) {
    ottA = true;
  }
  onetwothreeA.push(ottA);
  if (achieveds[loopp] == 3600 && sen) {
    senA = true;
  }
  seveneightnineA.push(senA);

  dataLog.push({
    startconfiguration: startConfig[loopp],
    firstVisible: firstVisib[loopp],
    allVisibles: allVisibs[loopp],
    OneTwoThreePossible: onetwothree[loopp],
    SevenEightNinePossible: seveneightnine[loopp],
    OneTwoThreeAchived: onetwothreeA[loopp],
    SevenEightNineAchieved: seveneightnineA[loopp],
    averageConfigValue: averages[loopp],
    achievedPrize: achieveds[loopp],
  });

  //console.log("/// " + achieveds + " ///");

  console.log(chalk.green(" //// End of the game ////"));
}

//console.log(dataLog);

// primitive data analysis

let boardsPlayed = 0;
let hvBoard = 0;
let hvHelper = 0;
let ottP = 0;
let senP = 0;
let ottM = 0;
let senM = 0;
let ottF = 0;
let senF = 0;
let underAvg = 0;
let overAvg = 0;
let averageVs = 0;
let achievedVs = 0;

let primitiveAnalysis = [];

dataLog.forEach(function (dataset) {
  hvHelper = 0;

  boardsPlayed++;

  if (dataset.OneTwoThreePossible) {
    hvHelper++;
    ottP++;
    if (dataset.OneTwoThreeAchived) {
      ottF++;
    } else {
      ottM++;
    }
  }
  if (dataset.SevenEightNinePossible) {
    hvHelper++;
    senP++;
    if (dataset.SevenEightNineAchieved) {
      senF++;
    } else {
      senM++;
    }
  }
  if (hvHelper > 0) {
    hvBoard++;
  }
  if (dataset.averageConfigValue < dataset.achievedPrize) {
    overAvg++;
  } else {
    underAvg++;
  }

  averageVs = averageVs + dataset.averageConfigValue;
  achievedVs = achievedVs + dataset.achievedPrize;
});

let hvBoardPercent = "";
let hvBoardPercentV = hvBoard / (boardsPlayed / 100);
hvBoardPercent = hvBoardPercentV + " %";

let ottPercent = "";
let ottPercentV = 0;
if (ottP > 0) {
  ottPercentV = ottF / (ottP / 100);
}
ottPercent = ottPercentV + " %";

let senPercent = "";
let senPercentV = 0;
if (senP > 0) {
  senPercentV = senF / (senP / 100);
}
senPercent = senPercentV + " %";

let averagePercent = "";
let averagePercentV = overAvg / (boardsPlayed / 100);
averagePercent = averagePercentV + " %";

primitiveAnalysis = [
  {
    boardsPlayedTotal: boardsPlayed,
    highValueBoards: hvBoard,
    hvBoardPercentage: hvBoardPercent,
    possibleOTTs: ottP,
    missedOTTs: ottM,
    foundOTTs: ottF,
    ottFindPercentage: ottPercent,
    possibleSENs: senP,
    missedSENs: senM,
    foundSENs: senF,
    senFindPercentage: senPercent,
    resultsUnderAvg: underAvg,
    resultsOverAvg: overAvg,
    overAveragePercent: averagePercent,
    allAverageValues: averageVs,
    allAchievedValues: achievedVs,
    achievedAvgDiff: achievedVs - averageVs,
  },
];

console.log("////////");
console.log(primitiveAnalysis);

/////////////////////////////////
// TEST SECTION FOR CODE TESTS //
/////////////////////////////////

/*
// For self start with test values //
let starter = [4];
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
threebythreeNines(shuffledNines, starter);
gameStart(shuffledNines, starter, prizes, ninesFull);
*/

/*
let leftovers = [1, 2, 3, 4, 5];

let possibles = fact(leftovers.length) / (fact(leftovers.length - 2) * fact(2));

let duoSets = [];

for (let i = 0; i < leftovers.length - 1; i++) {
  for (let j = i + 1; j < leftovers.length; j++) {
    duoSets.push([leftovers[i], leftovers[j]]);
  }
}
console.log(duoSets);
// access works like this:
console.log(duoSets[5][1]);
*/
