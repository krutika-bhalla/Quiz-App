import React from 'react';
import Quiz from './components/Quiz';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Quiz App</h1>
      <Quiz />
    </div>
  );
};

export default App;
