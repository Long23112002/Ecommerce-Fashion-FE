import { Button, Divider, Form, FormInstance, Image, Input, Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import Product from '../../types/Product';
import LoadingCustom from '../Loading/LoadingCustom';
import { FileImageOutlined } from '@ant-design/icons';
import ProductDetail from '../../types/ProductDetail';
import AddQuantityModal from './AddQuantityModal';
import { PageableRequest } from '../../api/AxiosInstance';
import { fetchAllProductDetails, getAllProductDetails, ProductParams } from '../../api/ProductDetailApi';
import createPaginationConfig from '../../config/product/paginationConfig';
import { PaginationState } from '../../config/paginationConfig';
import { debounce } from 'lodash';

interface ProductProps {
    form: FormInstance;
    loading?: boolean;
    showModalAddQuantity: (e: any) => void;
    isOrderSuccess: boolean;
}

const ListProduct: React.FC<ProductProps> = ({
    loading,
    showModalAddQuantity,
    isOrderSuccess
}) => {
    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    })

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

    const handleSearch = (keyword: string) => {
        setKeyword(keyword);

        setPagination((prevPagination) => ({
            ...prevPagination,
            current: 1,
        }));
    };
    // const param: ProductParams = {
    //     allowZero: false,
    //     // keyword: keyword
    // }
    const fetchProductsDebounced = useCallback(debounce(async (current: number, pageSize: number, keyword: string) => {
        setLoadingProducts(true);
        try {
            const response = await fetchAllProductDetails(pageSize, current - 1, keyword);
            setProducts(response.data);

            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage
            })
        } catch (error) {
            console.error("Error fetching products: ", error)
        } finally {
            setLoadingProducts(false)
        }
    }, 500), [])


    const fetchProducts = (current: number, pageSize: number) => {
        fetchProductsDebounced(current, pageSize, keyword);
    }

    useEffect(() => {
        fetchProducts(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, isOrderSuccess, keyword]);

    return (
        <>
            <Divider orientation="left">Danh sách sản phẩm</Divider>
            <Form
                layout="inline"
                onValuesChange={(_, values) => handleSearch(values.keyword)}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className="mt-2 mb-2"
            >
                <Form.Item name="keyword">
                    <Input placeholder="Tên sản phẩm, thương hiệu, nguồn gốc,..." style={{ width: '300px' }} />
                </Form.Item>
            </Form>
            <Table
                dataSource={products}
                columns={columns}
                loading={{
                    spinning: loadingProducts,
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