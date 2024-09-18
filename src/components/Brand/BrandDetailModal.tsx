import React from "react";
import { Modal, Descriptions } from 'antd';
import { Brand } from '../../types/brand.ts';

interface BrandDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    brand: Brand | null;
}

const BrandDetailModal: React.FC<BrandDetailModalProps> = ({ visible, onCancel, brand }) => {
    if (!brand) return null;

    return (
        <Modal
            title="Brand Details"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={600} // Set a width that works well with your design
        >
            <Descriptions
                bordered
                size="small" // You can adjust size to "middle" or "small" for a more compact design
                column={2} // Adjust columns for a clean look
                labelStyle={{ fontWeight: 'bold' }} // Make labels bold for clarity
                contentStyle={{ wordBreak: 'break-word' }} // Ensure text wraps properly
            >
                <Descriptions.Item label="ID">{brand.id}</Descriptions.Item>
                <Descriptions.Item label="Brand Name" span={2}>{brand.name}</Descriptions.Item>
                <Descriptions.Item label="Created At">{new Date(brand.createAt).toLocaleDateString()}</Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {brand.updateAt ? new Date(brand.updateAt).toLocaleDateString() : "Not Updated"}
                </Descriptions.Item>
                <Descriptions.Item label="Created By" span={2}>
                    {brand.createBy?.avatar ? (
                        <img
                            src={brand.createBy.avatar}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                marginRight: 10,
                            }}
                            alt="Avatar"
                        />
                    ) : (
                        <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#ccc", marginRight: 10 }} />
                    )}
                    {brand.createBy?.fullName || 'Unknown'}
                </Descriptions.Item>
                <Descriptions.Item label="Updated By" span={2}>
                    {brand.updateBy?.avatar ? (
                        <img
                            src={brand.updateBy.avatar}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                marginRight: 10,
                            }}
                            alt="Avatar"
                        />
                    ) : (
                        <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#ccc", marginRight: 10 }} />
                    )}
                    {brand.updateBy?.fullName || "Not Updated"}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default BrandDetailModal;
