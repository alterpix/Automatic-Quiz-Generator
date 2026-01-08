from flask import Flask, render_template, request, jsonify
from models import db, Quiz, Question
from ai_engine import generate_quiz_data
import json
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    recent_quizzes = Quiz.query.order_by(Quiz.created_at.desc()).limit(10).all()
    return render_template('index.html', recent_quizzes=recent_quizzes)

@app.route('/quiz/<int:quiz_id>')
def quiz_page(quiz_id):
    return render_template('quiz.html', quiz_id=quiz_id)

@app.route('/api/generate', methods=['POST'])
def generate_quiz():
    data = request.json
    topic = data.get('topic')
    difficulty = data.get('difficulty', 'Medium')
    count = data.get('count', 10)
    
    if not topic:
        return jsonify({'error': 'Topic is required'}), 400

    try:
        questions_data = generate_quiz_data(topic, difficulty, count)
        
        if not questions_data:
             return jsonify({'error': 'Failed to generate quiz'}), 500

        new_quiz = Quiz(topic=topic)
        db.session.add(new_quiz)
        db.session.commit()

        for q_data in questions_data:
            new_question = Question(
                quiz_id=new_quiz.id,
                text=q_data['question'],
                options=json.dumps(q_data['options']),
                correct_answer=q_data['correct_answer'],
                explanation=q_data['explanation']
            )
            db.session.add(new_question)
        
        db.session.commit()

        return jsonify({'quiz_id': new_quiz.id, 'message': 'Quiz generated successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/quiz/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    return jsonify(quiz.to_dict())

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
