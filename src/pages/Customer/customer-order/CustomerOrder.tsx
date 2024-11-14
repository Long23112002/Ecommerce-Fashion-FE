import React, { useEffect, useState } from 'react';
import { Segmented, Tabs, Card, Spin } from 'antd';
import type { TabsProps } from 'antd';
import { Container } from '@mui/material';
import axiosInstance from '../../../api/AxiosInstance';
import { BASE_API } from '../../../constants/BaseApi';
import { User } from '../../../types/User';

const { TabPane } = Tabs;

// Tạo các trạng thái đơn hàng
const orderStatuses = [
  'PENDING',
  'CANCEL',
  'SHIPPING',
  'SUCCESS',
  'DRAFT',
  'REFUND',
];

// Component nội dung Tab cho từng trạng thái đơn hàng
const OrderTabContent: React.FC<{ status: string }> = ({ status }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`${BASE_API}/api/v1/orders?status=${status}&user=9`)
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
        console.log(data);
        
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  }, [status]);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      {data.length === 0 ? (
        <h5 className='text-center'>Quý khách chưa có đơn hàng nào</h5>
      ) : (
        data.map((order) => (
          <Card key={order.id} title={`Order ID: ${order.id}`} style={{ margin: 10 }}>
            <p>Status: {order.status}</p>
            <p>Details: {order.details}</p>
          </Card>
        ))
      )}
    </div>
  );
};

// Hàm xử lý sự thay đổi tab
const onChange = (key: string) => {
  console.log('Active tab key:', key);
};

const CustomerOrder: React.FC = () => {
  const [alignValue, setAlignValue] = useState<Align>('center');
  return (
    <Container>
      <Tabs
      centered
        defaultActiveKey="1"
        onChange={onChange}
        size="large"
        indicator={{ size: (origin) => origin - 20, align: "center" }}
      >
        {orderStatuses.map((status, index) => (
          <TabPane tab={status} key={index + 1}>
            <OrderTabContent status={status} />
          </TabPane>
        ))}
      </Tabs>
    </Container>
  );
};

export default CustomerOrder;
