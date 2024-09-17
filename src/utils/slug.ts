export const makeSlug = (input) => {
    if (!input) return '';


    if (input.charAt(0) === ' ') {
        input = input.trim();
    }

    let slug = input
        .toLowerCase()
        .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/g, 'a')
        .replace(/[đ]/g, 'd')
        .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
        .replace(/[ìíỉĩị]/g, 'i')
        .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
        .replace(/[ùúủũụưừứửữự]/g, 'u')
        .replace(/[ỳýỷỹỵ]/g, 'y')
        .replace(/[^a-zA-Z0-9\s]+/g, '')
        .replace(/\s+/g, '-');

    return slug;
};
