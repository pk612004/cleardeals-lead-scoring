# Cleardeals Lead Scoring Dashboard 🚀

An AI-powered lead scoring dashboard that predicts customer intent using a Machine Learning model and re-ranks leads with a rule-based LLM-inspired logic. Built to optimize broker efficiency and improve conversion rates.

##  Live Demo
**Frontend (React):** [https://marvelous-melomakarona-d12d9a.netlify.app](https://marvelous-melomakarona-d12d9a.netlify.app)  
**Backend (FastAPI):** [https://cleardeals-backend.onrender.com](https://cleardeals-backend.onrender.com)

---

##  Repository Structure
```
cleardeals-lead-scoring/
├── frontend/               # React app with lead form and results UI
├── backend/                # FastAPI server with ML model and reranker
├── model/                  # Trained model .pkl file
├── data/                   # Source CSV or synthetic dataset
├── requirements.txt        # Python dependencies
├── README.md               # You're reading it ✨
```

---

##  Tech Stack
- **Frontend:** React + Axios + LocalStorage
- **Backend:** FastAPI + Uvicorn
- **ML Model:** Scikit-learn (Logistic Regression)
- **Reranker:** Custom rule-based logic
- **Deployment:** Netlify (frontend), Render (backend)

---

##  Setup Instructions

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev  # or npm run build && npm run preview
```

> 💡 Make sure to add a `.env` file in `frontend/`:
```
VITE_API_URL=https://cleardeals-backend.onrender.com
```

---

##  Sample Test
Try submitting:
```json
{
  "email": "test@lead.com",
  "income": 80000,
  "kidhome": 1,
  "teenhome": 0,
  "recency": 10,
  "num_web_purchases": 4,
  "num_catalog_purchases": 1,
  "comments": "Interested in long-term offer",
  "consent": true
}
```

Response:
```json
{
  "email": "test@lead.com",
  "initial_score": 0.78,
  "reranked_score": 0.88,
  "comments": "High value lead with recent interaction"
}
