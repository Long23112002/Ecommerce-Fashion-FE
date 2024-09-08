import { Table } from 'antd';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../api/AxiosInstance';

interface DiscountCondition {
    min_purchase: number;
    category: string;
}

interface Discount {
    id: number;
    code: string;
    name: string;
    condition: DiscountCondition;
    type: string;
    value: number;
    maxValue: number;
    startDate: number;
    endDate: number;
    discountStatus: string;
    createAt: number;
    updateAt: number;

}

export default function Index() {
    // const [loading, setLoading] = useState(true);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const pageSize = 5;

    useEffect(() => {
        const fetchDiscount = async () => {
            try {
                const res = await axiosInstance.get('http://localhost:8080/api/v1/discount', {
                    params: {
                        page: currentPage,
                        size: pageSize
                    }
                });
                if (Array.isArray(res.data.data)) {
                    setDiscounts(res.data.data || []);
                    setTotalPages(res.data.metaData.totalPage || 1);
                } else {
                    console.log('Dữ liệu không hợp lệ:', res.data);
                }
            } catch (error) {
                console.log('Lỗi:', error);
                alert('Lỗi Khi Lấy Dữ Liệu Discount');
            }
            // finally {
            //     setLoading(false);
            // }
        };
        fetchDiscount();
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const columns = [
        { title: 'STT', key: 'stt', render: (_: unknown, __: Discount, index: number) => currentPage * pageSize + index + 1 },
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Min Purchase', key: 'minPurchase', render: (discount: Discount) => discount.condition?.min_purchase || '' },
        { title: 'Category', key: 'category', render: (discount: Discount) => discount.condition?.category || '' },
        { title: 'Value', dataIndex: 'value', key: 'value' },
        { title: 'Max Value', dataIndex: 'maxValue', key: 'maxValue' },
        { title: 'Start Date', key: 'startDate', render: (discount: Discount) => formatDate(discount.startDate) },
        { title: 'End Date', key: 'endDate', render: (discount: Discount) => formatDate(discount.endDate) },
        { title: 'Status', dataIndex: 'discountStatus', key: 'discountStatus' },
        { title: 'Create At', key: 'createAt', render: (discount: Discount) => formatDate(discount.createAt) },
        { title: 'Update At', key: 'updateAt', render: (discount: Discount) => formatDate(discount.updateAt) },
    ];

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('vi-VN');
    };
    // const dataSource = discounts.map((p, i) => ({
    //     key: p.id,
    //     stt: i + 1,
    //     code: p.code,
    //     name: p.name,
    //     minPurchase: p.condition?.min_purchase || '',
    //     category: p.condition?.category || '',
    //     value: p.value,
    //     maxValue: p.maxValue,
    //     startDate: formatDate(p.startDate),
    //     endDate: formatDate(p.endDate),
    //     discountStatus: p.discountStatus,
    //     createAt: formatDate(p.createAt),
    //     updateAt: formatDate(p.updateAt),
    // }));

    return (
        <>
            <Table
                columns={columns}
                dataSource={discounts}
                pagination={{
                    current: currentPage + 1,
                    pageSize: pageSize,
                    total: totalPages * pageSize,
                    onChange: (page) => handlePageChange(page - 1),
                    // loading={ loading }
                }}
            />
        </>
    );
}
