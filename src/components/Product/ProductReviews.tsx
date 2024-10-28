import {
    Avatar,
    Box,
    Rating,
    Typography
} from '@mui/material'
import React from 'react'
import Product from '../../types/Product'
import ProductComment from './ProductComment'

interface IProps {
    product: Product
}

const ProductReviews: React.FC<IProps> = ({ product }) => {

    return (
        <>
            <Box
                className='shadow-section-2'
                sx={{
                    backgroundColor: 'white',
                    px: {
                        xs: 2,
                        md: 5
                    },
                    py: {
                        xs: 2,
                        md: 4
                    },
                    my: 2,
                    borderRadius: {
                        xs: 4,
                        md: 7
                    }
                }}
            >
                <ProductComment product={product} />

                <Box>
                    <Typography variant="h5">Đánh giá từ khách hàng</Typography>
                    {product.reviews?.map((review) => (
                        <Box key={review.id}
                            sx={{
                                mt: 2,
                                py: {
                                    xs: 2,
                                    sm: 3
                                },
                                px: {
                                    xs: 2,
                                    sm: 3
                                },
                                boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                                borderRadius: 4
                            }}
                        >
                            <Box display='flex'
                                alignItems='center'
                                gap={1}
                            >
                                <Avatar src='' />
                                <Typography variant="body1">{review.user?.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', mt: 1 }}>
                                <Rating value={review.rating} precision={0.5} readOnly />
                            </Box>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {review.comment}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    )
}

export default ProductReviews