import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const MovieGuess = ({ data, onComplete }) => {
    const [currentClueIndex, setCurrentClueIndex] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [userGuess, setUserGuess] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const { movieTitle, poster, clues, hint } = data;

    const handleKnowIt = () => {
        setShowInput(true);
    };

    const handleNextClue = () => {
        if (currentClueIndex < clues.length - 1) {
            setCurrentClueIndex(currentClueIndex + 1);
            setShowInput(false);
        } else {
            setShowHint(true);
        }
    };

    const handleSubmitGuess = () => {
        const normalizedGuess = userGuess.trim().toLowerCase();
        const normalizedTitle = movieTitle.toLowerCase();

        // Allow close matches
        const isCorrect =
            normalizedGuess === normalizedTitle ||
            normalizedGuess.includes(normalizedTitle) ||
            normalizedTitle.includes(normalizedGuess);

        if (isCorrect) {
            onComplete({ completed: true, cluesUsed: currentClueIndex + 1, attempts: attempts + 1 });
        } else {
            setAttempts(attempts + 1);
            alert('Not quite! Try another clue or guess again.');
            setUserGuess('');
            setShowInput(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🎬</div>
                    <h2 className="text-2xl font-elegant text-dark-text mb-2">
                        Guess the Movie!
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Clue {currentClueIndex + 1} of {clues.length}
                    </p>
                </div>

                {/* Current Clue */}
                <div className="bg-gradient-to-r from-romantic-pink/10 to-accent-gold/10 rounded-2xl p-6 mb-6 min-h-[150px] flex items-center justify-center">
                    <p className="text-lg text-dark-text text-center leading-relaxed">
                        {clues[currentClueIndex]}
                    </p>
                </div>

                {/* Hint (if all clues shown) */}
                {showHint && hint && (
                    <div className="bg-winter-blue/10 rounded-xl p-4 mb-6">
                        <p className="text-sm font-medium text-dark-text mb-1">💡 Final Hint:</p>
                        <p className="text-dark-text">{hint}</p>
                    </div>
                )}

                {/* Input Field */}
                {showInput && (
                    <div className="mb-6">
                        <input
                            type="text"
                            value={userGuess}
                            onChange={(e) => setUserGuess(e.target.value)}
                            placeholder="Type the movie title..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-romantic-pink focus:outline-none mb-3"
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmitGuess()}
                        />
                        <div className="flex gap-3">
                            <Button onClick={handleSubmitGuess} variant="primary" className="flex-1">
                                Submit Guess
                            </Button>
                            <Button onClick={() => setShowInput(false)} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {!showInput && (
                    <div className="space-y-3">
                        <Button onClick={handleKnowIt} variant="primary" className="w-full">
                            I Know It! 🎯
                        </Button>
                        {currentClueIndex < clues.length - 1 || !showHint ? (
                            <Button onClick={handleNextClue} variant="outline" className="w-full">
                                {currentClueIndex < clues.length - 1 ? 'Need Another Clue' : 'Show Final Hint'}
                            </Button>
                        ) : null}
                    </div>
                )}

                {/* Clue Progress Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {clues.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 rounded-full ${index <= currentClueIndex ? 'bg-romantic-pink' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

MovieGuess.propTypes = {
    data: PropTypes.shape({
        movieTitle: PropTypes.string.isRequired,
        poster: PropTypes.string.isRequired,
        clues: PropTypes.arrayOf(PropTypes.string).isRequired,
        hint: PropTypes.string,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default MovieGuess;
