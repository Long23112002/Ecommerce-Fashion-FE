const colorMap = {
    // Màu Đỏ
    "đỏ đậm": "#8B0000",
    "đỏ": "#FF0000",
    "đỏ nhạt": "#FF7F7F",
    "đỏ cam": "#FF4500",
    "đỏ tím": "#C71585",

    // Màu Xanh Lá
    "xanh": "#00FF00",
    "xanh lá cây đậm": "#004d00",
    "xanh lá cây": "#00FF00",
    "xanh lá cây nhạt": "#7FFF00",
    "xanh lá đậm": "#004d00",
    "xanh lá": "#00FF00",
    "xanh lá nhạt": "#7FFF00",

    // Màu Xanh Dương
    "xanh dương đậm": "#00008B",
    "xanh dương": "#0000FF",
    "xanh dương nhạt": "#ADD8E6",
    "xanh da trời": "#87CEEB",
    "xanh biển": "#4682B4",

    // Màu Vàng
    "vàng đậm": "#FFD700",
    "vàng": "#FFFF00",
    "vàng nhạt": "#FFFFE0",
    "vàng cam": "#FFA500",
    "vàng ánh kim": "#FFD700",

    // Màu Cyan
    "cyan đậm": "#008B8B",
    "cyan": "#00FFFF",
    "cyan nhạt": "#E0FFFF",

    // Màu Hồng
    "hồng đậm": "#8B008B",
    "hồng": "#FF00FF",
    "hồng nhạt": "#FF77FF",

    // Màu Xám
    "xám đậm": "#404040",
    "xám": "#808080",
    "xám nhạt": "#D3D3D3",
    "xám bạc": "#A9A9A9",
    "xám đen": "#2F4F4F",

    // Màu Tím
    "tím đậm": "#4B0082",
    "tím": "#800080",
    "tím nhạt": "#D8BFD8",
    "tím hồng": "#DDA0DD",
    "tím xanh": "#6A5ACD",

    // Các màu khác
    "bạc": "#C0C0C0",
    "trắng": "#FFFFFF",
    "trắng nhạt": "#F5F5F5",
    "đen":"#000"
  };

export const getColorCode = (colorName) => {
    // Chuyển đổi tên màu thành chữ thường trước khi so sánh
    const lowerColorName = colorName.toLowerCase();

    // Thử tìm tên màu khớp chính xác trước
    const exactMatch = Object.keys(colorMap).find(
      (key) => lowerColorName === key.toLowerCase()
    );

    // Nếu có khớp chính xác, trả về mã màu tương ứng
    if (exactMatch) {
      return colorMap[exactMatch];
    }

    // Nếu không, tiếp tục tìm các màu có chứa từ khóa
    const foundColor = Object.keys(colorMap).find((key) =>
      lowerColorName.includes(key.toLowerCase())
    );

    return foundColor ? colorMap[foundColor] : "#FFF"; // Trả về trắng nếu không tìm thấy
  };