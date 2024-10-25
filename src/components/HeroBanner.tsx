import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { useIsMobile } from '../hook/useWindowSize';

interface IProps {
    image?: string
}

const HeroBanner: React.FC<IProps> = ({ image }) => {

    const isMobile = useIsMobile();
    const defaultImage = "https://t4.ftcdn.net/jpg/04/15/97/33/360_F_415973312_5yg3MrkRdi2SMHyVKbB4h7GgE5HrgUlb.jpg";

    return (
        <>
            <Box
                sx={{
                    backgroundImage: `url(${image || defaultImage})`,
                    backgroundSize: 'cover',
                    height: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Typography sx={{ fontWeight: 700, fontSize: isMobile ? '30px' : '45px' }}>
                        Ecommerce Fashion
                    </Typography>
                    <Typography sx={{ mb: 2, fontSize: isMobile ? '20px' : '30px' }}>
                        Thời trang Việt cho người Việt
                    </Typography>
                </Container>
            </Box>
        </>
    )
}

export default HeroBanner