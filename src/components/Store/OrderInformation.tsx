import { Button, Form, FormInstance, Input, Layout, Select, Space } from "antd";
import { Discount } from "../../types/discount";
import { User } from "../../types/User";
import { Voucher } from "../../types/voucher";
import OrderDetailListTable from "./ListOrderDraft";

interface OrderInformationProps {
    // onFill: () => void;
    vouchers: Voucher[];
    users: User[];
    form: FormInstance;
    // showModalUser: () => void;
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

const handleCancel = (values: any) => {
    console.log(values);
};

const OrderInformation: React.FC<OrderInformationProps> = ({
    form,
    vouchers,
    users,
    // showModalUser,
}) => {
    return (
        <div
            style={{
                border: '1px solid black', // Viền màu đen
                padding: '15px',          // Khoảng cách bên trong
                borderRadius: '8px',      // Bo góc
                width: '320px',           // Đặt chiều rộng cụ thể cho form
                marginLeft: 'auto',       // Đẩy form sang phải
                paddingRight: 30
            }}
        >
            <Form
                form={form}
                {...layout}
                name="control-hooks"
                onFinish={onFinish}

            >
                  <Form.Item
                    name="createAt"
                    label="Ngày tạo"
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
                
                <Form.Item label="Mã hóa đơn" name="codeOrder">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Tên khách"
                    rules={[
                        {
                            required: true,
                            message: "Tên khách hàng không được trống",
                        },
                    ]}
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
                    name=""
                    label="Tổng tiền"
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item
                    name="idColor"
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
                    name=""
                    label="Thành tiền"
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Thanh toán
                        </Button>
                        <Button htmlType="button" onClick={handleCancel}>
                            Hủy đơn
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

        </div>

    )
}

export default OrderInformation