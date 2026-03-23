// src/utils/constants.js

/**
 * Application-wide constants
 */

// User roles
export const USER_ROLES = {
    CANDIDATE: 'candidate',
    EMPLOYER: 'employer',
    ADMIN: 'admin'
};

// Job types
export const JOB_TYPES = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
    INTERNSHIP: 'internship',
    FREELANCE: 'freelance'
};

// Job categories
export const JOB_CATEGORIES = {
    TECHNOLOGY: 'technology',
    MARKETING: 'marketing',
    SALES: 'sales',
    DESIGN: 'design',
    FINANCE: 'finance',
    HEALTHCARE: 'healthcare',
    EDUCATION: 'education',
    OTHER: 'other'
};

// Experience levels
export const EXPERIENCE_LEVELS = {
    ENTRY: 'entry',
    MID: 'mid',
    SENIOR: 'senior',
    LEAD: 'lead'
};

// Application statuses
export const APPLICATION_STATUS = {
    PENDING: 'pending',
    REVIEWING: 'reviewing',
    SHORTLISTED: 'shortlisted',
    INTERVIEWED: 'interviewed',
    OFFERED: 'offered',
    REJECTED: 'rejected',
    WITHDRAWN: 'withdrawn'
};

// Job statuses
export const JOB_STATUS = {
    ACTIVE: 'active',
    CLOSED: 'closed',
    DRAFT: 'draft'
};

// Company industries
export const INDUSTRIES = {
    TECHNOLOGY: 'technology',
    FINANCE: 'finance',
    HEALTHCARE: 'healthcare',
    EDUCATION: 'education',
    RETAIL: 'retail',
    MANUFACTURING: 'manufacturing',
    OTHER: 'other'
};

// Company sizes
export const COMPANY_SIZES = {
    SMALL: '1-10',
    MEDIUM_SMALL: '11-50',
    MEDIUM: '51-200',
    MEDIUM_LARGE: '201-500',
    LARGE: '501-1000',
    ENTERPRISE: '1000+'
};

// Education levels
export const EDUCATION_LEVELS = {
    HIGH_SCHOOL: 'High School',
    ASSOCIATE: 'Associate',
    BACHELOR: 'Bachelor',
    MASTER: 'Master',
    PHD: 'PhD',
    OTHER: 'Other'
};

// Salary periods
export const SALARY_PERIODS = {
    HOURLY: 'hourly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
};

// Currencies
export const CURRENCIES = {
    MAD: 'MAD',
    USD: 'USD',
    EUR: 'EUR'
};

// Morocco cities
export const MOROCCO_CITIES = [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fès',
    'Tanger',
    'Agadir',
    'Meknès',
    'Oujda',
    'Kenitra',
    'Tétouan',
    'Safi',
    'Mohammedia',
    'Khouribga',
    'El Jadida',
    'Béni Mellal',
    'Nador',
    'Taza',
    'Settat',
    'Larache',
    'Khemisset',
    'Remote'
];

// Popular skills
export const POPULAR_SKILLS = [
    // Programming Languages
    'JavaScript',
    'Python',
    'Java',
    'PHP',
    'C++',
    'C#',
    'Ruby',
    'Go',
    'Swift',
    'Kotlin',

    // Frontend
    'React',
    'Vue.js',
    'Angular',
    'HTML',
    'CSS',
    'Sass',
    'TypeScript',
    'jQuery',

    // Backend
    'Node.js',
    'Express.js',
    'Django',
    'Spring',
    'Laravel',
    'ASP.NET',
    'Ruby on Rails',

    // Databases
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Oracle',
    'SQLite',

    // Cloud & DevOps
    'AWS',
    'Docker',
    'Kubernetes',
    'Jenkins',
    'Git',
    'Linux',
    'Azure',
    'Google Cloud',

    // Design
    'Photoshop',
    'Illustrator',
    'Figma',
    'Sketch',
    'UI/UX Design',
    'Adobe XD',

    // Marketing
    'SEO',
    'Google Analytics',
    'Social Media Marketing',
    'Content Marketing',
    'PPC',
    'Email Marketing',

    // Business
    'Project Management',
    'Agile',
    'Scrum',
    'Leadership',
    'Communication',
    'Problem Solving'
];

// Application status colors
export const STATUS_COLORS = {
    [APPLICATION_STATUS.PENDING]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200'
    },
    [APPLICATION_STATUS.REVIEWING]: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200'
    },
    [APPLICATION_STATUS.SHORTLISTED]: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200'
    },
    [APPLICATION_STATUS.INTERVIEWED]: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200'
    },
    [APPLICATION_STATUS.OFFERED]: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200'
    },
    [APPLICATION_STATUS.REJECTED]: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200'
    },
    [APPLICATION_STATUS.WITHDRAWN]: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200'
    }
};

// Job type colors
export const JOB_TYPE_COLORS = {
    [JOB_TYPES.FULL_TIME]: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200'
    },
    [JOB_TYPES.PART_TIME]: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200'
    },
    [JOB_TYPES.CONTRACT]: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200'
    },
    [JOB_TYPES.INTERNSHIP]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200'
    },
    [JOB_TYPES.FREELANCE]: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200'
    }
};

// Experience level colors
export const EXPERIENCE_COLORS = {
    [EXPERIENCE_LEVELS.ENTRY]: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200'
    },
    [EXPERIENCE_LEVELS.MID]: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200'
    },
    [EXPERIENCE_LEVELS.SENIOR]: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200'
    },
    [EXPERIENCE_LEVELS.LEAD]: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200'
    }
};

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

// API response codes
export const API_RESPONSE_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
    SEARCH_HISTORY: 'search_history',
    FILTER_PREFERENCES: 'filter_preferences'
};

// Form validation rules
export const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s\-()]{10,}$/,
    PASSWORD: {
        MIN_LENGTH: 8,
        REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    },
    URL: /^https?:\/\/.+/,
    LINKEDIN: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
};

// Date formats
export const DATE_FORMATS = {
    FULL: 'MMMM d, yyyy',
    SHORT: 'MMM d, yyyy',
    NUMERIC: 'yyyy-MM-dd',
    TIME: 'HH:mm',
    DATETIME: 'yyyy-MM-dd HH:mm'
};

// File upload limits
export const UPLOAD_LIMITS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILES: 5,
    ALLOWED_TYPES: ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg']
};

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error - please check your connection',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    FORBIDDEN: 'Access denied',
    NOT_FOUND: 'Resource not found',
    INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again',
    FILE_TOO_LARGE: 'File size is too large',
    INVALID_FILE_TYPE: 'Invalid file type',
    REQUIRED_FIELD: 'This field is required'
};

// Success messages
export const SUCCESS_MESSAGES = {
    PROFILE_UPDATED: 'Profile updated successfully',
    APPLICATION_SUBMITTED: 'Application submitted successfully',
    JOB_CREATED: 'Job posting created successfully',
    JOB_UPDATED: 'Job posting updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    EMAIL_VERIFIED: 'Email verified successfully',
    FILE_UPLOADED: 'File uploaded successfully'
};

// Feature flags
export const FEATURES = {
    REAL_TIME_NOTIFICATIONS: true,
    FILE_UPLOAD: true,
    EMAIL_NOTIFICATIONS: true,
    DARK_MODE: false,
    ADVANCED_SEARCH: true,
    COMPANY_REVIEWS: false,
    SALARY_INSIGHTS: false,
    VIDEO_INTERVIEWS: false
};

// Social links
export const SOCIAL_LINKS = {
    LINKEDIN: 'https://linkedin.com',
    TWITTER: 'https://twitter.com',
    FACEBOOK: 'https://facebook.com',
    INSTAGRAM: 'https://instagram.com'
};

// Support contact
export const SUPPORT = {
    EMAIL: 'support@workwhile.ma',
    PHONE: '+212 5XX XXX XXX',
    HOURS: '9:00 AM - 6:00 PM (GMT+1)'
};

export default {
    USER_ROLES,
    JOB_TYPES,
    JOB_CATEGORIES,
    EXPERIENCE_LEVELS,
    APPLICATION_STATUS,
    JOB_STATUS,
    INDUSTRIES,
    COMPANY_SIZES,
    EDUCATION_LEVELS,
    SALARY_PERIODS,
    CURRENCIES,
    MOROCCO_CITIES,
    POPULAR_SKILLS,
    STATUS_COLORS,
    JOB_TYPE_COLORS,
    EXPERIENCE_COLORS,
    PAGINATION,
    API_RESPONSE_CODES,
    STORAGE_KEYS,
    VALIDATION_RULES,
    DATE_FORMATS,
    UPLOAD_LIMITS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    FEATURES,
    SOCIAL_LINKS,
    SUPPORT
};