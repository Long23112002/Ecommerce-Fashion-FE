import { Box, CircularProgress } from '@mui/material'
import React from 'react'

interface IProps {
    height?: string
}

const MuiLoading: React.FC<IProps> = ({ height }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: height ? height : '100%',
            }}
        >
            <CircularProgress />
        </Box>
    )
}

export default MuiLoading