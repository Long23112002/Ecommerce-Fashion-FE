import React from "react";
import { Menu, Sidebar as SidebarPro, SubMenu } from "react-pro-sidebar";
import MenuItem from "./MenuItem";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import {DesktopOutlined, PieChartOutlined} from "@ant-design/icons";

interface IProps {
  collapse: boolean;
  toggled: boolean;
  broken: boolean;
  setToggled: React.Dispatch<React.SetStateAction<boolean>>;
  setBroken: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar: React.FC<IProps> = ({
  collapse,
  toggled,
  setToggled,
  setBroken,
  broken,
}) => {
  const xs = useMediaQuery("(max-width: 356px)");

  return (
    <SidebarPro
      collapsed={collapse}
      collapsedWidth="5em"
      width={broken ? (xs ? "90vw" : "320px") : "20em"}
      backgroundColor="#141A21"
      rootStyles={{
        border: "0",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
      customBreakPoint="1000px"
      toggled={toggled}
      onBackdropClick={() => setToggled(false)}
      onBreakPoint={setBroken}
    >
      <Box display="flex" justifyContent="space-between">
        <Box
          width={55}
          sx={{
            overflow: "hidden",
            borderRadius: 2,
            marginLeft: collapse ? 1.5 : 4,
            marginTop: 3,
          }}
        >
          <img src="/logo.png" alt="" width="100%" />
        </Box>
        <IconButton
          sx={{
            display: broken ? "block" : "none",
          }}
          onClick={() => setToggled(false)}
        >
          <i className="fa-solid fa-xmark text-white m-2" />
        </IconButton>
      </Box>
      <Menu
        rootStyles={{
          marginTop: 20,
        }}
        menuItemStyles={{
          subMenuContent: {
            backgroundColor: "#141A21",
          },
          button: {
            padding: 20,
            margin: 2,
            marginRight: collapse ? 2.5 : 10,
            marginLeft: collapse ? 2.5 : 10,
            borderRadius: 5,
            color: "white",
            ":hover": {
              backgroundColor: "#1D242B",
            },
          },
        }}
      >
        <MenuItem
            to="/admin/statistics"
            icon={<PieChartOutlined /> }
        >
         Tổng quan
        </MenuItem>
        <SubMenu
          label="Quản lí người dùng"
          icon={<i className="fa-solid fa-file-signature fs-5" />}
        >
          <MenuItem
            to="/admin/user/role"
            icon={<i className="fa-solid fa-user-shield" />}
            collapse={collapse}>
            Vai trò
          </MenuItem>

          <MenuItem
            to="/admin/user"
            icon={<i className="fa-solid fa-users" />}
            collapse={collapse}>
            Người dùng
          </MenuItem>
        </SubMenu>

        <MenuItem
          to="/admin/store"
          icon={<DesktopOutlined /> }
        >
          Bán hàng tại quầy
        </MenuItem>

        <MenuItem
          to="/admin/product"
          icon={<i className="fa-solid fa-shirt fs-5" />}
        >
          Quản lí sản phẩm
        </MenuItem>
        <SubMenu
          label="Quản lí thuộc tính"
          icon={<i className="fa-solid fa-file-signature fs-5" />}
        >
          <MenuItem
            to="/admin/color"
            icon={<i className="fa-solid fa-palette"></i>}
            collapse={collapse}>
            Màu sắc
          </MenuItem>
          <MenuItem
            to="/admin/size"
            icon={<i className="fa-solid fa-pen-ruler"></i>}
            collapse={collapse}>
            Kích thước
          </MenuItem>
          <MenuItem
            to="/admin/brand"
            icon={<i className="fa-solid fa-trademark"></i>}
            collapse={collapse}>
            Thương hiệu
          </MenuItem>
          <MenuItem
            to="/admin/origin"
            icon={<i className="fa-solid fa-location-dot"></i>}
            collapse={collapse}>
            Xuất xứ
          </MenuItem>
          <MenuItem
            to="/admin/material"
            icon={<i className="fa-solid fa-feather-pointed"></i>}
            collapse={collapse}>
            Chất liệu
          </MenuItem>
          <MenuItem
            to="/admin/category"
            icon={<i className="fa-solid fa-layer-group"></i>}
            collapse={collapse}>
            Danh mục
          </MenuItem>
          <MenuItem to="/admin/special-attributes" collapse={collapse}>
            Thuộc tính đặc biệt
          </MenuItem>
        </SubMenu>
        <MenuItem
          to="/admin/order"
          icon={<i className="fa-solid fa-file-invoice fs-5" />}
        >
          Đơn hàng
        </MenuItem>
        <MenuItem
          to="/admin/chat"
          icon={<i className="fa-solid fa-message fs-5" />}
        >
          Nhắn tin
        </MenuItem>
        <SubMenu
          label="Quản lí khuyến mãi"
          icon={<i className="fa-solid fa-gift fs-5" />}
        >
          <MenuItem
            to="/admin/promotion"
            icon={<i className="fa-solid fa-tags"></i>}
            collapse={collapse}
          >
            Đợt giảm giá
          </MenuItem>
          <MenuItem
            to="/admin/discount"
            icon={<i className="fa-solid fa-ticket"></i>}
            collapse={collapse}
          >
            Phiếu giảm giá
          </MenuItem>
        </SubMenu>
      </Menu>
    </SidebarPro>
  );
};

export default AdminSidebar;
