import React, { useState, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CalendarOutlined } from '@ant-design/icons';
import { Card, Tabs, Table, Row, Col, Space, Typography, DatePicker, Select } from 'antd';
import moment from 'moment';

const { Option } = Select;

interface RevenueData {
    month: string;
    revenue: number;
}

interface ProductSalesData {
    product: string;
    sales: number;
}

interface InventoryData {
    product: string;
    quantity: number;
}

interface DailyRevenue {
    day: string;
    revenue: number;
}

const productSalesData: ProductSalesData[] = [
    { product: 'Product A', sales: 300 },
    { product: 'Product B', sales: 450 },
    { product: 'Product C', sales: 200 },
    { product: 'Product D', sales: 380 },
    { product: 'Product E', sales: 270 },
];

const inventoryData: InventoryData[] = [
    { product: 'Product A', quantity: 100 },
    { product: 'Product B', quantity: 150 },
    { product: 'Product C', quantity: 80 },
    { product: 'Product D', quantity: 120 },
    { product: 'Product E', quantity: 90 },
];

const currentDayRevenue: number = 1500;

const Statistics: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
    const [selectedMonth, setSelectedMonth] = useState<moment.Moment | null>(null);
    const [selectedYear, setSelectedYear] = useState<string>('2024');
    const [selectedWeek, setSelectedWeek] = useState<number>(1);
    const [dailyRevenueData, setDailyRevenueData] = useState<DailyRevenue[]>([]);
    const [yearlyRevenueData, setYearlyRevenueData] = useState<RevenueData[]>([]);

    const generateDailyRevenueData = (week: number) => {
        const startDate = moment().month(selectedMonth?.month()).startOf('month').add(week - 1, 'weeks');
        const newData: DailyRevenue[] = [];
        for (let i = 0; i < 7; i++) {
            newData.push({
                day: startDate.add(i, 'days').format('DD/MM'),
                revenue: Math.floor(Math.random() * 1000) + 1000,
            });
        }
        setDailyRevenueData(newData);
    };


    const generateYearlyRevenueData = (year: string) => {
        const newData: RevenueData[] = [];
        const months = moment.monthsShort();
        for (let i = 0; i < 12; i++) {
            newData.push({
                month: months[i],
                revenue: Math.floor(Math.random() * 5000) + 5000,
            });
        }
        setYearlyRevenueData(newData);
    };


    const getFilteredData = (period: string) => {
        switch (period) {
            case 'week':
                return dailyRevenueData;
            case 'month':
                if (selectedMonth) {
                    return [
                        {
                            month: selectedMonth.format('MMM'),
                            revenue: Math.floor(Math.random() * 5000) + 5000,
                        },
                    ];
                }
                return [];
            case 'year':
                return yearlyRevenueData;
            default:
                return [];
        }
    };


    useEffect(() => {
        if (selectedPeriod === 'year') {
            generateYearlyRevenueData(selectedYear);
        }
    }, [selectedPeriod, selectedYear]);

    useEffect(() => {
        if (selectedMonth) {
            setDailyRevenueData([]);
        }
    }, [selectedMonth]);

    const filteredData = getFilteredData(selectedPeriod);

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Card
                title={
                    <Space>
                        <Typography.Text strong>Doanh thu hôm nay</Typography.Text>
                        <CalendarOutlined style={{ fontSize: '16px', color: '#aaa' }} />
                    </Space>
                }
                style={{ marginBottom: '24px' }}
            >
                <Typography.Title level={2} style={{ marginBottom: '8px' }}>
                    {currentDayRevenue.toLocaleString()} VND
                </Typography.Title>
                <Typography.Text type="secondary">+20.1% from yesterday</Typography.Text>
            </Card>

            <Tabs
                defaultActiveKey="month"
                type="card"
                style={{ marginBottom: '24px' }}
                onChange={(key) => setSelectedPeriod(key)}
            >
                {['week', 'month', 'year'].map((period) => (
                    <Tabs.TabPane
                        tab={
                            period === 'week' ? 'Doanh thu tuần này' :
                                period === 'month' ? 'Doanh thu tháng này' :
                                    'Doanh thu năm nay'
                        }
                        key={period}
                    >
                        <Card>
                            {period === 'month' && (
                                <DatePicker
                                    picker="month"
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                    style={{ marginBottom: '16px' }}
                                />
                            )}
                            {period === 'week' && (
                                <Select
                                    value={selectedWeek}
                                    onChange={(week) => {
                                        setSelectedWeek(week);
                                        generateDailyRevenueData(week);
                                    }}
                                    style={{ width: 120, marginBottom: '16px' }}
                                >
                                    {Array.from({ length: 4 }, (_, index) => (
                                        <Option key={index + 1} value={index + 1}>
                                            Tuần {index + 1}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                            {period === 'year' && (
                                <Select
                                    value={selectedYear}
                                    onChange={(year) => {
                                        setSelectedYear(year);
                                        generateYearlyRevenueData(year);
                                    }}
                                    style={{ width: 120, marginBottom: '16px' }}
                                >
                                    {['2023', '2024', '2025'].map((year) => (
                                        <Option key={year} value={year}>
                                            {year}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={filteredData}>
                                    <XAxis dataKey={selectedPeriod === 'week' ? "day" : "month"} />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'white',
                                            border: '1px solid #ccc',
                                            borderRadius: '5px',
                                        }}
                                        labelStyle={{ fontWeight: 'bold' }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Bar dataKey="revenue" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Tabs.TabPane>
                ))}
            </Tabs>

            <Row gutter={[16, 16]} style={{ minHeight: '400px' }}>
                <Col span={24} md={12}>
                    <Card
                        title={
                            <Space>
                                <Typography.Text strong>Sản phẩm đã bán</Typography.Text>
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        <Space style={{ marginBottom: '16px' }}>
                            <DatePicker
                                picker="month"
                                value={selectedMonth}
                                onChange={(date) => setSelectedMonth(date)}
                                style={{ width: 180 }}
                            />
                            <Select
                                value={selectedYear}
                                onChange={(year) => setSelectedYear(year)}
                                style={{ width: 120 }}
                            >
                                {['2023', '2024', '2025'].map((year) => (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                ))}
                            </Select>
                        </Space>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={productSalesData}>
                                <XAxis dataKey="product" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                    }}
                                    labelStyle={{ fontWeight: 'bold' }}
                                />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="sales" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col span={24} md={12}>
                    <Card
                        title={
                            <Space>
                                <Typography.Text strong>Sản phẩm tồn kho</Typography.Text>
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        <Space style={{ marginBottom: '16px' }}>
                            <DatePicker
                                picker="month"
                                value={selectedMonth}
                                onChange={(date) => setSelectedMonth(date)}
                                style={{ width: 180 }}
                            />
                            <Select
                                value={selectedYear}
                                onChange={(year) => setSelectedYear(year)}
                                style={{ width: 120 }}
                            >
                                {['2023', '2024', '2025'].map((year) => (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                ))}
                            </Select>
                        </Space>

                        <Table
                            dataSource={inventoryData}
                            columns={[
                                {
                                    title: 'Sản phẩm',
                                    dataIndex: 'product',
                                    key: 'product',
                                },
                                {
                                    title: 'Số lượng',
                                    dataIndex: 'quantity',
                                    key: 'quantity',
                                },
                            ]}
                            pagination={false}
                            rowKey="product"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Statistics;
