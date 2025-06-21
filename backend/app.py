from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create scores directory if it doesn't exist
SCORES_DIR = "scores"
if not os.path.exists(SCORES_DIR):
    os.makedirs(SCORES_DIR)

@app.route('/')
def home():
    return jsonify({
        "message": "Emotion Recognition Game Backend",
        "status": "running",
        "endpoints": {
            "save_score_table": "POST /save_score_table"
        }
    })

@app.route('/save_score_table', methods=['POST'])
def save_score_table():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        if not data or 'round' not in data or 'results' not in data:
            return jsonify({
                "error": "Missing required fields: round and results"
            }), 400
        
        round_num = data['round']
        results = data['results']
        
        # Validate data types
        if not isinstance(round_num, int):
            return jsonify({
                "error": "round must be an integer"
            }), 400
        
        if not isinstance(results, list):
            return jsonify({
                "error": "results must be a list"
            }), 400
        
        # Validate results structure
        valid_emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral']
        for i, result in enumerate(results):
            if not isinstance(result, dict) or 'correct' not in result or 'selected' not in result:
                return jsonify({
                    "error": f"Invalid result structure at index {i}"
                }), 400
            
            if result['correct'] not in valid_emotions or result['selected'] not in valid_emotions:
                return jsonify({
                    "error": f"Invalid emotion at index {i}"
                }), 400
        
        # Convert results to 2D NumPy array
        # Format: [["happy", "sad"], ["angry", "angry"], ...]
        results_array = np.array([[result['correct'], result['selected']] for result in results])
        
        # Generate timestamp for unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"round{round_num}_{timestamp}.npy"
        filepath = os.path.join(SCORES_DIR, filename)
        
        # Save to .npy file
        np.save(filepath, results_array)
        
        return jsonify({
            "message": "Saved",
            "file": filepath
        }), 200
        
    except Exception as e:
        print(f"Error saving results: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": "Failed to save results"
        }), 500

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Starting Emotion Recognition Game Backend...")
    print("📁 Scores will be saved to:", os.path.abspath(SCORES_DIR))
    print("🌐 Server will run on: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000) 