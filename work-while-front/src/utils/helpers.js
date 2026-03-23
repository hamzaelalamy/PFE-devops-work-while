// src/utils/helpers.js

/**
 * General utility functions
 */

/**
 * Format date for display
 */
export const formatDate = (date, format = 'full') => {
    if (!date) return '';

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) return '';

    const options = {
        full: { year: 'numeric', month: 'long', day: 'numeric' },
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        numeric: { year: 'numeric', month: '2-digit', day: '2-digit' },
        time: { hour: '2-digit', minute: '2-digit' },
        datetime: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    };

    return dateObj.toLocaleDateString('en-US', options[format] || options.full);
};

/**
 * Format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const dateObj = new Date(date);
    const diffMs = now - dateObj;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 30) {
        return formatDate(date, 'short');
    } else if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
};

/**
 * Format salary for display
 */
export const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';

    const { min, max, currency = 'MAD', period = 'monthly' } = salary;

    const formatAmount = (amount) => {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + 'K';
        }
        return amount.toString();
    };

    const periodText = {
        hourly: '/hour',
        monthly: '/month',
        yearly: '/year'
    };

    if (min && max) {
        return `${formatAmount(min)} - ${formatAmount(max)} ${currency}${periodText[period] || ''}`;
    } else if (min) {
        return `From ${formatAmount(min)} ${currency}${periodText[period] || ''}`;
    } else if (max) {
        return `Up to ${formatAmount(max)} ${currency}${periodText[period] || ''}`;
    }

    return 'Salary not specified';
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
    if (!num && num !== 0) return '';
    return num.toLocaleString();
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert to title case
 */
export const toTitleCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(capitalize).join(' ');
};

/**
 * Generate initials from name
 */
export const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
};

/**
 * Generate random ID
 */
export const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

/**
 * Throttle function
 */
export const throttle = (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return (...args) => {
        const currentTime = Date.now();

        if (currentTime - lastExecTime > delay) {
            func.apply(null, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(null, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
    if (obj == null) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    if (typeof obj === 'string') return obj.trim().length === 0;
    return false;
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const value = typeof key === 'function' ? key(item) : item[key];
        const group = groups[value] || [];
        group.push(item);
        groups[value] = group;
        return groups;
    }, {});
};

/**
 * Sort array by multiple keys
 */
export const sortBy = (array, ...keys) => {
    return array.sort((a, b) => {
        for (const key of keys) {
            const direction = key.startsWith('-') ? -1 : 1;
            const prop = key.replace(/^-/, '');

            let aValue = a[prop];
            let bValue = b[prop];

            // Handle nested properties
            if (prop.includes('.')) {
                aValue = prop.split('.').reduce((obj, p) => obj?.[p], a);
                bValue = prop.split('.').reduce((obj, p) => obj?.[p], b);
            }

            if (aValue < bValue) return -1 * direction;
            if (aValue > bValue) return 1 * direction;
        }
        return 0;
    });
};

/**
 * Get unique values from array
 */
export const unique = (array, key = null) => {
    if (!key) return [...new Set(array)];

    const seen = new Set();
    return array.filter(item => {
        const value = typeof key === 'function' ? key(item) : item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
};

/**
 * Calculate percentage
 */
export const percentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
    const regex = /^\+?[\d\s\-()]{10,}$/;
    return regex.test(phone);
};

/**
 * Validate URL
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Generate color from string (for avatars)
 */
export const getColorFromString = (str) => {
    const colors = [
        '#F87171', '#FB923C', '#FBBF24', '#A3E635', '#34D399',
        '#22D3EE', '#60A5FA', '#A78BFA', '#F472B6', '#FB7185'
    ];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
         
    } catch (_err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    }
};

/**
 * Download data as file
 */
export const downloadAsFile = (data, filename, type = 'text/plain') => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Format bytes to human readable
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Generate pagination info
 */
export const generatePagination = (currentPage, totalItems, itemsPerPage) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

    return {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        startIndex,
        endIndex,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
        isFirst: currentPage === 1,
        isLast: currentPage === totalPages
    };
};

/**
 * Calculate reading time
 */
export const calculateReadingTime = (text, wordsPerMinute = 200) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename) => {
    return filename
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .toLowerCase();
};

/**
 * Generate slug from text
 */
export const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Parse search query
 */
export const parseSearchQuery = (query) => {
    const filters = {};
    const terms = [];

    // Extract filters like "location:casablanca"
    const filterRegex = /(\w+):([^\s]+)/g;
    let match;

    while ((match = filterRegex.exec(query)) !== null) {
        filters[match[1]] = match[2];
    }

    // Extract remaining terms
    const remainingQuery = query.replace(filterRegex, '').trim();
    if (remainingQuery) {
        terms.push(...remainingQuery.split(/\s+/));
    }

    return { filters, terms };
};

/**
 * Local storage helpers
 */
export const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    },

    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch {
            return false;
        }
    }
};

/**
 * URL helpers
 */
export const url = {
    buildQuery: (params) => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                query.append(key, value);
            }
        });

        return query.toString();
    },

    parseQuery: (queryString) => {
        const params = new URLSearchParams(queryString);
        const result = {};

        for (const [key, value] of params) {
            result[key] = value;
        }

        return result;
    }
};

export default {
    formatDate,
    formatRelativeTime,
    formatSalary,
    formatNumber,
    truncateText,
    capitalize,
    toTitleCase,
    getInitials,
    generateId,
    debounce,
    throttle,
    deepClone,
    isEmpty,
    groupBy,
    sortBy,
    unique,
    percentage,
    isValidEmail,
    isValidPhone,
    isValidUrl,
    getColorFromString,
    copyToClipboard,
    downloadAsFile,
    formatBytes,
    generatePagination,
    calculateReadingTime,
    sanitizeFilename,
    generateSlug,
    parseSearchQuery,
    storage,
    url
};