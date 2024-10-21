import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import '../../../styles/home.css';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {

  const navigate = useNavigate()
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Áo phao',
      price: 3000000,
      image: 'https://ae01.alicdn.com/kf/Sb394741e22f04f97a71e7e8e4c293c6aM/2023-Neoprene-Life-Jacket-Portable-Fashion-Adult-Children-s-Life-Jacket-Swimming-Water-Sports-Fishing-Kayak.jpg'
    },
    {
      id: 2,
      name: 'Quần sịp',
      price: 500000,
      image: 'https://ae01.alicdn.com/kf/S80c1d74fa70b4aa78eb168d028970c75q/Fashion-Salad-Cat-Meme-Boxers-Shorts-Panties-Men-s-Underpants-Comfortable-Briefs-Underwear.jpg'
    },
    {
      id: 3,
      name: 'Đôn chề',
      price: 1000000,
      image: 'https://m.yodycdn.com/blog/phong-cach-don-che-la-gi-yodyvn6.jpg'
    },
    {
      id: 4,
      name: 'Mai Duy Nghiệp',
      price: 999999,
      image: 'https://i.bbcosplay.com/1683/Trang-Phuc-Chu-He-Tre-Em-1683.jpg'
    }
  ])

  return (
    <Box>
      <Box className="hero-section"
        sx={{
          backgroundImage: `url(${"https://t4.ftcdn.net/jpg/04/15/97/33/360_F_415973312_5yg3MrkRdi2SMHyVKbB4h7GgE5HrgUlb.jpg"})`
        }}
      >
        <Box className="gradient-overlay" />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, fontSize: { xs: '3rem', md: '4rem' } }}
              >
                Ecommerce fashion
              </Typography>
              <Typography variant="h4" paragraph sx={{ mb: 4 }}>
                Thời trang Việt cho người Việt
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ my: 8 }}>
        <Box>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 500 }}>
            Sản phẩm đang hot
          </Typography>
          <Grid container spacing={5}>
            {products.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <Card className="product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography gutterBottom variant="subtitle1" component="div" color='red'>
                      {product.price.toLocaleString('vi-VN')} VND
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
            )}
          </Grid>
        </Box>
        <Divider sx={{ my: 5 }} />
        <Box>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 500 }}>
            Sản phẩm đang không hot
          </Typography>
          <Grid container spacing={5}>
            {products.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <Card className="product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography gutterBottom variant="subtitle1" component="div" color='red'>
                      {product.price.toLocaleString('vi-VN')} VND
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
