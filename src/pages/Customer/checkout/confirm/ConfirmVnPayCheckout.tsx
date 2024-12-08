import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { confirmOrder, TransactionRequest } from '../../../../api/OrderApi';
import PaymentMethodEnum from '../../../../enum/PaymentMethodEnum';
import MuiLoadingScreen from '../../../../components/Loading/MuiLoadingScreen';
import useCart from '../../../../hook/useCart';

const ConfirmVnPayCheckout: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const { removeItemAfterOrder } = useCart();

    useEffect(() => {
        const orderId = searchParams.get('vnp_TxnRef')
        const encode = searchParams.get('vnp_OrderInfo')
        const status = searchParams.get('vnp_TransactionStatus')
        if (!orderId || !encode || !status) return;
        const callConfirmOrder = async () => {
            try {
                const data: TransactionRequest = {
                    orderId: orderId,
                    confirmationCode: encode,
                    status: status,
                    paymentMethod: PaymentMethodEnum.VNPAY
                }
                await confirmOrder(data)
                await removeItemAfterOrder()
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

export default ConfirmVnPayCheckout