import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import Confetti from '../UI/Confetti';
import { getTimeUntil } from '../../utils/levelLogic';

const RewardScreen = ({ level, rewards, onContinue, onStartNavigation }) => {
    const [showConfetti, setShowConfetti] = useState(true);
    const [timeInfo, setTimeInfo] = useState(null);

    useEffect(() => {
        if (rewards.time) {
            setTimeInfo(getTimeUntil(rewards.time));
            const interval = setInterval(() => {
                setTimeInfo(getTimeUntil(rewards.time));
            }, 60000); // Update every minute
            return () => clearInterval(interval);
        }
    }, [rewards.time]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-romantic-pink/20 to-winter-blue/20 flex items-center justify-center p-6">
            <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />

            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-up">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4 animate-bounce-soft">🎉</div>
                        <h2 className="text-3xl font-elegant text-dark-text mb-2">
                            Level Complete!
                        </h2>
                        <p className="text-romantic-pink font-medium">
                            {level.title}
                        </p>
                    </div>

                    {rewards.location && (
                        <div className="bg-gradient-to-r from-pink-50 to-blue-50 p-6 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">📍</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-dark-text mb-1">Next Location</h3>
                                    <p className="text-dark-text">{rewards.location}</p>
                                    {/* Only show address if no destination (no GPS navigation) */}
                                    {!rewards.destination && rewards.address && (
                                        <p className="text-sm text-gray-600 mt-1">{rewards.address}</p>
                                    )}
                                    {rewards.destination && (
                                        <p className="text-sm text-romantic-pink mt-1">📍 GPS navigation available!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {rewards.time && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">⏰</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-dark-text mb-1">Time</h3>
                                    <p className="text-dark-text">{rewards.time}</p>
                                    {timeInfo && !timeInfo.passed && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Be there in: {timeInfo.formatted}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {rewards.dressCode && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">👗</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-dark-text mb-1">Dress Code</h3>
                                    <p className="text-dark-text">{rewards.dressCode}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {rewards.activity && (
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🎨</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-dark-text mb-1">Activity</h3>
                                    <p className="text-dark-text">{rewards.activity}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {rewards.message && (
                        <div className="bg-gradient-to-r from-romantic-pink/10 to-accent-gold/10 p-6 rounded-xl border-2 border-romantic-pink/30">
                            <div className="text-center">
                                <span className="text-3xl mb-2 block">💕</span>
                                <p className="text-dark-text italic leading-relaxed">
                                    &quot;{rewards.message}&quot;
                                </p>
                            </div>
                        </div>
                    )}

                    {rewards.nextHint && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 italic text-center">
                                {rewards.nextHint}
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation or Continue Button */}
                <div className="space-y-3">
                    {rewards.destination && onStartNavigation ? (
                        <>
                            <Button onClick={onStartNavigation} variant="primary" className="w-full">
                                🗺️ Start Navigation
                            </Button>
                            <Button onClick={onContinue} variant="outline" className="w-full">
                                Skip Navigation
                            </Button>
                        </>
                    ) : (
                        <Button onClick={onContinue} variant="primary" className="w-full">
                            Continue to Next Level
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

RewardScreen.propTypes = {
    level: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string.isRequired,
    }).isRequired,
    rewards: PropTypes.shape({
        location: PropTypes.string,
        address: PropTypes.string,
        time: PropTypes.string,
        dressCode: PropTypes.string,
        activity: PropTypes.string,
        message: PropTypes.string,
        nextHint: PropTypes.string,
        destination: PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number,
            arrivalRadius: PropTypes.number,
        }),
        navigation: PropTypes.shape({
            startMessage: PropTypes.string,
            arrivalMessage: PropTypes.string,
        }),
    }).isRequired,
    onContinue: PropTypes.func.isRequired,
    onStartNavigation: PropTypes.func,
};

export default RewardScreen;
