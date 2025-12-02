/**
 * Check if a mini-game has been completed successfully
 * @param {string} gameType - Type of mini-game
 * @param {any} result - Game result data
 * @returns {boolean} Whether game was completed successfully
 */
export const isGameCompleted = (gameType, result) => {
    // Handle Level 8 or any level with no mini-game
    if (!gameType && result.completed === true) {
        return true;
    }

    switch (gameType) {
        case 'word-scramble':
            return result.correct === true;

        case 'photo-hunt':
            return result.itemsFound && result.itemsFound.every((item) => item);

        case 'memory-match':
            return result.allMatched === true;

        case 'trivia':
            const passingScore = result.passingScore || 4;
            return result.score >= passingScore;

        case 'madlibs':
            return result.completed === true;

        case 'color-match':
            return result.allMatched === true;

        default:
            return false;
    }
};

/**
 * Calculate time until a specific time
 * @param {string} targetTime - Target time (e.g., "10:30 AM")
 * @returns {object} Time remaining object
 */
export const getTimeUntil = (targetTime) => {
    if (!targetTime) return null;

    try {
        const now = new Date();
        const [time, period] = targetTime.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        let targetHours = hours;
        if (period === 'PM' && hours !== 12) targetHours += 12;
        if (period === 'AM' && hours === 12) targetHours = 0;

        const target = new Date();
        target.setHours(targetHours, minutes, 0, 0);

        const diff = target - now;

        if (diff < 0) {
            return { passed: true, minutesRemaining: 0 };
        }

        const minutesRemaining = Math.floor(diff / 1000 / 60);
        const hoursRemaining = Math.floor(minutesRemaining / 60);
        const mins = minutesRemaining % 60;

        return {
            passed: false,
            minutesRemaining,
            hoursRemaining,
            minsRemaining: mins,
            formatted: hoursRemaining > 0
                ? `${hoursRemaining}h ${mins}m`
                : `${mins}m`,
        };
    } catch (error) {
        console.error('Error calculating time:', error);
        return null;
    }
};

/**
 * Validate level progression
 * @param {number} currentLevel - Current level number
 * @param {number} targetLevel - Level user is trying to access
 * @param {Array} completedLevels - Array of completed level numbers
 * @returns {boolean} Whether user can access target level
 */
export const canAccessLevel = (currentLevel, targetLevel, completedLevels) => {
    // Can always access level 1
    if (targetLevel === 1) return true;

    // Can access if previous level is completed
    return completedLevels.includes(targetLevel - 1);
};

/**
 * Generate congratulations message based on level
 * @param {number} levelNumber - Level number
 * @returns {string} Congratulations message
 */
export const getCongratulationsMessage = (levelNumber) => {
    const messages = {
        1: "Amazing! Ready for the next adventure? 💕",
        2: "You did it! The journey continues... 🌟",
        3: "Perfect! You're doing great! 📸",
        4: "Wonderful! Keep going! 🎨",
        5: "Fantastic! Almost there! ✨",
        6: "Beautiful! The best is yet to come! 🌅",
        7: "Incredible! One more to go! 🎉",
        8: "You completed our entire adventure! 💖",
    };

    return messages[levelNumber] || "Great job! 🎊";
};
