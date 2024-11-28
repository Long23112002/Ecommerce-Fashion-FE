import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button, Checkbox, Grid,
  IconButton, TextField, Typography
} from "@mui/material";
import { Tooltip } from "antd";
import Cookies from "js-cookie";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../../api/OrderApi.js";
import useCart from "../../../hook/useCart.js";
import { useUserHeaderSize } from "../../../hook/useSize.js";
import useToast from "../../../hook/useToast.js";
import { CartValueInfos, CartValues } from "../../../types/Cart";
import Order, { OrderDetailValue, OrderValue } from "../../../types/Order.js";

const CartPage = () => {
  const navigate = useNavigate()
  const height = useUserHeaderSize()
  const { cart, getCartValueInfo, save, setItemInCart } = useCart()
  const { catchToast } = useToast();
  const [moneyTotal, setMoneyTotal] = useState(0);
  const [selectProductDetails, setSelectProductDetails] = useState<CartValueInfos[]>([]);
  const [productDetail, setProductDetail] = useState<CartValueInfos[]>([])
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const setPdByValue = (cartValue: CartValues) => {
    setProductDetail(prev => prev.map(p => {
      if (p.productDetail.id === cartValue.productDetailId) {
        return {
          ...p,
          quantity: cartValue.quantity
        }
      }
      return p
    }))
  }

  const handleSelectProductDetail = (pd: CartValueInfos) => {
    const productDetailIds = selectProductDetails.map(spd => spd.productDetail.id)
    console.log(productDetailIds)
    if (productDetailIds.includes(pd.productDetail.id)) {
      setSelectProductDetails(prev => prev.filter(cart => cart !== pd));
    } else {
      setSelectProductDetails(prev => [...prev, pd]);
    }
  }

  const handleClearSelectProduct = () => {
    const selectProductIds = selectProductDetails.map(pd => pd.productDetail.id)
    const newItem = productDetail.filter(pd => !selectProductIds.includes(pd.productDetail.id))
    const values: CartValues[] = newItem.map(item => {
      return {
        productDetailId: item.productDetail.id,
        quantity: item.quantity
      }
    })
    if (values) {
      setProductDetail([...newItem])
      save(values)
    }
  }

  const handleQuantityChange = async (cart: CartValueInfos, flipValue: number) => {
    try {
      setLoading(true)
      const newQuantity = cart.quantity + flipValue;
      const cartValue: CartValues = {
        productDetailId: cart.productDetail.id,
        quantity: newQuantity
      }
      await setItemInCart(cartValue)
      setPdByValue(cartValue)
    }
    finally {
      setLoading(false)
    }
  }

  const handleChangeQuantityInput = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, cart: CartValueInfos) => {
    const newQuantity = Math.max(Math.min(Number(e.target.value), cart.productDetail.quantity), 1);
    setSelectProductDetails(prev =>
      prev.map(item =>
        item.productDetail.id === cart.productDetail.id ? { ...item, quantity: newQuantity } : item
      )
    )
    const cartValue: CartValues = {
      productDetailId: cart.productDetail.id,
      quantity: newQuantity
    }
    await setItemInCart(cartValue)
    setPdByValue(cartValue)
  }

  const handleBuy = async () => {
    if (selectProductDetails.length < 0) return
    const orderDetails: OrderDetailValue[] = selectProductDetails.map(value => {
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
      catchToast(error)
    }
  }

  useEffect(() => {
    const total = selectProductDetails
      .map(value => {
        const price = value.productDetail.price
        const quantity = value.quantity
        return price * quantity
      })
      .reduce((total, money) => total + money, 0)

    setMoneyTotal(total)
  }, [selectProductDetails])

  useEffect(() => {
    const fetch = async () => {
      const res = await getCartValueInfo();
      setProductDetail([...res])
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!productDetail) return
    if (isSelectAll) {
      setSelectProductDetails(productDetail)
    } else {
      setSelectProductDetails([])
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
                  disabled={selectProductDetails.length === 0}
                >
                  Xóa sản phẩm đã chọn
                </Button>
              </Tooltip>
            </Box>

            {productDetail.map((pd) => (
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
                    checked={selectProductDetails.map(spd => spd.productDetail.id).includes(pd.productDetail.id)}
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