const quizData = {
    physics: [
      {
        question: 'What is the unit of force?',
        options: ['Newton', 'Joule', 'Watt', 'Pascal'],
        answer: 'Newton',
      },
      {
        question: 'What is the speed of light?',
        options: ['300,000 km/s', '150,000 km/s', '1,000 km/s', '600,000 km/s'],
        answer: '300,000 km/s',
      },
    ],
    chemistry: [
      {
        question: 'What is the chemical symbol for water?',
        options: ['H2O', 'O2', 'CO2', 'NaCl'],
        answer: 'H2O',
      },
      {
        question: 'What is the pH level of pure water?',
        options: ['7', '14', '0', '3'],
        answer: '7',
      },
    ],
    computerScience: [
      {
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Text Markup Language', 'Hyperlink Text Markup Language', 'Hyper Textual Markup Language'],
        answer: 'Hyper Text Markup Language',
      },
      {
        question: 'Which language is used for web development?',
        options: ['Python', 'Java', 'JavaScript', 'C++'],
        answer: 'JavaScript',
      },
    ],
  };
  
  const quizContainer = document.getElementById('quiz');
  const resultContainer = document.getElementById('result');
  const submitButton = document.getElementById('submit');
  const retryButton = document.getElementById('retry');
  const showAnswerButton = document.getElementById('showAnswer');
  const skipButton = document.getElementById('skip');
  const startButton = document.getElementById('start');
  const questionNumber = document.getElementById('questionNumber');
  const timerElement = document.getElementById('timer');
  const quizInfo = document.getElementById('quizInfo');
  const subjectSelect = document.getElementById('subjectSelect');
  
  let currentQuestion = 0;
  let score = 0;
  let incorrectAnswers = [];
  let skippedQuestions = [];
  let selectedSubject = '';
  let timeLeft = 120; // 2 minutes
  let timer;
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function startQuiz() {
    currentQuestion = 0; // Reset question index
    score = 0; // Reset score
    incorrectAnswers = []; // Reset incorrect answers
    skippedQuestions = []; // Reset skipped questions
    timeLeft = 120; // Reset timer
    startTimer();
  
    startButton.classList.add('hide');
    quizInfo.classList.remove('hide');
    quizContainer.classList.remove('hide');
    submitButton.classList.remove('hide');
    skipButton.classList.remove('hide');
    
    displayQuestion();
  }
  
  function startTimer() {
    timer = setInterval(function () {
      timeLeft--;
      timerElement.textContent = `Time: ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        displayResult();
      }
    }, 1000);
  }
  
  function displayQuestion() {
    const questions = quizData[selectedSubject]; // Get questions for the selected subject
    const questionData = questions[currentQuestion];
  
    if (questionData) {
      questionNumber.innerHTML = `Question ${currentQuestion + 1} of ${questions.length}`;
  
      const questionElement = document.createElement('div');
      questionElement.className = 'question';
      questionElement.innerHTML = questionData.question;
  
      const optionsElement = document.createElement('div');
      optionsElement.className = 'options';
  
      const shuffledOptions = [...questionData.options];
      shuffleArray(shuffledOptions);
  
      shuffledOptions.forEach(optionText => {
        const option = document.createElement('label');
        option.className = 'option';
  
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz';
        radio.value = optionText;
  
        option.appendChild(radio);
        option.appendChild(document.createTextNode(optionText));
        optionsElement.appendChild(option);
      });
  
      quizContainer.innerHTML = '';
      quizContainer.appendChild(questionElement);
      quizContainer.appendChild(optionsElement);
    } else {
      displayResult(); // No more questions, show results
    }
  }
  
  function checkAnswer() {
    const selectedOption = document.querySelector('input[name="quiz"]:checked');
    if (selectedOption) {
      const answer = selectedOption.value;
      const questions = quizData[selectedSubject];
  
      if (answer === questions[currentQuestion].answer) {
        score++;
      } else {
        incorrectAnswers.push({
          question: questions[currentQuestion].question,
          incorrectAnswer: answer,
          correctAnswer: questions[currentQuestion].answer,
        });
      }
    } else {
      skippedQuestions.push({
        question: quizData[selectedSubject][currentQuestion].question,
        correctAnswer: quizData[selectedSubject][currentQuestion].answer,
      });
    }
    
    currentQuestion++;
    displayQuestion();
  }
  
  function skipQuestion() {
    skippedQuestions.push({
      question: quizData[selectedSubject][currentQuestion].question,
      correctAnswer: quizData[selectedSubject][currentQuestion].answer,
    });
    
    currentQuestion++;
    displayQuestion();
  }
  
  function displayResult() {
    clearInterval(timer);
    quizContainer.style.display = 'none';
    quizInfo.style.display = 'none';
    submitButton.style.display = 'none';
    skipButton.style.display = 'none';
    retryButton.style.display = 'inline-block';
    showAnswerButton.style.display = 'inline-block';
    
    resultContainer.innerHTML = `You scored ${score} out of ${quizData[selectedSubject].length}!<br><br>`;
  
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
    quizContainer.style.display = 'block';
    quizInfo.style.display = 'block';
    submitButton.style.display = 'inline-block';
    skipButton.style.display = 'inline-block';
    retryButton.style.display = 'none';
    showAnswerButton.style.display = 'none';
    resultContainer.innerHTML = '';
    startQuiz();
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
      <p>You scored ${score} out of ${quizData[selectedSubject].length}!</p>
      <p>Incorrect Answers:</p>
      ${incorrectAnswersHtml}
      <p>Skipped Questions:</p>
      ${skippedQuestionsHtml}
    `;
  }
  
  // Event listeners
  subjectSelect.addEventListener('change', function() {
    selectedSubject = this.value;
    startButton.classList.remove('hide'); // Show start button after selecting a subject
  });
  
  startButton.addEventListener('click', startQuiz);
  submitButton.addEventListener('click', checkAnswer);
  skipButton.addEventListener('click', skipQuestion);
  retryButton.addEventListener('click', retryQuiz);
  showAnswerButton.addEventListener('click', showAnswer);
  