import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { Question } from '../types/quiz';
import { styles } from '../styles/PDFReportStyles';

interface PDFReportProps {
  questions: Question[];
  userAnswers: string[];
  score: number;
}

const PDFReport: React.FC<PDFReportProps> = ({ questions, userAnswers, score }) => {
  const percentage = ((score / questions.length) * 100).toFixed(1);
  const stats = {
    correct: userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length,
    incorrect: userAnswers.filter((answer, index) => answer !== questions[index].correctAnswer && answer !== 'Not Answered').length,
    unanswered: userAnswers.filter(answer => answer === 'Not Answered').length,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Quiz Results</Text>
        
        <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>Final Score: {score} out of {questions.length}</Text>
          <Text style={styles.scoreText}>Percentage: {percentage}%</Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.correct}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.incorrect}</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.unanswered}</Text>
            <Text style={styles.statLabel}>Unanswered</Text>
          </View>
        </View>

        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;

          return (
            <View key={question.id} style={styles.questionSection}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Question {index + 1}</Text>
                <Text style={styles.status}>
                  {userAnswer === 'Not Answered' ? 'Not Answered' : (isCorrect ? 'Correct' : 'Incorrect')}
                </Text>
              </View>

              <Text style={styles.question}>{question.question}</Text>

              {question.options.map((option, optionIndex) => (
                <Text
                  key={optionIndex}
                  style={[
                    styles.option,
                    option === question.correctAnswer && styles.correctOption,
                    option === userAnswer && !isCorrect && styles.wrongOption
                  ]}
                >
                  {option === question.correctAnswer ? '✓ ' : option === userAnswer && !isCorrect ? '✗ ' : '• '}
                  {option}
                </Text>
              ))}

              {!isCorrect && (
                <Text style={styles.explanation}>
                  {userAnswer === 'Not Answered'
                    ? `You did not answer this question. The correct answer was: ${question.correctAnswer}`
                    : `Your answer "${userAnswer}" was incorrect. The correct answer was: ${question.correctAnswer}`}
                </Text>
              )}
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default PDFReport; 