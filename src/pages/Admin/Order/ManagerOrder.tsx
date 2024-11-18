import { Button, Form, Select, Popconfirm, Table, Tag, Tabs } from 'antd';
import Cookies from "js-cookie";
import { debounce } from "lodash";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteOrder, fetchAllOrders, updateStateOrder, getOrderById } from "../../../api/OrderApi.ts";
import LoadingCustom from "../../../components/Loading/LoadingCustom.js";
import createPaginationConfig, { PaginationState } from "../../../config/paginationConfig.ts";
import { Order, OrderStatus, OrderStatusLabel } from "../../../types/order.ts";
import { getErrorMessage } from "../../Error/getErrorMessage.ts";
import { useNavigate } from 'react-router-dom';
import { TabPane } from 'react-bootstrap';
const { Option } = Select;

const ManagerOrder = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // const [editingBrand, setEditingOrder] = useState<Order | null>(null);

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });
    const [filterParams, setFilterParams] = useState({
        page: 0,
        size: 5,
        userName: "",
        startDate: "",
        endDate: "",
        status: ""
    });

    const fetchOrdersDebounced = useCallback(
        debounce(async (current: number, pageSize: number, filters: any) => {
            setLoading(true);
            try {
                const params = {
                    userId: filters.userName || undefined,
                    status: filters.status || undefined,
                    phoneNumber: filters.phoneNumber || undefined,
                    keyword: filters.keyword || undefined
                };
                const response = await fetchAllOrders(params, current - 1, pageSize);
                const { page, size, total, totalPage } = response.metadata;
                if (page >= totalPage && totalPage > 0) {
                    setPagination((prev) => ({ ...prev, current: totalPage }));
                } else {
                    setPagination({
                        current: page + 1,
                        pageSize: size,
                        total,
                        totalPage
                    });
                }
                setOrders(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    const fetchOrders = (current: number, pageSize: number) => {
        fetchOrdersDebounced(current, pageSize, filterParams);
    };
    const handleStatusChange = async (orderId: number, newStatus: string) => {
        setLoading(true);
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await updateStateOrder(orderId, { status: newStatus });
                toast.success("Cập nhật trạng thái thành công");
                refreshOrders();
            } else {
                toast.error("Xác thực thất bại");
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (changedValues: any, allValues: any) => {
        setFilterParams({
            ...filterParams,
            userName: allValues.userName || '',
            startDate: allValues.startDate ? allValues.startDate.format("YYYY-MM-DD") : '',
            endDate: allValues.endDate ? allValues.endDate.format("YYYY-MM-DD") : '',
            status: allValues.status || ''
        });
        setPagination((prevPagination) => ({
            ...prevPagination,
            current: 1
        }));
    };


    const handleDelete = async (orderId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteOrder(orderId, token);
                toast.success("Xóa đơn hàng thành công");
                refreshOrders();
            } else {
                toast.error("Xác thực thất bại");
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    };

    const refreshOrders = () => {
        fetchOrders(pagination.current, pagination.pageSize);
    };

    useEffect(() => {
        fetchOrders(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, filterParams]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'user',
            key: 'user',
            render: (user) => user.fullName,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                let color = "default";
                switch (status) {
                    case OrderStatus.PENDING:
                        color = "yellow";
                        break;
                    case OrderStatus.SHIPPING:
                        color = "blue";
                        break;
                    case OrderStatus.CANCEL:
                        color = "red";
                        break;
                    case OrderStatus.SUCCESS:
                        color = "green";
                        break;
                    case OrderStatus.DRAFT:
                        color = "#FF9933";
                        break;
                    case OrderStatus.REFUND:
                        color = "grey";
                        break;
                    case OrderStatus.PENDING_AT_STORE:
                        color = "Navy";
                        break;
                    default:
                        color = "grey";
                }

                const isStatusSuccess = status === OrderStatus.SUCCESS;

                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Select
                            value={status}
                            onChange={async (newStatus) => {
                                if (!isStatusSuccess) {
                                    await handleStatusChange(record.id, newStatus);
                                }
                            }}
                            style={{ width: 140 }}
                            disabled={isStatusSuccess}
                        >
                            {Object.keys(OrderStatusLabel).map((key) => (
                                <Option key={key} value={key} >
                                    <Tag color={key === status ? color : "default"} style={{ marginRight: 10 }}>
                                        {OrderStatusLabel[key as OrderStatus] || "Không xác định"}
                                    </Tag>
                                </Option>
                            ))}
                        </Select>
                    </div>
                );
            },

        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (paymentMethod) => paymentMethod,
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex: 'address',
            key: 'address',
            render: (address) => {
                if (!address) return 'Không rõ';

                const {
                    provinceName,
                    districtName,
                    wardName,
                    specificAddress,
                } = address;

                const displayAddress = [
                    specificAddress || 'Không rõ',
                    wardName || 'Không rõ',
                    districtName || 'Không rõ',
                    provinceName || 'Không rõ',
                ].join(', ');

                return displayAddress;
            }
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => navigate(`/admin/order/${record.id}`)} style={{ marginRight: 8 }} className="btn-outline-primary">
                        <i className="fa-regular fa-eye"></i>
                    </Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa đơn hàng này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button className="btn-outline-danger">
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                    </Popconfirm>

                </div>
            ),
        }
    ];

    return (
        <div className="text-center" style={{ marginLeft: 20, marginRight: 20 }}>
            <h1 className="text-danger">Quản Lý Đơn Hàng</h1>
            <Tabs
                activeKey={filterParams.status || "ALL"}
                onChange={(key) => {
                    setFilterParams({
                        ...filterParams,
                        status: key === "ALL" ? "" : key,
                    });
                    setPagination((prev) => ({ ...prev, current: 1 }));
                }}
                style={{
                    marginBottom: 16,
                    fontWeight: "bold",
                }}
                tabBarStyle={{
                    display: "flex",
                    justifyContent: "space-between", // Căn đều các tab, mỗi tab chiếm không gian đều
                    fontSize: "20px", // Cỡ chữ cho tab
                    fontWeight: "bold",
                    width: "100%", // Đảm bảo tabBar chiếm toàn bộ chiều ngang
                }}
            >
                <TabPane
                    tab={
                        <div
                            style={{
                                textAlign: "center", 
                                width: "100%", 
                                fontSize: "20px", 
                                
                            }}
                        >
                            Tất cả
                        </div>
                    }
                    key="ALL"
                />
                {Object.keys(OrderStatusLabel)
                    .filter((key) => key !== OrderStatus.DRAFT)
                    .map((key) => (
                        <TabPane
                            tab={
                                <div
                                    style={{
                                        textAlign: "center",
                                        width: "100%",
                                        fontSize: "20px", // Thử thay đổi trực tiếp ở đây
                                    }}
                                >
                                    {OrderStatusLabel[key as OrderStatus]}
                                </div>
                            }
                            key={key}
                        />
                    ))}
            </Tabs>
            <Table
                dataSource={orders}
                columns={columns}
                loading={{
                    spinning: loading,
                    indicator: <LoadingCustom />,
                }}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
            />
        </div>
    );
};

export default ManagerOrder;
