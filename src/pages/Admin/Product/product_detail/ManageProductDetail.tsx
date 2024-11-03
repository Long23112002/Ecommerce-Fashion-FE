import { Button, Form, message, Popconfirm, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { ProductDetail } from "../../../../types/ProductDetail";
import AddProductDetailModal from "../../../../components/ProductDetail/AddProductDetailModal";
import { Product } from "../../../../types/Product";
import { Size } from "../../Attributes/size/size";
import { Color } from "../../Attributes/color/color";
import ProductItemModal from "../../../../components/Product/ProductItemModal";
import { fetchAllProducts } from "../../../../api/ProductApi";
import { useLocation } from "react-router-dom";
import ProductModal from "../../../../components/Product/ProductModal";
import Cookies from 'js-cookie';
import { addProductDetail, getProductDetailByIdProduct } from "../../../../api/ProductDetailApi";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../Error/getErrorMessage";
import { fetchAllColors } from "../../Attributes/color/colorManagament";
import { fetchAllSizes } from "../../Attributes/size/sizeManagament";
import { postImage } from "../../../../api/ImageApi";
import LoadingCustom from "../../../../components/Loading/LoadingCustom";
import { debounce } from "lodash";
import createPaginationConfig, { PaginationState } from "../../../../config/paginationConfig";

const ManageProductDetail = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);

    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
    const [isproductDetailsLoading, setIsProductDetailsLoading] = useState<boolean>(false);

    const [products, setProducts] = useState<Product[]>([]);
    const [url, setUrl] = useState(String)
    const [urls, setUrls] = useState<String[]>([]);
    const [selectedFile, setSelectedFile] = useState<false | null>(null);

    const location = useLocation();
    const product = location.state?.product;
    const [x, setX] = useState<number>(product.id)
    const [colors, setColors] = useState<Color[]>([]);
    const [pageOrigin, setPageOrigin] = useState<number>(1);
    const [isColorLoading, setIsColorLoading] = useState<boolean>(false);

    const [sizes, setSizes] = useState<Size[]>([]);
    const [isSizeLoading, setIsSizeLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    })

    const fetchColors = async () => {
        setIsColorLoading(true);
        try {
            const response = await fetchAllColors();
            setColors(response.data);
        } catch (error) {
            console.error("Error fetching colors:", error);
        }
        finally {
            setIsColorLoading(false);
        }
    };

    const fetchSizes = async () => {
        setIsSizeLoading(true);
        try {
            const response = await fetchAllSizes();
            setSizes(response.data);
        } catch (error) {
            console.error("Error fetching sizes:", error);
        }
        finally {
            setIsSizeLoading(false);
        }
    };


    const showAddModal = () => {
        form.resetFields();
        setIsModalAddOpen(true);
    }

    const handleAddCancel = () => {
        setIsModalAddOpen(false);
    };

    const handleAddOk = async () => {
        try {
            const values = await form.validateFields();
            const { price, quantity, idColor, idSize } = values;
            const token = Cookies.get("accessToken");
            const idProduct = product.id;
            if (token) {
                await addProductDetail({ price, quantity, idProduct, idColor, idSize }, token);
                toast.success('Thêm sản phẩm Thành Công');
                handleAddCancel();
                // refreshProducts();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error: any) {
            toast.error(getErrorMessage(error))
        }
    };

    const handleUploadChange = async (e: any) => {
        console.log('chay vao day');

        if (e.file.status === 'done') {
            console.log('done');

            try {
                const formData = new FormData();
                // formData.append(e.file.originFileObj);
                console.log('formData');

                formData.append('file', e.file.originFileObj);

                // Gọi API tải ảnh và nhận URL trả về
                const response = await postImage(formData);

                // Cập nhật URL vào state
                setUrls((prevUrls) => [...prevUrls, response.url]);

                message.success(`${e.file.name} tải lên thành công`);
            } catch (error) {
                console.error("Lỗi khi tải ảnh:", error);
                message.error(`${e.file.name} tải lên thất bại.`);
            }
        } else if (e.file.status === 'error') {
            message.error(`${e.file.name} tải lên thất bại.`);
        }
    };

    const fetchProductDetailsDebounced = useCallback(debounce(async ( pageSize: number, current: number, id: number) => {
        setIsProductDetailsLoading(true);
        try {
            fetchColors()
            fetchSizes()

            const response = await getProductDetailByIdProduct(id, pageSize, current);
            setProductDetails(response.data);
            console.log(response);

            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage
            })
        } catch (error) {
            console.error("Error fetching product details: ", error)
        } finally {
            setIsProductDetailsLoading(false)
        }
    }, 500), [])

    const fetchProductDetails = (current: number, pageSize: number) => {
        // console.log(x);
        
        fetchProductDetailsDebounced(x,pageSize, current);
    }

    useEffect(() => {
       setX(product.id)
       console.log(x);
       
        fetchProductDetails(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize])

    const columns = [
        {
            title: 'Màu sắc',
            dataIndex: 'color',
            key: 'color',
            render: (color) => color.name
        },
        {
            title: 'Kích cỡ',
            dataIndex: 'size',
            key: 'size',
            render: (size) => size.name
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        // {
        //     title: 'Thao tác',
        //     key: 'actions',
        //     render: (_, record) => (
        //         <div>
        //             <Button onClick={() => handleDetailProduct(record)} className="btn-outline-warning">
        //                 <i className="fa-solid fa-eye"></i>
        //             </Button>
        //             <Button onClick={() => showUpdateModal(record)} style={{ margin: '0 8px' }} className="btn-outline-primary">
        //                 <i className="fa-solid fa-pen-to-square"></i>
        //             </Button>
        //             <Popconfirm
        //                 title="Bạn chắc chắn muốn xóa Sản phẩm này?"
        //                 onConfirm={() => handleDelete(record.id)}
        //                 okText="Có"
        //                 cancelText="Hủy"
        //             >
        //                 <Button className="btn-outline-danger">
        //                     <i className="fa-solid fa-trash-can"></i>
        //                 </Button>
        //             </Popconfirm>

        //             <Button onClick={() => showViewDetail(record)} style={{ margin: '0 8px' }} className="btn-outline-primary">
        //                 <i className="fa-solid fa-eye"></i>
        //             </Button>
        //         </div>
        //     ),
        // },
    ]
    return (
        <div className='text-center' style={{ marginLeft: 20, marginRight: 20 }}>
            <h1 className='text-danger'>Thêm sản phẩm chi tiết </h1>
            <ProductModal
                product={product}
            />
            <div
                style={{
                    border: '1px solid #d9d9d9',
                    padding: '24px',
                    textAlign: 'left'
                }}>
                <Table
                    dataSource={productDetails}
                    columns={columns}
                    rowKey="id"
                    loading={{
                        spinning: isproductDetailsLoading,
                        indicator: <LoadingCustom />,
                      }}
                    pagination={createPaginationConfig(pagination, setPagination)}

                    expandable={{ childrenColumnName: 'children' }}
                />
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Button type="primary" onClick={() => showAddModal()}>
                        Thêm sản phẩm chi tiết
                    </Button>
                </div>
            </div>

            <AddProductDetailModal
                isModalOpen={isModalAddOpen}
                handleOk={handleAddOk}
                handleCancel={handleAddCancel}
                handleUploadChange={handleUploadChange}
                form={form}
                sizes={sizes}
                colors={colors}
                urls={urls}
            />
        </div>
    )
}

export default ManageProductDetail