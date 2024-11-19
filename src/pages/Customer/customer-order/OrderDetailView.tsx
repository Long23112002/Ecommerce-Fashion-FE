import React, { useEffect, useState } from "react";
import { Steps } from "antd";
import {
  FileTextOutlined,
  DollarOutlined,
  CarOutlined,
  InboxOutlined,
  StarOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  OrderStatus,
  OrderStatusLabel,
  OrderLog,
  Order,
} from "../../../types/Order";
import "./OrderStatus.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { Row, Col } from "antd";
import OrderDetailCard from "./CustomerOrderCard";
import { fetchOrderDetails } from "../../../api/CustomerOrderApi";
import { OrderMeThodLabel } from "../../../enum/OrderStatusEnum";
import PaymentMethodEnum from "../../../enum/PaymentMethodEnum";
import OrderPaymentDetails from "./OrderPaymentDetails";
import { handleBuyAgain, handleCancelOrder } from "./OrderTabContent";
import { toast } from "react-toastify";
const OrderStatusCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id:any}>();
  const {orders} = location.state;
  const [order, setOrders] = useState<Order>();
  const [loading, setLoading] = useState<boolean>(true);

  const getOrderDetails = async () => {
    try {
      const orderData = await fetchOrderDetails(id);
      setOrders(orderData);
      setLoading(false);
    } catch (err) {
      console.error('Không thể tải dữ liệu đơn hàng');
      setLoading(false);
    }
  };

  const createdAt = order?.createdAt
    ? dayjs(order.createdAt).format("HH:mm DD-MM-YYYY")
    : "";
  const updatedAt = order?.updatedAt
    ? dayjs(order.updatedAt).format("HH:mm DD-MM-YYYY")
    : "";

    const currentOrderStatus = order?.status ?? OrderStatus.PENDING;


  useEffect(() => {
    getOrderDetails();
  },[currentOrderStatus]);


  const statusTimeMap: { [key: string]: string } = {};
  order?.orderLogs?.forEach((log: OrderLog) => {
    statusTimeMap[log.newValue] = dayjs(log.createdAt).format(
      "HH:mm DD-MM-YYYY"
    );
  });

  const steps = [
    {
      title: OrderStatusLabel[OrderStatus.PENDING],
      description: statusTimeMap[OrderStatus.PENDING] || createdAt || "Đang chờ xử lý",
      icon: <FileTextOutlined />,
    },
    {
      title: OrderStatusLabel[OrderStatus.SHIPPING],
      description: statusTimeMap[OrderStatus.SHIPPING] || "Đang vận chuyển",
      icon: <DollarOutlined />,
    },
    {
      title: OrderStatusLabel[OrderStatus.SUCCESS],
      description: statusTimeMap[OrderStatus.SUCCESS] || "Đã giao hàng",
      icon: <InboxOutlined />,
    },
    {
      title: OrderStatusLabel[OrderStatus.REFUND],
      description: statusTimeMap[OrderStatus.REFUND] || "Hoàn tiền",
      icon: <SyncOutlined />,
    },
  ];


  const cancelSteps = [
    {
      title: OrderStatusLabel[OrderStatus.PENDING],
      description: createdAt || "Đang chờ xử lý",
      icon: <FileTextOutlined />,
    },
    {
      title: OrderStatusLabel[OrderStatus.CANCEL],
      description: statusTimeMap[OrderStatus.CANCEL] || "Hủy đơn",
      icon: <SyncOutlined />,
    },
  ];

  const getCurrentStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 0;
      case OrderStatus.SHIPPING:
        return 1;
      case OrderStatus.SUCCESS:
        return 2;
      case OrderStatus.REFUND:
        return 3;
        case OrderStatus.CANCEL:
        return 1;
      default:
        return 0;
    }
  };

  const currentStep = getCurrentStep(currentOrderStatus);

  return (
    <Container
      className="bg-white"
      style={{
        height: "100vh",
      }}
    >
      <div className="max-w-5xl mx-auto p-4 font-sans">
        <Row justify="space-between" align="middle" className="mt-3 mb-3">
          <Button
            className="flex items-center text-dark"
            onClick={() => navigate("/customer-order")}
            style={{
              transition: "background-color 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            <h3 className="mr-2">←</h3>
            <h6>TRỞ LẠI</h6>
          </Button>
          <div className="text-sm">
            <span className="font-semibold">
              MÃ ĐƠN HÀNG: <b>{order?.id}</b>
            </span>
            <span className="mx-2 text-gray-300 mx-4">|</span>
            <b
              className="text-danger font-semibold"
              style={{ textTransform: "uppercase" }}
            >
              {OrderStatusLabel[currentOrderStatus]}
            </b>
          </div>
        </Row>

        <Divider style={{ margin: "10px 0" }} className="mb-5" />

        {currentOrderStatus === OrderStatus.CANCEL ? (
          <Steps
            current={currentStep}
            items={cancelSteps}
            className="custom-steps"
          />
        ) : (
          <Steps
            current={currentStep}
            items={steps}
            className="custom-steps"
          />
        )}

        <div className="w-full overflow-hidden mt-5 mb-5">
          <Row
            justify="center"
            align="middle"
            style={{
              transform: "skew(-12deg)",
              margin: "0",
              padding: "0",
            }}
          >
            {Array.from({ length: 21 }).map((_, index) => (
              <Col key={index} style={{ padding: "0 2px" }}>
                <div
                  style={{
                    height: "3px",
                    width: "48px",
                    backgroundColor: index % 2 === 0 ? "#60A5FA" : "#F472B6",
                    opacity: 0.8,
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Delivery Address */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold">Địa chỉ nhận hàng</h4>
              <p className="text-gray-700 mt-4">
                <b>{order?.fullName}</b> <br />
                (+84) {order?.phoneNumber} <br />
                {order?.address.specificAddress}, {order?.address.wardName},{" "}
                {order?.address.districtName}, {order?.address.provinceName}
              </p>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <OrderPaymentDetails order={order} />
          </Grid>
        </Grid>

        {order?.paymentMethod === PaymentMethodEnum.CASH && (
          <div
            className="mt-4 p-4 bg-yellow-50 rounded"
            style={{
              border: "1px solid rgba(224, 168, 0, .4)",
            }}
          >
            <span className="text-gray-600">
              {`Vui lòng thanh toán ${order.totalMoney.toLocaleString(
                "vi-VN"
              )} ₫ khi nhận hàng.`}
            </span>
          </div>
        )}

        <div className="w-full overflow-hidden mt-5 mb-5">
          <Row
            justify="center"
            align="middle"
            style={{
              transform: "skew(-12deg)",
              margin: "0",
              padding: "0",
            }}
          >
            {Array.from({ length: 21 }).map((_, index) => (
              <Col key={index} style={{ padding: "0 2px" }}>
                <div
                  style={{
                    height: "3px",
                    width: "48px",
                    backgroundColor: index % 2 === 0 ? "#60A5FA" : "#F472B6",
                    opacity: 0.8,
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>

        {order?.orderDetails?.map((detail: any) => (
          <OrderDetailCard key={detail.id} order={order} detail={detail} />
        ))}
        <Grid container justifyContent="flex-end" className="mt-5">
          <Typography variant="h6" color="text.secondary">
            Thành tiền:
          </Typography>
          <Typography variant="h6" color="error" style={{ marginLeft: 8 }}>
            {`${order?.finalPrice.toLocaleString("vi-VN")} ₫`}
          </Typography>
        </Grid>

        <Divider style={{ margin: "10px 0" }} className="" />

        <div className="mt-8 text-gray-600 text-sm">
          <p>
            Nếu hàng nhận được có vấn đề, bạn có thể gửi yêu cầu Trả hàng/Hoàn
            tiền trước <span className="text-gray-900">...</span>
          </p>
        </div>

        {order?.status === OrderStatus.PENDING &&
          order?.paymentMethod === PaymentMethodEnum.CASH && (
            <Grid container justifyContent="flex-end" style={{ marginTop: 20 }}>
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    handleCancelOrder(order?.id, navigate);
                  }}
                  style={{ marginTop: 10 }}
                >
                  Hủy đơn hàng
                </Button>
              </Grid>
            </Grid>
          )}

        {order?.status === OrderStatus.SUCCESS && (
          <Grid container justifyContent="flex-end" style={{ marginTop: 20 }}>
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

        {order?.status === OrderStatus.CANCEL && (
          <Grid container justifyContent="flex-end" style={{ marginTop: 20 }}>
            <Grid item>
              <Button
                variant="contained"
                color="inherit"
                onClick={(e) => {
                  e.stopPropagation();
                  const productId =
                    order?.orderDetails?.[0]?.productDetail?.product?.id;
                  if (productId !== undefined) {
                    handleBuyAgain(productId, navigate);
                  } else {
                    toast.error("Product ID không khả dụng");
                  }
                }}
                style={{ marginTop: 10 }}
              >
                Mua lại
              </Button>
            </Grid>
          </Grid>
        )}

        {order?.status === OrderStatus.SUCCESS && (
          <Grid container justifyContent="flex-end" style={{ marginTop: 20 }}>
            <Grid item>
              <Button
                variant="contained"
                color="inherit"
                onClick={(e) => {
                  e.stopPropagation();
                  const productId =
                    order?.orderDetails?.[0]?.productDetail?.product?.id;
                  if (productId !== undefined) {
                    handleBuyAgain(productId, navigate);
                  } else {
                    toast.error("Product ID không khả dụng");
                  }
                }}
                style={{ marginTop: 10 }}
              >
                Mua lại
              </Button>
            </Grid>
          </Grid>
        )}

        {order?.status === OrderStatus.SUCCESS && (
          <Grid container justifyContent="flex-end" style={{ marginTop: 20 }}>
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

        {/* <div className="mt-6 flex justify-between gap-4">
        <Button type="primary" className="bg-red-500 hover:bg-red-600 flex-1">
          Đánh Giá
        </Button>
        <Button className="flex-1">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
        <Button className="flex-1">Liên Hệ Người Bán</Button>
        <Button className="flex-1">Mua Lại</Button>
      </div> */}
      </div>
    </Container>
  );
};

export default OrderStatusCustomer;
