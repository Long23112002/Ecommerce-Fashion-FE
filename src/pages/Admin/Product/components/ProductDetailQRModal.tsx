import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, InputNumber, Row, Col, Typography, Image, message, Form, Card } from 'antd';
import { exportQRCode } from "../../../../api/ProductApi";

const { Title, Text } = Typography;

interface Size {
    id: number;
    name: string;
}

interface Color {
    id: number;
    name: string;
    code: string;
}

interface ProductDetail {
    id: number;
    price: number;
    quantity: number;
    images: Image[];
    size: Size;
    color: Color;
}

interface Image {
    url: string;
}

interface Record {
    productDetails: ProductDetail[];
}

interface ProductDetailQRModalProps {
    record: Record | null;
    handleCloseModal: () => void;
    isOpen: boolean;
}

const ProductDetailQRModal: React.FC<ProductDetailQRModalProps> = ({ record, handleCloseModal, isOpen }) => {
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
    const [selectedProductDetail, setSelectedProductDetail] = useState<ProductDetail | null>(null);
    const [quantity, setQuantity] = useState<number>(1);


    useEffect(() => {
        if (record) {
            const details = record.productDetails;
            setProductDetails(details);


            if (details.length > 0) {
                setSelectedProductDetail(details[0]);
                setQuantity(1);
            } else {
                setSelectedProductDetail(null);
            }
        }
    }, [record]);

    const handleProductDetailChange = (value: number) => {
        const selectedDetail = productDetails.find(detail => detail.id === value) || null;
        setSelectedProductDetail(selectedDetail);
    };

    // Handle quantity change with validation
    const handleQuantityChange: any = (value: number) => {
        if (value < 1 || value > 1000) {
            message.error('Số lượng phải nằm trong khoảng từ 1 đến 1000!');
            return;
        }
        setQuantity(value);
    };

    const handleDownloadQR = () => {
        if (selectedProductDetail) {
            exportQRCode(selectedProductDetail.id, quantity);
            handleCloseModal();
        } else {
            message.error('Vui lòng chọn chi tiết sản phẩm!');
        }
    };

    return (
        <Modal
            title="Xuất QR cho sản phẩm"
            visible={isOpen}
            onCancel={handleCloseModal}
            footer={[
                <Button key="cancel" onClick={handleCloseModal} style={{ width: 100 }}>
                    Đóng
                </Button>,
                <Button
                    key="download"
                    type="primary"
                    onClick={handleDownloadQR}
                    style={{ width: 150 }}
                    disabled={!selectedProductDetail}
                >
                    Tải mã QR
                </Button>,
            ]}
            width={700}
            destroyOnClose
            centered
        >
            <Form layout="vertical">
                <div>
                    <Title level={4}>Chọn chi tiết sản phẩm</Title>
                    <Form.Item
                        name="productDetail"
                        label="Size & Màu"
                        style={{ marginBottom: 16 }}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn một chi tiết sản phẩm!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn size và màu"
                            onChange={handleProductDetailChange}
                            value={selectedProductDetail?.id}
                            style={{ width: '100%' }}
                        >
                            {productDetails.map(detail => (
                                <Select.Option key={detail.id} value={detail.id}>
                                    {detail.size.name} - {detail.color.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedProductDetail ? (
                        <Card bordered={false} style={{ marginTop: 20 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Title level={5}>Thông tin chi tiết</Title>
                                    <Text strong>Size:</Text> {selectedProductDetail.size.name}<br />
                                    <Text strong>Màu sắc:</Text> {selectedProductDetail.color.name}<br />
                                    <Text strong>Số lượng còn lại:</Text> {selectedProductDetail.quantity}<br />
                                    <Text strong>Giá:</Text> {selectedProductDetail.price.toLocaleString()} VND<br />
                                </Col>
                                <Col span={12}>
                                    <Title level={5}>Hình ảnh sản phẩm</Title>
                                    {selectedProductDetail.images && selectedProductDetail.images.length > 0 ? (
                                        <Image
                                            width={200}
                                            src={selectedProductDetail.images[0].url}
                                            alt="Product Image"
                                            style={{
                                                borderRadius: 8,
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                marginTop: 10,
                                            }}
                                        />
                                    ) : (
                                        <Text>Chưa có hình ảnh cho sản phẩm này.</Text>
                                    )}
                                </Col>
                            </Row>

                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col span={12}>
                                    <Form.Item
                                        name="quantity"
                                        label="Số lượng"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <InputNumber
                                            min={1}
                                            max={1000}
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            style={{ width: '100%' }}
                                            placeholder="Số lượng"
                                            disabled={!selectedProductDetail}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    ) : (
                        <Text strong>Không có chi tiết sản phẩm để hiển thị.</Text>
                    )}
                </div>
            </Form>
        </Modal>
    );
};

export default ProductDetailQRModal;
