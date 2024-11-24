import { Button, Divider, Form, FormInstance, Image, Input, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import Product from '../../types/Product';
import LoadingCustom from '../Loading/LoadingCustom';
import { FileImageOutlined } from '@ant-design/icons';
import ProductDetail from '../../types/ProductDetail';
import AddQuantityModal from './AddQuantityModal';
import createPaginationConfig, { PaginationState } from '../../config/product/paginationConfig';
import { PageableRequest } from '../../api/AxiosInstance';
import { getAllProductDetails } from '../../api/ProductDetailApi';


export interface SearchParams {
    keyword?: string;
}

interface ProductProps {
    form: FormInstance;
    loading?: boolean;
    showModalAddQuantity: (e: any) => void;
    searchParams: SearchParams;
    setSearchParams: (params: any) => void;
    // products: ProductDetail[];
}

const ListProduct: React.FC<ProductProps> = ({
    loading,
    showModalAddQuantity,
    searchParams, 
    setSearchParams,
    // products
}) => {
    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    })
    const fetchListProduct = async () => {
        setLoadingProducts(true)
        const pageable: PageableRequest = { page: 0, size: 5, sort: 'DESC', sortBy: 'id' }
        const res = await getAllProductDetails({searchParams: searchParams , pageable: pageable })
        setProducts([...res.data])
        // setLoadingProducts(false)
    }

    const handleSearch = (changedValues: Partial<SearchParams>) => {
        setSearchParams((prevParams) => ({
            ...prevParams,
            ...changedValues, // Chỉ ghi đè các giá trị có trong `changedValues`
        }));

        setPagination((prevPagination) => ({
            ...prevPagination,
            current: 1,
        }));
        console.log('handleSearch');
        
    };

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
                        onClick={() => showModalAddQuantity(record.id)}
                        style={{ margin: '0 4px' }} className="btn-outline-primary">
                        <i className="fa-solid fa-circle-plus"></i>
                    </Button>
                </ >
            ),
        },
    ]

    useEffect(() => {
        fetchListProduct();
    }, [searchParams, pagination.current, pagination.pageSize]);

    return (
        <>
            <Divider orientation="left">Danh sách sản phẩm</Divider>
            <Form
                layout="inline"
                onValuesChange={handleSearch}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className="mt-2 mb-2"
            >
                <Form.Item name="keyword">
                    <Input placeholder="Tên sản phẩm, thương hiệu, nguồn gốc,..." />
                </Form.Item>
            </Form>
            <Table
                dataSource={products}
                columns={columns}
                loading={{
                    spinning: loading,
                    indicator: <LoadingCustom />,
                }}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
                expandable={{ childrenColumnName: 'children' }}
            />

        </>
    )
}

export default ListProduct