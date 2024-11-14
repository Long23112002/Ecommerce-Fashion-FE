import { ShoppingBasket, ShoppingCart } from '@mui/icons-material'
import {
    Box,
    Button,
    Grid,
    Rating,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Color } from '../../pages/Admin/Attributes/color/color'
import { Size } from '../../pages/Admin/Attributes/size/size'
import Product from '../../types/Product'
import ProductDetail from '../../types/ProductDetail'
import ColorRadio from '../ColorRadio'
import SizeButton from '../SizeButton'
import ImageCarousel from './ImageCarousel'

interface IProps {
    product: Product,
    productDetails: ProductDetail[]
}

const ProductOverview: React.FC<IProps> = ({ product, productDetails }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [quantity, setQuantity] = useState(1)
    const [colors, setColors] = useState<Color[]>([])
    const [sizes, setSizes] = useState<Size[]>([])
    const [selectedProductDetail, setSeletedProductDetail] = useState<ProductDetail>()
    const [selectedColor, setSelectedColor] = useState<number | null>(null)
    const [selectedSize, setSelectedSize] = useState<number | null>(null)

    useEffect(() => {
        const sizeId = searchParams.get('sizeId') as number | null;
        const colorId = searchParams.get('colorId') as number | null;

        if (colorId == selectedColor || sizeId == selectedSize) return

        if (sizeId == null || colorId == null) {
            setSelectedSize(productDetails?.[0].size?.id || null)
            setSelectedColor(productDetails?.[0].color?.id || null)
            return
        }

        setSelectedColor(colorId)
        setSelectedSize(sizeId)
    }, [searchParams, productDetails])

    useEffect(() => {
        if (!selectedColor || !selectedSize) return;

        const params = new URLSearchParams();
        if (selectedColor != null) {
            params.set('colorId', selectedColor + '');
        }
        if (selectedSize != null) {
            params.set('sizeId', selectedSize + '');
        }

        navigate({ search: params.toString() }, { replace: true });

        const selectedProductDetail = productDetails.find(
            pd => pd.color?.id === selectedColor && pd.size?.id === selectedSize
        );

        setSeletedProductDetail({...selectedProductDetail});
    }, [selectedColor, selectedSize, navigate, productDetails]);

    useEffect(() => {
        const sizes = getSizesByColor(selectedColor);
        const isSizeExist = sizes.includes(selectedSize || -1)
        if (!isSizeExist) {
            setSelectedSize(sizes[0])
        }
    }, [selectedColor])

    const getSizesByColor = (id: number | undefined | null): number[] => {
        if (id) {
            return productDetails
                .filter(pd => (pd.color && pd.color.id == id))
                .map(pd => pd.size?.id || -1)
        }
        return []
    }

    const arrayColor: Color[] = productDetails?.reduce((acc: Color[], pd) => {
        if (pd.color && !acc.some(c => c.id === pd.color?.id)) {
            acc.push(pd.color);
        }
        return acc;
    }, []) || [];

    const arraySize: Size[] = productDetails?.reduce((acc: Size[], pd) => {
        if (pd.size && !acc.some(c => c.id === pd.size?.id)) {
            acc.push(pd.size);
        }
        return acc;
    }, []) || [];

    useEffect(() => {
        setSeletedProductDetail(productDetails[0])
        setColors(arrayColor);
        setSizes(arraySize);
    }, [productDetails]);

    useEffect(() => {
        if (colors.length && colors[0].id) {
            setSelectedColor(colors[0].id)
        }
    }, [colors])

    useEffect(() => {
        if (sizes.length && sizes[0].id) {
            setSelectedSize(sizes[0].id)
        }
    }, [sizes])

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
                        images={selectedProductDetail?.images?.map((image) => image.url) || []}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
                    <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
                        {selectedProductDetail?.price?.toLocaleString('vi-VN')} VNĐ
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
                        <Typography variant="body2">Màu sắc: {colors.filter(c => selectedColor == c.id)[0]?.name || ''}</Typography>
                        <Stack direction="row" spacing={1} mt={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                            {colors.map((c) => (
                                <ColorRadio
                                    key={c.id}
                                    color={c}
                                    // disable={!getColorsBySize(selectedSize).includes(c.id || -1)}
                                    checked={c.id == selectedColor}
                                    onClick={() => { setSelectedColor(c.id || null) }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2">Kích thước: {sizes.filter(s => selectedSize == s.id)[0]?.name || ''}</Typography>
                        <Stack direction="row" spacing={1} mt={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                            {sizes.map((s) => (
                                <SizeButton
                                    key={s.id}
                                    size={s}
                                    disable={!getSizesByColor(selectedColor).includes(s.id || -1)}
                                    checked={s.id == selectedSize}
                                    onClick={() => { setSelectedSize(s.id || null) }}
                                />
                            ))}
                        </Stack>
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
                                    if (value >= 1 && value <= (selectedProductDetail?.quantity ?? 0)) {
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
                                    max: selectedProductDetail?.quantity,
                                    type: 'number',
                                    style: {
                                        padding: "9px 0 9px 20px",
                                    }
                                }}
                            />

                            <Button
                                variant="contained"
                                onClick={() => setQuantity(Math.min(selectedProductDetail?.quantity ?? 0, quantity + 1))}
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
                            Còn {selectedProductDetail?.quantity} sản phẩm
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