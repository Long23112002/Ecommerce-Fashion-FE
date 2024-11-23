import { Button, Form, FormInstance, Input, Layout, Popconfirm, Select, Space } from "antd";
import { Discount } from "../../types/discount";
import { User } from "../../types/User";
import { Voucher } from "../../types/voucher";
import OrderDetailListTable from "./ListOrderDraft";
import Order from "../../types/Order";
import { useEffect } from "react";

interface OrderInformationProps {
    // onFill: () => void;
    vouchers: Voucher[];
    users: User[];
    form: FormInstance;
    showModalUser: () => void;
    order: Order | null;
    handleCancel: (e: any) => void;
    handlePay: (e: any) => void;
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


const onFinish = (values: any) => {
    console.log(values);
};


const OrderInformation: React.FC<OrderInformationProps> = ({
    form,
    vouchers,
    users,
    showModalUser,
    order,
    handleCancel,
    handlePay
}) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };
    
    return (
        <div
            style={{
                border: '1px solid black',
                padding: '15px',
                borderRadius: '8px',
                width: '320px',
                marginLeft: 'auto',
                paddingRight: 30
            }}
        >
            <Form
                form={form}
                {...layout}
                name="control-hooks"
                onFinish={onFinish}
                // initialValues={{
                //     createdAt: order?.createdAt
                //         ? new Date(order.createdAt).toLocaleDateString()
                //         : "",
                //     code: order?.code || "",
                //     fullName: order?.fullName || "",
                //     totalMoney: order?.totalMoney || 0,
                //     payAmount: order?.payAmount || ""
                // }}
            >
                <Form.Item
                    name="createdAt"
                    label="Ngày tạo"
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }}
                    />
                </Form.Item>

                <Form.Item label="Mã hóa đơn" name="code">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item
                    name="fullName"
                    label="Tên khách"
                // rules={[
                //     {
                //         required: true,
                //         message: "Tên khách hàng không được trống",
                //     },
                // ]}
                >
                    <Input placeholder="Nhập tên khách hàng" />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit" onClick={showModalUser}>
                            Chọn khách hàng
                        </Button>
                    </Space>
                </Form.Item>

                <Form.Item
                    name="totalMoney"
                    label="Tổng tiền"
                >
                    <Input 
                    disabled 
                    size="large" style={{ fontSize: '16px', color: '#000' }} 
                    />
                </Form.Item>

                <Form.Item
                    name="idVoucher"
                    label="Voucher"
                    rules={[
                        {
                            required: false,
                            message: "Vui lòng chọn voucher",
                        },
                    ]}
                >
                    <Select
                        placeholder="Chọn mã giảm giá"
                        allowClear

                    >
                        {vouchers.map(voucher => (
                            <Select.Option key={voucher.id} value={voucher.id}>
                                {voucher.code}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* <Form.Item
                    label="Thành tiền"
                    dependencies={['totalMoney', 'idVoucher']}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.totalMoney !== currentValues.totalMoney || prevValues.idVoucher !== currentValues.idVoucher
                    }
                >
                    {({ getFieldValue }) => {
                        const totalMoney = getFieldValue('totalMoney') || 0;
                        const idVoucher = getFieldValue('idVoucher');
                        const discount = vouchers.find(voucher => voucher.id === idVoucher)?.discountAmount || 0;
                        const payAmount = totalMoney - discount;

                        return (
                            <Input
                                disabled
                                value={payAmount > 0 ? payAmount : 0}
                                size="large"
                                style={{ fontSize: '16px', color: '#000' }}
                            />
                        );
                    }}
                </Form.Item> */}

                {/* <Form.Item
                    name="payAmount"
                    label="Thành tiền"
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item> */}

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit" onClick={() => handlePay(order)}>
                            Thanh toán
                        </Button>

                        <Popconfirm
                            title="Bạn chắc chắn muốn xóa hóa đơn này?"
                            onConfirm={() => handleCancel(order)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button >
                                Hủy đơn
                            </Button>
                        </Popconfirm>
                    </Space>
                </Form.Item>
            </Form>

        </div>

    )
}

export default OrderInformation