import React, { useEffect, useState } from 'react';
import { Tabs, Card, Spin, Row, Col,Divider } from 'antd';
import type { TabsProps } from 'antd';
import { Container,Typography,Grid, useTheme } from '@mui/material';
import LoadingCustom from "../../../components/Loading/LoadingCustom.js";
import OrderDetailCard from './CustomerOrderCard';
import { fetchOrdersByUserId } from '../../../api/CustomerOrderApi.js';
import Order from '../../../types/Order.js';
import Cookies from "js-cookie"
import { toast } from 'react-toastify';
import { OrderStatus, OrderStatusLabel } from '../../../enum/OrderStatusEnum.js';
import OrderTabContent from './OrderTabContent.js';

const onChange = (key: string) => {
  console.log('Active tab key:', key);
};

const CustomerOrder: React.FC = () => {
  const items = Object.values(OrderStatus).map((status) => ({
    key: status,
    label: OrderStatusLabel[status],
    children: <OrderTabContent status={status} />,
  }));
  return (
    <Container>
      <Tabs
        centered
        defaultActiveKey="1"
        onChange={onChange}
        size="large"
        indicator={{ size: (origin) => origin - 20, align: "center" }}
        className='mt-3'
        style={{
          fontWeight:"500",
          color:"#333",
        }}
        items={items}
      >
        {/* {Object.values(OrderStatus).map((status) => (
          <TabPane tab={OrderStatusLabel[status]} key={status} className='mt-5'>
            <OrderTabContent status={status} />
          </TabPane>
        ))} */}
      </Tabs>
    </Container>
  );
};

export default CustomerOrder;
