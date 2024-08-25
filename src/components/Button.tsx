import { ButtonBase, SxProps, Theme } from '@mui/material'
import React from 'react'

interface IProps {
    children: React.ReactNode;
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    sx?: SxProps<Theme>;
}

const Button: React.FC<IProps> = ({ children, color, backgroundColor, fontSize, onClick, sx }) => {
    return (
        <ButtonBase
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor ?? 'white',
                color: color ?? 'black',
                padding: 1,
                borderRadius: 1.5,
                fontSize: fontSize ?? '16px',
                textAlign: 'center',
                transition: 'filter 0.3s, transform 0.2s',
                '&:hover': {
                    filter: 'saturate(2)',
                },
                ...sx
            }}
        >
            {children}
        </ButtonBase>
    )
}

export default Button;
