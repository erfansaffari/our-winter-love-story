import imageCompression from 'browser-image-compression';

/**
 * Compress and convert image to base64
 * @param {File} file - Image file to compress
 * @returns {Promise<string>} Base64 encoded image string
 */
export const compressImage = async (file) => {
    const options = {
        maxSizeMB: 0.5, // 500KB max
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg',
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return fileToBase64(compressedFile);
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
    }
};

/**
 * Convert file to base64
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 string
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Handle file input and compress
 * @param {Event} event - File input change event
 * @returns {Promise<string>} Compressed base64 image
 */
export const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
    }

    return await compressImage(file);
};

/**
 * Get estimated size of base64 string in KB
 * @param {string} base64String - Base64 encoded string
 * @returns {number} Size in KB
 */
export const getBase64Size = (base64String) => {
    const sizeInBytes = (base64String.length * 3) / 4;
    return Math.round(sizeInBytes / 1024);
};
