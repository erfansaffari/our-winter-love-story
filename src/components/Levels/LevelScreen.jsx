import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import WordScramble from '../MiniGames/WordScramble';
import PhotoHunt from '../MiniGames/PhotoHunt';
import MemoryMatch from '../MiniGames/MemoryMatch';
import Trivia from '../MiniGames/Trivia';
import MadLibs from '../MiniGames/MadLibs';
import ColorMatch from '../MiniGames/ColorMatch';
import DirectionPuzzle from '../MiniGames/DirectionPuzzle';
import MemoryMatchTimed from '../MiniGames/MemoryMatchTimed';
import PhotoCaption from '../MiniGames/PhotoCaption';
import TriviaHard from '../MiniGames/TriviaHard';
import MovieGuess from '../MiniGames/MovieGuess';
import SpeedTrivia from '../MiniGames/SpeedTrivia';
import FinalPhotos from '../MiniGames/FinalPhotos';
import { isGameCompleted } from '../../utils/levelLogic';

const LevelScreen = ({ level, onComplete, onBack }) => {
    const [gameStarted, setGameStarted] = useState(false);

    const handleGameComplete = (result) => {
        const completed = isGameCompleted(level.miniGame?.type, result);
        if (completed) {
            onComplete(result);
        }
    };

    const renderMiniGame = () => {
        if (!level.miniGame) return null;

        const { type, data } = level.miniGame;

        switch (type) {
            case 'word-scramble':
                return (
                    <WordScramble
                        scrambled={data.scrambled}
                        answer={data.answer}
                        hint={data.hint}
                        onComplete={handleGameComplete}
                    />
                );

            case 'photo-hunt':
                return (
                    <PhotoHunt
                        items={data.items}
                        onComplete={handleGameComplete}
                    />
                );

            case 'memory-match':
                return (
                    <MemoryMatch
                        images={data.images}
                        onComplete={handleGameComplete}
                    />
                );

            case 'trivia':
                return (
                    <Trivia
                        questions={data.questions}
                        passingScore={data.passingScore}
                        onComplete={handleGameComplete}
                    />
                );

            case 'madlibs':
                return (
                    <MadLibs
                        template={data.template}
                        prompts={data.prompts}
                        onComplete={handleGameComplete}
                    />
                );

            case 'color-match':
                return (
                    <ColorMatch
                        pairs={data.pairs}
                        onComplete={handleGameComplete}
                    />
                );

            case 'direction-puzzle':
                return <DirectionPuzzle data={data} onComplete={handleGameComplete} />;

            case 'memory-match-timed':
                return <MemoryMatchTimed data={data} onComplete={handleGameComplete} />;

            case 'photo-caption':
                return <PhotoCaption data={data} onComplete={handleGameComplete} />;

            case 'trivia-hard':
                return <TriviaHard data={data} onComplete={handleGameComplete} />;

            case 'movie-guess':
                return <MovieGuess data={data} onComplete={handleGameComplete} />;

            case 'speed-trivia':
                return <SpeedTrivia data={data} onComplete={handleGameComplete} />;

            case 'final-photos':
                return <FinalPhotos data={data} onComplete={handleGameComplete} />;

            default:
                return <p className="text-center text-gray-600">Unknown game type: {type}</p>;
        }
    };

    return (
        <div className="min-h-screen bg-cream p-6">
            {/* Header */}
            <div className="max-w-2xl mx-auto mb-6">
                <button
                    onClick={onBack}
                    className="text-romantic-pink hover:text-pink-600 mb-4 flex items-center gap-2"
                >
                    ← Back
                </button>
                <h2 className="text-3xl font-elegant text-center mb-2">
                    Level {level.id}: {level.title}
                </h2>
            </div>

            {/* Story Text */}
            {!gameStarted && (
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                        <div className="text-center mb-6">
                            <span className="text-5xl mb-4 block">📖</span>
                        </div>
                        <p className="text-lg leading-relaxed text-dark-text text-center mb-6">
                            {level.storyText}
                        </p>
                        <Button
                            onClick={() => {
                                if (!level.miniGame) {
                                    handleGameComplete({ completed: true });
                                } else {
                                    setGameStarted(true);
                                }
                            }}
                            variant="primary"
                            className="w-full"
                        >
                            {level.miniGame ? 'Start Challenge' : 'Continue'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Mini-game */}
            {gameStarted && (
                <div className="max-w-2xl mx-auto">
                    {level.miniGame ? (
                        renderMiniGame()
                    ) : (
                        <div className="text-center">
                            <p className="text-lg mb-4">No mini-game for this level.</p>
                            <Button onClick={() => handleGameComplete({ completed: true })} variant="primary">
                                Continue
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

LevelScreen.propTypes = {
    level: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        storyText: PropTypes.string.isRequired,
        miniGame: PropTypes.object,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default LevelScreen;
