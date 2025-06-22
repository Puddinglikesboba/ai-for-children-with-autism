from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
from datetime import datetime
import requests
from dotenv import load_dotenv
import logging
from logging.handlers import RotatingFileHandler

# Load environment variables
load_dotenv()

# --- Setup Logging ---
log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(funcName)s(%(lineno)d) %(message)s')
log_file = 'backend.log'

# Setup a rotating file handler
my_handler = RotatingFileHandler(log_file, mode='a', maxBytes=5*1024*1024, 
                                 backupCount=2, encoding=None, delay=0)
my_handler.setFormatter(log_formatter)
my_handler.setLevel(logging.INFO)

# Get the root logger
app_log = logging.getLogger('root')
app_log.setLevel(logging.INFO)
app_log.addHandler(my_handler)
# --- End Logging Setup ---

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create scores directory if it doesn't exist
if not os.path.exists('scores'):
    os.makedirs('scores')

# Emotion categories
EMOTIONS = ['angry', 'disgust', 'happy', 'sadness', 'neutral', 'fear']

# A mapping to normalize emotion names, treating 'sad' and 'sadness' as the same.
EMOTION_MAP = {
    'sad': 'sadness',
    'sadness': 'sadness',
    'angry': 'angry',
    'disgust': 'disgust',
    'happy': 'happy',
    'neutral': 'neutral',
    'fear': 'fear'
}

def load_all_scores(score_dir):
    """Load all .npy files from scores directory and combine/normalize data"""
    combined_data = []
    
    if not os.path.exists(score_dir):
        return combined_data
    
    for filename in os.listdir(score_dir):
        if filename.endswith('.npy'):
            filepath = os.path.join(score_dir, filename)
            try:
                data = np.load(filepath)
                # Normalize the data to handle inconsistencies like 'sad' vs 'sadness'
                normalized_data = []
                for correct, selected in data.tolist():
                    norm_correct = EMOTION_MAP.get(str(correct).lower())
                    norm_selected = EMOTION_MAP.get(str(selected).lower())
                    if norm_correct and norm_selected:
                        normalized_data.append([norm_correct, norm_selected])
                combined_data.extend(normalized_data)
            except Exception as e:
                app_log.error(f"Error loading or normalizing {filename}: {str(e)}")
                continue
    
    return combined_data

def compute_emotion_matrix(data):
    """Compute 7x7 confusion matrix from emotion recognition data"""
    # Initialize 7x7 matrix
    M = np.zeros((6, 6), dtype=int)
    
    # Map emotions to indices
    emotion_to_idx = {emotion: idx for idx, emotion in enumerate(EMOTIONS)}
    
    for correct, selected in data:
        if correct in emotion_to_idx and selected in emotion_to_idx:
            i = emotion_to_idx[correct]  # correct emotion (row)
            j = emotion_to_idx[selected]  # user choice (column)
            M[i][j] += 1
    
    return M

def compute_direction_vector(V0, M):
    """Compute user direction vector: V_user = V0 @ M"""
    return V0 @ M

def compute_accuracy(M):
    """Compute accuracy for each emotion"""
    accuracies = {}
    totals = {}
    corrects = {}
    
    for i, emotion in enumerate(EMOTIONS):
        total = np.sum(M[i, :])  # Total questions for this emotion
        correct = M[i, i]  # Correct answers (diagonal)
        
        totals[emotion] = int(total)
        corrects[emotion] = int(correct)
        accuracy_val = (correct / total * 100) if total > 0 else 0
        accuracies[emotion] = float(accuracy_val)
    
    return accuracies, totals, corrects

def compute_overall_stats(M):
    """Compute overall statistics"""
    total_questions = np.sum(M)
    total_correct = np.sum(np.diag(M))
    overall_accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0
    
    return {
        'total_questions': int(total_questions),
        'total_correct': int(total_correct),
        'overall_accuracy': float(overall_accuracy)
    }

@app.route('/api/hello')
def hello_world():
    return jsonify({'message': 'Hello from Flask!'})

@app.route('/api/emotion-game')
def home():
    return jsonify({
        "message": "Emotion Recognition Game Backend",
        "status": "running",
        "endpoints": {
            "save_score_table": "POST /save_score_table",
            "get_feedback_all": "GET /get_feedback_all",
            "emotion_summary": "GET /api/emotion_summary"
        }
    })

@app.route('/api/emotion_summary', methods=['GET'])
def emotion_summary():
    """API endpoint for emotion vector analysis summary"""
    try:
        # Load all score data
        data = load_all_scores('scores')
        
        if not data:
            return jsonify({
                "error": "No data found",
                "message": "No score files found in scores directory"
            }), 404
        
        # Compute emotion matrix
        M = compute_emotion_matrix(data)
        
        # Define base vector (all 1s)
        V0 = np.ones(6)
        
        # Compute direction vector
        V_user = compute_direction_vector(V0, M)
        
        # Compute accuracies
        accuracies, totals, corrects = compute_accuracy(M)
        
        # Compute overall stats
        overall_stats = compute_overall_stats(M)
        
        # Prepare response
        response = {
            "emotions": EMOTIONS,
            "matrix": M.tolist(),
            "base_vector": V0.tolist(),
            "user_direction_vector": V_user.tolist(),
            "accuracies": accuracies,
            "totals": totals,
            "corrects": corrects,
            "overall_stats": overall_stats,
            "data_points": len(data)
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        app_log.error(f"Error in emotion_summary: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Internal server error",
            "message": "Failed to generate emotion summary"
        }), 500

@app.route('/save_score_table', methods=['POST'])
def save_score_table():
    try:
        data = request.get_json()
        
        if not data or 'round' not in data or 'results' not in data:
            app.logger.error("Invalid data: 'round' or 'results' key missing.")
            return jsonify({"status": "error", "message": "Invalid data"}), 400

        round_num = data.get('round')
        results = data.get('results')
        
        if not isinstance(round_num, int) or not isinstance(results, list):
            app.logger.error("Invalid data format for round or results.")
            return jsonify({"status": "error", "message": "Invalid data format"}), 400

        # Create scores directory if it doesn't exist
        if not os.path.exists('scores'):
            os.makedirs('scores')

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"round{round_num}_{timestamp}.npy"
        filepath = os.path.join('scores', filename)
        
        np.save(filepath, np.array(results))
        app.logger.info(f"Successfully saved scores to {filepath}")
        return jsonify({"status": "success", "message": f"Scores saved to {filepath}"})
        
    except Exception as e:
        app.logger.error(f"An error occurred while saving results: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Internal server error",
            "message": "Failed to save results"
        }), 500

@app.route('/get_feedback_all', methods=['GET'])
def get_feedback_all():
    app_log.info("Received request for /get_feedback_all")
    try:
        # Scan the scores/ folder and load all .npy files
        combined_data = []
        
        if not os.path.exists('scores'):
            return jsonify({
                "feedback": "No game data found. Play some rounds to get personalized feedback!",
                "stats": {}
            }), 200
        
        # Load all .npy files
        for filename in os.listdir('scores'):
            if filename.endswith('.npy'):
                filepath = os.path.join('scores', filename)
                try:
                    data = np.load(filepath)
                    combined_data.extend(data.tolist())
                except Exception as e:
                    print(f"Error loading {filename}: {str(e)}")
                    continue
        
        if not combined_data:
            return jsonify({
                "feedback": "No game data found. Play some rounds to get personalized feedback!",
                "stats": {}
            }), 200
        
        # Calculate stats for each emotion
        stats = {}
        valid_emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral']
        
        for emotion in valid_emotions:
            stats[emotion] = {"correct": 0, "wrong": 0}
        
        for correct, selected in combined_data:
            if correct in valid_emotions:
                if correct == selected:
                    stats[correct]["correct"] += 1
                else:
                    stats[correct]["wrong"] += 1
        
        # Calculate overall accuracy
        total_correct = sum(stat["correct"] for stat in stats.values())
        total_questions = sum(stat["correct"] + stat["wrong"] for stat in stats.values())
        overall_accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0
        
        # Find strengths and weaknesses
        strengths = []
        weaknesses = []
        
        for emotion, stat in stats.items():
            total = stat["correct"] + stat["wrong"]
            if total > 0:
                accuracy = (stat["correct"] / total) * 100
                if accuracy >= 80:
                    strengths.append(f"{emotion} ({accuracy:.1f}%)")
                elif accuracy <= 50:
                    weaknesses.append(f"{emotion} ({accuracy:.1f}%)")
        
        # Local feedback only, no Gemini API
        strengths_text = ', '.join(strengths) if strengths else "You're doing well across all emotions!"
        weaknesses_text = ', '.join(weaknesses) if weaknesses else "Keep up the excellent work!"

        feedback_lines = [
            f"Great job playing the emotion recognition game! You answered {total_questions} questions with {overall_accuracy:.1f}% accuracy overall.",
            f"Your strengths: {strengths_text}",
            f"Areas to practice: {weaknesses_text}",
            "Remember, recognizing emotions takes practice, and you're doing wonderfully! Keep playing to improve your skills."
        ]
        feedback = "\n\n".join(feedback_lines)
        
        return jsonify({
            "feedback": feedback.strip(),
            "stats": stats,
            "overall_accuracy": overall_accuracy,
            "total_questions": total_questions
        }), 200
        
    except Exception as e:
        print(f"Error generating feedback: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": "Failed to generate feedback"
        }), 500

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })

def run_app():
    """Configures and runs the Flask application."""
    # Setup logging
    # ... (logging setup code) ...

    # Define the directory for scores
    scores_dir = "scores"

    port = int(os.environ.get('PORT', 5002))
    app_log.info("🚀 Starting Emotion Recognition Game Backend...")
    app_log.info(f"📁 Scores will be saved to: {os.path.abspath(scores_dir)}")
    app_log.info(f"🌐 Server will run on: http://localhost:{port}")
    app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)

if __name__ == '__main__':
    run_app() 







 