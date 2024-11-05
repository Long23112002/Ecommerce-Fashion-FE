import { Avatar as Avt } from '@mui/material';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/UserReducer';

interface IProps {
    draw?: ReactElement;
    width?: number | string;
    height?: number | string
}

const Avatar: React.FC<IProps> = ({ draw, width, height }) => {

    const user = useSelector(userSelector)

    const [open, setOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    };
    return (
        <>
            <Avt
                src={user?.avatar + ''}
                sx={{
                    p: 0,
                    height: height ?? width ?? 40,
                    width: width ?? height ?? 40,
                    borderRadius: "50%",
                    overflow: 'hidden',
                }}
                onClick={() => setOpen(true)}
            />
            {draw &&
                React.cloneElement(draw, { open, toggleDrawer })
            }
        </>
    );
};

export default Avatar;
