// src/utils/fileUtils.js

/**
 * File validation utilities
 */

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
    RESUME: 5 * 1024 * 1024, // 5MB
    PORTFOLIO: 10 * 1024 * 1024, // 10MB
    AVATAR: 2 * 1024 * 1024, // 2MB
    DOCUMENT: 5 * 1024 * 1024 // 5MB
};

// Allowed file types
export const ALLOWED_FILE_TYPES = {
    RESUME: ['.pdf', '.doc', '.docx'],
    PORTFOLIO: ['.pdf', '.doc', '.docx', '.zip', '.rar', '.png', '.jpg', '.jpeg'],
    AVATAR: ['.png', '.jpg', '.jpeg', '.gif'],
    DOCUMENT: ['.pdf', '.doc', '.docx', '.txt']
};

// MIME types mapping
export const MIME_TYPES = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.txt': 'text/plain'
};

/**
 * Validate file size
 */
export const validateFileSize = (file, fileType) => {
    const limit = FILE_SIZE_LIMITS[fileType.toUpperCase()] || FILE_SIZE_LIMITS.DOCUMENT;

    if (file.size > limit) {
        const limitMB = Math.round(limit / (1024 * 1024));
        return {
            isValid: false,
            error: `File size must be less than ${limitMB}MB`
        };
    }

    return { isValid: true };
};

/**
 * Validate file type
 */
export const validateFileType = (file, fileType) => {
    const allowedTypes = ALLOWED_FILE_TYPES[fileType.toUpperCase()] || ALLOWED_FILE_TYPES.DOCUMENT;
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
        return {
            isValid: false,
            error: `File must be one of: ${allowedTypes.join(', ')}`
        };
    }

    return { isValid: true };
};

/**
 * Comprehensive file validation
 */
export const validateFile = (file, fileType) => {
    if (!file) {
        return {
            isValid: false,
            error: 'No file selected'
        };
    }

    // Check file size
    const sizeValidation = validateFileSize(file, fileType);
    if (!sizeValidation.isValid) {
        return sizeValidation;
    }

    // Check file type
    const typeValidation = validateFileType(file, fileType);
    if (!typeValidation.isValid) {
        return typeValidation;
    }

    return { isValid: true };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
    return '.' + filename.split('.').pop().toLowerCase();
};

/**
 * Get file type from extension
 */
export const getFileTypeFromExtension = (extension) => {
    const imageTypes = ['.png', '.jpg', '.jpeg', '.gif'];
    const documentTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const archiveTypes = ['.zip', '.rar'];

    if (imageTypes.includes(extension)) return 'image';
    if (documentTypes.includes(extension)) return 'document';
    if (archiveTypes.includes(extension)) return 'archive';

    return 'unknown';
};

/**
 * Create file preview
 */
export const createFilePreview = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                extension: getFileExtension(file.name),
                preview: e.target.result,
                lastModified: file.lastModified
            });
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        // For images, create data URL preview
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            // For other files, just resolve with basic info
            resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                extension: getFileExtension(file.name),
                preview: null,
                lastModified: file.lastModified
            });
        }
    });
};

/**
 * Convert file to base64
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result.split(',')[1]); // Remove data:*/*;base64, prefix
        };

        reader.onerror = () => {
            reject(new Error('Failed to convert file to base64'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Upload file to cloud storage (mock implementation)
 */
export const uploadFileToCloud = async (file, folder = 'uploads') => {
    try {
        // Validate file first
        const validation = validateFile(file, 'document');
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        // Mock upload process
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        // In a real app, you'd upload to Cloudinary, AWS S3, etc.
        // For now, create a mock URL
        const mockUrl = `https://mock-storage.com/${folder}/${Date.now()}-${file.name}`;

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            url: mockUrl,
            publicId: `${folder}/${Date.now()}-${file.name}`,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        };
    } catch (error) {
        console.error('File upload error:', error);
        throw new Error(error.message || 'Failed to upload file');
    }
};

/**
 * Download file
 */
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * File input utilities
 */
export const createFileInput = (accept, multiple = false, onFileSelect) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = 'none';

    input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        onFileSelect(files);

        // Reset input so same file can be selected again
        input.value = '';
    });

    document.body.appendChild(input);

    return {
        open: () => input.click(),
        destroy: () => document.body.removeChild(input)
    };
};

/**
 * Drag and drop utilities
 */
export const setupDragAndDrop = (element, onFilesDrop, allowedTypes = []) => {
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        element.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('drag-over');

        const files = Array.from(e.dataTransfer.files);

        // Filter files by allowed types if specified
        const filteredFiles = allowedTypes.length > 0
            ? files.filter(file => {
                const extension = getFileExtension(file.name);
                return allowedTypes.includes(extension);
            })
            : files;

        onFilesDrop(filteredFiles);
    };

    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    // Return cleanup function
    return () => {
        element.removeEventListener('dragover', handleDragOver);
        element.removeEventListener('dragleave', handleDragLeave);
        element.removeEventListener('drop', handleDrop);
    };
};

/**
 * File compression utilities
 */
export const compressImage = (file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            resolve(file); // Return original file if not an image
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                },
                file.type,
                quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
};

export default {
    validateFile,
    validateFileSize,
    validateFileType,
    formatFileSize,
    getFileExtension,
    getFileTypeFromExtension,
    createFilePreview,
    fileToBase64,
    uploadFileToCloud,
    downloadFile,
    createFileInput,
    setupDragAndDrop,
    compressImage,
    FILE_SIZE_LIMITS,
    ALLOWED_FILE_TYPES,
    MIME_TYPES
};