import { toast } from "react-toastify"

const useToast = () => {
    const catchToast = (error: any) => {
        const message = error?.response?.data?.message
        if (typeof message == 'string') {
            toast.error(message)
        }
        else if (typeof message == 'object') {
            toast.error(Object.values(message)[0] + '')
        }
        else if (typeof error.message === 'string') {
            toast.error(error.message)
        }
        else if (typeof error === 'string') {
            toast.error(error)
        }
        else {
            return toast.error("Có lỗi xảy ra. Vui lòng thử lại sau")
        }
    }
    return { catchToast }
}

export default useToast