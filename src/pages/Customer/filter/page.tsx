import { Box, Container, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import ProductCard from '../../../components/Product/ProductCard'
import Product from '../../../types/Product'
import SidebarFilter from './SidebarFilter'
import TopbarFilter from './TopbarFilter'

export interface ISelectedFilter {
    category: number | null,
    brands: number[],
    colors: number[],
    sizes: number[],
    search: string,
    sort: 'newest' | 'name' | 'price-asc' | 'price-desc'
}

const FilterPage: React.FC = () => {

    const [selectedFilter, setSelectedFilter] = useState<ISelectedFilter>({
        category: null,
        brands: [],
        colors: [],
        sizes: [],
        search: '',
        sort: 'newest'
    })

    const [products, setProduct] = useState<Product[]>([
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
        <Container
            maxWidth='xl'
        >
            <Grid container justifyContent='space-between'>
                <Grid item xs={12} md={3}>
                    <SidebarFilter
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                    />
                </Grid>

                <Grid item xs={12} md={8.85}>
                    <TopbarFilter
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                    />

                    <Box className='shadow-section-2'
                        sx={{
                            backgroundColor: 'white',
                            p: {
                                xs: 2,
                                md: 3
                            },
                            my: 2,
                            borderRadius: {
                                xs: 4,
                                md: 5
                            }
                        }}
                    >
                        <Typography variant='h6' mb={2}>Kết quả</Typography>
                        <Box>
                            <Grid container spacing={2}>
                                {products.map((product) => (
                                    <Grid item key={product.id} xs={6} sm={4} md={3}>
                                        <ProductCard product={product} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container >
    )
}

export default FilterPage