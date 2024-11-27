import { Button, Col, Divider, Image, InputNumber, Popconfirm, Row, Table, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import LoadingCustom from '../Loading/LoadingCustom'
import OrderDetail from '../../types/OrderDetail'
import createPaginationConfig from '../../config/paginationConfig';
import { FileImageOutlined } from '@ant-design/icons';
import Order from '../../types/Order';
import { getOrderDetailByIdOrder } from '../../api/StoreApi';

interface ListOrderDetailProps {
    // orderDetailList: OrderDetail[];
    handleDelete: (e: any) => void;
    handleDecreaseQuantity: (e: any) => void;
    handleQuantityChange: (e: any) => void;
    handleIncreaseQuantity: (e: any) => void;
    order: Order | null;
    isOrderDetailChange: boolean;
    sizeOrder: number;
}
const ListOrderDetail: React.FC<ListOrderDetailProps> = ({
    // orderDetailList,
    handleDelete,
    handleDecreaseQuantity,
    handleQuantityChange,
    handleIncreaseQuantity,
    order,
    isOrderDetailChange,
    sizeOrder
}) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(value);
    };
    const [orderDetailList, setOrderDetailList] = useState<OrderDetail[]>([]);
    const [loadingOrderDetailList, setLoaingOrderDetailList] = useState(true);

    const fetchListOrderDetail = async (order: Order | null) => {
        if (order) {
            setLoaingOrderDetailList(true)
            const res = await getOrderDetailByIdOrder(order.id);
            setOrderDetailList([...res.data])
            setLoaingOrderDetailList(false)
        } else {
            setOrderDetailList([]);
        }
    }

    useEffect(() => {
        fetchListOrderDetail(order)
    }, [isOrderDetailChange, sizeOrder])

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'productDetail',
            key: 'productDetail',
            render: (productDetail: any): any => (
                productDetail.product.image ? (
                    <Image
                        width={60}
                        src={productDetail.product.image}
                        alt="image"
                        style={{ borderRadius: '10px' }}
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: '#aaa' }}>
                        <FileImageOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                    </div>
                )
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productDetail',
            key: 'productDetail',
            render: (productDetail: any) => productDetail.product.name
        },
        {
            title: 'Màu sắc',
            dataIndex: 'productDetail',
            key: 'productDetail',
            render: (productDetail: any) => productDetail.color.name
        },
        {
            title: 'Kích cỡ',
            dataIndex: 'productDetail',
            key: 'productDetail',
            render: (productDetail: any) => productDetail.size.name
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => formatCurrency(price),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity: number, record: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button onClick={() => handleDecreaseQuantity(record.id)}>-</Button>
                    <InputNumber
                        min={1}
                        value={quantity}
                        onChange={(value) => handleQuantityChange(value, record.id)}
                    />
                    <Button onClick={() => handleIncreaseQuantity(record.id)}>+</Button>
                </div>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
            render: (totalMoney: number) => formatCurrency(totalMoney),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record: any) => (
                <div>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa mặt hàng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button className="btn-outline-danger">
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                    </Popconfirm>
                </div>
            )
        },
    ]
    return (
        <>
            <Divider orientation="left">Danh sách hóa đơn chi tiết</Divider>
            <Table
                dataSource={orderDetailList}
                columns={columns}
                // loading={{
                //     spinning: loading,
                //     indicator: <LoadingCustom />,
                // }}
                rowKey="id"
                // pagination={createPaginationConfig(pagination, setPagination)}
                expandable={{ childrenColumnName: 'children' }}
            />
        </>
    )
}

export default ListOrderDetail