import { Box, Typography } from '@mui/material'
import React from 'react'
import Order, { OrderRequest } from '../../../types/Order'

interface IProps {
    orderRequest: Order,
    setOrderRequest: React.Dispatch<React.SetStateAction<Order>>
}

const ProductsInfo: React.FC<IProps> = ({ orderRequest, setOrderRequest }) => {
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
            <Typography variant='h6'>Thông tin sản phẩm</Typography>
        </Box>
    )
}

export default ProductsInfo