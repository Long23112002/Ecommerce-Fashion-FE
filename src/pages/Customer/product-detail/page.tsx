import { Container } from '@mui/material'
import React, { useState } from 'react'
import ProductOverview from '../../../components/Product/ProductOverview'
import Product from '../../../types/Product'
import ProductComment from '../../../components/Product/ProductComment'

const ProductDetail: React.FC = () => {
    const [product, setProduct] = useState<Product>({
        id: 1,
        name: "Áo Thun Unisex Cotton",
        description: "Áo thun unisex cotton cao cấp, thiết kế đơn giản nhưng tinh tế, phù hợp cho cả nam và nữ.",
        images: [
            "https://owen.cdn.vccloud.vn/media/catalog/product/cache/b23ce5dda22a5cf61bb112966c86a52a/_/m/_mb_tsn220964_4_.jpg",
            "https://owen.cdn.vccloud.vn/media/catalog/product/cache/d52d7e242fac6dae82288d9a793c0676/_/m/_mb_tsn220964_2_.jpg",
            "https://owen.cdn.vccloud.vn/media/catalog/product/cache/d52d7e242fac6dae82288d9a793c0676/_/m/_mb_tsn220964_5_.jpg"
        ],
        price: 299000,
        brand: {
            name: "FashionVN"
        },
        origin: {
            name: "Việt Nam"
        },
        material: {
            name: "100% Cotton"
        },
        category: {
            name: "Áo thun"
        },
        quantity: 50,
        colors: [
            { name: "Đen" },
            { name: "Đỏ" },
            { name: "Xanh" },
            { name: "Hồng" },
        ],
        sizes: [
            { name: "S" },
            { name: "M" },
            { name: "L" },
            { name: "XL" },
        ],
        rating: 3,
        reviews: [
            {
                id: 1,
                user: { name: "Trần Minh Thái" },
                rating: 5,
                comment: "Sản phẩm tốt"
            },
            {
                id: 2,
                user: { name: "Nguyễn Hải Long" },
                rating: 4,
                comment: "Tôi rất tuyệt tôi ủng hộ shop"
            },
            {
                id: 3,
                user: { name: "Mai Duy Nghiệp" },
                rating: 1,
                comment: "Lừa đảo, ncct"
            }
        ]
    })

    return (
        <Container maxWidth='xl'>
            <ProductOverview product={product} />
            <ProductComment product={product} />
        </Container>
    )
}

export default ProductDetail