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
    // showModalUser: () => void;
    order: Order | null;
    handleCancel: (e: any) => void;
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
    // showModalUser,
    order,
    handleCancel
}) => {
    // useEffect(() => {
    //     // Đảm bảo form luôn đồng bộ với `order` khi nó thay đổi
    //     if (order) {
    //         form.setFieldsValue(order);
    //     }
    // }, [order, form]);

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
                initialValues={{
                    createdAt: order?.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "",
                    code: order?.code || "",
                    fullName: order?.fullName || "",
                    totalMoney: order?.totalMoney || "",
                    finalPrice: order?.finalPrice || ""
                }}
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
                        <Button type="primary" htmlType="submit">
                            Chọn khách hàng
                        </Button>
                    </Space>
                </Form.Item>

                <Form.Item
                    name="totalMoney"
                    label="Tổng tiền"
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
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

                <Form.Item
                    name="finalPrice"
                    label="Thành tiền"
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
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