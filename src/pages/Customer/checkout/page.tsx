import { Container, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getOrderById } from '../../../api/OrderApi'
import Order, { OrderRequest } from '../../../types/Order'
import PaymentInfo from './PaymentInfo'
import ProductOrderInfo from './ProductOrderInfo'
import ReceiverInfo from './ReceiverInfo'
import Cookies from 'js-cookie'

const CheckoutPage: React.FC = () => {

  const [order, setOrder] = useState<Order>();

  const [orderRequest, setOrderRequest] = useState<OrderRequest>({
    fullName: '',
    phoneNumber: '',
    email: '',
    paymentMethodId: 0,
    address: '',
    totalMoney: 0,
    orderDetails: [],
  });

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
    const id = Cookies.get('orderId')
    if (!id) return
    const callGetOrderById = async () => {
      const data = await getOrderById(id)
      setOrder({ ...data })
    }
    callGetOrderById()
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
              />
              <PaymentInfo
                orderRequest={orderRequest}
                setOrderRequest={setOrderRequest}
              />
            </Grid>
            <Grid item sm={12} md={5.5}>
              <ProductOrderInfo order={order} />
            </Grid>
          </Grid>
        </Container>
      }
    </>
  )
}

export default CheckoutPage