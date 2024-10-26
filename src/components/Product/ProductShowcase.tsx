import {
    Box,
    Container,
    Grid,
    Typography
} from '@mui/material';
import React from 'react';
import Link from '../Link';
import ProductCard from '../../components/Product/ProductCard';
import Product from '../../types/Product';

interface IProps {
    title: string,
    products: Product[]
}

const ProductShowcase: React.FC<IProps> = ({ title, products }) => {

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: 1,
                px: 2,
            }}>
            <Box
                className='shadow-section-2'
                sx={{
                    backgroundColor: 'white',
                    px: {
                        xs: 2,
                        md: 5
                    },
                    py: 3,
                    borderRadius: {
                        xs: 4,
                        md: 7
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{
                        fontWeight: 700,
                        color: '#333',
                        mb: 0
                    }}>
                        {title}
                    </Typography>


                    <Link to="/filter">Xem tất cả</Link>
                </Box>

                <Grid container spacing={2} justifyContent="center">
                    {products.map((product) => (
                        <Grid item key={product.id} xs={6} sm={4} md={3}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    )
}

export default ProductShowcase