import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleLogin, handleLogout, storeUserData } from "../api/AuthApi";
import { clearUser, setUser, userSelector } from "../redux/reducers/UserReducer";
import { LoginRequest } from "../types/login/request/loginRequest";
import { useNavigate } from "react-router-dom";

export const useUserAction = () => {
    const user = useSelector(userSelector);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const login = async (loginRequest: LoginRequest, onSuccess?: () => void, onError?: () => void) => {
        try {
            const loginResponse = await handleLogin(loginRequest);
            storeUserData(loginResponse);
            const userData = loginResponse.userResponse
            save(userData);
            toast.success("Đăng nhập thành công!");
            if (onSuccess) {
                onSuccess()
            }
            if (isUserAdmin(userData)) {
                navigate("/admin/statistics");
            } else {
                navigate("/")
            }
        } catch (error) {
            if (onError) onError()
        }
    }

    const save = (userData: any) => {
        dispatch(setUser({
            id: Number(userData.id),
            email: userData.email,
            fullName: userData.fullName,
            birth: userData.birth,
            gender: userData.gender,
            phoneNumber: userData.phoneNumber === 'null' ? null : userData.phoneNumber,
            avatar: userData.avatar,
            isAdmin: isUserAdmin(userData),
            roles: userData.roles,
        }));
    }

    const get = () => {
        return user
    }

    const logout = async () => {
        dispatch(clearUser());
        await handleLogout()
    }
    return { login, save, get, logout }
}

const isUserAdmin = (userData: any) => {
    return userData.isAdmin === 'true' || userData.isAdmin == true;
}
