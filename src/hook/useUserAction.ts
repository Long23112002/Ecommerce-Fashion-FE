import { useDispatch } from "react-redux"
import { setUser } from "../redux/reducers/UserReducer";

export const useUserAction = () => {
    const dispatch = useDispatch()
    const useLogin = (userData: any) => {
        dispatch(setUser({
            id: Number(userData.id),
            email: userData.email,
            fullName: userData.fullName,
            birth: userData.birth,
            gender: userData.gender,
            phoneNumber: userData.phoneNumber,
            avatar: userData.avatar,
            isAdmin: userData.isAdmin,
            roles: userData.roles,
        }));
    }
    return { useLogin }
}