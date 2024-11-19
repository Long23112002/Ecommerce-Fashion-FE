import React from 'react';
import { TooltipProps } from 'recharts';

const RevenueTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { revenue } = payload[0].payload;
        return (
            <div
                style={{
                    background: 'white',
                    borderRadius: '5px',
                    padding: '10px',
                    border: '1px solid #ccc',
                }}
            >
                <p><strong>{label}</strong></p>
                <p>Revenue: {revenue.toLocaleString("vi-VN")} VND</p>
            </div>
        );
    }

    return null;
};

export default RevenueTooltip