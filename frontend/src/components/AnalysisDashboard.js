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
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const EmotionRadarChart = ({ accuracies, emotions }) => {
  const chartData = {
    labels: emotions.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
    datasets: [
      {
        label: 'Healthy-Normal Response',
        data: emotions.map(() => 100),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'User Response (Autistic)',
        data: emotions.map(emotion => accuracies[emotion] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          font: {
            size: 24,
            weight: 'bold',
          },
          color: '#1e293b',
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#1e293b',
          font: {
            size: 16,
            weight: 'bold',
          },
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1e293b',
          font: {
            size: 20,
            weight: 'bold',
          },
          boxWidth: 40,
          boxHeight: 20,
          borderRadius: 4,
          borderWidth: 3,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return <Radar data={chartData} options={options} />;
};

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column (3/5 width) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
          
          {/* Right Column (2/5 width) */}
          <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-lg flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <TrendingUp className="text-purple-600" size={20} />
              Emotion Response Profile
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Comparing user's accuracy (red) against a healthy-normal baseline (blue).
            </p>
            <div
              className="relative flex items-center justify-center"
              style={{ width: '100%', height: '900px', maxWidth: '900px', margin: '0 auto' }}
            >
              <EmotionRadarChart accuracies={data.accuracies} emotions={data.emotions} />
            </div>
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