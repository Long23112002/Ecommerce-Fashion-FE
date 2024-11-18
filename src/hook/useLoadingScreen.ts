import { loadingScreenSelector, setLoadingScreen as setLoadingRedux } from "../redux/reducers/LoadingScreenReducer";
import { useDispatch, useSelector } from "react-redux";

const useLoadingScreen = () => {
    const loadingScreen = useSelector(loadingScreenSelector)
    const dispatch = useDispatch()

    const setLoadingScreen = (bool: boolean) => {
        dispatch(setLoadingRedux(bool))
    }

    return { loadingScreen, setLoadingScreen };
};

export default useLoadingScreen;
