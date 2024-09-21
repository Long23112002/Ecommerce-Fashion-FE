export const getErrorMessage = (error)=> {
    // Kiểm tra nếu phản hồi từ API có chứa dữ liệu
    if (error.response && error.response.data) {
      const { message } = error.response.data;
  
      // Nếu message là một đối tượng và có trường "name", lấy giá trị của "name"
      if (typeof message === 'object' && message.name) {
        return message.name as string;
      }
  
      // Nếu message là chuỗi, trả về chuỗi đó
      if (typeof message === 'string') {
        return message;
      }
    }
  
    // Trả về thông báo mặc định nếu không có phản hồi API hoặc cấu trúc không mong đợi
    return 'Có lỗi xảy ra. Vui lòng thử lại sau.';
  };