import React from 'react'
import { useUserHeaderSize } from '../../hook/useSize'
import MuiLoading from './MuiLoading'
import { Box } from '@mui/material'

const MuiLoadingScreen = () => {
    return (
        <Box position='fixed' top={0} left={0} bottom={0} right={0} bgcolor='rgb(0,0,0,0.05)'>
            <MuiLoading size={55} />
        </Box>
    )
}

export default MuiLoadingScreen