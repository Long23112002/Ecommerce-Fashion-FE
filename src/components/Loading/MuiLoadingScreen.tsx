import { Box } from '@mui/material'
import MuiLoading from './MuiLoading'

const MuiLoadingScreen = () => {
    return (
        <Box position='fixed' top={0} left={0} bottom={0} right={0} bgcolor='rgb(0,0,0,0.2)' zIndex={99}>
            <MuiLoading size={55} />
        </Box>
    )
}

export default MuiLoadingScreen