import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import useNavigate from '../../hook/useNavigateCustom';
import { useIsMobile } from '../../hook/useSize';
import Product from '../../types/Product';
// import { useNavigate } from 'react-router-dom';

interface IProps {
    product: Product
}

const ProductCard: React.FC<IProps> = ({ product }) => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                borderRadius: 4,
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
                }}
                image={product.images?.[0]}
            />
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
                        fontSize: !isMobile ? '1.1rem' : '0.9rem',
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