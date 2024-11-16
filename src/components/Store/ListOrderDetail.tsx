import { Button, Col, Divider, Popconfirm, Row, Table, Tooltip } from 'antd'
import React, { useState } from 'react'
import LoadingCustom from '../Loading/LoadingCustom'

const ListOrderDetail = () => {
    const [loading, setLoading] = useState(true);

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Màu sắc',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Kích cỡ',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Thao tác',
            dataIndex: 'category',
            key: 'category',
        },
        // {
        //     title: 'Thao tác',
        //     key: 'actions',
        //     render: (_, record) => (
        //         <>
        //             <Row>
        //                 <Col span={6} order={2}>
        //                     <Tooltip title="Cập nhật sản phẩm " >
        //                         <Button 
        //                         // onClick={() => showUpdateModal(record)}
        //                          style={{ margin: '0 4px' }} className="btn-outline-primary">
        //                             <i className="fa-solid fa-pen-to-square"></i>
        //                         </Button>
        //                     </Tooltip>
        //                 </Col>
        //                 <Col span={6} order={3} >
        //                     <Tooltip title="Xóa sản phẩm " >
        //                         <Popconfirm
        //                             title="Bạn chắc chắn muốn xóa Sản phẩm này?"
        //                             // onConfirm={() => handleDelete(record.id)}
        //                             okText="Có"
        //                             cancelText="Hủy"
        //                         >
        //                             <Button className="btn-outline-danger" style={{ margin: '0 4px' }}>
        //                                 <i className="fa-solid fa-trash-can"></i>
        //                             </Button>
        //                         </Popconfirm>
        //                     </Tooltip>
        //                 </Col>
        //             </Row>
        //         </ >
        //     ),
        // }
    ]
    return (
        <>
            <Divider orientation="left">Danh sách hóa đơn chi tiết</Divider>
            <Table
                // dataSource={products}
                columns={columns}
                // loading={{
                //     spinning: loading,
                //     indicator: <LoadingCustom />,
                // }}
                rowKey="id"
                // pagination={createPaginationConfig(pagination, setPagination)}
                expandable={{ childrenColumnName: 'children' }}
            />
        </>
    )
}

export default ListOrderDetail