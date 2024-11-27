import { Button, Form, Input, Select, Popconfirm, Table, Tag } from 'antd';
import Cookies from "js-cookie";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteDiscount, fetchAllDiscounts } from "../../../api/DiscountApi.ts";
import LoadingCustom from "../../../components/Loading/LoadingCustom.js";
import createPaginationConfig, { PaginationState } from "../../../config/discount/paginationConfig.ts";
import { Discount, StatusDiscount, StatusDiscountLable, TypeDiscount, TypeDiscountLabel } from "../../../types/discount.ts";
import { getErrorMessage } from "../../Error/getErrorMessage.ts";
import { useNavigate } from 'react-router-dom';
import { getAllProductDetails } from '../../../api/ProductDetailApi.ts';

const { Option } = Select;

const ManagerDiscount = () => {
    const [loading, setLoading] = useState(true);
    const [productdetails, setProductdetails] = useState<{ id: number; name: string }[]>([]);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });
    const navigate = useNavigate();
    const [filterParams, setFilterParams] = useState({
        page: 0,
        size: 5,
        name: "",
        type: "",
        status: "",
        idProductDetail: "",
        Price: "",
    });

    const fetchDiscountsDebounced = useCallback(
        debounce(async (current: number, pageSize: number, filters: any) => {
            setLoading(true);
            try {
                const response = await fetchAllDiscounts(
                    pageSize,
                    current - 1,
                    filters.name,
                    filters.type,
                    filters.status,
                    Array.isArray(filters.idProductDetail) ? filters.idProductDetail.join(',') : '',
                    filters.Price,

                );
                setDiscounts(response.data);
                setPagination({
                    current: response.metaData.page + 1,
                    pageSize: response.metaData.size,
                    total: response.metaData.total,
                    totalPage: response.metaData.totalPage
                });
            } catch (error) {
                toast.error(getErrorMessage(error))
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    const fetchDiscounts = (current: number, pageSize: number) => {
        fetchDiscountsDebounced(current, pageSize, filterParams);
    };

    const handleFilterChange = (changedValues: any, allValues: any) => {
        setFilterParams({
            ...filterParams,
            ...allValues,
            name: allValues.name || '',
            type: allValues.type || '',
            status: allValues.status || '',
            idProductDetail: Array.isArray(allValues.idProductDetail) ? allValues.idProductDetail : [],
            Price: allValues.Price || '',
        });
        setPagination((prevPagination) => ({
            ...prevPagination,
            current: 1
        }));
    };

    const handleDelete = async (discountId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteDiscount(discountId, token);
                toast.success("Xóa Thành Công");
                refreshDiscounts();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    };

    const refreshDiscounts = () => {
        fetchDiscounts(pagination.current, pagination.pageSize);
    };
    useEffect(() => {
        const fetchProductdetails = async () => {
            try {
                const response = await getAllProductDetails();
                // Chuyển đổi dữ liệu
                const transformedData = response.data.map((item) => ({
                    id: item.id, // ID của ProductDetail
                    name: `${item.product.name} - ${item.color.name} - ${item.size.name}`, // Tên sản phẩm + màu + size
                }));
                setProductdetails(transformedData); // Cập nhật state
            } catch (error) {
                toast.error(getErrorMessage(error));
            }
        };
        fetchProductdetails();
    }, []);
    useEffect(() => {
        fetchDiscounts(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, filterParams]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên phiếu',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Kiểu phiếu',
            dataIndex: 'type',
            key: 'type',
            render: (type: TypeDiscount) => TypeDiscountLabel[type],
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Trạng thái",
            dataIndex: "discountStatus",
            key: "discountStatus",
            render: (status: StatusDiscount) => {
                let color = "default";
                switch (status) {
                    case StatusDiscount.ACTIVE:
                        color = "green";
                        break;
                    case StatusDiscount.ENDED:
                        color = "red";
                        break;
                    case StatusDiscount.UPCOMING:
                        color = "gold";
                        break;
                    default:
                        color = "grey";
                }
                return <Tag color={color}>{StatusDiscountLable[status]}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => navigate(`/admin/discount/${record.id}`)} style={{ marginRight: 8 }} className="btn-outline-primary">
                        <i className="fa-solid fa-eye"></i>
                    </Button>
                    <Button
                        onClick={() => navigate(`/admin/discount/edit/${record.id}`)}
                        style={{ marginRight: 8 }}
                        className="btn-outline-warning"
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa Khuyến mãi này?"
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
            <h1 className="text-danger">Quản Lý Phiếu giảm Giá</h1>
            <Button
                className="mt-3 mb-3"
                style={{ display: 'flex', backgroundColor: 'black', color: 'white' }}
                type="default"
                onClick={() => navigate('/admin/discount/add')}
            >
                <i className="fa-solid fa-circle-plus"></i>
            </Button>
            <Form
                layout="inline"
                onValuesChange={handleFilterChange}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className="mt-2 mb-2"
            >
                <Form.Item name="name" label="Tên Phiếu">
                    <Input placeholder="Tìm kiếm theo tên khuyến mãi" allowClear/>
                </Form.Item>
                <Form.Item name="idProductDetail" label="Tên Sản Phẩm" style={{width:300}}>
                    <Select
                        placeholder="Chọn sản phẩm"
                        allowClear
                        mode="multiple"
                        options={productdetails.map(product => ({
                            value: product.id,
                            label: product.name, // Hiển thị tên sản phẩm
                        }))}
                    />
                </Form.Item>
                <Form.Item name="type" label="Kiểu">
                    <Select placeholder="Chọn kiểu" allowClear>
                        {Object.keys(TypeDiscountLabel).map((key) => (
                            <Option key={key} value={key}>
                                {TypeDiscountLabel[key as TypeDiscount]}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="Price" label="Giá tối thiểu" >
                    <Input placeholder="Nhập giá" type="number"allowClear />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Select placeholder="Chọn trạng thái" allowClear>
                        {Object.keys(StatusDiscountLable).map((key) => (
                            <Option key={key} value={key}>
                                {StatusDiscountLable[key as StatusDiscount]}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Table
                dataSource={discounts}
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

export default ManagerDiscount;
