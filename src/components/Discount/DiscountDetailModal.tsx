import React, { useEffect, useState } from "react";
import { Form, Input, Avatar, Typography, Table, Row, Col } from 'antd';
import { Discount } from '../../types/discount.js';
import ProductDetail from '../../types/ProductDetail.js'
import { getDiscountById } from "../../api/DiscountApi.ts";
import { fetchProductDetailsByIds } from "../../api/BrandApi.ts";
import { useParams } from "react-router-dom";
import LoadingCustom from "../../components/Loading/LoadingCustom.js";
import { getErrorMessage } from "../../pages/Error/getErrorMessage.ts";
import { toast } from "react-toastify";
const { Text } = Typography;

const DiscountDetailModal: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const { discountId } = useParams<{ discountId: string }>();
    const [discount, setDiscount] = useState<Discount | null>(null);
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
    useEffect(() => {
        const fetchDiscountDetails = async () => {
            // let combinedProducts: Product[] = [];
            setLoading(true);
            try {
                const parsedDiscountId = Number(discountId);
                if (isNaN(parsedDiscountId)) {
                    console.error("Invalid discount ID:", discountId);
                    return;
                }
                const discountData = await getDiscountById(parsedDiscountId);
                setDiscount(discountData);

                if (discountData) {
                    if (discountData.condition.idProductDetail.length > 0) {
                        const productdetails = await fetchProductDetailsByIds(discountData.condition.idProductDetail);
                        setProductDetails(productdetails);
                        // setPagination(
                        //     {
                        //         current: productdetails.metaData.page + 1,
                        //         pageSize: productdetails.metaData.size,
                        //         total: productdetails.metaData.total,
                        //         totalPage: response.metaData.totalPage
                        //     }
                        // )
                    }
                }
            } catch (error) {
                toast.error(getErrorMessage(error))
            } finally {
                setLoading(false);
            }
        };
        fetchDiscountDetails();
    }, [discountId]);
    const productDetailColumns = [
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
    if (!discount) {
        return null;
    }
    return (
        <div style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Chi tiết Khuyến Mãi</Text>
                <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 'bold' }}>{discount.name}</div>
            </div>
            <Form
                layout="vertical"
                initialValues={{
                    code: discount.code,
                    type: discount.type,
                    value: discount.value,
                    maxValue: discount.maxValue,
                    startDate: new Date(discount.startDate).toLocaleDateString(),
                    endDate: discount.endDate ? new Date(discount.endDate).toLocaleDateString() : "Không có",
                    status: discount.discountStatus,
                    createAt: new Date(discount.createAt).toLocaleDateString(),
                    updateAt: discount.updateAt ? new Date(discount.updateAt).toLocaleDateString() : "Không có",
                    createBy: discount.createBy?.fullName || "Không rõ",
                    updateBy: discount.updateBy?.fullName || "Chưa cập nhật",
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Mã Khuyến Mãi:</Text>} name="code">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Loại Khuyến Mãi:</Text>} name="type">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Giá Trị:</Text>} name="value">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Giá Trị Tối Đa:</Text>} name="maxValue">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Ngày Bắt Đầu:</Text>} name="startDate">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Ngày Kết Thúc:</Text>} name="endDate">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Trạng Thái:</Text>} name="status">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />

                        </Form.Item>
                    </Col>
                    <Col span={12}></Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Ngày Tạo:</Text>} name="createAt">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Người Tạo:</Text>} name="createBy">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {discount.createBy?.avatar ? (
                                    <Avatar src={discount.createBy.avatar} size={40} style={{ marginRight: 10 }} />
                                ) : (
                                    <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                                )}
                                {<Text strong>{discount.createBy?.fullName || 'Không rõ'}</Text>}
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Ngày Cập Nhật:</Text>} name="updateAt">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Người Cập Nhật:</Text>} name="updateBy">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {discount.updateBy?.avatar ? (
                                    <Avatar src={discount.updateBy.avatar} size={40} style={{ marginRight: 10 }} />
                                ) : (
                                    <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                                )}
                                {<Text strong>{discount.updateBy?.fullName || 'Chưa có'}</Text>}
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                <Text strong style={{ fontSize: '28px' }} >Điều Kiện</Text>
            </div>
            <Col span={12}>
                <Form.Item label={<Text strong>Giá Điều Kiện</Text>}>
                    <Input value={discount.condition.price} disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
            </Col>
            <div style={{ marginTop: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Danh sách Sản Phẩm Chi Tiết</Text>
                <Table
                    columns={productDetailColumns}
                    dataSource={productDetails}
                    pagination={{ pageSize: 5 }}
                    loading={{
                        spinning: loading,
                        indicator: <LoadingCustom />,
                    }}
                    rowKey="id"
                />
            </div>
        </div >
    );
};


export default DiscountDetailModal;
