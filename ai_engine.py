import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv

load_dotenv()

class QuestionSchema(BaseModel):
    question: str = Field(description="The text of the question")
    options: List[str] = Field(description="A list of 4 options (A, B, C, D)")
    correct_answer: str = Field(description="The correct option (A, B, C, or D)")
    explanation: str = Field(description="A brief explanation of why the answer is correct")

class QuizSchema(BaseModel):
    questions: List[QuestionSchema] = Field(description="A list of questions")

def generate_quiz_data(topic_or_text, difficulty="Medium", count=10):
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-09-2025", google_api_key=api_key, temperature=0.7, max_retries=5)

    parser = PydanticOutputParser(pydantic_object=QuizSchema)

    prompt = PromptTemplate(
        template="""You are an expert quiz generator. Create a multiple-choice quiz based on the following topic or text:
        
        "{topic}"
        
        Difficulty Level: {difficulty}
        Number of Questions: {count}
        
        Generate exactly {count} questions. Each question must have 4 options (A, B, C, D), one correct answer, and a short explanation.
        
        {format_instructions}
        """,
        input_variables=["topic", "difficulty", "count"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )

    chain = prompt | llm | parser

    try:
        result = chain.invoke({"topic": topic_or_text, "difficulty": difficulty, "count": count})
        # Convert Pydantic models to list of dicts
        return [q.dict() for q in result.questions]
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error generating quiz: {e}")
        return []

if __name__ == "__main__":
    # Test run
    print(generate_quiz_data("Photosynthesis"))
