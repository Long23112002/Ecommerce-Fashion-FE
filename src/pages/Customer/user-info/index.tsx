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
            value={`${'/' + page}/user-info`}
            component={Link}
            to={`${'/' + page}/user-info`}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
          <Tab
            label="Thay đổi mật khẩu"
            value={`${'/' + page}/change-password`}
            component={Link}
            to={`${'/' + page}/change-password`}
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