import React from 'react';
import './../Home.css';
import heroImage from './../assets/audi.png';

const Home = () => (
  <div className="home-container">
    <h1>Emotion Recognition & Support System</h1>
    <p>Welcome to the Emotion Recognition and Support System, designed for children with autism. We are dedicated to providing a more understanding and inclusive environment for children through technological assistance.</p>
    <img src={heroImage} alt="A child sleeping on a large star, held in a hand" className="hero-image" />
  </div>
);

export default Home; 