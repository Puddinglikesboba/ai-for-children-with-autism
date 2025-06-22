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
            "get_feedback_all": "GET /get_feedback_all"
        }
    })

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
        
        # Build prompt for Gemini
        prompt = f"""
You are an AI assistant helping a child with autism improve their emotion recognition skills. 
Based on the following game data, provide encouraging and constructive feedback.

Game Statistics:
- Total questions answered: {total_questions}
- Overall accuracy: {overall_accuracy:.1f}%
- Strengths: {', '.join(strengths) if strengths else 'None identified yet'}
- Areas for improvement: {', '.join(weaknesses) if weaknesses else 'None - great job!'}

Detailed performance by emotion:
"""
        
        for emotion, stat in stats.items():
            total = stat["correct"] + stat["wrong"]
            if total > 0:
                accuracy = (stat["correct"] / total) * 100
                prompt += f"- {emotion.capitalize()}: {stat['correct']} correct, {stat['wrong']} incorrect ({accuracy:.1f}% accuracy)\n"
        
        prompt += f"""

Please provide:
1. A warm, encouraging message acknowledging their effort
2. Specific praise for their strengths
3. Gentle suggestions for improving weaker areas
4. Motivational encouragement to keep practicing
5. Keep the tone positive, supportive, and age-appropriate for children with autism

Keep the response under 200 words and make it very encouraging and supportive.
"""
        
        # Call Gemini API
        gemini_api_key = os.getenv('GEMINI_API_KEY')
        if not gemini_api_key:
            # Fallback feedback if no API key
            feedback = f"""
Great job playing the emotion recognition game! You answered {total_questions} questions with {overall_accuracy:.1f}% accuracy overall.

Your strengths: {', '.join(strengths) if strengths else 'You\'re doing well across all emotions!'}
Areas to practice: {', '.join(weaknesses) if weaknesses else 'Keep up the excellent work!'}

Remember, recognizing emotions takes practice, and you're doing wonderfully! Keep playing to improve your skills.
"""
        else:
            try:
                response = requests.post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {gemini_api_key}"
                    },
                    json={
                        "contents": [{
                            "parts": [{"text": prompt}]
                        }]
                    },
                    timeout=10
                )
                
                if response.status_code == 200:
                    result = response.json()
                    feedback = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                    if not feedback:
                        feedback = "Great job playing the emotion recognition game! Keep practicing to improve your skills."
                else:
                    # Fallback if API call fails
                    feedback = f"""
Great job playing the emotion recognition game! You answered {total_questions} questions with {overall_accuracy:.1f}% accuracy overall.

Your strengths: {', '.join(strengths) if strengths else 'You\'re doing well across all emotions!'}
Areas to practice: {', '.join(weaknesses) if weaknesses else 'Keep up the excellent work!'}

Remember, recognizing emotions takes practice, and you're doing wonderfully! Keep playing to improve your skills.
"""
            except Exception as e:
                print(f"Error calling Gemini API: {str(e)}")
                # Fallback feedback
                feedback = f"""
Great job playing the emotion recognition game! You answered {total_questions} questions with {overall_accuracy:.1f}% accuracy overall.

Your strengths: {', '.join(strengths) if strengths else 'You\'re doing well across all emotions!'}
Areas to practice: {', '.join(weaknesses) if weaknesses else 'Keep up the excellent work!'}

Remember, recognizing emotions takes practice, and you're doing wonderfully! Keep playing to improve your skills.
"""
        
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







