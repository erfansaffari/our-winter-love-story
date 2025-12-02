import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const MemoryMatch = ({ images, onComplete }) => {
    // Duplicate images for matching pairs
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        // Create pairs and shuffle
        const pairs = [...images, ...images].map((img, index) => ({
            id: index,
            image: img,
            pairId: images.indexOf(img),
        }));
        setCards(shuffleArray(pairs));
    }, [images]);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleCardClick = (index) => {
        if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
            return;
        }

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(moves + 1);
            const [first, second] = newFlipped;

            if (cards[first].pairId === cards[second].pairId) {
                // Match found
                setTimeout(() => {
                    setMatched([...matched, first, second]);
                    setFlipped([]);

                    // Check if all matched
                    if (matched.length + 2 === cards.length) {
                        setTimeout(() => {
                            onComplete({ allMatched: true, moves: moves + 1 });
                        }, 500);
                    }
                }, 600);
            } else {
                // No match
                setTimeout(() => {
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <h3 className="text-2xl font-elegant text-center mb-4">
                Memory Match
            </h3>
            <div className="flex justify-between items-center mb-6">
                <p className="text-dark-text">Moves: {moves}</p>
                <p className="text-romantic-pink font-medium">
                    {matched.length / 2} / {images.length} Pairs
                </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || matched.includes(index);
                    const isMatched = matched.includes(index);

                    return (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            className={`aspect-square cursor-pointer transition-all duration-300 transform ${isFlipped ? 'scale-105' : 'scale-100'
                                }`}
                        >
                            <div
                                className={`w-full h-full rounded-lg shadow-md flex items-center justify-center transition-all duration-300 ${isMatched
                                        ? 'bg-green-500 border-2 border-green-600'
                                        : isFlipped
                                            ? 'bg-white border-2 border-romantic-pink'
                                            : 'bg-gradient-to-br from-romantic-pink to-winter-blue'
                                    }`}
                            >
                                {isFlipped ? (
                                    card.image.startsWith('http') || card.image.startsWith('data:') ? (
                                        <img
                                            src={card.image}
                                            alt="Memory card"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <span className="text-3xl">{card.image}</span>
                                    )
                                ) : (
                                    <span className="text-3xl">❤️</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

MemoryMatch.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default MemoryMatch;
