import { Button, Col, Form, FormInstance, Input, message, Modal, Row, Select, Upload } from 'antd'
import { Size } from '../../pages/Admin/Attributes/size/size';
import { Color } from '../../pages/Admin/Attributes/color/color';
import { PlusOutlined } from '@ant-design/icons';

interface AddProductDetailModalProps {
    isModalOpen: boolean,
    handleOk: (values: any) => void;
    handleCancel: () => void;
    handleUploadChange: (values: any) => void;
    form: FormInstance;
    sizes: Size[];
    colors: Color[];
    urls: any;
}

const AddProductDetailModal: React.FC<AddProductDetailModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    handleUploadChange,
    form,
    sizes,
    colors,
    urls
}) => {

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();
            // Gọi handleOk và đợi phản hồi từ backend
            await handleOk(values);

            // Nếu thành công, reset form và đóng modal
            form.resetFields();
            handleCancel();
        } catch (error: any) {
            // Xử lý khi validation thất bại
            if (error instanceof Error) {
                message.error(error.message || "Đã có lỗi xảy ra.");
            } else if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Đã có lỗi xảy ra.";
                message.error(errorMessage);
            } else {
                console.error("Validation failed:", error);
            }
        }
    };

    return (
        <Modal
            title="Thêm chi tiết sản phẩm"
            visible={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={onSubmit}
                >
                    Thêm
                </Button>
            ]}
        >
            <Form form={form} layout="vertical"
                style={{
                    margin: '10px',
                    border: '1px solid #d9d9d9',
                    padding: '24px',
                    // textAlign: 'left'
                }}
            >
                <Form.Item
                    name="price"
                    label="Giá bán"
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
                    <Input placeholder="Nhập số lượng" />
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
                    <Input placeholder="Nhập số lượng" />
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
                
                {/* <Form.Item label="Hình ảnh" valuePropName="images" getValueFromEvent={urls} >
                    <Upload
                        listType="picture-card"
                        onChange={handleUploadChange}
                    >
                        <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item> */}
            </Form>
        </Modal>
    )
}

export default AddProductDetailModal