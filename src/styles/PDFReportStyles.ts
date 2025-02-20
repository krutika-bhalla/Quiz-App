import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  scoreSection: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  scoreText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  questionSection: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    borderBottomStyle: 'solid',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  status: {
    fontSize: 12,
    color: '#6c757d',
  },
  question: {
    fontSize: 14,
    marginBottom: 10,
    color: '#2c3e50',
  },
  option: {
    fontSize: 12,
    marginBottom: 5,
    color: '#495057',
    paddingLeft: 10,
  },
  correctOption: {
    color: '#2e7d32',
  },
  wrongOption: {
    color: '#c62828',
  },
  explanation: {
    fontSize: 12,
    marginTop: 10,
    color: '#795548',
    fontStyle: 'italic',
  },
}); 