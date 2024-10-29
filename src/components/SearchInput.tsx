import { SearchOutlined } from '@mui/icons-material'
import { Box, IconButton, InputBase, SxProps } from '@mui/material'
import React from 'react'

interface IProps {
    onClick?: () => any,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any,
    sx?: SxProps,
    height?: number
}

const SearchInput: React.FC<IProps> = ({ onClick, onChange, sx, height }) => {
    const size = height || 45
    return (
        <Box
            sx={{
                border: '1px solid #9b9b9b',
                backgroundColor: '#fafafa',
                borderRadius: '1000px',
                alignItems: 'center',
                padding: '0 0 0 8px',
                display: 'flex',
                height: size,
                ...sx
            }}
        >
            <InputBase
                placeholder="Bạn tìm gì..."
                sx={{ ml: 1, flex: 1 }}
                onChange={onChange}
            />
            <IconButton
                sx={{ marginLeft: 1, height: (size), width: (size) }}
                onClick={onClick}
            >
                <SearchOutlined sx={{ fontSize: size * 0.6 }} />
            </IconButton>
        </Box>
    )
}

export default SearchInput