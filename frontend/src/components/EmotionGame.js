import React, { useState, useCallback, useEffect } from 'react';
import {
  BarChart2, Circle, CheckCircle, XCircle, AlertTriangle, Loader, Award, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fear', 'disgust'];

const EmotionGame = () => {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'round_end'
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(''); // 'correct', 'incorrect', ''
  const [roundResults, setRoundResults] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const generateQuestion = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setFeedback('');
    setSelectedAnswer(null);

    // Simulate API call with a delay
    setTimeout(() => {
      // Simulate a random failure
      if (Math.random() < 0.15) { // 15% chance to fail
        setError("Failed to load image. Please try again.");
        setIsLoading(false);
        return;
      }

      const correctEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const options = [...emotions].sort(() => 0.5 - Math.random());
      const incorrectOptions = options.filter(e => e !== correctEmotion).slice(0, 3);
      const finalOptions = [...incorrectOptions, correctEmotion].sort(() => 0.5 - Math.random());
      
      setCurrentQuestion({
        imageUrl: null, // Placeholder for your dataset image
        options: finalOptions,
        correctAnswer: correctEmotion,
      });
      setIsLoading(false);
    }, 800);
  }, []);

  const handleStartRound = () => {
    setGameState('playing');
    setScore(0);
    setQuestionCount(0);
    setRoundResults([]);
    generateQuestion();
  };

  const handleAnswer = (selected) => {
    if (feedback) return;

    setSelectedAnswer(selected);
    const isCorrect = selected === currentQuestion.correctAnswer;
    const currentResult = [currentQuestion.correctAnswer, selected];

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    
    setTimeout(() => {
      const nextQuestionCount = questionCount + 1;
      if (nextQuestionCount < 5) {
        setQuestionCount(nextQuestionCount);
        setRoundResults(prev => [...prev, currentResult]);
        generateQuestion();
      } else {
        const finalResults = [...roundResults, currentResult];
        saveRoundResults(finalResults);
        setRoundResults(finalResults);
        setGameState('round_end');
      }
    }, 2000);
  };
  
  const saveRoundResults = async (results) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/save_score_table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ round: currentRound, results: results }),
      });
      if (!response.ok) throw new Error('Backend save failed.');
    } catch (err) {
      console.error('Error saving round results:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextRound = () => {
    setCurrentRound(prev => prev + 1);
    setGameState('start');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-pink-50 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-full"></div>
              <h1 className="text-5xl font-bold text-gray-800">Emotion Recognition Game</h1>
          </div>
          <p className="text-lg text-gray-500 mt-2">Practice identifying emotions with AI-generated images!</p>
          <Link to="/analysis" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-indigo-50 transition-all">
              <BarChart2 size={20} />
              View Progress Summary
          </Link>
      </header>
      
      <main className="w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8">
        
        {/* Game State: Start */}
        {gameState === 'start' && (
          <div className="text-center py-16">
            <Target size={64} className="mx-auto text-indigo-500" />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Ready for Round {currentRound}?</h2>
            <p className="text-gray-600 my-4">You'll be shown 5 images. Identify the correct emotion for each.</p>
            <button onClick={handleStartRound} className="w-1/2 py-4 bg-indigo-600 text-white font-bold text-xl rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105">
              Start
            </button>
          </div>
        )}

        {/* Game State: Playing or Loading */}
        {gameState === 'playing' && (
          <>
            {/* Status Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-gray-700 font-semibold">
                <span>Round: <span className="font-bold text-indigo-600 text-lg">{currentRound}</span></span>
                <span>Question: <span className="font-bold text-indigo-600 text-lg">{questionCount + 1}/5</span></span>
                <span>Score: <span className="font-bold text-green-500 text-lg">{score}</span></span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(questionCount / 5) * 100}%` }}></div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                <AlertTriangle />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Main Content */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">What emotion is this person showing? 🤔</h2>
            </div>
            
            <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-xl shadow-inner flex items-center justify-center border-2 border-dashed border-gray-300">
              {isLoading ? (
                <Loader className="animate-spin text-gray-400" size={48} />
              ) : (
                <span className="text-gray-400 font-semibold">Emotion to identify</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {currentQuestion?.options.map((emotion) => {
                const isSelected = selectedAnswer === emotion;
                const isCorrect = feedback === 'correct' && isSelected;
                const isWrong = feedback === 'incorrect' && isSelected;
                const isActualAnswer = feedback && emotion === currentQuestion.correctAnswer;
                
                let buttonClass = 'bg-white hover:bg-gray-100';
                if (feedback) {
                  if (isCorrect || isActualAnswer) buttonClass = 'bg-green-100 text-green-800 ring-2 ring-green-500';
                  else if (isWrong) buttonClass = 'bg-red-100 text-red-800 ring-2 ring-red-500';
                  else buttonClass = 'bg-gray-100 text-gray-400 cursor-not-allowed';
                }

                return (
                  <button
                    key={emotion}
                    onClick={() => handleAnswer(emotion)}
                    disabled={!!feedback || isLoading}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl text-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed ${buttonClass}`}
                  >
                    {isCorrect && <CheckCircle size={24} />}
                    {isWrong && <XCircle size={24} />}
                    <span className="capitalize">{emotion}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
        
        {/* Game State: Round End */}
        {gameState === 'round_end' && (
          <div className="text-center py-16">
            <Award size={64} className="mx-auto text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Round Complete!</h2>
            <p className="text-xl text-gray-600 mt-2">Your score: <span className="font-bold text-green-500">{score} / 5</span></p>
            <p className="text-6xl font-bold text-indigo-600 my-4">{Math.round((score / 5) * 100)}%</p>
            <button onClick={handleNextRound} disabled={isSubmitting} className="w-1/2 py-4 bg-indigo-600 text-white font-bold text-xl rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400">
              {isSubmitting ? 'Saving...' : `Continue to Round ${currentRound + 1}`}
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default EmotionGame; 