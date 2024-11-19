import React from 'react';
import { TooltipProps } from 'recharts';

const SoldTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { quantity, name, id } = payload[0].payload;
        return (
            <div
                style={{
                    background: 'white',
                    borderRadius: '5px',
                    padding: '10px',
                    border: '1px solid #ccc',
                }}
            >
                <p><strong>id: {id}</strong></p>
                <p>Name: {name}</p>
                <p>Sold: {quantity}</p>
            </div>
        );
    }

    return null;
};

export default SoldTooltip