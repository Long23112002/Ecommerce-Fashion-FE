import { Card, DatePicker, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import SoldTooltip from './SoldTooltip';
import { SoldProduct } from '../../../../types/Statistic';
import { getSoldProducts } from '../../../../api/StatisticApi';

interface IProps {
    selectedMonth: dayjs.Dayjs,
    setSelectedMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>
}

const SoldProductChart: React.FC<IProps> = ({ selectedMonth, setSelectedMonth }) => {

    const [productSalesData, setProductSalesData] = useState<SoldProduct[]>([])

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
    )
}

export default SoldProductChart