import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import { compressAndConvertImage } from '../../utils/imageCompression';

const PhotoCaption = ({ data, onComplete }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [currentCaption, setCurrentCaption] = useState('');
    const [uploading, setUploading] = useState(false);

    const currentPrompt = data.requiredPhotos[currentPhotoIndex];
    const isLastPhoto = currentPhotoIndex === data.requiredPhotos.length - 1;

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const compressed = await compressAndConvertImage(file);
            setPhotos([...photos, { image: compressed, caption: '', prompt: currentPrompt.prompt }]);
        } catch (error) {
            console.error('Error compressing image:', error);
            alert('Failed to process image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleNext = () => {
        if (currentPrompt.captionRequired && !currentCaption.trim()) {
            alert('Please add a caption before continuing!');
            return;
        }

        // Update the current photo with caption
        const updatedPhotos = [...photos];
        updatedPhotos[currentPhotoIndex] = {
            ...updatedPhotos[currentPhotoIndex],
            caption: currentCaption,
        };
        setPhotos(updatedPhotos);

        if (isLastPhoto) {
            onComplete({ completed: true, photos: updatedPhotos });
        } else {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
            setCurrentCaption('');
        }
    };

    const currentPhoto = photos[currentPhotoIndex];

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                {/* Progress */}
                <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">
                        Photo {currentPhotoIndex + 1} of {data.requiredPhotos.length}
                    </p>
                    <div className="flex gap-2 justify-center mb-4">
                        {data.requiredPhotos.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 w-12 rounded-full ${index < currentPhotoIndex
                                        ? 'bg-accent-gold'
                                        : index === currentPhotoIndex
                                            ? 'bg-romantic-pink'
                                            : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Prompt */}
                <div className="bg-gradient-to-r from-romantic-pink/10 to-winter-blue/10 rounded-2xl p-6 mb-6">
                    <div className="text-center mb-4">
                        <span className="text-4xl">📸</span>
                    </div>
                    <p className="text-lg text-dark-text text-center font-medium">
                        {currentPrompt.prompt}
                    </p>
                    {currentPrompt.captionRequired && (
                        <p className="text-sm text-romantic-pink text-center mt-2">
                            * Caption required
                        </p>
                    )}
                </div>

                {/* Photo Upload/Preview */}
                {!currentPhoto ? (
                    <div className="mb-6">
                        <label
                            htmlFor="photo-upload"
                            className="block w-full p-8 border-2 border-dashed border-romantic-pink rounded-2xl text-center cursor-pointer hover:bg-romantic-pink/5 transition-colors"
                        >
                            <div className="text-5xl mb-3">📷</div>
                            <p className="text-dark-text font-medium mb-2">
                                {uploading ? 'Processing...' : 'Take or Upload Photo'}
                            </p>
                            <p className="text-sm text-gray-600">
                                Tap here to select a photo
                            </p>
                        </label>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileSelect}
                            disabled={uploading}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="mb-6">
                        <img
                            src={currentPhoto.image}
                            alt="Uploaded"
                            className="w-full rounded-2xl shadow-lg mb-4"
                        />
                        <label htmlFor="retake" className="text-sm text-romantic-pink underline cursor-pointer">
                            Retake photo
                        </label>
                        <input
                            id="retake"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                )}

                {/* Caption Input */}
                {currentPhoto && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-dark-text mb-2">
                            Add a caption {currentPrompt.captionRequired && <span className="text-romantic-pink">*</span>}
                        </label>
                        <textarea
                            value={currentCaption}
                            onChange={(e) => setCurrentCaption(e.target.value)}
                            placeholder="Write something about this photo..."
                            maxLength={100}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-romantic-pink focus:outline-none resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1 text-right">
                            {currentCaption.length}/100 characters
                        </p>
                    </div>
                )}

                {/* Next Button */}
                {currentPhoto && (
                    <Button onClick={handleNext} variant="primary" className="w-full">
                        {isLastPhoto ? 'Complete ✓' : 'Next Photo →'}
                    </Button>
                )}
            </div>
        </div>
    );
};

PhotoCaption.propTypes = {
    data: PropTypes.shape({
        requiredPhotos: PropTypes.arrayOf(
            PropTypes.shape({
                prompt: PropTypes.string.isRequired,
                captionRequired: PropTypes.bool,
            })
        ).isRequired,
    }).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default PhotoCaption;
