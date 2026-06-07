import {
  IconLayoutDashboard,
  IconShoppingBag,
  IconShoppingCart,
  IconUser,
  IconDiscount,
  IconMessageReport,
  IconImageInPicture,
  IconSettings,
  IconPackages,
  IconUserCog,
  IconUserCircle,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { SidebarData } from './types'
import { ROLES } from '~/lib/auth-utils'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@ecommerce.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Quản trị viên',
      logo: Command,
      plan: 'Hệ thống E-commerce',
    },
  ],
  navGroups: [
    {
      title: 'Tổng quan',
      items: [
        {
          title: 'Bảng điều khiển',
          url: '/admin/dashboard',
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: 'Quản lý bán hàng',
      items: [
        {
          title: 'Đơn hàng',
          icon: IconShoppingCart,
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.SALES, ROLES.VENDOR],
          items: [
            {
              title: 'Danh sách đơn hàng',
              url: '/admin/order/list',
            },
            {
              title: 'Đổi trả & Hoàn tiền',
              url: '/admin/order/refunds',
            },
          ],
        },
        {
          title: 'Sản phẩm',
          icon: IconShoppingBag,
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.SALES, ROLES.EDITOR, ROLES.INVENTORY, ROLES.VENDOR],
          items: [
            {
              title: 'Tất cả sản phẩm',
              url: '/admin/product/list',
            },
            {
              title: 'Thêm sản phẩm mới',
              url: '/admin/product/create',
            },
            {
              title: 'Bộ sưu tập',
              url: '/admin/collection',
            },
            {
              title: 'Danh mục',
              url: '/admin/category',
            },
            {
              title: 'Thương hiệu',
              url: '/admin/brand',
            },
            {
              title: 'Thuộc tính',
              url: '/admin/product/attribute',
            },
          ],
        },
        {
          title: 'Quản lý kho',
          icon: IconPackages,
          url: '/admin/inventory',
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.INVENTORY],
        },
        {
          title: 'Người dùng',
          url: '/admin/user',
          badge: '3',
          icon: IconUser,
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.SALES],
        },
      ],
    },
    {
      title: 'Tiếp thị & Nội dung',
      items: [
        {
          title: 'Khuyến mãi / Voucher',
          icon: IconDiscount,
          url: '/admin/discount',
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.SALES],
        },
        {
          title: 'Menu & Điều hướng',
          icon: IconLayoutDashboard,
          url: '/admin/menu',
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.EDITOR],
        },
        {
          title: 'Đánh giá & Bình luận',
          icon: IconMessageReport,
          url: '/admin/review',
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.SALES, ROLES.EDITOR],
        },
        {
          title: 'Thư viện Đa phương tiện',
          icon: IconImageInPicture,
          url: '/admin/media',
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF, ROLES.EDITOR, ROLES.INVENTORY, ROLES.VENDOR],
        },
      ],
    },
    {
      title: 'Cấu hình hệ thống',
      items: [
        {
          title: 'Cài đặt cửa hàng',
          icon: IconSettings,
          url: '/admin/settings',
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        },
        {
          title: 'Hồ sơ cá nhân',
          icon: IconUserCircle,
          url: '/admin/profile',
        },
        {
          title: 'Quản lý nhân viên',
          icon: IconUserCog,
          url: '/admin/staff',
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        },
      ],
    },
  ],
}

