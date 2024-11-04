import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, message } from 'antd';
import { createDiscount, updateDiscount } from '../../api/DiscountApi';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DiscountModel = ({ visible, onClose, discountData, onSave }) => {
    const [form] = Form.useForm();
    const isEditing = !!discountData;

    useEffect(() => {
        if (isEditing) {
            form.setFieldsValue({
                ...discountData,
                dateRange: [discountData.startDate, discountData.endDate],
            });
        } else {
            form.resetFields();
        }
    }, [discountData, visible]);

    const handleSubmit = async (values) => {
        const { dateRange, ...rest } = values;
        const payload = {
            ...rest,
            startDate: dateRange[0],
            endDate: dateRange[1],
        };

        try {
            if (isEditing) {
                await updateDiscount(discountData.id, payload);
                message.success('Cập nhật khuyến mãi thành công!');
            } else {
                await createDiscount(payload);
                message.success('Tạo khuyến mãi mới thành công!');
            }
            onSave();
            onClose();
        } catch (error) {
            message.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <Modal
            title={isEditing ? 'Cập nhật khuyến mãi' : 'Tạo khuyến mãi mới'}
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Mã khuyến mãi"
                    name="code"
                    rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Loại khuyến mãi"
                    name="type"
                    rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi!' }]}
                >
                    <Select>
                        <Option value="percentage">Phần trăm</Option>
                        <Option value="fixed">Cố định</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Giá trị khuyến mãi"
                    name="value"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị khuyến mãi!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Giá trị tối đa" name="maxValue">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Thời gian khuyến mãi"
                    name="dateRange"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian khuyến mãi!' }]}
                >
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select>
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Không hoạt động</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                        {isEditing ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                    <Button onClick={onClose}>Hủy</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DiscountModel;
