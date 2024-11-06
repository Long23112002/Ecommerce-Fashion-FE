import { Container, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllProduct } from '../../../api/ProductApi';
import HeroBanner from '../../../components/HeroBanner';
import Link from '../../../components/Link';
import ProductSlider from '../../../components/product/ProductSlider';
import Product from '../../../types/Product';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProduct()
      setProducts([...res.data])
    }
    fetchProducts()
  }, [])

  return (
    <>
      <HeroBanner />

      <Container maxWidth='xl'
        sx={{ my: 4 }}
      >
        <Stack spacing={5}>
          <ProductSlider
            title='Sản phẩm mới'
            products={products}
            slidesToShow={5}
            link={
              <Link to="/filter">Xem tất cả</Link>
            }
          />

          <ProductSlider
            title='Sản phẩm hot'
            products={products}
            slidesToShow={5}
            link={
              <Link to="/filter">Xem tất cả</Link>
            }
          />
        </Stack>

      </Container>
    </>
  );
}

export default HomePage;
