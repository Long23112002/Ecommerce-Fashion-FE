import Button from '@mui/joy/Button'
import { Box, Container, Grid, Slider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Menu, SubMenu } from 'react-pro-sidebar'
import { fetchAllBrands } from '../../../api/BrandApi'
import { fetchAllCategories } from '../../../api/CategoryApi'
import { fetchAllOrigins } from '../../../api/OriginApi'
import { useUserHeaderSize } from '../../../hook/useSize'
import MenuItem from '../../../layouts/Admin/Sidebar/MenuItem'
import '../../../styles/scrollbar.css'
import { Category } from '../../../types/Category'
import { Brand } from '../../../types/brand'
import { Origin } from '../../../types/origin'
import { isDarkColor } from '../../../utils/isDarkColor'
import { Color } from '../../Admin/Attributes/color/color'
import { fetchAllColors } from '../../Admin/Attributes/color/colorManagament'
import { Material } from '../../Admin/Attributes/material/material'
import { fetchAllMaterials } from '../../Admin/Attributes/material/materialManagament'
import { Size } from '../../Admin/Attributes/size/size'
import { fetchAllSizes } from '../../Admin/Attributes/size/sizeManagament'
import { ISelectedFilter } from './page'

interface IProps {
    selectedFilter: ISelectedFilter,
    setSelectedFilter: React.Dispatch<React.SetStateAction<ISelectedFilter>>
}

const SidebarFilter: React.FC<IProps> = ({ selectedFilter, setSelectedFilter }) => {

    const headerHeight = useUserHeaderSize()
    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [colors, setColors] = useState<Color[]>([])
    const [origins, setOrigins] = useState<Origin[]>([])
    const [materials, setMaterials] = useState<Material[]>([])
    const [sizes, setSizes] = useState<Size[]>([])
    const [min, setMin] = useState<number>(0)
    const [max, setMax] = useState<number>(2000000)


    useEffect(() => {
        fetchAllCategories().then(res => setCategories(res.data));
        fetchAllBrands().then(res => setBrands(res.data));
        fetchAllColors('', 8, 0).then(res => setColors(res.data));
        fetchAllSizes().then(res => setSizes(res.data));
        fetchAllMaterials().then(res => setMaterials(res.data));
        fetchAllOrigins().then(res => setOrigins(res.data));
    }, []);

    useEffect(() => {
        const { minPrice, maxPrice } = selectedFilter
        if (min == minPrice && max == maxPrice) return
        const setTimeoutPrice = setTimeout(() => {
            setSelectedFilter(prev => ({
                ...prev,
                minPrice: min,
                maxPrice: max
            }))
        }, 500)
        return () => clearTimeout(setTimeoutPrice)
    }, [min, max])

    useEffect(() => {
        setMax(selectedFilter.maxPrice || 2000000)
        setMin(selectedFilter.minPrice)
    }, [selectedFilter])

    const handleSelect = (
        id: number | undefined,
        type: keyof ISelectedFilter
    ) => {
        if (!id || !(type in selectedFilter)) return
        setSelectedFilter(prev => ({
            ...prev,
            [type]: prev[type] == id
                ? null
                : id
        }))
    }

    const handleSelectMuti = (
        id: number | undefined,
        type: 'idColors' | 'idSizes'
    ) => {
        if (!(type in selectedFilter)) return
        setSelectedFilter(prev => ({
            ...prev,
            [type]: !id
                ? []
                : prev[type].includes(id)
                    ? prev[type].filter(c => c !== id)
                    : [...prev[type], id]
        }));
    }

    const handleChangePrice = (
        _: Event,
        newValue: number | number[],
    ) => {
        if (!Array.isArray(newValue) || !newValue.every(item => typeof item === 'number')) return
        setMin(newValue[0])
        setMax(newValue[1])
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
                            onClick={() => handleSelect(c.id, 'idCategory')}
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
                    onClick={() => handleSelect(c.id, 'idCategory')}
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
                    backgroundColor: selectedFilter.idBrand == (b?.id || -1) ? '#F3F3F3' : ''
                }}
                sxTypo={{ fontSize: 18 }}
                onClick={() => handleSelect(b?.id, 'idBrand')}
            >
                {b?.name || 'Tất cả'}
            </MenuItem>
        )
    }

    const originItem = (o?: Origin) => {
        return (
            <MenuItem
                key={o?.id}
                collapse={false}
                styleItem={{
                    borderRadius: 10,
                    marginTop: 5,
                    paddingLeft: 30,
                    backgroundColor: selectedFilter.idOrigin == (o?.id || -1) ? '#F3F3F3' : ''
                }}
                sxTypo={{ fontSize: 18 }}
                onClick={() => handleSelect(o?.id, 'idOrigin')}
            >
                {o?.name || 'Tất cả'}
            </MenuItem>
        )
    }

    const materialItem = (m?: Material) => {
        return (
            <MenuItem
                key={m?.id}
                collapse={false}
                styleItem={{
                    borderRadius: 10,
                    marginTop: 5,
                    paddingLeft: 30,
                    backgroundColor: selectedFilter.idMaterial == (m?.id || -1) ? '#F3F3F3' : ''
                }}
                sxTypo={{ fontSize: 18 }}
                onClick={() => handleSelect(m?.id, 'idMaterial')}
            >
                {m?.name || 'Tất cả'}
            </MenuItem>
        )
    }

    const colorItem = (c?: Color) => {
        const isSelected = c ? selectedFilter.idColors.includes(c.id || -1) : false

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
                    onClick={() => handleSelectMuti(c?.id, 'idColors')}
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

    const sizeItem = (s?: Size) => {
        const isSelected = s ? selectedFilter.idSizes.includes(s.id || -1) : false;

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
                    onClick={() => handleSelectMuti(s?.id, 'idSizes')}
                >
                    {s?.name || 'Tất cả'}
                </Button>
            </Grid>
        );
    };

    const renders = (key: Brand[] | Origin[] | Material[], item: (k: any) => JSX.Element) => {
        return key.map(k => item(k));
    }

    const renderColors = (colors: Color[]) => {
        return colors.map(c => colorItem(c));
    }


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
                    {renders(brands, brandItem)}
                </SubMenu>
            </Menu>

            <Menu>
                <SubMenu
                    label={<Typography variant='h6'>Xuất xứ</Typography>}
                    style={{ paddingLeft: 15 }}
                >
                    {renders(origins, originItem)}
                </SubMenu>
            </Menu>

            <Menu>
                <SubMenu
                    label={<Typography variant='h6'>Chất liệu</Typography>}
                    style={{ paddingLeft: 15 }}
                >
                    {renders(materials, materialItem)}
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

            <Box sx={{ mx: 2, mt: 1 }}>
                <Typography variant='h6'>Mức giá</Typography>
                <Typography align='center'>{min.toLocaleString('vi-VN')}đ-{max.toLocaleString('vi-VN')}{max >= 2000000 ? '+' : ''}đ</Typography>
                <Slider
                    value={[min, max]}
                    onChange={handleChangePrice}
                    min={0}
                    max={2000000}
                    step={1000}
                />
            </Box>

        </Box>
    )
}


export default SidebarFilter