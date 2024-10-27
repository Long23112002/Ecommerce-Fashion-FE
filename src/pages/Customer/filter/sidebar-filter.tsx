import { Box, Typography } from '@mui/material'
import React from 'react'
import { Menu, SubMenu } from 'react-pro-sidebar'
import MenuItem from '../../../layouts/Admin/Sidebar/MenuItem'
import { useIsMobile, useUserHeaderSize } from '../../../hook/useSize'
import { Category } from '../../../types/Category'
import { Brand } from '../../../types/brand'
import '../../../styles/scrollbar.css'

interface IProps {
    categories: Category[],
    brands: Brand[]
}

const SidebarFilter: React.FC<IProps> = ({ categories, brands }) => {

    const isMobile = useIsMobile()
    const headerHeight = useUserHeaderSize()

    const renderCategories = (categories: Category[]) => {
        return categories.map(c =>
            c.subCategories
                ?
                <SubMenu
                    key={c.id}
                    defaultOpen={!isMobile}
                    label={<Typography sx={{ fontSize: 18 }} variant='h6'>{c.name}</Typography>}
                    style={{ paddingLeft: 15 * ((c.lever || 1) + 1) }}
                >
                    {renderCategories(c.subCategories)}
                </SubMenu>
                :
                <MenuItem
                    key={c.id}
                    collapse={false}
                    styleItem={{ paddingLeft: 12.5 * ((c.lever || 1) + 1) }}
                    sxTypo={{ fontSize: 18 }}
                //  onClick={}  handle gì gì đó
                >
                    {c.name}
                </MenuItem>
        );
    }

    const renderBrands = (brands: Brand[]) => {
        return brands.map(b =>
            <MenuItem
                key={b.id}
                collapse={false}
                styleItem={{ paddingLeft: 30 }}
                sxTypo={{ fontSize: 18 }}
            //  onClick={}  handle gì gì đó
            >
                {b.name}
            </MenuItem>
        );
    }

    return (
        <Box className='shadow-section-2 custom-scrollbar'
            sx={{
                backgroundColor: 'white',
                p: {
                    xs: 2,
                    md: 3
                },
                my: 2,
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
                    <MenuItem
                        collapse={false}
                        styleItem={{ paddingLeft: 30 }}
                        sxTypo={{ fontSize: 18 }}
                        noTypo
                    //  onClick={}  handle gì gì đó
                    >
                        <Typography variant='h6' sx={{ fontSize: 18 }}>Tất cả</Typography>
                    </MenuItem>
                    {renderCategories(categories)}
                </SubMenu>
            </Menu>

            <Menu>
                <SubMenu
                    defaultOpen={!isMobile}
                    label={<Typography variant='h6'>Thương hiệu</Typography>}
                    style={{ paddingLeft: 15 }}
                >
                    <MenuItem
                        collapse={false}
                        styleItem={{ paddingLeft: 30 }}
                        sxTypo={{ fontSize: 18 }}
                        noTypo
                    //  onClick={}  handle gì gì đó
                    >
                        <Typography variant='h6' sx={{ fontSize: 18 }}>Tất cả</Typography>
                    </MenuItem>
                    {renderBrands(brands)}
                </SubMenu>
            </Menu>

        </Box>
    )
}

export default SidebarFilter