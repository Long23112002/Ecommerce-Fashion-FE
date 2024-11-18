import { ToastContainer } from "react-toastify";
import MuiLoadingScreen from "./components/Loading/MuiLoadingScreen";
import AppRoutes from './routes/AppRoutes';
import { useSelector } from "react-redux";
import { loadingScreenSelector } from "./redux/reducers/LoadingScreenReducer";

function App() {
    const loadingScreen = useSelector(loadingScreenSelector)
    return (
        <>
            <AppRoutes />
            <ToastContainer />
            {loadingScreen && <MuiLoadingScreen />}
        </>

    )
}

export default App
