import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, DatePicker, FormInstance } from "antd";
import dayjs from "dayjs";
import { Discount } from "../../types/discount";

const { Option } = Select;

interface UpdateDiscountModalProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: FormInstance;
    discount: Discount | null;
}

const UpdateDiscountModal: React.FC<UpdateDiscountModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    discount
}) => {

    // useEffect để set các giá trị form khi dữ liệu discount thay đổi
    useEffect(() => {
        if (discount) {
            console.log("Setting form values with discount data:", discount);
            form.setFieldsValue({
                name: discount.name || "",
                type: discount.type || "",
                value: discount.value || 0,
                maxValue: discount.maxValue || 0,
                discountStatus: discount.discountStatus || "",
                startDate: discount.startDate ? dayjs(discount.startDate) : null,
                endDate: discount.endDate ? dayjs(discount.endDate) : null,
                productId: discount.condition.productId || 0,
                brandId: discount.condition.brandId || 0,
                categoryId: discount.condition.categoryId || 0,
                productDetailId: discount.condition.productDetailId || 0,
            });
        } else {
            form.resetFields(); // Reset form khi không có discount
        }
    }, [discount, form]);  // Chạy lại effect khi discount hoặc form thay đổi

    return (
        <Modal
            title="Update Discount"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Update"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Discount Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the discount name" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: "Please select the discount type" }]}
                >
                    <Select>
                        <Option value="PERCENTAGE">Percentage</Option>
                        <Option value="FIXED_AMOUNT">Fixed Amount</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Value"
                    name="value"
                    rules={[{ required: true, message: "Please enter the discount value" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Maximum Value"
                    name="maxValue"
                    rules={[{ required: true, message: "Please enter the maximum discount value" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="discountStatus"
                    rules={[{ required: true, message: "Please select the discount status" }]}
                >
                    <Select>
                        <Option value="ACTIVE">Active</Option>
                        <Option value="INACTIVE">Inactive</Option>
                        <Option value="EXPIRED">Expired</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: "Please select the start date" }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="End Date"
                    name="endDate"
                    rules={[{ required: true, message: "Please select the end date" }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Product ID"
                    name="productId"
                    rules={[{ required: true, message: "Please enter the product ID" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Brand ID"
                    name="brandId"
                    rules={[{ required: true, message: "Please enter the brand ID" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Category ID"
                    name="categoryId"
                    rules={[{ required: true, message: "Please enter the category ID" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Product Detail ID"
                    name="productDetailId"
                    rules={[{ required: true, message: "Please enter the product detail ID" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateDiscountModal;
