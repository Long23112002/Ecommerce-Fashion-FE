import { Box, Container, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ProductCard from '../../../components/product/ProductCard'
import Product from '../../../types/Product'
import SidebarFilter from './SidebarFilter'
import TopbarFilter from './TopbarFilter'
import { getAllProducts } from '../../../api/ProductApi'

export interface ISelectedFilter {
    keyword: string,
    idBrand: number[],
    idOrigin: number[],
    idCategory: number | null,
    idMaterial: number[],
    colors: number[],
    sizes: number[],
    sort: 'newest' | 'name' | 'price-asc' | 'price-desc'
}

const FilterPage: React.FC = () => {

    const [selectedFilter, setSelectedFilter] = useState<ISelectedFilter>({
        keyword: '',
        idBrand: [],
        idOrigin: [],
        idCategory: null,
        idMaterial: [],
        colors: [],
        sizes: [],
        sort: 'newest'
    })
    const [products, setProduct] = useState<Product[]>([]);

    useEffect(() => {
        // const { keyword, idBrand, idOrigin, idCategory, idMaterial } = selectedFilter
        const res = getAllProducts()
    }, [selectedFilter])

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
                            {
                                products.length
                                    ?
                                    <Grid container spacing={2}>
                                        {products.map((product) => (
                                            <Grid item key={product.id} xs={6} sm={4} md={3}>
                                                <ProductCard product={product} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    :
                                    <Typography>Không có sản phẩm phù hợp</Typography>
                            }
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container >
    )
}

export default FilterPage