import {
  Box,
  Container,
  Tab,
  Tabs,
  useTheme
} from '@mui/material';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

interface IProps {
  page?: 'admin' | ''
}

const UserInfoLayout: React.FC<IProps> = ({ page = '' }) => {
  const theme = useTheme();
  const location = useLocation();
  const path = page === 'admin' ? '/' + page : ''

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 0, mb: 5 }}>
        <Tabs
          value={location.pathname}
          indicatorColor="primary"
          textColor="primary"
          sx={{ my: 1 }}
        >
          <Tab
            label="Thông tin người dùng"
            value={`${path}/user-info`}
            component={Link}
            to={`${path}/user-info`}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
          <Tab
            label="Thay đổi mật khẩu"
            value={`${path}/change-password`}
            component={Link}
            to={`${path}/change-password`}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        </Tabs>

        <Box sx={{
          backgroundColor: 'white',
          borderRadius: 5,
        }}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
};

export default UserInfoLayout;