import { Box, Button, Typography } from '@mui/material';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchAllDiscounts } from '../../../api/DiscountApi';
import { Discount } from '../../../types/discount';
import Order from '../../../types/Order';
import { formatDateTime } from '../../../utils/formatDateTime';
import { updateDiscountOrder } from '../../../api/OrderApi';

interface IProps {
    order: Order,
    setOrder: React.Dispatch<React.SetStateAction<Order | undefined>>
}

const VoucherSelector: React.FC<IProps> = ({ order, setOrder }) => {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [discounts, setDiscounts] = useState<Discount[]>([])

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSelectVoucher = async (id: string | number) => {
        const res = await updateDiscountOrder(id)
        setOrder({...res})
        setIsModalOpen(false);
    }

    useEffect(() => {
        const callGetDiscount = async () => {
            const { data } = await fetchAllDiscounts(99, 0, '', undefined, 'ACTIVE')
            setDiscounts([...data])
        }
        callGetDiscount()
    }, [])

    return (
        <Box mb={2}>
            <Button fullWidth onClick={showModal} color='warning' variant='contained'>
                Chọn mã giảm giá
            </Button>
            <Modal
                open={isModalOpen}
                title="Chọn mã giảm giá"
                width={500}
                onCancel={handleCancel}
                footer={null}
            >
                {discounts.map(discount =>
                    <Box
                        key={discount.id}
                        component={Button}
                        onClick={() => handleSelectVoucher(discount.id)}
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
                )}
            </Modal>
        </Box>
    )
}

export default VoucherSelector