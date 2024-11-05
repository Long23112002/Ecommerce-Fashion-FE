import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Avatar, Box, Button, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUserData, storeUserData } from '../../../api/AuthApi';
import { uploadImage } from '../../../api/ImageAPI';
import { updateUserInfo } from '../../../api/UserApi';
import { useUserAction } from '../../../hook/useUserAction';
import { userSelector } from '../../../redux/reducers/UserReducer';
import { UserInfoRequest } from '../../../types/User';

const UserInfoPage: React.FC = () => {
  const userAction = useUserAction();
  const user = useSelector(userSelector);
  const [fileImage, setFileImage] = useState<File | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfoRequest>({
    fullName: '',
    phoneNumber: '',
    birth: null,
    gender: 'OTHER',
    avatar: '',
  });

  const [userInfoError, setUserInfoError] = useState({
    fullName: '',
    phoneNumber: '',
    birth: '',
  });

  useEffect(() => {
    setUserInfo({
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      birth: user.birth ? new Date(user.birth) : null,
      gender: user.gender || 'OTHER',
      avatar: user.avatar || ''
    });
  }, [user]);

  const validateUserInfo = () => {
    let isValid = true;
    const errors = { fullName: '', phoneNumber: '', birth: '' };

    if (!userInfo.fullName) {
      errors.fullName = 'Tên không được trống';
      isValid = false;
    } else if (userInfo.fullName.length < 3) {
      errors.fullName = 'Tên phải có ít nhất 3 ký tự';
      isValid = false;
    }

    if (!userInfo.phoneNumber) {
      errors.phoneNumber = 'Số điện thoại không được trống';
      isValid = false;
    } else if (!/^\d{10,12}$/.test(userInfo.phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại phải có từ 10-12 số';
      isValid = false;
    }

    if (!userInfo.birth || dayjs().diff(dayjs(userInfo.birth), 'year') < 10) {
      errors.birth = 'Người dùng phải lớn hơn 10 tuổi';
      isValid = false;
    }

    setUserInfoError(errors);
    return isValid;
  };

  const handleChange = (field: keyof UserInfoRequest, value: string | Date) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileImage(file)
      const imageUrl = URL.createObjectURL(file);
      setUserInfo((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));
    }
  };

  const handleUpdate = async () => {
    if (!validateUserInfo()) {
      return;
    }

    if (user.id) {
      try {
        let avatarImage = null;
        if (fileImage) {
          avatarImage = await uploadImage([fileImage], user.id, 'USER')
        }

        const updatedUserInfo = {
          ...userInfo,
          avatar: avatarImage,
        };

        const result = await updateUserInfo(user.id, updatedUserInfo);
        const oldInfo = getUserData();
        const userResponse = { ...oldInfo, ...result };
        const newInfoData = {
          userResponse: { ...userResponse },
          authResponse: {
            accessToken: oldInfo.accessToken,
            refreshToken: oldInfo.refreshToken
          }
        };
        userAction.save(userResponse);
        storeUserData(newInfoData);
        toast.success('Đổi thông tin thành công');
      } catch (error: any) {
        const messages = error.response.data.message;
        if (typeof messages == 'object') {
          const firstKey = Object.keys(messages)[0];
          const firstMessage = messages[firstKey];
          toast.error(firstMessage);
          return;
        }
        toast.error(messages);
      }
    }
  };

  return (
    <Box sx={{ p: { xs: 3, sm: 5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={userInfo.avatar} sx={{ width: 100, height: 100 }} />
          <input
            accept="image/*"
            type="file"
            style={{ display: 'none' }}
            id="upload-avatar"
            onChange={handleAvatarChange}
          />
          <label htmlFor="upload-avatar">
            <IconButton component="span" sx={{ position: 'absolute', bottom: 8, right: -13, zIndex: 100 }}>
              <PhotoCameraIcon />
            </IconButton>
          </label>
        </Box>
        <Box>
          <Typography variant="h4">{user.fullName}</Typography>
          <Typography variant="subtitle1">{user.email}</Typography>
          <Typography variant="subtitle2">{user.isAdmin ? 'Quản trị viên' : 'Khách hàng'}</Typography>
        </Box>
      </Box>

      <Box component="form" noValidate autoComplete="off">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ width: '200px' }}>Họ tên:</Typography>
          <TextField
            fullWidth
            value={userInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={!!userInfoError.fullName}
            helperText={userInfoError.fullName}
            required
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ width: '200px' }}>Số điện thoại:</Typography>
          <TextField
            fullWidth
            placeholder={userInfo.phoneNumber ? 'Số điện thoại' : 'Chưa có số điện thoại'}
            value={userInfo.phoneNumber || ''}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            error={!!userInfoError.phoneNumber}
            helperText={userInfoError.phoneNumber}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ width: '200px' }}>Giới tính:</Typography>
          <Select
            value={userInfo.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            fullWidth
          >
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ width: '200px' }}>Ngày sinh: </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={userInfo.birth ? dayjs(userInfo.birth) : null}
              onChange={(newValue) => handleChange('birth', newValue ? newValue.toDate() : '')}
              slotProps={{ textField: { fullWidth: true, error: !!userInfoError.birth, helperText: userInfoError.birth } }}
              format='DD/MM/YYYY'
            />
          </LocalizationProvider>
        </Box>

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleUpdate}>
          Cập nhật thông tin
        </Button>
      </Box>
    </Box>
  );
};

export default UserInfoPage;
