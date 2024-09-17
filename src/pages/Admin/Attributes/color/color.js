const colorMap = {
  // Màu Hổ phách
  "hổ phách": "#FFBF00",

  // Màu Ametit
  "ametit": "#9966CC",

  // Màu Xanh
  "xanh berin": "#7FFFD4",
  "xanh da trời": "#007FFF",
  "xanh dương": "#0000FF",
  "xanh cô ban": "#0047AB",
  "xanh hoàng hôn": "#007BA7",
  "xanh nõn chuối": "#7FFF00",
  "xanh lá cây": "#008000",
  "xanh lơ": "#00FFFF",
  "xanh cánh chả": "#00FFFF",
  "xanh thủy tinh": "#003399",
  "xanh Thổ": "#40E0D0",
  "xanh crôm": "#40826D",
  "xanh lá" : "#008000",
  "xanh": "#008000",

  // Màu Nâu
  "nâu sẫm": "#3D2B1F",
  "nâu": "#993300",
  "nâu đen": "#704214",
  "nâu tanin": "#D2B48C",

  // Màu Vàng
  "vàng": "#FFD700",
  "vàng da bò": "#F0DC82",
  "vàng kim loại": "#FFD700",
  "vàng chanh": "#CCFF00",

  // Màu Đỏ
  "đỏ": "#FF0000",
  "đỏ yên chi": "#960018",
  "đỏ thắm": "#DC143C",
  "đỏ tươi": "#FF2400",
  "đỏ son": "#FF4D00",
  "đỏ hồng y": "#C41E3A",

  // Màu Hồng
  "hồng": "#FFC0CB",
  "hồng đất": "#CC8899",
  "hồng sẫm": "#FF00FF",

  // Màu Tím
  "tím": "#8000FF",
  "tím hồng": "#DA70D6",
  "tím cẩm quỳ": "#E0B0FF",

  // Màu Oải hương
  "oải hương": "#B57EDC",

  // Màu Đen, Trắng, Xám
  "đen": "#000000",
  "trắng": "#FFFFFF",
  "xám": "#808080",

  // Các màu khác
  "san hô": "#FF7F50",
  "đồng": "#B87333",
  "men ngọc": "#ACE1AF",
  "ngọc thạch": "#00A86B",
  "hạt dẻ": "#800000",
  "vòi voi": "#DF73FF",
  "bạc": "#C0C0C0",
  "kaki": "#C3B091",
  "mận": "#8E4585",
  "lan tím": "#DA70D6"
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