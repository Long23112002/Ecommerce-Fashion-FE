import { Button, Form } from 'antd'
import { Product } from '../../../types/Product'
import { toast } from 'react-toastify'
import { getProductById } from '../../../api/ProductApi'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { current } from '@reduxjs/toolkit'

const ProductManager = () => {
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = async (product: Product | null = null) => {
    if(product) {
      try {
        const productDetails = await getProductById(product.id);
        form.setFieldsValue({
          name: productDetails.name,
          description: productDetails.description,
          // idBrand: productDetails.idBrand
        })
        setEditingProduct(productDetails);
      } catch (error){
        toast.error(error.response?.data?.message || 'Failed to fetch product. ')
      }
    } else {
      form.resetFields();
      setEditingProduct(null);
    }
    setIsModalOpen(true);

    const fetchProducts = (current: number, pageSize: number) => {

    }

    const fetchProductsDebounced = useCallback(debounce(async (current: number, pageSize: number, searchName: string) => {
      setLoading(true);
      try {
        const response = await fe
        
      } catch (error) {
        console.error("Error fetching products: ", error)
      } finally {
        setLoading(false)
      }
    }, 500), [])

    useEffect(() => {
      
    })
  }
  return (
    <div className='text-center' style={{ marginLeft: 20, marginRight: 20 }}>
      <h1 className='text-danger'>Quản lý sản phẩm</h1>
      <Button
        className='mt-3 mb-3'
        style={{ display: "flex", backgroundColor: "black", color: "white" }}
        type="default"
        onClick={() => showModal(null)}
      >

      </Button>
    </div>
    
  )
}

export default ProductManager