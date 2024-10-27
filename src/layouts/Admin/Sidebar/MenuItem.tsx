import { Stack, SxProps, Typography } from '@mui/material'
import React, { CSSProperties } from 'react'
import { MenuItem as Item } from 'react-pro-sidebar'
import { useNavigate } from 'react-router-dom'

interface IProps {
    icon?: React.ReactNode,
    to?: string,
    collapse?: boolean,
    children: React.ReactNode,
    onClick?: () => any,
    styleItem?: CSSProperties,
    sxTypo?: SxProps,
    noTypo?: boolean
}

const MenuItem: React.FC<IProps> = ({ icon, to, collapse, children, onClick, styleItem, sxTypo, noTypo }) => {

    const navigate = useNavigate()

    const navigateTo = () => {
        if (to) {
            navigate(to)
        }
        if (onClick) {
            onClick()
        }
    }

    return (
        <Item
            onClick={navigateTo}
            style={{
                paddingLeft: collapse === undefined ? 25 : collapse ? 25 : 65,
                ...styleItem
            }}
        >
            <Stack
                direction='row'
            >
                {icon}
                {
                    noTypo
                        ?
                        children
                        :
                        <Typography
                            sx={{
                                ml: icon ? 1.8 : 0,
                                ...sxTypo
                            }}
                        >
                            {children}
                        </Typography>
                }

            </Stack>
        </Item>
    )
}

export default MenuItem