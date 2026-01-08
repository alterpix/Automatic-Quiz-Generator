# Automatic Quiz Generator

A premium, AI-powered web application that generates multiple-choice quizzes from any topic or text using Google's Gemini API.

## Features

-   **AI-Powered Generation**: Utilizes `gemini-2.5-flash` to create high-quality, relevant questions.
-   **Customizable Quizzes**: Choose your difficulty level (Easy, Medium, Hard) and the number of questions (5, 10, 15).
-   **Premium UI/UX**: A modern, responsive interface featuring dark mode, glassmorphism effects, and smooth animations.
-   **Interactive Experience**: Real-time progress tracking, instant feedback, and detailed explanations for each answer.
-   **Quiz History**: Automatically saves generated quizzes to a local SQLite database, allowing you to revisit and retake them anytime.
-   **Result Analysis**: Get immediate scoring and performance feedback.

## Prerequisites

-   Python 3.8+
-   A Google Cloud API Key with access to Gemini API.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd quiz_generator
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Google API Key:
    ```env
    GOOGLE_API_KEY=your_api_key_here
    ```

## Usage

1.  **Run the application:**
    ```bash
    python app.py
    ```
    The application will be accessible at `http://localhost:5000` and on your local network at `http://<your-local-ip>:5000`.

2.  **Run for Production (Publicly):**
    To run the application in a production-like environment or make it accessible publicly (if port forwarding is set up), use `gunicorn`:
    ```bash
    gunicorn -w 4 -b 0.0.0.0:5000 app:app
    ```

3.  **Generate a Quiz:**
    -   Enter a topic (e.g., "Photosynthesis") or paste a block of text.
    -   Select the difficulty (Easy, Medium, Hard) and number of questions (5, 10, 15).
    -   Click "Generate Quiz".
    -   View your recent quizzes in the "Recent Quizzes" section.

## Project Structure

```
quiz_generator/
├── app.py                  # Main Flask application and API endpoints
├── ai_engine.py            # AI interaction logic (Gemini API)
├── models.py               # Database models (Quiz, Question)
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (API Key)
├── README.md               # Project documentation
├── .gitignore              # Git ignore configuration
├── templates/              # HTML templates
│   ├── index.html          # Landing page
│   └── quiz.html           # Quiz interface
├── static/                 # Static assets
│   ├── style.css           # Premium UI styles
│   └── script.js           # Frontend logic
└── tests/                  # Verification scripts
    └── verify_ai.py        # AI generation test script
```

## License

MIT
