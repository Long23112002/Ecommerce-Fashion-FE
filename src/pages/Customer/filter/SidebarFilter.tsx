import Button from '@mui/joy/Button'
import { Box, Container, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Menu, SubMenu } from 'react-pro-sidebar'
import { useIsMobile, useUserHeaderSize } from '../../../hook/useSize'
import MenuItem from '../../../layouts/Admin/Sidebar/MenuItem'
import '../../../styles/scrollbar.css'
import { Category } from '../../../types/Category'
import { Brand } from '../../../types/brand'
import { Color } from '../../Admin/Attributes/color/color'
import { Size } from '../../Admin/Attributes/size/size'
import { ISelectedFilter } from './page'

interface IProps {
    selectedFilter: ISelectedFilter,
    setSelectedFilter: React.Dispatch<React.SetStateAction<ISelectedFilter>>
}

const SidebarFilter: React.FC<IProps> = ({ selectedFilter, setSelectedFilter }) => {

    const isMobile = useIsMobile()
    const headerHeight = useUserHeaderSize()

    const [categories, setCategories] = useState<Category[]>([
        {
            id: 1,
            name: 'Áo',
            lever: 1,
            subCategories: [
                {
                    id: 2,
                    name: 'Áo vest',
                    lever: 2,
                },
                {
                    id: 3,
                    name: 'Áo phao',
                    lever: 2,
                },
                {
                    id: 4,
                    name: 'Áo khoác',
                    lever: 2
                }
            ]
        },
        {
            id: 5,
            name: 'Quần',
            lever: 1,
            subCategories: [
                {
                    id: 6,
                    name: 'Quần jean',
                    lever: 2,
                },
                {
                    id: 7,
                    name: 'Quần short',
                    lever: 2,
                },
                {
                    id: 8,
                    name: 'Quần xì',
                    lever: 2,
                }
            ]
        }
    ])

    const [brands, setBrands] = useState<Brand[]>([
        { id: 1, name: 'Đôn chề' },
        { id: 2, name: 'Luôn vui tươi' },
        { id: 3, name: 'FashionVN' },
        { id: 4, name: 'Lacoste' },
        { id: 5, name: 'Gu chì' },
    ])

    const [colors, setColors] = useState<Color[]>([
        { id: 1, name: 'đen', code: '#000000' },
        { id: 2, name: 'đỏ', code: '#e7352b' },
        { id: 3, name: 'vàng', code: '#FFC107' },
        { id: 4, name: 'xanh lá', code: '#4CAF50' },
        { id: 5, name: 'cam', code: '#FF9800' },
        { id: 6, name: 'hồng', code: '#E91E63' },
        { id: 7, name: 'nâu', code: '#795548' },
        { id: 8, name: 'trắng', code: '#F6F6F6' },
    ])

    const [sizes, setSizes] = useState<Size[]>([
        { id: 1, name: 'S' },
        { id: 2, name: 'M' },
        { id: 3, name: 'L' },
        { id: 4, name: 'XL' },
        { id: 5, name: 'XL' },
        { id: 6, name: 'XXL' },
        { id: 7, name: 'XNXX' },
    ])

    const handleSelectCategories = (id: number | undefined) => {
        if (!id) return;
        setSelectedFilter(prev => ({
            ...prev,
            category: prev.category === id
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
                brands: prev.brands.includes(id)
                    ? prev.brands.filter(b => b !== id)
                    : [...prev.brands, id]
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
            c.subCategories ? (
                <SubMenu
                    key={c.id}
                    defaultOpen={!isMobile}
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
                        backgroundColor: selectedFilter.category === c.id ? '#F3F3F3' : ''
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
                    backgroundColor: selectedFilter.brands.includes(b?.id || -1) ? '#F3F3F3' : ''
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
                        borderColor: isSelected ? c?.code : '',
                        padding: 1,
                        borderRadius: '10%',
                    }}
                    onClick={() => handleSelectColor(c?.id)}
                >
                    <Box
                        sx={{
                            width: '60%',
                            aspectRatio: '1/1',
                            maxWidth: 35,
                            minWidth: 20,
                            backgroundColor: c?.code,
                            backgroundImage: c ? '' : 'linear-gradient(135deg, red 10%,orange,yellow,green,blue,indigo,violet)',
                            borderRadius: '50%',
                            marginBottom: 1
                        }}
                    />
                    <Typography variant='caption' align="center">{c?.name || 'tất cả'}</Typography>
                </Box>
            </Grid >
        )
    }

    const renderColors = (colors: Color[]) => {
        return colors.slice(0, 8).map(c => colorItem(c));
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
                    defaultOpen={!isMobile}
                    label={<Typography variant='h6'>Danh mục</Typography>}
                    style={{ paddingLeft: 15 }}
                >
                    {renderCategories(categories)}
                </SubMenu>
            </Menu>

            <Menu>
                <SubMenu
                    defaultOpen={!isMobile}
                    label={<Typography variant='h6'>Thương hiệu</Typography>}
                    style={{ paddingLeft: 15 }}
                >
                    {renderBrands(brands)}
                </SubMenu>
            </Menu>

            <Menu>
                <SubMenu
                    defaultOpen={!isMobile}
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
                    defaultOpen={!isMobile}
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