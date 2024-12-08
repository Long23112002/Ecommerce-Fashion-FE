import { Box, Button, Typography } from '@mui/material';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import Order from '../../types/Order';
import { Discount } from '../../types/discount';
import { fetchAllDiscounts } from '../../api/DiscountApi';
import { formatDateTime } from '../../utils/dateUtils';
import MuiLoading from '../Loading/MuiLoading';

interface IProps {
    order: Order | null,
    onSelect: (discount: Discount) => void
    onCancel: () => void
}

const DiscountSelector: React.FC<IProps> = ({ order, onSelect, onCancel }) => {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [loading, setLoading] = useState<boolean>(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleSelect = async (discount: Discount) => {
        await onSelect(discount)
        setIsModalOpen(false);
    }

    const handleCancel = async () => {
        await onCancel()
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (!order) return
        if (order.orderDetails?.length == 0) {
            setDiscounts([])
            return
        }
        const callGetDiscount = async () => {
            setLoading(true)
            const idProductDetail = order.orderDetails?.map(od => od.productDetail.id);
            const prices = order.totalMoney
            const { data } = await fetchAllDiscounts(999, 0, '', undefined, 'ACTIVE', idProductDetail, prices)
            setDiscounts([...data])
            setLoading(false)
        }
        callGetDiscount()
    }, [order])

    return (
        <Box mb={2}>
            <Button fullWidth onClick={showModal} color='warning' variant='contained' disabled={!order}>
                Chọn mã giảm giá
            </Button>
            <Modal
                open={isModalOpen}
                title="Chọn mã giảm giá"
                width={500}
                onCancel={handleClose}
                footer={null}
            >
                {
                    !loading
                        ?
                        discounts.length > 0
                            ?
                            <>
                                {
                                    discounts.map(discount =>
                                        <Box
                                            key={discount.id}
                                            component={Button}
                                            onClick={() => handleSelect(discount)}
                                            sx={{
                                                textAlign: 'left',
                                                display: 'block',
                                                width: '100%',
                                                mb: 1,
                                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    position: 'relative',
                                                    gap: 2,
                                                }}
                                            >
                                                <Box>
                                                    <Box
                                                        component="img"
                                                        src={'/logo.png'}
                                                        sx={{
                                                            height: 70,
                                                            width: 70,
                                                            borderRadius: 2,
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </Box>
                                                <Box height='100%' width='100%'>
                                                    <Typography variant='subtitle1' fontWeight="bold">{discount.name}</Typography>

                                                    <Typography variant='caption' sx={{ position: 'absolute', bottom: 0 }}>HSD: {formatDateTime(discount.endDate)}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                }
                                <Box display='flex' justifyContent='end'>
                                    <Button color='error' variant='contained' size='small' onClick={handleCancel}>Hủy giảm giá</Button>
                                </Box>
                            </>
                            :
                            <Typography variant='body2'>Không có phiếu giảm giá phù hợp</Typography>
                        :
                        <MuiLoading />
                }
            </Modal>
        </Box>
    )
}

export default DiscountSelector