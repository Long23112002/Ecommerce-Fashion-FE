import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    Typography
} from '@mui/material';
import { useState } from 'react';
import ProductDetail from '../../../types/ProductDetail';

const CartPage = () => {
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([
        {
            id: 1,
            price: 299000,
            product: {
                name: 'Áo Phông Nam Clean Việt Nam',
                images: ['https://m.yodycdn.com/fit-in/filters:format(webp)/products/ao-thun-nam-clean-yody-tsm7137-ghi-1.jpg'],
            },
            size: {
                name: 'XL'
            },
            color: {
                name: 'Trắng'
            },
            quantity: 2
        },
        {
            id: 2,
            price: 150000,
            product: {
                name: 'Quần Jean Nữ Basic',
                images: ['https://salt.tikicdn.com/cache/280x280/ts/product/41/63/3c/45fc1889b34d853a9bfbcef1dc705a28.jpg.webp'],
            },
            size: {
                name: 'M'
            },
            color: {
                name: 'Xanh'
            },
            quantity: 1
        },
        {
            id: 3,
            price: 450000,
            product: {
                name: 'Áo khoác nam chống nắng gió thu đông Doka',
                images: ['https://salt.tikicdn.com/cache/750x750/ts/product/67/c4/ef/ac34217d8d1f56c87118f586b87fee7a.jpg.webp'],
            },
            size: {
                name: '42'
            },
            color: {
                name: 'Đen'
            },
            quantity: 1
        },
    ]);

    const handleQuantityChange = (id: number, change: number) => {
        setProductDetails(productDetails.map(pd =>
            pd.id === id ? { ...pd, quantity: Math.max(1, (pd.quantity || 0) + change) } : pd
        ));
    };

    const subtotal = productDetails.reduce((sum, pd) => sum + (pd.price || 0) * (pd.quantity || 0), 0);
    const discount = 49850;
    const shipping = 20000;
    const shippingDiscount = 20000;
    const total = subtotal - discount + shipping - shippingDiscount;

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Giỏ hàng
                        </Typography>
                        {productDetails.map((pd) => (
                            <Box key={pd.id} sx={{ display: 'flex', my: 2, borderBottom: '1px solid #ccc', paddingBottom: 1 }}>
                                <img src={pd.product?.images?.[0]} alt={pd.product?.name} style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                <Box sx={{ ml: 2, flexGrow: 1 }}>
                                    <Typography variant="subtitle1">{pd.product?.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {(pd.price || 0).toLocaleString('vi-VN')} ₫
                                    </Typography>
                                    <Typography variant="body2" >{pd.size?.name}</Typography>
                                    <Typography variant="body2" >{pd.color?.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => handleQuantityChange(pd.id || -1, -1)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography sx={{ mx: 1 }}>{pd.quantity}</Typography>
                                    <IconButton onClick={() => handleQuantityChange(pd.id || -1, 1)}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, padding: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Chi tiết đơn hàng
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography>Tổng giá trị sản phẩm</Typography>
                            <Typography>{subtotal.toLocaleString('vi-VN')} ₫</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography>Giảm giá</Typography>
                            <Typography color="error">-{discount.toLocaleString('vi-VN')} ₫</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography>Vận chuyển</Typography>
                            <Typography>{shipping.toLocaleString('vi-VN')} ₫</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography>Giảm giá vận chuyển</Typography>
                            <Typography color="error">-{shippingDiscount.toLocaleString('vi-VN')} ₫</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography variant="h6">Tổng thanh toán</Typography>
                            <Typography variant="h6">{total.toLocaleString('vi-VN')} ₫</Typography>
                        </Box>
                        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                            Mua hàng ({productDetails.reduce((sum, pd) => sum + (pd.quantity || 0), 0)})
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CartPage;
