import { useEffect, useState } from 'react';

const Confetti = ({ show, onComplete }) => {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        if (show) {
            // Create confetti pieces
            const newPieces = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 2,
                color: ['#FFB6C1', '#FFD700', '#B0E0E6', '#FF69B4', '#FFA07A'][
                    Math.floor(Math.random() * 5)
                ],
                shape: Math.random() > 0.5 ? '❤️' : '✨',
            }));

            setPieces(newPieces);

            // Clear after animation
            const timer = setTimeout(() => {
                setPieces([]);
                if (onComplete) onComplete();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    if (!show || pieces.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="confetti-piece text-2xl"
                    style={{
                        left: `${piece.left}%`,
                        animationDelay: `${piece.delay}s`,
                        backgroundColor: piece.shape === '✨' ? piece.color : 'transparent',
                    }}
                >
                    {piece.shape}
                </div>
            ))}
        </div>
    );
};

export default Confetti;
