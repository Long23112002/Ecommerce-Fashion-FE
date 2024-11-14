import { Box, CircularProgress } from '@mui/material'
import React from 'react'

interface IProps {
    height?: string,
    size?: number
}

const MuiLoading: React.FC<IProps> = ({ height, size }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: height ? height : '100%',
            }}
        >
            <CircularProgress size={size} />
        </Box>
    )
}

export default MuiLoading