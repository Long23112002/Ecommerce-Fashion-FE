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
import { useState, useEffect } from 'react';
import ProductDetail from '../../../types/ProductDetail';
import Cookies from 'js-cookie';
import { fetchCartByUserId, createCart, updateCart, deleteCart } from '../../../api/CartApi';
import LoadingCustom from "../../../../components/Loading/LoadingCustom.js";
import { toast } from "react-toastify";

const CartPage = () => {
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchCartData = async () => {
        const token = Cookies.get("accessToken");

        // Check if token is defined
        if (!token) {
            console.error("Token is not defined");
            return;
        }
        setLoading(true);

        try {
            const data = await fetchCartByUserId(token);
            const mappedDetails = data.cartValueInfos.map((item: any) => ({
                id: item.productDetail.id,
                price: item.productDetail.price,
                originPrice: item.productDetail.originPrice,
                product: {
                    name: item.productDetail.product.name,
                },
                images: item.productDetail.images || [],
                size: {
                    name: item.productDetail.size.name
                },
                color: {
                    name: item.productDetail.color.name
                },
                quantity: item.quantity
            }));
            setProductDetails(mappedDetails);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const handleQuantityChange = (id: number, change: number) => {
        setProductDetails(productDetails.map(pd => {
            if (pd.id === id) {
                const newQuantity = (pd.quantity || 0) + change;
    
                // Kiểm tra nếu số lượng mới vượt quá số lượng tối đa
                if (newQuantity > pd.quantity) {
                    toast.error("Số lượng mặt hàng đạt tối đa");
                    return pd; // Giữ nguyên số lượng nếu vượt quá giới hạn
                }
    
                return { ...pd, quantity: Math.max(1, newQuantity) };
            }
            return pd;
        }));
    };

    const subtotal = productDetails.reduce((sum, pd) => sum + (pd.originPrice ? pd.originPrice:pd.price||0) * (pd.quantity || 0), 0);
    const discount = productDetails.reduce((sum, pd) => 
        pd.originPrice ? sum + ((pd.originPrice - pd.price)) * (pd.quantity || 0) : sum, 0);
    // const shipping = 20000;
    // const shippingDiscount = 20000;
    const total = Math.max(0, subtotal - discount);

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Box className='shadow-section' sx={{
                        backgroundColor: 'white',
                        borderRadius: 5,
                        padding: 2
                    }}>
                        <Typography variant="h5" gutterBottom>
                            Giỏ hàng
                        </Typography>
                        {productDetails.map((pd) => (
                            <Box key={pd.id} sx={{ display: 'flex', my: 2, borderBottom: '1px solid #ccc', paddingBottom: 1 }}>
                                <img src={pd.images?.[0]} alt={pd.product?.name} style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                <Box sx={{ ml: 2, flexGrow: 1 }}>
                                    <Typography variant="subtitle1">{pd.product?.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {(pd.originPrice ? pd.originPrice:pd.price||0).toLocaleString('vi-VN')} ₫
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" >{pd.size?.name}</Typography>
                                    <Typography variant="body2" color="text.secondary" >{pd.color?.name}</Typography>
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
                    <Box className='shadow-section' sx={{ backgroundColor: 'white', borderRadius: 5, padding: 2 }}>
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
                        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography>Vận chuyển</Typography>
                            <Typography>{shipping.toLocaleString('vi-VN')} ₫</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography>Giảm giá vận chuyển</Typography>
                            <Typography color="error">-{shippingDiscount.toLocaleString('vi-VN')} ₫</Typography>
                        </Box> */}
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
};

export default CartPage;
