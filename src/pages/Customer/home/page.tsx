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

  useEffect(() => {
    fetchNewProducts()
    fetchHotProducts()
  }, [])

  return (
    <>
      <HeroBanner images={['https://d1csarkz8obe9u.cloudfront.net/posterpreviews/fashion-sale-banner-post-design-template-ea23b5c40dcc214228966e99cd0c3df6_screen.jpg?ts=1628576099','https://www.orchardtaunton.co.uk/app/uploads/2020/03/OSC-Spring-Generic-2020-Website-Fashion-Banner-01.jpg','https://marketplace.canva.com/EAFIMHQ5yhE/1/0/1600w/canva-orange-and-teal-summer-sale-kids-fashion-bright-website-banner-L6kUMOWkkho.jpg']} />

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
