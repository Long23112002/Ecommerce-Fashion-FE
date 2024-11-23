import { Button, Form, FormInstance, Input, message, Modal, Table } from "antd";
import React, { useState } from "react";
import { User } from "../../types/User";
import LoadingCustom from "../Loading/LoadingCustom";
import createPaginationConfig from "../../config/paginationConfig";

interface PaginationState {
    current: number;      // Trang hiện tại
    pageSize: number;     // Số bản ghi trên mỗi trang
    total: number;        // Tổng số bản ghi
    totalPage: number;
}

interface ModalChooseGuestProps {
    isModalOpen: boolean;
    handleCancel: () => void;
    // chooseThisGuest: (values: any) => void;
    users: User[];
    loading?: boolean;
    handleFilterChange: (e: any) => void;
}
const ModalChooseGuest: React.FC<ModalChooseGuestProps> = ({
    isModalOpen,
    // chooseThisGuest,
    handleCancel,
    users,
    loading,
    handleFilterChange
}) => {

    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: users.length, // Tổng số người dùng
        totalPage: 4
    });


    const columns = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record: any) => (
                <>
                    <Button
                        // onClick={() => chooseThisGuest(record.id)}
                        style={{ margin: '0 4px' }} className="btn-outline-primary">
                        <i className="fa-solid fa-circle-plus"></i>
                    </Button>
                </ >
            ),
        },
    ]

    return (
        <Modal
            title="Chọn khách hàng"
            visible={isModalOpen}
            onCancel={handleCancel}
        >
            <Form
                layout="inline"
                onValuesChange={handleFilterChange}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className="mt-2 mb-2"
            >
                <Form.Item name="phone" label="Số điện thoại">
                    <Input placeholder="Tìm kiếm theo số điện thoại" />
                </Form.Item>
            </Form>
            <Table
                dataSource={users}
                columns={columns}
                loading={{
                    spinning: loading,
                    indicator: <LoadingCustom />,
                }}
                rowKey="id"
                expandable={{ childrenColumnName: 'children' }}
                pagination={createPaginationConfig(pagination, setPagination)}
            />
        </Modal>
    )
}

export default ModalChooseGuest