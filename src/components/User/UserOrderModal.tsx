import { Box, Modal, ModalClose, Sheet, Table, Typography } from '@mui/joy';
import { Avatar, IconButton, Pagination, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageableRequest } from '../../api/AxiosInstance';
import { getAllOrders, OrderParam } from '../../api/OrderApi';
import { getUserById } from '../../api/UserApi';
import Order from '../../types/Order';
import { User } from '../../types/User';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import MuiLoading from '../Loading/MuiLoading';
import { AssignmentReturnRounded } from '@mui/icons-material';

interface IProps {
    userId?: number | undefined;
    setUserId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const UserOrderModal: React.FC<IProps> = ({ userId, setUserId }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<Order[]>([]);
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState<boolean>(true);
    const [orderLoading, setOrderLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    const fetchUser = async () => {
        if (!userId) return
        const res = await getUserById(userId);
        setUser({ ...res });
    };

    const fetchOrder = async () => {
        if (!userId) AssignmentReturnRounded
        const param: OrderParam = {
            userId: userId
        };
        const pageableRequest: PageableRequest = {
            page: page - 1,
            size: 10
        }
        const res = await getAllOrders({ param, pageableRequest });
        setData([...res.data]);
        setTotalPage(res.metadata.totalPage);
    };

    useEffect(() => {
        if (!userId) {
            setLoading(true)
            return
        }
        const fetch = async () => {
            setPage(1);
            try {
                setLoading(true)
                await fetchOrder()
                await fetchUser();
            }
            finally {
                setLoading(false)
            }
        }
        fetch()
    }, [userId]);

    useEffect(() => {
        const fetch = async () => {
            try {
                setOrderLoading(true)
                await fetchOrder()
            }
            finally {
                setOrderLoading(false)
            }
        }
        fetch()
    }, [page]);

    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={userId != undefined}
            onClose={() => setUserId(undefined)}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 800,
                    maxHeight: '90vh',
                    width: '100%',
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                    overflowY: 'auto',
                }}
            >
                <ModalClose variant="plain" sx={{ m: 1 }} />
                {
                    !loading
                        ?
                        <Box>
                            <Box>
                                <Typography
                                    component="h2"
                                    level="h4"
                                    textColor="inherit"
                                    sx={{ fontWeight: 'lg', mb: 1 }}
                                >
                                    Thông tin người dùng
                                </Typography>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                        <Avatar src={user?.avatar + ''} sx={{ width: 70, height: 70 }} />
                                        <Box>
                                            <Typography level='h4'>{user?.fullName}</Typography>
                                            <Typography level="body-sm">{user?.email}</Typography>
                                            <Typography level="body-sm">{user?.isAdmin ? 'Quản trị viên' : 'Khách hàng'}</Typography>
                                        </Box>
                                    </Box>

                                    <Box component="form" noValidate autoComplete="off">
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Typography sx={{ width: '200px' }}>Họ tên:</Typography>
                                            <TextField
                                                size='small'
                                                fullWidth
                                                value={user?.fullName}
                                                disabled
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Typography sx={{ width: '200px' }}>Số điện thoại:</Typography>
                                            <TextField
                                                size='small'
                                                fullWidth
                                                value={user?.phoneNumber || 'Chưa có số điện thoại'}
                                                disabled
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Typography sx={{ width: '200px' }}>Giới tính:</Typography>
                                            <TextField
                                                size='small'
                                                fullWidth
                                                value={user?.gender || ''}
                                                disabled
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Typography sx={{ width: '200px' }}>Ngày sinh: </Typography>
                                            <TextField
                                                size='small'
                                                fullWidth
                                                value={formatDate(user?.birth) || 'Chưa có thông tin'}
                                                disabled
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box>
                                <Typography
                                    component="h3"
                                    level="body-lg"
                                    textColor="inherit"
                                    sx={{ fontWeight: 'lg', mb: 1 }}
                                >
                                    Lịch sử đơn hàng
                                </Typography>
                                <Box sx={{ overflowX: 'auto' }}>
                                    {
                                        !orderLoading
                                            ?
                                            <Table
                                                borderAxis="xBetween"
                                                color="neutral"
                                                size="md"
                                                stickyHeader
                                                variant="outlined"
                                                sx={{
                                                    height: 'auto',
                                                    maxHeight: '60vh',
                                                    overflowY: 'auto',
                                                    display: 'block',
                                                    tableLayout: 'fixed',
                                                    width: '100%'
                                                }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '10%' }}>id</th>
                                                        <th style={{ width: '20%' }}>Người nhận</th>
                                                        <th style={{ width: '15%' }}>Phương thức</th>
                                                        <th style={{ width: '15%' }}>Thành tiền</th>
                                                        <th style={{ width: '25%' }}>Thời gian</th>
                                                        <th style={{ width: '10%' }}>Trạng thái</th>
                                                        <th style={{ width: '5%' }}>Chi tiết</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.map(o => (
                                                        <tr key={o.id}>
                                                            <td>{o.id}</td>
                                                            <td>{o.fullName}</td>
                                                            <td>{o.paymentMethod}</td>
                                                            <td>
                                                                {o.payAmount.toLocaleString('vi-VN')}đ
                                                            </td>
                                                            <td>{formatDateTime(o.createdAt)}</td>
                                                            <td>{o.status}</td>
                                                            <td>
                                                                <IconButton
                                                                    color="primary"
                                                                    className="btn-outline-info"
                                                                    onClick={() => navigate(`/admin/order/${o.id}`)}
                                                                    style={{ marginRight: 8 }}
                                                                >
                                                                    <i className="fa-solid fa-eye" style={{ fontSize: 15 }}></i>
                                                                </IconButton>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            :
                                            <MuiLoading />
                                    }

                                    <Box display="flex" justifyContent="center" mt={2}>
                                        <Pagination count={totalPage} page={page} onChange={(_, value) => setPage(value)} />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        :
                        <MuiLoading />
                }
            </Sheet>
        </Modal>
    );
};

export default UserOrderModal;
