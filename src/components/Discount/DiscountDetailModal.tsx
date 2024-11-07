import React, { useEffect, useState } from "react";
import { Form, Input, Avatar, Typography, Table, Row, Col } from 'antd';
import { Discount } from '../../types/discount.js';
import Product from '../../types/Product.js'
import ProductDetail from '../../types/ProductDetail.js'
import { Category } from '../../types/Category.js'
import { Brand } from '../../types/brand.js'
import { getDiscountById } from "../../api/DiscountApi.ts";
import { fetchCategoriesByIds } from "../../api/CategoryApi.ts";
import { fetchBrandsByIds } from "../../api/BrandApi.ts";
import { fetchProductDetailsByIds } from "../../api/BrandApi.ts";
import { fetchProductsByIds } from "../../api/BrandApi.ts";
// import { fetchProductsByCategoryBrandOrIds } from "../../api/BrandApi.ts";
import { useParams } from "react-router-dom";

const { Text } = Typography;

const DiscountDetailModal: React.FC = () => {
    const { discountId } = useParams<{ discountId: string }>();
    const [discount, setDiscount] = useState<Discount | null>(null);
    const [categoryDetails, setCategoryDetails] = useState<Category[]>([]);
    const [brandDetails, setBrandDetails] = useState<Brand[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
    useEffect(() => {
        const fetchDiscountDetails = async () => {
            // let combinedProducts: Product[] = [];
            const parsedDiscountId = Number(discountId);
            if (isNaN(parsedDiscountId)) {
                console.error("Invalid discount ID:", discountId);
                return;
            }
            const discountData = await getDiscountById(parsedDiscountId);
            setDiscount(discountData);

            if (discountData) {
                if (discountData.condition.idCategory.length > 0) {
                    const categories = await fetchCategoriesByIds(discountData.condition.idCategory);
                    setCategoryDetails(categories);
                }
                if (discountData.condition.idBrand.length > 0) {
                    const brands = await fetchBrandsByIds(discountData.condition.idBrand);
                    setBrandDetails(brands);
                }
                if (discountData.condition.idProductDetail.length > 0) {
                    const productdetails = await fetchProductDetailsByIds(discountData.condition.idProductDetail);
                    setProductDetails(productdetails);
                }

                // let productsByCategoryAndBrand: Product[] = [];
                // if (discountData.condition.idCategory.length > 0 && discountData.condition.idBrand.length > 0) {
                //     productsByCategoryAndBrand = await fetchProductsByCategoryBrandOrIds(discountData.condition.idCategory, discountData.condition.idBrand);
                // }
                // let productsById = [];
                if (discountData.condition.idProduct.length > 0) {
                    const productsById = await fetchProductsByIds(discountData.condition.idProduct);
                    setProducts(productsById);
                }
                // combinedProducts = [...productsByCategoryAndBrand, ...productsById];
                // const uniqueProducts = Array.from(new Set(combinedProducts.map(p => p.id)))
                //     .map(id => combinedProducts.find(p => p.id === id)!);


            }
        };
        fetchDiscountDetails();
    }, [discountId]);
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
            <div style={{ marginTop: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Danh sách Danh Mục</Text>
                <Table columns={categoryColumns} dataSource={categoryDetails} pagination={{ pageSize: 5 }} rowKey="id" />
            </div>
            <div style={{ marginTop: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Danh sách Thương Hiệu</Text>
                <Table columns={brandColumns} dataSource={brandDetails} pagination={{ pageSize: 5 }} rowKey="id" />
            </div>
            <div style={{ marginTop: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Danh sách Sản Phẩm Chi Tiết</Text>
                <Table columns={productDetailColumns} dataSource={productDetails} pagination={{ pageSize: 5 }} rowKey="id" />
            </div>
            <div style={{ marginTop: '20px' }}>
                <Text strong style={{ fontSize: '18px' }}>Danh sách Sản Phẩm</Text>
                <Table columns={productColumns} dataSource={products} pagination={{ pageSize: 5 }} rowKey="id" />
            </div>
        </div >
    );
};


export default DiscountDetailModal;
