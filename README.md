# Emotion Recognition Game

A full-stack AI-assisted emotion recognition game designed for practicing emotion identification. The game shows AI-generated images and asks users to identify the correct emotion from multiple choice options.

## 🎯 Features

- **Interactive Game Interface** - Clean, responsive design with Tailwind CSS
- **AI-Generated Images** - Fetches emotion images from external API
- **Multiple Choice Questions** - 5 questions per round with randomized options
- **Detailed Results Tracking** - Records each question's correct and selected answers
- **Progress Feedback** - Visual feedback for correct/incorrect answers
- **Round Management** - Multiple rounds with persistent scoring
- **Data Storage** - Saves results as 2D NumPy arrays for analysis

## 🏗️ Architecture

- **Frontend**: React with Tailwind CSS
- **Backend**: Python Flask with CORS support
- **Data Storage**: NumPy files (.npy) for results persistence
- **External API**: Fetches images from `http://nanalab.ai:8080/get_image/<emotion>`

## 🚀 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: http://localhost:3000

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

Backend will run on: http://localhost:5000

## 📁 Project Structure

```
emotion-recognition-game/
├── src/                    # React frontend
│   ├── App.js             # Main game component
│   ├── index.js           # React entry point
│   └── index.css          # Tailwind CSS styles
├── public/                # Static files
│   └── index.html         # HTML template
├── backend/               # Python Flask backend
│   ├── app.py             # Flask application
│   ├── requirements.txt   # Python dependencies
│   └── scores/            # Results storage directory (auto-created)
├── package.json           # Frontend dependencies
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## 🎮 Game Flow

1. **Start Screen** - Click "Start Round" to begin
2. **Question Display** - Shows AI-generated emotion image
3. **Answer Selection** - Choose from 5 emotion options
4. **Feedback** - Visual feedback for correct/incorrect answers
5. **Next Question** - Continue through 5 questions
6. **Round Summary** - Display final score and save to backend
7. **New Round** - Option to start another round

## 🔧 API Endpoints

### Backend Endpoints

- `GET /` - API status and available endpoints
- `POST /save_score_table` - Save detailed round results
  - Request: `{ "round": 1, "results": [{ "correct": "happy", "selected": "sad" }, ...] }`
  - Response: `{ "message": "Saved", "file": "scores/round1_20250621_154500.npy" }`
- `GET /health` - Health check endpoint

### External API

- `GET http://nanalab.ai:8080/get_image/<emotion>` - Fetch emotion images
  - Supported emotions: `happy`, `sad`, `angry`, `surprised`, `neutral`

## 🎨 UI Components

### Game States

- **Start Screen** - Welcome message and start button
- **Playing State** - Question display with image and options
- **Round End** - Score summary and new round option

### Visual Feedback

- **Loading Spinner** - While fetching images
- **Color-coded Buttons** - Green for correct, red for incorrect
- **Progress Indicators** - Current question and score display
- **Error Messages** - API failure notifications

## 📊 Data Storage

Results are saved as 2D NumPy arrays in `.npy` files:

- **Location**: `backend/scores/`
- **Format**: `roundX_YYYYMMDD_HHMMSS.npy`
- **Content**: `[["happy", "sad"], ["angry", "angry"], ...]`

### Example Data Structure

```python
# Load saved results
import numpy as np
data = np.load('scores/round1_20250621_154500.npy')
print(data)
# Output: [['happy' 'sad']
#          ['angry' 'angry']
#          ['surprised' 'neutral']
#          ['sad' 'sad']
#          ['neutral' 'happy']]
```

## 🛠️ Development

### Frontend Development

```bash
# Install Tailwind CSS
npm install -D tailwindcss autoprefixer postcss

# Build for production
npm run build
```

### Backend Development

```bash
# Install development dependencies
pip install -r requirements.txt

# Run with debug mode
python app.py
```

## 🔍 Error Handling

- **API Failures** - Graceful fallback to placeholder images
- **Network Issues** - User-friendly error messages
- **Invalid Data** - Backend validation for results submissions
- **File System** - Automatic creation of scores directory

## 🎯 Customization

### Adding New Emotions

1. Update `emotions` array in `src/App.js`
2. Ensure external API supports new emotion types

### Modifying Game Settings

- **Questions per round**: Change `questionsPerRound` constant
- **UI styling**: Modify Tailwind classes in components
- **Backend port**: Update port in `backend/app.py`

## 📱 Responsive Design

The game is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- Touch-screen devices

## 🔒 Security Considerations

- CORS enabled for local development
- Input validation on backend
- Error handling for API failures
- No sensitive data storage

## 🚀 Deployment

### Frontend Deployment

```bash
npm run build
# Deploy build/ folder to your hosting service
```

### Backend Deployment

```bash
# Install production dependencies
pip install -r requirements.txt

# Run with production server (e.g., gunicorn)
gunicorn app:app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

MIT License - feel free to use and modify!

---

**Note**: The external image API (`http://nanalab.ai:8080`) may not be available. The app includes fallback placeholder images for demonstration purposes.
