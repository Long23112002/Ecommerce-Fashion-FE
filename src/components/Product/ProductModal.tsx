import { Form, FormInstance, Input, message, Modal } from "antd";
import { Product } from "../../types/Product";
import { Brand } from "../../types/brand";
import { Origin } from "../../types/origin";
import { Material } from "../../pages/Admin/Attributes/material/material";
import { Category } from "../../types/Category";
import { useState } from "react";

interface ProductModalProps {
  isModalOpen: boolean,
  handleOk: (values: any) => void;
  handleCancel: () => void;
  form: FormInstance;
  mode: 'add' | 'update';
  product?: Product;
  existingProducts: Product[];
  existingBrands: Brand[];
  existingOrigins: Origin[];
  existingMaterials: Material[];
  existingCategories: Category[];
}


const ProductModal: React.FC<ProductModalProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  mode,
  product,
  existingProducts = [],
  existingBrands = [],
  existingOrigins = [],
  existingMaterials = [],
  existingCategories = []
}) => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkDuplicateName = (name: string, excludeName: string = "") => {
    return existingProducts.some((item) => item.name === name && item.name !== excludeName);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const excludeName = mode === "update"? product?.name : "";
      if(checkDuplicateName(values.name, excludeName)){
        message.error("Tên đã tồn tại! Vui lòng chọn tên khác.")
        return;
      }
      setIsSubmitting(true)
      handleOk(values)
      setIsSubmitting(false)
    } catch (error) {
      console.log("Validation failed: ", error);
      
    }
};

  return (
    <Modal
      title={mode === 'add' ? 'Thêm sản phẩm': 'Chỉnh sửa sản phẩm'}
      visible={isModalOpen}
      onOk={onSubmit}
      onCancel={handleCancel}
      okText={mode === "add" ? "Add" : "Update"}
      cancelText="Cancel"
      confirmLoading={isSubmitting}
    >
      <Form
      form={form}
      layout="vertical"
      initialValues={
        product ? {name : product.name} : {name: ""}
      }
      >
        <Form.Item
        name="name"
        label="Tên sản phẩm "
        rules={[{required: true, message: 'Vui lòng nhập tên !'},
          {max: 50, message: "Tên phải ít hơn 50 kí tự"}
        ]}
        >
          <Input placeholder="Enter product name"></Input>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProductModal