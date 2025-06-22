import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import './Sidebar.css';
import Home from './components/Home';
import EmotionGame from './components/EmotionGame';
import Sandbox from './components/Sandbox';
import AnalysisDashboard from './components/AnalysisDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="sidebar">
          <h2>Navigation</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/emotion-game">Emotion Game</Link></li>
            <li><Link to="/sandbox">Sandbox Interaction</Link></li>
            <li><Link to="/analysis">Analysis Dashboard</Link></li>
          </ul>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/emotion-game" element={<EmotionGame />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/analysis" element={<AnalysisDashboard />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
