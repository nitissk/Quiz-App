const quizData = [

    {
        question: "What does CPU stand for?",
        options: [
            "Central Processing Unit",
            "Computer Personal Unit",
            "Central Processor Unit",
            "Control Processing Unit"
        ],
        answer: "Central Processing Unit"
    },
    {
        question: "Which language is used for web development?",
        options: [
            "Python",
            "C++",
            "JavaScript",
            "Java"
        ],
        answer: "JavaScript"
    },
    {
        question: "Which of the following is a database management system?",
        options: [
            "MySQL",
            "Python",
            "HTML",
            "CSS"
        ],
        answer: "MySQL"
    },
    {
        question: "What is the time complexity of binary search?",
        options: [
            "O(n)",
            "O(log n)",
            "O(n^2)",
            "O(1)"
        ],
        answer: "O(log n)"
    },
    {
        question: "What does HTTP stand for?",
        options: [
            "Hyper Text Transfer Protocol",
            "Hyper Transfer Text Protocol",
            "Hyper Text Transmission Protocol",
            "Hyperlink Text Transfer Protocol"
        ],
        answer: "Hyper Text Transfer Protocol"
    },
    {
        question: "Which of the following is a frontend framework?",
        options: [
            "Node.js",
            "Django",
            "React",
            "Flask"
        ],
        answer: "React"
    },
    {
        question: "What does RAM stand for?",
        options: [
            "Random Access Memory",
            "Read Access Memory",
            "Rapid Access Memory",
            "Run Access Memory"
        ],
        answer: "Random Access Memory"
    },
    {
        question: "Which of the following is NOT an operating system?",
        options: [
            "Linux",
            "Windows",
            "GitHub",
            "macOS"
        ],
        answer: "GitHub"
    },
    {
        question: "What does SQL stand for?",
        options: [
            "Structured Query Language",
            "Stylish Question Language",
            "Statement Query Language",
            "Standard Query Language"
        ],
        answer: "Structured Query Language"
    },
    {
        question: "Which of the following is an example of version control software?",
        options: [
            "Docker",
            "Git",
            "Nginx",
            "AWS"
        ],
        answer: "Git"
    }


];


const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById('showAnswer');
const skipButton = document.getElementById('skip');
const startButton = document.getElementById('start');
const questionNumber = document.getElementById('questionNumber');
const timerElement = document.getElementById('time');
const quizInfo = document.getElementById('quizInfo');

let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];
let skippedQuestions = [];
let timeLeft = 120; // 2 minutes
let timer;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startQuiz() {
    startButton.classList.add('hide');
    quizInfo.classList.remove('hide');
    quizContainer.classList.remove('hide');
    submitButton.classList.remove('hide');
    skipButton.classList.remove('hide');
    displayQuestion();
    startTimer();
}

function startTimer() {
    timer = setInterval(function () {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            displayResult();
        }
    }, 1000);
}

function displayQuestion() {
    const questionData = quizData[currentQuestion];
    questionNumber.innerHTML = `Question ${currentQuestion + 1} of ${quizData.length}`;

    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = questionData.question;

    const optionsElement = document.createElement('div');
    optionsElement.className = 'options';

    const shuffledOptions = [...questionData.options];
    shuffleArray(shuffledOptions);

    for (let i = 0; i < shuffledOptions.length; i++) {
        const option = document.createElement('label');
        option.className = 'option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz';
        radio.value = shuffledOptions[i];

        const optionText = document.createTextNode(shuffledOptions[i]);

        option.appendChild(radio);
        option.appendChild(optionText);
        optionsElement.appendChild(option);
    }

    quizContainer.innerHTML = '';
    quizContainer.appendChild(questionElement);
    quizContainer.appendChild(optionsElement);
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="quiz"]:checked');
    if (selectedOption) {
        const answer = selectedOption.value;
        if (answer === quizData[currentQuestion].answer) {
            score++;
        } else {
            incorrectAnswers.push({
                question: quizData[currentQuestion].question,
                incorrectAnswer: answer,
                correctAnswer: quizData[currentQuestion].answer,
            });
        }
    } else {
        // Mark as skipped
        skippedQuestions.push({
            question: quizData[currentQuestion].question,
            correctAnswer: quizData[currentQuestion].answer
        });
    }
    nextQuestion();
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        displayQuestion();
    } else {
        displayResult();
    }
}

function skipQuestion() {
    // Skipped, move to next
    skippedQuestions.push({
        question: quizData[currentQuestion].question,
        correctAnswer: quizData[currentQuestion].answer
    });
    nextQuestion();
}

function displayResult() {
    clearInterval(timer);
    quizContainer.style.display = 'none';
    quizInfo.style.display = 'none';
    submitButton.style.display = 'none';
    skipButton.style.display = 'none';
    retryButton.style.display = 'inline-block';
    showAnswerButton.style.display = 'inline-block';
    resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!<br><br>`;

    if (incorrectAnswers.length > 0) {
        resultContainer.innerHTML += `<h3>Incorrect Answers:</h3>`;
        incorrectAnswers.forEach(item => {
            resultContainer.innerHTML += `
          <p><strong>Question:</strong> ${item.question}</p>
          <p><strong>Your Answer:</strong> ${item.incorrectAnswer}</p>
          <p><strong>Correct Answer:</strong> ${item.correctAnswer}</p>
          <hr>
        `;
        });
    }

    if (skippedQuestions.length > 0) {
        resultContainer.innerHTML += `<h3>Skipped Questions:</h3>`;
        skippedQuestions.forEach(item => {
            resultContainer.innerHTML += `
          <p><strong>Question:</strong> ${item.question}</p>
          <p><strong>Correct Answer:</strong> ${item.correctAnswer}</p>
          <hr>
        `;
        });
    }
}

function retryQuiz() {
    currentQuestion = 0;
    score = 0;
    incorrectAnswers = [];
    skippedQuestions = [];
    timeLeft = 120;
    quizContainer.style.display = 'block';
    quizInfo.style.display = 'block';
    submitButton.style.display = 'inline-block';
    skipButton.style.display = 'inline-block';
    retryButton.style.display = 'none';
    showAnswerButton.style.display = 'none';
    resultContainer.innerHTML = '';
    displayQuestion();
    startTimer();
}

function showAnswer() {
    quizContainer.style.display = 'none';
    quizInfo.style.display = 'none';
    submitButton.style.display = 'none';
    skipButton.style.display = 'none';
    retryButton.style.display = 'inline-block';
    showAnswerButton.style.display = 'none';

    let incorrectAnswersHtml = '';
    for (let i = 0; i < incorrectAnswers.length; i++) {
        incorrectAnswersHtml += `
        <p><strong>Question:</strong> ${incorrectAnswers[i].question}</p>
        <p><strong>Your Answer:</strong> ${incorrectAnswers[i].incorrectAnswer}</p>
        <p><strong>Correct Answer:</strong> ${incorrectAnswers[i].correctAnswer}</p>
        <hr>
      `;
    }

    let skippedQuestionsHtml = '';
    for (let i = 0; i < skippedQuestions.length; i++) {
        skippedQuestionsHtml += `
        <p><strong>Question:</strong> ${skippedQuestions[i].question}</p>
        <p><strong>Correct Answer:</strong> ${skippedQuestions[i].correctAnswer}</p>
        <hr>
      `;
    }

    resultContainer.innerHTML = `
      <p>You scored ${score} out of ${quizData.length}!</p>
      <p>Incorrect Answers:</p>
      ${incorrectAnswersHtml}
      <p>Skipped Questions:</p>
      ${skippedQuestionsHtml}
    `;
}



startButton.addEventListener('click', startQuiz);
submitButton.addEventListener('click', checkAnswer);
skipButton.addEventListener('click', skipQuestion);
retryButton.addEventListener('click', retryQuiz);
showAnswerButton.addEventListener('click', showAnswer);
