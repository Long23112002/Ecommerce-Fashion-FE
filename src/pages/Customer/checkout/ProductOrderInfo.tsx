import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import Order, { OrderRequest } from '../../../types/Order';
import ProductDetail from '../../../types/ProductDetail';

interface IProps {
    order: Order
}

const ProductOrderInfo: React.FC<IProps> = ({ order }) => {
    return (
        <Box
            className='shadow-section-2'
            sx={{
                backgroundColor: 'white',
                p: { xs: 2, md: 3 },
                my: 2,
                borderRadius: 4
            }}
        >
            <Typography variant='h6' mb={2} fontWeight="bold">Thông tin sản phẩm</Typography>
            {order.orderDetails?.map(od => <ProductDetailItem key={od.id} pd={od.productDetail} />)}

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography>Tổng giá trị sản phẩm: </Typography>
                    <Typography variant="body1">{order.totalMoney.toLocaleString('vi-VN') + ' đ'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography>Vận chuyển: </Typography>
                    <Typography variant="body1">{order.moneyShip ? order.moneyShip?.toLocaleString('vi-VN') + ' đ' : ''}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography>Giảm giá: </Typography>
                    <Typography variant="body1">{ }</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant='h5'>Tổng thanh toán: </Typography>
                    <Typography variant="h6">{(order.totalMoney + (order.moneyShip || 0)).toLocaleString('vi-VN') + ' đ'}</Typography>
                </Box>
            </Box>

        </Box>
    );
};

const ProductDetailItem: React.FC<{ pd: ProductDetail }> = ({ pd }) => {
    return (
        <Grid
            container
            spacing={2}
            sx={{
                pb: 2,
                mb: 2,
            }}
        >
            <Grid item xs={4} sm={3}>
                <Box
                    component="img"
                    src={pd.images[0].url}
                    alt={pd.product.name}
                    sx={{
                        height: 100,
                        width: '100%',
                        borderRadius: 2,
                        objectFit: 'cover'
                    }}
                />
            </Grid>
            <Grid item xs={8} sm={9}>
                <Typography variant='subtitle1' fontWeight="bold">{pd.product.name}</Typography>
                <Typography variant='body2' color="text.secondary">Màu: {pd.color.name}</Typography>
                <Typography variant='body2' color="text.secondary">Kích thước: {pd.size.name}</Typography>
                <Typography variant='body2' color="primary" fontWeight="bold">
                    Giá: {pd.price.toLocaleString()} VND
                </Typography>
            </Grid>
        </Grid>
    )
}

export default ProductOrderInfo;