import React, { useEffect } from 'react'
import MuiLoading from '../components/Loading/MuiLoading'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { confirmOrder } from '../api/OrderApi';
import MuiLoadingScreen from '../components/Loading/MuiLoadingScreen';

const ConfirmCheckout = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const orderId = searchParams.get('vnp_TxnRef')
        const encode = searchParams.get('vnp_OrderInfo')
        const status = searchParams.get('vnp_TransactionStatus')
        if (!orderId || !encode || !status) return;
        const callConfirmOrder = async () => {
            try {
                await confirmOrder(orderId, encode, status)
                toast.success("Bạn đã thanh toán thành công")
            } catch (error: any) {
                const message = error.response.data.message;
                toast.error(message || "Giao dịch thất bại")
            }
            finally {
                navigate("/")
            }
        }
        callConfirmOrder()
    }, [])

    return (
        <MuiLoadingScreen />
    )
}

export default ConfirmCheckout