import google.generativeai as genai
import os
from dotenv import load_dotenv


load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel("gemini-pro-vision")

def classify_waste(image_path):
    """Classifies waste based on the uploaded image using Gemini AI."""
    try:
        with open(image_path, "rb") as img_file:
            image_data = img_file.read()

        response = model.generate_content([image_data, "Classify this waste into categories: Plastic, Organic, E-waste, Glass, Metal, Paper."])
        return response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"
