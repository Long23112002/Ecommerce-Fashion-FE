import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CancelIcon from "@mui/icons-material/Cancel";
import { Checkbox } from "@mui/material";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import ProductDetail from "../../../types/ProductDetail";
import { Cart, CartValueInfos, CartValues } from "../../../types/Cart";
import Cookies from "js-cookie";
import {
  fetchCartByUserId,
  createCart,
  updateCart,
  deleteCart,
} from "../../../api/CartApi";
import LoadingCustom from "../../../components/Loading/LoadingCustom.js";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import { Popconfirm, Spin } from "antd";
import { Tooltip } from "antd";
import { getErrorMessage } from "../../Error/getErrorMessage.js";

const CartPage = () => {
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<Cart[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [subToTals, setSubToTals] = useState(0);
  const [cartValueInfos, setCartValueInfos] = useState<CartValueInfos[]>([]);
  const [cartValues, setCartValues] = useState<CartValues[]>([]);
  const [selectedProductDetails, setSelectedProductDetails] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [isCartUpdated, setIsCartUpdated] = useState(false);

  const caculatePrice = () => {
    const subtotal = cartValueInfos.reduce((sum, pd) => {
      if (selectedProductDetails[pd.productDetail.id]) {
        return sum + (pd.productDetail.price || 0) * (pd.quantity || 0);
      }
      return sum;
    }, 0);

    const discount = 0;
    const total = Math.max(0, subtotal - discount);
    setSubToTals(subtotal);
    setTotalPrice(total);
  };

  const handleSelectProductDetail = (id: number) => {
    setSelectedProductDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedProductDetails = cartValueInfos.reduce((acc, pd) => {
      acc[pd.productDetail.id] = newSelectAll;
      return acc;
    }, {} as { [key: number]: boolean });

    setSelectedProductDetails(newSelectedProductDetails);
  };

  useEffect(() => {
    caculatePrice();
  }, [selectedProductDetails, cartValueInfos]);

  const fetchCartData = async () => {
    const token = Cookies.get("accessToken");

    if (!token) {
      toast.error("Lỗi xác thực");
      return;
    }
    setLoading(true);

    try {
      const data = await fetchCartByUserId(token);
      const productDetailOrder = data.cartValues.map(
        (item) => item.productDetailId
      );

      const sortedCartValueInfos = data.cartValueInfos.sort((a, b) => {
        return (
          productDetailOrder.indexOf(a.productDetail.id) -
          productDetailOrder.indexOf(b.productDetail.id)
        );
      });
      console.log(data);
      const mappedDetails = data.cartValueInfos.map((item: any) => ({
        id: item.productDetail.id,
        price: item.productDetail.price,
        originPrice: item.productDetail.originPrice,
        product: {
          name: item.productDetail.product.name,
        },
        images: item.productDetail.images || [],
        size: {
          name: item.productDetail.size.name,
        },
        color: {
          name: item.productDetail.color.name,
        },
        quantity: item.productDetail.quantity,
      }));

      setProductDetails(mappedDetails);
      setCartValueInfos(sortedCartValueInfos);
      setCart(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // const caculatePrice = () => {
  //   const subtotal = cartValueInfos.reduce(
  //     (sum, pd) => sum + (pd.productDetail.price || 0) * (pd.quantity || 0),
  //     0
  //   );
  //   const discount = 0;
  //   const total = Math.max(0, subtotal - discount);

  //   setSubToTals(subtotal);
  //   setTotalPrice(total);
  // };

  // useEffect(() => {
  //   caculatePrice();
  // }, [cartValueInfos]);

  const updateCartData = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Lỗi xác thực");
      return;
    }

    try {
      const cartData = {
        cartValues: cartValueInfos.map((pd) => ({
          productDetailId: pd.productDetail.id,
          quantity: pd.quantity,
        })),
        userId: cart?.userId,
      };

      await updateCart(cartData, token);
      console.log("Giỏ hàng đã được cập nhật", cartData);
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  },[cartValueInfos]);

  const debouncedUpdateCartData = debounce(() => {
    updateCartData(); // gọi hàm updateCartData khi debounce hết thời gian
  }, 1000);

  useEffect(() => {
    debouncedUpdateCartData();
  }, [cartValueInfos]);

  const handleQuantityChange = (id: number, change: number) => {
    setCartValueInfos((prevCartValueInfos) => {
      const updatedCartValueInfos = prevCartValueInfos.map((pd) => {
        if (pd.productDetail.id === id) {
          const newQuantity = (pd.quantity || 0) + change;
          const maxQuantity = pd.productDetail.quantity ?? 0;

          if (newQuantity > maxQuantity) {
            Swal.fire({
              icon: "error",
              text: `Rất tiếc, bạn chỉ có thể mua tối đa ${maxQuantity} mặt hàng này`,
            });
            return { ...pd, quantity: maxQuantity };
          }

          return { ...pd, quantity: Math.max(1, newQuantity) };
        }
        return pd;
      });
      setCartValues(
        updatedCartValueInfos.map((pd) => ({
          productDetailId: pd.productDetail.id!,
          quantity: pd.quantity,
        }))
      );
      setCartValueInfos(updatedCartValueInfos);
      console.log(updatedCartValueInfos);
      setIsCartUpdated(true);
      return updatedCartValueInfos;
    });
  };

  // useEffect(() => {
  //   if (cartValueInfos.length > 0) {
  //     updateCartData();
  //   }
  // }, [cartValueInfos]);

  const handleRemoveProduct = async (id: number) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Lỗi xác thực");
      return;
    }

    try {
      const updatedCartValueInfos = cartValueInfos.filter(
        (item) => item.productDetail.id !== id
      );

      setCartValueInfos(updatedCartValueInfos);

      const cartData = {
        cartValues: updatedCartValueInfos.map((pd) => ({
          productDetailId: pd.productDetail.id,
          quantity: pd.quantity,
        })),
        userId: cart?.userId,
      };

      await updateCart(cartData, token);
      console.log("Giỏ hàng đã được cập nhật", cartData);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleClearCart = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Lỗi xác thực");
      return;
    }

    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedCartValueInfos = [];
          setCartValueInfos(updatedCartValueInfos); // Cập nhật giỏ hàng trên giao diện

          const cartData = {
            cartValues: updatedCartValueInfos.map((pd) => ({
              productDetailId: pd.productDetail.id,
              quantity: pd.quantity,
            })),
            userId: cart?.userId,
          };

          await updateCart(cartData, token);
          setTotalPrice(0);
          toast.success("Xóa thành công");
        } catch (error) {
          console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
          toast.error(getErrorMessage(error));
        }
      }
    });
  };

  // const subtotal = cartValueInfos.reduce(
  //   (sum, pd) => sum + (pd.productDetail.price || 0) * (pd.quantity || 0),
  //   0
  // );
  // const discount = 0;
  //   const discount = productDetails.reduce(
  //     (sum, pd) =>
  //       pd.originPrice
  //         ? sum + (pd.originPrice - pd.price) * (pd.quantity || 0)
  //         : sum,
  //     0
  //   );
  // const shipping = 20000;
  // const shippingDiscount = 20000;
  // const total = Math.max(0, subtotal - discount);

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Spin spinning={loading} indicator={<LoadingCustom />}>
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
                  mb: 2,
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}>
                <Checkbox checked={selectAll} onChange={handleSelectAll} />
                <Typography variant="body1">Sản phẩm</Typography>
                </Box>
                <Tooltip title="Xóa tất cả">
                  <Button
                    color="error"
                    onClick={handleClearCart}
                    disabled={cartValueInfos.length === 0}
                  >
                    XÓA TẤT CẢ
                  </Button>
                </Tooltip>
              </Box>

              {cartValueInfos.map((pd) => (
                <Box
                  key={pd.productDetail.id}
                  sx={{
                    display: "flex",
                    my: 2,
                    borderBottom: "1px solid #ccc",
                    paddingBottom: 1,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={
                        selectedProductDetails[pd.productDetail.id] || false
                      }
                      onChange={() =>
                        handleSelectProductDetail(pd.productDetail.id)
                      }
                    />
                  </div>
                  <img
                    src={pd.productDetail.images?.[0].url}
                    alt={pd.productDetail.product?.name}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                    sx={{
                      width: 60,
                      textAlign: "center",
                      "& .MuiInput-underline:before": { borderBottom: "none" },
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
                      min: 1,
                      max: pd.productDetail.quantity,
                    }}
                    variant="standard"
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
                  <Tooltip title="Xóa">
                    <IconButton
                      className="remove-icon"
                      onClick={() => handleRemoveProduct(pd.productDetail.id)}
                      sx={{
                        position: "absolute",
                        left: -50,
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        backgroundColor: "#f8f9fa",
                        color: "gray",
                        transform: "translateY(150%)",
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={() =>
                        handleQuantityChange(pd.productDetail.id, -1)
                      }
                      disabled={pd.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      type="number"
                      value={pd.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value, 10);
                        if (!isNaN(newQuantity)) {
                          handleQuantityChange(
                            pd.productDetail.id,
                            newQuantity - pd.quantity
                          );
                        }
                      }}
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
                        min: 1,
                        max: pd.productDetail.quantity,
                      }}
                      variant="standard"
                    />
                    <IconButton
                      onClick={() =>
                        handleQuantityChange(pd.productDetail.id, 1)
                      }
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
              sx={{ backgroundColor: "white", borderRadius: 5, padding: 2 }}
            >
              <Typography variant="h6" gutterBottom>
                Chi tiết đơn hàng
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
              >
                <Typography>Tổng giá trị sản phẩm</Typography>
                <Typography>{subToTals.toLocaleString("vi-VN")} ₫</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
              >
                <Typography>Giảm giá</Typography>
                {/* <Typography color="error">-{discount.toLocaleString('vi-VN')} ₫</Typography> */}
              </Box>
              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography>Vận chuyển</Typography>
                            <Typography>{shipping.toLocaleString('vi-VN')} ₫</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Typography>Giảm giá vận chuyển</Typography>
                            <Typography color="error">-{shippingDiscount.toLocaleString('vi-VN')} ₫</Typography>
                        </Box> */}
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
              >
                <Typography variant="h6">Tổng thanh toán</Typography>
                <Typography variant="h6">
                  {totalPrice.toLocaleString("vi-VN")} ₫
                </Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                Mua hàng
                {/* (
                {cartValueInfos.reduce(
                  (sum, pd) => sum + (pd.quantity|| 0),
                  0
                )}
                ) */}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Spin>
    </Box>
  );
};

export default CartPage;
