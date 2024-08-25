import { Stack, Typography } from '@mui/material'
import React from 'react'
import { MenuItem as Item } from 'react-pro-sidebar'
import { useNavigate } from 'react-router-dom'

interface IProps {
    icon?: React.ReactNode,
    to: string,
    collapse?: boolean,
    children: string,
}

const MenuItem: React.FC<IProps> = ({ icon, to, collapse, children }) => {

    const navigate = useNavigate()

    return (
        <Item
            onClick={() => navigate(to)}
            style={{ paddingLeft: collapse === undefined ? 25 : collapse ? 25 : 65 }}
        >
            <Stack
                direction='row'
            >
                {icon}
                <Typography
                    sx={{
                        ml: icon ? 1.8 : 0
                    }}
                >
                    {children}
                </Typography>
            </Stack>
        </Item>
    )
}

export default MenuItem