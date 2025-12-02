import { useState, useEffect } from 'react';
import configData from './data/config.json';
import { loadProgress, saveProgress, completeLevel, savePhotos, saveStoryPoint } from './utils/storage';
import ProgressBar from './components/UI/ProgressBar';
import LevelCard from './components/Levels/LevelCard';
import LevelScreen from './components/Levels/LevelScreen';
import RewardScreen from './components/Levels/RewardScreen';
import MemoryBook from './components/Levels/MemoryBook';
import './index.css';

function App() {
  const [config] = useState(configData);
  const [progress, setProgress] = useState(loadProgress());
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'level', 'reward', 'memorybook'
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    // Save progress whenever it changes
    saveProgress(progress);
  }, [progress]);

  const handleStartLevel = (level) => {
    setSelectedLevel(level);
    setCurrentScreen('level');
  };

  const handleLevelComplete = (result) => {
    setGameResult(result);

    // Save photos if any
    if (result.photos && result.photos.length > 0) {
      savePhotos(selectedLevel.id, result.photos);
    }

    // Save story if it's mad libs
    if (result.story) {
      saveStoryPoint(result.story);
    }

    // For level 8, mark as complete and go straight to memory book
    if (selectedLevel.id === 8) {
      const newProgress = completeLevel(selectedLevel.id);
      setProgress(newProgress);
      setCurrentScreen('memorybook');
    } else {
      setCurrentScreen('reward');
    }
  };

  const handleRewardContinue = () => {
    // Mark level as complete
    const newProgress = completeLevel(selectedLevel.id);
    setProgress(newProgress);

    // Save story point from reward message if exists
    const reward = selectedLevel.rewards;
    if (reward?.message) {
      saveStoryPoint(reward.message);
    }

    setSelectedLevel(null);
    setGameResult(null);
    setCurrentScreen('home');
  };

  const handleBackToHome = () => {
    setSelectedLevel(null);
    setGameResult(null);
    setCurrentScreen('home');
  };

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-cream">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-romantic-pink via-white to-winter-blue py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-elegant text-dark-text mb-4 animate-fade-in">
              {config.appTitle}
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-slide-up">
              A romantic adventure awaits you, {config.partnerName} 💕
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <ProgressBar
                current={progress.currentLevel}
                total={config.levels.length}
              />
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.levels.map((level) => (
              <LevelCard
                key={level.id}
                level={level}
                currentLevel={progress.currentLevel}
                completedLevels={progress.completedLevels}
                onStart={() => handleStartLevel(level)}
              />
            ))}
          </div>

          {/* Memory Book Access (if completed) */}
          {progress.completedLevels.includes(8) && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setCurrentScreen('memorybook')}
                className="bg-gradient-to-r from-romantic-pink to-accent-gold text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                📖 View Memory Book
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-16 text-center text-gray-500 text-sm">
            <p>Made with 💕 for the most special person</p>
          </div>
        </div>
      </div>
    );
  }

  // Level Screen
  if (currentScreen === 'level' && selectedLevel) {
    return (
      <LevelScreen
        level={selectedLevel}
        onComplete={handleLevelComplete}
        onBack={handleBackToHome}
      />
    );
  }

  // Reward Screen
  if (currentScreen === 'reward' && selectedLevel) {
    return (
      <RewardScreen
        level={selectedLevel}
        rewards={selectedLevel.rewards}
        onContinue={handleRewardContinue}
      />
    );
  }

  // Memory Book
  if (currentScreen === 'memorybook') {
    return (
      <MemoryBook
        config={config}
        onClose={handleBackToHome}
      />
    );
  }

  return null;
}

export default App;
