import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, FormInstance, message } from 'antd';
import { Category } from '../../types/Category';

interface AddCategoryModalProps {
    isModalOpen: boolean;
    handleOk: (values: any) => Promise<void>; // Đảm bảo handleOk trả về Promise
    handleCancel: () => void;
    form: FormInstance; // Ant Design form instance
    parentCategories: Category[]; // Danh sách danh mục cha cho Select
    existingCategorys: Category[];
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    parentCategories,
    existingCategorys = [],
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const checkDuplicateName = (name: string, excludeName: string = "") => {
        return existingCategorys.some((item) => item.name === name && item.name !== excludeName);
    };

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (checkDuplicateName(values.name)) {
                message.error("Tên đã tồn tại! Vui lòng chọn tên khác.");
                return;
            }
            setIsSubmitting(true);
            
            // Gọi handleOk và đợi phản hồi từ backend
            await handleOk(values); 

            // Nếu thành công, reset form và đóng modal
            form.resetFields();
            handleCancel();
        } catch (error: any) {
            // Xử lý khi validation thất bại
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Đã có lỗi xảy ra.";
                message.error(errorMessage);
            } else {
                console.error("Validation failed:", error);
            }
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title="Thêm Danh Mục"
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
                    loading={isSubmitting} // Vô hiệu hóa nút khi đang gửi
                >
                    Thêm
                </Button>
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Tên Danh Mục"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên danh mục' },
                        { max: 50, message: "Tên phải ít hơn 50 ký tự" }
                    ]}
                >
                    <Input placeholder="Nhập tên danh mục" />
                </Form.Item>
                <Form.Item
                    name="parentId"
                    label="Danh Mục Cha"
                >
                    <Select placeholder="Chọn danh mục cha">
                        {parentCategories.map(category => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCategoryModal;
