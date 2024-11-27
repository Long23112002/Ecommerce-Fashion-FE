import { Card, Select, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { PageableRequest } from '../../../../api/AxiosInstance';
import { getInventoryProducts } from '../../../../api/StatisticApi';
import { InventoryProduct } from '../../../../types/Statistic';
import InventoryTooltip from './InventoryTooltip';
import { IconButton, Popover } from '@mui/material';

const { Option } = Select;

const InventoryTable: React.FC = () => {
    const [inventoryProducts, setInventoryProducts] = useState<InventoryProduct[]>([]);
    const [sort, setSort] = useState<"DESC" | "ASC">('DESC');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentProduct, setCurrentProduct] = useState<InventoryProduct | null>(null);

    const openPopover = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>, product: InventoryProduct) => {
        setAnchorEl(event.currentTarget);
        setCurrentProduct(product);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCurrentProduct(null);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const pageable: PageableRequest = { sort };
            const { data } = await getInventoryProducts(pageable);
            setInventoryProducts(data);
        };
        fetchProducts();
    }, [sort]);

    return (
        <>
            <Card
                title={
                    <Space>
                        <Typography.Text strong>Sản phẩm tồn kho</Typography.Text>
                    </Space>
                }
                style={{ height: '100%' }}
            >
                <Select
                    value={sort}
                    onChange={setSort}
                    style={{ width: 120, marginBottom: '16px' }}
                >
                    <Option value="ASC">Tăng dần</Option>
                    <Option value="DESC">Giảm dần</Option>
                </Select>
                <Table
                    dataSource={inventoryProducts}
                    columns={[
                        {
                            title: 'ID',
                            dataIndex: 'id',
                            key: 'id',
                        },
                        {
                            title: 'Tên sản phẩm',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: 'Số lượng',
                            dataIndex: 'quantity',
                            key: 'quantity',
                        },
                        {
                            title: 'Chi tiết',
                            render: (_, record) => (
                                <IconButton
                                    color="primary"
                                    className="btn-outline-info"
                                    onClick={(e) => handleOpen(e, record)}
                                    style={{ marginRight: 8 }}
                                >
                                    <i className="fa-solid fa-eye" style={{ fontSize: 15 }}></i>
                                </IconButton>
                            ),
                        },
                    ]}
                    rowKey="id"
                    pagination={{ defaultPageSize: 5 }}
                />
            </Card >
            <Popover
                anchorEl={anchorEl}
                open={openPopover}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                disableRestoreFocus
                disablePortal
                sx={{ borderRadius: '12px' }}
            >
                {currentProduct && <InventoryTooltip props={currentProduct} />}
            </Popover>
        </>
    );
};

export default InventoryTable;
