import { Typography } from '@mui/material';
import React from 'react';
import { Cell, Pie, PieChart, TooltipProps } from 'recharts';
import { SoldProductDetail } from '../../../types/Statistic';
import { getRandomColor } from '../../../utils/colorUtils';

interface SoldProductDetailWithColor extends SoldProductDetail {
    colorRandom: string;
}

const SoldTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { id, name, sold, soldProductDetails } = payload[0].payload;
        const solds = soldProductDetails as SoldProductDetail[];

        const data: SoldProductDetailWithColor[] = React.useMemo(() => 
            solds?.map((pd) => ({
                ...pd,
                colorRandom: getRandomColor(),
            })), 
            [solds]
        );

        return (
            <div
                style={{
                    background: 'white',
                    borderRadius: '5px',
                    padding: '10px',
                    border: '1px solid #ccc',
                }}
            >
                <Typography variant='subtitle2'>Id: {id}</Typography>
                <Typography variant='subtitle2'>Name: {name}</Typography>
                <Typography variant='subtitle2'>Sold: {sold}</Typography>
                <PieChart width={300} height={250}>
                    <Pie
                        data={data}
                        isAnimationActive={false}
                        dataKey="sold"
                        nameKey="id"
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        fill='#8884d8'
                        label={<CustomLabel />}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.colorRandom} />
                        ))}
                    </Pie>
                </PieChart>
            </div>
        );
    }

    return null;
};

// Custom label cho từng phần của biểu đồ Pie
const CustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, id, size, color, sold } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 40;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <>
            <Typography
                x={x}
                y={y}
                textAnchor="middle"
                fill="#333"
                variant="caption"
                component="text"
            >
                id: {id}
            </Typography>
            <Typography
                x={x}
                y={y + 12}
                textAnchor="middle"
                fill="#333"
                variant="caption"
                component="text"
            >
                {color}
            </Typography>
            <Typography
                x={x}
                y={y + 24}
                textAnchor="middle"
                fill="#333"
                variant="caption"
                component="text"
            >
                {size}
            </Typography>
            <Typography
                x={x}
                y={y + 36}
                textAnchor="middle"
                fill="#333"
                variant="caption"
                component="text"
            >
               sold: {sold}
            </Typography>
        </>
    );
};

export default SoldTooltip;
