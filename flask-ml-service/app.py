from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Load model once
model = tf.keras.models.load_model("crop_disease_model.keras")

# 🔥 IMPORTANT: Paste exact class_names from Colab here
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
    class_index = np.argmax(prediction)
    predicted_class = class_names[class_index]

    # Severity logic
    if confidence > 0.9:
        severity = "Severe"
    elif confidence > 0.7:
        severity = "Moderate"
    else:
        severity = "Mild"

    return jsonify({
        "disease": predicted_class,
        "confidence": round(confidence * 100, 2),
        "severity": severity
    })

if __name__ == "__main__":
    app.run(debug=True)