import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import { compressAndConvertImage } from '../../utils/imageCompression';

const FinalPhotos = ({ data, onComplete }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [currentCaption, setCurrentCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

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
        // Update the current photo with caption
        const updatedPhotos = [...photos];
        updatedPhotos[currentPhotoIndex] = {
            ...updatedPhotos[currentPhotoIndex],
            caption: currentCaption,
        };
        setPhotos(updatedPhotos);

        if (isLastPhoto) {
            setShowGallery(true);
        } else {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
            setCurrentCaption('');
        }
    };

    const handleComplete = () => {
        onComplete({ completed: true, photos });
    };

    const currentPhoto = photos[currentPhotoIndex];

    if (showGallery) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">📸</div>
                        <h2 className="text-2xl font-elegant text-dark-text mb-2">
                            Our Final Memories
                        </h2>
                        <p className="text-gray-600">
                            Preview your photos before finishing
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {photos.map((photo, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden shadow-md">
                                <img
                                    src={photo.image}
                                    alt={photo.prompt}
                                    className="w-full aspect-square object-cover"
                                />
                                {photo.caption && (
                                    <div className="p-3">
                                        <p className="text-sm text-dark-text italic">
                                            &quot;{photo.caption}&quot;
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button onClick={handleComplete} variant="primary" className="w-full">
                        Looks Good! Complete ✨
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                {/* Progress */}
                <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">
                        Final Photo {currentPhotoIndex + 1} of {data.requiredPhotos.length}
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
                <div className="bg-gradient-to-r from-romantic-pink/10 to-accent-gold/10 rounded-2xl p-6 mb-6">
                    <div className="text-center mb-4">
                        <span className="text-4xl">💕</span>
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
                            htmlFor="final-photo-upload"
                            className="block w-full p-8 border-2 border-dashed border-romantic-pink rounded-2xl text-center cursor-pointer hover:bg-romantic-pink/5 transition-colors"
                        >
                            <div className="text-5xl mb-3">📷</div>
                            <p className="text-dark-text font-medium mb-2">
                                {uploading ? 'Processing...' : 'Take Photo'}
                            </p>
                            <p className="text-sm text-gray-600">
                                Capture this special moment
                            </p>
                        </label>
                        <input
                            id="final-photo-upload"
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
                        <label htmlFor="retake-final" className="text-sm text-romantic-pink underline cursor-pointer">
                            Retake photo
                        </label>
                        <input
                            id="retake-final"
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
                            {currentPrompt.captionRequired ? 'Add a caption *' : 'Add a caption (optional)'}
                        </label>
                        <textarea
                            value={currentCaption}
                            onChange={(e) => setCurrentCaption(e.target.value)}
                            placeholder="Write something about this moment..."
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
                    <Button
                        onClick={handleNext}
                        variant="primary"
                        className="w-full"
                        disabled={currentPrompt.captionRequired && !currentCaption.trim()}
                    >
                        {isLastPhoto ? 'Preview All Photos →' : 'Next Photo →'}
                    </Button>
                )}
            </div>
        </div>
    );
};

FinalPhotos.propTypes = {
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

export default FinalPhotos;
