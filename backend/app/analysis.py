import os
import logging
from typing import Optional
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

# --- Google Gemini Configuration ---
# WARNING: The key below is hardcoded for a quick test.
# This is NOT a safe practice. It is STRONGLY recommended to use a .env file.
# The API key should be read from the GEMINI_API_KEY environment variable.
try:
    # For a quick test, we are temporarily hardcoding the key.
    # The recommended way is: gemini_api_key = os.getenv("GEMINI_API_KEY")
    gemini_api_key = "AIzaSyBhCPJEylbs-E_GmtLa7gF8zUp6LRJoNHA" #
    
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found.")
    genai.configure(api_key=gemini_api_key)
except ValueError as e:
    logger.error(f"Gemini API Key configuration error: {e}")
    genai = None

# --- System Prompt for the Psychologist Agent ---
SYSTEM_PROMPT = (
    "You are a professional child psychologist specializing in sandbox therapy. "
    "Your role is to analyze sandbox scenes created by children, particularly those with autism, "
    "and provide insightful, empathetic, and constructive feedback. Your analysis should be "
    "professional, easy to understand for parents, and focused on the child's emotional state, "
    "creativity, and potential areas of interest or concern. Always maintain a positive and "
    "supportive tone. Respond only with the analysis text, without any introductory or concluding "
    "conversational phrases."
)

def generate_psychological_analysis(
    caption: str, user_id: Optional[str] = None, custom_prompt: Optional[str] = None
) -> str:
    """
    Generate psychological analysis using Google's Gemini API.
    
    Args:
        caption: Sandbox scene description.
        user_id: User ID (optional, for future use).
        custom_prompt: An optional user-provided prompt to guide the analysis.
        
    Returns:
        str: Psychological analysis text from the Gemini model.
    """
    if not genai:
        error_message = "Gemini API client is not configured. Please set the GEMINI_API_KEY in your .env file."
        logger.error(error_message)
        return error_message

    model_name = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-pro-latest")
    
    # Construct the final prompt for the user role
    if custom_prompt:
        user_prompt = f"{custom_prompt}\n\nBased on the instruction above, please provide a psychological analysis for the following sandbox scene: '{caption}'"
        logger.info(f"Using custom prompt for analysis.")
    else:
        user_prompt = f"Please provide a psychological analysis for the following sandbox scene: '{caption}'"
        logger.info(f"Using default prompt for analysis.")

    logger.info(f"Requesting psychological analysis from Gemini model '{model_name}'...")
    
    try:
        # Initialize the model with the system instruction
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=SYSTEM_PROMPT
        )
        
        # Generate content
        response = model.generate_content(user_prompt)
        
        analysis = response.text
        logger.info("Successfully received analysis from Gemini API.")
        return analysis.strip()

    except Exception as e:
        logger.error(f"An unexpected error occurred while communicating with Gemini API: {e}")
        return f"An unexpected error occurred while generating the analysis: {e}"


def analyze_emotion_trend(analysis_history: list) -> dict:
    """
    Analyze emotion trends (future feature).
    
    Args:
        analysis_history: List of historical analysis records.
        
    Returns:
        dict: Emotion trend analysis results.
    """
    # TODO: Implement emotion trend analysis logic
    return {
        "total_sessions": len(analysis_history),
        "emotion_trend": "stable",
        "recommendations": ["Continue observation", "Maintain records"]
    }
