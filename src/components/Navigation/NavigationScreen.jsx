import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import {
    requestLocationPermission,
    watchUserLocation,
    stopWatchingLocation,
    calculateDistance,
    calculateBearing,
    getCardinalDirection,
    getDirectionArrow,
    formatDistance,
    getEncouragementMessage,
} from '../../utils/geolocation';

const NavigationScreen = ({ destination, onArrival, onBack }) => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [distance, setDistance] = useState(null);
    const [direction, setDirection] = useState(null);
    const [arrow, setArrow] = useState('⬆️');
    const [error, setError] = useState(null);
    const [watchId, setWatchId] = useState(null);
    const [hasArrived, setHasArrived] = useState(false);

    // Request permission and start tracking
    useEffect(() => {
        const initializeNavigation = async () => {
            const granted = await requestLocationPermission();
            if (granted) {
                setPermissionGranted(true);
                startTracking();
            } else {
                setError('Location permission denied. Use manual check-in below.');
            }
        };

        initializeNavigation();

        // Cleanup on unmount
        return () => {
            if (watchId) {
                stopWatchingLocation(watchId);
            }
        };
    }, []);

    const startTracking = () => {
        const id = watchUserLocation(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                setCurrentPosition({ lat: userLat, lng: userLng });

                // Calculate distance and bearing
                const dist = calculateDistance(
                    userLat,
                    userLng,
                    destination.lat,
                    destination.lng
                );
                const bearing = calculateBearing(
                    userLat,
                    userLng,
                    destination.lat,
                    destination.lng
                );
                const dir = getCardinalDirection(bearing);
                const arr = getDirectionArrow(bearing);

                setDistance(dist);
                setDirection(dir);
                setArrow(arr);
                setError(null);

                // Check if arrived
                if (dist <= (destination.arrivalRadius || 25)) {
                    handleArrival();
                }
            },
            (err) => {
                console.error('Geolocation error:', err);
                setError('Unable to get your location. Use manual check-in below.');
            }
        );

        setWatchId(id);
    };

    const handleArrival = () => {
        if (!hasArrived) {
            setHasArrived(true);
            if (watchId) {
                stopWatchingLocation(watchId);
            }
            // Small delay for user to see "You're here!" message
            setTimeout(() => {
                onArrival();
            }, 2000);
        }
    };

    const handleManualCheckIn = () => {
        handleArrival();
    };

    if (hasArrived) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center p-6">
                <div className="max-w-md mx-auto text-center">
                    <div className="text-8xl mb-6 animate-bounce">🎉</div>
                    <h2 className="text-3xl font-elegant text-dark-text mb-4">
                        You found it!
                    </h2>
                    <p className="text-lg text-gray-600">
                        {destination.arrivalMessage || "You're here! 📍"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <div className="max-w-2xl mx-auto p-6">
                <button
                    onClick={onBack}
                    className="text-romantic-pink hover:text-pink-600 mb-4 flex items-center gap-2"
                >
                    ← Back
                </button>
            </div>

            {/* Navigation UI */}
            <div className="max-w-md mx-auto px-6">
                {error && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 text-center">{error}</p>
                    </div>
                )}

                {permissionGranted && distance !== null ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        {/* Direction Arrow */}
                        <div className="text-9xl mb-6 animate-pulse">{arrow}</div>

                        {/* Direction Text */}
                        <h2 className="text-2xl font-medium text-dark-text mb-2">
                            Head {direction}
                        </h2>

                        {/* Distance */}
                        <div className="text-5xl font-bold text-romantic-pink mb-6">
                            {formatDistance(distance)}
                        </div>

                        {/* Encouragement */}
                        <p className="text-lg text-gray-600 mb-6">
                            {getEncouragementMessage(distance)}
                        </p>

                        {/* GPS Status */}
                        <div className="text-sm text-gray-400 mb-4">
                            📍 GPS tracking active
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">📍</div>
                        <h2 className="text-xl font-medium text-dark-text mb-4">
                            Finding your location...
                        </h2>
                        <div className="animate-spin text-4xl">⟳</div>
                    </div>
                )}

                {/* Manual Check-in Button */}
                <div className="mt-6">
                    <Button
                        onClick={handleManualCheckIn}
                        variant="outline"
                        className="w-full"
                    >
                        I've Arrived (Manual Check-in)
                    </Button>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Use this if GPS isn't working
                    </p>
                </div>
            </div>
        </div>
    );
};

NavigationScreen.propTypes = {
    destination: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        arrivalRadius: PropTypes.number,
        arrivalMessage: PropTypes.string,
    }).isRequired,
    onArrival: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default NavigationScreen;
