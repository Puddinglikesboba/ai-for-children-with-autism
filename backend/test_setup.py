#!/usr/bin/env python3
"""
Test script to validate the AI Sandbox Psychological Analysis System
This script checks the project structure and validates code syntax
"""

import sys
import os
import importlib.util
from pathlib import Path

def test_project_structure():
    """Test if all required files exist"""
    print("🔍 Testing project structure...")
    
    required_files = [
        "requirements.txt",
        "README.md",
        ".gitignore",
        "run.py",
        "app/__init__.py",
        "app/main.py",
        "app/models.py",
        "app/caption.py",
        "app/analysis.py"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
        else:
            print(f"✅ {file_path}")
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    
    print("✅ All required files exist!")
    return True

def test_imports():
    """Test if all modules can be imported"""
    print("\n🔍 Testing module imports...")
    
    try:
        # Test importing models
        from app.models import AnalysisResult, HealthCheck, ErrorResponse
        print("✅ app.models imported successfully")
        
        # Test importing caption
        from app.caption import generate_caption, validate_image
        print("✅ app.caption imported successfully")
        
        # Test importing analysis
        from app.analysis import generate_psychological_analysis
        print("✅ app.analysis imported successfully")
        
        # Test importing main app
        from app.main import app
        print("✅ app.main imported successfully")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_mock_functions():
    """Test mock functions with sample data"""
    print("\n🔍 Testing mock functions...")
    
    try:
        from app.caption import generate_caption, validate_image
        from app.analysis import generate_psychological_analysis
        
        # Test image validation
        test_image_bytes = b"fake_image_data"
        is_valid = validate_image(test_image_bytes)
        print(f"✅ Image validation test: {is_valid}")
        
        # Test caption generation
        caption = generate_caption(test_image_bytes)
        print(f"✅ Caption generation test: {caption[:50]}...")
        
        # Test psychological analysis
        analysis = generate_psychological_analysis(caption)
        print(f"✅ Analysis generation test: {analysis[:50]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Function test error: {e}")
        return False

def test_pydantic_models():
    """Test Pydantic model creation"""
    print("\n🔍 Testing Pydantic models...")
    
    try:
        from app.models import AnalysisResult, HealthCheck, ErrorResponse
        from datetime import datetime
        
        # Test HealthCheck model
        health_check = HealthCheck(
            status="healthy",
            message="Test message",
            timestamp=datetime.now()
        )
        print("✅ HealthCheck model created successfully")
        
        # Test AnalysisResult model
        analysis_result = AnalysisResult(
            caption="Test caption",
            analysis="Test analysis",
            timestamp=datetime.now(),
            user_id="test_user"
        )
        print("✅ AnalysisResult model created successfully")
        
        # Test ErrorResponse model
        error_response = ErrorResponse(
            error="Test error",
            message="Test error message",
            timestamp=datetime.now()
        )
        print("✅ ErrorResponse model created successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Pydantic model test error: {e}")
        return False

def create_test_image():
    """Create a simple test image for testing"""
    print("\n🔍 Creating test image...")
    
    try:
        from PIL import Image, ImageDraw
        
        # Create a simple test image
        img = Image.new('RGB', (100, 100), color='white')
        draw = ImageDraw.Draw(img)
        draw.rectangle([20, 20, 80, 80], outline='black', width=2)
        draw.text((30, 45), "TEST", fill='black')
        
        # Save test image
        test_image_path = "test_image.jpg"
        img.save(test_image_path)
        print(f"✅ Test image created: {test_image_path}")
        
        return test_image_path
        
    except ImportError:
        print("⚠️  PIL not available, skipping test image creation")
        return None
    except Exception as e:
        print(f"❌ Test image creation error: {e}")
        return None

def main():
    """Main test function"""
    print("🚀 Starting AI Sandbox Psychological Analysis System Tests\n")
    
    tests = [
        ("Project Structure", test_project_structure),
        ("Module Imports", test_imports),
        ("Pydantic Models", test_pydantic_models),
        ("Mock Functions", test_mock_functions),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running: {test_name}")
        print('='*50)
        
        if test_func():
            passed += 1
            print(f"✅ {test_name} PASSED")
        else:
            print(f"❌ {test_name} FAILED")
    
    # Create test image if possible
    test_image_path = create_test_image()
    
    print(f"\n{'='*50}")
    print(f"TEST SUMMARY: {passed}/{total} tests passed")
    print('='*50)
    
    if passed == total:
        print("🎉 All tests passed! The system is ready for deployment.")
        if test_image_path:
            print(f"📸 Test image available: {test_image_path}")
        print("\n📋 Next steps:")
        print("1. Install Python 3.8+ if not already installed")
        print("2. Install dependencies: pip install -r requirements.txt")
        print("3. Start the server: python run.py")
        print("4. Access API docs: http://localhost:8000/docs")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 