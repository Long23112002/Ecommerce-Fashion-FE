import { Container, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../../api/ProductApi';
import HeroBanner from '../../../components/HeroBanner';
import Link from '../../../components/Link';
import Product from '../../../types/Product';
import { PageableRequest } from '../../../api/AxiosInstance';
import ProductSlider from '../../../components/product/ProductSlider';

const HomePage: React.FC = () => {
  const [banners, setBanners] = useState<string[]>(['https://marketplace.canva.com/EAFoEJMTGiI/1/0/1600w/canva-beige-aesthetic-new-arrival-fashion-banner-landscape-cNjAcBMeF9s.jpg', 'https://www.picmaker.com/templates/_next/image?url=https%3A%2F%2Fstatic.picmaker.com%2Fscene-prebuilts%2Fthumbnails%2FYCA-0022.png&w=3840&q=75', 'https://img.freepik.com/premium-vector/fashion-week-banner-template-promotion-fashion-banner_122059-223.jpg?semt=ais_hybrid'])
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [hotLoading, setHotLoading] = useState<boolean>(true);

  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [newLoading, setNewLoading] = useState<boolean>(true);

  const fetchNewProducts = async () => {
    setNewLoading(true)
    const pageable: PageableRequest = { page: 0, size: 15, sort: 'DESC', sortBy: 'createAt' }
    const res = await getAllProducts({ pageable: pageable })
    setNewProducts([...res.data])
    setNewLoading(false)
  }

  const fetchHotProducts = async () => {
    setHotLoading(true)
    const pageable: PageableRequest = { page: 0, size: 15 }
    const res = await getAllProducts({pageable: pageable})
    setHotProducts([...res.data])
    setHotLoading(false)
  }

  useEffect(() => {
    fetchNewProducts()
    fetchHotProducts()
  }, [])

  return (
    <>
      <HeroBanner images={banners} />

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
