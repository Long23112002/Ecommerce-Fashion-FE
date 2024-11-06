import React, {useEffect,useState} from 'react';
import { Modal, Form, Input, Select, InputNumber, FormInstance, DatePicker } from 'antd';
import { StatusPromotionEnum, StatusPromotionLable } from '../../enum/StatusPromotionEnum';
import { TypePromotionEnum, TypePromotionLabel } from '../../enum/TypePromotionEnum';
import { Promotion, PromotionRequest } from '../../types/Promotion';
import moment from 'moment';

const PromotionDetailModal: React.FC<{ promotion: Promotion | null; isOpen: boolean; onClose: () => void; }> = ({ promotion, isOpen, onClose }) => {
    const [valueSuffix, setValueSuffix] = useState<string>('');
    useEffect(() => {
        if (promotion) {
            switch (promotion.typePromotionEnum) {
                case TypePromotionEnum.PERCENTAGE_DISCOUNT:
                    setValueSuffix('%');
                    break;
                case TypePromotionEnum.AMOUNT_DISCOUNT:
                    setValueSuffix('VNĐ');
                    break;
                default:
                    setValueSuffix('');
            }
        }
    }, [promotion]);
    
    return (
        <Modal
            title="Chi tiết khuyến mãi"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            style={{ fontWeight: 'bold', fontSize: '16px', color: '#000' }}
        >
            <Form 
            layout="vertical" 
            initialValues={promotion}
            disabled
            >
                <Form.Item 
                name="typePromotionEnum" 
                label="Kiểu khuyến mãi">
                    <Select placeholder="Chọn kiểu khuyến mãi" value={promotion?.typePromotionEnum} readOnly>
                        {Object.entries(TypePromotionEnum).map(([key, value]) => (
                            <Select.Option key={value} value={value}>
                                {TypePromotionLabel[value]}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item 
                name="value" 
                label="Giá trị">
                    <InputNumber 
                    style={{ width: '100%' }} 
                    addonAfter={valueSuffix}/>
                </Form.Item>

                <Form.Item 
                name="startDate" 
                label="Ngày bắt đầu">
                    <DatePicker 
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    />
                </Form.Item>

                <Form.Item 
                name="endDate" 
                label="Ngày kết thúc">
                    <DatePicker 
                    style={{ width: '100%' }} 
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    />
                </Form.Item>

                <Form.Item 
                name="statusPromotionEnum" 
                label="Trạng thái">
                    <Select placeholder="Chọn trạng thái khuyến mãi">
                        {Object.entries(StatusPromotionEnum).map(([key, value]) => (
                            <Select.Option key={value} value={value}>
                                {StatusPromotionLable[value]}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Ngày tạo">
                    <Input value={promotion?.createdAt ? moment(promotion.createdAt).format('YYYY-MM-DD HH:mm:ss') : 'Không có dữ liệu'}/>
                </Form.Item>

                {promotion?.createdBy && (
                    <Form.Item label="Người tạo">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={promotion.createdBy.avatar}
                                alt="Avatar"
                                style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 10 }}
                            />
                            <span>{promotion.createdBy.fullName}</span>
                        </div>
                    </Form.Item>
                )}

                {promotion?.updatedAt && (
                    <Form.Item label="Ngày cập nhật">
                        <Input value={moment(promotion.updatedAt).format('YYYY-MM-DD HH:mm:ss')}/>
                    </Form.Item>
                )}

                {promotion?.updatedBy && (
                    <Form.Item label="Người cập nhật">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={promotion.updatedBy.avatar}
                                alt="Avatar"
                                style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 10 }}
                            />
                            <span>{promotion.updatedBy.fullName}</span>
                        </div>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default PromotionDetailModal;
