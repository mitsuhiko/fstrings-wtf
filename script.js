// Quiz questions array - easily editable
const questions = [
    {
        code: `print(f"Hello World!")`,
        question: "What will be printed?",
        answers: [
            "Hello World!",
            "Hello World!",
            "Hello World!",
            "Hello World!",
        ],
        correct: -1,
        explanation: "Correct! f-strings are working exactly as you would expect."
    },
    {
        code: `print(f"...")`,
        question: "Let's continue with this idea. What will be printed?",
        answers: [
            "Hello World!",
            "...",
            "Ellipsis",
            "fails with SyntaxError",
        ],
        correct: 1,
        explanation: "No funny business here, just a literal string with three dots."
    },
    {
        code: `print(f"{...}")`,
        question: "Let's do some interpolation. What will this print?",
        answers: [
            "fails with SyntaxError",
            "...",
            "Ellipsis",
            "prints nothing",
        ],
        correct: 2,
        explanation: "And the answer is: 'Ellipsis'. The three dots are a special object in Python that stringifies as Ellipsis. But that's hardly a feature of f-strings."
    },
    {
        code: `print(f"{...=}")`,
        question: "This on the other hand, what does this result in?",
        answers: [
            "fails with SyntaxError",
            "...",
            "Ellipsis",
            "...=Ellipsis",
        ],
        correct: 3,
        explanation: "This is the first special feature of f-strings: adding a trailing equals sign lets you print out the expression and what it evaluates to."
    },
    {
        code: `print(f"{... = }")`,
        question: "Does whitespace matter? What will this print?",
        answers: [
            "fails with SyntaxError",
            "...=Ellipsis",
            "... =Ellipsis",
            "... = Ellipsis",
        ],
        correct: 3,
        explanation: "Interestingly the whitespace is preserved in the output exactly as it was written. It would even preserve newlines and tabs!"
    },
    {
        code: `print(f"{[1,2,3]}")`,
        question: "What would happen with lists here after printing?",
        answers: [
            "[1, 2, 3]",
            "[1,2,3]",
            "{[1,2,3]}",
            "{[1, 2, 3]}"
        ],
        correct: 0,
        explanation: "Whitespace is only preserved for the expression, not for the repr of the output. Since lists stringify with whitespace, it looks a bit different."
    },
    {
        code: `print(f"{{1,2,3}}")`,
        question: "What about sets then? What would we see?",
        answers: [
            "{1, 2, 3}",
            "{1,2,3}",
            "{{1,2,3}}",
            "{{1, 2, 3}}"
        ],
        correct: 1,
        explanation: "Well isn't that surprising? That's because here we did not actually use a set, instead '{{' and '}}' escape the curly brace."
    },
    {
        code: `print(f"{1,2,3}")`,
        question: "Well is this a set then? What does it print?",
        answers: [
            "{1, 2, 3}",
            "{1,2,3}",
            "(1, 2, 3)",
            "it fails with SyntaxError"
        ],
        correct: 2,
        explanation: "Because the grammar allows an expression here, an implicit tuple expression is assumed and we actually printed the debug repr of a tuple of three items instead."
    },
    {
        code: `print(f"{ {1,2,3} }")`,
        question: "Can we get a set for once? What about this?",
        answers: [
            "{1, 2, 3}",
            "{1,2,3}",
            "(1, 2, 3)",
            "it fails with SyntaxError"
        ],
        correct: 0,
        explanation: "Effective use of whitespace ensures that we can actually use a set literal for once <3"
    },
    {
        code: `print(f"{255:x}")`,
        question: "Let's try some format modifiers. What will this print?",
        answers: [
            "255",
            "Fails with unknown format code 'x'",
            "ff",
            "ÿ"
        ],
        correct: 2,
        explanation: "The x modifier formats the number as hexadecimal. Note that it does not use the 0x prefix."
    },
    {
        code: `print(f"{255:c}")`,
        question: "Let's look at another one.",
        answers: [
            "255",
            "Fails with unknown format code 'c'",
            "ff",
            "ÿ"
        ],
        correct: 3,
        explanation: "This one converts it into a unicode character which happens to be the character 'ÿ'."
    },
    {
        code: `print(f"{255:#x}")`,
        question: "Hint: there is the concept of alternative formats. What will this print?",
        answers: [
            "ff",
            "FF",
            "0xff",
            "0xFF"
        ],
        correct: 2,
        explanation: "For integers it will just add the leading 0x to the hexadecimal representation. Similar things are also possible for other formats like octal or binary."
    },
    {
        code: `print(f"{255#x}")`,
        question: "What about this? Looks similar, doesn't it?",
        answers: [
            "ff",
            "0xff",
            "fails with SyntaxError: '{' was never closed",
            "fails with ValueError: Invalid format specifier",
        ],
        correct: 2,
        explanation: "This is in fact a syntax error because the '#' is the beginning of a comment and so 'x}' are part of the comment and our string was never closed!",
    },
    {
        code: `print(f"{42:<8}!")`,
        question: "Let's have a look at alignment. What will this print?",
        answers: [
            "42      !",
            "      42!",
            "42!",
            "fails with ValueError: Invalid format specifier",
        ],
        correct: 0,
        explanation: "The '<' modifier left-aligns the number in a field of 8 characters, so it will print '42' followed by 6 spaces and then '!'.",
    },
    {
        code: `print(f"{42:>8}!")`,
        question: "Can we flip it around? What will this print?",
        answers: [
            "42      !",
            "      42!",
            "42!",
            "fails with ValueError: Invalid format specifier",
        ],
        correct: 1,
        explanation: "Well that shouldn't be a surprise, we align the other way round.",
    },
    {
        code: `print(f"{1<10}!")`,
        question: "What about this? What might this print?",
        answers: [
            "1         !",
            "True!",
            "fails with ValueError: Invalid format specifier",
            "fails with TypeError: unsupported format string",
        ],
        correct: 1,
        explanation: "No colon means we're just rendering an expression and because 1 is smaller than 10, it evaluates to True. The f-string does not interpret the '<' as a format specifier.",
    },
    {
        code: `print(f"{1:0>10}")`,
        question: "There is so much more power in these. What will this print?",
        answers: [
            "0000000001",
            "0000000000",
            "         1",
            "         0",
        ],
        correct: 0,
        explanation: "Whatever is on the left of the alignment operator is the fill character. We just fill it with zeros here.",
    },
    {
        code: `print(f"{1<5:1<5}")`,
        question: "Putting it all together, what will this print?",
        answers: [
            "True1",
            "1True",
            "fails with ValueError: Invalid format specifier",
            "11111",
        ],
        correct: 3,
        explanation: "Well that's unexpected. The first 1 < 5 evaluates to True, but for some reason booleans render like integers when padded since they are a subclass of int.  So we're padding out to 5 characters, all of hwich are prefixed by 1.",
    },
    {
        code: `a = 42
print(f"{a:=10}")`,
        question: "Let's introduce some variables. What will this print?",
        answers: [
            "        42",
            "a=42      ",
            "fails with ValueError: Invalid format specifier",
            "10",
        ],
        correct: 0,
        explanation: "This is a form of padding. = forces the padding to be placed after the sign (if any) but before the digits.",
    },
    {
        code: `a = 42
print(f"{(a:=10)}")`,
        question: "Does this change anything? What will this print?",
        answers: [
            "        42",
            "a=42      ",
            "fails with ValueError: Invalid format specifier",
            "10",
        ],
        correct: 3,
        explanation: "This is a bit of a trick question. The walrus operator here assigns 10 to a and the f-string then prints that result.",
    },
    {
        code: `a = 42
b = 23
print(f"{(a, b := [1, 2])}")`,
        question: "Let's try with more than one target here. What will this print?",
        answers: [
            "fails with SyntaxError: invalid syntax",
            "(1, 2)",
            "[1, 2]",
            "(42, [1, 2])",
        ],
        correct: 3,
        explanation: "This doesn't really have anything to do with f-strings, but the walrus operator binds quite narrow so we build a tuple of a as it was assigned, and we override b with the list to the right. As a byproduct b was also rebound to [1, 2].",
    },
    {
        code: `print(f"{f"{{}}"}")`,
        question: "Can they be nested? What will it print?",
        answers: [
            "fails with SyntaxError: invalid syntax",
            "{}",
            "f{}",
            "f\"{}\"",
        ],
        correct: 1,
        explanation: "Yes! They can be nested.  The {{ and }} just escapes it like before.",
    },
];

class Quiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.isAnswered = false;
        this.totalQuestions = questions.length;
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeFromURL();
        this.loadQuestion();
    }
    
    initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const questionParam = urlParams.get('q');
        
        if (questionParam) {
            const questionNumber = parseInt(questionParam, 10);
            if (questionNumber >= 1 && questionNumber <= this.totalQuestions) {
                this.currentQuestion = questionNumber - 1;
            }
        }
    }
    
    initializeElements() {
        this.questionCounter = document.getElementById('current-question');
        this.totalQuestionsElement = document.getElementById('total-questions');
        this.totalQuestionsScoreElement = document.getElementById('total-questions-score');
        this.totalQuestionsFinalElement = document.getElementById('total-questions-final');
        this.scoreElement = document.getElementById('score');
        this.codeDisplay = document.getElementById('code-display');
        this.questionText = document.getElementById('question-text');
        this.answerButtons = [
            document.getElementById('answer-0'),
            document.getElementById('answer-1'),
            document.getElementById('answer-2'),
            document.getElementById('answer-3')
        ];
        this.explanationSection = document.getElementById('explanation-section');
        this.explanationText = document.getElementById('explanation-text');
        this.nextButton = document.getElementById('next-btn');
        this.restartButton = document.getElementById('restart-btn');
        this.finalScoreSection = document.getElementById('final-score');
        this.finalScoreValue = document.getElementById('final-score-value');
        this.scoreMessage = document.getElementById('score-message');
        this.restartFinalButton = document.getElementById('restart-final-btn');
        
        this.totalQuestionsElement.textContent = this.totalQuestions;
        this.totalQuestionsScoreElement.textContent = this.totalQuestions;
        this.totalQuestionsFinalElement.textContent = this.totalQuestions;
    }
    
    setupEventListeners() {
        this.answerButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.selectAnswer(index));
        });
        
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.restartButton.addEventListener('click', () => this.restartQuiz());
        this.restartFinalButton.addEventListener('click', () => this.restartQuiz());
        
        // Add keyboard event listener for number keys 1-4 and navigation
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            
            // Number keys 1-4 for answer selection (only when not answered)
            if (!this.isAnswered && key >= '1' && key <= '4') {
                const answerIndex = parseInt(key) - 1;
                this.selectAnswer(answerIndex);
            }
            
            // Enter or Space for next question (only when answered)
            if ((key === 'Enter' || key === ' ') && this.isAnswered) {
                event.preventDefault(); // Prevent default space/enter behavior
                this.nextQuestion();
            }
        });
    }
    
    loadQuestion() {
        const question = questions[this.currentQuestion];
        
        this.questionCounter.textContent = this.currentQuestion + 1;
        this.codeDisplay.textContent = question.code;
        this.questionText.textContent = question.question;
        
        this.answerButtons.forEach((button, index) => {
            button.innerHTML = `<span class="shortcut-key">${index + 1}</span> ${question.answers[index]}`;
            button.className = 'answer-btn';
        });
        
        this.explanationSection.classList.remove('show');
        this.nextButton.style.display = 'none';
        this.isAnswered = false;
    }
    
    selectAnswer(selectedIndex) {
        if (this.isAnswered) return;
        
        const question = questions[this.currentQuestion];
        const correctIndex = question.correct;
        const allCorrect = correctIndex === -1;
        
        this.isAnswered = true;
        
        this.answerButtons.forEach((button, index) => {
            button.classList.add('disabled');
            if (allCorrect) {
                button.classList.add('correct');
            } else if (index === correctIndex) {
                button.classList.add('correct');
            } else if (index === selectedIndex) {
                button.classList.add('wrong');
            }
        });
        
        if (allCorrect || selectedIndex === correctIndex) {
            this.score++;
            this.scoreElement.textContent = this.score;
        }
        
        this.explanationText.textContent = question.explanation;
        this.explanationSection.classList.add('show');
        this.nextButton.style.display = 'inline-block';
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
        document.querySelector('.quiz-container').style.display = 'none';
        this.finalScoreSection.style.display = 'block';
        this.finalScoreValue.textContent = this.score;
        
        let message = '';
        const percentage = (this.score / this.totalQuestions) * 100;
        
        if (percentage === 100) {
            message = 'Perfect! You\'re an f-string master! 🏆';
        } else if (percentage >= 80) {
            message = 'Excellent! You have a great understanding of f-strings! 👏';
        } else if (percentage >= 60) {
            message = 'Good job! You know the basics well. 👍';
        } else if (percentage >= 40) {
            message = 'Not bad! Some more practice will help. 📚';
        } else {
            message = 'Keep learning! f-strings have many useful features. 💪';
        }
        
        this.scoreMessage.textContent = message;
    }
    
    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.isAnswered = false;
        
        this.scoreElement.textContent = this.score;
        this.finalScoreSection.style.display = 'none';
        document.querySelector('.quiz-container').style.display = 'block';
        
        this.loadQuestion();
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});