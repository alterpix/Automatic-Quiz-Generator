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

2.  **Access the app:**
    Open your browser and go to `http://127.0.0.1:5000`.

3.  **Generate a Quiz:**
    -   Enter a topic (e.g., "Photosynthesis") or paste a block of text.
    -   Select the difficulty and number of questions.
    -   Click "Generate Quiz".

## Project Structure

-   `app.py`: Main Flask application and API endpoints.
-   `ai_engine.py`: Logic for interacting with Google Gemini API using LangChain.
-   `models.py`: SQLAlchemy database models (`Quiz`, `Question`).
-   `templates/`: HTML templates (`index.html`, `quiz.html`).
-   `static/`: CSS styles (`style.css`) and JavaScript logic (`script.js`).
-   `tests/`: Verification scripts.

## License

MIT
