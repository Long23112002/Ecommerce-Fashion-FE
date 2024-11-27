import { CalendarOutlined } from '@ant-design/icons';
import { Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getCurrentDayRevenue } from '../../../../api/StatisticApi';
import { CurrentDayReport } from '../../../../types/Statistic';

const DayRevenueInfo = () => {

    const [currentDayRevenue, setCurrentDayRevenue] = useState<CurrentDayReport>();

    useEffect(() => {
        const fetchCurrentDayRevenue = async () => {
            const data = await getCurrentDayRevenue();
            setCurrentDayRevenue(data);
        };
        fetchCurrentDayRevenue();
    }, []);

    return (
        <Card
            title={
                <Space>
                    <Typography.Text strong>Doanh thu hôm nay</Typography.Text>
                    <CalendarOutlined style={{ fontSize: '16px', color: '#aaa' }} />
                </Space>
            }
            style={{ marginBottom: '24px' }}
        >
            {
                currentDayRevenue &&
                <>
                    <Typography.Title level={2} style={{ marginBottom: '8px' }}>
                        {currentDayRevenue.today.revenue.toLocaleString()} VND
                    </Typography.Title>
                    {
                        currentDayRevenue.increase != 0 &&
                        <Typography.Text type={currentDayRevenue?.increase > 0 ? 'success' : 'danger'}>
                            {currentDayRevenue?.increase > 0 && '+'}
                            {currentDayRevenue?.increase.toLocaleString()}% from yesterday
                        </Typography.Text>
                    }
                </>
            }
        </Card>
    )
}

export default DayRevenueInfo