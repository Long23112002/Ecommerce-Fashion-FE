import {useEffect, useState} from 'react';
import {Button, Form, Input, Popconfirm, Select, Table, Tooltip} from 'antd';
import createPaginationConfig, {PaginationState} from "../../../config/paginationConfig.ts";
import {assignRoleToUser, createUser, deleteUser, getAllUsers, updateUser, UserParam} from "../../../api/UserApi.ts";
import {UserData} from "../../../api/AuthApi.ts";
import {UserRequest} from "../../../types/User.ts";
import {toast} from "react-toastify";
import {GenderEnum} from "../../../enum/GenderEnum.ts";
import RolesCheckbox from "../../../components/User/RolesCheckboxProps.tsx";
import UserModel from "../../../components/User/UserModel.tsx";
import {makeSlug} from "../../../utils/slug.ts";
import {Container} from '@mui/material';
import {getErrorMessage} from "../../Error/getErrorMessage.ts";
import {Role} from "../../../types/role.ts";
import LoadingCustom from "../../../components/Loading/LoadingCustom.js";

const ManagerUser = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState<PaginationState>({
        current: 0,
        pageSize: 5,
        total: 20,
        totalPage: 4,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserRequest | null>(null);
    const [filterParams, setFilterParams] = useState<UserParam>({
        page: 0,
        size: 5,
        phone: '',
        email: '',
        fullName: '',
        gender: '',
    });

    const fetchUsers = async (params = filterParams) => {
        setLoading(true);
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
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [filterParams]);

    const handleTableChange = (newPagination:any) => {
        setFilterParams(prevParams => ({
            ...prevParams,
            page: newPagination.current,
            size: newPagination.pageSize
        }));
    };

    const handleFilterChange = (changedValues:any) => {
        setFilterParams(prevParams => ({
            ...prevParams,
            ...changedValues,
            email: changedValues.email !== undefined ? makeSlug(changedValues.email || '') : prevParams.email,
            phone: changedValues.phone !== undefined ? makeSlug(changedValues.phone || '') : prevParams.phone,
            fullName: changedValues.fullName !== undefined ? makeSlug(changedValues.fullName || '') : prevParams.fullName,
            page: 1
        }));
    };


    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (currentUser) {
                await updateUser(currentUser.id, {...currentUser, ...values});
                toast.success("Cập nhập người dùng thành công.");
            } else {
                await createUser(values);
                toast.success("Thêm mới người dùng thành công.");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleRoleChange = async (userId: number, selectedRoles: number[]) => {
        try {
            const user = users.find(u => u.id === userId);
            if (user) {
                await assignRoleToUser({email: user.email, roleIds: selectedRoles});
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.id === userId ? {...u, roles: selectedRoles.map(roleId => ({id: roleId, name: ''}))} : u
                    )
                );
                toast.success("Cập nhập vai trò thành công .");
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id);
            fetchUsers();
            toast.success("Xóa người dùng thành công.");
        } catch (error) {
            console.log(getErrorMessage(error));
            toast.error(getErrorMessage(error));
        }
    };

    const showModal = (record: UserRequest | null) => {
        setCurrentUser(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar: any) => (
                <img
                    src={avatar}
                    alt="avatar"
                    style={{width: 40, height: 40, borderRadius: '50%'}}
                />
            ),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Giới tính',
            dataIndex: "gender",
            key: 'gender'
        },
        {
            title: 'Vai trò',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: Role[], record: { email: string; id: number; }) => (
                <RolesCheckbox
                    email={record.email}
                    userId={record.id}
                    selectedRoles={roles.map(role => role.id)}
                    onChange={(selectedRoles) => handleRoleChange(record.id, selectedRoles)}
                />
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record:any) => (
                <div>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            className="btn-outline-warning"
                            onClick={() => showModal(record)}
                            style={{marginRight: 8}}
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa người dùng này ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Xóa" placement="bottom">
                            <Button className="btn-outline-danger">
                                <i className="fa-solid fa-trash-can"></i>
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        }
    ];

    return (
        <Container maxWidth='xl'>
            <h1 className="text-danger text-center">Quản lí người dùng</h1>
            <Button
                className="mt-3 mb-3"
                style={{display: "flex", backgroundColor: "black", color: "white"}}
                type="default"
                onClick={() => showModal(null)}
            >
                Thêm mới
            </Button>
            <Form
                layout="inline"
                onValuesChange={handleFilterChange}
                style={{display: 'flex', justifyContent: 'flex-end'}}
                className="mt-2 mb-2"
            >
                <Form.Item name="email" label="Email">
                    <Input placeholder="Search by email"/>
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại">
                    <Input placeholder="Tìm kiếm theo số điện thoại"/>
                </Form.Item>
                <Form.Item name="fullName" label="Họ và tên">
                    <Input placeholder="Tìm kiếm theo tên"/>
                </Form.Item>
                <Form.Item name="gender" label="Giới tính ">
                    <Select placeholder="Tìm kiếm theo giới tính">
                        {Object.entries(GenderEnum).map(([key, value]) => (
                            <Select.Option key={value} value={value}>
                                {key}
                            </Select.Option>
                        ))}
                    </Select>
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
                pagination={createPaginationConfig(pagination, setPagination)}
                onChange={handleTableChange}
            />
            {isModalOpen && (
                <UserModel
                    isModalOpen={isModalOpen}
                    handleOk={handleModalOk}
                    handleCancel={() => setIsModalOpen(false)}
                    form={form}
                    refreshUsers={fetchUsers}
                    mode={currentUser ? 'update' : 'add'}
                    user={currentUser ? {...currentUser} : undefined}
                />
            )}
        </Container>
    );

};

export default ManagerUser;
