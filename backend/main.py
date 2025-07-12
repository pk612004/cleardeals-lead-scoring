# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
import joblib, os
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "intent_model.pkl")

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"❌ Could not load model at {MODEL_PATH}: {e}")
    model = None  # we’ll handle this later
app = FastAPI(title="Cleardeals Lead Scoring API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class LeadInput(BaseModel):
    email: EmailStr
    income: float = Field(ge=0)
    kidhome: int = Field(ge=0)
    teenhome: int = Field(ge=0)
    recency: int = Field(ge=0)
    num_web_purchases: int = Field(ge=0)
    num_catalog_purchases: int = Field(ge=0)
    comments: str
    consent: bool
KEYWORDS = {
    "urgent": 10,
    "call me": 8,
    "interested": 5,
    "thinking": -5,
    "not interested": -10,
}
def apply_reranker(score: float, comments: str) -> float:
    for word, delta in KEYWORDS.items():
        if word in comments.lower():
            score += delta
    return max(0, min(100, score))

@app.post("/score")
def score_lead(lead: LeadInput):
    if not lead.consent:
        raise HTTPException(status_code=400, detail="Consent not given")

    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded on server")

    features = [[
        lead.income,
        lead.kidhome,
        lead.teenhome,
        lead.recency,
        lead.num_web_purchases,
        lead.num_catalog_purchases,
    ]]

    try:
        initial_prob = model.predict_proba(features)[0][1]  
        initial_score = round(initial_prob * 100, 2)
        reranked_score = apply_reranker(initial_score, lead.comments)

        return {
            "email": lead.email,
            "initial_score": initial_score,
            "reranked_score": reranked_score,
            "comments": lead.comments,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")
