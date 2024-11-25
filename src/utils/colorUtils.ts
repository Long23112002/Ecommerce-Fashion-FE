export const isDarkColor = (color: string) => {
    if (!color) return false;

    const hexToRgb = (hex: string) => {
        let sanitized = hex.replace('#', '');
        if (sanitized.length === 3) {
            sanitized = sanitized.split('').map((c) => c + c).join('');
        }
        const bigint = parseInt(sanitized, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    };

    const { r, g, b } = hexToRgb(color);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance < 128;
};

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};