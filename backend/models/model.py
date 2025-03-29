import google.generativeai as genai
import os
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
from PIL import UnidentifiedImageError
import logging
import base64

load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash-latest")

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def classify_waste(image_path):
    """Classifies waste based on the uploaded image using Gemini AI."""
    try:
        try:
            # Open and process the image
            with Image.open(image_path) as image:
                logging.debug(f"Image opened successfully from: {image_path}")
                
                # Convert to RGB if needed
                if image.mode != 'RGB':
                    image = image.convert('RGB')
                
                # Resize image if too large (max 4MB for Gemini)
                max_size = (800, 800)
                image.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Save to BytesIO in JPEG format (more reliable than PNG for Gemini)
                buffered = BytesIO()
                image.save(buffered, format="JPEG", quality=95)
                img_bytes = buffered.getvalue()
                logging.debug(f"Converted image size: {len(img_bytes)} bytes")

        except UnidentifiedImageError as e:
            logging.error(f"Could not open or read image: {str(e)}")
            return f"Error: Could not open or read image: {str(e)}"
        except Exception as e:
            logging.error(f"Error opening image: {str(e)}")
            return f"Error: {str(e)}"

        try:
            # Create a detailed prompt
            prompt = """
            1. First classify the waste in this image into one of these categories: cardboard, glass, metal, paper, plastic, trash.
            2. Then provide recycling instructions in this format:
               Category: [category name]
               Recycling Instructions: [2-3 short points about how to recycle/dispose]
            """
            
            response = model.generate_content(
                contents=[{"mime_type": "image/jpeg", "data": img_bytes}, prompt],
                generation_config={"temperature": 0.1}
            )
            
            logging.debug(f"Gemini API response received: {response.text}")
            return response.text.strip()

        except Exception as e:
            logging.error(f"Error calling Gemini API: {str(e)}")
            return f"Error: Failed to classify image: {str(e)}"

    except Exception as e:
        logging.error(f"Error during waste classification: {str(e)}")
        return f"Error: {str(e)}"