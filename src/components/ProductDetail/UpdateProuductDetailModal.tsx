import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, UploadFile, Upload } from 'antd';
import { Size } from "../../pages/Admin/Attributes/size/size";
import { Color } from "../../pages/Admin/Attributes/color/color";
import ProductDetail from "../../types/ProductDetail";
import Product from "../../types/Product";
import { UploadOutlined } from "@ant-design/icons";

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
    fileList: initialFileList
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>(initialFileList);

    useEffect(() => {
        if (productDetail) {
            form.setFieldsValue({
                price: productDetail.price,
                quantity: productDetail.quantity,
                idProduct: productDetail.product?.id,
                idSize: productDetail.size?.id,
                idColor: productDetail.color?.id,
                images: productDetail.images ? [{ url: productDetail.images }] : [],
            });
            console.log(productDetail.images);

            // setFileList(
            //     productDetail.images
            //       ? JSON.parse(productDetail.images).map((image: { url: string }, index: number) => ({
            //           url: image.url,
            //           uid: `${index}`, 
            //           name: `Image ${index + 1}`, 
            //           status: 'done', 
            //         }))
            //       : []
            //   );
        }

    }, [productDetail, form])

    const onOk = () => {
        form.validateFields()
            .then((values: any) => {
                console.log('Form values:', values);
                handleOk(values);
            })
            .catch((errorInfo: any) => {
                console.error('Validation failed:', errorInfo);
            });
    };

    const handleUploadChange = (info: any) => {
        let updatedFileList = [...info.fileList];

        // Only keep successfully uploaded files
        updatedFileList = updatedFileList.map(file => {
            if (file.response) {
                return {
                    ...file,
                    url: file.response.url,
                };
            }
            return file;
        });

        setFileList(updatedFileList);
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
                <Form.Item label="Danh sách ảnh:" name="images">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        action="/upload"
                        showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                        }}
                    >
                        {fileList.length < 5 && (
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        )}
                    </Upload>
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