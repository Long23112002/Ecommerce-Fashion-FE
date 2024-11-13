import { Box, Typography } from '@mui/material'
import React from 'react'
import { OrderRequest } from '../../../types/Order'

interface IProps {
  orderRequest: OrderRequest,
  setOrderRequest: React.Dispatch<React.SetStateAction<OrderRequest>>
}

const PaymentInfo: React.FC<IProps> = () => {
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
      <Typography variant='h6'>Phương thức thanh toán</Typography>
    </Box>
  )
}

export default PaymentInfo