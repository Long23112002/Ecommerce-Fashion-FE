import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, UploadFile, Upload } from 'antd';
import { Size } from "../../pages/Admin/Attributes/size/size";
import { Color } from "../../pages/Admin/Attributes/color/color";
import ProductDetail from "../../types/ProductDetail";
import Product from "../../types/Product";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";
import { uploadOneImage } from "../../api/ImageApi";

interface UpdateProductDetailModalProps {
    isModalOpen: boolean;
    handleOk: (values: any) => void;
    handleCancel: () => void;
    form: any;
    productDetail: ProductDetail | null;
    sizes: Size[];
    colors: Color[];
    products: Product[];
    fileList: UploadFile[];
    setFileList: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
    handleUpload: (file: RcFile) => Promise<boolean | void>;
    normFile: (e: any) => any[] | undefined;
    onRemove: (file: UploadFile) => boolean;

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
    fileList,
    setFileList,
    normFile,
    onRemove
}) => {

    useEffect(() => {
        if (productDetail) {
            form.setFieldsValue({
                price: productDetail.price,
                quantity: productDetail.quantity,
                idProduct: productDetail.product?.id,
                idSize: productDetail.size?.id,
                idColor: productDetail.color?.id,
                images: productDetail?.images || [],
            });
            setFileList([...productDetail?.images || []])
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

    }, [productDetail])

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

    // const handleUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
    //     let updatedFileList = [...info.fileList];

    //     // Only keep successfully uploaded files
    //     updatedFileList = updatedFileList.map(file => {
    //         if (file.response) {
    //             return {
    //                 ...file,
    //                 url: file.response.url,
    //             };
    //         }
    //         return file;
    //     });

    //     setFileList(updatedFileList);
    // };

    const handleUpload = async (file: RcFile): Promise<boolean | void> => {
        const url = await uploadOneImage(file, productDetail?.id || 0, 'PRODUCT_DETAIL')
        setFileList(prev => [
            ...prev,
            {
                uid: file.uid,
                name: 'PRODUCT_DETAIL',
                status: "done",
                url: url,
            }
        ])
    };

    const onHandle = () => {
        handleCancel()
        setFileList([])
    }

    return (
        <Modal
            title="Update Product Detail"
            visible={isModalOpen}
            onOk={onOk}
            onCancel={onHandle}
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
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    customRequest={({ file }) => handleUpload(file as RcFile)}
                    onRemove={onRemove}
                    showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                    }}
                >
                    <button style={{ border: 0, background: 'none' }} type="button">
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                </Upload>

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
                    <Input size="large" style={{ fontSize: '16px', color: '#000' }} />
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
