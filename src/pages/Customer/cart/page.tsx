import React, { useState } from 'react';
import {
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Divider,
    TextField,
    Box,
    Checkbox,
} from '@mui/material';

const CartPage = () => {
    const [quantity, setQuantity] = useState({ item1: 2, item2: 1 });

    const handleQuantityChange = (item, value) => {
        setQuantity((prev) => ({ ...prev, [item]: Math.max(1, value) }));
    };

    return (
        <Grid container spacing={3} sx={{ padding: 4 }}>
            {/* Giỏ hàng */}
            <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                    Giỏ hàng
                </Typography>

                <Box sx={{ background: '#f6f6f6', padding: 2, borderRadius: 1 }}>
                    <Typography color="success.main">
                        Chúc mừng! Đơn hàng của bạn được <b>Miễn phí vận chuyển</b>
                    </Typography>
                </Box>

                <Typography variant="subtitle1" color="error" mt={2}>
                    Khuyến mại trong giỏ hàng của bạn chỉ còn trong <b>6 phút 30 giây</b>
                </Typography>

                {/* Sản phẩm */}
                {[
                    {
                        id: 'item1',
                        name: 'Áo Phông Nam Clean Việt Nam',
                        price: 299000,
                        image: 'https://via.placeholder.com/150',
                        color: 'Ghi, 2XL',
                    },
                    {
                        id: 'item2',
                        name: 'Áo Len Nam Thu Đông Cổ 3 Cm',
                        price: 399000,
                        image: 'https://via.placeholder.com/150',
                        color: 'Tàn, M',
                    },
                ].map((item) => (
                    <Card key={item.id} sx={{ display: 'flex', marginY: 2 }}>
                        <Checkbox sx={{ alignSelf: 'center' }} />
                        <CardMedia
                            component="img"
                            sx={{ width: 100 }}
                            image={item.image}
                            alt={item.name}
                        />
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.color}
                            </Typography>
                            <Typography variant="h6" color="primary">
                                {item.price.toLocaleString()} ₫
                            </Typography>
                        </CardContent>

                        {/* Chỉnh số lượng */}
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                            <Button
                                onClick={() =>
                                    handleQuantityChange(item.id, quantity[item.id] - 1)
                                }
                            >
                                -
                            </Button>
                            <TextField
                                value={quantity[item.id]}
                                onChange={(e) =>
                                    handleQuantityChange(item.id, parseInt(e.target.value))
                                }
                                size="small"
                                sx={{ width: 40, textAlign: 'center' }}
                            />
                            <Button
                                onClick={() =>
                                    handleQuantityChange(item.id, quantity[item.id] + 1)
                                }
                            >
                                +
                            </Button>
                        </Box>
                    </Card>
                ))}
            </Grid>

            {/* Chi tiết đơn hàng */}
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                    Chi tiết đơn hàng
                </Typography>
                <Divider />

                <Box sx={{ marginY: 2 }}>
                    <Typography>
                        Tổng giá trị sản phẩm: <b>997.000 ₫</b>
                    </Typography>
                    <Typography>
                        Giảm giá: <b>-49.850 ₫</b>
                    </Typography>
                    <Typography>
                        Vận chuyển: <b>20.000 ₫</b>
                    </Typography>
                    <Typography>
                        Giảm giá vận chuyển: <b>-20.000 ₫</b>
                    </Typography>
                </Box>
                <Divider />

                <Typography variant="h5" mt={2}>
                    Tổng thanh toán: <b>947.150 ₫</b>
                </Typography>
                <Typography variant="body2" color="error">
                    Bạn đã tiết kiệm được 69.850 ₫
                </Typography>

                <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Mua hàng (3)
                </Button>

                <Typography variant="caption" display="block" align="center" mt={2}>
                    Chọn Voucher giảm giá ở bước tiếp theo
                </Typography>

                {/* Phương thức thanh toán */}
                <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 2 }}>
                    {['ZaloPay', 'Visa', 'MasterCard', 'VNPAY', 'MoMo'].map((method) => (
                        <img
                            key={method}
                            src={`https://via.placeholder.com/50?text=${method}`}
                            alt={method}
                            style={{ height: 40 }}
                        />
                    ))}
                </Box>
            </Grid>
        </Grid>
    );
};

export default CartPage;
