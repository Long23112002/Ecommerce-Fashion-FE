import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { loadingScreenSelector } from '../../redux/reducers/LoadingScreenReducer';
import MuiLoading from './MuiLoading';

const MuiLoadingScreen = () => {
    return (
        <Box
            top={0}
            left={0}
            width='100%'
            height='100vh'
            bgcolor='rgba(0, 0, 0, 0.1)'
        >
            <MuiLoading size={55} />
        </Box>
    );
};

export default MuiLoadingScreen;
