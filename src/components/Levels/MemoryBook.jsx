import PropTypes from 'prop-types';
import Button from '../UI/Button';
import { getAllPhotos, loadProgress } from '../../utils/storage';

const MemoryBook = ({ config, onClose }) => {
    const allPhotos = getAllPhotos();
    const progress = loadProgress();

    return (
        <div className="min-h-screen bg-gradient-to-br from-romantic-pink/10 via-cream to-winter-blue/10 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-elegant text-dark-text mb-4">
                        💖 Our Memory Book 💖
                    </h1>
                    <p className="text-xl text-gray-600">
                        {config.appTitle || 'Our Winter Love Story'}
                    </p>
                </div>

                {/* Final Letter */}
                {config.levels?.[7]?.storyText && (
                    <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                        <div className="text-center mb-6">
                            <span className="text-5xl">💌</span>
                        </div>
                        <p className="text-lg leading-relaxed text-dark-text text-center font-clean">
                            {config.levels[7].storyText}
                        </p>
                    </div>
                )}

                {/* Photo Gallery */}
                {allPhotos.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-elegant text-center mb-6">
                            📸 Our Photos
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {allPhotos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                                >
                                    <img
                                        src={photo}
                                        alt={`Memory ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Story Points */}
                {progress.storyPoints && progress.storyPoints.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-elegant text-center mb-6">
                            ✨ Our Story
                        </h2>
                        <div className="space-y-4">
                            {progress.storyPoints.map((story, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >
                                    <p className="text-dark-text leading-relaxed">
                                        {story}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Music Playlist */}
                {config.playlist?.embedUrl && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-elegant text-center mb-6">
                            🎵 Our Soundtrack
                        </h2>
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <iframe
                                src={config.playlist.embedUrl}
                                width="100%"
                                height="380"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                title="Playlist"
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Final Message */}
                {config.levels?.[7]?.rewards?.finalMessage && (
                    <div className="bg-gradient-to-r from-romantic-pink/20 to-accent-gold/20 rounded-3xl shadow-xl p-8 mb-8">
                        <div className="text-center">
                            <span className="text-6xl mb-4 block">🌟</span>
                            <p className="text-2xl font-elegant text-dark-text mb-4">
                                {config.levels[7].rewards.finalMessage}
                            </p>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-2xl font-elegant text-center mb-4">
                        Journey Stats
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-3xl font-bold text-romantic-pink">
                                {progress.completedLevels.length}
                            </div>
                            <div className="text-sm text-gray-600">Levels Completed</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-winter-blue">
                                {allPhotos.length}
                            </div>
                            <div className="text-sm text-gray-600">Photos Captured</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-accent-gold">
                                {progress.storyPoints?.length || 0}
                            </div>
                            <div className="text-sm text-gray-600">Stories Collected</div>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                {onClose && (
                    <Button onClick={onClose} variant="primary" className="w-full">
                        Close Memory Book
                    </Button>
                )}

                {/* Footer */}
                <div className="text-center mt-12 pb-8">
                    <p className="text-gray-500 text-sm">
                        Created with 💕 on {new Date(progress.startTime).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

MemoryBook.propTypes = {
    config: PropTypes.object.isRequired,
    onClose: PropTypes.func,
};

export default MemoryBook;
