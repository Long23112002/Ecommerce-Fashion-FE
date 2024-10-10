import { Button, Menu, SxProps, Theme } from '@mui/material';
import React, { useEffect } from 'react';

interface IProps {
    children: React.ReactNode,
    sx?: SxProps<Theme>;
    open?: boolean
}

const MenuCustom: React.FC<IProps> = ({ children, sx, open }) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openAnChorEl = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (open !== null && open !== undefined && open === false) {
            handleClose()
        }
    }, [open])

    return (
        <>
            {open &&
                (<>
                    <Button
                        id="basic-button"
                        aria-controls={openAnChorEl ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openAnChorEl ? 'true' : undefined}
                        onClick={(e) => handleClick(e)}
                        color='inherit'
                        variant='contained'
                        sx={{
                            padding: 0,
                            width: '2.5em',
                            minWidth: '2.5em',
                            aspectRatio: '1/1',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            ...sx
                        }}
                    >
                        <i className="fa-solid fa-ellipsis-vertical fs-6" />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openAnChorEl}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'center',
                            horizontal: 'right',
                        }}
                        elevation={5}
                        sx={{
                            borderRadius: '2em'
                        }}
                    >
                        {children}
                    </Menu>
                </>)
            }
        </>
    )
}

export default MenuCustom