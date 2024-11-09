import Button from '@mui/joy/Button'
import { Box, Container, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Menu, SubMenu } from 'react-pro-sidebar'
import { fetchAllBrands } from '../../../api/BrandApi'
import { fetchAllCategories } from '../../../api/CategoryApi'
import { useUserHeaderSize } from '../../../hook/useSize'
import MenuItem from '../../../layouts/Admin/Sidebar/MenuItem'
import '../../../styles/scrollbar.css'
import { Category } from '../../../types/Category'
import { Brand } from '../../../types/brand'
import { isDarkColor } from '../../../utils/isDarkColor'
import { Color } from '../../Admin/Attributes/color/color'
import { fetchAllColors } from '../../Admin/Attributes/color/colorManagament'
import { Size } from '../../Admin/Attributes/size/size'
import { ISelectedFilter } from './page'
import { fetchAllSizes } from '../../Admin/Attributes/size/sizeManagament'

interface IProps {
    selectedFilter: ISelectedFilter,
    setSelectedFilter: React.Dispatch<React.SetStateAction<ISelectedFilter>>
}

const SidebarFilter: React.FC<IProps> = ({ selectedFilter, setSelectedFilter }) => {

    const headerHeight = useUserHeaderSize()
    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [colors, setColors] = useState<Color[]>([])

    const [sizes, setSizes] = useState<Size[]>([])

    const fetchCategories = async () => {
        const res = await fetchAllCategories();
        setCategories([...res.data])
    }

    const fetchBrands = async () => {
        const res = await fetchAllBrands();
        setBrands([...res.data])
    }

    const fetchColors = async () => {
        const res = await fetchAllColors('', 8, 0);
        setColors([...res.data])
    }

    const fetchSizes = async () => {
        const res = await fetchAllSizes();
        setSizes([...res.data])
    }

    useEffect(() => {
        fetchCategories()
        fetchBrands()
        fetchColors()
        fetchSizes()
    }, [])

    const handleSelectCategories = (id: number | undefined) => {
        if (!id) return;
        setSelectedFilter(prev => ({
            ...prev,
            idCategory: prev.idCategory === id
                ? null
                : id
        }));
    };

    const handleSelectBrands = (id: number | undefined) => {
        if (!id) {
            setSelectedFilter(prev => ({
                ...prev,
                brands: []
            }))
        } else {
            setSelectedFilter(prev => ({
                ...prev,
                idBrand: prev.idBrand.includes(id)
                    ? prev.idBrand.filter(b => b !== id)
                    : [...prev.idBrand, id]
            }))
        }
    }

    const handleSelectColor = (id: number | undefined) => {
        if (!id) {
            setSelectedFilter(prev => ({
                ...prev,
                colors: []
            }));
        } else {
            setSelectedFilter(prev => ({
                ...prev,
                colors: prev.colors.includes(id)
                    ? prev.colors.filter(c => c !== id)
                    : [...prev.colors, id],
            }));
        }
    };

    const handleSelectSize = (id: number | undefined) => {
        if (!id) {
            setSelectedFilter(prev => ({
                ...prev,
                sizes: []
            }));
        } else {
            setSelectedFilter(prev => ({
                ...prev,
                sizes: prev.sizes.includes(id)
                    ? prev.colors.filter(c => c !== id)
                    : [...prev.sizes, id]
            }))
        }
    }

    const renderCategories = (categories: Category[]) => {
        return categories.map(c =>
            c.subCategories?.length ? (
                <SubMenu
                    key={c.id}
                    label={
                        <Typography
                            sx={{
                                fontSize: 18,
                            }}
                            variant="h6"
                            onClick={() => handleSelectCategories(c.id)}
                        >
                            {c.name}
                        </Typography>
                    }
                    style={{ paddingLeft: 15 * ((c.lever || 1) + 1) }}
                >
                    {renderCategories(c.subCategories)}
                </SubMenu>
            ) : (
                <MenuItem
                    key={c.id}
                    collapse={false}
                    styleItem={{
                        marginTop: 5,
                        paddingLeft: 12.5 * ((c.lever || 1) + 1),
                        backgroundColor: selectedFilter.idCategory === c.id ? '#F3F3F3' : ''
                    }}
                    sxTypo={{
                        fontSize: 18,
                    }}
                    onClick={() => handleSelectCategories(c.id)}
                >
                    {c.name}
                </MenuItem>
            )
        );
    };


    const brandItem = (b?: Brand) => {
        return (
            <MenuItem
                key={b?.id}
                collapse={false}
                styleItem={{
                    borderRadius: 10,
                    marginTop: 5,
                    paddingLeft: 30,
                    backgroundColor: selectedFilter.idBrand.includes(b?.id || -1) ? '#F3F3F3' : ''
                }}
                sxTypo={{ fontSize: 18 }}
                onClick={() => handleSelectBrands(b?.id)}
            >
                {b?.name || 'Tất cả'}
            </MenuItem>
        )
    }

    const renderBrands = (brands: Brand[]) => {
        return brands.map(b => brandItem(b));
    }

    const colorItem = (c?: Color) => {
        const isSelected = c ? selectedFilter.colors.includes(c.id || -1) : false

        return (
            <Grid item xs={4} key={c?.id}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        aspectRatio: '1/1',
                        border: '1px solid transparent',
                        transition: 'border-color 0.3s, transform 0.3s',
                        '&:hover': {
                            borderColor: c ? c.code : 'transparent',
                            borderImage: c ? 'none' : 'linear-gradient(135deg, red, orange, yellow, green, blue, indigo, violet) 1',
                        },
                        padding: 1,
                        borderRadius: '10%',
                    }}
                    onClick={() => handleSelectColor(c?.id)}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '60%',
                            aspectRatio: '1/1',
                            maxWidth: 35,
                            minWidth: 20,
                            border: '1px solid #c8c8c8',
                            backgroundColor: c?.code,
                            backgroundImage: c
                                ? ''
                                : 'linear-gradient(135deg, red 10%,orange,yellow,green,blue,indigo,violet)',
                            borderRadius: '50%',
                            marginBottom: 1,
                        }}
                    >
                        {isSelected &&
                            <i
                                className="fa-solid fa-check"
                                style={{ color: isDarkColor(c?.code + '') ? 'white' : 'black' }}
                            />
                        }
                    </Box>

                    <Typography variant='caption' align="center">{c?.name || 'tất cả'}</Typography>
                </Box>
            </Grid >
        )
    }

    const renderColors = (colors: Color[]) => {
        return colors.map(c => colorItem(c));
    }

    const sizeItem = (s?: Size) => {
        const isSelected = s ? selectedFilter.sizes.includes(s.id || -1) : false;

        return (
            <Grid item xs={4} key={s?.id}>
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                        whiteSpace: 'nowrap',
                        backgroundColor: isSelected ? '#E3EFFB' : '#FFFFFF',
                        borderColor: isSelected ? '#1976D2' : 'rgba(0, 0, 0, 0.23)',
                    }}
                    onClick={() => handleSelectSize(s?.id)}
                >
                    {s?.name || 'Tất cả'}
                </Button>
            </Grid>
        );
    };


    const renderSizes = (sizes: Size[]) => {
        return sizes.map(s => sizeItem(s));
    }

    return (
        <Box className='shadow-section-2 custom-scrollbar'
            sx={{
                backgroundColor: 'white',
                p: {
                    xs: 2,
                    md: 3
                },
                mt: 2,
                borderRadius: {
                    xs: 4,
                    md: 5
                },
                position: 'sticky',
                top: ((headerHeight || 64) + 18),
                maxHeight: `calc(100vh - ${((headerHeight || 64) + 80)}px)`,
                overflowY: 'auto',
            }}
        >
            <Typography variant='h6' mb={2}>Lọc sản phẩm</Typography>

            <Menu>
                <SubMenu
                    label={<Typography variant='h6'>Danh mục</Typography>}
                    style={{ paddingLeft: 15 }}
                >
                    {renderCategories(categories)}
                </SubMenu>
            </Menu>

            <Menu>
                <SubMenu
                    label={<Typography variant='h6'>Thương hiệu</Typography>}
                    style={{ paddingLeft: 15 }}
                >
                    {renderBrands(brands)}
                </SubMenu>
            </Menu>

            <Menu>
                <SubMenu
                    label={<Typography variant='h6'>Màu sắc</Typography>}
                    style={{ paddingLeft: 15 }}
                >
                    <Container maxWidth='xl'>
                        <Grid container spacing={1}>
                            {colorItem()}
                            {renderColors(colors)}
                        </Grid>
                    </Container>
                </SubMenu>
            </Menu>

            <Menu>
                <SubMenu
                    label={<Typography variant='h6'>Kích cỡ</Typography>}
                    style={{ paddingLeft: 15 }}
                >
                    <Box p={2}>
                        <Grid container spacing={1}>
                            {sizeItem()}
                            {renderSizes(sizes)}
                        </Grid>
                    </Box>
                </SubMenu>
            </Menu>

        </Box>
    )
}


export default SidebarFilter