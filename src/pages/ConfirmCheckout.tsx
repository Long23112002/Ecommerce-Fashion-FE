import React, { useEffect } from 'react'
import MuiLoading from '../components/Loading/MuiLoading'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { confirmOrder } from '../api/OrderApi';

const ConfirmCheckout = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const orderId = searchParams.get('vnp_TxnRef')
        const encode = searchParams.get('vnp_OrderInfo')
        if (!orderId || !encode) return;
        const callConfirmOrder = async () => {
            try {
                await confirmOrder(orderId, encode)
                toast.success("Bạn đã thanh toán thành công")
                navigate("/")
            } catch (error: any) {
                toast.error(error)
                throw error
            }
        }
        callConfirmOrder()
    }, [])

    return (
        <MuiLoading height='90vh' size={70} />
    )
}

export default ConfirmCheckout