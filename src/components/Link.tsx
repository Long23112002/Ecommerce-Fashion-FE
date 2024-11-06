import { Typography } from '@mui/material';
import React, { forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

interface IProps extends RouterLinkProps {
    children: React.ReactNode;
    color?: string;
    underline?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, IProps>(
    ({ children, to, color = '#1E90FF', underline = false, ...props }, ref) => {

        return (
            <RouterLink to={to} ref={ref} {...props}
                style={{
                    color: color,
                    textDecoration: underline ? 'underline' : 'none',
                }}
            >
                <Typography component='span'>
                    {children}
                </Typography>
            </RouterLink>
        );
    }
);

export default Link;
