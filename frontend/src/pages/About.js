import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import hotCoffee from '../assets/images/hot-coffee.jpeg';
import icedCoffee from '../assets/images/iced-coffee.jpeg';

const About = () => {
  const [quizState, setQuizState] = useState({
    currentQuestionIndex: 0,
    selectedOptionIndex: null,
    score: 0,
    quizStarted: false,
    quizCompleted: false
  });

  const quizData = [
    { question: "From which part of the plant does the coffee bean come?", options: ["The leaf", "The root", "The seed"], answer: 2 },
    { question: "What color are coffee beans after they are roasted?", options: ["Green", "Black", "Red"], answer: 1 },
    { question: "What is the process of heating green coffee beans to turn them brown called?", options: ["Roasting", "Freezing", "Washing"], answer: 0 },
    { question: "Which of these is a popular way to make coffee?", options: ["Frying in a pan", "Brewing with hot water", "Baking it like a cake"], answer: 1 },
    { question: "Which of these is often added to coffee to make it taste less bitter?", options: ["Ketchup", "Salt", "Milk or Cream"], answer: 2 },
    { question: "What do we call the machine used to turn whole beans into small bits?", options: ["A Microwave", "A Grinder", "A Toaster"], answer: 1 },
    { question: "What do we call a person who makes professional coffee drinks at a cafe?", options: ["A Chef", "A Barista", "A Baker"], answer: 1 }
  ];

  const startQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedOptionIndex: null,
      score: 0,
      quizStarted: true,
      quizCompleted: false
    });
  };

  const selectOption = (index) => {
    setQuizState(prev => ({ ...prev, selectedOptionIndex: index }));
  };

  const submitAnswer = () => {
    if (quizState.selectedOptionIndex === null) return;

    const currentQuestion = quizData[quizState.currentQuestionIndex];
    let newScore = quizState.score;
    let resultMessage = '';

    if (quizState.selectedOptionIndex === currentQuestion.answer) {
      newScore++;
      resultMessage = 'Correct!';
    } else {
      resultMessage = `Wrong! Correct answer: ${currentQuestion.options[currentQuestion.answer]}`;
    }

    // Show result temporarily
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
      resultDiv.textContent = resultMessage;
      resultDiv.style.color = quizState.selectedOptionIndex === currentQuestion.answer ? 'green' : 'red';
    }

    setTimeout(() => {
      if (quizState.currentQuestionIndex + 1 < quizData.length) {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedOptionIndex: null,
          score: newScore
        }));
      } else {
        setQuizState(prev => ({
          ...prev,
          quizCompleted: true,
          quizStarted: false,
          score: newScore
        }));
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedOptionIndex: null,
      score: 0,
      quizStarted: true,
      quizCompleted: false
    });
  };

  const currentQuestion = quizData[quizState.currentQuestionIndex];

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <section className="about-container">
          <h1>ABOUT ME</h1>
          <p className="intro-text">
            <strong>Hi, I'm Hazel Soriano from Agoo. I'm 20 years old and I love pink and ofcourse drinking coffee. I love coffee so much because coffee heals me more, and always comforts me. Coffee makes me happy. Coffee is life for me, it taste like hope and dreams. Coffee calms my mind, especially when combined with hangging out by the sea and watching the sun set, it refreshes my brain and elimenates my problem.The hot/iced coffees I usually buy are Latte, Mocha, and Caramel Macchiato, but the one I like best out of the three is iced Caramel Macchiato because of its perfect balance of bitternes and sweetness, super tasty, gave me energy</strong>
          </p>

          <div className="bio-details">
            <h2 className="section-title"><strong>2 TYPES OF COFFEE BLENDS</strong></h2>
            <p><strong>HOT COFFEE:</strong> It is brewed with hot water for a traditional, aromatic, and often bitter flavor. This is a great drink, espacially when the weather is cold or when you are Baguio.</p>
            <img src={hotCoffee} alt="Hot Coffee" width="100" className="coffee-img" />
            <p><strong>COLD/ICED COFFEE:</strong> It is chilled,either by brewing hot and pouring over ice or steeping grounds in cold water. This is a great drink. especially when you're at the beach and the weather is hot.</p>
            <img src={icedCoffee} alt="Iced Coffee" width="100" className="coffee-img" />
          </div>

          <div className="bio-details">
            <h2 className="section-title"><strong>COFFEE QUOTES</strong></h2>
            <p><strong>MORE ESPRESSO, LESS DEPRESSO.</strong></p>
          </div>

          <h2 className="section-title">Common Addition When Buying Coffee's</h2>
          <div className="interest-cards-container">
            <div className="card"><p><strong>Milk/Cream/Non-Dairy Milks</strong></p></div>
            <div className="card"><p><strong>Sugar/Sweeteners</strong></p></div>
            <div className="card"><p><strong>Syrups/Liqueurs</strong></p></div>
          </div>

          <div className="quiz-container">
            {!quizState.quizStarted && !quizState.quizCompleted && (
              <>
                <h2>Ready to start a quiz?</h2>
                <button onClick={startQuiz} className="quiz-btn">Start Quiz</button>
              </>
            )}
            
            {quizState.quizStarted && (
              <>
                <h2 id="question">{currentQuestion.question}</h2>
                <div className="options">
                  {currentQuestion.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`option ${quizState.selectedOptionIndex === idx ? 'selected' : ''}`}
                      onClick={() => selectOption(idx)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <button onClick={submitAnswer} disabled={quizState.selectedOptionIndex === null} className="quiz-btn">
                  Submit Answer
                </button>
                <div id="result"></div>
              </>
            )}
            
            {quizState.quizCompleted && (
              <>
                <h2>Quiz Complete!</h2>
                <div className="result">
                  Your final score is {quizState.score} / {quizData.length}.
                </div>
                <button onClick={restartQuiz} className="quiz-btn">Start Quiz Again</button>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;