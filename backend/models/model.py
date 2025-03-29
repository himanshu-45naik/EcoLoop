import google.generativeai as genai
import os
from dotenv import load_dotenv


load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash-latest")

def classify_waste(image_path):
    """Classifies waste based on the uploaded image using Gemini AI."""
    try:
        with open(image_path, "rb") as img_file:
            image_data = img_file.read()

        response = model.generate_content([image_data, "Classify the waste in this image into one of these categories: cardboard,glass, metal, paper, plastic, trash. Only respond with the category name.and also gvie detailed information about how the waste can be "])
        return response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"
