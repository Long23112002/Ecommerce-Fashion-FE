export const formatDateTime = (dateInput: string | Date | number | null | undefined): string => {
    if (!dateInput) {
        return "";
    }

    const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    const seconds = String(date.getSeconds()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

export const monthStringToNumber = (month: string): number | null => {
    switch (month) {
        case 'January': return 1;
        case 'February': return 2;
        case 'March': return 3;
        case 'April': return 4;
        case 'May': return 5;
        case 'June': return 6;
        case 'July': return 7;
        case 'August': return 8;
        case 'September': return 9;
        case 'October': return 10;
        case 'November': return 11;
        case 'December': return 12;
        default: return null;
    }
};