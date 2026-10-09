
const emailInput = document.getElementById("emailInput");
const predictButton = document.getElementById("predictButton");
const result = document.getElementById("result");

predictButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();

    if (!email) {
        result.className = "result-card error";
        result.style.display = "block";
        result.textContent = "Please enter an email first.";
        emailInput.focus();
        return;
    }

    predictButton.disabled = true;
    predictButton.textContent = "Analyzing Email...";

    result.style.display = "none";
    result.className = "result-card";

    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        });

        if (!response.ok) {
            throw new Error("Prediction request failed.");
        }

        const data = await response.json();

        const isSpam = data.prediction.toLowerCase() === "spam";

        const spamProbability = Math.min(
            100,
            Math.max(0, Number(data.probabilities.spam) * 100)
        );

        const hamProbability = Math.min(
            100,
            Math.max(0, Number(data.probabilities.ham) * 100)
        );

        const spamPercentage = spamProbability.toFixed(2);
        const hamPercentage = hamProbability.toFixed(2);

        result.className = `result-card ${
            isSpam ? "spam-result" : "ham-result"
        }`;

        result.style.display = "block";

        result.innerHTML = `
            <div class="result-heading">
                <div>
                    <p class="result-label">Classification Result</p>
                    <h2>
                        ${isSpam ? "SPAM DETECTED" : "LEGITIMATE EMAIL"}
                    </h2>
                </div>

                <span class="result-icon" aria-hidden="true">
                    ${isSpam ? "!" : "✓"}
                </span>
            </div>

            <hr class="result-divider">

            <div class="probability-section">
                <div class="probability-heading">
                    <span>Spam Probability</span>
                    <strong>${spamPercentage}%</strong>
                </div>

                <div
                    class="probability-track"
                    role="progressbar"
                    aria-label="Spam probability"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="${spamPercentage}"
                >
                    <div
                        class="probability-fill spam-fill"
                        style="width: ${spamPercentage}%"
                    ></div>
                </div>
            </div>

            <div class="probability-section">
                <div class="probability-heading">
                    <span>Ham Probability</span>
                    <strong>${hamPercentage}%</strong>
                </div>

                <div
                    class="probability-track"
                    role="progressbar"
                    aria-label="Legitimate email probability"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="${hamPercentage}"
                >
                    <div
                        class="probability-fill ham-fill"
                        style="width: ${hamPercentage}%"
                    ></div>
                </div>
            </div>

            <p class="result-message">
                ${
                    isSpam
                        ? "This message may be suspicious. Avoid clicking unknown links or sharing personal information."
                        : "This message appears legitimate, but always verify unexpected requests and links."
                }
            </p>
        `;

    } catch (error) {
        result.className = "result-card error";
        result.style.display = "block";
        result.textContent =
            "Could not connect to the server. Make sure FastAPI is running.";

        console.error("Prediction error:", error);

    } finally {
        predictButton.disabled = false;
        predictButton.textContent = "Check Email";
    }
});
