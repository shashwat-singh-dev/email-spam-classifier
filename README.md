# Email Spam Classifier

A machine learning web application that classifies email messages as **Spam** or **Ham (Legitimate)** using TF-IDF feature extraction and Logistic Regression.

The application provides an interactive frontend and a FastAPI backend that returns predictions and class probabilities.

## Features

- Email spam classification using Logistic Regression
- Text preprocessing and TF-IDF vectorization
- Unigram and bigram feature extraction
- Class balancing to improve spam detection
- Hyperparameter tuning using the regularization parameter `C`
- Spam and ham probability scores
- Interactive web interface with visual probability bars
- FastAPI prediction endpoint
- Model persistence using Joblib

## Tech Stack

| Category | Technologies |
|---|---|
| Language | Python, JavaScript |
| Machine Learning | Scikit-learn, Logistic Regression |
| NLP | TF-IDF, text preprocessing, n-grams |
| Backend | FastAPI, Pydantic |
| Frontend | HTML, CSS, JavaScript |
| Model Storage | Joblib |
| Development | Jupyter Notebook, VS Code, Git, GitHub |

## Machine Learning Workflow

1. **Data loading:** Loaded the email dataset containing ham and spam messages.
2. **Data cleaning:** Removed duplicate records and cleaned the email text.
3. **Train-test split:** Split the data into training and testing sets.
4. **Feature extraction:** Converted email text into numerical features using TF-IDF.
5. **Baseline model:** Trained a Logistic Regression classifier.
6. **Model improvement:** Tested class weighting, bigram features, and different values of `C`.
7. **Validation:** Used a separate validation split to evaluate model configurations.
8. **Final evaluation:** Retrained the selected configuration on the full training set and evaluated it on the held-out test set.
9. **Deployment interface:** Saved the trained model and vectorizer, exposed predictions through FastAPI, and connected the API to a web frontend.

## Model Improvements

The initial baseline achieved approximately **96.13% accuracy**, but its spam recall was around **74.48%**, meaning it missed a noticeable proportion of spam messages.

The following improvements were explored:

- **Class weighting:** Used `class_weight="balanced"` to give greater importance to the minority spam class.
- **Bigram features:** Used `ngram_range=(1, 2)` to capture individual words and two-word combinations.
- **Hyperparameter tuning:** Evaluated `C` values of `0.1`, `1.0`, and `10.0`.
- **Validation split:** Evaluated the selected configuration on a separate validation set before final testing.

### Final Model Configuration

```python
TfidfVectorizer(ngram_range=(1, 2))

LogisticRegression(
    C=10.0,
    class_weight="balanced",
    max_iter=1000
)
```

## Results

The final held-out test evaluation achieved approximately **97.5%+ accuracy**, with an approximately **0.92 F1-score for the spam class**.

| Metric | Approximate result |
|---|---:|
| Accuracy | 97.5%+ |
| Spam precision | 0.92 |
| Spam recall | 0.92 |
| Spam F1-score | 0.92 |

*Values are approximate, based on the final classification report. Results may vary if the dataset split or training configuration changes.*

## Project Structure

```text
email-spam-classifier/
├── app.py
├── spam_model_v2.pkl
├── tfidf_vectorizer_v2.pkl
├── requirements.txt
├── README.md
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

Your notebook and dataset may also be present locally. Add them to the repository only if you intend to share them and the dataset's terms permit redistribution.

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd email-spam-classifier
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the FastAPI backend

```bash
uvicorn app:app --reload
```

The API will run locally at:

`http://127.0.0.1:8000`

Open the interactive API documentation at:

`http://127.0.0.1:8000/docs`

### 5. Run the frontend

Open `frontend/index.html` using VS Code Live Server.

The JavaScript frontend currently sends requests to:

```javascript
http://127.0.0.1:8000/predict
```

Ensure the FastAPI server is running and its CORS configuration allows the frontend's origin.

## API Usage

**Endpoint:** `POST /predict`

Request body:

```json
{
  "email": "Congratulations! You have won a prize. Claim your reward now."
}
```

The API returns the predicted class and class probabilities. For example, the response structure is:

```json
{
  "email": "Example email text",
  "prediction": "spam",
  "probabilities": {
    "ham": 0.08,
    "spam": 0.92
  }
}
```

*The probabilities above are illustrative, not a guaranteed prediction for that example.*

## Limitations

- Performance depends on the dataset and its representation of real-world emails.
- The model may misclassify unfamiliar spam or legitimate messages.
- TF-IDF and Logistic Regression do not fully understand context or intent.
- Predicted probabilities are model estimates and should not be treated as perfectly calibrated certainty.

## Future Improvements

- Deploy the frontend and backend publicly.
- Add automated tests for the API and preprocessing.
- Evaluate performance on newer, unseen email datasets.
- Explore probability calibration and decision thresholds.
- Add monitoring for changing spam patterns.

## Key Learning Outcomes

- Text preprocessing and feature engineering for NLP
- TF-IDF vectorization and n-gram features
- Logistic Regression and class imbalance handling
- Precision, recall, F1-score, and confusion matrix analysis
- Hyperparameter tuning and validation
- Integrating a machine learning model with FastAPI and a frontend

---

**Author:** Shashwat Singh

**Note:** This project is for educational purposes. Do not rely on its predictions alone to make security-sensitive decisions.
