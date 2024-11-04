import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React from 'react';
// @ts-ignore
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Product from '../../types/Product';
import ProductCard from './ProductCard';
import { useIsMobile } from '../../hook/useSize';

interface IProps {
    similarProduct: Product[]
}

const SimilarProducts: React.FC<IProps> = ({ similarProduct }) => {
    const settings = {
        dots: true,
        infinite: false,
        swipe: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6,
        nextArrow: <Arrow direction="right" />,
        prevArrow: <Arrow direction="left" />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
        ],
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
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, color: '#333', mb: 2 }}
            >
                Sản phẩm tương tự
            </Typography>

            <Slider {...settings}>
                {similarProduct.map((product) => (
                    <Box key={product.id} px={1} pb={0.5}>
                        <ProductCard product={product} />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
}

interface IArrowProps {
    onClick?: () => void;
    direction: 'right' | 'left';
}

const Arrow: React.FC<IArrowProps> = ({ onClick, direction }) => {
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
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                },
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

export default SimilarProducts