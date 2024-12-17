import { Button, Col, Divider, Image, Popconfirm, Row, Table, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import LoadingCustom from '../Loading/LoadingCustom'
import OrderDetail from '../../types/OrderDetail'
import createPaginationConfig from '../../config/paginationConfig';
import { FileImageOutlined } from '@ant-design/icons';
import { TextField } from '@mui/material';
import { updateProductToOrderDetail } from '../../api/StoreApi';
import { toast } from 'react-toastify';
import { getOrderById } from '../../api/OrderApi';
import Order from '../../types/Order';
import { getErrorMessage } from '../../pages/Error/getErrorMessage';

interface InputQuantity {
    inputQuantity: number
}

interface ListOrderDetailProps {
    orderDetailList: OrderDetail[];
    setOrderDetailList: React.Dispatch<React.SetStateAction<OrderDetail[]>>,
    order: Order | null,
    setOrder: React.Dispatch<React.SetStateAction<Order | null>>,
    refreshOrderDetails: () => void,
    handleDelete: (e: any) => void;
    loadingOrderDetailList: boolean,
    showModalUpdateQuantity: (e: any) => void;

}
const ListOrderDetail: React.FC<ListOrderDetailProps> = ({
    orderDetailList,
    setOrderDetailList,
    order,
    setOrder,
    loadingOrderDetailList,
    refreshOrderDetails,
    handleDelete,
    showModalUpdateQuantity
}) => {

    const orderToData = orderDetailList.map(od => { return { ...od, inputQuantity: od.quantity } })

    const [data, setData] = useState<(OrderDetail & InputQuantity)[]>(orderToData)
    const [loading, setLoading] = useState<boolean>(false)
    const orderDetailId = useRef<number | null>()

    useEffect(() => {
        setData(orderToData)
    }, [orderDetailList])

    useEffect(() => {
        setLoading(loadingOrderDetailList)
    }, [loadingOrderDetailList])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(value);
    };

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        record: any
    ) => {
        changeOrderDetail(record.id)
        const { value } = e.target
        const numericValue = parseFloat(value);
        record.inputQuantity = numericValue
        setData(prev => prev.map(od => od.id == record.id ? record : od))
    };

    const handleEnter = async (
        e: React.KeyboardEvent<HTMLDivElement>,
        record: any
    ) => {
        if (e.key === 'Enter') {
            try {
                if (!order) {
                    toast.error("Vui lòng chọn hóa đơn cần thanh toán trước");
                    return
                }
                const token = Cookies.get("accessToken");
                if (!token) {
                    toast.error("Authorization failed");
                    return
                }
                if (isNaN(record.inputQuantity) || record.inputQuantity <= 0) {
                    toast.error("Số lượng không hợp lệ");
                    return
                }
                setLoading(true)
                await updateProductToOrderDetail({ orderDetailId: record.id, quantity: record.inputQuantity })
                console.log(record)
                const response = await getOrderById(order.id);
                setOrder(response)
                await refreshOrderDetails();
            } catch (error) {
                toast.error(getErrorMessage(error));
            } finally {
                setLoading(false)
            }
        }
    };

    const changeOrderDetail = (id: any) => {
        if (orderDetailId.current == id) return
        orderDetailId.current = id
        setData(orderToData)
    }

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
            key: 'quantity',
            render: (_: any, record: any) => (
                <TextField
                    value={record.inputQuantity}
                    size='small'
                    type='number'
                    sx={{ width: 80 }}
                    onClick={() => changeOrderDetail(record.id)}
                    onBlur={() => changeOrderDetail(null)}
                    onChange={(e) => handleChange(e, record)}
                    onKeyDown={(e) => handleEnter(e, record)}
                />
            )
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
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
                dataSource={data}
                columns={columns}
                loading={{
                    spinning: loading,
                    indicator: <LoadingCustom />,
                }}
                rowKey="id"
                // pagination={createPaginationConfig(pagination, setPagination)}
                expandable={{ childrenColumnName: 'children' }}
            />
        </>
    )
}

export default ListOrderDetail