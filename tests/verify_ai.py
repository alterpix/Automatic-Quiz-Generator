from ai_engine import generate_quiz_data
import json

import time

def test_generation():
    print("Testing AI Quiz Generation...")
    topic = "The Solar System"
    max_retries = 3
    for i in range(max_retries):
        try:
            print(f"Attempt {i+1}...")
            questions = generate_quiz_data(topic)
            if questions and len(questions) >= 5:
                print(f"SUCCESS: Generated {len(questions)} questions for topic '{topic}'")
                print("Sample Question:")
                print(json.dumps(questions[0], indent=2))
                return
            else:
                print("FAILURE: Generated fewer than 5 questions or None")
                print(questions)
        except Exception as e:
            print(f"ERROR: {e}")
        
        if i < max_retries - 1:
            print("Retrying in 10 seconds...")
            time.sleep(10)

if __name__ == "__main__":
    test_generation()
