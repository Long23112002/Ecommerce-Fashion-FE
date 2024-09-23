import React, { useState } from "react";
import { Modal, Form, Input, message, FormInstance } from "antd";
import { Origin } from "../../types/origin.ts";

interface OriginModelProps {
  isModalOpen: boolean;
  handleOk: (values: any) => void;
  handleCancel: () => void;
  form: FormInstance;
  mode: "add" | "update";
  origin?: Origin;
  existingOrigins: Origin[]; // Mảng chứa các origin đã tồn tại
}

const OriginModel: React.FC<OriginModelProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  mode,
  origin,
  existingOrigins = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkDuplicateName = (name: string, excludeName: string = "") => {
    return existingOrigins.some((item) => item.name === name && item.name !== excludeName);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const excludeName = mode === "update" ? origin?.name : ""; // Loại trừ tên hiện tại trong chế độ cập nhật
      if (checkDuplicateName(values.name, excludeName)) {
        message.error("Tên đã tồn tại! Vui lòng chọn tên khác.");
        return;
      }
      setIsSubmitting(true);
      handleOk(values); // Thực hiện logic thêm hoặc cập nhật
      setIsSubmitting(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={mode === "add" ? "Thêm Mới Xuất xứ" : "Cập Nhật Xuất xú"}
      open={isModalOpen}
      onOk={onSubmit}
      onCancel={handleCancel}
      okText={mode === "add" ? "Thêm" : "Cập Nhật"}
      cancelText="Thoát"
      confirmLoading={isSubmitting}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={origin ? { name: origin.name } : { name: "" }}
      >
        <Form.Item
          name="name"
          label="Tên xuất xứ"
          rules={[
            { required: true, message: "Vui lòng nhập tên !" },
            { max: 50, message: "Tên  phải ít hơn 50 ký tự" },
          ]}
        >
          <Input placeholder="Enter origin name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OriginModel;
