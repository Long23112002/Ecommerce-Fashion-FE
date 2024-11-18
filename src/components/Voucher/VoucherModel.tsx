import React, { useEffect, useState } from 'react';
import { Modal, Form, Select } from 'antd';
import { Voucher } from '../../types/voucher';
import { FormInstance } from 'antd';
import { getAllDiscount } from '../../api/DiscountApi';
import { Discount } from '../../types/discount';

interface VoucherModelProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: FormInstance;
    mode: 'add' | 'update';
    voucher?: Voucher; // Thêm voucher để nhận dữ liệu cho chế độ update
    discount: Discount;
}

const VoucherModel: React.FC<VoucherModelProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    mode,
    voucher, // Đảm bảo voucher được truyền vào
}) => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);

    // Tải dữ liệu discount khi component mount
    useEffect(() => {
        const loadDiscounts = async () => {
            try {
                const response = await getAllDiscount(100, 0); // Lấy 100 discounts từ trang 0
                setDiscounts(response.data);
            } catch (error) {
                console.error('Failed to fetch discounts', error);
            }
        };
        loadDiscounts();
    }, []);
    useEffect(() => {
        if (mode === 'update' && voucher) {
            form.setFieldsValue({
                discountId: voucher.discount?.id || '',
            });
        } else if (mode === 'add') {
            form.resetFields();
        }
    }, [voucher, mode, form]);
    return (
        <Modal
            title={mode === 'add' ? 'Add Voucher' : 'Update Voucher'}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={mode === 'add' ? 'Create' : 'Update'}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    discountId: voucher?.discount?.id || '', // Dùng voucher nếu có
                }}
            >
                <Form.Item
                    label="Discount"
                    name="discountId"
                    rules={[{ required: true, message: 'Please select a discount' }]}
                >
                    <Select placeholder="Select a discount">
                        {discounts.map((discount) => (
                            <Select.Option key={discount.id} value={discount.id}>
                                {discount.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VoucherModel;
