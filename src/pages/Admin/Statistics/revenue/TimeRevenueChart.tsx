import { Box } from '@mui/material';
import { Card, DatePicker, Select, Tabs, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import RevenueModal from './RevenueModal';
import RevenueTooltip from './RevenueTooltip';
import { RevenueReport, RevenueRequest } from '../../../../types/Statistic';
import { getMonthRevenueData, getYearRevenueData } from '../../../../api/StatisticApi';
import { monthStringToNumber } from '../../../../utils/dateUtils';

interface IProps {
    selectedMonth: dayjs.Dayjs,
    setSelectedMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>
}

const { Option } = Select;

const TimeRevenueChart: React.FC<IProps> = ({ selectedMonth, setSelectedMonth }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('year');
    const [selectedYear, setSelectedYear] = useState<string>('2024');
    const [revenueRequest, setRevenueRequest] = useState<RevenueRequest>()
    const [dailyRevenueData, setDailyRevenueData] = useState<RevenueReport>();
    const [yearlyRevenueData, setYearlyRevenueData] = useState<RevenueReport>();

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
        <>
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

            <RevenueModal open={open} setOpen={setOpen} revenueRequest={revenueRequest} />
        </>
    )
}

export default TimeRevenueChart