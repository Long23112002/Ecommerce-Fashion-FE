import { useDispatch, useSelector } from "react-redux"
import { addItemToCart, cartSelector, setCart as setCartRedux, setCartValues, setItemInCart, totalCartSelector } from "../redux/reducers/CartReducer"
import { Cart, CartRequest, CartValues } from "../types/Cart"
import { updateCart } from "../api/CartApi"
import Cookies from "js-cookie"
import { useUserAction } from "./useUserAction"
import { useEffect, useRef, useState } from "react"
import ProductDetail from "../types/ProductDetail"

const useCart = () => {
    const user = useUserAction().get()
    const cartRedux = useSelector(cartSelector)
    const dispatch = useDispatch()
    const [cart, setCart] = useState<Cart>()
    const [totalCart, setTotalCart] = useState<number>(0)

    const modifyCart = (cart: Cart) => {
        dispatch(setCartRedux(cart))
    }

    const modifyCartValues = (cart: CartValues[]) => {
        dispatch(setCartValues(cart))
    }

    const addToCart = (item: CartValues) => {
        dispatch(addItemToCart(item));
    };

    const modifyItemInCart = (item: CartValues) => {
        dispatch(setItemInCart(item))
    }

    useEffect(() => {
        const token = Cookies.get('accessToken');
        const fetchAndUpdateCart = async () => {
            if (!user.id || !token || cartRedux.id === -1) return;
            const req: CartRequest = { userId: user.id, cartValues: cartRedux.cartValues };
            const res: Cart = await updateCart(req, token);
            setCart(res)

            const total = res.cartValues
                .map(c => c.quantity)
                .reduce((total, quantity) => total + quantity, 0)
            setTotalCart(total)
        };

        fetchAndUpdateCart();
    }, [cartRedux, user.id]);

    return { cart, totalCart, addToCart, modifyCart, modifyItemInCart, modifyCartValues }
}

export default useCart