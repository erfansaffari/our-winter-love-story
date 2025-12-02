/**
 * Geolocation utilities for GPS navigation
 */

/**
 * Request location permission from the user
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return false;
    }

    try {
        // Try to get current position to trigger permission prompt
        await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            });
        });
        return true;
    } catch (error) {
        console.error('Location permission denied:', error);
        return false;
    }
};

/**
 * Start watching user's location
 * @param {Function} onSuccess - Callback with position data
 * @param {Function} onError - Callback for errors
 * @returns {number} Watch ID for cleanup
 */
export const watchUserLocation = (onSuccess, onError) => {
    if (!navigator.geolocation) {
        onError(new Error('Geolocation not supported'));
        return null;
    }

    const watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );

    return watchId;
};

/**
 * Stop watching user's location
 * @param {number} watchId - Watch ID from watchUserLocation
 */
export const stopWatchingLocation = (watchId) => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return Math.round(distance); // Return distance in meters
};

/**
 * Calculate bearing from one coordinate to another
 * @param {number} lat1 - Latitude of start point
 * @param {number} lon1 - Longitude of start point
 * @param {number} lat2 - Latitude of end point
 * @param {number} lon2 - Longitude of end point
 * @returns {number} Bearing in degrees (0-360)
 */
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
        Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    const bearing = ((θ * 180) / Math.PI + 360) % 360;

    return bearing;
};

/**
 * Convert bearing to cardinal direction
 * @param {number} bearing - Bearing in degrees
 * @returns {string} Cardinal direction (e.g., "North", "Northeast")
 */
export const getCardinalDirection = (bearing) => {
    if (bearing >= 337.5 || bearing < 22.5) return 'North';
    if (bearing >= 22.5 && bearing < 67.5) return 'Northeast';
    if (bearing >= 67.5 && bearing < 112.5) return 'East';
    if (bearing >= 112.5 && bearing < 157.5) return 'Southeast';
    if (bearing >= 157.5 && bearing < 202.5) return 'South';
    if (bearing >= 202.5 && bearing < 247.5) return 'Southwest';
    if (bearing >= 247.5 && bearing < 292.5) return 'West';
    if (bearing >= 292.5 && bearing < 337.5) return 'Northwest';
    return 'North';
};

/**
 * Get direction arrow based on bearing
 * @param {number} bearing - Bearing in degrees
 * @returns {string} Arrow emoji
 */
export const getDirectionArrow = (bearing) => {
    if (bearing >= 337.5 || bearing < 22.5) return '⬆️';
    if (bearing >= 22.5 && bearing < 67.5) return '↗️';
    if (bearing >= 67.5 && bearing < 112.5) return '➡️';
    if (bearing >= 112.5 && bearing < 157.5) return '↘️';
    if (bearing >= 157.5 && bearing < 202.5) return '⬇️';
    if (bearing >= 202.5 && bearing < 247.5) return '↙️';
    if (bearing >= 247.5 && bearing < 292.5) return '⬅️';
    if (bearing >= 292.5 && bearing < 337.5) return '↖️';
    return '⬆️';
};

/**
 * Format distance for display
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance
 */
export const formatDistance = (meters) => {
    if (meters < 1000) {
        return `${meters}m`;
    } else {
        return `${(meters / 1000).toFixed(1)}km`;
    }
};

/**
 * Get encouragement message based on distance
 * @param {number} meters - Distance in meters
 * @returns {string} Encouragement message
 */
export const getEncouragementMessage = (meters) => {
    if (meters <= 25) return "You're here! Look around... 🎊";
    if (meters <= 50) return 'So close! Almost there! 🎉';
    if (meters <= 100) return 'Just around the corner! 💕';
    if (meters <= 200) return 'Getting warmer... Keep going! ✨';
    if (meters <= 500) return "You're doing great! 🚶‍♀️";
    return 'Off you go! Adventure awaits! 💖';
};
