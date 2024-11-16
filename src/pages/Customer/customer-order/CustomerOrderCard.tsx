import { Card, Row, Col, Divider } from "antd";
import { Box, Button, Checkbox, Container, Grid, Typography } from "@mui/material";

const OrderDetailCard = ({ order, detail }: any) => {
  return (
    <Box style={{ marginBottom: 10 }}>
      <Row gutter={16} key={detail.id}>
        <Col span={3}>
          <img
            src={detail.productDetail.images?.[0]?.url}
            alt={detail.productDetail.product?.name}
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        </Col>
        <Col span={15}>
          <Typography variant="h5">
            {detail.productDetail.product?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-2">
            {`Phân loại hàng: ${detail.productDetail.size?.name}, ${detail.productDetail.color?.name}`}
          </Typography>
          <Typography className="mt-2">{`x${detail.quantity}`}</Typography>
        </Col>
        <Col span={6}>
          <Grid container direction="column" justifyContent="space-between" style={{ height: "100%" }}>
            <Grid item style={{ textAlign: "right" }} className="mt-5">
              <Typography variant="h6" color="info.main">
                {`${detail.price.toLocaleString("vi-VN")} ₫`}
              </Typography>
            </Grid>
          </Grid>
        </Col>
      </Row>
      <Divider style={{ margin: '10px 0' }} />

    </Box>
  );
};

export default OrderDetailCard;
