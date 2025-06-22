#!/usr/bin/env python3
"""
Test script for sandbox analysis functionality
"""

import requests
import json
import base64
from PIL import Image
import io

def create_test_image():
    """Create a simple test image"""
    # Create a simple 100x100 image with a colored background
    img = Image.new('RGB', (100, 100), color='#f4e4bc')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def test_sandbox_analysis():
    """Test the sandbox analysis endpoint"""
    url = "http://localhost:8000/analyze_sandbox/"
    
    # Create test image
    test_image = create_test_image()
    
    # Test data
    test_items = [
        {
            "id": "people-5-1750609106717",
            "name": "Person 5", 
            "image": "/assets/item/people/5.png",
            "x": 575.078125,
            "y": 240.2265625,
            "size": 50
        }
    ]
    
    # Prepare form data
    files = {'file': ('test_sandbox.png', test_image, 'image/png')}
    data = {
        'user_id': 'test-user-123',
        'placed_items': json.dumps(test_items)
    }
    
    try:
        print("Testing sandbox analysis endpoint...")
        response = requests.post(url, files=files, data=data, timeout=60)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Analysis successful!")
            print(f"Caption: {result.get('caption', 'N/A')}")
            print(f"Analysis: {result.get('analysis', 'N/A')}")
            print(f"Timestamp: {result.get('timestamp', 'N/A')}")
        else:
            print(f"❌ Analysis failed: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://localhost:8000/")
        print(f"Health check status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Backend is healthy!")
        else:
            print("❌ Backend health check failed")
    except Exception as e:
        print(f"❌ Health check failed: {e}")

if __name__ == "__main__":
    print("=== Sandbox Analysis Test ===")
    test_health_check()
    print("\n--- Testing Analysis Endpoint ---")
    test_sandbox_analysis() 