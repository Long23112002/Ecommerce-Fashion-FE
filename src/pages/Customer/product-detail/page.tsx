import { Container } from '@mui/material'
import React, { useState } from 'react'
import ProductOverview from '../../../components/Product/ProductOverview'
import ProductReviews from '../../../components/Product/ProductReviews'
import SimilarProducts from '../../../components/Product/SimilarProducts'
import Product from '../../../types/Product'

const ProductDetail: React.FC = () => {

    // fake data sản phẩm hiện tại
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
                comment: 'Tôi ủng hộ shop'
            },
            {
                id: 3,
                user: { name: "Nam Nguyễn" },
                rating: 1,
                comment: "Lừa đảo, ncct"
            },
            {
                id: 4,
                user: { name: "Mai Duy Nghiệp" },
                rating: 1,
                comment: "Thua phi phai nên vote 1 sao"
            }
        ]
    })

    // fake data sản phẩm liên quan, sản phẩm tương tự
    const [similarProducts, setSimilarProduct] = useState<Product[]>([
        {
            id: 1,
            name: 'Áo phao',
            price: 3000000,
            images: ['https://ae01.alicdn.com/kf/Sb394741e22f04f97a71e7e8e4c293c6aM/2023-Neoprene-Life-Jacket-Portable-Fashion-Adult-Children-s-Life-Jacket-Swimming-Water-Sports-Fishing-Kayak.jpg'],
        },
        {
            id: 2,
            name: 'Quần sịp',
            price: 500000,
            images: ['https://ae01.alicdn.com/kf/S80c1d74fa70b4aa78eb168d028970c75q/Fashion-Salad-Cat-Meme-Boxers-Shorts-Panties-Men-s-Underpants-Comfortable-Briefs-Underwear.jpg'],
        },
        {
            id: 3,
            name: 'Đôn chề',
            price: 1000000,
            images: ['https://m.yodycdn.com/blog/phong-cach-don-che-la-gi-yodyvn6.jpg'],
        },
        {
            id: 4,
            name: 'Mai Duy Nghiệp',
            price: 999999,
            images: ['https://i.bbcosplay.com/1683/Trang-Phuc-Chu-He-Tre-Em-1683.jpg']
        },
        {
            id: 5,
            name: 'Thời trang hiện đại',
            price: 69000000,
            images: ['https://s2.r29static.com/bin/entry/0ae/x,80/1526815/image.jpg'],
        },
        {
            id: 6,
            name: 'Không mua',
            price: 0,
            images: ['https://i.pinimg.com/originals/de/23/83/de238328593da21dbf9185ed3f7d991d.gif']
        },
        {
            id: 7,
            name: 'Áo thun unisex cotton',
            price: 299000,
            images: ['https://owen.cdn.vccloud.vn/media/catalog/product/cache/b23ce5dda22a5cf61bb112966c86a52a/_/m/_mb_tsn220964_4_.jpg']
        },
    ]);

    return (
        <Container maxWidth='xl'>
            <ProductOverview product={product} />
            <SimilarProducts similarProduct={similarProducts} />
            <ProductReviews product={product} />
        </Container>
    )
}

export default ProductDetail