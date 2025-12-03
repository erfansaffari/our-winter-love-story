import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const SpeedTrivia = ({ data, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(data.timePerQuestion || 10);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [answerFeedback, setAnswerFeedback] = useState(null); // 'correct' or 'wrong'

    const currentQuestion = data.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === data.questions.length - 1;

    useEffect(() => {
        if (showResults) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeout();
                    return data.timePerQuestion || 10;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, showResults, data.timePerQuestion]);

    const handleTimeout = () => {
        const newAnswers = [...selectedAnswers, { questionIndex: currentQuestionIndex, selected: -1, correct: false, timedOut: true }];
        setSelectedAnswers(newAnswers);
        setAnswerFeedback('wrong');

        setTimeout(() => {
            proceedToNext(newAnswers);
        }, 1000);
    };

    const handleAnswer = (optionIndex) => {
        const isCorrect = optionIndex === currentQuestion.correctIndex;
        const newAnswers = [...selectedAnswers, { questionIndex: currentQuestionIndex, selected: optionIndex, correct: isCorrect, timedOut: false }];
        setSelectedAnswers(newAnswers);
        setAnswerFeedback(isCorrect ? 'correct' : 'wrong');

        setTimeout(() => {
            proceedToNext(newAnswers);
        }, 800);
    };

    const proceedToNext = (answers) => {
        setAnswerFeedback(null);

        if (isLastQuestion) {
            setShowResults(true);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(data.timePerQuestion || 10);
        }
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setTimeLeft(data.timePerQuestion || 10);
        setAnswerFeedback(null);
    };

    const score = selectedAnswers.filter(a => a.correct).length;
    const passed = score >= data.passingScore;

    if (showResults) {
        return (
            <div className="max-w-md mx-auto p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">{passed ? '⚡' : '😅'}</div>
                    <h2 className="text-3xl font-elegant text-dark-text mb-4">
                        {passed ? 'Speed Master!' : 'Almost There!'}
                    </h2>
                    <div className="bg-gradient-to-r from-romantic-pink/10 to-accent-gold/10 rounded-2xl p-6 mb-6">
                        <p className="text-4xl font-bold text-romantic-pink mb-2">
                            {score}/{data.questions.length}
                        </p>
                        <p className="text-gray-600">
                            Passing score: {data.passingScore}/{data.questions.length}
                        </p>
                    </div>

                    {/* Show which answers were right/wrong */}
                    <div className="flex justify-center gap-2 mb-6">
                        {selectedAnswers.map((answer, index) => (
                            <div
                                key={index}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${answer.correct ? 'bg-green-500' : answer.timedOut ? 'bg-gray-400' : 'bg-red-500'
                                    }`}
                            >
                                {answer.correct ? '✓' : answer.timedOut ? '⏱' : '✗'}
                            </div>
                        ))}
                    </div>

                    {passed ? (
                        <>
                            <p className="text-gray-600 mb-6">
                                Quick thinking azizam! 💨
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
                                Retry
                            </Button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                {/* Timer */}
                <div className="text-center mb-6">
                    <div className={`text-6xl font-bold mb-2 ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-romantic-pink'}`}>
                        {timeLeft}
                    </div>
                    <p className="text-sm text-gray-600">
                        Question {currentQuestionIndex + 1} of {data.questions.length}
                    </p>
                </div>

                {/* Question */}
                <div className="bg-gradient-to-r from-romantic-pink/10 to-winter-blue/10 rounded-2xl p-6 mb-6">
                    <p className="text-lg text-dark-text font-medium text-center leading-relaxed">
                        {currentQuestion.question}
                    </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => !answerFeedback && handleAnswer(index)}
                            disabled={!!answerFeedback}
                            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 font-medium ${answerFeedback && index === currentQuestion.correctIndex
                                    ? 'border-green-500 bg-green-50'
                                    : answerFeedback
                                        ? 'border-gray-200 opacity-50'
                                        : 'border-gray-200 hover:border-romantic-pink hover:bg-romantic-pink/5'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

SpeedTrivia.propTypes = {
    data: PropTypes.shape({
        questions: PropTypes.arrayOf(
            PropTypes.shape({
                question: PropTypes.string.isRequired,
                options: PropTypes.arrayOf(PropTypes.string).isRequired,
                correctIndex: PropTypes.number.isRequired,
            })
        ).isRequired,
        timePerQuestion: PropTypes.number,
        passingScore: PropTypes.number.isRequired,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default SpeedTrivia;
