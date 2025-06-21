import React, { useState } from 'react';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [roundResults, setRoundResults] = useState([]); // Track each question result

  const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral'];
  const questionsPerRound = 5;

  // Generate random options including the correct answer
  const generateOptions = (correctEmotion) => {
    const otherEmotions = emotions.filter(emotion => emotion !== correctEmotion);
    const shuffledOthers = otherEmotions.sort(() => Math.random() - 0.5).slice(0, 4);
    const allOptions = [...shuffledOthers, correctEmotion];
    return allOptions.sort(() => Math.random() - 0.5);
  };

  // Start a new round
  const startRound = () => {
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setError('');
    setShowResults(false);
    setRoundResults([]); // Reset round results
    generateNewQuestion();
  };

  // Generate a new question
  const generateNewQuestion = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Randomly select an emotion
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setCurrentEmotion(randomEmotion);
      
      // Fetch image from API
      const imageResponse = await fetch(`http://nanalab.ai:8080/get_image/${randomEmotion}`);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image');
      }
      
      // For demo purposes, we'll use a placeholder image since the API might not be available
      // In production, you would use: setImageUrl(imageResponse.url);
      setImageUrl(`https://via.placeholder.com/400x300/0ea5e9/ffffff?text=${randomEmotion}`);
      
      // Generate options
      const questionOptions = generateOptions(randomEmotion);
      setOptions(questionOptions);
      
    } catch (err) {
      setError('Failed to load image. Please try again.');
      console.error('Error generating question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (selectedEmotion) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(selectedEmotion);
    const correct = selectedEmotion === currentEmotion;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    // Save this question's result
    const questionResult = {
      correct: currentEmotion,
      selected: selectedEmotion
    };
    setRoundResults(prev => [...prev, questionResult]);
  };

  // Move to next question
  const nextQuestion = () => {
    const nextQuestionIndex = currentQuestion + 1;
    
    if (nextQuestionIndex >= questionsPerRound) {
      // Round finished
      endRound();
    } else {
      // Move to next question
      setCurrentQuestion(nextQuestionIndex);
      setSelectedAnswer(null);
      setIsCorrect(null);
      generateNewQuestion();
    }
  };

  // End the round
  const endRound = async () => {
    setShowResults(true);
    
    // Save detailed results to backend
    try {
      const response = await fetch('/save_score_table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          round: currentRound,
          results: roundResults
        })
      });
      
      if (!response.ok) {
        console.error('Failed to save detailed results');
        setError('Failed to save results to server');
      } else {
        console.log('Detailed results saved successfully');
      }
    } catch (err) {
      console.error('Error saving detailed results:', err);
      setError('Failed to save results to server');
    }
  };

  // Start a new round
  const startNewRound = () => {
    setCurrentRound(prev => prev + 1);
    setShowResults(false);
    startRound();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            😊 Emotion Recognition Game
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice identifying emotions with AI-generated images! 
            {!gameStarted && " Click the start button below to begin your journey."}
          </p>
        </div>

        {/* Game Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Game Stats */}
          {gameStarted && !showResults && (
            <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Round</p>
                  <p className="text-2xl font-bold text-blue-600">{currentRound}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Question</p>
                  <p className="text-2xl font-bold text-purple-600">{currentQuestion + 1}/{questionsPerRound}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-2xl font-bold text-green-600">{score}</p>
                </div>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questionsPerRound) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Start Button */}
          {!gameStarted && (
            <div className="text-center py-16">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <span className="text-6xl">🎮</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Play?</h2>
                <p className="text-gray-600 mb-8">Test your emotion recognition skills with 5 questions per round!</p>
              </div>
              <button
                onClick={startRound}
                className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Start Game</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}

          {/* Results Screen */}
          {showResults && (
            <div className="text-center py-16">
              <div className="mb-8">
                <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center shadow-2xl ${
                  score >= 4 ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 
                  score >= 2 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 
                  'bg-gradient-to-br from-red-400 to-pink-500'
                }`}>
                  <span className="text-6xl">
                    {score >= 4 ? '🎉' : score >= 2 ? '👍' : '💪'}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Round Complete!</h2>
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {score}/{questionsPerRound}
                </div>
                <p className="text-gray-600 mb-8">
                  {score >= 4 ? 'Excellent! You\'re amazing at recognizing emotions!' :
                   score >= 2 ? 'Good job! Keep practicing to improve!' :
                   'Great effort! Practice makes perfect!'}
                </p>

                {/* Detailed Results Table */}
                <div className="mt-8 bg-gray-50 rounded-2xl p-6 max-w-2xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Question Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-gray-600">Question</th>
                          <th className="text-left py-2 px-3 text-gray-600">Correct</th>
                          <th className="text-left py-2 px-3 text-gray-600">Your Answer</th>
                          <th className="text-center py-2 px-3 text-gray-600">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roundResults.map((result, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 px-3 text-gray-700">{index + 1}</td>
                            <td className="py-2 px-3 text-gray-700 capitalize">{result.correct}</td>
                            <td className="py-2 px-3 text-gray-700 capitalize">{result.selected}</td>
                            <td className="py-2 px-3 text-center">
                              {result.correct === result.selected ? (
                                <span className="text-green-600 font-semibold">✅</span>
                              ) : (
                                <span className="text-red-600 font-semibold">❌</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <button
                onClick={startNewRound}
                className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <span>🔄</span>
                  <span>Play Again</span>
                </span>
              </button>
            </div>
          )}

          {/* Game Content */}
          {gameStarted && !showResults && (
            <>
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center">
                  <span className="text-xl mr-3">⚠️</span>
                  {error}
                </div>
              )}

              {/* Image Display */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  What emotion is this person showing? 🤔
                </h2>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-80">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animation-delay-1000"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="relative group">
                      <img
                        src={imageUrl}
                        alt="Emotion to identify"
                        className="max-w-full h-80 object-contain rounded-2xl shadow-2xl border-4 border-white transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((emotion, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(emotion)}
                    disabled={selectedAnswer !== null || isLoading}
                    className={`
                      group relative p-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105
                      ${selectedAnswer === null
                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 text-gray-800 shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300'
                        : selectedAnswer === emotion
                        ? emotion === currentEmotion
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl scale-105'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl scale-105'
                        : emotion === currentEmotion
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl scale-105'
                        : 'bg-gray-100 text-gray-400 shadow-md'
                      }
                      ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <span className="flex items-center justify-center space-x-3">
                      <span className="text-2xl">
                        {emotion === 'happy' ? '😊' : 
                         emotion === 'sad' ? '😢' : 
                         emotion === 'angry' ? '😠' : 
                         emotion === 'surprised' ? '😲' : '😐'}
                      </span>
                      <span>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {selectedAnswer !== null && (
                <div className="mt-8 text-center">
                  <div className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl text-xl font-semibold ${
                    isCorrect 
                      ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                      : 'bg-red-100 text-red-700 border-2 border-red-300'
                  }`}>
                    <span className="text-2xl">
                      {isCorrect ? '✅' : '❌'}
                    </span>
                    <span>
                      {isCorrect ? 'Correct!' : `Incorrect. The correct answer was: ${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`}
                    </span>
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    className="mt-6 group relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center space-x-2">
                      <span>{currentQuestion + 1 >= questionsPerRound ? '🏁' : '➡️'}</span>
                      <span>{currentQuestion + 1 >= questionsPerRound ? 'Finish Round' : 'Next Question'}</span>
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}

export default App; 