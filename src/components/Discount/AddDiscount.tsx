import { Button, Form, Input, InputNumber, Select, DatePicker, Table, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createDiscount } from '../../api/DiscountApi';
import { fetchAllProductDetails } from '../../api/BrandApi';
import { TypeDiscount } from '../../types/discount';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import LoadingCustom from '../Loading/LoadingCustom';
import { getErrorMessage } from '../../pages/Error/getErrorMessage';
import createPaginationConfig, { PaginationState } from '../../config/paginationConfig';

const { RangePicker } = DatePicker;

const AddDiscount = () => {
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [discountType, setDiscountType] = useState(TypeDiscount.PERCENTAGE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });

    const loadProductDetails = async (current: number, pageSize: number) => {
        setLoading(true)
        try {
            const response = await fetchAllProductDetails(pageSize, current - 1);
            if (response && response.data) {
                setProductDetails(response.data);
                setPagination({
                    current: response.metaData.page + 1,
                    pageSize: response.metaData.size,
                    total: response.metaData.total,
                    totalPage: response.metaData.totalPage
                })
            } else {
                toast.error("Không có dữ liệu sản phẩm");
            }

        } catch (error) {
            console.log("lỗi" + error)
            toast.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadProductDetails(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const handleDiscountTypeChange = (value: TypeDiscount) => {
        setDiscountType(value);

        if (value === TypeDiscount.FIXED_AMOUNT) {
            form.setFieldsValue({ maxValue: null }); // Set maxValue to null if type is FIXED_AMOUNT
        }
    };
    const handleSubmit = async (values: any) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const { name, condition, type, value, maxValue, dateRange } = values;

            const payload = {
                name,
                condition: {
                    idProductDetail: selectedProductIds,
                    price: condition.price,
                },
                type,
                value,
                maxValue,
                startDate: dayjs(dateRange[0]).valueOf(),
                endDate: dayjs(dateRange[1]).valueOf(),
            };

            const token = Cookies.get("accessToken");
            if (token) {
                const response = await createDiscount(payload, token);
                if (response?.status === 200 || response?.status === 201) {
                    toast.success("Thêm khuyến mãi thành công!");
                    navigate('/admin/discount');
                } else {
                    throw new Error(response?.data?.message || "Không thể thêm khuyến mãi, vui lòng thử lại.")
                }
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            // Hiển thị thông báo lỗi từ API nếu có lỗi xảy ra trong quá trình tạo
            toast.error(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (images: { url: string }[]) => (
                images && images.length > 0 ? (
                    <img src={images[0].url} alt="Product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                ) : null
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: ['product', 'name'],
            key: 'name',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()}₫`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        }
    ];

    const rowSelection = {
        selectedRowKeys: selectedProductIds,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedProductIds(selectedRowKeys as number[]);
            form.setFieldsValue({ 'condition': { 'idProductDetail': selectedRowKeys } });
        },
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <div>
                <h2>Thêm Mới phiếu</h2>
                <Button onClick={() => navigate('/admin/discount')} style={{
                    "position": "relative",
                    "left": "700px",
                    "bottom": "42px",
                }}>
                    <i className="fa-solid fa-reply-all"></i>
                </Button>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    condition: { idProductDetail: [], price: 0 },
                    type: TypeDiscount.PERCENTAGE,
                }}
            >
                <Form.Item
                    name="name"
                    label="Tên khuyến mãi"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi' }]}
                >
                    <Input placeholder="Nhập tên khuyến mãi" />
                </Form.Item>

                <Form.Item label="Điều kiện" required>
                    <Card
                        title="Sản phẩm">

                        <Table

                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={productDetails}
                            rowKey="id"
                            loading={{
                                spinning: loading,
                                indicator: <LoadingCustom />,
                            }}
                            pagination={createPaginationConfig(pagination, setPagination)}
                        />
                    </Card>
                    <Form.Item
                        name={['condition', 'price']}
                        label="Điều Kiện Giá"
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Nhập giá điều kiện"
                            min={0}
                            formatter={value => `${value}₫`}
                            parser={value => value?.replace('₫', '')}
                        />
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Loại khuyến mãi"
                    rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi' }]}
                >
                    <Select onChange={handleDiscountTypeChange} >
                        <Select.Option value={TypeDiscount.PERCENTAGE}>Giảm theo %</Select.Option>
                        <Select.Option value={TypeDiscount.FIXED_AMOUNT}>Giảm theo số tiền</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="value"
                    label="Giá trị khuyến mãi"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị khuyến mãi' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Nhập giá trị khuyến mãi"
                        min={0}
                    />
                </Form.Item>

                <Form.Item
                    name="maxValue"
                    label="mức giảm tối đa"
                    rules={[
                        {
                            required: discountType === TypeDiscount.PERCENTAGE,
                            message: 'Vui lòng nhập giá trị tối đa'
                        }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Nhập giá trị tối đa"
                        min={0}
                        disabled={discountType !== TypeDiscount.PERCENTAGE}
                    />
                </Form.Item>

                <Form.Item
                    name="dateRange"
                    label="Thời gian áp dụng"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng' }]}
                >
                    <RangePicker
                        style={{ width: '100%' }}
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </Form.Item>

                <Form.Item style={{
                    "position": "relative",
                    "left": "650px"
                }}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                        <i className="fa-solid fa-circle-plus"></i>
                    </Button>
                    <Button onClick={() => navigate('/admin/discount')} ><i className="fa-solid fa-ban"></i></Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddDiscount;