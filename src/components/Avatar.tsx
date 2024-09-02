import { Avatar as Avt } from '@mui/material';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../redux/reducers/UserReducer';

interface IProps {
    draw: ReactElement;
}

const Avatar: React.FC<IProps> = ({ draw }) => {

    const user = useSelector(userSelector)

    const [open, setOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    };
    return (
        <>
            <Avt 
                src={user?.avatar+''}
                sx={{
                    ml: {
                        xs: 0,
                        sm: 3
                    },
                    p: 0,
                    height: 50,
                    width: 50,
                    borderRadius: "50%",
                    overflow: 'hidden',
                }}
                onClick={() => setOpen(true)}
            />
            {React.cloneElement(draw, { open, toggleDrawer })}
        </>
    );
};

export default Avatar;
