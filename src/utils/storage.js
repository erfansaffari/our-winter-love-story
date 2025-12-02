// localStorage utilities for progress tracking

/**
 * Save current progress to localStorage
 */
export const saveProgress = (data) => {
    try {
        localStorage.setItem('winterLoveStory', JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving progress:', error);
        return false;
    }
};

/**
 * Load progress from localStorage
 */
export const loadProgress = () => {
    try {
        const data = localStorage.getItem('winterLoveStory');
        return data ? JSON.parse(data) : getInitialProgress();
    } catch (error) {
        console.error('Error loading progress:', error);
        return getInitialProgress();
    }
};

/**
 * Get initial progress structure
 */
export const getInitialProgress = () => ({
    currentLevel: 1,
    completedLevels: [],
    uploadedPhotos: {},
    gameProgress: {},
    startTime: new Date().toISOString(),
    storyPoints: [],
});

/**
 * Mark a level as completed
 */
export const completeLevel = (levelNumber) => {
    const progress = loadProgress();
    if (!progress.completedLevels.includes(levelNumber)) {
        progress.completedLevels.push(levelNumber);
        progress.currentLevel = levelNumber + 1;
    }
    saveProgress(progress);
    return progress;
};

/**
 * Check if a level is unlocked
 */
export const isLevelUnlocked = (levelNumber) => {
    const progress = loadProgress();
    // Level 1 is always unlocked
    if (levelNumber === 1) return true;
    // A level is unlocked if the previous level is completed
    return progress.completedLevels.includes(levelNumber - 1);
};

/**
 * Save game score for a level
 */
export const saveGameScore = (levelNumber, score) => {
    const progress = loadProgress();
    progress.gameProgress[`level${levelNumber}`] = score;
    saveProgress(progress);
};

/**
 * Save uploaded photos for a level
 */
export const savePhotos = (levelNumber, photos) => {
    const progress = loadProgress();
    progress.uploadedPhotos[`level${levelNumber}`] = photos;
    saveProgress(progress);
};

/**
 * Get all uploaded photos
 */
export const getAllPhotos = () => {
    const progress = loadProgress();
    const allPhotos = [];
    Object.values(progress.uploadedPhotos).forEach((levelPhotos) => {
        allPhotos.push(...levelPhotos);
    });
    return allPhotos;
};

/**
 * Save a story point
 */
export const saveStoryPoint = (story) => {
    const progress = loadProgress();
    if (!progress.storyPoints.includes(story)) {
        progress.storyPoints.push(story);
        saveProgress(progress);
    }
};

/**
 * Reset all progress
 */
export const resetProgress = () => {
    localStorage.removeItem('winterLoveStory');
    return getInitialProgress();
};
