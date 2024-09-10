import React from "react";
import { Modal, Form, Input, Select, InputNumber, DatePicker, FormInstance } from "antd";
import { Discount } from "../../types/discount";
import { TypeDiscount, StatusDiscount, createDiscount } from "../../api/DiscountApi";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const { Option } = Select;

interface AddDiscountModalProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: FormInstance;
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form
}) => {
    const handleAddClick = async () => {
        const token = Cookies.get("accessToken");
        if (!token) {
            toast.error("Authorization failed");
            return;
        }

        try {
            const values = await form.validateFields();
            console.log('Form values:', values); // In ra giá trị form

            // Kiểm tra dữ liệu điều kiện
            const condition = values.condition || {};
            console.log('Condition:', condition);

            if (!condition.productId || !condition.brandId || !condition.categoryId || !condition.productDetailId) {
                toast.error('All condition fields are required');
                return;
            }

            await createDiscount(values, token);
            toast.success('Discount added successfully');
            handleCancel();
            // Refresh discounts if needed
            // refreshDiscounts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add discount');
        }
    };

    return (
        <Modal
            title="Add Discount"
            visible={isModalOpen}
            onOk={handleAddClick}
            onCancel={handleCancel}
            okText="Add"
            cancelText="Cancel"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    startDate: undefined,
                    endDate: undefined,
                    condition: {
                        productId: undefined,
                        brandId: undefined,
                        categoryId: undefined,
                        productDetailId: undefined
                    }
                }}
            >
                {/* Name field */}
                <Form.Item
                    label="Discount Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the discount name" }]}
                >
                    <Input />
                </Form.Item>

                {/* Type field */}
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

                {/* Value field */}
                <Form.Item
                    label="Value"
                    name="value"
                    rules={[{ required: true, message: "Please enter the discount value" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                {/* Max Value field */}
                <Form.Item
                    label="Maximum Value"
                    name="maxValue"
                    rules={[{ required: true, message: "Please enter the maximum discount value" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                {/* Status field */}
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

                {/* Start Date field */}
                <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: "Please select the start date" }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                {/* End Date field */}
                <Form.Item
                    label="End Date"
                    name="endDate"
                    rules={[{ required: true, message: "Please select the end date" }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                {/* Condition fields */}
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

export default AddDiscountModal;
