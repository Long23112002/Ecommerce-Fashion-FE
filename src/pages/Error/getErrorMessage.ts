export const getErrorMessage = (error:any)=> {
    console.log(error)
    if (error.response && error.response.data) {
      const { message } = error.response.data;
  
      if (typeof message === 'object' && message.name) {
        return message.name as string;
      }
  
      if (typeof message === 'string') {
        return message;
      }
    }
  
    return 'Có lỗi xảy ra. Vui lòng thử lại sau.';
  };