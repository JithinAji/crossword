/**
 * For getting questions used in crossword
 */
let trivia = ""; //for questions
let input_json = []; //array of question answers to generate crossword
let xyPosition = []; //to store start point of answers (x, y) coordinates
let acrossQue = []; //answers in across
let downQue = []; //answers in down

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

//function draw board in the page
function drawboard(argTable) {
  let x;
  let y;
  let ctr = -1;
  for (x = 1; x <= rows; x++) {
    $("#board").append('<div class="rowArea"></div>');
    for (y = 1; y <= cols; y++) {
      if (argTable[x - 1][y - 1] != "-") {
        //if condition to print row start number and col start number
        let positionNumber = returnNumber(x, y);
        if (positionNumber < 1) {
          $(".rowArea")
            .last()
            .append(
              `<div class="boxArea enabled ans` +
                positionNumber +
                `"><div class="flex flex-col mb-3"><p class="mt-1"></p><p class="text-xl"></p></div></div>`
            );
        } else {
          $(".rowArea")
            .last()
            .append(
              `<div class="boxArea enabled positionbox ans"><div class="flex flex-col mb-3"><p class="mt-1">` +
                positionNumber +
                `</p><p class="text-xl"></p></div></div>`
            );
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

drawboard(table, []);

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
$(".positionbox").click(function (event) {
  console.log($(event.target));
});
