from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from models.model import classify_waste

app = Flask(__name__)

CORS(app, 
     resources={r"/*": {"origins": ["http://localhost:3000"], "allow_headers": ["Content-Type"]}},
     supports_credentials=True)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/dashboard", methods=["POST"])
def dashboard():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected image"}), 400

    # Check if the file has an allowed extension
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if not '.' in file.filename or \
       file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({"error": "Invalid file type. Please upload an image."}), 400

    if file:
        try:
            import uuid
            unique_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
            filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
            
            file.save(filepath)
            print(f"Image saved to: {filepath}")

            try:
                predicted_class = classify_waste(filepath)
                print(f"Classification result: {predicted_class}")
                
                if os.path.exists(filepath):
                    os.remove(filepath)
                
                response = jsonify({"Message": predicted_class})
                response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
                return response, 200
            
            except Exception as e:
                if os.path.exists(filepath):
                    os.remove(filepath)
                raise e

        except Exception as e:
            print(f"Error processing image: {e}")
            return jsonify({"error": f"Error processing image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)