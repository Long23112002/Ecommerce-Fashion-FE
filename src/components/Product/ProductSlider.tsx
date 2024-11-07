import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
// @ts-ignore
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useIsMobile } from '../../hook/useSize';
import Product from '../../types/Product';
import ProductCard from './ProductCard';

interface IProps {
    title?: string;
    products: Product[];
    loading?: boolean;
    slidesToShow?: number;
    link?: React.ReactNode;
    slider?: boolean;
}

const ProductSlider: React.FC<IProps> = ({
    title,
    products,
    slidesToShow = 6,
    link,
    slider = true,
    loading,
}) => {
    const settings = {
        dots: true,
        infinite: false,
        swipe: true,
        speed: 500,
        slidesToShow,
        slidesToScroll: slidesToShow,
        nextArrow: <Arrow direction="right" />,
        prevArrow: <Arrow direction="left" />,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } },
            { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        ],
    };

    const renderSlider = () => {
        if (!products.length) {
            return (
                <Slider {...settings}>
                    {new Array(slidesToShow).fill(null).map((_, i) => (
                        <Box key={i} px={1} pb={0.5}>
                            <ProductCard loading={loading} />
                        </Box>
                    ))}
                </Slider>
            )
        }
        return (
            <Slider {...settings}>
                {products.map((product) => (
                    <Box key={product.id} px={1} pb={0.5}>
                        <ProductCard product={product} loading={loading} />
                    </Box>
                ))}
            </Slider>
        )
    };

    const renderGrid = () => {
        if (!products.length) {
            return (
                <Grid container spacing={2}>
                    {new Array(slidesToShow).fill(null).map((_, i) => (
                        <Grid item key={i} xs={6} sm={4} md={12 / slidesToShow}>
                            <ProductCard loading={loading} />
                        </Grid>
                    ))}
                </Grid>
            )
        }
        <Grid container spacing={2}>
            {products.slice(0, slidesToShow).map((product) => (
                <Grid item key={product.id} xs={6} sm={4} md={12 / slidesToShow}>
                    <ProductCard product={product} loading={true} />
                </Grid>
            ))}
        </Grid>
    };

    return (
        <Box
            className="shadow-section-2"
            sx={{
                backgroundColor: 'white',
                px: { xs: 2, md: 5 },
                py: 3,
                borderRadius: { xs: 4, md: 7 },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 0 }}>
                    {title}
                </Typography>
                {link}
            </Box>
            {slider ? renderSlider() : renderGrid()}
        </Box>
    );
};



const Arrow: React.FC<{ direction: 'right' | 'left'; onClick?: () => void }> = ({
    onClick,
    direction,
}) => {
    const isMobile = useIsMobile();
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [direction === 'left' ? 'left' : 'right']: -17,
                zIndex: 2,
                width: isMobile ? 40 : 50,
                height: isMobile ? 40 : 50,
                backgroundColor: 'rgba(240, 240, 240, 0.5)',
                boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'background-color 0.3s, transform 0.2s',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
        >
            {direction === 'left' ? (
                <ArrowBackIosNew sx={{ fontSize: 25, color: '#333' }} />
            ) : (
                <ArrowForwardIos sx={{ fontSize: 25, color: '#333' }} />
            )}
        </Box>
    );
};

export default ProductSlider;
