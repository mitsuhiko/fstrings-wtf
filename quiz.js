class Quiz {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.isAnswered = false;
    this.selectedAnswerIndex = 0;
    this.totalQuestions = QUESTIONS.length;
    this.splashScreen = document.getElementById("splash-screen");
    this.mainContent = document.getElementById("main-content");
    this.startQuizBtn = document.getElementById("start-quiz-btn");

    this.initializeElements();
    this.setupEventListeners();
    this.setupSplashScreen();
    this.initializeFromURL();

    // Only load question if splash is hidden (direct URL access)
    if (this.shouldSkipSplash()) {
      this.hideSplashScreen();
      this.loadQuestion();
    }
  }

  initializeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionParam = urlParams.get("q");

    if (questionParam) {
      const questionNumber = parseInt(questionParam, 10);
      if (questionNumber >= 1 && questionNumber <= this.totalQuestions) {
        this.currentQuestion = questionNumber - 1;
      }
    }
  }

  initializeElements() {
    this.questionCounter = document.getElementById("current-question");
    this.totalQuestionsElement = document.getElementById("total-questions");
    this.totalQuestionsScoreElement = document.getElementById(
      "total-questions-score"
    );
    this.totalQuestionsFinalElement = document.getElementById(
      "total-questions-final"
    );
    this.scoreElement = document.getElementById("score");
    this.progressBar = document.getElementById("progress-bar");
    this.codeDisplay = document.getElementById("code-display");
    this.questionText = document.getElementById("question-text");
    this.answerButtons = [
      document.getElementById("answer-0"),
      document.getElementById("answer-1"),
      document.getElementById("answer-2"),
      document.getElementById("answer-3"),
    ];
    this.explanationSection = document.getElementById("explanation-section");
    this.explanationText = document.getElementById("explanation-text");
    this.nextButton = document.getElementById("next-btn");
    this.finishButton = document.getElementById("finish-btn");
    this.restartButton = document.getElementById("restart-btn");
    this.finalScoreSection = document.getElementById("final-score");
    this.finalScoreValue = document.getElementById("final-score-value");
    this.scoreMessage = document.getElementById("score-message");
    this.restartFinalButton = document.getElementById("restart-final-btn");
    this.shareTwitterButton = document.getElementById("share-twitter");
    this.shareBlueskyButton = document.getElementById("share-bluesky");

    this.totalQuestionsElement.textContent = this.totalQuestions;
    this.totalQuestionsScoreElement.textContent = this.totalQuestions;
    this.totalQuestionsFinalElement.textContent = this.totalQuestions;

    // Initialize progress bar
    this.updateProgressBar();
  }

  setupEventListeners() {
    this.answerButtons.forEach((button, index) => {
      button.addEventListener("click", () => this.selectAnswer(index));
      button.addEventListener("mouseenter", () => {
        if (!this.isAnswered) {
          this.selectedAnswerIndex = index;
          this.updateSelectedAnswer();
        }
      });
    });

    this.nextButton.addEventListener("click", () => this.nextQuestion());
    this.finishButton.addEventListener("click", () => this.nextQuestion());
    this.restartButton.addEventListener("click", () => this.restartQuiz());
    this.restartFinalButton.addEventListener("click", () => this.restartQuiz());
    this.shareTwitterButton.addEventListener("click", () =>
      this.shareOnTwitter()
    );
    this.shareBlueskyButton.addEventListener("click", () =>
      this.shareOnBluesky()
    );

    // Add keyboard event listener for number keys 1-4 and navigation
    document.addEventListener("keydown", (event) => {
      const key = event.key;

      // Skip if splash screen is visible
      if (!this.splashScreen.classList.contains("hidden")) {
        return;
      }

      // Arrow keys and j/k for navigation (only when not answered)
      if (!this.isAnswered) {
        if (key === "ArrowUp" || key === "k") {
          event.preventDefault();
          this.selectedAnswerIndex = Math.max(0, this.selectedAnswerIndex - 1);
          this.updateSelectedAnswer();
        } else if (key === "ArrowDown" || key === "j") {
          event.preventDefault();
          this.selectedAnswerIndex = Math.min(3, this.selectedAnswerIndex + 1);
          this.updateSelectedAnswer();
        }
      }

      // Number keys 1-4 for answer selection (only when not answered)
      if (!this.isAnswered && key >= "1" && key <= "4") {
        const answerIndex = parseInt(key) - 1;
        this.selectAnswer(answerIndex);
      }

      // Enter or Space for answer selection (when not answered) or next question (when answered)
      if (key === "Enter" || key === " ") {
        event.preventDefault(); // Prevent default space/enter behavior
        if (!this.isAnswered) {
          this.selectAnswer(this.selectedAnswerIndex);
        } else {
          this.nextQuestion();
        }
      }
    });
  }

  setupSplashScreen() {
    this.startQuizBtn.addEventListener("click", () => this.startQuiz());

    // Also allow Enter or Space to start quiz from splash screen
    document.addEventListener("keydown", (event) => {
      if (
        (event.key === "Enter" || event.key === " ") &&
        !this.splashScreen.classList.contains("hidden")
      ) {
        event.preventDefault();
        this.startQuiz();
      }
    });
  }

  shouldSkipSplash() {
    // Skip splash if there's a question parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has("q");
  }

  startQuiz() {
    this.hideSplashScreen();
    setTimeout(() => {
      this.loadQuestion();
    }, 400); // Wait for splash animation to start before loading question
  }

  hideSplashScreen() {
    this.splashScreen.classList.add("hidden");
    setTimeout(() => {
      this.mainContent.classList.add("show");
    }, 300); // Slight delay for better transition effect
  }

  loadQuestion() {
    const question = QUESTIONS[this.currentQuestion];

    // Add fade-out class first
    const questionSection = document.querySelector(".question-section");
    const answersSection = document.querySelector(".answers-section");

    questionSection.style.opacity = "0";
    answersSection.style.opacity = "0";

    setTimeout(() => {
      this.questionCounter.textContent = this.currentQuestion + 1;
      this.updateProgressBar();
      this.codeDisplay.textContent = question.code;
      this.questionText.textContent = question.question;

      this.answerButtons.forEach((button, index) => {
        button.innerHTML = `<span class="shortcut-key">${index + 1}</span> ${
          question.answers[index]
        }`;
        button.className = "answer-btn";
        // Reset animation
        button.style.animation = "none";
        button.offsetHeight; // Trigger reflow
        button.style.animation = null;
      });

      this.explanationSection.classList.remove("show");
      this.nextButton.style.display = "none";
      this.finishButton.style.display = "none";
      this.isAnswered = false;
      this.selectedAnswerIndex = 0;
      this.updateSelectedAnswer();

      // Fade back in
      questionSection.style.opacity = "1";
      answersSection.style.opacity = "1";
    }, 200);
  }

  updateProgressBar() {
    const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
    this.progressBar.style.width = `${progress}%`;
  }

  updateSelectedAnswer() {
    if (this.isAnswered) return;
    
    this.answerButtons.forEach((button, index) => {
      if (index === this.selectedAnswerIndex) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    });
  }

  selectAnswer(selectedIndex) {
    if (this.isAnswered) return;

    const question = QUESTIONS[this.currentQuestion];
    const correctIndex = question.correct;
    const allCorrect = correctIndex === -1;

    this.isAnswered = true;

    this.answerButtons.forEach((button, index) => {
      button.classList.remove("selected"); // Remove selection highlighting
      button.classList.add("disabled");
      if (allCorrect) {
        button.classList.add("correct");
      } else if (index === correctIndex) {
        button.classList.add("correct");
      } else if (index === selectedIndex) {
        button.classList.add("wrong");
      }
    });

    if (allCorrect || selectedIndex === correctIndex) {
      this.score++;
      this.animateScoreFlip(this.score - 1, this.score);
    }

    this.explanationText.textContent = question.explanation;
    this.explanationSection.classList.add("show");

    // Show appropriate button based on question number
    if (this.currentQuestion === this.totalQuestions - 1) {
      this.finishButton.style.display = "inline-block";
      this.nextButton.style.display = "none";
    } else {
      this.nextButton.style.display = "inline-block";
      this.finishButton.style.display = "none";
    }
  }

  animateScoreFlip(oldScore, newScore) {
    const container = document.querySelector(".score-flip-container");
    const currentElement = this.scoreElement;

    // Create new element for the incoming number
    const newElement = document.createElement("span");
    newElement.className = "score-digit flip-in";
    newElement.textContent = newScore;
    newElement.style.color = "#5E936C";

    // Add flip-out class to current element
    currentElement.classList.add("flip-out");
    currentElement.style.color = "#5E936C";

    // Add new element to container
    container.appendChild(newElement);

    // After animation completes, clean up
    setTimeout(() => {
      // Remove old element
      currentElement.remove();

      // Update the new element to be the current score element
      newElement.className = "score-digit";
      newElement.style.color = "#113F67";
      newElement.id = "score";

      // Update the reference
      this.scoreElement = newElement;
    }, 600);
  }

  nextQuestion() {
    this.currentQuestion++;

    if (this.currentQuestion >= this.totalQuestions) {
      this.showFinalScore();
    } else {
      this.loadQuestion();
    }
  }

  showFinalScore() {
    document.querySelector(".quiz-container").style.display = "none";
    this.finalScoreSection.style.display = "block";
    this.finalScoreValue.textContent = this.score;

    let message = "";
    const percentage = (this.score / this.totalQuestions) * 100;

    if (percentage === 100) {
      message = "Perfect! You're an f-string master! 🏆";
    } else if (percentage >= 80) {
      message = "Excellent! You have a great understanding of f-strings! 👏";
    } else if (percentage >= 60) {
      message = "Good job! You know the basics well. 👍";
    } else if (percentage >= 40) {
      message = "Not bad! Some more practice will help. 📚";
    } else {
      message = "Keep learning! f-strings have many useful features. 💪";
    }

    this.scoreMessage.textContent = message;
  }

  getShareText() {
    return `I got ${this.score}/${this.totalQuestions} on the fstrings.wtf quiz. Can you do better?`;
  }

  shareOnTwitter() {
    const text = this.getShareText();
    const url = "https://fstrings.wtf";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  }

  shareOnBluesky() {
    const text = this.getShareText();
    const url = "https://fstrings.wtf";
    const shareText = `${text} ${url}`;
    const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(blueskyUrl, "_blank");
  }

  restartQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.isAnswered = false;

    this.scoreElement.textContent = this.score;
    this.scoreElement.className = "score-digit";
    this.scoreElement.style.color = "#113F67";
    this.finalScoreSection.style.display = "none";
    document.querySelector(".quiz-container").style.display = "block";

    // Show splash screen again
    this.mainContent.classList.remove("show");
    this.splashScreen.classList.remove("hidden");
  }
}

// Initialize the quiz when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new Quiz();
});
