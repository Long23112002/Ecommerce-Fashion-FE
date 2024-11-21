import React, { useState, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CalendarOutlined } from '@ant-design/icons';
import { Card, Tabs, Table, Row, Col, Space, Typography, DatePicker, Select } from 'antd';
import moment from 'moment';
import { getCurrentDayRevenue, getMonthRevenueData, getSoldProducts, getYearRevenueData } from '../../../api/StatisticApi';
import RevenueTooltip from './RevenueTooltip';
import SoldTooltip from './SoldTooltip';

const { Option } = Select;

interface RevenueData {
    name: string;
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

interface CurrentDayReport {
    increase: number;
    today: RevenueData;
    yesterday: RevenueData;
}

interface SoldProduct {
    id: number,
    name: string,
    quantity: number
}

const inventoryData: InventoryData[] = [
    { product: 'Product A', quantity: 100 },
    { product: 'Product B', quantity: 150 },
    { product: 'Product C', quantity: 80 },
    { product: 'Product D', quantity: 120 },
    { product: 'Product E', quantity: 90 },
];

const Statistics: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('year');
    const [selectedMonth, setSelectedMonth] = useState<moment.Moment>();
    const [selectedYear, setSelectedYear] = useState<string>('2024');
    const [dailyRevenueData, setDailyRevenueData] = useState<RevenueData[]>([]);
    const [yearlyRevenueData, setYearlyRevenueData] = useState<RevenueData[]>([]);
    const [currentDayRevenue, setCurrentDayRevenue] = useState<CurrentDayReport>();
    const [productSalesData, setProductSalesData] = useState<SoldProduct[]>([])

    useEffect(() => {
        const fetchCurrentDayRevenue = async () => {
            const data = await getCurrentDayRevenue();
            setCurrentDayRevenue(data);
        };
        fetchCurrentDayRevenue();
    }, []);

    useEffect(() => {
        if (selectedPeriod === 'year') {
            const fetchYearRevenueData = async () => {
                const res = await getYearRevenueData(selectedYear);
                setYearlyRevenueData(res.data);
            };
            fetchYearRevenueData();
        }
    }, [selectedPeriod, selectedYear]);

    useEffect(() => {
        const fetchMonthRevenueData = async () => {
            const year = selectedMonth ? selectedMonth.year() : undefined;
            const month = selectedMonth ? selectedMonth.month() + 1 : undefined;
            const res = await getMonthRevenueData(year, month);
            setDailyRevenueData(res.data);
        };
        fetchMonthRevenueData();
    }, [selectedPeriod, selectedMonth]);

    const getFilteredData = () => {
        switch (selectedPeriod) {
            case 'month':
                return dailyRevenueData;
            case 'year':
                return yearlyRevenueData;
            default:
                return [];
        }
    };

    const filteredData = getFilteredData();

    useEffect(() => {
        const fetch = async () => {
            const year = selectedMonth ? selectedMonth.year() : undefined;
            const month = selectedMonth ? selectedMonth.month() + 1 : undefined;
            const res = await getSoldProducts(year, month)
            setProductSalesData([...res])
        }
        fetch()
    }, [selectedMonth])

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

            <Tabs
                defaultActiveKey="year"
                type="card"
                style={{ marginBottom: '24px' }}
                onChange={setSelectedPeriod}
            >
                {['month', 'year'].map((period) => (
                    <Tabs.TabPane
                        tab={period === 'month' ? 'Doanh thu tháng này' : 'Doanh thu năm nay'}
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
                            {period === 'year' && (
                                <Select
                                    value={selectedYear}
                                    onChange={setSelectedYear}
                                    style={{ width: 120, marginBottom: '16px' }}
                                >
                                    {['2023', '2024'].map((year) => (
                                        <Option key={year} value={year}>
                                            {year}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={filteredData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        labelStyle={{ fontWeight: 'bold' }}
                                        content={<RevenueTooltip />}
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
                                onChange={setSelectedMonth}
                                style={{ width: 180 }}
                            />
                        </Space>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={productSalesData}>
                                <YAxis />
                                <Tooltip
                                    content={<SoldTooltip />}
                                    labelStyle={{ fontWeight: 'bold' }}
                                />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar dataKey="quantity" fill="#8884d8" />
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
