import { Box, Modal, ModalClose, Sheet, Table, Typography } from '@mui/joy';
import { IconButton, Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, OrderParam } from '../../../api/OrderApi';
import MuiLoading from '../../../components/Loading/MuiLoading';
import Order from '../../../types/Order';
import { RevenueRequest } from '../../../types/Statistic';
import { formatDateTime } from '../../../utils/dateUtils';

interface IProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    revenueRequest?: RevenueRequest;
}

const RevenueModal: React.FC<IProps> = ({ open, setOpen, revenueRequest }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        setPage(1);
    }, [revenueRequest]);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const param: OrderParam = {
                ...revenueRequest,
                status: 'SUCCESS',
            };
            const res = await fetchAllOrders(param, page - 1, 10);
            setData([...res.data]);
            setTotalPage(res.metadata.totalPage);
            setLoading(false);
        };
        fetch();
    }, [revenueRequest, page]);

    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={() => setOpen(false)}
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
                <Typography
                    component="h2"
                    level="h4"
                    textColor="inherit"
                    sx={{ fontWeight: 'lg', mb: 1 }}
                >
                    Hóa đơn chi tiết
                </Typography>
                <Box sx={{ overflowX: 'auto', width: '100%' }}>
                    {
                        !loading ? (
                            <>
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
                                            <th style={{ width: '20%' }}>Phương thức</th>
                                            <th style={{ width: '20%' }}>Số tiền lãi</th>
                                            <th style={{ width: '25%' }}>Thời gian</th>
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
                                                    {o.revenueAmount.toLocaleString('vi-VN')}đ
                                                </td>
                                                <td>{formatDateTime(o.updatedAt)}</td>
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

                                <Box display="flex" justifyContent="center" mt={2}>
                                    <Pagination count={totalPage} page={page} onChange={(_, value) => setPage(value)} />
                                </Box>
                            </>
                        ) : (
                            <MuiLoading />
                        )
                    }
                </Box>
            </Sheet>
        </Modal>
    );
};

export default RevenueModal;
