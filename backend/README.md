# AI Sandbox Psychological Analysis System

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://github.com/YOUR_USERNAME/ai-sandbox-psychological-analysis/workflows/Test%20AI%20Sandbox%20System/badge.svg)](https://github.com/YOUR_USERNAME/ai-sandbox-psychological-analysis/actions)

AI-assisted system backend for emotion recognition and psychological sandbox interaction for children with autism.

## 🎯 Project Features

1. **Image Recognition**: Analyze uploaded sandbox photos and generate scene descriptions
2. **Psychological Analysis**: Generate professional psychological analysis reports based on scene descriptions
3. **Data Management**: Record analysis history and support emotion trend statistics

## 🚀 Quick Start

### Requirements

- Python 3.8+
- pip

### Installation Steps

1. **Clone the project**
```bash
git clone https://github.com/YOUR_USERNAME/ai-sandbox-psychological-analysis.git
cd ai-sandbox-psychological-analysis/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Start the service**
```bash
cd app
python main.py
```

Or using uvicorn:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Access the Service

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/
- **Sandbox Analysis**: http://localhost:8000/analyze_sandbox/

## 📡 API Usage

### Health Check

```bash
curl http://localhost:8000/
```

Response example:
```json
{
  "status": "healthy",
  "message": "AI Sandbox Psychological Analysis System is running normally",
  "timestamp": "2024-01-01T12:00:00"
}
```

### Sandbox Analysis

```bash
curl -X POST "http://localhost:8000/analyze_sandbox/" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sandbox_photo.jpg" \
  -F "user_id=user123"
```

Response example:
```json
{
  "caption": "A tree in the middle of the sandbox with small figures around it",
  "analysis": "As a professional child psychologist, I observe that this sandbox scene demonstrates the child's rich inner world expression...",
  "timestamp": "2024-01-01T12:00:00",
  "user_id": "user123"
}
```

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI application entry
│   ├── models.py        # Pydantic data models
│   ├── caption.py       # Image recognition module
│   └── analysis.py      # Psychological analysis module
├── requirements.txt     # Project dependencies
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

## 🔧 Development Notes

### Current Implementation

- ✅ FastAPI basic framework
- ✅ Image upload and validation
- ✅ Mock image recognition (returns fixed descriptions)
- ✅ Mock psychological analysis (uses templates)
- ✅ Health check endpoint
- ✅ Error handling and logging

### Future Features

- 🔄 Integrate real image recognition models (BLIP2, Gemini Vision)
- 🔄 Integrate real GPT models (OpenAI GPT-4, Gemini)
- 🔄 Database integration (SQLite/MongoDB)
- 🔄 User authentication and authorization
- 🔄 Emotion trend analysis
- 🔄 Data persistence

## 🧪 Testing

### Using curl

1. **Health Check**
```bash
curl http://localhost:8000/
```

2. **Upload Image for Analysis**
```bash
curl -X POST "http://localhost:8000/analyze_sandbox/" \
  -F "file=@test_image.jpg"
```

### Using Python

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

## 🔒 Security Notes

- Current version is for development and testing
- Image file size limited to 10MB
- Supported file formats: JPEG, PNG
- Recommend adding user authentication and access control in production

## 📝 Changelog

### v1.0.0
- Initial version release
- Basic FastAPI framework
- Mock image recognition and psychological analysis
- Health check and error handling

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- Pydantic for data validation
- The open source community for inspiration and tools

## 📞 Support

If you have any questions or need help, please:
- Open an [Issue](https://github.com/YOUR_USERNAME/ai-sandbox-psychological-analysis/issues)
- Check the [Documentation](TESTING.md)
- Review the [API Documentation](http://localhost:8000/docs) when running locally 