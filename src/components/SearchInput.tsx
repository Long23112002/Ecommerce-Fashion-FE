import { SearchOutlined } from '@mui/icons-material'
import { Box, IconButton, InputBase, SxProps } from '@mui/material'
import React from 'react'

interface IProps {
    value?: string,
    onClick?: () => any,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any,
    sx?: SxProps,
    height?: number
}

const SearchInput: React.FC<IProps> = ({ value, onClick, onChange, sx, height }) => {
    const size = height || 45

    const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClick?.()
        }
    }

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
                value={value || ''}
                sx={{ ml: 1, flex: 1 }}
                onChange={onChange}
                onKeyDown={handleKeydown}
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