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

function analyzeGamehistory(gameHistory) {
  let hvBoards = 0;
  let prizeAverages = 0;
  let prizeTotal = 0;
  let prizesOverAvg = 0;
  let possibleOTTs = 0;
  let possibleSENs = 0;
  let possibleOTTSENs = 0;
  let ottsFound = 0;
  let sensFound = 0;
  let missedOTTs = 0;
  let missedSENs = 0;
  let ottFindP = 0;
  let senFindP = 0;
  let overAvgP = 0;
  let hvBoardP = 0;

  gameHistory.forEach(function (gh) {
    prizeAverages += gh.averagePrize;
    prizeTotal += gh.prize;

    if (gh.highValueBoard) {
      hvBoards++;
    }
    if (gh.prizeOverAvg) {
      prizesOverAvg++;
    }
    if (gh.possibleOTT) {
      possibleOTTs++;
    }
    if (gh.possibleSEN) {
      possibleSENs++;
    }
    if (gh.foundOTT) {
      ottsFound++;
    }
    if (gh.foundSEN) {
      sensFound++;
    }
    if (gh.possibleOTTSEN) {
      possibleOTTSENs++;
    }

    if (gh.possibleOTT && !gh.foundOTT) {
      missedOTTs++;
    }
    if (gh.possibleSEN && !gh.foundSEN) {
      missedSENs++;
    }
  });

  overAvgP = prizesOverAvg / (gameHistory.length / 100);
  if (possibleOTTs > 0) {
    ottFindP = ottsFound / (possibleOTTs / 100);
  }
  if (possibleSENs > 0) {
    senFindP = sensFound / (possibleSENs / 100);
  }
  hvBoardP = hvBoards / (gameHistory.length / 100);

  let results = [
    {
      gamesPlayed: gameHistory.length,
      highValueBoards: hvBoards,
      highValueBoardPercentage: hvBoardP + "%",
      possibleOTTs: possibleOTTs,
      missedOTTs: missedOTTs,
      foundOTTs: ottsFound,
      ottFoundPercentage: ottFindP + "%",
      possibleSENs: possibleSENs,
      missedSENs: missedSENs,
      foundSENs: sensFound,
      senFoundPercentage: senFindP + "%",
      resultsOverAverage: prizesOverAvg,
      overAveragePercentage: overAvgP + "%",
      allAverageValues: prizeAverages,
      allAchievedPrizes: prizeTotal,
      achievedVSaverageDifference: prizeTotal - prizeAverages,
    },
  ];

  return results;
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
  ninesFull = [];
  autoLog = false;

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
    this.ninesFull = [
      { value: this.nineArray[0], visib: false },
      { value: this.nineArray[1], visib: false },
      { value: this.nineArray[2], visib: false },
      { value: this.nineArray[3], visib: false },
      { value: this.nineArray[4], visib: false },
      { value: this.nineArray[5], visib: false },
      { value: this.nineArray[6], visib: false },
      { value: this.nineArray[7], visib: false },
      { value: this.nineArray[8], visib: false },
    ];
    this.ninesFull[this.startingSlot - 1].visib = true;

    this.structure = [
      {
        name: "row1",
        set: this.row1,
        setFull: this.row1Full,
        slots: [1, 2, 3],
      },
      {
        name: "row2",
        set: this.row2,
        setFull: this.row2Full,
        slots: [4, 5, 6],
      },
      {
        name: "row3",
        set: this.row3,
        setFull: this.row3Full,
        slots: [7, 8, 9],
      },
      {
        name: "column1",
        set: this.column1,
        setFull: this.column1Full,
        slots: [1, 4, 7],
      },
      {
        name: "column2",
        set: this.column2,
        setFull: this.column2Full,
        slots: [2, 5, 8],
      },
      {
        name: "column3",
        set: this.column3,
        setFull: this.column3Full,
        slots: [3, 6, 9],
      },
      {
        name: "diagonal left",
        set: this.diagonalLeft,
        setFull: this.diagonalLeftFull,
        slots: [1, 5, 9],
      },
      {
        name: "diagonal right",
        set: this.diagonalRight,
        setFull: this.diagonalRightFull,
        slots: [3, 5, 7],
      },
    ];
    this.prize = null;
  }

  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////

  get nineArray() {
    return this.nineArray;
  }

  get ninesFull() {
    return this.ninesFull;
  }

  get startingSlot() {
    return this.startingSlot;
  }

  get visibles() {
    return this.visibles;
  }
  ////

  get row1Full() {
    return [this.ninesFull[0], this.ninesFull[1], this.ninesFull[2]];
  }

  get row2Full() {
    return [this.ninesFull[3], this.ninesFull[4], this.ninesFull[5]];
  }

  get row3Full() {
    return [this.ninesFull[6], this.ninesFull[7], this.ninesFull[8]];
  }

  get column1Full() {
    return [this.ninesFull[0], this.ninesFull[3], this.ninesFull[6]];
  }

  get column2Full() {
    return [this.ninesFull[1], this.ninesFull[4], this.ninesFull[7]];
  }

  get column3Full() {
    return [this.ninesFull[2], this.ninesFull[5], this.ninesFull[8]];
  }

  get diagonalLeftFull() {
    return [this.ninesFull[0], this.ninesFull[4], this.ninesFull[8]];
  }

  get diagonalRightFull() {
    return [this.ninesFull[2], this.ninesFull[4], this.ninesFull[6]];
  }
  ////
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

  // makes a slot visible, the visib argument should be formatted and pre checked for array input, so slot 3 -> pass 2
  addVisible(visib) {
    this.visibles.push(visib);
    this.ninesFull[visib].visib = true;
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

  // function to get the slots of a given set
  slotsFromName(name) {
    const slots = {
      row1: [1, 2, 3],
      row2: [4, 5, 6],
      row3: [7, 8, 9],
      column1: [1, 4, 7],
      column2: [2, 5, 8],
      column3: [3, 6, 9],
      "diagonal left": [1, 5, 9],
      "diagonal right": [3, 5, 7],
    };

    if (slots[name]) {
      return slots[name];
    } else {
      console.log(chalk.red(`I think something broke. You typed: ${name}`));
      // to note the error
      return null;
    }
  }

  // Function to return all currently urevealed number slots of a given set of nine numbers
  unrevealedNumbers() {
    // change from multiple arrays to a set for quicker lookup functionality
    const toCut = new Set(this.visibles.map((i) => this.nineArray[i]));
    // return only the numbers that arent in toCut
    return this.nineArray.filter((number) => !toCut.has(number));
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

  // function to tally value amounts for given slots
  slotValue(optionsArray) {
    // create the data array by filling it instead of a lengthy list manually, using map to increase the index number and keeping the starting value to 0
    let data = Array(9)
      .fill({ value: 0 })
      // _ as a throwaway variable because its not used, only the numbers with value 0 are filled
      .map((_, index) => ({ number: index + 1, value: 0 }));

    // loop through options and then all sets.slots to add the slotvalues
    optionsArray.forEach((set) => {
      set.slots.forEach((slot) => {
        // adding values, slot-1 for index
        data[slot - 1].value += set.value;
      });
    });

    return data;
  }

  trimOptions(opts) {
    let toTrim = [];
    let trimmedOpts = opts;
    let index = -99;
    for (let i = 0; i < this.visibles.length; i++) {
      toTrim.push(this.ninesFull[this.visibles[i]]);
    }

    //console.log("// numbers to trim: " + toTrim);

    this.visibles.forEach(function (trimmer) {
      index = trimmedOpts.findIndex((x) => x.number == trimmer + 1);
      if (index > -1) {
        trimmedOpts.splice(index, 1);
      }
    });

    //console.log(chalk.red("errr lets see?"));
    //console.log(trimmedOpts);

    return trimmedOpts;
  }

  // put in a code word for calling the function
  // bestSlot = return the best slot
  // bestSet = return the best set
  // bestReveal = log the best reveal choice
  // bestSet = log the best set choice
  solverMath(output) {
    const leftovers = this.unrevealedNumbers();
    let options = [];
    let amount = 0;
    let count = 0;
    let best = { option: "abc", value: 0 };
    let logInfo = false;

    this.structure.forEach(
      function (element) {
        if (
          element.setFull[0].visib &&
          element.setFull[1].visib &&
          element.setFull[2].visib
        ) {
          // case for all 3 elements visible
          if (logInfo) {
            console.log(chalk.red("test3 " + element.name));

            console.log(
              chalk.green(
                "Value if you choose this option: " +
                  crossSum(element.set) +
                  ": " +
                  this.prizeFromSet(element.set)
              )
            );
          }
          options.push({
            option: element.name,
            value: this.prizeFromSet(element.set),
            slots: this.slotsFromName(element.name),
          });
        } else if (
          (element.setFull[0].visib &&
            element.setFull[1].visib &&
            !element.setFull[2].visib) ||
          (element.setFull[1].visib &&
            element.setFull[2].visib &&
            !element.setFull[0].visib) ||
          (element.setFull[0].visib &&
            element.setFull[2].visib &&
            !element.setFull[1].visib)
        ) {
          // case for 2 elements visible
          let twos = [];
          amount = 0;
          count = 0;
          if (logInfo) {
            console.log(chalk.red("test2 " + element.name));
          }

          if (element.setFull[0].visib) {
            twos.push(element.set[0]);
          }
          if (element.setFull[1].visib) {
            twos.push(element.set[1]);
          }
          if (element.setFull[2].visib) {
            twos.push(element.set[2]);
          }
          if (logInfo) {
            console.log(twos + " " + element.name);
          }
          leftovers.forEach(
            function (left) {
              if (logInfo) {
                console.log(
                  "Possible crossum: " +
                    (crossSum(twos) + left) +
                    " with the prize: " +
                    this.prizeFromSum(crossSum(twos) + left)
                );
              }
              count++;
              amount = amount + this.prizeFromSum(crossSum(twos) + left);
            }.bind(this)
          );
          if (logInfo) {
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
            slots: this.slotsFromName(element.name),
          });
        } else if (
          (element.setFull[0].visib &&
            !element.setFull[1].visib &&
            !element.setFull[2].visib) ||
          (!element.setFull[0].visib &&
            element.setFull[1].visib &&
            !element.setFull[2].visib) ||
          (!element.setFull[0].visib &&
            !element.setFull[1].visib &&
            element.setFull[2].visib)
        ) {
          // case for only one element being visible
          if (logInfo) {
            console.log(chalk.red("test1 " + element.name));
          }
          amount = 0;
          count = 0;

          let duoSets = [];
          let onlyOne = 999;

          for (let i = 0; i < leftovers.length - 1; i++) {
            for (let j = i + 1; j < leftovers.length; j++) {
              duoSets.push([leftovers[i], leftovers[j]]);
            }
          }
          if (logInfo) {
            console.log(
              chalk.magentaBright("Only 1 Element visible in: " + element.name)
            );
          }

          if (element.setFull[0].visib) {
            onlyOne = element.set[0];
          } else if (element.setFull[1].visib) {
            onlyOne = element.set[1];
          } else if (element.setFull[2].visib) {
            onlyOne = element.set[2];
          }

          let oneDuo = [];

          duoSets.forEach(
            function (duo) {
              oneDuo = [onlyOne, duo[0], duo[1]];
              if (logInfo) {
                console.log(
                  "Possible crossum: " +
                    crossSum(oneDuo) +
                    " with the prize: " +
                    this.prizeFromSet(oneDuo)
                );
              }

              count++;
              amount = amount + this.prizeFromSet(oneDuo);
            }.bind(this)
          );
          if (logInfo) {
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
            slots: this.slotsFromName(element.name),
          });
        } else if (
          !element.setFull[0].visib &&
          !element.setFull[1].visib &&
          !element.setFull[2].visib
        ) {
          // case for all three elements are invisible
          amount = 0;
          count = 0;
          if (logInfo) {
            console.log(chalk.red("test0 " + element.name));
          }
          let triSets = [];

          for (let i = 0; i < leftovers.length - 1; i++) {
            for (let j = i + 1; j < leftovers.length; j++) {
              for (let k = j + 1; k < leftovers.length; k++) {
                triSets.push([leftovers[i], leftovers[j], leftovers[k]]);
              }
            }
          }
          if (logInfo) {
            console.log(
              chalk.magentaBright("All Elements invisible in: " + element.name)
            );
          }

          triSets.forEach(
            function (tri) {
              if (logInfo) {
                console.log(
                  "Possible crossum: " +
                    crossSum(tri) +
                    " with the prize: " +
                    this.prizeFromSet(tri)
                );
              }

              count++;
              amount = amount + this.prizeFromSet(tri);
            }.bind(this)
          );
          if (logInfo) {
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
            slots: this.slotsFromName(element.name),
          });
        }
      }.bind(this)
    );

    if (logInfo) {
      console.log(options);
    }

    let slotvalues = this.slotValue(options);

    let slotvaluesSorted = slotvalues.sort((a, b) => b.value - a.value);

    slotvaluesSorted = this.trimOptions(slotvaluesSorted);

    if (logInfo) {
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

    if (output === "bestSlot") {
      return slotvaluesSorted[0].number;
    }

    options.forEach(function (opt) {
      if (opt.value > best.value) {
        best.option = opt.option;
        best.value = opt.value;
      }
    });

    if (logInfo) {
      console.log(
        chalk.yellow(
          "The best option is: " +
            best.option +
            " - with an average prize of: " +
            best.value
        )
      );
    }

    if (output === "bestSet") {
      return best.option;
    }
  }

  revealAuto(slot) {
    if (this.autoLog) {
      if (this.visibles.length == 1) {
        console.log("First reveal:");
      } else if (this.visibles.length == 2) {
        console.log("Second reveal:");
      } else if (this.visibles.length == 3) {
        console.log("Third reveal:");
      }
    }
    this.addVisible(slot - 1);
    if (this.autoLog) {
      this.threebythreeHighlighted(this.visibles);
    }
  }

  chooseSetAuto(set) {
    let choice = this.structure.find((struc) => struc.name === set);

    if (this.autoLog) {
      console.log(choice);

      this.threebythreeFinal([
        choice.slots[0] - 1,
        choice.slots[1] - 1,
        choice.slots[2] - 1,
      ]);
    }
    this.prize = this.prizeFromSet(choice.set);
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
    console.log(this.solverMath("bestSlot"));
    this.revealSlotManually();
    console.log("Second reveal:");
    console.log(this.solverMath("bestSlot"));
    this.revealSlotManually();
    console.log("Third reveal:");
    console.log(this.solverMath("bestSlot"));
    this.revealSlotManually();
    //this.solverMath();
    console.log(this.solverMath("bestSet"));
    console.log("Set choice:");
    this.chooseSetManually();
  }

  gameStartAuto() {
    this.revealAuto(this.solverMath("bestSlot"));
    this.revealAuto(this.solverMath("bestSlot"));
    this.revealAuto(this.solverMath("bestSlot"));
    this.chooseSetAuto(this.solverMath("bestSet"));
  }

  averageValue() {
    let amount = 0;
    this.structure.forEach(
      function (str) {
        amount += this.prizeFromSet(str.set);
      }.bind(this)
    );

    return amount;
  }

  getGameResult() {
    let hvBoard = false;
    let ott = false;
    let sen = false;
    let ottsen = false;
    let overavg = false;
    let ottfound = false;
    let senfound = false;

    if (this.averageValue() / 8 < this.prize) {
      overavg = true;
    }

    this.structure.forEach(
      function (str) {
        //
        if (crossSum(str.set) == 6) {
          ott = true;
        }
        if (crossSum(str.set) == 24) {
          sen = true;
        }
      }.bind(this)
    );

    if (ott && sen) {
      ottsen = true;
    }

    if (ott && this.prize == 10000) {
      ottfound = true;
    }
    if (sen && this.prize == 3600) {
      senfound = true;
    }

    return {
      gameID: this.gameID,
      nineArray: [...this.nineArray],
      visibles: [...this.visibles],
      highValueBoard: ott || sen,
      possibleOTT: ott,
      foundOTT: ottfound,
      possibleSEN: sen,
      foundSEN: senfound,
      possibleOTTSEN: ott && sen,
      averagePrize: this.averageValue() / 8,
      prize: this.prize,
      prizeOverAvg: overavg,
    };
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

function simulateGames() {
  let simulations = 5000000;
  let gameHistory = [];

  for (let i = 0; i < simulations; i++) {
    let testGame = new NinesGame();
    testGame.gameStartAuto();
    gameHistory.push(testGame.getGameResult());
  }

  console.log(analyzeGamehistory(gameHistory));
}

// Measure execution time of a function
function measureExecutionTime(label, func) {
  const start = performance.now();
  func();
  const end = performance.now();
  console.log(`${label} took ${(end - start).toFixed(4)} ms`);
}

const prompt = promptSync();

/* let testGame = new NinesGame();
console.log(testGame.nineArray);
console.log(testGame.startingSlot);
console.log(testGame.visibles);
console.log(testGame.gameID); */

/* let testGame = new NinesGame();
let testGame2 = new NinesGame("897654321_2"); */
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
/* const gameHistory = []; */
//console.log(testGame.visibles);
//testGame.gameStartAuto();
//gameHistory.push(testGame.getGameResult());
//console.log(gameHistory);
//console.log(analyzeGamehistory(gameHistory));
//console.log(testGame.unrevealedNumbers());
//console.log(testGame.ninesFull);
//console.log(testGame.structure);
//console.log(testGame.structure[0].setFull);

/* for (let i = 0; i < 10; i++) {
  let testGame = new NinesGame();
  testGame.gameStartAuto();
  gameHistory.push(testGame.getGameResult());
}
console.log(analyzeGamehistory(gameHistory));
 */
//simulateGames();
measureExecutionTime("OOP Coding", simulateGames);
