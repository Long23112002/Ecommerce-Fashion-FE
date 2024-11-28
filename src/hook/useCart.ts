import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { cartSelector, setCart as setRedux, totalCartSelector } from "../redux/reducers/CartReducer";
import { userSelector } from "../redux/reducers/UserReducer";
import { CartRequest, CartValues } from "../types/Cart";
import { fetchCartByUserId, getCartValueInfos, updateCart, validCart } from "../api/CartApi";
import useToast from "./useToast";
import { toast } from "react-toastify";
import Order, { OrderValue } from "../types/Order";

const useCart = () => {
    const user = useSelector(userSelector)
    const total = useSelector(totalCartSelector)
    const cart = useSelector(cartSelector)
    const dispatch = useDispatch()
    const { catchToast } = useToast()

    const fetch = async (token: string) => {
        const { cartValues } = await fetchCartByUserId(token)
        return cartValues
    }

    const getCartValues = async (): Promise<CartValues[]> => {
        const token = Cookies.get('accessToken')
        if (token && (user.id || 0) > 0) {
            const res = await fetch(token)
            return res
        } else {
            const json = localStorage.getItem('cart')
            if (json) {
                const cart: CartValues[] = JSON.parse(json)
                return Promise.resolve(cart)
            }
        }
        return []
    }

    const getCartValueInfo = async () => {
        const values = await getCartValues()
        const valueInfos = await getCartValueInfos(values)
        return valueInfos
    }

    const reload = async () => {
        const cartValues = await getCartValues()
        save(cartValues)
    }

    const save = async (value: CartValues[]) => {
        try {
            if ((user.id || 0) > 0) {
                const req: CartRequest = {
                    userId: user.id || 0,
                    cartValues: value
                }
                await updateCart(req)
            } else {
                const { valid, cartValues } = await validCart(value)
                if (valid == false) {
                    toast.error("Số lượng sản phẩm không đủ")
                    throw new Error('')
                }
                value = cartValues
            }
            if (!((user.id || 0) > 0)) {
                localStorage.setItem('cart', JSON.stringify(value))
            }
            dispatch(setRedux(value))
        } catch (error: any) {
            catchToast(error)
            throw error
        }
    }

    const setItemInCart = async (value: CartValues) => {
        const values = await getCartValues();
        const newValues = values.map(v => {
            if (v.productDetailId == value.productDetailId) {
                v.quantity = value.quantity
            }
            return v
        })
        await save(newValues)
    }

    const removeItemAfterOrder = async () => {
        const json = Cookies.get('order')
        if (!json) return
        const order: OrderValue = JSON.parse(json)
        const values = await getCartValues()
        const mapIds = order.orderValues?.map(o => o.productDetailId)
        if (!mapIds) return
        const newValues = values.filter(value => !mapIds.includes(value.productDetailId))
        await save(newValues)
        Cookies.remove('order')
    }

    const addToCart = async (value: CartValues) => {
        const currentCart: CartValues[] = await getCartValues();

        const isExist = currentCart.some(c => c.productDetailId === value.productDetailId);

        const newCart = isExist
            ? currentCart.map(c =>
                c.productDetailId === value.productDetailId
                    ? { ...c, quantity: c.quantity + value.quantity }
                    : c
            )
            : [...currentCart, value];

        await save(newCart);
        toast.success("Thêm vào giỏ hàng thành công")
    };

    return { cart, reload, total, getCartValueInfo, getCartValues, save, addToCart, setItemInCart, removeItemAfterOrder }
}

export default useCart
