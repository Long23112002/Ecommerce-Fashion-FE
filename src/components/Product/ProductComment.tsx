import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Rating,
    TextField,
    Typography
} from '@mui/material'
import React from 'react'
import Product from '../../types/Product'

interface IProps {
    product: Product
}

const ProductComment: React.FC<IProps> = ({ product }) => {
    return (
        <>
            <Box
                className='shadow-section'
                sx={{
                    backgroundColor: 'white',
                    p: {
                        xs: 2,
                        md: 5
                    },
                    my: 2,
                    mt: 4,
                    borderRadius: {
                        xs: 4,
                        md: 7
                    }
                }}
            >
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Bình luận
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Viết bình luận của bạn..."
                        variant="outlined"
                        margin="normal"
                        sx={{ backgroundColor: 'white' }}
                    />
                    <Button variant="contained" color="primary" className="mt-2">
                        Gửi bình luận
                    </Button>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Đánh giá từ khách hàng</Typography>
                    {product.reviews?.map((review) => (
                        <Card key={review.id} sx={{ mt: 2 }}>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </>
    )
}

export default ProductComment