import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { handleLogin, handleLogout, storeUserData } from "../api/AuthApi";
import { clearUser, setUser } from "../redux/reducers/UserReducer";
import { LoginRequest } from "../types/login/request/loginRequest";

export const useUserAction = () => {
    const dispatch = useDispatch()

    const login = async (loginRequest: LoginRequest, onSuccess?: () => void, onError?: () => void) => {
        try {
            const loginResponse = await handleLogin(loginRequest);
            storeUserData(loginResponse);
            const userData = loginResponse.userResponse
            save(userData);
            toast.success("Đăng nhập thành công!");
            if (onSuccess) onSuccess()
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
            isAdmin: userData.isAdmin === 'true' || userData.isAdmin == true,
            roles: userData.roles,
        }));
    }

    const logout = async () => {
        dispatch(clearUser());
        await handleLogout()
    }
    return { login, save, logout }
}