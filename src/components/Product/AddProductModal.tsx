import { Button, Form, FormInstance, Input, message, Modal, Select } from "antd";
import { Product } from "../../types/Product";
import { Brand } from "../../types/brand";
import { Origin } from "../../types/origin";
import { Material } from "../../pages/Admin/Attributes/material/material";
import { Category } from "../../types/Category";

interface AddProductModalProps {
  isModalOpen: boolean,
  handleOk: (values: any) => void;
  handleCancel: () => void;
  form: FormInstance;
  products: Product[];
  brands: Brand[];
  origins: Origin[];
  materials: Material[];
  categories: Category[];
}


const AddProductModal: React.FC<AddProductModalProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  products,
  brands,
  origins,
  materials,
  categories
}) => {

  const checkDuplicateName = (name: string, excludeName: string = "") => {
    return products.some((item) => item.name === name && item.name !== excludeName);
  };
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (checkDuplicateName(values.name)) {
        message.error("Tên đã tồn tại! Vui lòng chọn tên khác.");
        return;
      }
      // Gọi handleOk và đợi phản hồi từ backend
      await handleOk(values);

      // Nếu thành công, reset form và đóng modal
      form.resetFields();
      handleCancel();
    } catch (error: any) {
      // Xử lý khi validation thất bại
      if (error instanceof Error) {
        message.error(error.message || "Đã có lỗi xảy ra.");
      } else if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "Đã có lỗi xảy ra.";
        message.error(errorMessage);
      } else {
        console.error("Validation failed:", error);
      }
    }
  };

  return (
    <Modal
      title="Thêm Sản Phẩm"
      visible={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmit}
        >
          Thêm
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên Sản Phẩm"
          rules={[
            { required: true, message: 'Vui lòng nhập tên sản phẩm' },
            { max: 50, message: "Tên phải ít hơn 50 ký tự" }
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item
          name="idOrigin"
          label="Nguồn gốc"
          rules={[{ required: true, message: 'Please select an origin!' }]}
        >
          <Select
            placeholder="Select origin"
            allowClear
          >
            {origins.map(origin => (
              <Select.Option key={origin.id} value={origin.id}>
                {origin.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="idBrand"
          label="Thương hiệu"
          rules={[{ required: true, message: 'Please select an brand!' }]}
        >
          <Select
            placeholder="Select brand"
            allowClear
          >
            {brands.map(brand => (
              <Select.Option key={brand.id} value={brand.id}>
                {brand.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="idMaterial"
          label="Chất liệu"
          rules={[{ required: true, message: 'Please select an material!' }]}
        >
          <Select
            placeholder="Select material"
            allowClear
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
          label="Danh mục"
          rules={[{ required: true, message: 'Please select an category!' }]}
        >
          <Select
            placeholder="Select category"
            allowClear
          >
            {categories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal