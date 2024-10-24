import { Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import React from 'react'
import Product from '../../types/Product'
import useNavigate from '../../hook/useNavigateCustom';

interface IProps {
    product: Product,
    isMobile?: boolean
}

const ProductCard: React.FC<IProps> = ({ product, isMobile }) => {
    const navigate = useNavigate();

    const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        // Xử lý sự kiện thêm sản phẩm vào giỏ h
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
            }}
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <CardMedia
                sx={{
                    paddingTop: '120%',
                    position: 'relative',
                }}
                image={product.images?.[0]}
            >
                <IconButton
                    onClick={handleAddToCart}
                    sx={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#115293',
                        },
                    }}
                >
                    <i className="fa-solid fa-cart-shopping fs-5" />
                </IconButton>
            </CardMedia>
            <CardContent
                sx={{
                    flexGrow: 1,
                    padding: '12px',
                    '&:last-child': {
                        paddingBottom: '12px',
                    },
                }}
            >
                <Typography
                    noWrap
                    sx={{
                        fontWeight: 600,
                        fontSize: !isMobile ? '1.2rem' : '1.1rem',
                        color: '#333',
                        mb: 1,
                    }}
                >
                    {product.name}
                </Typography>
                <Typography
                    color='primary'
                    sx={{
                        fontWeight: 700,
                        fontSize: !isMobile ? '1.1rem' : '1rem',
                        pb: !isMobile ? '0.8rem' : 0
                    }}
                >
                    {product.price?.toLocaleString('vi-VN')} VND
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
