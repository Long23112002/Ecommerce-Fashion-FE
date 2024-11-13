import { Avatar, Button, Form, Image, Input, Modal, Typography, Upload, UploadFile } from "antd";
import { ProductDetail } from "../../types/ProductDetail";
import { CloseOutlined } from "@ant-design/icons";

interface ModalViewProductDetailProps {
  visible: boolean;
  onCancel: () => void;
  productDetail: ProductDetail | null;
  onRemove: (file: UploadFile) => boolean;
}
const { Text } = Typography;
const ModalViewProductDetail: React.FC<ModalViewProductDetailProps> = ({ visible, onCancel, productDetail, onRemove }) => {
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
      onRemove={onRemove}
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
          {/* <Image.PreviewGroup>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {productDetail.images.map((image, index) => (
                <Image
                  key={index}
                  width={80}
                  src={image.url}
                  alt={`Product Image ${index + 1}`}
                  style={{ borderRadius: '5px', cursor: 'pointer' }}
                />
              )
              )}
            </div>
          </Image.PreviewGroup> */}
          <Upload
            listType="picture-card"
            fileList={productDetail.images.map((image) => ({
              uid: image.url,
              name: image.url,
              status: 'done',
              url: image.url,
            }))}
            onRemove={onRemove}
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
            }}
          />
        </Form.Item>

        {/* <Form.Item label={<Text strong>Danh sách ảnh:</Text>} name="images">
          <Image.PreviewGroup>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {productDetail.images.map((image, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <Image
                    width={80}
                    src={image.url}
                    alt={`Product Image ${index + 1}`}
                    style={{ borderRadius: '5px', cursor: 'pointer' }}
                  />
                  <Button
                    shape="circle"
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => handleDeleteImage(index)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      transform: 'translate(50%, -50%)',
                      backgroundColor: '#ff4d4f',
                      color: 'white',
                    }}
                  />
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        </Form.Item> */}

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