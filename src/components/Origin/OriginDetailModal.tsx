import React from "react";
import { Modal, Descriptions } from 'antd';
import { Origin } from '../../types/origin';

interface OriginDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    origin: Origin | null;
}

const OriginDetailModal: React.FC<OriginDetailModalProps> = ({ visible, onCancel, origin }) => {
    if (!origin) return null;

    return (
        <Modal
            title="Origin Details"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            <Descriptions
                bordered
                size="small"
                column={2}
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ wordBreak: 'break-word' }}
            >
                <Descriptions.Item label="ID">{origin.id}</Descriptions.Item>
                <Descriptions.Item label="Origin Name" span={2}>{origin.name}</Descriptions.Item>
                <Descriptions.Item label="Created At">{new Date(origin.createAt).toLocaleDateString()}</Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {origin.updateAt ? new Date(origin.updateAt).toLocaleDateString() : "Not Updated"}
                </Descriptions.Item>
                <Descriptions.Item label="Created By" span={2}>
                    {origin.createBy?.avatar ? (
                        <img
                            src={origin.createBy.avatar}
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
                    {origin.createBy?.fullName || 'Unknown'}
                </Descriptions.Item>
                <Descriptions.Item label="Updated By" span={2}>
                    {origin.updateBy?.avatar ? (
                        <img
                            src={origin.updateBy.avatar}
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
                    {origin.updateBy?.fullName || "Not Updated"}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default OriginDetailModal;
