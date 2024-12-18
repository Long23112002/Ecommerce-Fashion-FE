import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { cartSelector, setCart as setRedux, totalCartSelector } from "../redux/reducers/CartReducer";
import { userSelector } from "../redux/reducers/UserReducer";
import { CartRequest, CartValueInfos, CartValues } from "../types/Cart";
import { fetchCartByUserId, getCartValueInfos, updateCart, validCart } from "../api/CartApi";
import useToast from "./useToast";
import { toast } from "react-toastify";
import Order, { OrderValue } from "../types/Order";
import { useEffect } from "react";

const useCart = () => {
    const user = useSelector(userSelector)
    const total = useSelector(totalCartSelector)
    const cart = useSelector(cartSelector)
    const dispatch = useDispatch()
    const { catchToast } = useToast()

    useEffect(() => {
        reload()
    }, [user])

    const fetch = async (token: string) => {
        const { cartValues } = await fetchCartByUserId(token)
        return cartValues
    }

    const getCartValues = async (): Promise<CartValues[]> => {
        const token = Cookies.get('accessToken')
        if (token) {
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
        const req = values.filter(v => v.quantity > 0)
        const valueInfos: CartValueInfos[] = await getCartValueInfos(req)
        const newValues: CartValues[] = valueInfos.map(info => {
            return {
                quantity: info.quantity,
                productDetailId: info.productDetail.id
            }
        })
        save(newValues)
        return valueInfos
    }

    const reload = async () => {
        const cartValues = await getCartValues()
        dispatch(setRedux(cartValues))
    }

    const save = async (value: CartValues[]) => {
        try {
            const { valid, cartValues } = await validCarts(value)
            if (!valid) {
                return { valid, cartValues }
            }
            if ((user.id || 0) > 0) {
                const req: CartRequest = {
                    userId: user.id || 0,
                    cartValues: cartValues
                }
                await updateCart(req)
            } else {
                localStorage.setItem('cart', JSON.stringify(cartValues))
            }
            dispatch(setRedux(cartValues))
            return { valid, cartValues }
        } catch (error: any) {
            catchToast(error)
            throw error
        }
    }

    const setItemInCart = async (value: CartValues) => {
        const values = await getCartValues();
        const newValues = values.map(v => {
            if (v.productDetailId == value.productDetailId) {
                return {
                    ...v,
                    quantity: value.quantity
                }
            }
            return v
        })
        return await save(newValues)
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

        const { valid } = await save(newCart);
        if (valid) {
            toast.success("Thêm vào giỏ hàng thành công")
        }
    };

    const validCarts = async (values: CartValues[]): Promise<{ valid: boolean, cartValues: CartValues[] }> => {
        const { valid, cartValues } = await validCart(values)
        if (valid == false) {
            toast.error("Số lượng sản phẩm không đủ")
        }
        return { valid, cartValues }
    }

    return { cart, reload, total, getCartValueInfo, getCartValues, save, addToCart, setItemInCart, removeItemAfterOrder }
}

export default useCart
