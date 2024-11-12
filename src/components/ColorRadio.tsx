import React from 'react'
import { Color } from '../pages/Admin/Attributes/color/color'
import { Box } from '@mui/material'

interface IProps {
    color: Color;
    checked?: boolean;
    disable?: boolean;
    onClick?: (...args: any[]) => void;
    // onOver?: 
    size?: number
}

const ColorRadio: React.FC<IProps> = ({ color, checked, disable, onClick, size = 40 }) => {
    return (
        <Box
            component="span"
            onClick={() => { if (!disable && onClick) onClick(); }}
            sx={{
                width: size,
                height: size,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '0.1px solid black',
                padding: checked ? 0.2 : 0,
                opacity: disable ? 0.5 : 1, // Giảm độ sáng khi disable
                cursor: disable ? 'not-allowed' : 'pointer', // Con trỏ không cho phép khi disable
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: disable ? '#e0e0e0' : color.code, // Đặt màu xám khi disable
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: checked ? '1px solid black' : '',
                }}
            />
        </Box>
    );
}

export default ColorRadio;
