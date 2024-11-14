import {
  Button,
  Dropdown,
  Form,
  Image,
  Input,
  MenuProps,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  UploadFile
} from 'antd'
import { toast, ToastContainer } from 'react-toastify'
import {
  addProduct,
  deleteProduct,
  downloadTemplate, exportProduct,
  fetchAllProducts,
  getProductById, importProduct,
  updateProduct
} from '../../../api/ProductApi'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import createPaginationConfig, { PaginationState } from '../../../config/product/paginationConfig'
import LoadingCustom from '../../../components/Loading/LoadingCustom'
import { Origin } from '../../../types/origin'
import { Brand } from '../../../types/brand'
import { Material } from '../Attributes/material/material'
import { Category } from '../../../types/Category'
import { getOrigins } from '../../../api/OriginApi'
import { fetchAllBrands } from '../../../api/BrandApi'
import { fetchAllMaterials } from '../Attributes/material/materialManagament'
import { fetchAllCategories } from '../../../api/CategoryApi'
import Cookies from 'js-cookie';
import { getErrorMessage } from '../../Error/getErrorMessage'
import ProductItemModal from '../../../components/Product/ProductItemModal'
import UpdateProductModal from '../../../components/Product/UpdateProductModal'
import AddProductModal from '../../../components/Product/AddProductModal'
import { useNavigate } from 'react-router-dom'
import { RcFile } from 'antd/es/upload'
import axios from 'axios'
import { DownloadOutlined, EditOutlined, FileImageOutlined, FileOutlined, PlusCircleOutlined } from '@ant-design/icons'
import Product from '../../../types/Product'
import ModalHistoryImport from "./components/ModalHistoryImport";



const ProductManager = () => {
  interface DropDownState<T> {
    data: T[];
    page: number;
    isLoading: boolean;
  }

  const [form] = Form.useForm();

  const [products, setProducts] = useState<Product[]>([]);



  const [isModalOpen, setIsModalOpen] = useState(false);

  const [origins, setOrigins] = useState<Origin[]>([]);
  const [pageOrigin, setPageOrigin] = useState<number>(1);
  const [isOriginLoading, setIsOriginLoading] = useState<boolean>(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [pageBrand, setPageBrand] = useState<number>(1);
  const [isBrandLoading, setIsBrandLoading] = useState<boolean>(false);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [pageMaterial, setPageMaterial] = useState<number>(1);
  const [isMaterialLoading, setIsMaterialLoading] = useState<boolean>(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [pageCategory, setPageCategory] = useState<number>(1);
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [itemProduct, setItemProduct] = useState<Product | null>(null);
  const [isItemModelOpen, setIsItemModelOpen] = useState(false);
  const [isItemUpdateOpen, setIsItemUpdateOpen] = useState(false);
  const [isItemAddOpen, setIsItemAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [url, setUrl] = useState<string | null>('');

  const [file, setFile] = useState<File | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 5,
    total: 20,
    totalPage: 4
  })
  const [searchParams, setSearchParams] = useState<{
    keyword: string,
    idOrigin: number,
    idBrand: number,
    idMaterial: number,
    idCategory: number
  }>({
    keyword: '',
    idOrigin: '',
    idBrand: '',
    idMaterial: '',
    idCategory: '',
  })
  interface SearchParams {
    keyword?: string;
    idOrigin?: number;
    idBrand?: number;
    idMaterial?: number;
    idCategory?: number;
  }

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const normFile = (e: any) => {
    return Array.isArray(e) ? e : e && e.fileList;
  };

  const handleUpload = async (file: RcFile): Promise<boolean | void> => {
    const objectId = 1;
    const objectName = '';

    // Tạo formData và đính kèm thông tin cần gửi
    const formData = new FormData();
    formData.append("file", file);
    formData.append("objectId", objectId);
    formData.append("objectName", objectName);

    try {
      const response = await await axios.post("http://ecommerce-fashion.site:9099/api/v1/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = response.data?.file?.[0]?.url;

      setUrl(url);

      // set để ảnh hiển thị preview
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: url,
        },
      ]);

      message.success(`${file.name} tải lên thành công!`);
      return false; // Ngăn chặn upload mặc định của Ant Design
    } catch (error) {
      message.error(`${file.name} tải lên thất bại.`);
      console.error("Error uploading file:", error);
    }
  };

  const onRemove = () => {
    setFileList([]);
    setUrl(null);
  }

  const onChangeImage = () => {
    setFileList([]);
    setUrl(null);
  }


  const handleDetailProduct = (product: Product) => {
    setItemProduct(product);
    setIsItemModelOpen(true);
  }

  const handleDetailCancel = () => {
    setIsItemModelOpen(false);
    setItemProduct(null)
  }

  const handleDelete = async (productId: number) => {
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        await deleteProduct(productId, token);
        toast.success("Xóa Thành Công");
        refreshProducts();
      } else {
        toast.error("Authorization failed")
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSearch = (changedValues: Partial<SearchParams>) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      ...changedValues, // Chỉ ghi đè các giá trị có trong `changedValues`
    }));

    // Đặt lại trang hiện tại về 1
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: 1,
    }));
  };

  const handleUpdateCancel = () => {
    setIsItemUpdateOpen(false);
  };

  const handleUpdateOk = async () => {
    try {
      const values = await form.validateFields();
      const { name, code, description, idCategory, idBrand, idOrigin, idMaterial } = values;
      const token = Cookies.get("accessToken");

      if (token && editingProduct) {
        await updateProduct(editingProduct.id, { name, code, description, idCategory, idBrand, idOrigin, idMaterial }, token);
        toast.success('Cật Nhật Thành Công');
        handleUpdateCancel();
        refreshProducts();
      } else {
        toast.error("Authorization failed");
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    }
  };

  const showUpdateModal = async (product: Product | null = null) => {
    if (product) {
      try {
        const productItem = await getProductById(product.id);
        form.setFieldsValue({
          name: product.name,
          code: product.code,
          description: product.description,

        })
        setEditingProduct(productItem);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch product item');
      }
      setIsItemUpdateOpen(true);
    }
  }

  const handleAddCancel = () => {
    setIsItemAddOpen(false);
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      const { name, code, description, idCategory, idBrand, idOrigin, idMaterial } = values;
      const image = url;
      const token = Cookies.get("accessToken");

      if (token) {
        await addProduct({ name, code, description, idCategory, idBrand, idOrigin, idMaterial, image }, token);
        toast.success('Thêm sản phẩm Thành Công');
        handleAddCancel();
        refreshProducts();
      } else {
        toast.error("Authorization failed");
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    }
  };

  const showAddModal = () => {
    form.resetFields();

    setIsItemAddOpen(true);
  };

  const fetchDropDownOrigins = async () => {
    setIsOriginLoading(true);
    try {
      const response = await getOrigins();

      setOrigins(response.data);
    } catch (error) {
      console.error("Error fetching origins:", error);
    }
    finally {
      setIsOriginLoading(false);
    }
  };

  const handlePopupScrollOrigin = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !loading) {
      setPageOrigin((prevPage) => prevPage + 1);
    }
  };

  const fetchDropDownBrand = async () => {
    setIsBrandLoading(true);
    try {
      const response = await fetchAllBrands()

      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setIsBrandLoading(false);
    }
  };
  const handlePopupScrollBrand = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !loading) {
      setPageBrand((prevPage) => prevPage + 1);
    }
  };

  const fetchDropDownMaterial = async () => {
    setIsMaterialLoading(true);
    try {
      const response = await fetchAllMaterials()

      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setIsMaterialLoading(false);
    }
  };
  const handlePopupScrollMaterial = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !loading) {
      setPageMaterial((prevPage) => prevPage + 1);
    }
  };

  const fetchDropDownCategories = async () => {
    setIsCategoryLoading(true);
    try {
      const response = await fetchAllCategories();

      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handlePopupScrollCategory = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !loading) {
      setPageCategory((prevPage) => prevPage + 1);
    }
  };

  const navigate = useNavigate();

  const showViewDetail = (product: Product) => {
    navigate(`/admin/product-detail`, { state: { product: product } });
  };

  const refreshProducts = () => {
    fetchProducts(pagination.current, pagination.pageSize)
  }

  const fetchProductsDebounced = useCallback(debounce(async (current: number, pageSize: number, keyword: string,
                                                             idOrigin: number, idBrand: number, idMaterial: number, idCategory: number,
  ) => {
    setLoading(true);
    try {
      // fetchDropDownOrigins();
      // fetchDropDownBrand();
      // fetchDropDownMaterial();
      // fetchDropDownCategories();

      const response = await fetchAllProducts(pageSize, current - 1, keyword, idOrigin, idBrand, idMaterial, idCategory);
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
      setLoading(false)
    }
  }, 500), [])

  const fetchProducts = (current: number, pageSize: number) => {
    fetchProductsDebounced(current, pageSize, searchParams.keyword, searchParams.idOrigin, searchParams.idBrand, searchParams.idMaterial, searchParams.idCategory);
  }




  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize);
    fetchDropDownOrigins();
    fetchDropDownBrand();
    fetchDropDownMaterial();
    fetchDropDownCategories();

  }, [pagination.current, pagination.pageSize, searchParams])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string | null | undefined) => (
          image ? (
              <Image
                  width={110}
                  src={image}
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
      dataIndex: 'name',
      key: 'name',
    },
    // {
    //   title: 'Mô tả',
    //   dataIndex: 'description',
    //   key: 'description',
    // },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category:any):any => category.name
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand',
      render: (brand:any):any => brand.name
    },
    {
      title: 'Nguồn gốc',
      dataIndex: 'origin',
      key: 'origin',
      render: (origin:any):any => origin.name
    },
    {
      title: 'Chất liệu',
      dataIndex: 'material',
      key: 'material',
      render: (material:any):any => material.name
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_:any, record:any):any => (
          <div>
            <Button onClick={() => handleDetailProduct(record)} className="btn-outline-warning">
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

            <Button onClick={() => showViewDetail(record)} style={{ margin: '0 8px' }} className="btn-outline-primary">
              <i className="fa-solid fa-eye"></i>
            </Button>
          </div>
      ),
    }
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case '1':
        showAddModal();
        break;
      case '2':
        document.getElementById('excel-upload')?.click();
        break;
      case '3':
        downloadTemplate().then(r => console.log(r));
        break;
      case '4':
        exportProduct(pagination.pageSize, pagination.current - 1, searchParams.keyword, searchParams.idOrigin, searchParams.idBrand, searchParams.idMaterial, searchParams.idCategory);
        break;
      case '5':
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };


  const handleUploads = async (file: File) => {
    try {
      await importProduct(file);
      setIsVisible(true);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setFile(file);

        handleUploads(file);
        e.target.value = '';
      } else {
        alert('Vui lòng chọn tệp Excel');
      }
    }
  };
  const onClose = () => {
    setIsVisible(false);
  };

  const onViewHistory = () => {
    setIsVisible(false)
    setIsModalOpen(true)
  };


  const items: MenuProps['items'] = [
    {
      label: 'Thêm sản phẩm',
      key: '1',
      icon:  <i className="fa-solid fa-circle-plus"></i>,
    },
    {
      label: 'Nhập dữ liệu sản phẩm',
      key: '2',
      icon: <EditOutlined />,
    },
    {
      label: 'Tải file mẫu',
      key: '3',
      icon: <DownloadOutlined />,
      danger: true,
    },
    {
      label: 'Xuất excel',
      key: '4',
      icon: <FileOutlined  />,
      danger: true,
    },
    {
      label: 'Lịch sử nhập liệu',
      key: '5',
      icon: <FileOutlined  />,
      danger: true,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };



  return (
      <div className='text-center' style={{marginLeft: 20, marginRight: 20}}>
        <h1 className='text-danger'>Quản lý sản phẩm</h1>

        {/* <Button
        className="mt-3 mb-3"
        style={{ display: "flex", backgroundColor: "black", color: "white" }}
        type="default"
        onClick={showAddModal}
      >
        <i className="fa-solid fa-circle-plus"></i>
      </Button> */}

        <Space direction="vertical"
               style={{display: "flex", color: "white"}}
               className="mt-3 mb-3"
        >
          <Dropdown.Button
              menu={menuProps}
          >
            <PlusCircleOutlined/>
            {/* Add product */}
          </Dropdown.Button>
        </Space>

        <Form
            layout="inline"
            onValuesChange={handleSearch}
            style={{display: 'flex', justifyContent: 'flex-end'}}
            className="mt-2 mb-2"
        >
          <Form.Item name="keyword">
            <Input placeholder="Tên sản phẩm, thương hiệu, nguồn gốc,..."/>
          </Form.Item>

          <Form.Item name="idOrigin" label="Nguồn gốc">
            <Select
                placeholder="Chọn nguồn gốc"
                allowClear
                onPopupScroll={handlePopupScrollOrigin}
                loading={isOriginLoading}
                dropdownRender={(menu) => (
                    <>
                      {menu}
                      {isOriginLoading && (
                          <div style={{textAlign: 'center', padding: 8}}>
                            <Spin/>
                          </div>
                      )}
                    </>
                )}
            >
              {origins.map((origin) => (
                  <Select.Option key={origin.id} value={origin.id}>
                    {origin.name}
                  </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="idBrand" label="Thương hiệu">
            <Select
                placeholder="Chọn Thương hiệu"
                allowClear
                onPopupScroll={handlePopupScrollBrand}
                loading={isBrandLoading}
                dropdownRender={(menu) => (
                    <>
                      {menu}
                      {isBrandLoading && (
                          <div style={{textAlign: 'center', padding: 8}}>
                            <Spin/>
                          </div>
                      )}
                    </>
                )}
            >
              {brands.map((brand) => (
                  <Select.Option key={brand.id} value={brand.id}>
                    {brand.name}
                  </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="idMaterial"
                     label="Chất liệu">
            <Select
                placeholder="Chọn chất liệu"
                allowClear
                onPopupScroll={handlePopupScrollMaterial}
                loading={isMaterialLoading}
                dropdownRender={(menu) => (
                    <>
                      {menu}
                      {isMaterialLoading && (
                          <div style={{textAlign: 'center', padding: 8}}>
                            <Spin/>
                          </div>
                      )}
                    </>
                )}
            >
              {materials.map(material => (
                  <Select.Option key={material.id} value={material.id}>
                    {material.name}
                  </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
              name="idCategory"
              label="Danh mục">
            <Select
                placeholder="Chọn danh mục"
                allowClear
                onPopupScroll={handlePopupScrollCategory} // Gọi khi cuộn trong dropdown
                loading={isCategoryLoading} // Hiển thị trạng thái loading trong select
                dropdownRender={(menu) => (
                    <>
                      {menu}
                      {isCategoryLoading && (
                          <div style={{textAlign: 'center', padding: 8}}>
                            <Spin/>
                          </div>
                      )}
                    </>
                )}
            >
              {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <AddProductModal
            isModalOpen={isItemAddOpen}
            handleOk={handleAddOk}
            handleCancel={handleAddCancel}
            form={form}
            products={products}
            origins={origins}
            brands={brands}
            categories={categories}
            materials={materials}
            normFile={normFile}
            fileList={fileList}
            handleUpload={handleUpload}
            onRemove={onRemove}
        />

        <UpdateProductModal
            isModalOpen={isItemUpdateOpen}
            handleOk={handleUpdateOk}
            handleCancel={handleUpdateCancel}
            form={form}
            product={editingProduct}
            origins={origins}
            brands={brands}
            categories={categories}
            materials={materials}
            // onRemove={onChangeImage}
            handleUpload={handleUpload}
            fileList={fileList}
            normFile={normFile}
        />
        <ProductItemModal
            visible={isItemModelOpen}
            onCancel={handleDetailCancel}
            product={itemProduct}
        />
        <Table
            dataSource={products}
            columns={columns}
            loading={{
              spinning: loading,
              indicator: <LoadingCustom/>,
            }}
            rowKey="id"
            pagination={createPaginationConfig(pagination, setPagination)}
            expandable={{childrenColumnName: 'children'}}
        />

        <ModalHistoryImport
            isModalOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
        />

        <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            style={{display: 'none'}}
            onChange={handleFileChange}
        />



        <Modal
            title={<span style={{ color: '#4285F4', fontWeight: 'bold' }}>TÀI DỮ LIỆU THÀNH CÔNG</span>}
            open={isVisible}
            onCancel={onClose}
            footer={null}
            closeIcon={<span style={{ fontSize: '24px' }}>&times;</span>}
        >
          <p>Hệ thống đang xử lý, Vui lòng vào lịch sử nhập dữ liệu để xem chi tiết!</p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
                type="primary"
                onClick={onViewHistory}
                style={{
                  backgroundColor: '#4285F4',
                  borderColor: '#4285F4',
                  fontWeight: 'bold',
                  height: '40px',
                  borderRadius: '4px'
                }}
            >
              Lịch sử nhập dữ liệu
            </Button>
          </div>
        </Modal>
        <ToastContainer/>
      </div>

  )
}

export default ProductManager