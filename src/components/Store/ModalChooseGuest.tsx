import { Button, Form, FormInstance, Input, message, Modal, Table } from "antd";
import React, {useEffect, useState} from "react";
import { User } from "../../types/User";
import LoadingCustom from "../Loading/LoadingCustom";
import createPaginationConfig from "../../config/paginationConfig";
import {getAllUsers, UserParam} from "../../api/UserApi";

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
    loading?: boolean;
    handleFilterChange: (e: any) => void;
    filterParams: UserParam; // Nhận filterParams từ cha
    setFilterParams: (params: any) => void; // Nhận hàm cập nhật filterParams
}
const ModalChooseGuest: React.FC<ModalChooseGuestProps> = ({
    isModalOpen,
    // chooseThisGuest,
    handleCancel,
    loading,
    handleFilterChange,
    filterParams,
    setFilterParams
}) => {

    const [pagination, setPagination] = useState<PaginationState>({
        current: 0,
        pageSize: 5,
        total: 20,
        totalPage: 4,
    });

    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
   
    const fetchUsers = async (params = filterParams) => {
        setLoadingUsers(true);
        try {
            const response = await getAllUsers({
                ...params,
                page: params.page - 1,
            });
            setUsers(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage,
            });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers(filterParams)
    }, [filterParams]);

    const handleTableChange = (newPagination:any) => {
        setFilterParams(prevParams => ({
            ...prevParams,
            page: newPagination.current,
            size: newPagination.pageSize
        }));
        console.log('change');
        
    };


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
                onChange={handleTableChange}
            />
        </Modal>
    )
}

export default ModalChooseGuest