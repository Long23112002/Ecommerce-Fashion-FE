import { ShoppingBasket, ShoppingCart } from '@mui/icons-material'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Rating,
    TextField,
    Typography
} from '@mui/material'
import React, { useState } from 'react'
import ImageCarousel from '../../components/Product/ImageCarousel'
import Product from '../../types/Product'

const ProductDetail: React.FC = () => {
    const [product, setProduct] = useState<Product>({
        id: 1,
        name: "Áo Thun Unisex Cotton",
        description: "Áo thun unisex cotton cao cấp, thiết kế đơn giản nhưng tinh tế, phù hợp cho cả nam và nữ.",
        images: [
            "https://owen.cdn.vccloud.vn/media/catalog/product/cache/b23ce5dda22a5cf61bb112966c86a52a/_/m/_mb_tsn220964_4_.jpg",
            "https://owen.cdn.vccloud.vn/media/catalog/product/cache/d52d7e242fac6dae82288d9a793c0676/_/m/_mb_tsn220964_2_.jpg",
            "https://owen.cdn.vccloud.vn/media/catalog/product/cache/d52d7e242fac6dae82288d9a793c0676/_/m/_mb_tsn220964_5_.jpg"
        ],
        price: 299000,
        brand: {
            name: "FashionVN"
        },
        origin: {
            name: "Việt Nam"
        },
        material: {
            name: "100% Cotton"
        },
        category: {
            name: "Áo thun"
        },
        quantity: 50,
        colors: [
            { name: "Đen" },
            { name: "Đỏ" },
            { name: "Xanh" },
            { name: "Hồng" },
        ],
        sizes: [
            { name: "S" },
            { name: "M" },
            { name: "L" },
            { name: "XL" },
        ],
        rating: 3,
        reviews: [
            {
                id: 1,
                user: { name: "Trần Minh Thái" },
                rating: 5,
                comment: "Sản phẩm tốt"
            },
            {
                id: 2,
                user: { name: "Nguyễn Hải Long" },
                rating: 4,
                comment: "Tôi rất tuyệt tôi ủng hộ shop"
            },
            {
                id: 3,
                user: { name: "Mai Duy Nghiệp" },
                rating: 1,
                comment: "Lừa đảo, ncct"
            }
        ]
    })
    const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name ?? "")
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0].name + "")
    const [quantity, setQuantity] = useState(1)

    return (
        <Box sx={{ maxWidth: '1200px', mx: 'auto', py: 4, px: 2 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <ImageCarousel
                        images={product.images || []}
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
                        <RadioGroup row value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                            {product.colors?.map((color) => (
                                <FormControlLabel
                                    key={color.name}
                                    value={color.name}
                                    control={<Radio />}
                                    label={color.name}
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
                            onChange={(e) => setSelectedSize(e.target.value)}>
                            {product.sizes?.map((size) => (
                                <FormControlLabel
                                    key={size.name}
                                    value={size.name}
                                    control={<Radio />}
                                    label={size.name?.toUpperCase()}
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
                                    if (value >= 1 && value <= (product.quantity ?? 0)) {
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
                                    max: product.quantity,
                                    type: 'number',
                                    style: {
                                        padding: "9px 0 9px 20px",
                                    }
                                }}
                            />

                            <Button
                                variant="contained"
                                onClick={() => setQuantity(Math.min(product.quantity ?? 0, quantity + 1))}
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
                            Còn {product.quantity} sản phẩm
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

            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Bình luận
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="Viết bình luận của bạn..."
                    variant="outlined"
                    margin="normal"
                    sx={{ backgroundColor: 'white' }}
                />
                <Button variant="contained" color="primary" className="mt-2">
                    Gửi bình luận
                </Button>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5">Đánh giá từ khách hàng</Typography>
                {product.reviews?.map((review) => (
                    <Card key={review.id} sx={{ mt: 2 }}>
                        <CardContent>
                            <Box display='flex'
                                alignItems='center'
                                gap={1}
                            >
                                <Avatar src='' />
                                <Typography variant="h6">{review.user?.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', mt: 1 }}>
                                <Rating value={review.rating} precision={0.5} readOnly />
                            </Box>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {review.comment}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>



        </Box>
    )
}

export default ProductDetail