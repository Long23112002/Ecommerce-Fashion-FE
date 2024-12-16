import { Button, Form, FormInstance, Input, message, Modal } from "antd";
import React from "react";

interface AddQuantityModalProps {
    isModalOpen: boolean;
    handleOk: (values: any) => void;
    handleCancel: () => void;
    form: FormInstance;

}
const AddQuantityModal: React.FC<AddQuantityModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form
}) => {

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();
            // Gọi handleOk và đợi phản hồi từ backend
            await handleOk(values);

            // Nếu thành công, reset form và đóng modal
            // form.resetFields();
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
            title="Nhập số lượng sản phẩm"
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
                    Đồng ý
                </Button>
            ]}
        >
            
        </Modal>
    )
}

export default AddQuantityModal