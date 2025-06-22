#!/usr/bin/env python3
"""
AI Sandbox Psychological Analysis System Startup Script
"""

import uvicorn
import os

if __name__ == "__main__":
    # Get the directory of the current script
    # This ensures we run from the 'backend' directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("🚀 Starting AI Sandbox Psychological Analysis System...")
    print(f"📂 Running from: {script_dir}")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/")
    print("🛑 Press Ctrl+C to stop the service")
    
    # Uvicorn works best with an import string.
    # We specify the app location and enable reload.
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        # Set reload_dirs to ensure it watches the correct directory
        reload_dirs=[os.path.join(script_dir, 'app')]
    ) 