import { CalendarOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { Card, Col, DatePicker, Row, Select, Space, Table, Tabs, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getCurrentDayRevenue, getMonthRevenueData, getSoldProducts, getYearRevenueData } from '../../../api/StatisticApi';
import RevenueModal from './RevenueModal';
import RevenueTooltip from './RevenueTooltip';
import SoldTooltip from './SoldTooltip';
import { CurrentDayReport, InventoryData, RevenueReport, RevenueRequest, SoldProduct } from '../../../types/Statistic';
import dayjs, { Dayjs } from 'dayjs';
import { monthStringToNumber } from '../../../utils/dateUtils';

const inventoryData: InventoryData[] = [
    { product: 'Product A', quantity: 100 },
    { product: 'Product B', quantity: 150 },
    { product: 'Product C', quantity: 80 },
    { product: 'Product D', quantity: 120 },
    { product: 'Product E', quantity: 90 },
];

const { Option } = Select;

const Statistics: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('year');
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
    const [selectedYear, setSelectedYear] = useState<string>('2024');
    const [dailyRevenueData, setDailyRevenueData] = useState<RevenueReport>();
    const [yearlyRevenueData, setYearlyRevenueData] = useState<RevenueReport>();
    const [currentDayRevenue, setCurrentDayRevenue] = useState<CurrentDayReport>();
    const [productSalesData, setProductSalesData] = useState<SoldProduct[]>([])
    const [revenueRequest, setRevenueRequest] = useState<RevenueRequest>()

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
                setYearlyRevenueData(res);
            };
            fetchYearRevenueData();
        }
    }, [selectedPeriod, selectedYear]);

    useEffect(() => {
        const fetchMonthRevenueData = async () => {
            const year = selectedMonth ? selectedMonth.year() : undefined;
            const month = selectedMonth ? selectedMonth.month() + 1 : undefined;
            const res = await getMonthRevenueData(year, month);
            setDailyRevenueData(res);
        };
        fetchMonthRevenueData();
    }, [selectedPeriod, selectedMonth]);

    useEffect(() => {
        const fetch = async () => {
            const year = selectedMonth ? selectedMonth.year() : undefined;
            const month = selectedMonth ? selectedMonth.month() + 1 : undefined;
            const res = await getSoldProducts(year, month)
            setProductSalesData([...res])
        }
        fetch()
    }, [selectedMonth])

    const handleDataOrder = (e: any) => {
        if (selectedPeriod == 'year') {
            const year = selectedYear;
            const month = monthStringToNumber(e.activeLabel) || 0;
            setRevenueRequest({
                year, month
            })
        } else {
            const year = selectedMonth?.year() || 0;
            const month = (selectedMonth?.month() || 0) + 1;
            const day = e.activeLabel;
            setRevenueRequest({
                year, month, day
            })
        }
        setOpen(true)
    }

    const getFilteredData = () => {
        switch (selectedPeriod) {
            case 'month':
                return dailyRevenueData?.data;
            case 'year':
                return yearlyRevenueData?.data;
            default:
                return [];
        }
    };

    const filteredData = getFilteredData();

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
                                <Box display='flex' alignItems='center' mb={2} gap={2}>
                                    <DatePicker
                                        picker="month"
                                        value={selectedMonth}
                                        onChange={setSelectedMonth}
                                    />
                                    <Typography>Tổng số doanh thu của tháng: {(dailyRevenueData?.total || 0).toLocaleString('vi-VN')} VNĐ</Typography>
                                </Box>
                            )}
                            {period === 'year' && (
                                <Box display='flex' alignItems='center' mb={2} gap={2}>
                                    <Select
                                        value={selectedYear}
                                        onChange={setSelectedYear}
                                        style={{ width: 120 }}
                                    >
                                        {['2023', '2024'].map((year) => (
                                            <Option key={year} value={year}>
                                                {year}
                                            </Option>
                                        ))}
                                    </Select>
                                    <Typography>Tổng số doanh thu của năm: {(yearlyRevenueData?.total || 0).toLocaleString('vi-VN')} VNĐ</Typography>
                                </Box>
                            )}
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={filteredData} onClick={handleDataOrder}>
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
                                <Bar dataKey="sold" fill="#8884d8" />
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
                            rowKey="product"
                        />
                    </Card>
                </Col>
            </Row>

            <RevenueModal open={open} setOpen={setOpen} revenueRequest={revenueRequest} />

        </div>
    );
};

export default Statistics;
