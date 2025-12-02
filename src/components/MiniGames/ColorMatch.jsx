import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const ColorMatch = ({ pairs, onComplete }) => {
    const [selectedColors, setSelectedColors] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);

    // Shuffle colors for the game
    const allColors = pairs.flatMap((pair) => [
        { ...pair, id: `${pair.color1}-1`, color: pair.color1 },
        { ...pair, id: `${pair.color2}-2`, color: pair.color2 },
    ]);

    const handleColorClick = (colorItem) => {
        if (matchedPairs.some((p) => p.includes(colorItem.id))) {
            return; // Already matched
        }

        if (selectedColors.length === 2) {
            return; // Already have 2 selected
        }

        if (selectedColors.some((c) => c.id === colorItem.id)) {
            // Deselect
            setSelectedColors(selectedColors.filter((c) => c.id !== colorItem.id));
        } else {
            const newSelected = [...selectedColors, colorItem];
            setSelectedColors(newSelected);

            if (newSelected.length === 2) {
                // Check for match
                const [first, second] = newSelected;
                if (first.color === second.color) {
                    // Match!
                    setTimeout(() => {
                        setMatchedPairs([...matchedPairs, [first.id, second.id]]);
                        setSelectedColors([]);

                        // Check if all matched
                        if (matchedPairs.length + 1 === pairs.length) {
                            setTimeout(() => {
                                onComplete({ allMatched: true });
                            }, 500);
                        }
                    }, 500);
                } else {
                    // No match
                    setTimeout(() => {
                        setSelectedColors([]);
                    }, 1000);
                }
            }
        }
    };

    const isSelected = (id) => selectedColors.some((c) => c.id === id);
    const isMatched = (id) => matchedPairs.some((p) => p.includes(id));

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <h3 className="text-2xl font-elegant text-center mb-4">
                Color Matching
            </h3>
            <p className="text-center text-gray-600 mb-8">
                Match the color pairs to discover the theme!
            </p>

            <div className="mb-6 text-center">
                <p className="text-romantic-pink font-medium">
                    {matchedPairs.length} / {pairs.length} Pairs Matched
                </p>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
                {allColors.map((colorItem) => {
                    const matched = isMatched(colorItem.id);
                    const selected = isSelected(colorItem.id);

                    return (
                        <button
                            key={colorItem.id}
                            onClick={() => handleColorClick(colorItem)}
                            disabled={matched}
                            className={`aspect-square rounded-lg transition-all duration-300 transform ${matched
                                    ? 'opacity-50 scale-95'
                                    : selected
                                        ? 'scale-110 ring-4 ring-romantic-pink'
                                        : 'hover:scale-105'
                                } ${matched ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            style={{
                                backgroundColor: colorItem.color,
                                boxShadow: matched
                                    ? '0 4px 6px rgba(0,0,0,0.1)'
                                    : selected
                                        ? '0 8px 12px rgba(255,182,193,0.5)'
                                        : '0 4px 6px rgba(0,0,0,0.1)',
                            }}
                        >
                            {matched && (
                                <span className="text-2xl">✓</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {matchedPairs.length === pairs.length && (
                <div className="animate-fade-in">
                    <div className="bg-gradient-to-r from-romantic-pink/20 to-accent-gold/20 p-6 rounded-xl mb-4">
                        <h4 className="font-elegant text-xl text-center mb-2">
                            🎨 Colors Revealed!
                        </h4>
                        <div className="space-y-2">
                            {pairs.map((pair, index) => (
                                <div key={index} className="text-center">
                                    <span className="font-medium">{pair.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

ColorMatch.propTypes = {
    pairs: PropTypes.arrayOf(
        PropTypes.shape({
            color1: PropTypes.string.isRequired,
            color2: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default ColorMatch;
