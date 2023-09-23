// Constants for HTML elements
const startBtn = document.querySelector(".start_btn button");
const infoBox = document.querySelector(".info_box");
const exitBtn = infoBox.querySelector(".buttons .quit");
const continueBtn = infoBox.querySelector(".buttons .restart");
const quizBox = document.querySelector(".quiz_box");
const timeCount = quizBox.querySelector(".timer .timer_sec");
const timeLine = quizBox.querySelector("header .time_line");
const quizTitle = quizBox.querySelector(".que_text");
const optionsList = quizBox.querySelector(".option_list");
const nextBtn = quizBox.querySelector(".next_btn");
const resultBox = document.querySelector(".result_box");
const restartQuiz = resultBox.querySelector(".buttons .restart");
const quitQuiz = resultBox.querySelector(".buttons .quit");

// Questions fetched from the API will be stored here
let questions = [];

// Current question index
let questionIndex = 0;

// Time variables
let counter;
let timeValue = 15; // Set to 15 seconds
let widthValue = 0;

// Function to fetch questions from the API
async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple"
    );
    const data = await response.json();

    if (data.results && data.results.length >= 5) {
      questions = data.results.map((questionData) => ({
        question: questionData.question,
        options: [...questionData.incorrect_answers, questionData.correct_answer],
        correct_answer: questionData.correct_answer,
      }));
    } else {
      throw new Error("Insufficient questions from the API");
    }
  } catch (error) {
    console.error("Error fetching questions from the API:", error);
  }
}

// Initialize the quiz
function initializeQuiz() {
  fetchQuestions();

  startBtn.addEventListener("click", () => {
    infoBox.classList.add("activeInfo");
  });

  exitBtn.addEventListener("click", () => {
    infoBox.classList.remove("activeInfo");
  });

  continueBtn.addEventListener("click", () => {
    infoBox.classList.remove("activeInfo");
    quizBox.classList.add("activeQuiz");
    showQuestions(questionIndex);
    startTimer(timeValue);
    startTimerLine(0);
  });

  nextBtn.addEventListener("click", () => {
    if (questionIndex < questions.length - 1) {
      questionIndex++;
      showQuestions(questionIndex);
      clearInterval(counter);
      startTimer(timeValue);
      startTimerLine(0);
      nextBtn.style.display = "none";
    } else {
      clearInterval(counter);
      showResult();
    }
  });

  restartQuiz.addEventListener("click", () => {
    resultBox.classList.remove("activeResult");
    quizBox.classList.add("activeQuiz");
    questionIndex = 0;
    timeValue = 15; // Reset the timer to 15 seconds
    widthValue = 0;
    showQuestions(questionIndex);
    startTimer(15); // Reset the timer to 15 seconds
    startTimerLine(0);
    nextBtn.style.display = "none";
  });

  quitQuiz.addEventListener("click", () => {
    window.location.reload();
  });

  // Event listener for option selection
  optionsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("option") && !event.target.classList.contains("disabled")) {
      optionSelected(event.target);
    }
  });
}

// Display questions and options
function showQuestions(index) {
  const queText = document.querySelector(".que_text");
  let queTag = '<span>' + questions[index].question + '</span>';
  let optionTag = "";

  questions[index].options.forEach((option, i) => {
    optionTag +=
      '<div class="option"><span>' + option + '</span></div>';
  });

  queText.innerHTML = queTag;
  optionsList.innerHTML = optionTag;

  // Enable clicking on options
  optionsList.querySelectorAll(".option").forEach((opt) => {
    opt.classList.remove("disabled");
  });
}

// Start the timer
function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time;
    time--;
    if (time < 10) {
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero;
    }
    if (time < 0) {
      clearInterval(counter);
      timeCount.textContent = "00";
      showResult();
    }
  }
}

// Start the timer line

function startTimerLine(time) {
  counterLine = setInterval(timer, time * 10);

  function timer() {
      timeCount += 1; // Increase the time count
      timeLine.style.width = timeCount + "px"; // Increase the width of the time line

      if (timeCount > 150) {
          clearInterval(counterLine); // Stop the timer when it reaches the end
          timeIsUp(); // Call a function to handle time-up scenario
      }
  }
}

/*
function startTimerLine(time) {
  counterLine = setInterval(timer, 29);
  function timer() {
    time += 1;
    timeLine.style.width = time + "px";
    if (time > 549) {
      clearInterval(counterLine);
    }
  }
}
*/
// Function to check if the selected option is correct
function optionSelected(answer) {
  clearInterval(counter);
  let userAns = answer.textContent;
  let correctAns = questions[questionIndex].correct_answer;

  if (userAns == correctAns) {
    answer.classList.add("correct");
  } else {
    answer.classList.add("incorrect");
  }

  // Disable clicking on options once answered
  optionsList.querySelectorAll(".option").forEach((opt) => {
    opt.classList.add("disabled");
  });

  nextBtn.style.display = "block"; // Show the Next Question button
}

// Display the quiz result
function showResult() {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.remove("activeQuiz");
  resultBox.classList.add("activeResult");
  const scoreText = resultBox.querySelector(".score_text");
  let scoreTag = '<span>Your score is: ' + questionIndex + '/' + questions.length + '</span>';
  scoreText.innerHTML = scoreTag;
}

// Initialize the quiz
initializeQuiz();
