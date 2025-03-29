from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
import os
from models.model import classify_waste

app = Flask(__name__)

CORS(app, supports_credentials=True, origins="http://localhost:3000") 
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["MONGO_URI"] = "mongodb://localhost:27017/authdb"
app.config["SESSION_TYPE"] = "filesystem"
app.secret_key = secrets.token_hex(16) 
mongo = PyMongo(app)
 
@app.route("/", methods=["GET"])
def index():
    if "username" in session:
        return jsonify({"message": f"Hello, {session['username']}!", "status": "logged_in"}), 200
    return jsonify({"message": "Not logged in", "status": "logged_out"}), 200

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request format"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if mongo.db.users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 409

    password_hash = generate_password_hash(password)
    mongo.db.users.insert_one({"username": username, "password_hash": password_hash})

    return jsonify({"message": "Registration successful"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request format"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    user = mongo.db.users.find_one({"username": username})

    if user and check_password_hash(user["password_hash"], password):
        session["username"] = username
        return jsonify({"message": "Login successful", "username": username}), 200

    return jsonify({"error": "Invalid username or password"}), 401

@app.route("/logout", methods=["POST"])
def logout():
    if "username" in session:
        session.pop("username", None)
        return jsonify({"message": "Logged out successfully"}), 200
    return jsonify({"error": "User not logged in"}), 400

@app.route("/home", methods=["GET"])
def home():
    if "username" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"username": session["username"]})

@app.route("/dashboard", methods=["POST"])
def dashboard():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected image"}), 400
    if file:
        try:
            image_data = file.read()
            predicted_class = classify_waste(image_data)
            return jsonify({"Message": predicted_class}), 200
        except Exception as e:
            return jsonify({"error": f"Error processing image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)