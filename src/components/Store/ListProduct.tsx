import { Button, Divider, Image, Table } from 'antd'
import React, { useState } from 'react'
import Product from '../../types/Product';
import LoadingCustom from '../Loading/LoadingCustom';
import { FileImageOutlined } from '@ant-design/icons';
import ProductDetail from '../../types/ProductDetail';

interface ProductProps {
    products: ProductDetail[];
    loading?: boolean;
}

const ListProduct: React.FC<ProductProps> = ({
    products,
    loading
}) => {

    const columns = [
        {
            title: 'Mã sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product: any): any => product.code
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'product',
            key: 'product',
            render: (product: any): any => (
                product.image ? (
                    <Image
                        width={110}
                        src={product.image}
                        alt="first-image"
                        style={{ borderRadius: '10px' }}
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: '#aaa' }}>
                        <FileImageOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                    </div>
                )
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product: any): any => product.name

        },
        {
            title: 'Màu sắc',
            dataIndex: 'color',
            key: 'color',
            render: (color: any): any => color.name
        },
        {
            title: 'Kích cỡ',
            dataIndex: 'size',
            key: 'size',
            render: (size: any): any => size.name
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record: any) => (
                <>
                    <Button
                        // onClick={() => showUpdateModal(record)}
                        style={{ margin: '0 4px' }} className="btn-outline-primary">
                        <i className="fa-solid fa-circle-plus"></i>
                    </Button>
                </ >
            ),
        },
    ]

    return (
        <>
            <Divider orientation="left">Danh sách sản phẩm</Divider>
            <Table
                dataSource={products}
                columns={columns}
                loading={{
                    spinning: loading,
                    indicator: <LoadingCustom />,
                }}
                rowKey="id"
                expandable={{ childrenColumnName: 'children' }}
            />
        </>
    )
}

export default ListProduct