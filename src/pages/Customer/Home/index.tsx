import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  useMediaQuery,
} from '@mui/material';
import ProductCard from '../../../components/Product/ProductCard';
import Product from '../../../types/Product';

const Home: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Áo phao',
      price: 3000000,
      image: 'https://ae01.alicdn.com/kf/Sb394741e22f04f97a71e7e8e4c293c6aM/2023-Neoprene-Life-Jacket-Portable-Fashion-Adult-Children-s-Life-Jacket-Swimming-Water-Sports-Fishing-Kayak.jpg',
    },
    {
      id: 2,
      name: 'Quần sịp',
      price: 500000,
      image: 'https://ae01.alicdn.com/kf/S80c1d74fa70b4aa78eb168d028970c75q/Fashion-Salad-Cat-Meme-Boxers-Shorts-Panties-Men-s-Underpants-Comfortable-Briefs-Underwear.jpg',
    },
    {
      id: 3,
      name: 'Đôn chề',
      price: 1000000,
      image: 'https://m.yodycdn.com/blog/phong-cach-don-che-la-gi-yodyvn6.jpg',
    },
    {
      id: 4,
      name: 'Mai Duy Nghiệp',
      price: 999999,
      image: 'https://i.bbcosplay.com/1683/Trang-Phuc-Chu-He-Tre-Em-1683.jpg',
    },
  ]);

  return (
    <>

      <Box
        sx={{
          backgroundImage: `url(${"https://t4.ftcdn.net/jpg/04/15/97/33/360_F_415973312_5yg3MrkRdi2SMHyVKbB4h7GgE5HrgUlb.jpg"})`,
          backgroundSize: 'cover',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ fontWeight: 700, fontSize: isMobile ? '30px' : '45px' }}>
            Ecommerce Fashion
          </Typography>
          <Typography sx={{ mb: 2, fontSize: isMobile ? '20px' : '30px' }}>
            Thời trang Việt cho người Việt
          </Typography>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          px: 2,
        }}>
        <Typography variant="h4" align="center" gutterBottom sx={{
          fontWeight: 700,
          color: '#333',
          mb: 4,
        }}>
          Sản Phẩm Mới
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {products.map((product) => (
            <Grid item key={product.id} xs={6} sm={4} md={3}>
              <ProductCard
                product={product}
                isMobile={isMobile}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" size="large">
            Xem Tất Cả Sản Phẩm
          </Button>
        </Box>
      </Container>




      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          px: 2,
        }}>
        <Typography variant="h4" align="center" gutterBottom sx={{
          fontWeight: 700,
          color: '#333',
          mb: 4,
        }}>
          Sản Phẩm Nổi Bật
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {products.map((product) => (
            <Grid item key={product.id} xs={6} sm={4} md={3}>
              <ProductCard
                product={product}
                isMobile={isMobile}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" size="large">
            Xem Tất Cả Sản Phẩm
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Home;
