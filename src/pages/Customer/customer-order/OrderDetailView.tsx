import React, { useState } from 'react';
import { Steps, Button } from 'antd';
import { FileTextOutlined, DollarOutlined, CarOutlined, InboxOutlined, StarOutlined,SyncOutlined } from '@ant-design/icons';
import { OrderStatus, OrderStatusLabel } from '../../../types/Order';
import './OrderStatus.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import  dayjs  from 'dayjs';
const OrderStatusCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {order} = location.state;

  const createdAt = order?.createdAt ? dayjs(order.createdAt).format('HH:mm DD-MM-YYYY') : '';
  const updatedAt = order?.updatedAt ? dayjs(order.updatedAt).format('HH:mm DD-MM-YYYY') : '';

  const [currentOrderStatus, setCurrentOrderStatus] = useState<OrderStatus>(order?.status);

  const steps = [
    {
      title: OrderStatusLabel[OrderStatus.PENDING],
      description: createdAt,
      icon: <FileTextOutlined />,
    },
    {
      title: OrderStatusLabel[OrderStatus.SHIPPING],
      description: updatedAt,
      icon: <DollarOutlined />,
    },
    {
      title: OrderStatusLabel[OrderStatus.SUCCESS],
      description: '09:28 06-11-2024',
      icon: <InboxOutlined />,
    },
    {
      title: OrderStatusLabel[OrderStatus.REFUND],
      icon: <SyncOutlined />,
    },
  ];

const getCurrentStep = (status: OrderStatus): number => {
  switch (status) {
    case OrderStatus.PENDING:
      return 0;
    case OrderStatus.SHIPPING:
      return 1;
    case OrderStatus.SUCCESS:
      return 2;
    case OrderStatus.REFUND:
      return 3;
    default:
      return 0;
  }
};

const currentStep = getCurrentStep(currentOrderStatus);


  return (
    <Container>
    <div className="max-w-5xl mx-auto p-4 font-sans">
      <div className="flex justify-between items-center mb-8">
        <Button 
        type="text" 
        className="flex items-center text-gray-600 px-0 mt-5 mb-5"
        onClick={() => navigate('/customer-order')}
        >
          <h3 className="mr-2">←</h3><h6>TRỞ LẠI</h6>
        </Button>
        <div className="text-sm">
          <span className="font-semibold">MÃ ĐƠN HÀNG: <b>{order.id}</b></span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-red-500 font-semibold">{OrderStatusLabel[currentOrderStatus]}</span>
        </div>
      </div>

      
      <Steps
        current={currentStep}
        items={steps}
        className="custom-steps"
      />

      {/* <div className="mt-8 text-gray-600 text-sm">
        <p>
          Nếu hàng nhận được có vấn đề, bạn có thể gửi yêu cầu Trả hàng/Hoàn tiền trước <span className="text-gray-900">17-11-2024</span>
        </p>
      </div> */}

      <div className="mt-6 flex justify-between gap-4">
        <Button type="primary" className="bg-red-500 hover:bg-red-600 flex-1">
          Đánh Giá
        </Button>
        <Button className="flex-1">Yêu Cầu Trả Hàng/Hoàn Tiền</Button>
        <Button className="flex-1">Liên Hệ Người Bán</Button>
        <Button className="flex-1">Mua Lại</Button>
      </div>
    </div>
    </Container>
  );
}

export default OrderStatusCustomer;
