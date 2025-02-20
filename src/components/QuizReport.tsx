import React, { useState, useMemo } from 'react';
import { Question } from '../types/quiz';
import '../styles/QuizReport.css';

interface QuizReportProps {
  questions: Question[];
  userAnswers: string[];
  score: number;
}

type SortOption = 'default' | 'correct' | 'incorrect';
type FilterOption = 'all' | 'correct' | 'incorrect' | 'unanswered';

const QuizReport: React.FC<QuizReportProps> = ({ questions, userAnswers, score }) => {
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const percentage = ((score / questions.length) * 100).toFixed(1);

  const handleShare = async () => {
    const text = `I scored ${score} out of ${questions.length} (${percentage}%) in the quiz!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Quiz Results',
          text: text,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Results copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const filteredAndSortedQuestions = useMemo(() => {
    let processed = [...questions];
    
    // First apply filter
    if (filterBy !== 'all') {
      processed = processed.filter((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        switch (filterBy) {
          case 'correct':
            return isCorrect;
          case 'incorrect':
            return !isCorrect && userAnswer !== 'Not Answered';
          case 'unanswered':
            return userAnswer === 'Not Answered';
          default:
            return true;
        }
      });
    }

    // Then apply sort
    if (sortBy !== 'default') {
      processed.sort((a, b) => {
        const aIndex = questions.findIndex(q => q.id === a.id);
        const bIndex = questions.findIndex(q => q.id === b.id);
        const aCorrect = userAnswers[aIndex] === a.correctAnswer;
        const bCorrect = userAnswers[bIndex] === b.correctAnswer;

        if (sortBy === 'correct') {
          return aCorrect === bCorrect ? 0 : aCorrect ? -1 : 1;
        } else {
          return aCorrect === bCorrect ? 0 : aCorrect ? 1 : -1;
        }
      });
    }

    return processed;
  }, [questions, userAnswers, sortBy, filterBy]);

  const stats = useMemo(() => {
    const correct = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const incorrect = userAnswers.filter((answer, index) => answer !== questions[index].correctAnswer && answer !== 'Not Answered').length;
    const unanswered = userAnswers.filter(answer => answer === 'Not Answered').length;
    return { correct, incorrect, unanswered };
  }, [questions, userAnswers]);

  return (
    <div className="quiz-report">
      <div className="report-header">
        <h2>Quiz Results</h2>
        <div className="score-summary">
          <p className="score-text">Final Score: {score} out of {questions.length}</p>
          <p className="percentage">Percentage: {percentage}%</p>
        </div>
        <div className="stats-summary">
          <div className="stat correct">
            <span className="stat-number">{stats.correct}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat incorrect">
            <span className="stat-number">{stats.incorrect}</span>
            <span className="stat-label">Incorrect</span>
          </div>
          <div className="stat unanswered">
            <span className="stat-number">{stats.unanswered}</span>
            <span className="stat-label">Unanswered</span>
          </div>
        </div>
        <button className="share-button" onClick={handleShare}>
          Share Results
        </button>
      </div>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="control-select"
          >
            <option value="all">All Questions</option>
            <option value="correct">Correct Only</option>
            <option value="incorrect">Incorrect Only</option>
            <option value="unanswered">Unanswered Only</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort">Sort:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="control-select"
          >
            <option value="default">Default Order</option>
            <option value="correct">Correct First</option>
            <option value="incorrect">Incorrect First</option>
          </select>
        </div>
      </div>

      <div className="questions-review">
        {filteredAndSortedQuestions.map((question) => {
          const index = questions.findIndex(q => q.id === question.id);
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          const answerStatus = userAnswer === 'Not Answered' ? 'not-answered' : (isCorrect ? 'correct' : 'incorrect');

          return (
            <div key={question.id} className={`question-review ${answerStatus}`}>
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                <span className={`status-badge ${answerStatus}`}>
                  {userAnswer === 'Not Answered' ? 'Not Answered' : (isCorrect ? 'Correct' : 'Incorrect')}
                </span>
              </div>
              
              <p className="question-text">{question.question}</p>
              
              <div className="options-review">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`option ${
                      option === question.correctAnswer
                        ? 'correct-answer'
                        : option === userAnswer && !isCorrect
                        ? 'wrong-answer'
                        : ''
                    }`}
                  >
                    <span className="option-marker">
                      {option === question.correctAnswer && '✓'}
                      {option === userAnswer && !isCorrect && '✗'}
                    </span>
                    {option}
                  </div>
                ))}
              </div>

              {!isCorrect && (
                <div className="explanation">
                  {userAnswer === 'Not Answered' ? (
                    <p>You did not answer this question. The correct answer was: <strong>{question.correctAnswer}</strong></p>
                  ) : (
                    <p>Your answer <strong>"{userAnswer}"</strong> was incorrect. The correct answer was: <strong>{question.correctAnswer}</strong></p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizReport; 