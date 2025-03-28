from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os

app = Flask('__name__')
CORS(app)

UPLOAD_FOLDER ="uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Welcome to Waste Classification API!"})



if __name__ == "__main__":
    app.run(debug=True, port=5000)