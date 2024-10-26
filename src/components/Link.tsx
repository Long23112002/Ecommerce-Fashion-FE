import React from 'react'
import useNavigate from '../hook/useNavigateCustom'
import { Typography } from '@mui/material'

interface IProps {
    children: React.ReactNode,
    to: string,
    color?: string,
    underline?: boolean
}

const Link: React.FC<IProps> = ({ children, to, color, underline }) => {
    const navigate = useNavigate()

    const handleNavigateTo = () => {
        navigate(to);
    }

    return (
        <Typography
            sx={{
                cursor: 'pointer',
                color: color || '#1E90FF',
                textDecoration: underline ? 'underline' : 'none'
            }}
            onClick={handleNavigateTo}
        >
            {children}
        </Typography>
    )
}

export default Link