import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Select, FormInstance, message } from 'antd';
import { Discount } from '../../types/discount';

interface DiscountModelProps {
    isModalOpen: boolean;
    handleOk: (values: any) => void;
    handleCancel: () => void;
    form: FormInstance;
    mode: 'add' | 'update';
    discount?: Discount;
    existingDiscounts: Discount[];
}

const { RangePicker } = DatePicker;
const { Option } = Select;

const DiscountModel: React.FC<DiscountModelProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    mode,
    discount,
    existingDiscounts = [],
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const checkDuplicateName = (name: string, excludeName: string = "") => {
        return existingDiscounts.some((item) => item.name === name && item.name !== excludeName);
    };

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();
            const excludeName = mode === "update" ? discount?.name : "";
            if (checkDuplicateName(values.name, excludeName)) {
                message.error("Tên đã tồn tại! Vui lòng chọn tên khác.");
                return;
            }
            setIsSubmitting(true);
            handleOk(values);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    return (
        <Modal
            title={mode === 'add' ? 'Thêm Giảm Giá' : 'Chỉnh Sửa Giảm Giá'}
            visible={isModalOpen}
            onOk={onSubmit}
            onCancel={handleCancel}
            okText={mode === "add" ? "Add" : "Update"}
            cancelText="Cancel"
            confirmLoading={isSubmitting}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    name: discount?.name || "",
                    condition: discount?.condition || {},
                    type: discount?.type || "PERCENTAGE",
                    value: discount?.value || 0,
                    maxValue: discount?.maxValue || 0,
                    startDate: discount?.startDate,
                    endDate: discount?.endDate,
                    discountStatus: discount?.discountStatus || "ACTIVE"
                }}
            >
                <Form.Item
                    name="name"
                    label="Tên Giảm Giá"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên!' },
                        { max: 50, message: 'Tên phải ít hơn 50 ký tự' }
                    ]}
                >
                    <Input placeholder="Enter discount name" />
                </Form.Item>
                <Form.Item
                    name="condition"
                    label="Điều kiện"
                    rules={[{ required: true, message: 'Vui lòng nhập điều kiện!' }]}
                >
                    <Input.TextArea placeholder="Enter conditions as JSON format" />
                </Form.Item>
                <Form.Item
                    name="type"
                    label="Loại Giảm Giá"
                    rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                >
                    <Select placeholder="Select discount type">
                        <Option value="PERCENTAGE">Phần %</Option>
                        <Option value="FIXED_AMOUNT">Số thực</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="value"
                    label="Giá Trị Giảm Giá"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm!' }]}
                >
                    <InputNumber placeholder="Enter discount value" min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="maxValue"
                    label="Giá Trị Tối Đa"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị tối đa!' }]}
                >
                    <InputNumber placeholder="Enter max discount value" min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="dateRange"
                    label="Thời Gian Áp Dụng"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}
                >
                    <RangePicker showTime />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DiscountModel;
