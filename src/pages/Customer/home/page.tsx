import { Container, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllProduct } from '../../../api/ProductApi';
import HeroBanner from '../../../components/HeroBanner';
import Link from '../../../components/Link';
import ProductSlider from '../../../components/product/ProductSlider';
import Product from '../../../types/Product';
import { PageableRequest } from '../../../api/AxiosInstance';

const HomePage: React.FC = () => {
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [hotLoading, setHotLoading] = useState<boolean>(true);

  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [newLoading, setNewLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      setNewLoading(true)
      const pageable: PageableRequest = { sort: 'DESC', sortBy: 'createAt' }
      const res = await getAllProduct({}, pageable)
      setNewProducts([...res.data])
      setNewLoading(false)
    }
    const fetchHotProducts = async () => {
      setHotLoading(true)
      const res = await getAllProduct()
      setHotProducts([...res.data])
      setHotLoading(false)
    }

    fetchNewProducts()
    fetchHotProducts()
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
            products={newProducts}
            loading={newLoading}
            slidesToShow={5}
            link={
              <Link to="/filter">Xem tất cả</Link>
            }
          />

          <ProductSlider
            title='Sản phẩm hot'
            products={hotProducts}
            loading={hotLoading}
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
