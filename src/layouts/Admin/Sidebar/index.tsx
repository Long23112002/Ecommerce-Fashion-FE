import React from 'react';
import {Menu, Sidebar as SidebarPro, SubMenu} from 'react-pro-sidebar';
import MenuItem from './MenuItem';
import {Box, IconButton, useMediaQuery} from '@mui/material';

interface IProps {
    collapse: boolean,
    toggled: boolean,
    broken: boolean,
    setToggled: React.Dispatch<React.SetStateAction<boolean>>,
    setBroken: React.Dispatch<React.SetStateAction<boolean>>
}

const AdminSidebar: React.FC<IProps> = ({collapse, toggled, setToggled, setBroken, broken}) => {

    const xs = useMediaQuery('(max-width: 356px)');

    return (
        <SidebarPro
            collapsed={collapse}
            collapsedWidth="5em"
            width={broken ? xs ? '90vw' : '320px' : "20em"}
            backgroundColor='#141A21'
            rootStyles={{
                border: '0',
                height: '100vh',
                position: 'sticky',
                top: 0,
                zIndex: 1
            }}
            customBreakPoint="1000px"
            toggled={toggled}
            onBackdropClick={() => setToggled(false)}
            onBreakPoint={setBroken}
        >
            <Box
                display='flex'
                justifyContent='space-between'
            >
                <Box
                    width={55}
                    sx={{
                        overflow: 'hidden',
                        borderRadius: 2,
                        marginLeft: collapse ? 1.5 : 4,
                        marginTop: 3
                    }}
                >
                    <img src="/logo.png" alt="" width='100%'/>
                </Box>
                <IconButton
                    sx={{
                        display: broken ? 'block' : 'none'
                    }}
                    onClick={() => setToggled(false)}
                >
                    <i className="fa-solid fa-xmark text-white m-2"/>
                </IconButton>
            </Box>
            <Menu
                rootStyles={{
                    marginTop: 20
                }}
                menuItemStyles={{
                    subMenuContent: {
                        backgroundColor: '#141A21'
                    },
                    button: {
                        padding: 20,
                        margin: 2,
                        marginRight: collapse ? 2.5 : 10,
                        marginLeft: collapse ? 2.5 : 10,
                        borderRadius: 5,
                        color: 'white',
                        ":hover": {
                            backgroundColor: '#1D242B'
                        }
                    }
                }}
            >


                <SubMenu
                    label="User manager"
                    icon={<i className='fa-solid fa-file-signature fs-5'/>}
                >

                    <MenuItem
                        to='/admin/user/role'
                        collapse={collapse}
                    >
                        Manager roles
                    </MenuItem>

                    <MenuItem
                        to='/admin/special-attributes'
                        collapse={collapse}
                    >
                        Manager user
                    </MenuItem>


                    <MenuItem
                        to='/admin/special-attributes'
                        collapse={collapse}
                    >
                        Manager permission
                    </MenuItem>


                </SubMenu>

                <MenuItem
                    to='/admin/product'
                    icon={<i className='fa-solid fa-shirt fs-5'/>}
                >
                    Product
                </MenuItem>
                <SubMenu
                    label="Attributes"
                    icon={<i className='fa-solid fa-file-signature fs-5'/>}
                >
                    <MenuItem
                        to='/admin/color'
                        collapse={collapse}
                    >
                        Color
                    </MenuItem>
                    <MenuItem
                        to='/admin/size'
                        collapse={collapse}
                    >
                        Size
                    </MenuItem>
                    <MenuItem
                        to='/admin/brand'
                        collapse={collapse}
                    >
                        Brand
                    </MenuItem>
                    <MenuItem
                        to='/admin/origin'
                        collapse={collapse}
                    >
                        Origin
                    </MenuItem>
                    <MenuItem
                        to='/admin/material'
                        collapse={collapse}
                    >
                        Material
                    </MenuItem>
                    <MenuItem
                        to='/admin/category'
                        collapse={collapse}
                    >
                        Category
                    </MenuItem>
                    <MenuItem
                        to='/admin/special-attributes'
                        collapse={collapse}
                    >
                        Special attributes
                    </MenuItem>
                </SubMenu>



            </Menu>
        </SidebarPro>
    )
}

export default AdminSidebar