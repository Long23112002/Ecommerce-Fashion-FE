import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import Order from '../../../types/Order';
import ProductDetail from '../../../types/ProductDetail';
import DiscountSelector from '../../../components/Discount/DiscountSelector';
import { updateDiscountOrder } from '../../../api/OrderApi';
import { Discount } from '../../../types/discount';
import OrderDetail from '../../../types/OrderDetail';

interface IProps {
    order: Order
    setOrder: React.Dispatch<React.SetStateAction<Order | undefined>>
}

const ProductOrderInfo: React.FC<IProps> = ({ order, setOrder }) => {

    const handleSelectVoucher = async (discount: Discount) => {
        if (!discount.id || discount.id <= 0) return
        const res = await updateDiscountOrder(order.id, discount.id)
        setOrder({ ...res })
    }

    const handleCancel = async () => {
        const res = await updateDiscountOrder(order.id, null)
        setOrder({ ...res })
    }

    return (
        <Box
            className='shadow-section-2'
            sx={{
                backgroundColor: 'white',
                p: { xs: 2, md: 3 },
                my: 2,
                borderRadius: 4,
                position: 'sticky',
                top: 70
            }}
        >
            <Typography variant='h6' mb={2} fontWeight="bold">Thông tin sản phẩm</Typography>
            {order.orderDetails?.map(od => <ProductDetailItem key={od.id} od={od} />)}

            <DiscountSelector order={order} onSelect={handleSelectVoucher} onCancel={handleCancel} />

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
                    <Typography variant="body1">{order.discountAmount.toLocaleString('vi-VN') + ' đ'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant='h5'>Tổng thanh toán: </Typography>
                    <Typography variant="h6">{order.payAmount.toLocaleString('vi-VN') + ' đ'}</Typography>
                </Box>
            </Box>

        </Box>
    );
};

export const ProductDetailItem: React.FC<{ od: OrderDetail }> = ({ od }) => {
    const pd = od.productDetail
    return (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Box
                component="img"
                src={pd.images?.[0].url || ''}
                alt={pd.product.name}
                sx={{
                    width: 100,
                    aspectRatio: '1/1',
                    borderRadius: 2,
                    objectFit: 'cover'
                }}
            />
            <Box>
                <Typography variant='subtitle1' fontWeight="bold">{pd.product.name} x{od.quantity}</Typography>
                <Typography variant='body2' color="text.secondary">Màu: {pd.color.name}</Typography>
                <Typography variant='body2' color="text.secondary">Kích thước: {pd.size.name}</Typography>
                <Typography variant='body2' color="primary" fontWeight="bold">
                    Giá: {od.price.toLocaleString()} VND
                </Typography>
            </Box>
        </Box>
    )
}

export default ProductOrderInfo;
