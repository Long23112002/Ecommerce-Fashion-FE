import { Box, Card, CardContent, CardMedia, Skeleton, Stack, Typography } from '@mui/material';
import React from 'react';
import { useIsMobile } from '../../hook/useSize';
import Product from '../../types/Product';
import Link from '../Link';
import ColorRadio from '../ColorRadio';
import { Color } from '../../pages/Admin/Attributes/color/color';

interface IProps {
    product?: Product;
    loading?: boolean;
}

const ProductCard: React.FC<IProps> = ({ product, loading }) => {
    const isMobile = useIsMobile();

    const renderPrice = (price: number) => (
        <Typography
            color="primary"
            sx={{
                fontWeight: 700,
                fontSize: !isMobile ? '1.1rem' : '0.9rem',
                mb: 1,
            }}
        >
            {price.toLocaleString('vi-VN')}đ
        </Typography>
    );

    const handlePrice = () => {
        return renderPrice(product?.minPrice || 0);
    };

    const handleColor = (): Color[] => {
        const colors = new Set<string>();
        product?.productDetails.forEach(pd => {
            if (colors.size < 5) {
                const colorStr = JSON.stringify(pd.color);
                colors.add(colorStr);
            }
        });
        return Array.from(colors).map(color => JSON.parse(color));
    };


    return (
        <>
            {
                loading || !product ? (
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease-in-out', borderRadius: 4 }}>
                        <Skeleton
                            sx={{ paddingTop: '120%' }}
                            variant="rectangular"
                            width="100%"
                            height="100%"
                        />

                        <CardContent sx={{ flexGrow: 1, padding: '12px' }}>
                            <Skeleton width="80%" sx={{ mt: 1 }} />
                            <Skeleton width="60%" sx={{ mt: 1 }} />
                            <Skeleton variant="circular" width={28} height={28} sx={{ mt: 1 }} />
                        </CardContent>
                    </Card>
                ) : (
                    <Link to={`/product/${product.id}`}>
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
                        >
                            <CardMedia sx={{ paddingTop: '120%' }} image={product.image} />
                            <CardContent sx={{ flexGrow: 1, padding: '12px' }}>
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
                                {handlePrice()}
                                <Box>
                                    <Stack direction="row" spacing={1} mt={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
                                        {handleColor().map(c => (
                                            <ColorRadio
                                                key={c.id}
                                                color={c}
                                                size={25}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Link>
                )
            }
        </>
    )
};

export default ProductCard;
