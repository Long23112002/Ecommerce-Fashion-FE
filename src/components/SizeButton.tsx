import React from 'react'
import { Size } from '../pages/Admin/Attributes/size/size';
import { Button } from '@mui/material';

interface IProps {
    size: Size;
    checked?: boolean;
    disable?: boolean;
    onClick?: (...args: any[]) => void;
}

const SizeButton: React.FC<IProps> = ({ size, checked, disable, onClick }) => {
    return (
        <Button
            variant={checked ? 'contained' : 'outlined'}
            onClick={() => { if (!disable && onClick) onClick(); }}
            disabled={disable}
            sx={{ textTransform: 'none' }}
        >
            {size.name}
        </Button>
    )
}

export default SizeButton