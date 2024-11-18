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

interface IProps {
  order: Order,
  orderRequest: OrderUpdateRequest,
  setOrderRequest: React.Dispatch<React.SetStateAction<OrderUpdateRequest>>
}

const PaymentInfo: React.FC<IProps> = ({ order, orderRequest, setOrderRequest }) => {
  const navigate = useNavigate()
  const { setLoadingScreen } = useLoadingScreen();
  const {reload} = useCart();

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
    else if (!orderRequest.specificAddress.trim()) {
      toast.error('Địa chỉ không được để trống')
      return false
    }
    return true;
  };

  const handleVNPayPayment = async () => {
    const data = await payOrder(orderRequest)
    if (data) {
      window.location.assign(data)
    }
  }

  const handleCashPayment = async () => {
    setLoadingScreen(true)
    await payOrder(orderRequest)
    reload()
    setLoadingScreen(false)
    toast.success("Đặt hàng thành công")
    navigate("/")
  }

  const handlePay = async () => {
    if (order.status !== OrderStatus.DRAFT) {
      toast.error("Đơn hàng không thể giao dịch được nữa")
      return
    }
    if (!validate()) return
    try {
      const paymentMethod = orderRequest.paymentMethod
      if (paymentMethod == PaymentMethodEnum.CASH) {
        await handleCashPayment()
      }
      else if (paymentMethod == PaymentMethodEnum.VNPAY) {
        await handleVNPayPayment()
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

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

          {/* <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
            <FormControlLabel
              value={PaymentMethodEnum.BANK_TRANSFER}
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
          </Paper> */}
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
    </Box>
  )
}

export default PaymentInfo
