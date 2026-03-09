from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model once
model = tf.keras.models.load_model("crop_disease_model.keras")

# Class names must match model training order exactly
class_names = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy"
]

# Treatment recommendations per disease class
TREATMENTS = {
    "Pepper__bell___Bacterial_spot": (
        "Apply copper-based bactericides (e.g., Kocide 3000) every 7–10 days. Remove and destroy "
        "infected plant debris. Avoid overhead irrigation. Use certified disease-free transplants next season."
    ),
    "Pepper__bell___healthy": None,
    "Potato___Early_blight": (
        "Apply fungicides containing chlorothalonil or mancozeb at first sign of symptoms, repeating "
        "every 7 days. Remove lower infected leaves promptly. Ensure proper plant spacing for air circulation. "
        "Rotate crops — avoid planting potatoes in the same field for 2–3 years."
    ),
    "Potato___Late_blight": (
        "Apply systemic fungicides such as metalaxyl or cymoxanil immediately upon detection. Destroy all "
        "infected plant material — do NOT compost. Avoid wetting foliage during irrigation. "
        "This disease spreads rapidly; treat the entire field as a precaution."
    ),
    "Potato___healthy": None,
    "Tomato_Bacterial_spot": (
        "Spray copper bactericides combined with mancozeb weekly. Remove and bag infected leaves. "
        "Avoid working in the field when plants are wet. Treat seeds with hot water (50°C for 25 min) before planting."
    ),
    "Tomato_Early_blight": (
        "Apply chlorothalonil or azoxystrobin fungicide every 7–10 days. Water at the base to keep "
        "foliage dry. Mulch to prevent soil splash. Remove and destroy infected lower leaves."
    ),
    "Tomato_Late_blight": (
        "Apply preventive fungicides (mancozeb, chlorothalonil) before symptoms appear in rainy seasons. "
        "Use systemic fungicides (metalaxyl) when infection is confirmed. Destroy infected plants immediately "
        "to prevent spread to neighbouring plants."
    ),
    "Tomato_Leaf_Mold": (
        "Improve greenhouse ventilation to reduce humidity. Apply fungicides such as chlorothalonil or "
        "mancozeb. Remove and destroy infected leaves. Avoid overhead watering."
    ),
    "Tomato_Septoria_leaf_spot": (
        "Apply fungicides (chlorothalonil, mancozeb, or copper-based sprays) every 7–10 days. "
        "Remove infected leaves at the bottom of the plant. Mulch around the base to prevent soil splash. "
        "Rotate crops to reduce soil pathogen load."
    ),
    "Tomato_Spider_mites_Two_spotted_spider_mite": (
        "Apply miticides such as abamectin or spiromesifen. Introduce natural predators like Phytoseiulus "
        "persimilis (predatory mites). Keep plants well-watered — drought stress worsens mite outbreaks. "
        "Spray the underside of leaves where mites congregate."
    ),
    "Tomato__Target_Spot": (
        "Apply fungicides such as pyraclostrobin or boscalid at early signs of infection. Ensure good "
        "air circulation by proper spacing and pruning. Avoid leaf wetness by using drip irrigation."
    ),
    "Tomato__Tomato_YellowLeaf__Curl_Virus": (
        "There is no cure for infected plants — remove and destroy them immediately to prevent spread. "
        "Control whitefly vectors with insecticides (imidacloprid) or reflective mulches. "
        "Plant resistant varieties in future seasons."
    ),
    "Tomato__Tomato_mosaic_virus": (
        "Remove and destroy infected plants. Disinfect tools and hands with 10% bleach solution. "
        "Control aphid and insect vectors. Plant virus-resistant varieties. Avoid tobacco products "
        "near plants as they can transmit the virus mechanically."
    ),
    "Tomato_healthy": None,
}


def preprocess_image(image):
    image = image.convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    image = Image.open(file)

    processed = preprocess_image(image)

    prediction = model.predict(processed)
    confidence = float(np.max(prediction))
    class_index = int(np.argmax(prediction))
    predicted_class = class_names[class_index]

    # Severity logic
    if confidence > 0.9:
        severity = "Severe"
    elif confidence > 0.7:
        severity = "Moderate"
    else:
        severity = "Mild"

    # If the plant is healthy, override severity
    if "healthy" in predicted_class.lower():
        severity = "Healthy"

    treatment = TREATMENTS.get(predicted_class)

    response = {
        "disease": predicted_class,
        "confidence": round(confidence * 100, 2),
        "severity": severity,
    }
    if treatment:
        response["treatment"] = treatment

    return jsonify(response)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "loaded"}), 200


if __name__ == "__main__":
    app.run(debug=True)