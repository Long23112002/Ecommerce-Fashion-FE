import React, { useEffect } from "react";
import { Material } from "../../pages/Admin/Attributes/material/material";
import { Brand } from "../../types/brand";
import { Category } from "../../types/Category";
import { Origin } from "../../types/origin";
import { Modal, Form, Input, Button, Select, UploadFile, Upload } from 'antd';
import { Size } from "../../pages/Admin/Attributes/size/size";
import { Color } from "../../pages/Admin/Attributes/color/color";
import ProductDetail from "../../types/ProductDetail";
import Product from "../../types/Product";
import { Typography } from "@mui/material";

interface UpdateProductDetailModalProps {
    isModalOpen: boolean;
    handleOk: (values: any) => void;
    handleCancel: () => void;
    form: any;
    productDetail: ProductDetail | null;
    sizes: Size[];
    colors: Color[];
    products: Product[];
    fileList: UploadFile[]

}

const UpdateProductDetailModal: React.FC<UpdateProductDetailModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    productDetail,
    sizes,
    colors,
    products,
    fileList
}) => {
    useEffect(() => {
        if (productDetail) {
            form.setFieldsValue({
                price: productDetail.price,
                quantity: productDetail.quantity,
                idProduct: productDetail.product?.id,
                idSize: productDetail.size?.id,
                idColor: productDetail.color?.id,
                fileList: productDetail.images
            });
        }
    }, [productDetail, form])

    const onOk = () => {
        form.validateFields()
            .then((values: any) => {
                console.log('Form values:', values);
                handleOk(values);  // Gọi hàm xử lý với dữ liệu từ form
            })
            .catch((errorInfo: any) => {
                console.error('Validation failed:', errorInfo);
            });
    };

    return (
        <Modal
            title="Update Product Detail"
            visible={isModalOpen}
            onOk={onOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Thoát
                </Button>,
                <Button key="submit" type="primary" onClick={onOk}>
                    Cập Nhật
                </Button>
            ]}
        >
            <Form form={form} layout="vertical"
            >
                <Form.Item label='Danh sách ảnh:' name="images">
                    {/* <Image.PreviewGroup>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {productDetail.images.map((image, index) => (
                <Image
                  key={index}
                  width={80}
                  src={image.url}
                  alt={`Product Image ${index + 1}`}
                  style={{ borderRadius: '5px', cursor: 'pointer' }}
                />
              )
              )}
            </div>
          </Image.PreviewGroup> */}
                    {/* <Upload
                        listType="picture-card"
                        fileList={productDetail.images.map((image) => ({
                            uid: image.url,
                            name: image.url,
                            status: 'done',
                            url: image.url,
                        }))}
                        // onRemove={onRemove}
                        showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                        }}
                    /> */}
                </Form.Item>
                <Form.Item
                    name="price"
                    label="Giá Sản Phẩm"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập giá bán",
                        },
                        {
                            type: "number",
                            min: 1,
                            message: "Giá phải lớn hơn 0",
                            transform: (value) => Number(value),
                        },
                    ]}
                >
                    <Input placeholder="Enter product detail price" />
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Số lượng"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập số lượng",
                        },
                        {
                            type: "number",
                            min: 1,
                            message: "Số lượng phải lớn hơn 0",
                            transform: (value) => Number(value),
                        },
                    ]}
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item
                    name="idProduct"
                    label="Sản Phẩm"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn sản phẩm",
                        },
                    ]}
                >
                    <Select
                        placeholder="Select product"
                        allowClear
                    >
                        {products.map(product => (
                            <Select.Option key={product.id} value={product.id}>
                                {product.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="idColor"
                    label="Màu sắc"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn màu sắc",
                        },
                    ]}
                >
                    <Select
                        placeholder="Select color"
                        allowClear
                    >
                        {colors.map(color => (
                            <Select.Option key={color.id} value={color.id}>
                                {color.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="idSize"
                    label="Kích cỡ"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn kích cỡ",
                        },
                    ]}
                >
                    <Select
                        placeholder="Select size"
                        allowClear
                    >
                        {sizes.map(size => (
                            <Select.Option key={size.id} value={size.id}>
                                {size.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default UpdateProductDetailModal