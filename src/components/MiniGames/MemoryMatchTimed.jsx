import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const MemoryMatchTimed = ({ data, onComplete }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [timeLeft, setTimeLeft] = useState(data.timeLimit || 90);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFailed, setGameFailed] = useState(false);

    useEffect(() => {
        // Initialize cards
        const cardImages = data.images || [];
        const doubled = [...cardImages, ...cardImages];
        const shuffled = doubled.sort(() => Math.random() - 0.5);
        setCards(shuffled.map((img, index) => ({ id: index, image: img })));
    }, [data.images]);

    useEffect(() => {
        if (!gameStarted || gameFailed) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setGameFailed(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, gameFailed]);

    useEffect(() => {
        // Check if all cards are matched
        // matched.length should equal the number of unique images (not total cards)
        if (matched.length === data.images.length && matched.length > 0) {
            onComplete({ completed: true, moves, timeUsed: data.timeLimit - timeLeft });
        }
    }, [matched, data.images.length, onComplete, moves, timeLeft, data.timeLimit]);

    const handleCardClick = (index) => {
        if (!gameStarted) setGameStarted(true);
        if (gameFailed) return;
        if (flipped.length === 2) return;
        if (flipped.includes(index) || matched.includes(cards[index].image)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(moves + 1);
            const [first, second] = newFlipped;
            if (cards[first].image === cards[second].image) {
                setMatched([...matched, cards[first].image]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    const handleRetry = () => {
        const cardImages = data.images || [];
        const doubled = [...cardImages, ...cardImages];
        const shuffled = doubled.sort(() => Math.random() - 0.5);
        setCards(shuffled.map((img, index) => ({ id: index, image: img })));
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setTimeLeft(data.timeLimit || 90);
        setGameStarted(false);
        setGameFailed(false);
    };

    if (gameFailed) {
        return (
            <div className="max-w-md mx-auto p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">⏰</div>
                    <h2 className="text-3xl font-elegant text-dark-text mb-4">
                        Time's Up!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You ran out of time! But don't worry, azizam - try again!
                    </p>
                    <Button onClick={handleRetry} variant="primary" className="w-full">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Timer and Moves */}
            <div className="flex justify-between items-center mb-6 bg-white rounded-2xl shadow-md p-4">
                <div className="text-center">
                    <p className="text-sm text-gray-600">Time Left</p>
                    <p className={`text-2xl font-bold ${timeLeft <= 20 ? 'text-red-600 animate-pulse' : 'text-romantic-pink'}`}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Moves</p>
                    <p className="text-2xl font-bold text-winter-blue">{moves}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Matched</p>
                    <p className="text-2xl font-bold text-accent-gold">{matched.length}/{data.images.length}</p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-4 gap-3">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        onClick={() => handleCardClick(index)}
                        className={`aspect-square rounded-xl flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${flipped.includes(index) || matched.includes(card.image)
                            ? 'bg-gradient-to-br from-romantic-pink to-accent-gold'
                            : 'bg-gradient-to-br from-gray-200 to-gray-300'
                            }`}
                    >
                        {(flipped.includes(index) || matched.includes(card.image)) && card.image}
                    </div>
                ))}
            </div>
        </div>
    );
};

MemoryMatchTimed.propTypes = {
    data: PropTypes.shape({
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        timeLimit: PropTypes.number,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default MemoryMatchTimed;
