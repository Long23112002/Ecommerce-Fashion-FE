import { Avatar, Form, Image, Input, Modal, Typography } from "antd";
import { ProductDetail } from "../../types/ProductDetail";

interface ModalViewProductDetailProps {
  visible: boolean;
  onCancel: () => void;
  productDetail: ProductDetail | null;
}
const { Text } = Typography;
const ModalViewProductDetail: React.FC<ModalViewProductDetailProps> = ({ visible, onCancel, productDetail }) => {
  if (!productDetail) return null;

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          <Text strong style={{ fontSize: '18px' }}>Chi tiết sản phẩm chi tiết</Text>
          {/* <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 'bold' }}>{productDetail.name}</div> */}
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      bodyStyle={{ padding: '24px', fontSize: '16px' }}
    >
      <Form
        layout="vertical"
        initialValues={{
          price: productDetail?.price,
          quantity: productDetail?.quantity,
          images: productDetail?.images,
          createAt: new Date(productDetail.createAt).toLocaleDateString(),
          updateAt: productDetail.updateAt ? new Date(productDetail.updateAt).toLocaleDateString() : "Không có",
          createByUser: productDetail.createByUser?.fullName || "Không rõ",
          updateByUser: productDetail.updateByUser?.fullName || "Chưa cập nhật",
          product: productDetail.product?.name,
          size: productDetail.size?.name,
          color: productDetail.color?.name
        }}
      >
        <Form.Item label={<Text strong>Tên sản phẩm </Text>} name="product">
          <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
        </Form.Item>

        <Form.Item label={<Text strong>Danh sách ảnh:</Text>} name="images">
          <Image.PreviewGroup>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {productDetail.images.map((image, index) => (
                <Image
                  key={index}
                  width={80}
                  src={image.url}
                  alt={`Product Image ${index + 1}`}
                  style={{ borderRadius: '5px', cursor: 'pointer' }}
                />
              ))}
            </div>
          </Image.PreviewGroup>
        </Form.Item>

        <Form.Item label={<Text strong>Giá</Text>} name="price">
          <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
        </Form.Item>
        <Form.Item label={<Text strong>Số lượng :</Text>} name="quantity">
          <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
        </Form.Item>
        <Form.Item label={<Text strong>Màu sắc :</Text>} name="color">
          <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
        </Form.Item>
        <Form.Item label={<Text strong>Kích cỡ :</Text>} name="size">
          <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
        </Form.Item>
        <Form.Item label={<Text strong>Người tạo :</Text>} name="createByUser">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {productDetail.createByUser?.avatar ? (
              <Avatar src={productDetail.createByUser.avatar} size={40} style={{ marginRight: 10 }} />
            ) : (
              <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
            )}
            {<Text strong>{productDetail.createByUser?.fullName || 'Không rõ'}</Text>}
          </div>
        </Form.Item>
        <Form.Item label={<Text strong>Ngày tạo :</Text>} name="createAt">
          <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
        </Form.Item>

        <Form.Item label={<Text strong>Người cập nhật :</Text>} name="updateByUser">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {productDetail.updateByUser?.avatar ? (
              <Avatar src={productDetail.updateByUser.avatar} size={40} style={{ marginRight: 10 }} />
            ) : (
              <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
            )}
            {<Text strong>{productDetail.updateByUser?.fullName || 'Chưa có'}</Text>}
          </div>
        </Form.Item>

      </Form>
    </Modal>
  );
};


export default ModalViewProductDetail