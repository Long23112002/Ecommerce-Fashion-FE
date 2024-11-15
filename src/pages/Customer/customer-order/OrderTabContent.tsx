import React, { useEffect, useState } from "react";
import { Tabs, Card, Spin, Row, Col, Divider } from "antd";
import type { TabsProps } from "antd";
import { Container, Typography, Grid } from "@mui/material";
import LoadingCustom from "../../../components/Loading/LoadingCustom.js";
import OrderDetailCard from "./CustomerOrderCard";
import { fetchOrdersByUserId } from "../../../api/CustomerOrderApi.js";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Order, OrderStatus, OrderStatusLabel } from "../../../types/Order.js";

const OrderTabContent: React.FC<{ status: OrderStatus }> = ({ status }) => {
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

  return (
    <Container className="mt-5">
      <Spin
        spinning={loading}
        indicator={<LoadingCustom />}
        size="large"
        className="centered-spin"
      >
        {data.length === 0 ? (
          <Container style={{ textAlign: "center" }} className="mt-5">
            <img
              src="http://ecommerce-fashion.site:9099/hi8UbqWiYx-No_Data.png"
              alt="NoData"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
              }}
              className="mt-5"
            />
            <h5 className="text-center mt-5">Quý khách chưa có đơn hàng nào</h5>
          </Container>
        ) : (
          data.map((order) => (
            <Card
              key={order.id}
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
              <Grid container justifyContent="flex-end" className="mt-5">
                <Typography variant="h6" color="text.secondary">
                  Thành tiền:
                </Typography>
                <Typography
                  variant="h6"
                  color="error"
                  style={{ marginLeft: 8 }}
                >
                  {`${order.totalMoney.toLocaleString("vi-VN")} ₫`}
                </Typography>
              </Grid>
            </Card>
          ))
        )}
      </Spin>
    </Container>
  );
};

export default OrderTabContent;
