from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

def call_llm(prompt: str) -> str:
    response = client.responses.create(
        model="openai/gpt-oss-20b",
        input=prompt,
        temperature=0.2,
    )
    return response.output_text
