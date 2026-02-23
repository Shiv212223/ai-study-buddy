from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import shutil
import os
import json

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload folder
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# AI model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Storage
chunks = []
index = None

# 📊 Analytics
analytics = {
    "notes_uploaded": 0,
    "questions_generated": 0,
    "last_score": 0,
    "total_attempted": 0,
    "total_correct": 0
}

# Home route
@app.get("/")
def home():
    return {"message": "AI Study Buddy Backend Running"}


# =========================
# 📂 Upload Notes
# =========================
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global chunks, index
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    
    # Save PDF
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read PDF
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    # Split into chunks
    chunk_size = 500
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

    # Create embeddings and FAISS index
    embeddings = model.encode(chunks)
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings))

    analytics["notes_uploaded"] += 1

    return {"filename": file.filename, "chunks_created": len(chunks)}


# =========================
# 🤖 Ask AI
# =========================
@app.post("/ask")
async def ask_question(data: dict = Body(...)):
    global chunks, index
    question = data.get("question", "")
    
    if index is None:
        return {"answer": "Please upload notes first."}
    
    question_embedding = model.encode([question])
    D, I = index.search(np.array(question_embedding), k=1)
    best_match = chunks[I[0][0]]
    
    return {"answer": best_match}


# =========================
# 📝 Summary
# =========================
@app.get("/summary")
async def generate_summary():
    global chunks
    if not chunks:
        return {"summary": "Please upload notes first."}

    text_to_summarize = " ".join(chunks[:3])
    return {"summary": text_to_summarize[:500]}


# =========================
# 🧠 Quiz Generator
# =========================
@app.get("/quiz")
async def generate_quiz():
    global chunks
    if not chunks:
        return {"quiz": []}

    # Placeholder: actual quiz generation requires an LLM like OpenAI GPT
    # For now, we just return first 5 sentences as dummy questions
    quiz = []
    for i, chunk in enumerate(chunks[:5]):
        quiz.append({
            "question": f"Question based on chunk {i+1}",
            "options": ["A", "B", "C", "D"],
            "answer": "A"
        })
    analytics["questions_generated"] += len(quiz)
    return {"quiz": quiz}


# =========================
# 📊 Submit Quiz Score
# =========================
class ScoreData(BaseModel):
    score: int
    total: int

@app.post("/submit-quiz")
async def submit_quiz(data: ScoreData):
    analytics["last_score"] = data.score
    analytics["total_attempted"] += data.total
    analytics["total_correct"] += data.score
    return {"message": "Score saved"}


# =========================
# 📈 Analytics Endpoint
# =========================
@app.get("/analytics")
async def get_analytics():
    accuracy = 0
    if analytics["total_attempted"] > 0:
        accuracy = (analytics["total_correct"] / analytics["total_attempted"]) * 100

    return {
        "notes_uploaded": analytics["notes_uploaded"],
        "questions_generated": analytics["questions_generated"],
        "last_score": analytics["last_score"],
        "accuracy": round(accuracy, 2)
    }