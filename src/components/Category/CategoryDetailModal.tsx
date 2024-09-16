import React from 'react';
import { Modal, Descriptions } from 'antd';
import { Category } from "../../types/Category";

interface CategoryDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    category: Category | null;
}

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
    visible,
    onCancel,
    category,
}) => {
    if (!category) {
        return null; // If no category is selected, return nothing.
    }

    return (
        <Modal
            title={`Category Details: ${category.name}`}
            visible={visible}
            onCancel={onCancel}
            footer={null}  // No footer buttons
            width={700}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Category ID">{category.id}</Descriptions.Item>
                <Descriptions.Item label="Category Name">{category.name}</Descriptions.Item>
                <Descriptions.Item label="Level">{category.lever}</Descriptions.Item>
                <Descriptions.Item label="Created By">{category.createBy.fullName}</Descriptions.Item>
                <Descriptions.Item label="Created At">
                    {new Date(category.createAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {category.updateAt ? new Date(category.updateAt).toLocaleString() : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Parent Category">
                    {category.parentCategory ? category.parentCategory.name : "None"}
                </Descriptions.Item>
                <Descriptions.Item label="Created By" span={2}>
                    {category.createBy?.avatar ? (
                        <img
                            src={category.createBy.avatar}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                marginRight: 10,
                            }}
                            alt="Avatar"
                        />
                    ) : (
                        <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#ccc", marginRight: 10 }} />
                    )}
                    {category.createBy?.fullName || 'Unknown'}
                </Descriptions.Item>
                <Descriptions.Item label="Updated By" span={2}>
                    {category.updateBy?.avatar ? (
                        <img
                            src={category.updateBy.avatar}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                marginRight: 10,
                            }}
                            alt="Avatar"
                        />
                    ) : (
                        <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#ccc", marginRight: 10 }} />
                    )}
                    {category.updateBy?.fullName || "Not Updated"}
                </Descriptions.Item>
                <Descriptions.Item label="Subcategories">
                    {category.subCategories.length > 0 ? (
                        <ul>
                            {category.subCategories.map((sub) => (
                                <li key={sub.id}>{sub.name}</li>
                            ))}
                        </ul>
                    ) : (
                        "No Subcategories"
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default CategoryDetailModal;
