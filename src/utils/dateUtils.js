// Format a date string as "YYYY-MM-DD"
export const formatDateString = (date) => {
    if (!date) return '';

    if (typeof date === 'string') {
        // Check if the date is already in the correct format
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }

        // Parse the string to a Date object
        date = new Date(date);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

// Format a date in a localized format based on language
export const formatLocalizedDate = (dateString, language = 'en') => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    try {
        return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', options);
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
};

// Get a formatted date for "today"
export const getToday = () => {
    return formatDateString(new Date());
};

// Check if a date is in the past (overdue)
export const isDateOverdue = (dateString) => {
    if (!dateString) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    return date < today;
};

// Get the next occurrence of a recurring task
export const getNextOccurrence = (date, type, value) => {
    if (!date) return '';

    const nextDate = new Date(date);

    switch (type) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + value);
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + (value * 7));
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + value);
            break;
        case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + value);
            break;
        default:
            return date;
    }

    return formatDateString(nextDate);
};

// Get the day of the week (Sunday = 0, Monday = 1, etc.)
export const getDayOfWeek = (dateString) => {
    if (!dateString) return 0;

    const date = new Date(dateString);
    return date.getDay();
};

// Get the week number for a date
export const getWeekNumber = (dateString) => {
    if (!dateString) return 0;

    const date = new Date(dateString);
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - firstDay) / 86400000;

    return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};

// Get the month name
export const getMonthName = (dateString, language = 'en') => {
    if (!dateString) return '';

    const date = new Date(dateString);

    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long' });
};