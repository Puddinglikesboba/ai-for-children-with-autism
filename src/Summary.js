import React, { useState, useEffect } from 'react';

function Summary() {
  const [feedback, setFeedback] = useState('');
  const [stats, setStats] = useState({});
  const [overallAccuracy, setOverallAccuracy] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/get_feedback_all');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data = await response.json();
      setFeedback(data.feedback);
      setStats(data.stats || {});
      setOverallAccuracy(data.overall_accuracy || 0);
      setTotalQuestions(data.total_questions || 0);
    } catch (err) {
      setError('Failed to load feedback. Please try again.');
      console.error('Error fetching feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionEmoji = (emotion) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'surprised': return '😲';
      case 'neutral': return '😐';
      default: return '❓';
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBgColor = (accuracy) => {
    if (accuracy >= 80) return 'bg-green-100';
    if (accuracy >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animation-delay-1000"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600">Loading your personalized feedback...</p>
        </div>
      </div>
    );
  }

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
            📊 Your Progress Summary
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personalized feedback and insights from your emotion recognition journey
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center">
              <span className="text-xl mr-3">⚠️</span>
              {error}
              <button
                onClick={fetchFeedback}
                className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Overall Stats Card */}
          {totalQuestions > 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Overall Performance</h2>
                  <p className="text-gray-600">Based on {totalQuestions} questions answered</p>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getAccuracyColor(overallAccuracy)}`}>
                    {overallAccuracy.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Feedback */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">AI Feedback</h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-l-4 border-blue-400">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {feedback}
              </p>
            </div>
          </div>

          {/* Detailed Stats Toggle */}
          {Object.keys(stats).length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                <span>{showStats ? '▼' : '▶'}</span>
                <span>{showStats ? 'Hide' : 'Show'} Detailed Statistics</span>
              </button>
            </div>
          )}

          {/* Detailed Stats Table */}
          {showStats && Object.keys(stats).length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance by Emotion</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600">Emotion</th>
                      <th className="text-center py-3 px-4 text-gray-600">Correct</th>
                      <th className="text-center py-3 px-4 text-gray-600">Incorrect</th>
                      <th className="text-center py-3 px-4 text-gray-600">Accuracy</th>
                      <th className="text-center py-3 px-4 text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats).map(([emotion, stat]) => {
                      const total = stat.correct + stat.wrong;
                      const accuracy = total > 0 ? (stat.correct / total) * 100 : 0;
                      
                      return (
                        <tr key={emotion} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getEmotionEmoji(emotion)}</span>
                              <span className="font-medium text-gray-700 capitalize">{emotion}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-green-600 font-semibold">
                            {stat.correct}
                          </td>
                          <td className="py-3 px-4 text-center text-red-600 font-semibold">
                            {stat.wrong}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-semibold ${getAccuracyColor(accuracy)}`}>
                              {accuracy.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getAccuracyBgColor(accuracy)} ${getAccuracyColor(accuracy)}`}>
                              {accuracy >= 80 ? 'Excellent' : accuracy >= 60 ? 'Good' : 'Needs Practice'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => window.location.href = '/'}
              className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>🎮</span>
                <span>Play Again</span>
              </span>
            </button>
            
            <button
              onClick={fetchFeedback}
              className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-blue-600 bg-blue-50 border-2 border-blue-200 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-100 transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center space-x-2">
                <span>🔄</span>
                <span>Refresh</span>
              </span>
            </button>
          </div>
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

export default Summary; 