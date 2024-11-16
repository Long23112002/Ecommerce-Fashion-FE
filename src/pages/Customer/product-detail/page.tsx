import { Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAllProducts, getProductById } from '../../../api/ProductApi'
import MuiLoadingScreen from '../../../components/Loading/MuiLoadingScreen'
import NotFound from '../../../components/NotFound'
import ProductOverview from '../../../components/Product/ProductOverview'
import ProductReviews from '../../../components/Product/ProductReviews'
import ProductSlider from '../../../components/product/ProductSlider'
import Product from '../../../types/Product'
import ProductDetail from '../../../types/ProductDetail'

const ProductDetailPage: React.FC = () => {
    const { id } = useParams()
    const [product, setProduct] = useState<Product>();
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([])
    const [similarProducts, setSimilarProduct] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const fetchProduct = async () => {
        if (id) {
            try {
                setLoading(true)
                const data = await getProductById(id)
                setProduct({ ...data })
                setProductDetails([...data.productDetails])
            } finally {
                setLoading(false)
            }
        }
    }
    const fetchProductSimilar = async () => {
        const res = await getAllProducts()
        setSimilarProduct([...res.data])
    }

    useEffect(() => {
        fetchProduct()
        fetchProductSimilar()
    }, [id])

    return (
        <>
            {
                !loading
                    ?
                    product
                        ?
                        <Container maxWidth='lg'>
                            <ProductOverview product={product} productDetails={productDetails} />
                            <ProductSlider title='Sản phẩm tương tự' products={similarProducts} />
                            <ProductReviews product={product} />
                        </Container>
                        :
                        <NotFound />
                    :
                    <MuiLoadingScreen />
            }
        </>

    )
}

export default ProductDetailPage