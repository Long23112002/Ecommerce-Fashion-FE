import { Container, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getOrderById, OrderAddressUpdate } from '../../../api/OrderApi'
import Order, { OrderUpdateRequest } from '../../../types/Order'
import PaymentInfo from './PaymentInfo'
import ProductOrderInfo from './ProductOrderInfo'
import ReceiverInfo from './ReceiverInfo'
import Cookies from 'js-cookie'
import MuiLoadingScreen from '../../../components/Loading/MuiLoadingScreen'
import PaymentMethodEnum from '../../../enum/PaymentMethodEnum'
import Address from '../../../types/Address'

const CheckoutPage: React.FC = () => {

  const [order, setOrder] = useState<Order>();
  const [orderRequest, setOrderRequest] = useState<OrderUpdateRequest>({
    fullName: '',
    phoneNumber: '',
    specificAddress: '',
    note: '',
    paymentMethod: PaymentMethodEnum.CASH
  });
  const [validAddress, setValidAddress] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setOrderRequest(prev => ({
      ...prev,
      orderDetails: Array.isArray(order?.orderDetails)
        ? order.orderDetails.map(od => ({
          productDetailId: od.productDetail.id,
          quantity: od.quantity,
        }))
        : []
    }));

  }, [order])


  useEffect(() => {
    setLoading(true)
    const json = Cookies.get('order')
    if (!json) return
    const order = JSON.parse(json)
    if (!order.id) return
    const callGetOrderById = async () => {
      const data = await getOrderById(order.id)
      setOrder({ ...data })
    }
    callGetOrderById()
    setLoading(false)
  }, [])

  return (
    <>
      {order &&
        <Container maxWidth='lg'>
          <Grid container
            spacing={2}
            justifyContent='space-between'
            direction={{ xs: "column-reverse", md: "row" }}
          >
            <Grid item sm={12} md={6.5}>
              <ReceiverInfo
                order={order}
                setOrder={setOrder}
                orderRequest={orderRequest}
                setOrderRequest={setOrderRequest}
                setLoading={setLoading}
                setValidAddress={setValidAddress}
              />
              <PaymentInfo
                order={order}
                orderRequest={orderRequest}
                setOrderRequest={setOrderRequest}
                validAddress={validAddress}
              />
            </Grid>
            <Grid item sm={12} md={5.5}>
              <ProductOrderInfo
                order={order}
                setOrder={setOrder}
              />
            </Grid>
          </Grid>
        </Container>
      }
      {loading && <MuiLoadingScreen />}
    </>
  )
}

export default CheckoutPage