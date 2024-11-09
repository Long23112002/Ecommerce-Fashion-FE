import { Box, Grid, MenuItem, Select, Typography, SelectChangeEvent } from '@mui/material';
import React from 'react';
import SearchInput from '../../../components/SearchInput';
import { ISelectedFilter } from './page';

interface IProps {
    selectedFilter: ISelectedFilter,
    setSelectedFilter: React.Dispatch<React.SetStateAction<ISelectedFilter>>
}

const TopbarFilter: React.FC<IProps> = ({ selectedFilter, setSelectedFilter }) => {

    const handleChangeSort = (event: SelectChangeEvent<any>) => {
        setSelectedFilter(prev => ({
            ...prev,
            sort: event.target.value
        }))
    };

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFilter(prev => ({
            ...prev,
            keyword: e.target.value
        }))
    }

    return (
        <Box
            className='shadow-section-2'
            sx={{
                backgroundColor: 'white',
                p: 2,
                my: 2,
                borderRadius: { xs: 4, md: 5 },
            }}
        >
            <Grid container alignItems="center" columnSpacing={5} rowSpacing={2}>
                <Grid item xs={12} md={8}>
                    <SearchInput
                        onChange={handleChangeSearch}
                        // onClick={}
                        height={33}
                        sx={{ display: 'flex' }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box display='flex' alignItems='center'>
                        <Typography variant="body1" sx={{ marginRight: 1 }}>
                            Sắp xếp theo
                        </Typography>
                        <Select
                            value={selectedFilter.sort}
                            onChange={handleChangeSort}
                            variant="outlined"
                            displayEmpty
                            sx={{
                                height: 33,
                                borderRadius: 4,
                                flexGrow: 1
                            }}
                        >
                            <MenuItem value="newest">Mới nhất</MenuItem>
                            <MenuItem value="name">Tên A-Z</MenuItem>
                            <MenuItem value="price-asc">Giá tăng dần</MenuItem>
                            <MenuItem value="price-desc">Giá giảm dần</MenuItem>
                        </Select>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TopbarFilter;
