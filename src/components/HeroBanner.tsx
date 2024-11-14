import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';
import { useIsMobile, useUserHeaderSize } from '../hook/useSize';
// @ts-ignore
import Slider from 'react-slick';   
import '../styles/slick-dot.css'


interface IProps {
    images?: string[],
    title?: string,
    subtitle?: string,
}

const HeroBanner: React.FC<IProps> = ({ images }) => {
    const headerSize = useUserHeaderSize()
    const defaultImage = "https://t4.ftcdn.net/jpg/04/15/97/33/360_F_415973312_5yg3MrkRdi2SMHyVKbB4h7GgE5HrgUlb.jpg";

    const settings = {
        dots: true,
        infinite: true,
        swipe: true,
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        dotsClass: 'dots-banner',
        nextArrow: <Arrow direction="right" />,
        prevArrow: <Arrow direction="left" />,
        customPaging: () => (
            <Box/>
        ),
        
        appendDots: (dots: React.ReactNode) => (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 15,
                    width: '100%',
                    padding: 0,
                    margin: 0,
                    zIndex: 2,
                }}
            >
                {dots}
            </Box>
        ),

    };

    const banner = (image?: string) => {
        return <Box
            sx={{
                backgroundImage: `url(${image || defaultImage})`,
                backgroundSize: 'cover',
                minHeight: `calc(100vh - ${headerSize}px - 1px)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                backgroundPosition: 'center',
            }}
        >
        </Box>
    }

    return (
        <Box>
            <Slider {...settings}>
                {images && images.length
                    ?
                    images.map((image, index) => (
                        <Box key={index}>
                            {banner(image)}
                        </Box>
                    ))
                    :
                    <>
                        {banner()}
                    </>
                }
            </Slider>
        </Box>
    )
}

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
                [direction === 'left' ? 'left' : 'right']: 20,
                zIndex: 1,
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

export default HeroBanner