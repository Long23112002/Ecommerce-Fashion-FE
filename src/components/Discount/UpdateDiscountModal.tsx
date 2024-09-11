import React from "react";
import { Modal, Form, Input, Select, InputNumber, DatePicker, FormInstance } from "antd";
import { Discount } from "../../types/discount.ts";
import { TypeDiscount, StatusDiscount, updateDiscount } from "../../api/DiscountApi";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const { Option } = Select;

interface UpdateDiscountModalProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: FormInstance;
    discount: Discount;
}

const UpdateDiscountModal: React.FC<UpdateDiscountModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    discount
}) => {
    const handleOkClick = async () => {
        const token = Cookies.get("accessToken");
        if (!token) {
            toast.error("Authorization failed");
            return;
        }

        try {
            const values = await form.validateFields();

            // Chuyển đổi ngày tháng về dạng timestamp
            values.startDate = values.startDate.valueOf();
            values.endDate = values.endDate.valueOf();

            await updateDiscount(discount.id, values, token);
            toast.success('Discount updated successfully');
            handleCancel();
            // Refresh discounts if needed, assuming a refreshDiscounts function exists
            // refreshDiscounts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update discount');
        }
    };

    return (
        <Modal
            title="Update Discount"
            visible={isModalOpen}
            onOk={handleOkClick}
            onCancel={handleCancel}
            okText="Update"
            cancelText="Cancel"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    name: discount.name,
                    type: discount.type,
                    value: discount.value,
                    maxValue: discount.maxValue,
                    discountStatus: discount.discountStatus,
                    startDate: dayjs(discount.startDate),
                    endDate: dayjs(discount.endDate),
                    productId: discount.condition.productId,
                    brandId: discount.condition.brandId,
                    categoryId: discount.condition.categoryId,
                    productDetailId: discount.condition.productDetailId,
                }}
            >
                {/* Common Fields for Updating a Discount */}
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
                        <Option value={TypeDiscount.PERCENTAGE}>Percentage</Option>
                        <Option value={TypeDiscount.FIXED_AMOUNT}>Fixed Amount</Option>
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
                        <Option value={StatusDiscount.ACTIVE}>Active</Option>
                        <Option value={StatusDiscount.INACTIVE}>Inactive</Option>
                        <Option value={StatusDiscount.EXPIRED}>Expired</Option>
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
                {/* Condition Fields */}
                <Form.Item
                    label="Product ID"
                    name={['condition', 'productId']}
                    rules={[{ required: true, message: "Please enter the product ID" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Brand ID"
                    name={['condition', 'brandId']}
                    rules={[{ required: true, message: "Please enter the brand ID" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Category ID"
                    name={['condition', 'categoryId']}
                    rules={[{ required: true, message: "Please enter the category ID" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Product Detail ID"
                    name={['condition', 'productDetailId']}
                    rules={[{ required: true, message: "Please enter the product detail ID" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateDiscountModal;
