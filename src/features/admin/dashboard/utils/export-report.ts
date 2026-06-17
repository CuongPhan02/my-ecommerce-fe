import { DashboardData } from '../dashboard.api';

const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (e) {
    return dateStr;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ xử lý';
    case 'PROCESSING':
      return 'Đang xử lý';
    case 'SHIPPED':
      return 'Đang giao hàng';
    case 'DELIVERED':
      return 'Hoàn thành';
    case 'CANCELLED':
      return 'Đã hủy';
    case 'RETURNED':
      return 'Trả hàng';
    default:
      return status;
  }
};

export const exportDashboardToCSV = (data: DashboardData) => {
  if (!data) return;

  const rows: string[] = [];

  // Report Header
  rows.push(escapeCSV('BÁO CÁO HOẠT ĐỘNG KINH DOANH - HỆ THỐNG LUNE'));
  rows.push(`${escapeCSV('Thời gian xuất')},${escapeCSV(formatDate(new Date().toISOString()))}`);
  rows.push(''); // Empty line

  // Section 1: Stats Overview
  rows.push(escapeCSV('1. TỔNG QUAN CHỈ SỐ'));
  rows.push(`${escapeCSV('Chỉ số')},${escapeCSV('Giá trị')}`);
  rows.push(`${escapeCSV('Tổng doanh thu')},${escapeCSV(data.stats.totalRevenueFormatted || data.stats.totalRevenue)}`);
  rows.push(`${escapeCSV('Đơn hàng mới (tháng này)')},${escapeCSV(data.stats.newOrdersCount)}`);
  rows.push(`${escapeCSV('Tổng sản phẩm')},${escapeCSV(data.stats.totalProducts)}`);
  rows.push(`${escapeCSV('Voucher đang hoạt động')},${escapeCSV(data.stats.activeVouchers)}`);
  rows.push(''); // Empty line

  // Section 2: Revenue Overview (Monthly)
  rows.push(escapeCSV('2. TỔNG QUAN DOANH THU THEO THÁNG TRONG NĂM'));
  rows.push(`${escapeCSV('Tháng')},${escapeCSV('Doanh thu (VND)')}`);
  if (data.revenueOverview && Array.isArray(data.revenueOverview)) {
    data.revenueOverview.forEach((item) => {
      rows.push(`${escapeCSV(item.name)},${escapeCSV(item.total)}`);
    });
  }
  rows.push(''); // Empty line

  // Section 3: Sales by Category
  rows.push(escapeCSV('3. DOANH SỐ THEO DANH MỤC SẢN PHẨM'));
  if (data.salesByCategory && Array.isArray(data.salesByCategory) && data.salesByCategory.length > 0) {
    const categoriesSet = new Set<string>();
    data.salesByCategory.forEach((monthObj: any) => {
      Object.keys(monthObj).forEach((key) => {
        if (key !== 'name') {
          categoriesSet.add(key);
        }
      });
    });
    const categories = Array.from(categoriesSet);

    // Header: Tháng, Category 1, Category 2...
    rows.push(`${escapeCSV('Tháng')},${categories.map(escapeCSV).join(',')}`);

    data.salesByCategory.forEach((monthObj: any) => {
      const monthRow = [escapeCSV(monthObj.name)];
      categories.forEach((cat) => {
        monthRow.push(escapeCSV(monthObj[cat] || 0));
      });
      rows.push(monthRow.join(','));
    });
  } else {
    rows.push(escapeCSV('Không có dữ liệu'));
  }
  rows.push(''); // Empty line

  // Section 4: Recent Sales
  rows.push(escapeCSV('4. DANH SÁCH ĐƠN HÀNG GẦN ĐÂY'));
  rows.push(
    [
      escapeCSV('Mã đơn hàng'),
      escapeCSV('Khách hàng'),
      escapeCSV('Email'),
      escapeCSV('Tổng tiền (VND)'),
      escapeCSV('Trạng thái'),
      escapeCSV('Ngày tạo'),
    ].join(',')
  );

  if (data.recentSales && Array.isArray(data.recentSales)) {
    data.recentSales.forEach((order) => {
      rows.push(
        [
          escapeCSV(order.id),
          escapeCSV(order.customer?.name || 'Khách vãng lai'),
          escapeCSV(order.customer?.email || '—'),
          escapeCSV(order.totalAmountFormatted || order.totalAmount),
          escapeCSV(getStatusLabel(order.status)),
          escapeCSV(formatDate(order.createdAt)),
        ].join(',')
      );
    });
  }
  rows.push(''); // Empty line

  // Section 5: Recent Notifications/Activities
  rows.push(escapeCSV('5. LỊCH SỬ HOẠT ĐỘNG GẦN ĐÂY'));
  rows.push(
    [
      escapeCSV('Thời gian'),
      escapeCSV('Loại hoạt động'),
      escapeCSV('Tiêu đề'),
      escapeCSV('Chi tiết'),
    ].join(',')
  );

  if (data.notifications && Array.isArray(data.notifications)) {
    data.notifications.forEach((notif) => {
      rows.push(
        [
          escapeCSV(formatDate(notif.createdAt)),
          escapeCSV(notif.type),
          escapeCSV(notif.title),
          escapeCSV(notif.description),
        ].join(',')
      );
    });
  }

  // Combine rows and add UTF-8 BOM
  const csvContent = '\uFEFF' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Format Date for filename
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const dateString = `${year}${month}${date}_${hours}${minutes}${seconds}`;
  const filename = `LUNE_BaoCaoHoatDong_${dateString}.csv`;

  // Create link and download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
