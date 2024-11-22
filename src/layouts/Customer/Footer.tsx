import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack } from '@mui/material'
import { Facebook, Instagram, YouTube } from '@mui/icons-material'

const Footer: React.FC = () => {
    return (
        <Box sx={{ bgcolor: '#1e2329', color: 'white', pt: 6, pb: 3 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Dịch vụ khách hàng
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="inherit" underline="hover">
                                Chính sách khách hàng thân thiết
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Chính sách đổi trả
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Chính sách bảo mật
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Chính sách thanh toán, giao nhận
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Chính sách đơn đồng phục
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Hướng dẫn chọn size
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Đăng ký đối tác
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Về Ecommerce Fashion
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="inherit" underline="hover">
                                Giới thiệu
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Liên hệ
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Tuyển dụng
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Tin tức
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Hệ thống cửa hàng
                            </Link>
                            <Link href="#" color="inherit" underline="hover">
                                Tin khuyến mãi
                            </Link>
                        </Stack>

                        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                            Địa chỉ liên hệ
                        </Typography>
                        <Typography variant="body2" sx={{ maxWidth: 300 }}>
                            Địa chỉ: Trịnh Văn Bô, P. Xuân Phương, Q. Nam Từ Liêm, Tp. Hà Nội
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Ecommerce fashion lắng nghe bạn
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, maxWidth: 400 }}>
                            Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
                        </Typography>

                        <Stack spacing={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box component="span" sx={{ width: 24 }}>📞</Box>
                                <Box>
                                    <Typography variant="body2">Liên hệ đặt hàng</Typography>
                                    <Typography>078 313 21 JQK</Typography>
                                </Box>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <Box component="span" sx={{ width: 24 }}>💬</Box>
                                <Box>
                                    <Typography variant="body2">Góp ý kiến nại</Typography>
                                    <Typography>1800 6969</Typography>
                                </Box>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <Box component="span" sx={{ width: 24 }}>✉️</Box>
                                <Box>
                                    <Typography variant="body2">Email</Typography>
                                    <Typography>chamsockhanhhang@ecommerce-fashion.vn</Typography>
                                </Box>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Facebook />
                            <Instagram />
                            <YouTube />
                        </Stack>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid white' }}>
                    <Typography variant="body2" color="white">
                        © CỬA HÀNG THỜI TRANG ECOMMERCE FASHION
                    </Typography>
                    <Typography variant="body2" color="white" sx={{ mt: 1 }}>
                        Mã số doanh nghiệp: 6969696969. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày 30/02/2025
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
