#!/usr/bin/env python3
"""
Demo script for AI Sandbox Psychological Analysis System
This script demonstrates the system functionality with mock data
"""

import json
from datetime import datetime

def demo_health_check():
    """Demonstrate health check response"""
    print("🔍 Health Check Demo")
    print("=" * 50)
    
    health_response = {
        "status": "healthy",
        "message": "AI Sandbox Psychological Analysis System is running normally",
        "timestamp": datetime.now().isoformat()
    }
    
    print("GET /")
    print("Response:")
    print(json.dumps(health_response, indent=2))
    print()

def demo_sandbox_analysis():
    """Demonstrate sandbox analysis response"""
    print("🔍 Sandbox Analysis Demo")
    print("=" * 50)
    
    # Mock analysis response
    analysis_response = {
        "caption": "A tree in the middle of the sandbox with small figures around it",
        "analysis": """As a professional child psychologist, I observe that this sandbox scene demonstrates the child's rich inner world expression.

Scene Description: A tree in the middle of the sandbox with small figures around it

Psychological Analysis:
1. **Spatial Layout**: The child chose to place the main elements in the center of the sandbox, indicating a strong egocentric consciousness, which is normal for their developmental stage.

2. **Emotional Expression**: Through the warm scene arrangement, the child may be expressing a desire or experience for family.

3. **Development Recommendations**:
   - Encourage the child to share thoughts and feelings during the creative process
   - Observe the child's preferences and choices for different elements
   - Promote language expression and emotional communication through sandbox play

4. **Positive Observations**: The child's creativity and imagination are well demonstrated, and it's recommended to maintain this open form of expression.

Please remember that each child is a unique individual, and this analysis is for reference only. Specific interpretation should be combined with the child's specific situation and background.""",
        "timestamp": datetime.now().isoformat(),
        "user_id": "demo_user_123"
    }
    
    print("POST /analyze_sandbox/")
    print("Request: Upload image file + user_id")
    print("Response:")
    print(json.dumps(analysis_response, indent=2))
    print()

def demo_error_handling():
    """Demonstrate error handling"""
    print("🔍 Error Handling Demo")
    print("=" * 50)
    
    # Invalid file type error
    invalid_file_error = {
        "error": "Only image file formats (JPEG, PNG) are supported",
        "message": "Request processing failed",
        "timestamp": datetime.now().isoformat()
    }
    
    print("POST /analyze_sandbox/ (with invalid file)")
    print("Response (400 Bad Request):")
    print(json.dumps(invalid_file_error, indent=2))
    print()
    
    # File too large error
    large_file_error = {
        "error": "Invalid image format or file too large (max 10MB)",
        "message": "Request processing failed",
        "timestamp": datetime.now().isoformat()
    }
    
    print("POST /analyze_sandbox/ (with large file)")
    print("Response (400 Bad Request):")
    print(json.dumps(large_file_error, indent=2))
    print()

def demo_api_endpoints():
    """Show available API endpoints"""
    print("🔍 Available API Endpoints")
    print("=" * 50)
    
    endpoints = [
        {
            "method": "GET",
            "path": "/",
            "description": "Health check endpoint",
            "response": "Health status and system information"
        },
        {
            "method": "POST",
            "path": "/analyze_sandbox/",
            "description": "Analyze sandbox scene",
            "request": "multipart/form-data with image file",
            "response": "Scene caption and psychological analysis"
        },
        {
            "method": "GET",
            "path": "/docs",
            "description": "Interactive API documentation",
            "response": "Swagger UI interface"
        },
        {
            "method": "GET",
            "path": "/redoc",
            "description": "Alternative API documentation",
            "response": "ReDoc interface"
        }
    ]
    
    for endpoint in endpoints:
        print(f"{endpoint['method']} {endpoint['path']}")
        print(f"  Description: {endpoint['description']}")
        if 'request' in endpoint:
            print(f"  Request: {endpoint['request']}")
        print(f"  Response: {endpoint['response']}")
        print()

def demo_mock_functions():
    """Show mock function outputs"""
    print("🔍 Mock Function Examples")
    print("=" * 50)
    
    # Mock captions
    captions = [
        "A tree in the middle of the sandbox with small figures around it",
        "A house made of blocks with a path leading to it",
        "Several animals arranged in a circle formation",
        "A bridge connecting two areas of the sandbox",
        "A castle with towers and a moat"
    ]
    
    print("Image Caption Examples:")
    for i, caption in enumerate(captions, 1):
        print(f"  {i}. {caption}")
    print()
    
    # Mock analysis types
    analysis_types = [
        "Spatial Layout Analysis",
        "Emotional Expression Analysis", 
        "Developmental Psychology Analysis",
        "Symbolic Meaning Interpretation",
        "Parent Guidance Recommendations"
    ]
    
    print("Psychological Analysis Components:")
    for i, analysis_type in enumerate(analysis_types, 1):
        print(f"  {i}. {analysis_type}")
    print()

def main():
    """Main demo function"""
    print("🚀 AI Sandbox Psychological Analysis System Demo")
    print("=" * 60)
    print("This demo shows the expected behavior of the system")
    print("All responses are in English as requested")
    print()
    
    demo_health_check()
    demo_sandbox_analysis()
    demo_error_handling()
    demo_api_endpoints()
    demo_mock_functions()
    
    print("🎯 Next Steps for Testing:")
    print("1. Install Python 3.8+")
    print("2. Install dependencies: pip install -r requirements.txt")
    print("3. Run tests: python test_setup.py")
    print("4. Start server: python run.py")
    print("5. Access API docs: http://localhost:8000/docs")
    print()
    print("📖 For detailed testing instructions, see TESTING.md")
    print("📚 For project documentation, see README.md")

if __name__ == "__main__":
    main() 