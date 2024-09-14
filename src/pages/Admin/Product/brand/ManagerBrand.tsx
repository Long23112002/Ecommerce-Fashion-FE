import React, { useEffect, useState } from "react";
import { Input, Button, Form, Popconfirm, Table } from 'antd';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { fetchAllBrands, createBrand, updateBrand, deleteBrand, getBrandById } from "../../../../api/BrandApi.ts";
import BrandModel from "../../../../components/Brand/BrandModel.tsx"; // Assuming you have a similar modal for brand
import createPaginationConfig, { PaginationState } from "../../../../config/brand/paginationConfig.ts";
import { Brand } from "../../../../types/brand.ts"; // Define this type similarly to `Role`

const ManagerBrand = () => {
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });
    const [searchParams, setSearchParams] = useState<{ name: string }>({
        name: '',
    });

    const mode = editingBrand ? 'update' : 'add';

    const fetchBrands = async (current: number, pageSize: number) => {
        setLoading(true);
        try {
            const response = await fetchAllBrands(pageSize, current - 1, searchParams.name);
            setBrands(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage
            });
        } catch (error) {
            console.error("Error fetching brands:", error);
        } finally {
            setLoading(false);
        }
    };

    const showModal = async (brand: Brand | null = null) => {
        if (brand) {
            try {
                const brandDetails = await getBrandById(brand.id);
                form.setFieldsValue({
                    name: brandDetails.name
                });
                setEditingBrand(brandDetails);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch brand details');
            }
        } else {
            form.resetFields();
            setEditingBrand(null);
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { name } = values;
            const token = Cookies.get("accessToken");

            if (token) {
                if (mode === 'add') {
                    await createBrand({ name }, token);
                    toast.success('Brand added successfully');
                } else if (mode === 'update' && editingBrand) {
                    await updateBrand(editingBrand.id, { name }, token);
                    toast.success('Brand updated successfully');
                }
                handleCancel();
                refreshBrands();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save brand');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async (brandId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteBrand(brandId, token);
                toast.success("Brand deleted successfully");
                refreshBrands();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete brand');
        }
    };

    const handleSearch = (changedValues: any) => {
        setSearchParams(prevParams => ({
            ...prevParams,
            ...changedValues,
        }));
        setPagination(prevPagination => ({
            ...prevPagination,
            current: 1
        }));
    };

    const refreshBrands = () => {
        fetchBrands(pagination.current, pagination.pageSize);
    };

    useEffect(() => {
        fetchBrands(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, searchParams]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Brand Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
                        Update
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this brand?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className="btn-outline-danger">Delete</Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];

    return (
        <div className="text-center" style={{ height: '200vh', marginLeft: 20, marginRight: 20 }}>
            <h1 className="text-danger">Manager Brand</h1>
            <Button
                className="mt-3 mb-3"
                style={{ display: "flex", backgroundColor: "black", color: "white" }}
                type="default"
                onClick={() => showModal(null)}
            >
                Add Brand
            </Button>
            <Form
                layout="inline"
                onValuesChange={handleSearch}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className="mt-2 mb-2"
            >
                <Form.Item name="name" label="Brand Name">
                    <Input placeholder="Search by brand name" />
                </Form.Item>
            </Form>
            <BrandModel
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                form={form}
                mode={editingBrand ? 'update' : 'add'}
                brand={editingBrand || undefined}
            />
            <Table
                dataSource={brands}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
            />
        </div>
    );
};

export default ManagerBrand;
