import React, { useEffect, useState } from "react";
import { Tabs, Card, Spin, Row, Col, Divider } from "antd";
import type { TabsProps } from "antd";
import { Container, Typography, Grid, Button } from "@mui/material";
import LoadingCustom from "../../../components/Loading/LoadingCustom.js";
import OrderDetailCard from "./CustomerOrderCard";
import {
  cancelOrder,
  fetchOrdersByUserId,
} from "../../../api/CustomerOrderApi.js";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Order, OrderStatus, OrderStatusLabel } from "../../../types/Order.js";
import { useNavigate } from "react-router-dom";
import PaymentMethodEnum from "../../../enum/PaymentMethodEnum.js";

const OrderTabContent: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Order[]>([]);

  const fetchData = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Lỗi xác thực");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchOrdersByUserId(token, status);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status]);

  const handleNavigate = (order: Order) => {
    navigate(`/customer-order/${order.id}`, { state: { order } });
  };

  const handleCancelOrder = async (orderId: number) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Lỗi xác thực");
      return;
    }
    try {
      await cancelOrder(orderId, OrderStatus.CANCEL, token);
      toast.success("Đơn hàng đã được hủy thành công.");
      fetchData();
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  return (
    <Container className="mt-5">
      <Spin
        spinning={loading}
        indicator={<LoadingCustom />}
        size="large"
        className="centered-spin"
      >
        {data.length === 0 ? (
          <Container
            style={{ textAlign: "center", paddingTop: "65px" }}
            className="mt-5"
          >
            <img
              src="http://ecommerce-fashion.site:9099/kGJ2QWVkJn-nodtaaa.png"
              alt="NoData"
              style={{
                width: 150,
                height: 150,
                objectFit: "cover",
              }}
              className="mt-5"
            />
            <h4 className="text-center mt-5">Quý khách chưa có đơn hàng nào</h4>
          </Container>
        ) : (
          data.map((order) => (
            <Card
              key={order.id}
              onClick={() => handleNavigate(order)}
              title={`Mã đơn hàng: ${order.id}`}
              style={{ margin: 10, cursor: "pointer" }}
              extra={
                <h6 className="text-danger">
                  {OrderStatusLabel[order.status]}
                </h6>
              }
            >
              {order.orderDetails?.map((detail) => (
                <OrderDetailCard
                  key={detail.id}
                  order={order}
                  detail={detail}
                />
              ))}
              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                className="mt-3"
              >
                <Grid item style={{ marginRight: 10 }}>
                  <Typography variant="h6" color="text.secondary">
                    Thành tiền:
                  </Typography>
                </Grid>
                <Grid item style={{ marginRight: 20 }}>
                  <Typography variant="h6" color="error">
                    {`${order.finalPrice.toLocaleString("vi-VN")} ₫`}
                  </Typography>
                </Grid>
              </Grid>

              {order.status === OrderStatus.PENDING &&
                order.paymentMethod === PaymentMethodEnum.CASH && (
                  <Grid
                    container
                    justifyContent="flex-end"
                    style={{ marginTop: 20 }}
                  >
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelOrder(order.id);
                        }}
                        style={{ marginTop: 10 }}
                      >
                        Hủy đơn hàng
                      </Button>
                    </Grid>
                  </Grid>
                )}

              {order.status === OrderStatus.SUCCESS && (
                <Grid
                  container
                  justifyContent="flex-end"
                  style={{ marginTop: 20 }}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      style={{ marginTop: 10 }}
                    >
                      Đánh giá
                    </Button>
                  </Grid>
                </Grid>
              )}
               {order.status === OrderStatus.SUCCESS && (
                <Grid
                  container
                  justifyContent="flex-end"
                  style={{ marginTop: 20 }}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      style={{ marginTop: 10 }}
                    >
                      Yêu cầu trả hàng/hoàn tiền
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Card>
          ))
        )}
      </Spin>
    </Container>
  );
};

export const handleCancelOrder = async (
  orderId: number,
  navigate: (path: string) => void
) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    toast.error("Lỗi xác thực");
    return;
  }
  try {
    await cancelOrder(orderId, OrderStatus.CANCEL, token);
    toast.success("Đơn hàng đã được hủy thành công.");
    navigate("/customer-order");
  } catch (error) {
    console.error("Error canceling order:", error);
    toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
  }
};


export default OrderTabContent;
