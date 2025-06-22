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
import './AnalysisDashboard.css';

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
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(251, 191, 36, 1)',
      },
      {
        label: 'User Response (Autistic)',
        data: emotions.map(emotion => accuracies[emotion] || 0),
        backgroundColor: 'rgba(248, 113, 113, 0.2)',
        borderColor: 'rgba(248, 113, 113, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(248, 113, 113, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(180, 83, 9, 0.1)',
        },
        grid: {
          color: 'rgba(180, 83, 9, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          font: {
            size: 24,
            weight: 'bold',
          },
          color: '#b45309',
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#b45309',
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
          color: '#b45309',
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

  if (loading) {
    return (
      <div className="analysis-dashboard-container">
        <div className="loading-container">
          <Loader className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-dashboard-container">
        <div className="error-container">
          <AlertTriangle className="error-icon" />
          <div className="error-message">Error: {error}</div>
          <button 
            onClick={fetchData}
            className="retry-btn"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="analysis-dashboard-container">
        <div className="no-data-container">
          <Brain className="no-data-icon" />
          <h2 className="no-data-title">No Data Available</h2>
          <p className="no-data-message">Play some emotion recognition games to see your analysis here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <Activity className="title-icon" />
            <div>
              <h1>Emotion Vector Analysis Summary</h1>
              <p className="header-subtitle">
                Comprehensive analysis of your emotion recognition performance
              </p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="refresh-btn"
          >
            <RefreshCw className="btn-icon" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <Target className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Total Questions</span>
            <span className="stat-value">{data.overall_stats.total_questions}</span>
          </div>
        </div>
        <div className="stat-card">
          <Award className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Correct Answers</span>
            <span className="stat-value">{data.overall_stats.total_correct}</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Overall Accuracy</span>
            <span className="stat-value">{data.overall_stats.overall_accuracy.toFixed(1)}%</span>
          </div>
        </div>
        <div className="stat-card">
          <BarChart3 className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Data Points</span>
            <span className="stat-value">{data.data_points}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-content-grid">
        {/* Emotion Matrix */}
        <div className="emotion-matrix">
          <div className="matrix-header">
            <Brain className="header-icon" />
            <h3>Emotion Recognition Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Correct →</th>
                  {data.emotions.map(emotion => (
                    <th key={emotion}>{emotion}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.matrix.map((row, i) => (
                  <tr key={i}>
                    <td className="row-header">{data.emotions[i]}</td>
                    {row.map((cell, j) => (
                      <td 
                        key={j} 
                        className={
                          i === j ? 'correct-cell' : 
                          cell > 0 ? 'confusion-cell' : 'empty-cell'
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="matrix-description">
            Diagonal (yellow) = correct answers, Other cells = confusion patterns
          </p>
        </div>
        
        {/* Radar Chart */}
        <div className="radar-chart-container">
          <div className="radar-header">
            <TrendingUp className="header-icon" />
            <h3>Emotion Response Profile</h3>
          </div>
          <p className="radar-description">
            Comparing user's accuracy (red) against a healthy-normal baseline (yellow).
          </p>
          <div className="radar-chart-wrapper">
            <EmotionRadarChart accuracies={data.accuracies} emotions={data.emotions} />
          </div>
        </div>
      </div>

      {/* Training Recommendations */}
      <div className="recommendations-section">
        <div className="recommendations-header">
          <AlertTriangle className="header-icon" />
          <h3>Training Recommendations</h3>
        </div>
        <div className="recommendations-list">
          {data.emotions.map(emotion => {
            const accuracy = data.accuracies[emotion];
            if (accuracy < 60) {
              return (
                <div key={emotion} className="recommendation-item">
                  <span className="emotion-name">{emotion}:</span> 
                  Your accuracy is <span className="accuracy">{accuracy.toFixed(1)}%</span>. Consider practicing more with {emotion} expressions.
                </div>
              );
            }
            return null;
          })}
          {data.emotions.every(emotion => data.accuracies[emotion] >= 60) && (
            <div className="success-message">
              Great job! All emotions have accuracy above 60%. Keep practicing to maintain your skills!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard; 