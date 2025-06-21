# Testing Guide for AI Sandbox Psychological Analysis System

This guide explains how to test the AI Sandbox Psychological Analysis System.

## 🚀 Quick Test (Without Python Installation)

Since Python is not installed in the current environment, we can still validate the project structure and code quality.

### 1. Project Structure Validation

The project has been created with the following structure:
```
backend/
├── app/
│   ├── __init__.py      # Python package initialization
│   ├── main.py          # FastAPI application
│   ├── models.py        # Pydantic data models
│   ├── caption.py       # Image recognition module
│   └── analysis.py      # Psychological analysis module
├── requirements.txt     # Dependencies
├── .gitignore          # Git ignore rules
├── README.md           # Project documentation
├── run.py              # Startup script
├── test_setup.py       # Test script
└── TESTING.md          # This file
```

### 2. Code Quality Check

All files have been created with:
- ✅ Proper English documentation
- ✅ Type hints and docstrings
- ✅ Error handling
- ✅ Modular design
- ✅ FastAPI best practices

## 🐍 Full Testing (With Python Installation)

### Prerequisites

1. **Install Python 3.8+**
   ```bash
   # On macOS with Homebrew
   brew install python
   
   # On Ubuntu/Debian
   sudo apt update
   sudo apt install python3 python3-pip
   
   # On Windows
   # Download from https://python.org
   ```

2. **Create Virtual Environment**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate     # Windows
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running Tests

1. **Run Structure Tests**
   ```bash
   python test_setup.py
   ```

2. **Start the Server**
   ```bash
   python run.py
   ```

3. **Access API Documentation**
   - Open: http://localhost:8000/docs
   - Interactive API documentation with Swagger UI

### Manual Testing

#### 1. Health Check
```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "status": "healthy",
  "message": "AI Sandbox Psychological Analysis System is running normally",
  "timestamp": "2024-01-01T12:00:00"
}
```

#### 2. Sandbox Analysis
```bash
curl -X POST "http://localhost:8000/analyze_sandbox/" \
  -F "file=@test_image.jpg" \
  -F "user_id=test_user"
```

Expected response:
```json
{
  "caption": "A tree in the middle of the sandbox with small figures around it",
  "analysis": "As a professional child psychologist, I observe that this sandbox scene...",
  "timestamp": "2024-01-01T12:00:00",
  "user_id": "test_user"
}
```

#### 3. Python Client Test
```python
import requests

# Health check
response = requests.get("http://localhost:8000/")
print(response.json())

# Sandbox analysis
with open("test_image.jpg", "rb") as f:
    files = {"file": f}
    data = {"user_id": "test_user"}
    response = requests.post("http://localhost:8000/analyze_sandbox/", 
                           files=files, data=data)
    print(response.json())
```

## 🧪 Test Scenarios

### 1. Valid Image Upload
- Upload JPEG/PNG image
- Verify caption generation
- Verify psychological analysis
- Check response format

### 2. Invalid File Types
- Upload non-image files
- Verify error handling
- Check error response format

### 3. Large Files
- Upload files > 10MB
- Verify size validation
- Check error messages

### 4. Missing Files
- Submit without file
- Verify validation
- Check error handling

### 5. Optional Parameters
- Test with/without user_id
- Verify optional field handling

## 🔍 Expected Behaviors

### Mock Functions
- **Image Caption**: Returns one of 10 predefined sandbox descriptions
- **Psychological Analysis**: Returns professional analysis in English
- **Image Validation**: Accepts JPEG/PNG, rejects others, size limit 10MB

### API Responses
- **Success**: 200 status with JSON response
- **Validation Error**: 400 status with error details
- **Server Error**: 500 status with error message

### Data Models
- **AnalysisResult**: Contains caption, analysis, timestamp, user_id
- **HealthCheck**: Contains status, message, timestamp
- **ErrorResponse**: Contains error, message, timestamp

## 🚨 Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure all dependencies are installed
   - Check Python version (3.8+)
   - Verify virtual environment activation

2. **Port Already in Use**
   - Change port in run.py
   - Kill existing process: `lsof -ti:8000 | xargs kill`

3. **File Permission Issues**
   - Check file permissions
   - Ensure write access to current directory

4. **Image Processing Errors**
   - Verify PIL/Pillow installation
   - Check image file format

### Debug Mode

Enable debug logging:
```python
# In main.py
logging.basicConfig(level=logging.DEBUG)
```

## 📊 Performance Testing

### Load Testing
```bash
# Install Apache Bench
sudo apt install apache2-utils  # Ubuntu
brew install httpd              # macOS

# Test health endpoint
ab -n 100 -c 10 http://localhost:8000/

# Test analysis endpoint (requires test image)
ab -n 50 -c 5 -p test_data.txt -T multipart/form-data http://localhost:8000/analyze_sandbox/
```

### Memory Usage
```bash
# Monitor memory usage
ps aux | grep python
```

## ✅ Success Criteria

The system is working correctly if:

1. ✅ All tests pass in test_setup.py
2. ✅ Server starts without errors
3. ✅ Health check returns 200 status
4. ✅ Image upload and analysis works
5. ✅ Error handling works for invalid inputs
6. ✅ API documentation is accessible
7. ✅ All responses are in English
8. ✅ Mock functions return expected data

## 🎯 Next Steps

After successful testing:

1. **Deploy to Production**
   - Set up proper web server (nginx)
   - Configure SSL certificates
   - Set up monitoring

2. **Integrate Real AI Models**
   - Replace mock caption with BLIP2/Gemini Vision
   - Replace mock analysis with GPT-4/Gemini
   - Add model performance monitoring

3. **Add Database**
   - Set up SQLite/MongoDB
   - Implement data persistence
   - Add user management

4. **Enhance Security**
   - Add authentication
   - Implement rate limiting
   - Add input validation 