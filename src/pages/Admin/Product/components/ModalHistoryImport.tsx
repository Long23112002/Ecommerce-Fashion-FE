import { Modal, Table, Space, Progress, Tooltip } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import iconExcel from '/src/assets/icon_excel.svg';
import iconDownload from '/src/assets/ico_download.svg';
import { useEffect, useState } from 'react';
import { PaginationState } from '../../../../config/product/paginationConfig';
import { historyImport } from '../../../../api/ProductApi';
import createPaginationConfig from "../../../../config/paginationConfig";
import {toast} from "react-toastify";

interface UserInfo {
    id: number;
    email: string;
    fullName: string;
    avatar: string;
}

interface DataType {
    id: number;
    isDelete: boolean;
    objectName: string | null;
    status: string;
    filePath: string;
    fileName: string;
    fileResult: string;
    count: number;
    success: number;
    error: number;
    userInfo: UserInfo;
    process: number;
    description: string | null;
    typeFile: string;
    createdAt: number;
}

interface ModalHistoryImportProps {
    isModalOpen: boolean;
    onClose: () => void;
}

export default function ModalHistoryImport({ isModalOpen, onClose }: ModalHistoryImportProps) {
    const [history, setHistory] = useState<DataType[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 0,
        pageSize: 5,
        total: 20,
        totalPage: 4,
    });
    // const [showResult, setShowResult] = useState(false);
    //
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowResult(true);
    //     }, 5000);
    //
    //     return () => clearTimeout(timer);
    // }, [process]);



    const fetchHistory = async (_current: number, pageSize: number) => {
        try {
            const current = pagination.current - 1;
            const res = await historyImport(current, pageSize);
            setHistory(res.data);
            setPagination({
                current: res.metadata.page + 1,
                pageSize: res.metadata.size,
                total: res.metadata.total,
                totalPage: res.metadata.totalPage,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleTableChange = (newPagination:any) => {
        setPagination(prevParams => ({
            ...prevParams,
            page: newPagination.current,
            size: newPagination.pageSize
        }));
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchHistory(pagination.current - 1, pagination.pageSize);
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (isModalOpen) {
            fetchHistory(pagination.current, pagination.pageSize);
        }
    }, [pagination.current, pagination.pageSize]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isModalOpen) {
            const inProcessRecords = history.filter(record => record.status === 'IN_PROCESS');

            if (inProcessRecords.length > 0) {

                interval = setInterval(() => {
                    fetchHistory(pagination.current, pagination.pageSize);
                }, 5000);

                return () => clearInterval(interval);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [history, isModalOpen, pagination.current, pagination.pageSize]);

    const columns: ColumnsType<DataType> = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Người tải lên',
            dataIndex: 'userInfo',
            key: 'uploader',
            render: (userInfo: UserInfo) => (
                <Space>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {userInfo.avatar ? (
                            <img
                                style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                                src={userInfo.avatar}
                                alt={userInfo.fullName}
                                className="w-full h-full rounded-full"
                            />
                        ) : (
                            userInfo.fullName.charAt(0)
                        )}
                    </div>
                    {userInfo.fullName || 'Unknown'}
                </Space>
            ),
        },
        {
            title: 'Tệp tải lên',
            dataIndex: 'filePath',
            key: 'filePath',
            render: (filePath: any) => (
                <Space>
                    <Tooltip title={filePath.split('/').pop() || 'Tệp không xác định'}>
                        <img
                            style={{ cursor: 'pointer' }}
                            src={iconExcel}
                            alt="File icon"
                            className="w-6 h-6"
                        />
                    </Tooltip>
                    <img
                        style={{ cursor: 'pointer' }}
                        src={iconDownload}
                        alt="Download"
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = filePath;
                            link.download = filePath.split('/').pop() || 'file';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                    />
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'typeFile',
            dataIndex: 'typeFile',
            render: (typeFile: string, record: any) => (
                <Space>
                    {record.status === 'IN_PROCESS' ? (
                        <>
                            <SyncOutlined spin style={{ color: '#1890ff' }} />
                            <span className="text-blue-500">Đang xử lý</span>
                        </>
                    ) : typeFile === 'ERROR' ? (
                        <>
                            <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                            <span style={{ color: 'red' }} className="text-red-500">
                                Thất Bại
                            </span>
                        </>
                    ) : (
                        <>
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            <span style={{ color: 'green' }} className="text-green-500">
                                Thành công
                            </span>
                        </>
                    )}
                </Space>
            ),
        },
        {
            title: 'Tiến trình',
            key: 'process',
            dataIndex: 'process',
            render: (process: number, record: any) => (
                <Tooltip title={`${process}%`}>
                    <Progress percent={process} showInfo={false}
                              status={record === 'IN_PROCESS' ? 'active' : undefined}/>
                </Tooltip>
            ),
        },
        {
            title: 'SL lỗi',
            dataIndex: 'error',
            key: 'errorCount',
            render: (error: number) => error || 0,
        },
        {
            title: 'SL tải lên',
            dataIndex: 'success',
            key: 'uploadCount',
            render: (success: number) => success || 0,
        },
        {
            title: 'Kết quả',
            dataIndex: 'fileResult',
            key: 'fileResult',
            render: (fileResult: any , record:any) => (
                <Space>
                    <Tooltip title={fileResult.split('/').pop() || 'Tệp không xác định'}>
                        <img
                            style={{ cursor: 'pointer' }}
                            src={iconExcel}
                            alt="File icon"
                            className="w-6 h-6"
                        />
                    </Tooltip>
                    {record.status === 'IN_PROCESS' ? (
                        <img
                            style={{cursor: 'pointer'}}
                            src={iconDownload}
                            alt="Download"
                            onClick={() => toast.warning("Hệ thống đang xử lí vui lòng chờ trong giây lát")}
                        />
                    ): (
                        <img
                            style={{cursor: 'pointer'}}
                            src={iconDownload}
                            alt="Download"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = fileResult;
                                link.download = fileResult.split('/').pop() || 'file';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                        />
                    )}
                </Space>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'time',
            render: (createdAt: number) => new Date(createdAt).toLocaleString(),
        },
    ];

    return (
        <Modal
            title="LỊCH SỬ NHẬP"
            open={isModalOpen}
            onCancel={onClose}
            width={1200}
            footer={null}
        >
            <Table
                columns={columns}
                dataSource={history}
                pagination={createPaginationConfig(pagination, setPagination)}
                onChange={handleTableChange}
                rowKey="id"
            />
        </Modal>
    );
}
