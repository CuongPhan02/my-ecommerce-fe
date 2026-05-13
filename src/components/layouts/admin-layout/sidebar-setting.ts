import {
  IconBellDollar,
  IconBrandAdobe,
  IconBrowserCheck,
  IconCategory,
  IconImageInPicture,
  IconLayoutDashboard,
  IconNotification,
  IconPackages,
  IconRefreshDot,
  IconSettings,
  IconShoppingBag,
  IconTicket,
  IconUser,
  IconUserCog,
  IconUserEdit,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { SidebarData } from './types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Quản trị viên',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Công ty Acme',
      logo: GalleryVerticalEnd,
      plan: 'Doanh nghiệp',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Khởi nghiệp',
    },
  ],
  navGroups: [
    {
      title: 'Quản trị',
      items: [
        {
          title: 'Bảng điều khiển',
          url: '/admin/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Sản phẩm',
          icon: IconShoppingBag,
          items: [
            {
              title: 'Danh sách sản phẩm',
              url: '/admin/product/list',
            },
            {
              title: 'Thêm sản phẩm',
              url: '/admin/product/create',
            },
          ],
        },
        {
          title: 'Bộ sưu tập',
          icon: IconCategory,
          url: '/admin/collection',
        },
        {
          title: 'Danh mục',
          icon: IconPackages,
          url: '/admin/category',
        },
        {
          title: 'Thương hiệu',
          icon: IconBrandAdobe,
          url: '/admin/brand',
        },
        {
          title: 'Khách hàng',
          url: '/customer',
          badge: '3',
          icon: IconUser,
        },
        {
          title: 'Hoàn tiền',
          icon: IconRefreshDot,
          items: [
            {
              title: 'Yêu cầu hoàn tiền',
              url: '/admin/refund-request',
            },
            {
              title: 'Cài đặt hoàn tiền',
              url: '/admin/refund-setting',
            },
          ],
        },
      ],
    },
    {
      title: 'Nhà cung cấp',
      items: [
        {
          title: 'Doanh thu',
          icon: IconBellDollar,
          items: [
            {
              title: 'Lịch sử doanh thu',
              url: '/admin/eearning-history',
            },
            {
              title: 'Rút tiền',
              url: '/admin/payouts',
            },
            {
              title: 'Yêu cầu rút tiền',
              url: '/admin/payout-requests',
            },
            {
              title: 'Quên mật khẩu',
              url: '/forgot-password',
            },
          ],
        },
        {
          title: 'Phiếu hỗ trợ',
          url: '/admin/support-tickets',
          icon: IconTicket,
        },
      ],
    },
    {
      title: 'Khác',
      items: [
        {
          title: 'Cài đặt',
          icon: IconSettings,
          items: [
            {
              title: 'Hồ sơ',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Cài đặt tài khoản',
              url: '/admin/aacount-setting',
              icon: IconUserEdit,
            },
            {
              title: 'Cài đặt cửa hàng',
              url: '/admin/shop-settings',
              icon: IconSettings,
            },
            {
              title: 'Thông báo',
              url: '/admin/shop-settings',
              icon: IconNotification,
            },
            {
              title: 'Hiển thị',
              url: '/admin/shop-settings',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Đa phương tiện',
          icon: IconImageInPicture,
          url: '/admin/media',
        },
      ],
    },
    {
      title: 'Bảo mật',
      items: [
        {
          title: 'Nhật ký hệ thống',
          icon: IconSettings,
          url: '/admin/log',
        },
      ],
    },
  ],
}
