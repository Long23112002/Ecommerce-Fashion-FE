import React from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import { InventoryProduct, InventoryProductDetail } from '../../../../types/Statistic'
import { getRandomColor } from '../../../../utils/colorUtils'
import { Typography } from '@mui/material';

interface InventoryProductDetailWithColor extends InventoryProductDetail {
    colorRandom: string;
}

interface IProps {
    props: InventoryProduct
}

const InventoryTooltip: React.FC<IProps> = ({ props }) => {
    const { id, name, quantity, productDetails } = props

    const data: InventoryProductDetailWithColor[] = React.useMemo(() =>
        productDetails?.map((pd) => ({
            ...pd,
            colorRandom: getRandomColor(),
        })),
        [productDetails]
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
            {
                quantity > 0
                    ?
                    <PieChart width={300} height={250}>
                        <Pie
                            data={data}
                            isAnimationActive={false}
                            dataKey="quantity"
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
                    :
                    <Typography>Không còn sản phẩm</Typography>
            }
        </div>
    );

};

const CustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, id, size, color, quantity } = props;
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
                quantity: {quantity}
            </Typography>
        </>
    );
};

export default InventoryTooltip