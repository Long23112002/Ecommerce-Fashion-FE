import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    Typography
} from '@mui/material';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    size?: string;
    quantity: number;
}

const CartPage = () => {
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Áo Phông Nam Clean Việt Nam', price: 299000, image: 'https://m.yodycdn.com/fit-in/filters:format(webp)/products/ao-thun-nam-clean-yody-tsm7137-ghi-1.jpg', size: '2XL', quantity: 2 },
        { id: 2, name: 'Áo Len Nam Thu Đông Cổ 3 Cm', price: 399000, image: 'https://m.yodycdn.com/fit-in/filters:format(webp)/products/alm5001-tan-qjm5055-xnh-4.jpg', size: 'M', quantity: 1 },
    ]);

    const handleQuantityChange = (id: number, change: number) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, quantity: Math.max(1, product.quantity + change) } : product
        ));
    };

    const subtotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const discount = 49850;
    const shipping = 20000;
    const shippingDiscount = 20000;
    const total = subtotal - discount + shipping - shippingDiscount;

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Giỏ hàng
                            </Typography>
                            {products.map((product) => (
                                <Box key={product.id} sx={{ display: 'flex', my: 2 }}>
                                    <img src={product.image} alt={product.name} style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                                        <Typography variant="subtitle1">{product.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.price.toLocaleString('vi-VN')} ₫
                                        </Typography>
                                        <Typography>{product.size}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton onClick={() => handleQuantityChange(product.id, -1)}>
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography sx={{ mx: 1 }}>{product.quantity}</Typography>
                                        <IconButton onClick={() => handleQuantityChange(product.id, 1)}>
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
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
                                Mua hàng ({products.reduce((sum, product) => sum + product.quantity, 0)})
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CartPage