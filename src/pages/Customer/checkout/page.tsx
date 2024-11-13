import { Container, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Order, { OrderRequest } from '../../../types/Order'
import PaymentInfo from './PaymentInfo'
import ProductsInfo from './ProductsInfo'
import ReceiverInfo from './ReceiverInfo'

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
  

  useEffect(()=>{

  },[])

  return (
    <Container maxWidth='lg'>
      <Grid container
        spacing={2}
        justifyContent='space-between'
        direction={{ xs: "column-reverse", md: "row" }}
      >
        <Grid item sm={12} md={6.5}>
          <ReceiverInfo
            orderRequest={orderRequest}
            setOrderRequest={setOrderRequest}
          />
          <PaymentInfo
            orderRequest={orderRequest}
            setOrderRequest={setOrderRequest}
          />
        </Grid>
        <Grid item sm={12} md={5.5}>
          <ProductsInfo
            orderRequest={orderRequest}
            setOrderRequest={setOrderRequest}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default CheckoutPage