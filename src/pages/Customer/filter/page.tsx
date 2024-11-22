import { Box, Container, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Product from '../../../types/Product'
import SidebarFilter from './SidebarFilter'
import TopbarFilter from './TopbarFilter'
import { getAllProducts, ProductParams } from '../../../api/ProductApi'
import MuiLoading from '../../../components/Loading/MuiLoading'
import ProductCard from '../../../components/product/ProductCard'
import { useSearchParams } from 'react-router-dom'
import { PageableRequest } from '../../../api/AxiosInstance'

export interface ISelectedFilter {
    keyword: string,
    idBrand: number | null,
    idOrigin: number | null,
    idCategory: number | null,
    idMaterial: number | null,
    idColors: number[],
    idSizes: number[],
    minPrice: number,
    maxPrice: number | null,
    sort: 'newest' | 'name' | 'price-asc' | 'price-desc'
}

const getSort = (sort: 'newest' | 'name' | 'price-asc' | 'price-desc'): { sort: 'ASC' | 'DESC', sortBy: string } => {
    switch (sort) {
        case 'newest': {
            return { sort: 'DESC', sortBy: 'createAt' }
        }
        case 'name': {
            return { sort: 'ASC', sortBy: 'name' }
        }
        case 'price-asc': {
            return { sort: 'ASC', sortBy: 'maxPrice' }
        }
        case 'price-desc': {
            return { sort: 'DESC', sortBy: 'minPrice' }
        }
    }
}

const FilterPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const validSortValues: ISelectedFilter["sort"][] = ["name", "newest", "price-asc", "price-desc"];
    const sortParam = searchParams.get("sort");
    const sort = validSortValues.includes(sortParam as ISelectedFilter["sort"]) ? (sortParam as ISelectedFilter["sort"]) : 'newest';

    const [selectedFilter, setSelectedFilter] = useState<ISelectedFilter>({
        keyword: searchParams.get("keyword") || '',
        idBrand: searchParams.get("idBrand") ? Number(searchParams.get("idBrand")) : null,
        idOrigin: searchParams.get("idOrigin") ? Number(searchParams.get("idOrigin")) : null,
        idCategory: searchParams.get("idCategory") ? Number(searchParams.get("idCategory")) : null,
        idMaterial: searchParams.get("idMaterial") ? Number(searchParams.get("idMaterial")) : null,
        idColors: searchParams.get("idColors") ? searchParams.get("idColors")!.split(',').map(Number) : [],
        idSizes: searchParams.get("idSizes") ? searchParams.get("idSizes")!.split(',').map(Number) : [],
        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 2000000,
        sort: sort
    })
    const [products, setProduct] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true)

    const fetchProducts = async () => {
        setLoading(true)
        const max = selectedFilter.maxPrice || 2000000
        const params: ProductParams = {
            ...selectedFilter,
            maxPrice: max >= 2000000 ? null : max
        }
        const pageable: PageableRequest = {
            ...getSort(selectedFilter.sort)
        }
        const res = await getAllProducts({ params, pageable });
        setProduct([...res.data])
        setLoading(false)
    }

    useEffect(() => {
        const { keyword, idBrand, idCategory, idColors, idMaterial, idOrigin, idSizes, minPrice, maxPrice, sort } = selectedFilter;
        const queryParams: any = {};
        if (keyword) queryParams.keyword = keyword;
        if (idBrand) queryParams.idBrand = idBrand;
        if (idCategory) queryParams.idCategory = idCategory;
        if (idColors && idColors.length > 0) queryParams.idColors = idColors.join(',');
        if (idMaterial) queryParams.idMaterial = idMaterial;
        if (idOrigin) queryParams.idOrigin = idOrigin;
        if (idSizes && idSizes.length > 0) queryParams.idSizes = idSizes.join(',');
        if (minPrice !== undefined) queryParams.minPrice = minPrice;
        if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
        if (sort) queryParams.sort = sort;

        setSearchParams(queryParams, { replace: true });
        fetchProducts()
    }, [selectedFilter]);

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
                            {!loading ?
                                (
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
                                )
                                : <MuiLoading />
                            }
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container >
    )
}

export default FilterPage