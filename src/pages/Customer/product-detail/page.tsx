import { Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProductOverview from '../../../components/product/ProductOverview'
import ProductReviews from '../../../components/product/ProductReviews'
import Product from '../../../types/Product'
import ProductSlider from '../../../components/product/ProductSlider'
import { useParams } from 'react-router-dom'
import { getAllProduct } from '../../../api/ProductApi'
import ProductDetail from '../../../types/ProductDetail'
import { getDetailByIdProduct } from '../../../api/ProductDetailApi'

const ProductDetailPage: React.FC = () => {
    const { id } = useParams()
    const [product, setProduct] = useState<Product>({});
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([])
    const [similarProducts, setSimilarProduct] = useState<Product[]>([]);

    const fetchProductDetails = async () => {
        if (id) {
            const { data } = await getDetailByIdProduct(id)
            setProductDetails([...data])
            setProduct({ ...data[0].product })
        }
    }
    const fetchProductSimilar = async () => {
        const res = await getAllProduct()
        setSimilarProduct([...res.data])
    }

    useEffect(() => {
        fetchProductDetails()
        fetchProductSimilar()
    }, [id])

    return (
        <Container maxWidth='lg'>
            <ProductOverview product={product} productDetails={productDetails} />
            <ProductSlider title='Sản phẩm tương tự' products={similarProducts} />
            <ProductReviews product={product} />
        </Container>
    )
}

export default ProductDetailPage