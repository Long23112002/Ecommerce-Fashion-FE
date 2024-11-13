import { Box, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
const CartIcon: React.FC = () => {
    const navigate = useNavigate()

    // TODO: TẠO VÀ SỬ DỤNG REDUX
    // const [totalInCart, setTotalInCart] = useState<number>(10)
    const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity)
    console.log("Total Quantity:", totalQuantity);
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
                        display: totalQuantity ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 12,
                    }}
                >
                    {totalQuantity}
                </Box>
            </IconButton>
        </>
    )
}

export default CartIcon