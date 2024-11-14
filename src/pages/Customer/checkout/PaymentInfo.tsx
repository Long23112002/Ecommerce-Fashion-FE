import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material"
import React, { useState } from 'react'
import { OrderUpdateRequest } from '../../../types/Order'
import { payOrder } from "../../../api/OrderApi"
import { useNavigate } from "react-router-dom"

interface IProps {
  orderRequest: OrderUpdateRequest,
  setOrderRequest: React.Dispatch<React.SetStateAction<OrderUpdateRequest>>
}

const PaymentInfo: React.FC<IProps> = ({ orderRequest, setOrderRequest }) => {
  const navigate = useNavigate()
  const [value, setValue] = useState<'Tiền mặt' | 'VNPAY'>("Tiền mặt")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === 'Tiền mặt' || value === 'VNPAY') {
      setValue(value)
    }
  }

  const handlePay = async () => {
    console.log(orderRequest)
    const data = await payOrder(orderRequest)
    if (data) {
      window.location.assign(data)
    }
  }

  return (
    <Box
      className='shadow-section-2'
      sx={{
        backgroundColor: 'white',
        p: {
          xs: 1,
          md: 3
        },
        my: 2,
        borderRadius: 4
      }}
    >
      <Typography variant="h6" gutterBottom>
        Phương thức thanh toán
      </Typography>

      <FormControl component="fieldset" fullWidth>
        <RadioGroup value={value} onChange={handleChange}>
          <Paper variant="outlined" sx={{ mb: 1, p: 2 }}>
            <FormControlLabel
              value="Tiền mặt"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <Box>
                    <Typography>Tiền mặt</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thanh toán khi nhận được hàng
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ margin: 0, width: "100%" }}
            />
          </Paper>

          <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
            <FormControlLabel
              value="VNPAY"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <Typography>Ví điện tử VNPAY</Typography>
                  <Box sx={{ ml: "auto" }}>
                    <img
                      src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                      alt="VNPAY logo"
                      width={40}
                      height={40}
                    />
                  </Box>
                </Box>
              }
              sx={{ margin: 0, width: "100%" }}
            />
          </Paper>
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
        }}
        onClick={handlePay}
      >
        Thanh toán bằng {value}
      </Button>
    </Box>
  )
}

export default PaymentInfo
