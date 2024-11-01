import React, { useEffect, useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import {
  Button,
  Table,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Flex,
  Tooltip,
  Card,
} from "antd";
import { Promotion } from "../../types/Promotion";
import {
  StatusPromotionEnum,
  StatusPromotionLable,
} from "../../enum/StatusPromotionEnum";
import {
  TypePromotionEnum,
  TypePromotionLabel,
} from "../../enum/TypePromotionEnum";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import type { ColumnsType } from "antd/es/table";
import axiosInstance from "../../api/AxiosInstance.ts";
import { BASE_API } from "../../constants/BaseApi.ts";
import LoadingCustom from "../../components/Loading/LoadingCustom.tsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Product from "./../../types/Product";

interface Product {
  id: number;
  name: string;
  brandName: string;
  categoryName: string;
}

interface ProductDetail {
  id: number;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  product: Product;
}

const columnsProduct: ColumnsType<Product> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Thương hiệu",
    dataIndex: "brandName",
    key: "brandName",
  },
  {
    title: "Danh mục",
    dataIndex: "categoryName",
    key: "categoryName",
  },
];

const columnsProductDetail: ColumnsType<ProductDetail> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Kích thước",
    dataIndex: "size",
    key: "size",
  },
  {
    title: "Màu sắc",
    dataIndex: "color",
    key: "color",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Đơn giá",
    dataIndex: "price",
    key: "price",
    render: (price: number) => `${price} VNĐ`,
  },
];

const PromotionScheduled: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [selectedRowKeysDetail, setSelectedRowKeysDetail] = useState<number[]>(
    []
  );

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
      setProductDetails([]);
    }, 200);
  };

  const startDetail = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeysDetail([]);
      setLoading(false);
    }, 200);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("ID sản phẩm: ", newSelectedRowKeys);

    setSelectedRowKeys(newSelectedRowKeys as number[]);

    const previousSelectedDetailIds = new Set(selectedRowKeysDetail);

    const updatedSelectedProductDetailIds: number[] = [];

    newSelectedRowKeys.forEach((productId) => {
      const productDetailIds = productDetails
        .filter((detail) => detail.product && detail.product.id === productId)
        .map((detail) => detail.id);

      updatedSelectedProductDetailIds.push(...productDetailIds);
    });

    const allSelectedProductDetailIds = Array.from(
      new Set([
        ...previousSelectedDetailIds,
        ...updatedSelectedProductDetailIds,
      ])
    );

    setSelectedRowKeysDetail(allSelectedProductDetailIds);
    if (newSelectedRowKeys.length > 0) {
      fetchProductDetail(newSelectedRowKeys as number[]);
    } else {
      setProductDetails([]);
      setSelectedRowKeysDetail([]);
    }
  };

  const onSelectChangeDetail = (newSelectedRowKeys: React.Key[]) => {
    console.log("ID chi tiết sản phẩm: ", newSelectedRowKeys);
    setSelectedRowKeysDetail(newSelectedRowKeys as number[]);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      {
        key: "select-all",
        text: "Chọn tất cả",
        onSelect: () => {
          const allRowKeys = data.map((item) => item.id);
          setSelectedRowKeys(allRowKeys);
          fetchProductDetail(allRowKeys);
          console.log("Id sản phẩm: ", allRowKeys);
        },
      },
    ],
  };

  const rowSelectionDetail = {
    selectedRowKeys: selectedRowKeysDetail,
    onChange: onSelectChangeDetail,
    selections: [
      {
        key: "select-all",
        text: "Chọn tất cả",
        onSelect: () => {
          const allRowKeys = productDetails.map((item) => item.id);
          setSelectedRowKeysDetail(allRowKeys);
          console.log("Id chi tiết sản phẩm: ", allRowKeys);
        },
      },
    ],
  };

  const hasSelected = selectedRowKeys.length > 0;

  const hasSelectedDetail = selectedRowKeysDetail.length > 0;

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_API}/api/v1/product?keyword`
      );

      const data = await response.data;

      const data2 = data.data;

      const formattedData = data2.map((item: any) => ({
        id: item.id,
        name: item.name,
        brandName: item.brand?.name || "N/A",
        categoryName: item.category?.name || "N/A",
      }));
      setData(formattedData);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetail = async (productIds: number[]) => {
    try {
      const detailPromises = productIds.map(async (productId) => {
        const response = await axiosInstance.get(
          `${BASE_API}/api/v1/product-detail?idProduct=${productId}&keyword`
        );
        return response.data.data;
      });

      // Chờ cho tất cả các Promise hoàn thành
      const detailsArray = await Promise.all(detailPromises);

      // Kết hợp tất cả chi tiết sản phẩm vào một mảng duy nhất
      const allProductDetails = detailsArray.flat().map((item: any) => ({
        id: item.id,
        name: item.product?.name,
        size: item.size?.name,
        color: item.color?.name,
        quantity: item.quantity,
        price: item.price,
        product: item.product.id,
      }));

      setProductDetails(allProductDetails);
      console.log("Sản phẩm chi tiết", allProductDetails);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [valueSuffix, setValueSuffix] = useState<string>("");

  const location = useLocation();
  const selectedPromotion = location.state;

  useEffect(() => {
    const selectedPromotion = location.state;
    if (selectedPromotion && selectedPromotion.productDetailList) {
      const productIdsSet = new Set<number>(
        selectedPromotion.productDetailList
          .map((detail: ProductDetail) => detail.product?.id)
          .filter((id: number | undefined) => id !== undefined)
      );
      const productDetailIds = selectedPromotion.productDetailList.map(
        (detail: any) => detail.id
      );
      const productIds = Array.from(productIdsSet);
      setSelectedRowKeys(productIds);
      setSelectedRowKeysDetail(productDetailIds);
      fetchData();
      fetchProductDetail(productIds);
    }
  }, [location.state]);

  useEffect(() => {
    console.log("Đó là:", selectedPromotion);
    if (selectedPromotion) {
      switch (selectedPromotion.typePromotionEnum) {
        case TypePromotionEnum.PERCENTAGE_DISCOUNT:
          setValueSuffix("%");
          break;
        case TypePromotionEnum.AMOUNT_DISCOUNT:
          setValueSuffix("VNĐ");
          break;
        default:
          setValueSuffix("");
      }
    }
  }, [selectedPromotion]);

  const addProductDetailsToPromotion = async () => {
    setLoading(true);

    try {
      const token = Cookies.get("accessToken");
      const promotionId = selectedPromotion.id;
      if (token) {
        const response = await axiosInstance.post(
          `${BASE_API}/api/v1/promotion/${promotionId}`,
          selectedRowKeysDetail
        );

        toast.success("Lên lịch giảm giá thành công");
        return response.data;
      } else {
        toast.error("Lỗi xác thực");
      }
    } catch (error) {
      console.error("Error adding product details to promotion:", error);
    } finally {
      setLoading(false);

      navigate(`/admin/promotion`);
    }
  };

  return (
    <Container>
      <Row gutter={16} className="mt-5 mx-1">
        <Col span={16}>
          <Card
            title="Sản phẩm"
            bordered={true}
            extra={
              <Flex align="center" gap="middle">
                {hasSelected
                  ? `Áp dụng cho ${selectedRowKeys.length} sản phẩm`
                  : ""}
                <Tooltip title="Làm mới" placement="topLeft">
                  <Button
                    type="default"
                    style={{
                      display: "flex",
                      backgroundColor: "black",
                      color: "white",
                    }}
                    onClick={start}
                    disabled={!hasSelected}
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                  </Button>
                </Tooltip>
              </Flex>
            }
          >
            {/* <h5
      style={{
        textAlign:"center",
        marginBottom: "20px",
      }}
      >Sản phẩm</h5> */}
            <Table
              rowSelection={rowSelection}
              columns={columnsProduct}
              dataSource={data}
              loading={{
                spinning: loading,
                indicator: <LoadingCustom />,
              }}
              rowKey="id"
              pagination={{
                pageSize: 7,
              }}
            />
          </Card>
        </Col>

        <Col span={8}>
          {/* <h5
      style={{
        textAlign:"center",
        marginBottom: "60px",
      }}
      >Đợt giảm giá</h5> */}
          <Card title="Đợt giảm giá" bordered={true}>
            <Form layout="vertical" initialValues={selectedPromotion} disabled>
              <Form.Item name="typePromotionEnum" label="Kiểu khuyến mãi">
                <Select
                  placeholder="Chọn kiểu khuyến mãi"
                  value={selectedPromotion?.typePromotionEnum}
                >
                  {Object.entries(TypePromotionEnum).map(([key, value]) => (
                    <Select.Option key={value} value={value}>
                      {TypePromotionLabel[value]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="value" label="Giá trị">
                <InputNumber
                  style={{ width: "100%" }}
                  addonAfter={valueSuffix}
                  value={selectedPromotion?.value}
                />
              </Form.Item>

              <Form.Item name="startDate" label="Ngày bắt đầu">
                <Input
                  style={{ width: "100%" }}
                  name="startDate"
                  value={selectedPromotion.startDate}
                />
              </Form.Item>

              <Form.Item name="endDate" label="Ngày kết thúc">
                <Input
                  style={{ width: "100%" }}
                  name="endDate"
                  value={selectedPromotion.endDate}
                />
              </Form.Item>

              <Form.Item name="statusPromotionEnum" label="Trạng thái">
                <Select
                  placeholder="Chọn trạng thái khuyến mãi"
                  value={selectedPromotion?.statusPromotionEnum}
                  disabled
                >
                  {Object.entries(StatusPromotionEnum).map(([key, value]) => (
                    <Select.Option key={value} value={value}>
                      {StatusPromotionLable[value]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Tooltip title="Lên lịch giảm giá" placement="topLeft">
                <Button
                  type="primary"
                  style={{
                    display: "flex",
                    backgroundColor: "green",
                    color: "white",
                  }}
                  onClick={addProductDetailsToPromotion}
                  disabled={false}
                >
                  Lưu
                </Button>
              </Tooltip>
            </Form>
          </Card>
        </Col>
      </Row>
      <Col span={24} className="mt-5">
        <Card
          title="Thông tin chi tiết sản phẩm"
          bordered={false}
          extra={
            <Flex align="center" gap="middle">
              {hasSelectedDetail
                ? `Áp dụng cho ${selectedRowKeysDetail.length} chi tiết sản phẩm`
                : ""}
              <Tooltip title="Làm mới" placement="topLeft">
                <Button
                  type="default"
                  style={{
                    display: "flex",
                    backgroundColor: "black",
                    color: "white",
                  }}
                  onClick={startDetail}
                  disabled={!hasSelectedDetail}
                >
                  <i className="fa-solid fa-rotate-left"></i>
                </Button>
              </Tooltip>
            </Flex>
          }
        >
          <Table
            rowSelection={rowSelectionDetail}
            columns={columnsProductDetail}
            dataSource={productDetails}
            loading={{
              spinning: loading,
              indicator: <LoadingCustom />,
            }}
            rowKey="id"
            pagination={{
              pageSize: 5,
            }}
          />
        </Card>
      </Col>
    </Container>
  );
};

export default PromotionScheduled;
