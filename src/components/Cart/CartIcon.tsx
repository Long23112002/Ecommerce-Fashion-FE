import { Box, IconButton } from '@mui/material';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCartByUserId } from '../../api/CartApi';
import useCart from '../../hook/useCart';
import { useUserAction } from '../../hook/useUserAction';

const CartIcon: React.FC = () => {
    const navigate = useNavigate()
    const { total, reload } = useCart()
    const user = useUserAction().get()
    useEffect(() => {
        reload()
    }, [user])

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
                onClick={() => navigate("/cart")}
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
                        display: total ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 12,
                    }}
                >
                    {total}
                </Box>
            </IconButton>
        </>
    )
}

export default CartIcon