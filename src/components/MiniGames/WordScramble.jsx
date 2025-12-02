import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const WordScramble = ({ scrambled, answer, hint, onComplete }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const handleSubmit = () => {
        const isCorrect = userAnswer.toLowerCase().trim() === answer.toLowerCase().trim();

        if (isCorrect) {
            onComplete({ correct: true, attempts: attempts + 1 });
        } else {
            setIsWrong(true);
            setAttempts(attempts + 1);
            setTimeout(() => setIsWrong(false), 500);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <h3 className="text-2xl font-elegant text-center mb-8">
                Unscramble the Message
            </h3>

            {/* Scrambled letters */}
            <div className="bg-gradient-to-r from-romantic-pink/20 to-winter-blue/20 p-6 rounded-xl mb-6">
                <div className="flex flex-wrap justify-center gap-2">
                    {scrambled.split('').map((letter, index) => (
                        <div
                            key={index}
                            className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center text-xl font-bold text-dark-text animate-bounce-soft"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {letter}
                        </div>
                    ))}
                </div>
            </div>

            {/* Input field */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-dark-text mb-2">
                    Your Answer:
                </label>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-romantic-pink transition-all ${isWrong ? 'shake border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Type your answer here..."
                />
                {isWrong && (
                    <p className="text-red-500 text-sm mt-2">
                        Not quite! Try again 💕
                    </p>
                )}
            </div>

            {/* Hint button */}
            {hint && attempts >= 2 && !showHint && (
                <button
                    onClick={() => setShowHint(true)}
                    className="text-winter-blue underline text-sm mb-4 hover:text-blue-600"
                >
                    Need a hint?
                </button>
            )}

            {showHint && hint && (
                <div className="bg-yellow-50 border-l-4 border-accent-gold p-4 mb-4 rounded">
                    <p className="text-sm text-dark-text">
                        💡 <strong>Hint:</strong> {hint}
                    </p>
                </div>
            )}

            {/* Submit button */}
            <Button onClick={handleSubmit} variant="primary" className="w-full">
                Submit Answer
            </Button>
        </div>
    );
};

WordScramble.propTypes = {
    scrambled: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    hint: PropTypes.string,
    onComplete: PropTypes.func.isRequired,
};

export default WordScramble;
