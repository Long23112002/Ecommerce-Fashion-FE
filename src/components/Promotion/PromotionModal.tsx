import React, {useEffect,useState} from 'react';
import { Modal, Form, Input, Select, InputNumber, FormInstance, DatePicker } from 'antd';
import { StatusPromotionEnum, StatusPromotionLable } from '../../enum/StatusPromotionEnum';
import { TypePromotionEnum, TypePromotionLabel } from '../../enum/TypePromotionEnum';
import { Promotion, PromotionRequest } from '../../types/Promotion';
import moment from 'moment';
import dayjs from 'dayjs';

interface PromotionModalProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: FormInstance;
    mode: "add" | "update";
    promotion?: Promotion | null;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ isModalOpen, handleOk, handleCancel, form, mode, promotion }) => {
    const [valueSuffix, setValueSuffix] = useState<string>('');
    useEffect(() => {
        if (mode ==="update" && promotion) {
            const cleanValue = promotion.value ? promotion.value.toString().replace(',', '') : promotion.value;

            form.setFieldsValue({
                ...promotion,
                value: cleanValue,
                startDate: promotion.startDate ? dayjs(promotion.startDate) : null,
                endDate: promotion.endDate ? dayjs(promotion.endDate) : null,
            });

        } else {
            form.resetFields();
        }
    }, [mode,promotion, form]);

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


    const handleValuesChange = (changedValues: any) => {
        if (changedValues.typePromotionEnum) {
            if (changedValues.typePromotionEnum === TypePromotionEnum.PERCENTAGE_DISCOUNT) {
                setValueSuffix('%');
            } else if (changedValues.typePromotionEnum === TypePromotionEnum.AMOUNT_DISCOUNT){
                setValueSuffix('VNĐ');
            }else{
                setValueSuffix('');
            }
        }
    };

    return (
        <Modal
            title={mode === 'add' ? 'Thêm mới đợt giảm giá' : 'Chỉnh sửa đợt giảm giá'}
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleOk}
                initialValues={promotion ? promotion : {}}
                onValuesChange={handleValuesChange}
            >
                <Form.Item
                    name="typePromotionEnum"
                    label="Kiểu khuyến mãi"
                    rules={[{ required: true, message: 'Vui lòng chọn kiểu khuyến mãi' }]}
                >
                    <Select placeholder="Chọn kiểu khuyến mãi" value={promotion?.typePromotionEnum}>
                        {Object.entries(TypePromotionEnum).map(([key, value]) => (
                            <Select.Option key={value} value={value}>
                                {TypePromotionLabel[value]}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="value"
                    label="Giá trị"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị khuyến mãi' }]}
                >
                    <InputNumber 
                    placeholder="Nhập giá trị khuyến mãi" 
                    min={0} 
                    style={{ width: '100%' }} 
                    addonAfter={valueSuffix}
                    />
                </Form.Item>

                <Form.Item
                    name="startDate"
                    label="Ngày bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                >
                    <DatePicker 
                    name='startDate'
                    showTime 
                    format="YYYY-MM-DD HH:mm:ss" 
                    style={{width: '100%'}}
                    placeholder='Chọn ngày bắt đầu'
                    />
                </Form.Item>

                <Form.Item
                    name="endDate"
                    label="Ngày kết thúc"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                    <DatePicker 
                    name='endDate'
                    showTime 
                    format="YYYY-MM-DD HH:mm:ss" 
                    style={{width: '100%'}}
                    placeholder='Chọn ngày kết thúc'
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PromotionModal;
