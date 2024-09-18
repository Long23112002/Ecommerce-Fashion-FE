import React from "react";
import { Modal, Form, Input } from "antd";
import { Origin } from "../../types/origin.ts";

interface OriginModelProps {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  form: any;
  mode: "add" | "update";
  origin?: Origin;
}

const OriginModel: React.FC<OriginModelProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  mode,
  origin,
}) => {
  return (
    <Modal
      title={mode === "add" ? "Add New Origin" : "Update Origin"}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={mode === "add" ? "Add" : "Update"}
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={origin ? { name: origin.name } : { name: "" }}
      >
        <Form.Item
          name="name"
          label="Origin Name"
          rules={[
            { required: true, message: "Please input the origin name!" },
            { max: 100, message: "Origin name must be less than 100 characters" },
          ]}
        >
          <Input placeholder="Enter origin name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OriginModel;
