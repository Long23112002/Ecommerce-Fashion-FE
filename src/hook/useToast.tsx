import { toast } from "react-toastify"

const useToast = () => {
    const catchToast = (error: any) => {
        const message = error.response.data.message
        if (typeof message == 'string') {
            toast.error(message)
        }
        else {
            toast.error(Object.values(message)[0] + '')
        }
    }
    return {catchToast}
}

export default useToast