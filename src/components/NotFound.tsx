import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <img src="/404.png" alt="" style={{maxWidth: '45vh', maxHeight: '45vh'}}/>
      <h2>Trang này không tồn tại</h2>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default NotFound;
