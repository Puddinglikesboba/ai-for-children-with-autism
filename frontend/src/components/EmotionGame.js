import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  Target, 
  TrendingUp, 
  Heart,
  Brain,
  Smile,
  Frown,
  Meh,
  Zap
} from 'lucide-react';
import './EmotionGame.css';

const EmotionGame = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(10);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);

  const emotions = [
    { name: 'happy', emoji: '😊', color: '#10B981', description: 'Happy' },
    { name: 'sad', emoji: '😢', color: '#3B82F6', description: 'Sad' },
    { name: 'angry', emoji: '😠', color: '#EF4444', description: 'Angry' },
    { name: 'surprised', emoji: '😲', color: '#F59E0B', description: 'Surprised' },
    { name: 'fearful', emoji: '😨', color: '#8B5CF6', description: 'Fearful' },
    { name: 'disgusted', emoji: '🤢', color: '#84CC16', description: 'Disgusted' },
    { name: 'neutral', emoji: '😐', color: '#6B7280', description: 'Neutral' }
  ];

  const emotionImages = {
    happy: [
      '/assets/emotions/happy1.jpg',
      '/assets/emotions/happy2.jpg',
      '/assets/emotions/happy3.jpg'
    ],
    sad: [
      '/assets/emotions/sad1.jpg',
      '/assets/emotions/sad2.jpg',
      '/assets/emotions/sad3.jpg'
    ],
    angry: [
      '/assets/emotions/angry1.jpg',
      '/assets/emotions/angry2.jpg',
      '/assets/emotions/angry3.jpg'
    ],
    surprised: [
      '/assets/emotions/surprised1.jpg',
      '/assets/emotions/surprised2.jpg',
      '/assets/emotions/surprised3.jpg'
    ],
    fearful: [
      '/assets/emotions/fearful1.jpg',
      '/assets/emotions/fearful2.jpg',
      '/assets/emotions/fearful3.jpg'
    ],
    disgusted: [
      '/assets/emotions/disgusted1.jpg',
      '/assets/emotions/disgusted2.jpg',
      '/assets/emotions/disgusted3.jpg'
    ],
    neutral: [
      '/assets/emotions/neutral1.jpg',
      '/assets/emotions/neutral2.jpg',
      '/assets/emotions/neutral3.jpg'
    ]
  };

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(30);
    setScore(0);
    setCurrentRound(1);
    setStreak(0);
    setGameHistory([]);
    generateNewQuestion();
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const resumeGame = () => {
    setIsPlaying(true);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setTimeLeft(30);
    setScore(0);
    setCurrentRound(1);
    setStreak(0);
    setGameHistory([]);
    setCurrentEmotion(null);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const generateNewQuestion = () => {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(randomEmotion);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (emotion) => {
    if (showResult) return;
    
    setSelectedAnswer(emotion);
    const correct = emotion.name === currentEmotion.name;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 10 + Math.floor(timeLeft / 3));
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    const roundResult = {
      round: currentRound,
      correctEmotion: currentEmotion.name,
      selectedEmotion: emotion.name,
      correct: correct,
      timeLeft: timeLeft,
      score: correct ? 10 + Math.floor(timeLeft / 3) : 0
    };

    setGameHistory([...gameHistory, roundResult]);

    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound(currentRound + 1);
        generateNewQuestion();
        setShowResult(false);
      } else {
        endGame();
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    setShowResult(true);
    setIsCorrect(false);
    setStreak(0);
    
    const roundResult = {
      round: currentRound,
      correctEmotion: currentEmotion.name,
      selectedEmotion: null,
      correct: false,
      timeLeft: 0,
      score: 0
    };

    setGameHistory([...gameHistory, roundResult]);

    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound(currentRound + 1);
        generateNewQuestion();
        setShowResult(false);
        setTimeLeft(30);
      } else {
        endGame();
      }
    }, 2000);
  };

  const endGame = () => {
    setIsPlaying(false);
    // Here you could send results to backend
    console.log('Game ended with score:', score);
  };

  const getProgressPercentage = () => {
    return (currentRound / totalRounds) * 100;
  };

  const getAccuracy = () => {
    if (gameHistory.length === 0) return 0;
    const correct = gameHistory.filter(result => result.correct).length;
    return Math.round((correct / gameHistory.length) * 100);
  };

  return (
    <div className="emotion-game-container">
      {/* Header */}
      <div className="game-header">
        <div className="header-content">
          <h1 className="game-title">
            <Brain className="title-icon" />
            Emotion Recognition Game
          </h1>
          <p className="game-subtitle">
            Identify emotions in facial expressions to improve your recognition skills
          </p>
        </div>
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        {!isPlaying && currentRound === 1 && (
          <button className="start-btn" onClick={startGame}>
            <Play className="btn-icon" />
            Start Game
          </button>
        )}
        
        {isPlaying && (
          <div className="control-buttons">
            <button className="pause-btn" onClick={pauseGame}>
              <Pause className="btn-icon" />
              Pause
            </button>
          </div>
        )}
        
        {!isPlaying && currentRound > 1 && (
          <div className="control-buttons">
            <button className="resume-btn" onClick={resumeGame}>
              <Play className="btn-icon" />
              Resume
            </button>
            <button className="reset-btn" onClick={resetGame}>
              <RotateCcw className="btn-icon" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Game Stats */}
      <div className="game-stats">
        <div className="stat-card">
          <Target className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Round</span>
            <span className="stat-value">{currentRound}/{totalRounds}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Award className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <TrendingUp className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{getAccuracy()}%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <Zap className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Streak</span>
            <span className="stat-value">{streak}</span>
          </div>
        </div>
        
        {isPlaying && (
          <div className="stat-card timer-card">
            <Heart className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Time</span>
              <span className={`stat-value ${timeLeft <= 10 ? 'time-warning' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.round(getProgressPercentage())}% Complete</span>
      </div>

      {/* Game Area */}
      <div className="game-area">
        {currentEmotion && (
          <>
            {/* Emotion Display */}
            <div className="emotion-display">
              <div className="emotion-image-container">
                <div className="emotion-placeholder">
                  <Smile className="placeholder-icon" />
                  <p>Emotion Image</p>
                </div>
              </div>
              
              {showResult && (
                <div className={`result-overlay ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-content">
                    <span className="result-emoji">
                      {isCorrect ? '🎉' : '😔'}
                    </span>
                    <span className="result-text">
                      {isCorrect ? 'Correct!' : 'Incorrect!'}
                    </span>
                    <span className="correct-answer">
                      The emotion was: {currentEmotion.description}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="answer-options">
              <h3 className="options-title">What emotion is this?</h3>
              <div className="options-grid">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.name}
                    className={`option-btn ${
                      selectedAnswer?.name === emotion.name ? 'selected' : ''
                    } ${
                      showResult && emotion.name === currentEmotion.name ? 'correct-answer' : ''
                    } ${
                      showResult && selectedAnswer?.name === emotion.name && emotion.name !== currentEmotion.name ? 'incorrect-answer' : ''
                    }`}
                    onClick={() => handleAnswerSelect(emotion)}
                    disabled={showResult}
                    style={{
                      '--emotion-color': emotion.color
                    }}
                  >
                    <span className="option-emoji">{emotion.emoji}</span>
                    <span className="option-text">{emotion.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Game Complete */}
        {currentRound > totalRounds && (
          <div className="game-complete">
            <div className="complete-content">
              <Award className="complete-icon" />
              <h2 className="complete-title">Game Complete!</h2>
              <p className="complete-score">Final Score: {score}</p>
              <p className="complete-accuracy">Accuracy: {getAccuracy()}%</p>
              <button className="play-again-btn" onClick={resetGame}>
                <RotateCcw className="btn-icon" />
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Game History */}
      {gameHistory.length > 0 && (
        <div className="game-history">
          <h3 className="history-title">Recent Rounds</h3>
          <div className="history-list">
            {gameHistory.slice(-5).map((result, index) => (
              <div key={index} className={`history-item ${result.correct ? 'correct' : 'incorrect'}`}>
                <span className="history-round">Round {result.round}</span>
                <span className="history-result">
                  {result.correct ? '✓' : '✗'} {result.correctEmotion}
                </span>
                <span className="history-score">+{result.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionGame; 