import { ShoppingBasket, ShoppingCart } from '@mui/icons-material'
import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Rating,
    TextField,
    Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import ImageCarousel from './ImageCarousel'
import Product from '../../types/Product'
import ProductDetail from '../../types/ProductDetail'
import { Color } from '../../pages/Admin/Attributes/color/color'
import { Size } from '../../pages/Admin/Attributes/size/size'

interface IProps {
    product: Product
}

const ProductOverview: React.FC<IProps> = ({ product }) => {

    const [quantity, setQuantity] = useState(1)
    const [productDetail, setProductDetail] = useState<ProductDetail | undefined>(product.productDetails?.[0])
    const [colors, setColors] = useState<Color[]>([])
    const [sizes, setSizes] = useState<Size[]>([])
    const [selectedColor, setSelectedColor] = useState<number>(product.productDetails?.[0].color?.id || -1)
    const [selectedSize, setSelectedSize] = useState<number>(product.productDetails?.[0].size?.id || -1)

    useEffect(() => {
        const arrayColor: Color[] = product.productDetails?.reduce((acc: Color[], pd) => {
            if (pd.color && !acc.some(c => c.id === pd.color?.id)) {
                acc.push(pd.color);
            }
            return acc;
        }, []) || [];

        setColors(arrayColor);

        const arraySize: Size[] = product.productDetails?.reduce((acc: Size[], pd) => {
            if (pd.size && !acc.some(c => c.id === pd.size?.id)) {
                acc.push(pd.size);
            }
            return acc;
        }, []) || [];

        setSizes(arraySize);
    }, [product.productDetails]);

    return (
        <Box
            className='shadow-section-2'
            sx={{
                backgroundColor: 'white',
                p: {
                    xs: 2,
                    md: 5
                },
                my: 2,
                borderRadius: {
                    xs: 4,
                    md: 7
                }
            }}
        >
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <ImageCarousel
                        images={productDetail?.images || []}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
                    <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
                        {product.price?.toLocaleString('vi-VN')} VNĐ
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Rating name="half-rating-read" value={product.rating} precision={0.5} readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {product.reviews?.length} đánh giá
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {product.description}
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                        {[
                            { name: 'Thương hiệu', value: product.brand?.name },
                            { name: 'Xuất xứ', value: product.origin?.name },
                            { name: 'Chất liệu', value: product.material?.name },
                            { name: 'Loại sản phẩm', value: product.category?.name },
                        ].map((detail) => (
                            <Box key={detail.name} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                                <Typography variant="body2" color="textSecondary">{detail.name}</Typography>
                                <Typography variant="body2">{detail.value}</Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2">Màu sắc</Typography>
                        <RadioGroup row value={selectedColor} onChange={(e) => setSelectedColor(Number(e.target.value))}>
                            {colors.map((c) => (
                                <FormControlLabel
                                    key={c.id}
                                    value={c.id}
                                    control={<Radio />}
                                    label={c.name}
                                    sx={{
                                        mr: 4
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2">Kích thước</Typography>
                        <RadioGroup row
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(Number(e.target.value))}>
                            {sizes.map((s) => (
                                <FormControlLabel
                                    key={s.id}
                                    value={s.id}
                                    defaultChecked={s.id === productDetail?.size?.id}
                                    control={<Radio />}
                                    label={s.name?.toUpperCase()}
                                    sx={{
                                        mr: 4
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Số lượng:
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                sx={{
                                    minWidth: 40,
                                    height: 40,
                                    borderRadius: '4px 0 0 4px',
                                    p: 0,
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#155a8a',
                                    },
                                }}
                            >
                                -
                            </Button>

                            <TextField
                                variant="outlined"
                                value={quantity}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 1 && value <= (productDetail?.quantity ?? 0)) {
                                        setQuantity(value);
                                    }
                                }}
                                sx={{
                                    width: 60,
                                    textAlign: 'center',
                                    borderRadius: 0,
                                    m: 0,
                                }}
                                inputProps={{
                                    min: 1,
                                    max: productDetail?.quantity,
                                    type: 'number',
                                    style: {
                                        padding: "9px 0 9px 20px",
                                    }
                                }}
                            />

                            <Button
                                variant="contained"
                                onClick={() => setQuantity(Math.min(productDetail?.quantity ?? 0, quantity + 1))}
                                sx={{
                                    minWidth: 40,
                                    height: 40,
                                    borderRadius: '0 4px 4px 0',
                                    p: 0,
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#155a8a',
                                    },
                                }}
                            >
                                +
                            </Button>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Còn {productDetail?.quantity} sản phẩm
                        </Typography>
                    </Box>

                    <Grid
                        container
                        gap={2}
                        sx={{ mt: 4 }}
                    >
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="contained"
                                size='large'
                                startIcon={<ShoppingCart />}
                                sx={{ width: '100%' }}
                            >
                                Thêm vào giỏ
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                variant="contained"
                                color='success'
                                size='large'
                                startIcon={<ShoppingBasket />}
                                sx={{ width: '100%' }}
                            >
                                Mua ngay
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProductOverview