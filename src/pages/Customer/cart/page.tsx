import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button, Checkbox, Grid,
  IconButton, TextField, Typography
} from "@mui/material";
import { Tooltip } from "antd";
import Cookies from "js-cookie";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../../api/OrderApi.js";
import useCart from "../../../hook/useCart.js";
import { useUserHeaderSize } from "../../../hook/useSize.js";
import useToast from "../../../hook/useToast.js";
import { CartValueInfos, CartValues } from "../../../types/Cart";
import Order, { OrderDetailValue, OrderValue } from "../../../types/Order.js";

interface CartValueInfoWithSelected extends CartValueInfos {
  selected: boolean
}

const CartPage = () => {
  const navigate = useNavigate()
  const height = useUserHeaderSize()
  const { getCartValueInfo, save, setItemInCart } = useCart()
  const { catchToast } = useToast();
  const [moneyTotal, setMoneyTotal] = useState(0);
  const [productDetails, setProductDetails] = useState<CartValueInfoWithSelected[]>([])
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const quantityTimeout = useRef<NodeJS.Timeout | null>(null);

  const setSelect = (pd: CartValueInfos, selected: boolean): CartValueInfoWithSelected => {
    return {
      ...pd,
      selected
    }
  }

  const getSelect = () => {
    return productDetails.filter(pd => pd.selected)
  }

  const setPdByValue = (cartValue: CartValues) => {
    setProductDetails(prev => prev.map(p => {
      if (p.productDetail.id === cartValue.productDetailId) {
        return {
          ...p,
          quantity: cartValue.quantity
        }
      }
      return p
    }))
  }

  const handleSelectProductDetail = (cart: CartValueInfos) => {
    setProductDetails(prev => prev.map(pd => {
      if (pd.productDetail.id == cart.productDetail.id) {
        return setSelect(pd, !pd.selected)
      }
      return pd
    }))
  }

  const handleClearSelectProduct = () => {
    setProductDetails(prev => prev.map(pd => setSelect(pd, false)))
  }

  const handleQuantityChange = async (cart: CartValueInfos, flipValue: number) => {
    try {
      setLoading(true)
      const newQuantity = cart.quantity + flipValue;
      const cartValue: CartValues = {
        productDetailId: cart.productDetail.id,
        quantity: newQuantity
      }
      const { valid } = await setItemInCart(cartValue)
      if (valid) {
        setPdByValue(cartValue)
      } else {
        const values = await getCartValueInfo()
        setPdByValue(values)
      }
    }
    finally {
      setLoading(false)
    }
  }

  const handleChangeQuantityInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, cart: CartValueInfos) => {
    const value = Math.max(1, Math.min(cart.productDetail.quantity, Number(e.target.value)));
    setProductDetails((prev) =>
      prev.map((pd) =>
        pd.productDetail.id === cart.productDetail.id ? { ...pd, quantity: value } : pd
      )
    );
    if (quantityTimeout.current) clearTimeout(quantityTimeout.current);
    quantityTimeout.current = setTimeout(async () => {
      const cartValue = { productDetailId: cart.productDetail.id, quantity: value };
      await setItemInCart(cartValue);
      setPdByValue(cartValue);
    }, 500);
  };

  const handleBuy = async () => {
    const select = getSelect()
    if (select.length < 0) return
    const orderDetails: OrderDetailValue[] = select.map(value => {
      return {
        productDetailId: value.productDetail.id,
        quantity: value.quantity
      }
    })
    try {
      const res: Order = await createOrder(orderDetails);
      const data: OrderValue = {
        id: res.id,
        orderValues: res.orderDetails?.map(o => {
          return {
            productDetailId: o.productDetail.id,
            quantity: o.quantity
          }
        }) || []
      }
      Cookies.set('order', JSON.stringify(data), { expires: 1 / 6 })
      navigate('/checkout')
    } catch (error: any) {
      console.log(error)
      catchToast(error)
    }
  }

  useEffect(() => {
    const total = getSelect()
      .map(value => {
        const price = value.productDetail.price
        const quantity = value.quantity
        return price * quantity
      })
      .reduce((total, money) => total + money, 0)

    setMoneyTotal(total)
  }, [productDetails])

  useEffect(() => {
    const fetch = async () => {
      const res = await getCartValueInfo();
      setProductDetails([...res])
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!productDetails) return
    if (isSelectAll) {
      setProductDetails(prev => prev.map(pd => setSelect(pd, true)))
    } else {
      setProductDetails(prev => prev.map(pd => setSelect(pd, false)))

    }
  }, [isSelectAll])

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box
            className="shadow-section"
            sx={{
              backgroundColor: "white",
              borderRadius: 5,
              padding: 2,
              position: "relative",
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                Giỏ hàng
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Checkbox checked={isSelectAll} onChange={() => setIsSelectAll(prev => !prev)} />
                <Typography variant="body1">Chọn tất cả</Typography>
              </Box>
              <Tooltip title="Xóa tất cả">
                <Button
                  color="error"
                  onClick={handleClearSelectProduct}
                  disabled={getSelect().length === 0}
                >
                  Xóa sản phẩm đã chọn
                </Button>
              </Tooltip>
            </Box>

            {productDetails.map((pd) => (
              <Box
                key={pd.productDetail.id}
                sx={{
                  display: "flex",
                  my: 2,
                  borderBottom: "1px solid #ccc",
                  paddingBottom: 1,
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    checked={getSelect().map(spd => spd.productDetail.id).includes(pd.productDetail.id)}
                    onChange={() => handleSelectProductDetail(pd)}
                  />
                </div>
                <Box sx={{ display: 'flex', width: '100%' }}
                  onClick={() => navigate(`/product/${pd.productDetail.product.id}`)}
                >
                  <img
                    src={pd.productDetail.images?.[0].url}
                    alt={pd.productDetail.product?.name}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="h5">
                      {pd.productDetail.product?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${pd.productDetail.size?.name}, ${pd.productDetail.color?.name}`}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="mt-3"
                      component="div"
                    >
                      <Typography
                        variant="h6"
                        color="info.main"
                        component="div"
                      >
                        <b>
                          {(pd.productDetail.price || 0).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          ₫
                        </b>
                      </Typography>
                      {pd.productDetail.originPrice && (
                        <span
                          style={{
                            textDecoration: "line-through",
                            marginLeft: "20px",
                            color: "gray",
                          }}
                        >
                          {pd.productDetail.originPrice.toLocaleString("vi-VN")}{" "}
                          ₫
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }} >
                  <IconButton
                    onClick={() => handleQuantityChange(pd, -1)}
                    disabled={pd.quantity <= 1 || loading}
                    sx={{
                      color: loading ? "#a1a1a1" : "#333333",
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    type="number"
                    value={pd.quantity}
                    disabled={loading}
                    onChange={(e) => handleChangeQuantityInput(e, pd)}
                    sx={{
                      width: 60,
                      textAlign: "center",
                      "& .MuiInput-underline:before": {
                        borderBottom: "none",
                      },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& input": {
                        padding: 0,
                        textAlign: "center",
                      },
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                    }}
                    inputProps={{
                      min: 0,
                      max: pd.productDetail.quantity,
                    }}
                    variant="standard"
                  />
                  <IconButton
                    onClick={() =>
                      handleQuantityChange(pd, 1)
                    }
                    disabled={loading}
                    sx={{
                      color: loading ? "#a1a1a1" : "#333333",
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            className="shadow-section"
            sx={{ backgroundColor: "white", borderRadius: 5, padding: 2, position: 'sticky', top: height ? (height + 18) : (62 + 10) }}
          >
            <Typography variant="h6" gutterBottom>
              Chi tiết đơn hàng
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Typography>Tổng giá trị sản phẩm</Typography>
              <Typography>{moneyTotal.toLocaleString("vi-VN")} ₫</Typography>
            </Box>
            <Button variant="contained" onClick={handleBuy} fullWidth sx={{ mt: 2 }}>
              Mua hàng
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;