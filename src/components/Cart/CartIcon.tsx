import { Box, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartIcon: React.FC = () => {
    const navigate = useNavigate()

    // TODO: TẠO VÀ SỬ DỤNG REDUX
    const [totalInCart, setTotalInCart] = useState<number>(10)

    return (
        <>
            <IconButton
                sx={{
                    color: '#A6B0B8',
                    position: 'relative',
                    aspectRatio: '1/1',
                    ml: {
                        xs: 0.5,
                        md: 2
                    }
                }}
                onClick={()=>navigate("/cart")}
            >
                <i className='fa-solid fa-cart-shopping fs-5' />
                <Box
                    component='span'
                    sx={{
                        position: 'absolute',
                        top: 3,
                        right: 0,
                        width: 16,
                        height: 16,
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        display: totalInCart ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 12,
                    }}
                >
                    {totalInCart < 10 ? totalInCart : '9+'}
                </Box>
            </IconButton>
        </>
    )
}

export default CartIcon