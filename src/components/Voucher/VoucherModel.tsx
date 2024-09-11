import React from 'react';
import { Modal, Form, Input } from 'antd';
import { VoucherResponse } from '../../types/voucher';
import { FormInstance } from 'antd';

interface VoucherModelProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: FormInstance;
    mode: 'add' | 'update';
    voucher?: VoucherResponse;
}

const VoucherModel: React.FC<VoucherModelProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    mode,
    voucher,
}) => {
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
                initialValues={
                    voucher
                        ? {
                            discountId: voucher.discount?.id || '',
                        }
                        : {}
                }
            >
                <Form.Item
                    label="Discount ID"
                    name="discountId"
                    rules={[{ required: true, message: 'Please enter the discount ID' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VoucherModel;
