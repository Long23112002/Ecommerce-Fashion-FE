import { Box, Button, Rating, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Product from '../../types/Product';

interface IProps {
    product: Product
}

const ProductComment: React.FC<IProps> = ({ product }) => {

    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number | null>(null);

    const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value)
    }

    const handleChangeRating = (_: any, value: number | null) => {
        setRating(value)
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5">
                Bình luận
            </Typography>

            <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Viết bình luận của bạn..."
                value={comment}
                variant="outlined"
                margin="normal"
                sx={{ backgroundColor: 'white' }}
                onChange={handleChangeComment}
            />
            <Box>
                <Rating
                    value={rating}
                    size='large'
                    onChange={handleChangeRating}
                />
            </Box>
            <Button variant="contained" color="primary" className="mt-2">
                Gửi bình luận
            </Button>
        </Box>
    )
}

export default ProductComment