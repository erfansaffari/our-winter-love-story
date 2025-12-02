import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const Trivia = ({ questions, passingScore = 4, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isWrong, setIsWrong] = useState(false);

    const handleAnswer = (optionIndex) => {
        setSelectedAnswer(optionIndex);
    };

    const handleSubmit = () => {
        const question = questions[currentQuestion];
        const isCorrect = selectedAnswer === question.correctIndex;

        if (isCorrect) {
            setScore(score + 1);

            if (currentQuestion < questions.length - 1) {
                setTimeout(() => {
                    setCurrentQuestion(currentQuestion + 1);
                    setSelectedAnswer(null);
                }, 500);
            } else {
                // Last question
                setTimeout(() => {
                    setShowResult(true);
                }, 500);
            }
        } else {
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 500);
        }
    };

    const handleFinish = () => {
        const finalScore = score + (selectedAnswer === questions[currentQuestion]?.correctIndex ? 1 : 0);
        onComplete({ score: finalScore, passingScore });
    };

    if (showResult) {
        const passed = score >= passingScore;
        return (
            <div className="w-full max-w-md mx-auto p-6 text-center">
                <div className={`mb-6 ${passed ? 'text-green-600' : 'text-red-500'}`}>
                    <h3 className="text-3xl font-elegant mb-2">
                        {passed ? '🎉 Congratulations!' : '😔 Not quite there...'}
                    </h3>
                    <p className="text-xl">
                        You scored {score} out of {questions.length}
                    </p>
                </div>

                {passed ? (
                    <Button onClick={handleFinish} variant="primary" className="w-full">
                        Continue to Next Level
                    </Button>
                ) : (
                    <div>
                        <p className="mb-4 text-dark-text">
                            You need at least {passingScore} correct answers to pass.
                        </p>
                        <Button
                            onClick={() => {
                                setCurrentQuestion(0);
                                setSelectedAnswer(null);
                                setScore(0);
                                setShowResult(false);
                            }}
                            variant="secondary"
                            className="w-full"
                        >
                            Try Again
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">
                    Question {currentQuestion + 1} of {questions.length}
                </p>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                        className="bg-romantic-pink h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <h3 className="text-2xl font-elegant mb-6 text-center">
                {question.question}
            </h3>

            <div className={`space-y-3 mb-6 ${isWrong ? 'shake' : ''}`}>
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={`w-full p-4 rounded-lg text-left transition-all border-2 ${selectedAnswer === index
                                ? 'border-romantic-pink bg-pink-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                    >
                        <span className="font-medium mr-2">
                            {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                    </button>
                ))}
            </div>

            <Button
                onClick={handleSubmit}
                variant="primary"
                disabled={selectedAnswer === null}
                className="w-full"
            >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
                Current Score: {score}
            </p>
        </div>
    );
};

Trivia.propTypes = {
    questions: PropTypes.arrayOf(
        PropTypes.shape({
            question: PropTypes.string.isRequired,
            options: PropTypes.arrayOf(PropTypes.string).isRequired,
            correctIndex: PropTypes.number.isRequired,
        })
    ).isRequired,
    passingScore: PropTypes.number,
    onComplete: PropTypes.func.isRequired,
};

export default Trivia;
