import React, { useState, useEffect } from 'react';
import { QuizState } from '../types/quiz';
import QuizReport from './QuizReport';
import { PDFViewer } from '@react-pdf/renderer';
import PDFReport from './PDFReport';
import '../styles/Quiz.css';
import { questions } from '../data/questions';

const QUESTION_TIMER = 15; // 15 seconds per question
const LOW_TIME_THRESHOLD = 5; // Show warning when 5 seconds or less remain

// Speech synthesis
const synth = window.speechSynthesis;

const createConfetti = () => {
  const colors = ['#4CAF50', '#2196f3', '#9c27b0', '#f44336', '#ff9800'];
  return Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
  }));
};

const Quiz: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    showScore: false,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showReport, setShowReport] = useState<'none' | 'quiz' | 'pdf'>('none');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER);
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null);
  const [successAudio, setSuccessAudio] = useState<HTMLAudioElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
  }>({
    show: false,
    isCorrect: false,
    message: '',
  });
  const [confetti, setConfetti] = useState<Array<{ id: number; color: string; left: string; animationDelay: string }>>([]);

  useEffect(() => {
    const bgAudio = new Audio('/audio/quiz.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.2;
    setBackgroundAudio(bgAudio);

    const yayAudio = new Audio('/audio/yay.mp3');
    yayAudio.volume = 0.5;
    setSuccessAudio(yayAudio);

    return () => {
      bgAudio.pause();
      bgAudio.currentTime = 0;
      yayAudio.pause();
      yayAudio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (quizState.showScore) {
      if (backgroundAudio) {
        backgroundAudio.pause();
      }
      if (successAudio) {
        successAudio.currentTime = 0;
        successAudio.play().catch(error => console.log('Success audio playback failed:', error));
      }
    }
  }, [quizState.showScore]);

  const startQuiz = () => {
    setHasStarted(true);
    if (backgroundAudio) {
      backgroundAudio.play().catch(error => console.log('Background audio playback failed:', error));
    }
  };

  useEffect(() => {
    if (!hasStarted) return;

    if (!quizState.showScore && !feedback.show) {
      const currentQuestion = questions[quizState.currentQuestionIndex];
      
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      synth.speak(utterance);
    }

    return () => {
      synth.cancel();
    };
  }, [quizState.currentQuestionIndex, quizState.showScore, feedback.show, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    if (!quizState.showScore && !feedback.show) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizState.currentQuestionIndex, feedback.show, hasStarted]);

  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(QUESTION_TIMER);
  }, [quizState.currentQuestionIndex]);

  useEffect(() => {
    if (quizState.showScore) {
      setConfetti(createConfetti());
    }
  }, [quizState.showScore]);

  const handleTimeUp = () => {
    const currentQuestion = questions[quizState.currentQuestionIndex];
    
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[quizState.currentQuestionIndex] = 'Not Answered';
      return newAnswers;
    });

    setFeedback({
      show: true,
      isCorrect: false,
      message: "Incorrect! Time's up"
    });

    setTimeout(moveToNextQuestion, 1500);
  };

  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option);
  };

  const moveToNextQuestion = () => {
    const nextQuestion = quizState.currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: nextQuestion,
      }));
      setSelectedAnswer(null);
      setFeedback({ show: false, isCorrect: false, message: '' });
      setTimeLeft(QUESTION_TIMER);
    } else {
      setQuizState(prev => ({
        ...prev,
        showScore: true,
      }));
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[quizState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Store answer
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[quizState.currentQuestionIndex] = selectedAnswer;
      return newAnswers;
    });

    setFeedback({
      show: true,
      isCorrect,
      message: isCorrect ? "Correct! Well done!" : "Incorrect! Better luck next time!"
    });

    if (isCorrect) {
      setQuizState(prev => ({
        ...prev,
        score: prev.score + 1,
      }));
    }

    setTimeout(moveToNextQuestion, 1500);
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      showScore: false,
    });
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowReport('none');
    setTimeLeft(QUESTION_TIMER);
    setHasStarted(false);
    setFeedback({
      show: false,
      isCorrect: false,
      message: '',
    });

    if (backgroundAudio) {
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
    }
    if (successAudio) {
      successAudio.pause();
      successAudio.currentTime = 0;
    }
  };

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / questions.length) * 100;

  if (!hasStarted) {
    return (
      <div className="quiz-container">
        <div className="start-screen">
          <h2>Welcome to the Quiz!</h2>
          <p>Get ready to test your knowledge. Make sure your audio is enabled for the best experience.</p>
          <button className="start-button" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizState.showScore) {
    return (
      <div className="quiz-container">
        {showReport === 'none' ? (
          <div className="score-card">
            <div className="confetti-container">
              {confetti.map(({ id, color, left, animationDelay }) => (
                <div
                  key={id}
                  className="confetti"
                  style={{
                    '--color': color,
                    left,
                    animationDelay,
                  } as React.CSSProperties}
                />
              ))}
            </div>
            <h2>Quiz Completed! 🎉</h2>
            <p className="final-score">Your score: {quizState.score} out of {questions.length}</p>
            <div className="button-group">
              <button className="restart-button" onClick={resetQuiz}>Try Again</button>
              <button className="review-button" onClick={() => setShowReport('quiz')}>
                Review Questions
              </button>
              <button className="export-pdf-button" onClick={() => setShowReport('pdf')}>
                View Detailed Report
              </button>
            </div>
          </div>
        ) : (
          <div className="report-container">
            <button className="back-button" onClick={() => setShowReport('none')}>
              Back to Score
            </button>
            {showReport === 'quiz' ? (
              <QuizReport
                questions={questions}
                userAnswers={userAnswers}
                score={quizState.score}
              />
            ) : (
              <PDFViewer style={{ width: '100%', height: '80vh' }}>
                <PDFReport
                  questions={questions}
                  userAnswers={userAnswers}
                  score={quizState.score}
                />
              </PDFViewer>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="question-count">
          Question {quizState.currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="timer-container">
        <div 
          className={`timer ${timeLeft <= LOW_TIME_THRESHOLD ? 'low-time' : ''}`}
          style={{ 
            '--progress': `${(timeLeft / QUESTION_TIMER) * 100}%` 
          } as React.CSSProperties}
        >
          {timeLeft}s
        </div>
      </div>

      <div className="question-card">
        {feedback.show && (
          <div className={`feedback-message ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
            {feedback.message}
          </div>
        )}
        
        <h2 className="question-text">{currentQuestion.question}</h2>
        
        <div className="options-grid">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`option-button ${selectedAnswer === option ? 'selected' : ''} ${
                feedback.show && feedback.isCorrect && option === currentQuestion.correctAnswer ? 'correct-answer' : ''
              }`}
              disabled={feedback.show}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="button-container">
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={!selectedAnswer || feedback.show}
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 