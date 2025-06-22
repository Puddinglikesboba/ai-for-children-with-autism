import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Loader, 
  RefreshCw,
  Activity,
  Brain,
  Award
} from 'lucide-react';

const AnalysisDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/emotion_summary');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader className="animate-spin text-blue-600" size={48} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} />
              <span>Error: {error}</span>
            </div>
            <button 
              onClick={fetchData}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <Brain size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600">No Data Available</h2>
            <p className="text-gray-500 mt-2">Play some emotion recognition games to see your analysis here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Activity className="text-blue-600" />
                Emotion Vector Analysis Summary
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive analysis of your emotion recognition performance
              </p>
            </div>
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <Target className="text-blue-600" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Total Questions</p>
                <p className="text-2xl font-bold text-gray-800">{data.overall_stats.total_questions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <Award className="text-green-600" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Correct Answers</p>
                <p className="text-2xl font-bold text-gray-800">{data.overall_stats.total_correct}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-purple-600" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Overall Accuracy</p>
                <p className="text-2xl font-bold text-gray-800">{data.overall_stats.overall_accuracy.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-orange-600" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Data Points</p>
                <p className="text-2xl font-bold text-gray-800">{data.data_points}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emotion Matrix Heatmap */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="text-blue-600" size={20} />
              Emotion Recognition Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Correct →</th>
                    {data.emotions.map(emotion => (
                      <th key={emotion} className="p-2 text-center text-xs">
                        {emotion}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.matrix.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium text-xs">{data.emotions[i]}</td>
                      {row.map((cell, j) => (
                        <td 
                          key={j} 
                          className={`p-2 text-center text-xs ${
                            i === j ? 'bg-green-100 font-bold' : 
                            cell > 0 ? 'bg-yellow-100' : 'bg-gray-50'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Diagonal (green) = correct answers, Other cells = confusion patterns
            </p>
          </div>

          {/* Direction Vector Radar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-purple-600" size={20} />
              Direction Vector Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Base Vector (V0)</h4>
                <div className="flex flex-wrap gap-2">
                  {data.base_vector.map((value, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {data.emotions[i]}: {value}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">User Direction Vector (V_user)</h4>
                <div className="flex flex-wrap gap-2">
                  {data.user_direction_vector.map((value, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                      {data.emotions[i]}: {value.toFixed(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accuracy Analysis */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="text-green-600" size={20} />
            Emotion Accuracy Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.emotions.map(emotion => {
              const accuracy = data.accuracies[emotion];
              const total = data.totals[emotion];
              const correct = data.corrects[emotion];
              const needsTraining = accuracy < 60;
              
              return (
                <div key={emotion} className={`rounded-lg p-4 ${getAccuracyBgColor(accuracy)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize">{emotion}</h4>
                    {needsTraining && <AlertTriangle className="text-red-600" size={16} />}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-2xl font-bold ${getAccuracyColor(accuracy)}`}>
                      {accuracy.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {correct}/{total} correct
                    </p>
                    {needsTraining && (
                      <p className="text-xs text-red-600 font-medium">
                        Needs training
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Training Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={20} />
            Training Recommendations
          </h3>
          <div className="space-y-2">
            {data.emotions.map(emotion => {
              const accuracy = data.accuracies[emotion];
              if (accuracy < 60) {
                return (
                  <p key={emotion} className="text-gray-700">
                    <span className="font-semibold capitalize">{emotion}:</span> 
                    Your accuracy is {accuracy.toFixed(1)}%. Consider practicing more with {emotion} expressions.
                  </p>
                );
              }
              return null;
            })}
            {data.emotions.every(emotion => data.accuracies[emotion] >= 60) && (
              <p className="text-green-700 font-medium">
                Great job! All emotions have accuracy above 60%. Keep practicing to maintain your skills!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard; 