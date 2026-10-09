
# ====================================================================================================================================
#                                                       IMPORTING LIBRARIES
# ====================================================================================================================================
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import re

app = FastAPI()

#==================================================    CORS     =================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ====================================================================================================================================
#                                                       LOADING SAVED MODEL
# ====================================================================================================================================

model = joblib.load("spam_model_v2.pkl")
vectorizer = joblib.load("tfidf_vectorizer_v2.pkl")

# ====================================================================================================================================
#                                                       DEFINE REQUEST STRUCTURE
# ====================================================================================================================================

class EmailRequest(BaseModel):
    email:str

# ====================================================================================================================================
#                                                       CREATE /PREDICT ENDPOINT
# ====================================================================================================================================

@app.post("/predict")
def predict_email(request: EmailRequest):
    email = request.email

    email = email.lower()
    email = re.sub(r"[^\w\s]", "", email)
    email = re.sub(r"\s+", " ", email).strip()

    email_tfidf = vectorizer.transform([email])
    prediction = model.predict(email_tfidf)[0]
    probabilities = model.predict_proba(email_tfidf)[0]

    class_probabilities = {
        label: round(float(probability), 4)
        for label, probability in zip(model.classes_, probabilities)
    }

    return {
        "email": request.email,
        "prediction": prediction,
        "probabilities": class_probabilities
    }

#  API RUN KARO : uvicorn app:app --reload