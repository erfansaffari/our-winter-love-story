import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import { compressImage } from '../../utils/imageCompression';

const PhotoHunt = ({ items, onComplete }) => {
    const [uploadedPhotos, setUploadedPhotos] = useState({});
    const [uploading, setUploading] = useState(null);
    const fileInputRefs = useRef({});

    const handlePhotoUpload = async (itemIndex, event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(itemIndex);
        try {
            const compressedImage = await compressImage(file);
            setUploadedPhotos({
                ...uploadedPhotos,
                [itemIndex]: compressedImage,
            });
        } catch (error) {
            alert('Error uploading photo. Please try again.');
        } finally {
            setUploading(null);
        }
    };

    const handleComplete = () => {
        const allItemsFound = items.every((_, index) => uploadedPhotos[index]);
        if (allItemsFound) {
            onComplete({
                itemsFound: items.map((_, index) => !!uploadedPhotos[index]),
                photos: Object.values(uploadedPhotos),
            });
        }
    };

    const allUploaded = items.every((_, index) => uploadedPhotos[index]);

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <h3 className="text-2xl font-elegant text-center mb-4">
                Photo Scavenger Hunt
            </h3>
            <p className="text-center text-gray-600 mb-8">
                Find and photograph each of these items:
            </p>

            <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`bg-white p-4 rounded-lg shadow-md border-2 transition-all ${uploadedPhotos[index]
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${uploadedPhotos[index]
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200'
                                        }`}
                                >
                                    {uploadedPhotos[index] && '✓'}
                                </div>
                                <span className="font-medium">{item}</span>
                            </div>
                        </div>

                        {uploadedPhotos[index] ? (
                            <div className="relative">
                                <img
                                    src={uploadedPhotos[index]}
                                    alt={item}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => {
                                        const newPhotos = { ...uploadedPhotos };
                                        delete newPhotos[index];
                                        setUploadedPhotos(newPhotos);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    ref={(el) => (fileInputRefs.current[index] = el)}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => handlePhotoUpload(index, e)}
                                    className="hidden"
                                />
                                <Button
                                    variant="secondary"
                                    onClick={() => fileInputRefs.current[index]?.click()}
                                    loading={uploading === index}
                                    className="w-full text-sm"
                                >
                                    {uploading === index ? 'Uploading...' : '📷 Take Photo'}
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Button
                onClick={handleComplete}
                variant="primary"
                disabled={!allUploaded}
                className="w-full"
            >
                {allUploaded ? 'Complete Challenge! 🎉' : `${Object.keys(uploadedPhotos).length}/${items.length} Photos`}
            </Button>
        </div>
    );
};

PhotoHunt.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default PhotoHunt;
