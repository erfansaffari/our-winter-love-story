import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const DirectionPuzzle = ({ data, onComplete }) => {
    const [currentClueIndex, setCurrentClueIndex] = useState(0);
    const [showAllClues, setShowAllClues] = useState(false);
    const { clues, hint } = data;

    const handleNextClue = () => {
        if (currentClueIndex < clues.length - 1) {
            setCurrentClueIndex(currentClueIndex + 1);
        } else {
            setShowAllClues(true);
        }
    };

    const handleStartNavigation = () => {
        onComplete({ completed: true, cluesViewed: true });
    };

    if (showAllClues) {
        return (
            <div className="max-w-md mx-auto p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <h2 className="text-2xl font-elegant text-center mb-6">
                        Ready to Navigate? 🗺️
                    </h2>

                    <div className="bg-gradient-to-r from-romantic-pink/10 to-winter-blue/10 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-dark-text mb-4">Remember these clues:</h3>
                        <div className="space-y-3">
                            {clues.map((clue, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <span className="text-2xl">{index + 1}.</span>
                                    <p className="text-dark-text">{clue}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {hint && (
                        <div className="bg-accent-gold/10 rounded-lg p-4 mb-6">
                            <p className="text-sm text-dark-text italic">
                                <strong>Hint:</strong> {hint}
                            </p>
                        </div>
                    )}

                    <Button onClick={handleStartNavigation} variant="primary" className="w-full">
                        I Remember! Let's Go 🚶
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-4">📍</div>
                    <h2 className="text-2xl font-elegant text-dark-text mb-2">
                        Direction Clue
                    </h2>
                    <p className="text-gray-600">
                        Clue {currentClueIndex + 1} of {clues.length}
                    </p>
                </div>

                <div className="bg-gradient-to-r from-romantic-pink/20 to-accent-gold/20 rounded-2xl p-8 mb-6 min-h-[200px] flex items-center justify-center">
                    <p className="text-xl text-dark-text text-center leading-relaxed">
                        {clues[currentClueIndex]}
                    </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                    {[...Array(clues.length)].map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 flex-1 mx-1 rounded-full transition-all ${index <= currentClueIndex
                                ? 'bg-romantic-pink'
                                : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                <Button onClick={handleNextClue} variant="primary" className="w-full">
                    {currentClueIndex < clues.length - 1 ? '→ Next Clue' : 'Show All Clues'}
                </Button>
            </div>
        </div>
    );
};

DirectionPuzzle.propTypes = {
    data: PropTypes.shape({
        clues: PropTypes.arrayOf(PropTypes.string).isRequired,
        hint: PropTypes.string,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default DirectionPuzzle;
