#!/usr/bin/env python3
"""
AI Sandbox Psychological Analysis System Startup Script
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🚀 Starting AI Sandbox Psychological Analysis System...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/")
    print("🛑 Press Ctrl+C to stop the service")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 