# Interactive Quiz Application

A modern, interactive quiz application built with React and TypeScript, featuring audio feedback, animations, and detailed result reporting.

## 🌟 Features

### Core Functionality
- Dynamic question rendering with multiple-choice options
- Timer for each question (15 seconds)
- Real-time feedback on answers
- Score tracking and final results
- Question review capabilities

### Enhanced User Experience
- Text-to-speech question reading
- Background music during quiz
- Success sound effects
- Visual feedback and animations
- Confetti celebration on quiz completion

### Result Review Options
1. **Quick Review**: Interactive review of answers with filtering and sorting options
2. **Detailed PDF Report**: Professional PDF format report for downloading or printing

### Accessibility & UX
- Keyboard navigation support
- Visual feedback for time running low
- Clear success/error states
- Responsive design for all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quiz-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Add required audio files in the `/public/audio/` directory:
- `quiz.mp3` - Background music
- `yay.mp3` - Success sound effect

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 🛠️ Technical Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **@react-pdf/renderer** - PDF report generation
- **Web Speech API** - Text-to-speech functionality
- **CSS3** - Styling and animations

## 📋 Project Structure

```
quiz-app/
├── src/
│   ├── components/
│   │   ├── Quiz.tsx         # Main quiz component
│   │   ├── QuizReport.tsx   # Interactive review component
│   │   └── PDFReport.tsx    # PDF report component
│   ├── styles/
│   │   ├── Quiz.css         # Main quiz styles
│   │   └── QuizReport.css   # Interactive review styles
│   │   └── PDFReportStyles.ts # PDF report styles
│   ├── types/
│   │   └── quiz.ts          # TypeScript interfaces
│   ├── data/
│   │   └── questions.ts       # Questions data
│   └── App.tsx              # Root component
├── public/
│   └── audio/
│       ├── quiz.mp3         # Background music
│       └── yay.mp3          # Success sound
└── README.md
```

## 🎮 Usage Guide

1. **Starting the Quiz**
   - Click "Start Quiz" on the welcome screen
   - Enable audio for the best experience

2. **During the Quiz**
   - Listen to questions being read aloud
   - Select an answer within 15 seconds
   - Receive immediate feedback on your answers

3. **Reviewing Results**
   - View your final score
   - Choose between:
     - "Review Questions" for interactive review
     - "View Detailed Report" for PDF version
   - Try again with "Try Again" button

## 🎨 Customization

### Modifying Questions
Edit the `questions` array in `questions.ts`:
```typescript
const questions: Question[] = [
  {
    id: number,
    question: string,
    options: string[],
    correctAnswer: string
  },
  // ...
];
```

### Styling
- Main styles in `Quiz.css`
- PDF report styles in `PDFReportStyles.ts`
- Interactive report styles in `QuizReport.css`

### Timing
Adjust constants in `Quiz.tsx`:
```typescript
const QUESTION_TIMER = 15; // seconds per question
const LOW_TIME_THRESHOLD = 5; // warning threshold
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Sound effects from [youtube]
- Background music from [youtube]
- Icons and animations inspiration from [emojipedia]
