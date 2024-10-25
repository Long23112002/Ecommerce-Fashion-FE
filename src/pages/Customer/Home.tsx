import React, { useState } from 'react';
import HeroBanner from '../../components/HeroBanner';
import ProductShowcase from '../../components/Product/ProductShowcase';
import Product from '../../types/Product';
import { Box } from '@mui/material';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Áo phao',
      price: 3000000,
      images: ['https://ae01.alicdn.com/kf/Sb394741e22f04f97a71e7e8e4c293c6aM/2023-Neoprene-Life-Jacket-Portable-Fashion-Adult-Children-s-Life-Jacket-Swimming-Water-Sports-Fishing-Kayak.jpg'],
    },
    {
      id: 2,
      name: 'Quần sịp',
      price: 500000,
      images: ['https://ae01.alicdn.com/kf/S80c1d74fa70b4aa78eb168d028970c75q/Fashion-Salad-Cat-Meme-Boxers-Shorts-Panties-Men-s-Underpants-Comfortable-Briefs-Underwear.jpg'],
    },
    {
      id: 3,
      name: 'Đôn chề',
      price: 1000000,
      images: ['https://m.yodycdn.com/blog/phong-cach-don-che-la-gi-yodyvn6.jpg'],
    },
    {
      id: 4,
      name: 'Mai Duy Nghiệp',
      price: 999999,
      images: ['https://i.bbcosplay.com/1683/Trang-Phuc-Chu-He-Tre-Em-1683.jpg']
    },
  ]);

  return (
    <>
      <HeroBanner />

      <Box
        sx={{ my: 4 }}
      >
        <ProductShowcase
          title='Sản phẩm mới'
          products={products}
        />

        <ProductShowcase
          title='Sản phẩm hot'
          products={products}
        />

      </Box>
    </>
  );
}

export default Home;
