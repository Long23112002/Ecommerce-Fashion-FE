import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import React from "react";
import { OrderMeThodLabel } from "../../../enum/OrderStatusEnum";
import PaymentMethodEnum from "../../../enum/PaymentMethodEnum";

const OrderPaymentDetails = ({ order }: { order: any }) => {
  const rows = [
    {
      label: "Tổng tiền hàng",
      value: order?.totalMoney ? `${order?.totalMoney?.toLocaleString("vi-VN")} ₫` : "N/A",
    },
    {
      label: "Giảm giá",
      value: order?.discountId ? `- ${order?.discountId?.toLocaleString("vi-VN")} ₫` : "0 ₫",
    },
    {
      label: "Phí vận chuyển",
      value: order?.moneyShip ? `${order?.moneyShip?.toLocaleString("vi-VN")} ₫` : "0 ₫",
    },
    {
      label: "Thành tiền",
      value: order?.finalPrice ? `${order?.finalPrice?.toLocaleString("vi-VN")} ₫` : "0 ₫",
      isTotal: true,
    },
    {
      label: "Phương thức thanh toán",
      value:
        OrderMeThodLabel[order?.paymentMethod as PaymentMethodEnum] || "N/A",
    },
  ];

  return (
    
      <div className="mt-8">
        <Typography variant="h6" gutterBottom>
          Thành tiền
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="order payment details">
            <TableHead>
             
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      borderRight: "2px dashed #ccc",
                      paddingLeft: "10px",
                    }}
                  >
                    {row.label}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: row.isTotal ? 'bold' : 'normal', color: row.isTotal ? 'red' : 'inherit' }}>
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
  );
};

export default OrderPaymentDetails;
