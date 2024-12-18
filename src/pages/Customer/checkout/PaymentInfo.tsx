import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { payOrder } from "../../../api/OrderApi"
import PaymentMethodEnum from "../../../enum/PaymentMethodEnum"
import Order, { OrderStatus, OrderUpdateRequest } from '../../../types/Order'
import { useNavigate } from "react-router-dom"
import useLoadingScreen from "../../../hook/useLoadingScreen"
import useCart from "../../../hook/useCart"
import { Modal, ModalClose, Sheet } from "@mui/joy"
import { ProductDetailItem } from "./ProductOrderInfo"
import useToast from "../../../hook/useToast"

interface IProps {
  order: Order,
  orderRequest: OrderUpdateRequest,
  setOrderRequest: React.Dispatch<React.SetStateAction<OrderUpdateRequest>>
  validAddress: boolean
}

const PaymentInfo: React.FC<IProps> = ({ order, orderRequest, setOrderRequest, validAddress }) => {
  const navigate = useNavigate()
  const { setLoadingScreen } = useLoadingScreen();
  const { removeItemAfterOrder } = useCart();
  const { catchToast } = useToast()
  const [confirm, setConfirm] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const isValidPaymentMethod = (value: string): boolean => {
    return Object.values(PaymentMethodEnum).includes(value as PaymentMethodEnum);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isValidPaymentMethod(value)) {
      setOrderRequest(prev => ({
        ...prev,
        paymentMethod: value as PaymentMethodEnum
      }))
    }
  }

  const validate = () => {
    const phoneRegex = /^(84|0[3|5|7|8|9])[0-9]{8}$/;
    if (!orderRequest.fullName.trim()) {
      toast.error('Tên không được để trống')
      return false
    }
    else if (!phoneRegex.test(orderRequest.phoneNumber)) {
      toast.error('Số điện thoại không hợp lệ')
      return false
    }
    else if (!orderRequest.specificAddress.trim() || !validAddress) {
      toast.error('Địa chỉ không được để trống')
      return false
    }
    return true;
  };

  const handleVNPayPayment = async () => {
    const data = await payOrder(order.id, orderRequest)
    if (data) {
      window.location.assign(data)
    }
  }

  const handleCashPayment = async () => {
    try {
      setLoadingScreen(true)
      await payOrder(order.id, orderRequest)
      removeItemAfterOrder()
      toast.success("Đặt hàng thành công")
      navigate("/");
    } catch (error) {
      catchToast(error)
    } finally {
      setLoadingScreen(false)
    }
  }

  const handleVietQrPayment = async () => {
    navigate("/checkout/qr", { state: { order, orderRequest } });
  }

  const handlePay = async () => {
    console.log(order)
    if (order.status !== OrderStatus.DRAFT) {
      toast.error("Đơn hàng không thể giao dịch được nữa")
      return
    }
    if (!validate()) return
    try {
      const paymentMethod = orderRequest.paymentMethod
      switch (paymentMethod) {
        case PaymentMethodEnum.CASH: {
          setOpen(true)
          break
        }
        case PaymentMethodEnum.VNPAY: {
          await handleVNPayPayment()
          break
        }
        case PaymentMethodEnum.VIET_QR: {
          await handleVietQrPayment()
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    if (confirm) {
      const handle = async () => {
        await handleCashPayment()
        setConfirm(false)
      }
      handle()
    }
    setOpen(false)
  }, [confirm])

  return (
    <Box
      className='shadow-section-2'
      sx={{
        backgroundColor: 'white',
        p: {
          xs: 1,
          md: 3
        },
        my: 2,
        borderRadius: 4
      }}
    >
      <Typography variant="h6" gutterBottom>
        Phương thức thanh toán
      </Typography>

      <FormControl component="fieldset" fullWidth>
        <RadioGroup value={orderRequest.paymentMethod} onChange={handleChange}>
          <Paper variant="outlined" sx={{ mb: 1, p: 2 }}>
            <FormControlLabel
              value={PaymentMethodEnum.CASH}
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <Box>
                    <Typography>Tiền mặt</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thanh toán khi nhận được hàng
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ margin: 0, width: "100%" }}
            />
          </Paper>

          <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
            <FormControlLabel
              value={PaymentMethodEnum.VNPAY}
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <Typography>Ví điện tử VNPAY</Typography>
                  <Box sx={{ ml: "auto" }}>
                    <img
                      src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                      alt="VNPAY logo"
                      width={40}
                      height={40}
                    />
                  </Box>
                </Box>
              }
              sx={{ margin: 0, width: "100%" }}
            />
          </Paper>

          <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
            <FormControlLabel
              value={PaymentMethodEnum.VIET_QR}
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <Typography>Mã QR</Typography>
                  <Box sx={{ ml: "auto" }}>
                    <img
                      src="https://play-lh.googleusercontent.com/22cJzF0otG-EmmQgILMRTWFPnx0wTCSDY9aFaAmOhHs30oNHxi63KcGwUwmbR76Msko"
                      alt="VNPAY logo"
                      width={40}
                      height={40}
                    />
                  </Box>
                </Box>
              }
              sx={{ margin: 0, width: "100%" }}
            />
          </Paper>
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
        }}
        onClick={handlePay}
      >
        Thanh toán
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 800,
            maxHeight: '90vh',
            width: '100%',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            overflowY: 'auto',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography variant="h5">
            Xác nhận thanh toán
          </Typography>
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Thông tin đơn hàng</Typography>
            {order.orderDetails?.map(od => <ProductDetailItem key={od.id} od={od} />)}
            <Typography variant="h6">Tổng thanh toán đơn hàng của bạn là: {order.payAmount.toLocaleString('vi-VN')}đ</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button color="success" variant="contained" onClick={() => setConfirm(true)}>Xác nhận</Button>
            </Box>
          </Box>
        </Sheet>
      </Modal>


    </Box>
  )
}

export default PaymentInfo
