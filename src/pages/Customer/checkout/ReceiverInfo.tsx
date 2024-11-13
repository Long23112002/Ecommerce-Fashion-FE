import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllDistrictByProvinceId, getAllProvinces, getAllWardByDistrictId, availableServices, shippingOrderFee } from '../../../api/GHTKApi'
import { userSelector } from '../../../redux/reducers/UserReducer'
import District from '../../../types/District'
import { OrderRequest } from '../../../types/Order'
import Province from '../../../types/Province'
import Ward from '../../../types/Ward'
import { Height } from '@mui/icons-material'

const WEIGHT = 500
const HEIGHT = 5

interface IProps {
  orderRequest: OrderRequest,
  setOrderRequest: React.Dispatch<React.SetStateAction<OrderRequest>>
}

const ReceiverInfo: React.FC<IProps> = ({ orderRequest, setOrderRequest }) => {

  const user = useSelector(userSelector)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null)
  const [specificAddress, setSpecificAddress] = useState<string>('')

  const handleSelectProvince = (_: any, value: Province | null) => {
    if (value) {
      setSelectedProvince({ ...value })
    }
  }

  const handleSelectDistrict = (_: any, value: District | null) => {
    if (value) {
      setSelectedDistrict({ ...value })
    }
  }

  const handleSelectWard = (_: any, value: Ward | null) => {
    if (value) {
      setSelectedWard({ ...value })
    }
  }

  const handleSpecificAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSpecificAddress(value)
    setOrderRequest(prev => ({
      ...prev,
      address: `${value || ''}-${selectedWard?.WardName || ''}-${selectedDistrict?.DistrictName || ''}-${selectedProvince?.ProvinceName || ''}`
    }))
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target
    setOrderRequest(prev => ({
      ...prev,
      [id]: value
    }))
  }



  useEffect(() => {
    const fetchProvinces = async () => {
      const { data } = await getAllProvinces()
      setProvinces([...data])
    }
    fetchProvinces()
  }, [])

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince?.ProvinceID) {
        const { data } = await getAllDistrictByProvinceId(selectedProvince.ProvinceID)
        setDistricts([...data])
      }
    }
    fetchDistricts()
  }, [selectedProvince])

  useEffect(() => {
    if (!selectedDistrict || !selectedDistrict.DistrictID) return

    const fetchWards = async () => {
      const { data } = await getAllWardByDistrictId(selectedDistrict.DistrictID)
      setWards([...data])
    }
    const callShippingOrder = async () => {
      // const { data } = await availableServices(selectedDistrict.DistrictID)
    }
    fetchWards()
    callShippingOrder()
  }, [selectedDistrict])

  useEffect(() => {
    if (!selectedWard || !selectedWard.WardCode) return
    setOrderRequest(prev => ({
      ...prev,
      address: `${specificAddress || ''}-${selectedWard?.WardName || ''}-${selectedDistrict?.DistrictName || ''}-${selectedProvince?.ProvinceName || ''}`
    }))
    if (!selectedDistrict || !selectedDistrict.DistrictID) return
    const callShippingOrderFee = async () => {
      const weight = 2 * WEIGHT
      const height = 2 * HEIGHT
      const { data } = await shippingOrderFee(10000, selectedDistrict.DistrictID, selectedWard.WardCode, height, weight)
      setOrderRequest(prev => ({
        ...prev,
        moneyShip: data.total
      }))
    }
    callShippingOrderFee()
  }, [selectedWard])

  useEffect(() => {
    if (user.id != -1) {
      setOrderRequest(prev => ({
        ...prev,
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => { console.log(orderRequest) }, [orderRequest])


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
        borderRadius: 4,
        width: '100%'
      }}
    >
      <Typography variant='h6' mb={1.5}>Thông tin người nhận</Typography>
      <TextField
        id="fullName"
        size='small'
        label="Họ và tên"
        fullWidth
        value={orderRequest.fullName}
        sx={{ mb: 3 }}
        onChange={handleChange}
      />
      <TextField
        id="phoneNumber"
        size='small'
        label="Số điện thoại"
        fullWidth
        value={orderRequest.phoneNumber}
        sx={{ mb: 3 }}
        onChange={handleChange}
      />
      <TextField
        id="email"
        size='small'
        label="Email"
        fullWidth
        value={orderRequest.email}
        sx={{ mb: 3 }}
        onChange={handleChange}
      />
      <Autocomplete
        size='small'
        disablePortal
        options={provinces}
        getOptionLabel={(option) => option.ProvinceName}
        fullWidth
        renderInput={(params) => <TextField {...params} label="Tỉnh/Thành phố" />}
        sx={{ mb: 3 }}
        onChange={handleSelectProvince}
      />
      <Autocomplete
        size='small'
        disablePortal
        options={districts}
        getOptionLabel={(option) => option.DistrictName}
        fullWidth
        renderInput={(params) => <TextField {...params} label="Quận/Huyện" />}
        sx={{ mb: 3 }}
        onChange={handleSelectDistrict}
      />
      <Autocomplete
        size='small'
        disablePortal
        options={wards}
        getOptionLabel={(option) => option.WardName}
        fullWidth
        renderInput={(params) => <TextField {...params} label="Xã/Phường" />}
        sx={{ mb: 3 }}
        onChange={handleSelectWard}
      />
      <TextField
        id="specificAddress"
        size='small'
        label="Địa chỉ cụ thể"
        fullWidth
        value={specificAddress}
        onChange={handleSpecificAddress}
        sx={{ mb: 3 }}
      />
      <TextField
        id='note'
        size='small'
        label="Ghi chú"
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 3 }}
        onChange={handleChange}
      />
    </Box>
  )
}

export default ReceiverInfo