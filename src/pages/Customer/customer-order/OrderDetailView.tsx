// OrderDetailView.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Divider, Typography } from 'antd';
import { Box } from "@mui/material";
import { fetchOrderDetails } from '../../../api/CustomerOrderApi.js';
import OrderDetailCard from './CustomerOrderCard';

const OrderDetailView = ({ orderId }:any) => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId).then((data:any) => setOrderData(data));
    }
  }, [orderId]);

  if (!orderData) return <Typography>Vui lòng chọn một đơn hàng để xem chi tiết.</Typography>;

  return (
    <Card title={`Chi tiết đơn hàng #${orderData.id}`} style={{ marginTop: 20 }}>
      <Typography variant="h6">Thông tin khách hàng</Typography>
      <Box>
        <Typography>Tên: {orderData.user.fullName}</Typography>
        <Typography>Email: {orderData.user.email}</Typography>
        <Typography>Số điện thoại: {orderData.phoneNumber}</Typography>
        <Typography>Địa chỉ giao hàng: {orderData.address.specificAddress}</Typography>
      </Box>
      <Divider />

      <Typography variant="h6">Chi tiết sản phẩm</Typography>
      {orderData.orderDetails.map((detail) => (
        <OrderDetailCard key={detail.id} detail={detail} />
      ))}

      <Divider />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6">Phí giao hàng:</Typography>
        <Typography>{`${orderData.moneyShip.toLocaleString("vi-VN")} ₫`}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6">Tổng cộng:</Typography>
        <Typography color="error">
          {`${orderData.totalMoney.toLocaleString("vi-VN")} ₫`}
        </Typography>
      </Box>
    </Card>
  );
};

export default OrderDetailView;
