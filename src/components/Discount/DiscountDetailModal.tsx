import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Avatar, Typography, Table } from 'antd';
import { Discount } from '../../types/discount.js';
import Product from '../../types/Product.js'
import ProductDetail from '../../types/ProductDetail.js'
import { Category } from '../../types/Category.js'
import { Brand } from '../../types/brand.js'
import { fetchCategoriesByIds } from "../../api/CategoryApi.ts";
import { fetchBrandsByIds } from "../../api/BrandApi.ts";
import { fetchProductDetailsByIds } from "../../api/BrandApi.ts";
import { fetchProductsByIds } from "../../api/BrandApi.ts";
interface DiscountDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    discount: Discount | null;
}
const { Text } = Typography;

const DiscountDetailModal: React.FC<DiscountDetailModalProps> = ({ visible, onCancel, discount }) => {

    const [categoryDetails, setCategoryDetails] = useState<Category[]>([]);
    const [brandDetails, setBrandDetails] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
    useEffect(() => {
        if (visible && discount) {
            const fetchDetails = async () => {
                if (discount.condition.categoryId.length > 0) {
                    const categories = await fetchCategoriesByIds(discount.condition.categoryId);
                    setCategoryDetails(categories);
                }

                if (discount.condition.brandId.length > 0) {
                    const brands = await fetchBrandsByIds(discount.condition.brandId);
                    setBrandDetails(brands);
                }
                if (discount.condition.productDetailId.length > 0) {
                    const productdetails = await fetchProductDetailsByIds(discount.condition.productDetailId);
                    setProductDetails(productdetails);
                }
                if (discount.condition.productId.length > 0) {
                    const products = await fetchProductsByIds(discount.condition.productId);
                    setProducts(products);
                }
            };

            fetchDetails();
        }
    }, [visible, discount]);
    const productColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    ];
    const productDetailColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên chi tiết sản phẩm', dataIndex: 'price', key: 'price' },
    ];
    const categoryColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên danh mục', dataIndex: 'name', key: 'name' }
    ];
    const brandColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên thương hiệu', dataIndex: 'name', key: 'name' }
    ];
    if (!discount) {
        return null;
    }
    return (
        <Modal
            title={
                <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '18px' }}>Chi tiết Khuyến Mãi</Text>
                    <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 'bold' }}>{discount.name}</div>
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={900}
            bodyStyle={{ padding: '24px', fontSize: '16px' }}
        >
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
                <Form.Item label={<Text strong>Mã Khuyến Mãi:</Text>} name="code">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Loại Khuyến Mãi:</Text>} name="type">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Giá Trị:</Text>} name="value">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Giá Trị Tối Đa:</Text>} name="maxValue">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Ngày Bắt Đầu:</Text>} name="startDate">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Ngày Kết Thúc:</Text>} name="endDate">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Trạng Thái:</Text>} name="status">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Ngày Tạo:</Text>} name="createAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

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

                <Form.Item label={<Text strong>Ngày Cập Nhật:</Text>} name="updateAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

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
            </Form>
            <div style={{ marginTop: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Danh sách Danh Mục</Text>
                <Table columns={categoryColumns} dataSource={categoryDetails} pagination={false} rowKey="id" />
            </div>
            <div style={{ marginTop: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Danh sách Thương Hiệu</Text>
                <Table columns={brandColumns} dataSource={brandDetails} pagination={false} rowKey="id" />
            </div>
            <div style={{ marginTop: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Danh sách Sản Phẩm Chi Tiết</Text>
                <Table columns={productDetailColumns} dataSource={productDetails} pagination={false} rowKey="id" />
            </div>

            <div style={{ marginTop: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Danh sách Sản Phẩm</Text>
                <Table columns={productColumns} dataSource={products} pagination={false} rowKey="id" />
            </div>
        </Modal>
    );
};

export default DiscountDetailModal;
