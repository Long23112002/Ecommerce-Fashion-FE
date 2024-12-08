import { Button, Form, Image, message, Popconfirm, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { ProductDetail } from "../../../../types/ProductDetail";
import AddProductDetailModal from "../../../../components/ProductDetail/AddProductDetailModal";
import { Size } from "../../Attributes/size/size";
import { Color } from "../../Attributes/color/color";
import { useLocation } from "react-router-dom";
import ProductModal from "../../../../components/Product/ProductModal";
import Cookies from 'js-cookie';
import { addProductDetail, deleteProductDetail, FileImage, getProductDetailById, getProductDetailByIdProduct, updateProductDetail } from "../../../../api/ProductDetailApi";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../Error/getErrorMessage";
import { fetchAllColors } from "../../Attributes/color/colorManagament";
import { fetchAllSizes } from "../../Attributes/size/sizeManagament";
import LoadingCustom from "../../../../components/Loading/LoadingCustom";
import { debounce } from "lodash";
import createPaginationConfig, { PaginationState } from "../../../../config/paginationConfig";
import axios from "axios";
import { RcFile, UploadFile } from "antd/es/upload";
import ModalViewProductDetail from "../../../../components/ProductDetail/ModalViewProductDetail";
import { FileImageOutlined } from "@ant-design/icons";
import UpdateProductDetailModal from "../../../../components/ProductDetail/UpdateProuductDetailModal";
import Product from "../../../../types/Product";

const ManageProductDetail = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const [isModalViewOpen, setIsModalViewOpen] = useState<boolean>(false);

    const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
    const [isproductDetailsLoading, setIsProductDetailsLoading] = useState<boolean>(false);
    const [editingProductDetail, setEditingProductDetail] = useState<ProductDetail | null>(null);
    const [isItemUpdateOpen, setIsItemUpdateOpen] = useState(false);

    const [imageList, setImageList] = useState<FileImage[]>([]);
    const [urls, setUrls] = useState<String[]>([]);

    const location = useLocation();
    const product = location.state?.product;
    const [x, setX] = useState<number>(product.id)
    const [colors, setColors] = useState<Color[]>([]);
    const [pageOrigin, setPageOrigin] = useState<number>(1);
    const [isColorLoading, setIsColorLoading] = useState<boolean>(false);

    const [sizes, setSizes] = useState<Size[]>([]);
    const [isSizeLoading, setIsSizeLoading] = useState<boolean>(false);

    const [productList, setProductList] = useState<Product[]>([]);
    const [isProductListLoading, setProductListLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    })

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const normFile = (e: any): any[] | undefined => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const formatCurrency = (value: number | null | undefined): string => {
        if (!value) return "0";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
            .format(value);
    };

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

    const fetchProducts = async () => {
        setProductListLoading(true);
        try {
            const response = await fetchAllSizes();
            setProductList(response.data);
        } catch (error) {
            console.error("Error fetching products: ", error);
        }
        finally {
            setProductListLoading(false);
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
            const images = imageList;
            const token = Cookies.get("accessToken");
            const idProduct = product.id;
            if (token) {
                await addProductDetail({ price, quantity, images, idProduct, idColor, idSize }, token);
                toast.success('Thêm sản phẩm Thành Công');
                handleAddCancel();
                refreshProductdetails();
                setFileList([]);
                setImageList([]);
            } else {
                toast.error("Authorization failed");
            }
        } catch (error: any) {
            toast.error(getErrorMessage(error))
        }
    };

    const handleDelete = async (productId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteProductDetail(productId, token);
                toast.success("Xóa Thành Công");
                refreshProductdetails();
            } else {
                toast.error("Authorization failed")
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const handleView = (productDetail: ProductDetail) => {
        setProductDetail(productDetail);
        setIsModalViewOpen(true);
    }

    const handleDetailCancel = () => {
        setIsModalViewOpen(false);
        setProductDetail(null)
    }

    const showUpdateModal = async (productDetail: ProductDetail | null = null) => {
        if (productDetail) {
            try {
                const productDetailItem = await getProductDetailById(productDetail.id);
                form.setFieldsValue({
                    price: productDetail.price,
                    quantity: productDetail.quantity,
                    // images: productDetail.images,

                })
                setEditingProductDetail(productDetailItem);
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to fetch product detail item');
            }
            setIsItemUpdateOpen(true);
        }
    }
    const handleUpdateCancel = () => {
        setIsItemUpdateOpen(false);
    };

    const handleUpdateOk = async () => {
        try {
            const values = await form.validateFields();
            const { price, quantity, idProduct, idSize, idColor } = values;
            const token = Cookies.get("accessToken");
            const images = urls;

            if (token && editingProductDetail) {
                await updateProductDetail(editingProductDetail.id, { price, quantity, idProduct, idSize, idColor , images}, token);
                toast.success('Cật Nhật Thành Công');
                handleUpdateCancel();
                refreshProductdetails();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error: any) {
            toast.error(getErrorMessage(error))
        }
    };


    const handleUpload = async (file: RcFile): Promise<boolean | void> => {
        const objectId = x.toString();
        const objectName = product.name;

        // Tạo formData và đính kèm thông tin cần gửi
        const formData = new FormData();
        formData.append("file", file);
        formData.append("objectId", objectId);
        formData.append("objectName", objectName);

        try {
            const response = await axios.post("http://ecommerce-fashion.site:9099/api/v1/images", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const url = response.data?.file?.[0]?.url;

            setUrls((prevUrls) => [...prevUrls, url]);

            setImageList((prevImages) => [...prevImages, { url: url }]);

            // set để ảnh hiển thị preview
            setFileList((prevFileList) => [
                ...prevFileList,
                {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    url: url, // sử dụng URL nhận được từ API
                },
            ]);
 
            message.success(`${file.name} tải lên thành công!`);
            return false; // Ngăn chặn upload mặc định của Ant Design
        } catch (error) {
            message.error(`${file.name} tải lên thất bại.`);
            console.error("Error uploading file:", error);
        }
    };

    const onRemove = (file: UploadFile): boolean => {
        const updatedImages = productDetail.images.filter((image) => image.url !== file.url);
        setFileList((prevDetail) => ({
            ...prevDetail,
            images: updatedImages,
        }));
        return true; // Cho phép xóa file
    };

    const fetchProductDetailsDebounced = useCallback(debounce(async (
        id: number,
        current: number,
        pageSize: number,
    ) => {
        setLoading(true);
        try {
            const response = await getProductDetailByIdProduct(id, pageSize, current - 1);
            setProductDetails(response.data);

            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage
            })
        } catch (error) {
            console.error("Error fetching products: ", error)
        } finally {
            setLoading(false)
        }
    }, 500), [])

    const fetchProductDetails = (id: number, current: number, pageSize: number) => {
        fetchProductDetailsDebounced(id, current, pageSize);
    }

    const refreshProductdetails = () => {
        fetchProductDetails(x, pagination.current, pagination.pageSize)
    }

    useEffect(() => {
        fetchColors()
        fetchSizes()
        fetchProductDetails(x, pagination.current, pagination.pageSize)

    }, [pagination.current, pagination.pageSize])

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (images: { url: string }[] | null | undefined) => (
                images && images.length > 0 ? (
                    <Image
                        width={120}
                        src={images[0].url} // Hiển thị URL đầu tiên
                        alt="first-image"
                        style={{ borderRadius: '10px' }}
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: '#aaa' }}>
                        <FileImageOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                        {/* <span>No Image</span> */}
                    </div>
                    // <span>No Image</span> // Xử lý nếu không có ảnh nào
                )
            ),
        },
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
            render: (price: number) => formatCurrency(price),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => handleView(record)} className="btn-outline-warning">
                        <i className="fa-solid fa-eye"></i>
                    </Button>
                    <Button onClick={() => showUpdateModal(record)} style={{ margin: '0 8px' }} className="btn-outline-primary">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa Sản phẩm này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Hủy"
                    >
                        <Button className="btn-outline-danger">
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ]
    return (
        <div className='text-center' style={{ marginLeft: 20, marginRight: 20 }}>
            <h1 className='text-danger'>Thông tin sản phẩm chi tiết </h1>
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
                form={form}
                sizes={sizes}
                colors={colors}
                normFile={normFile}
                fileList={fileList}
                handleUpload={handleUpload}
            />
            <ModalViewProductDetail
                onRemove={onRemove}
                visible={isModalViewOpen}
                onCancel={handleDetailCancel}
                productDetail={productDetail}
            />
            <UpdateProductDetailModal
                isModalOpen={isItemUpdateOpen}
                handleOk={handleUpdateOk}
                handleCancel={handleUpdateCancel}
                form={form}
                productDetail={editingProductDetail}
                sizes={sizes}
                colors={colors}
                products={productList}
                fileList={fileList}
            />
        </div>
    )
}

export default ManageProductDetail