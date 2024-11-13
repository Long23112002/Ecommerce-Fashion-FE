import { useState } from 'react'
import { Modal, Button, Table, Space, Progress, Tooltip } from 'antd'
import { DownloadOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
    key: string
    stt: number
    uploader: string
    fileName: string
    status: string
    progress: number
    errorCount: number
    uploadCount: number
    time: string
}

export default function ModalHistoryImport() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const columns: ColumnsType<DataType> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 70,
        },
        {
            title: 'Người tải lên',
            dataIndex: 'uploader',
            key: 'uploader',
            render: (text) => (
                <Space>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {text.charAt(0)}
                    </div>
                    {text}
                </Space>
            ),
        },
        {
            title: 'Tệp tải lên',
            dataIndex: 'fileName',
            key: 'fileName',
            render: (text) => (
                <Space>
                    <img src="/placeholder.svg?height=24&width=24" alt="Excel icon" className="w-6 h-6" />
                    {text}
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (text) => (
                <Space>
                    {text === 'Thất bại' ? (
                        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                    ) : (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    )}
                    <span className={text === 'Thất bại' ? 'text-red-500' : 'text-green-500'}>
            {text}
          </span>
                </Space>
            ),
        },
        {
            title: 'Tiến trình',
            key: 'progress',
            dataIndex: 'progress',
            render: (progress) => (
                <Tooltip title={`${progress}%`}>
                    <Progress percent={progress} showInfo={false} />
                </Tooltip>
            ),
        },
        {
            title: 'SL lỗi',
            dataIndex: 'errorCount',
            key: 'errorCount',
        },
        {
            title: 'SL tải lên',
            dataIndex: 'uploadCount',
            key: 'uploadCount',
        },
        {
            title: 'Kết quả',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <img src="/placeholder.svg?height=24&width=24" alt="Excel icon" className="w-6 h-6" />
                    <DownloadOutlined />
                </Space>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
        },
    ]

    const data: DataType[] = [
        {
            key: '1',
            stt: 1,
            uploader: 'Ommani',
            fileName: 'tep_mau_san_pham.xlsx',
            status: 'Thất bại',
            progress: 75,
            errorCount: 1,
            uploadCount: 1,
            time: '10:36, 12/11/2024',
        },
        {
            key: '2',
            stt: 2,
            uploader: 'Ommani',
            fileName: 'tep_mau_san_pham.xlsx',
            status: 'Thất bại',
            progress: 75,
            errorCount: 1,
            uploadCount: 1,
            time: '09:55, 12/11/2024',
        },
        {
            key: '3',
            stt: 3,
            uploader: 'Ommani',
            fileName: 'tep_mau_san_pham.xlsx',
            status: 'Thất bại',
            progress: 75,
            errorCount: 1,
            uploadCount: 1,
            time: '09:50, 12/11/2024',
        },
    ]

    return (
        <div className="p-4">
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Xem lịch sử nhập, xuất
            </Button>
            <Modal
                title="LỊCH SỬ NHẬP, XUẤT SẢN PHẨM"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                width={1200}
                footer={null}
            >
                <div className="mb-4">
                    <Button type="link" className="px-0">
                        Lịch sử nhập
                    </Button>
                    <Button type="text">Lịch sử xuất</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        total: 3,
                        pageSize: 10,
                        current: 1,
                    }}
                />
            </Modal>
        </div>
    )
}