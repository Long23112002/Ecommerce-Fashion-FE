import { Col, Row } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import TimeRevenueChart from './revenue/TimeRevenueChart';
import DayRevenueInfo from './revenue/DayRevenueInfo';
import SoldProductChart from './sold/SoldProductChart';
import InventoryTable from './inventory/InventoryTable';


const { Option } = Select;

const Statistics: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

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

            <DayRevenueInfo />

            <TimeRevenueChart
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
            />

            <Row gutter={[16, 16]} style={{ minHeight: '400px' }}>
                <Col span={24} md={12}>
                    <SoldProductChart
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                    />
                </Col>

                <Col span={24} md={12}>
                    <InventoryTable />
                </Col>
            </Row>

        </div>
    );
};

export default Statistics;
