import { useDispatch } from "react-redux"
import { clearUser, setUser } from "../redux/reducers/UserReducer";

export const useUserAction = () => {
    const dispatch = useDispatch()
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
    const clear = () => {
        dispatch(clearUser());
    }
    return { save, clear }
}