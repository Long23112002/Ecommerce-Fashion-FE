import { Col, Row } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import TimeRevenueChart from './revenue/TimeRevenueChart';
import DayRevenueInfo from './revenue/DayRevenueInfo';
import SoldProductChart from './sold/SoldProductChart';
import InventoryTable from './inventory/InventoryTable';

const Statistics: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

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
