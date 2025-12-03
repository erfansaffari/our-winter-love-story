import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const TriviaHard = ({ data, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

    const currentQuestion = data.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === data.questions.length - 1;

    const handleAnswer = (optionIndex) => {
        const isCorrect = optionIndex === currentQuestion.correctIndex;
        const newAnswers = [...selectedAnswers, { questionIndex: currentQuestionIndex, selected: optionIndex, correct: isCorrect }];
        setSelectedAnswers(newAnswers);

        // Show correct answer briefly if wrong
        if (!isCorrect) {
            setShowCorrectAnswer(true);
            setTimeout(() => {
                setShowCorrectAnswer(false);
                proceedToNext(newAnswers);
            }, 2000);
        } else {
            proceedToNext(newAnswers);
        }
    };

    const proceedToNext = (answers) => {
        if (isLastQuestion) {
            setShowResults(true);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setShowCorrectAnswer(false);
    };

    const score = selectedAnswers.filter(a => a.correct).length;
    const passed = score >= data.passingScore;

    if (showResults) {
        return (
            <div className="max-w-md mx-auto p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">{passed ? '🎉' : '😅'}</div>
                    <h2 className="text-3xl font-elegant text-dark-text mb-4">
                        {passed ? 'Great Job!' : 'So Close!'}
                    </h2>
                    <div className="bg-gradient-to-r from-romantic-pink/10 to-winter-blue/10 rounded-2xl p-6 mb-6">
                        <p className="text-4xl font-bold text-romantic-pink mb-2">
                            {score}/{data.questions.length}
                        </p>
                        <p className="text-gray-600">
                            Passing score: {data.passingScore}/{data.questions.length}
                        </p>
                    </div>

                    {passed ? (
                        <>
                            <p className="text-gray-600 mb-6">
                                You know us so well azizam! 💙
                            </p>
                            <Button onClick={() => onComplete({ completed: true, score })} variant="primary" className="w-full">
                                Continue
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-6">
                                You need {data.passingScore} correct answers. Try again!
                            </p>
                            <Button onClick={handleRetry} variant="primary" className="w-full">
                                Try Again
                            </Button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (showCorrectAnswer) {
        return (
            <div className="max-w-md mx-auto p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-bold text-dark-text mb-4">
                        Not quite...
                    </h3>
                    <div className="bg-accent-gold/10 rounded-2xl p-6">
                        <p className="text-sm text-gray-600 mb-2">The correct answer was:</p>
                        <p className="text-lg font-bold text-dark-text">
                            {currentQuestion.options[currentQuestion.correctIndex]}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                {/* Progress */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-600">
                        Question {currentQuestionIndex + 1} of {data.questions.length}
                    </p>
                    <p className="text-sm font-medium text-romantic-pink">
                        Score: {selectedAnswers.filter(a => a.correct).length}/{data.passingScore} needed
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                    <div
                        className="h-full bg-romantic-pink rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / data.questions.length) * 100}%` }}
                    />
                </div>

                {/* Question */}
                <div className="bg-gradient-to-r from-romantic-pink/10 to-winter-blue/10 rounded-2xl p-6 mb-8">
                    <p className="text-lg text-dark-text font-medium text-center leading-relaxed">
                        {currentQuestion.question}
                    </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-romantic-pink hover:bg-romantic-pink/5 transition-all duration-200 font-medium text-dark-text"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

TriviaHard.propTypes = {
    data: PropTypes.shape({
        questions: PropTypes.arrayOf(
            PropTypes.shape({
                question: PropTypes.string.isRequired,
                options: PropTypes.arrayOf(PropTypes.string).isRequired,
                correctIndex: PropTypes.number.isRequired,
            })
        ).isRequired,
        passingScore: PropTypes.number.isRequired,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default TriviaHard;
