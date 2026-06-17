import { Order, OrderStatus, PaymentStatus } from '../types';

const statusMap: Record<OrderStatus, string> = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao hàng',
  DELIVERED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  RETURNED: 'Trả hàng',
};

const paymentStatusMap: Record<PaymentStatus, string> = {
  PENDING: 'Chờ thanh toán',
  COMPLETED: 'Đã thanh toán',
  FAILED: 'Thanh toán lỗi',
  REFUNDED: 'Đã hoàn tiền',
};

const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const formatDateTime = (dateStr: string) => {
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

export const exportOrdersToCSV = (orders: Order[]) => {
  if (!orders || orders.length === 0) return;

  const rows: string[] = [];

  // Report Header
  rows.push(escapeCSV('DANH SÁCH ĐƠN HÀNG - HỆ THỐNG LUNE'));
  rows.push(`${escapeCSV('Thời gian xuất')},${escapeCSV(formatDateTime(new Date().toISOString()))}`);
  rows.push(`${escapeCSV('Tổng số đơn hàng')},${escapeCSV(orders.length)}`);
  rows.push(''); // Empty line

  // Columns Header
  rows.push(
    [
      escapeCSV('Mã đơn hàng'),
      escapeCSV('Khách hàng'),
      escapeCSV('Số điện thoại'),
      escapeCSV('Email'),
      escapeCSV('Phương thức thanh toán'),
      escapeCSV('Trạng thái thanh toán'),
      escapeCSV('Trạng thái đơn hàng'),
      escapeCSV('Ngày đặt'),
      escapeCSV('Giảm giá'),
      escapeCSV('Tổng tiền'),
    ].join(',')
  );

  // Rows
  orders.forEach((order) => {
    rows.push(
      [
        escapeCSV(order.id),
        escapeCSV(order.customer?.name || 'Khách vãng lai'),
        escapeCSV(order.customer?.phone || '—'),
        escapeCSV(order.customer?.email || '—'),
        escapeCSV(order.payment?.method || 'N/A'),
        escapeCSV(paymentStatusMap[order.payment?.status || 'PENDING']),
        escapeCSV(statusMap[order.status]),
        escapeCSV(formatDateTime(order.createdAt)),
        escapeCSV(order.discountAmountFormatted || order.discountAmount),
        escapeCSV(order.totalAmountFormatted || order.totalAmount),
      ].join(',')
    );
  });

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
  const filename = `LUNE_DanhSachDonHang_${dateString}.csv`;

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
