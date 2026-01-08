document.addEventListener('DOMContentLoaded', () => {
    // Landing Page Logic
    const generateBtn = document.getElementById('generateBtn');
    const topicInput = document.getElementById('topicInput');
    const difficultySelect = document.getElementById('difficultySelect');
    const countSelect = document.getElementById('countSelect');

    if (generateBtn && topicInput) {
        generateBtn.addEventListener('click', async () => {
            const topic = topicInput.value.trim();
            const difficulty = difficultySelect.value;
            const count = parseInt(countSelect.value);

            if (!topic) {
                alert('Please enter a topic or text');
                return;
            }

            // UI Loading State
            generateBtn.disabled = true;
            generateBtn.querySelector('.btn-text').textContent = 'Generating...';
            generateBtn.querySelector('.loader').style.display = 'block';

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ topic, difficulty, count }),
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.href = `/quiz/${data.quiz_id}`;
                } else {
                    alert('Error: ' + data.error);
                    resetButton();
                }
            } catch (error) {
                alert('An error occurred. Please try again.');
                console.error(error);
                resetButton();
            }
        });

        function resetButton() {
            generateBtn.disabled = false;
            generateBtn.querySelector('.btn-text').textContent = 'Generate Quiz';
            generateBtn.querySelector('.loader').style.display = 'none';
        }
    }

    // Quiz Interface Logic
    const quizContainer = document.getElementById('quizContainer');
    if (quizContainer && typeof QUIZ_ID !== 'undefined') {
        let currentQuestionIndex = 0;
        let questions = [];
        let score = 0;
        let quizData = null;

        const questionText = document.getElementById('questionText');
        const optionsGrid = document.getElementById('optionsGrid');
        const nextBtn = document.getElementById('nextBtn');
        const explanationBox = document.getElementById('explanationBox');
        const explanationText = document.getElementById('explanationText');
        const questionCounter = document.getElementById('questionCounter');
        const progressFill = document.getElementById('progressFill');
        const topicBadge = document.getElementById('topicBadge');
        const resultsContainer = document.getElementById('resultsContainer');

        // Fetch Quiz Data
        fetch(`/api/quiz/${QUIZ_ID}`)
            .then(res => res.json())
            .then(data => {
                quizData = data;
                questions = data.questions;
                topicBadge.textContent = data.topic;
                loadQuestion(0);
            })
            .catch(err => console.error('Error loading quiz:', err));

        function loadQuestion(index) {
            if (index >= questions.length) {
                showResults();
                return;
            }

            const question = questions[index];
            questionText.textContent = question.text;
            questionCounter.textContent = `Question ${index + 1}/${questions.length}`;

            // Update Progress Bar
            const progress = ((index) / questions.length) * 100;
            progressFill.style.width = `${progress}%`;

            // Clear previous state
            optionsGrid.innerHTML = '';
            explanationBox.style.display = 'none';
            nextBtn.style.display = 'none';

            // Create Options
            question.options.forEach((opt, i) => {
                const letter = String.fromCharCode(65 + i); // A, B, C, D
                const btn = document.createElement('div');
                btn.className = 'option-btn';
                btn.innerHTML = `
                    <div class="option-marker">${letter}</div>
                    <span>${opt}</span>
                `;
                btn.onclick = () => handleAnswer(btn, letter, question);
                optionsGrid.appendChild(btn);
            });
        }

        function handleAnswer(selectedBtn, selectedLetter, question) {
            // Disable all options
            const allOptions = optionsGrid.querySelectorAll('.option-btn');
            allOptions.forEach(btn => btn.style.pointerEvents = 'none');

            const isCorrect = selectedLetter === question.correct_answer;

            if (isCorrect) {
                selectedBtn.classList.add('correct');
                score++;
            } else {
                selectedBtn.classList.add('incorrect');
                // Highlight correct answer
                const correctIndex = question.correct_answer.charCodeAt(0) - 65;
                allOptions[correctIndex].classList.add('correct');
            }

            // Show Explanation
            explanationText.textContent = question.explanation;
            explanationBox.style.display = 'block';
            nextBtn.style.display = 'block';

            // Update Progress Bar to complete current step visually
            const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
            progressFill.style.width = `${progress}%`;
        }

        nextBtn.onclick = () => {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        };

        function showResults() {
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'block';

            const percentage = Math.round((score / questions.length) * 100);

            // Animate Score
            let currentScore = 0;
            const scoreInterval = setInterval(() => {
                if (currentScore >= percentage) {
                    clearInterval(scoreInterval);
                } else {
                    currentScore++;
                    document.getElementById('finalScore').textContent = currentScore;
                }
            }, 20);

            // Update Circle Gradient
            const circle = document.querySelector('.score-circle');
            circle.style.background = `conic-gradient(var(--primary-color) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%)`;

            // Message
            const msg = document.getElementById('resultMessage');
            if (percentage >= 80) msg.textContent = "Outstanding! You're a master!";
            else if (percentage >= 60) msg.textContent = "Good job! Keep learning.";
            else msg.textContent = "Keep practicing, you'll get there!";
        }
    }
});
