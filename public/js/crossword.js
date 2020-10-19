import deepCopy from "./deepcopy.js";

/**
 * For getting questions used in crossword
 */
let trivia = ""; //for questions
let input_json = []; //array of question answers to generate crossword
let xyPosition = []; //to store start point of answers (x, y) coordinates
const acrossQue = []; //answers in across
const downQue = []; //answers in down

//for storing questions in trivia variable
$.ajax({
  async: false,
  type: "GET",
  url: "https://opentdb.com/api.php?amount=6",
  success: function (data) {
    trivia = data;
  },
});

//for removing spaces and special charactars
trivia.results.forEach(function (riddle) {
  input_json.push({
    clue: riddle.question,
    answer: riddle.correct_answer.replace(/[^a-zA-Z0-9]/g, ""),
  });
});

/**
 * For generating crossword layout.
 */

var layout = generateLayout(input_json);
var rows = layout.rows;
var cols = layout.cols;
var table = layout.table; // table as two-dimensional array
var output_html = layout.table_string; // table as plain text (with HTML line breaks)
var output_json = layout.result; // words along with orientation, position, startx, and starty
let tableHighlight = deepCopy(table);
/**
 * To collect x and y elements of the board and separate down and across questions
 */
let ctr = 0;

output_json.forEach(function (riddle) {
  let newPosition = {
    x: riddle.startx,
    y: riddle.starty,
    number: riddle.position,
  };
  xyPosition.push(newPosition);
  ctr++;
  if (riddle.orientation == "across") {
    acrossQue.push(riddle);
  } else if (riddle.orientation == "down") {
    downQue.push(riddle);
  }
});

const fillHighlight = () => {
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      tableHighlight[i - 1][j - 1] = 0;
    }
  }
  output_json.forEach(function (riddle) {
    let x = riddle.startx;
    let y = riddle.starty;
    let lengthAns = riddle.answer.length;
    let ctr = 1;
    //let length = riddle.answer.length;
    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= cols; j++) {
        if (ctr <= lengthAns) {
          if (j == x && i == y) {
            if (tableHighlight[i - 1][j - 1] == 0) {
              tableHighlight[i - 1][j - 1] = riddle.position;
            } else {
              tableHighlight[i - 1][j - 1] =
                tableHighlight[i - 1][j - 1] * 10 + riddle.position;
            }
            if (riddle.orientation == "down") {
              y++;
            }
            if (riddle.orientation == "across") {
              x++;
            }
            ctr++;
          }
        }
      }
    }
  });
};

fillHighlight();

//function draw board in the page
function drawboard(argTable) {
  for (let x = 1; x <= rows; x++) {
    $("#board").append('<div class="rowArea"></div>');
    for (let y = 1; y <= cols; y++) {
      if (argTable[x - 1][y - 1] != "-") {
        //if condition to print row start number and col start number
        let positionNumber = returnNumber(x, y);
        if (
          tableHighlight[x - 1][y - 1] > 0 &&
          tableHighlight[x - 1][y - 1] < 10
        ) {
          if (positionNumber < 1) {
            $(".rowArea")
              .last()
              .append(
                `<div class="boxArea enabled positionbox ans${
                  tableHighlight[x - 1][y - 1]
                }"><div class="flex flex-col mb-3"><p class="mt-1"> </p><p class="text-xl mt-4">` +
                  argTable[x - 1][y - 1] +
                  `</p></div></div>`
              );
          } else {
            $(".rowArea")
              .last()
              .append(
                `<div class="boxArea enabled positionbox ans${
                  tableHighlight[x - 1][y - 1]
                }"><div class="flex flex-col mb-3"><p class="">` +
                  positionNumber +
                  `</p><p class="text-xl">` +
                  argTable[x - 1][y - 1] +
                  `</p></div></div>`
              );
          }
        } else {
          if (positionNumber < 0) {
            $(".rowArea")
              .last()
              .append(
                `<div class="boxArea enabled positionbox ans"><div class="flex flex-col mb-3"><p class="mt-1"> </p><p class="text-xl mt-4">` +
                  argTable[x - 1][y - 1] +
                  `</p></div></div>`
              );
          } else {
            $(".rowArea")
              .last()
              .append(
                `<div class="boxArea enabled positionbox ans"><div class="flex flex-col mb-3"><p class="">` +
                  positionNumber +
                  `</p><p class="text-xl">` +
                  argTable[x - 1][y - 1] +
                  `</p></div></div>`
              );
          }
        }
      } else {
        $(".rowArea")
          .last()
          .append(
            `<div class="boxArea disabled"><div class="flex flex-col mb-3"><p class="mt-1"></p><p class="text-xl"></p></div></div>`
          );
      }
    }
  }
}

drawboard(table);

//write questions
let writeQuestion = () => {
  acrossQue.forEach(function (question) {
    $("#across").append(
      '<div class="text-xl text-gray-900">' +
        question.position +
        ` ` +
        question.clue +
        "</div>"
    );
  });
  downQue.forEach(function (question) {
    $("#down").append(
      '<div class="text-xl text-gray-900">' +
        question.position +
        ` ` +
        question.clue +
        "</div>"
    );
  });
};

writeQuestion();

// to check if position need to be entered
function returnNumber(x, y) {
  let rtvalue = -1;
  xyPosition.forEach(function (xyPos) {
    if (xyPos.y == x && xyPos.x == y) {
      rtvalue = xyPos.number;
    }
  });
  return rtvalue;
}

//for click event to change box and input values
// $(".positionbox").click(function (event) {
//   $(".ans").toggleClass("highlighted");
// });

//this one works
//drawboard(table);

function selectBox(que) {
  let ans = ".ans" + que;
  const boxElement = document.querySelectorAll(ans);
  boxElement.forEach((element) => {
    element.addEventListener("click", function () {
      const element = document.querySelectorAll(ans);
      element.forEach(function (ansBox) {
        ansBox.classList.toggle("highlighted");
      });
    });
  });
}

for (let i = 1; i <= 6; i++) {
  selectBox(i);
}
