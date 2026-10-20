export interface InvoiceItem {
  id: string
  name: string
  amount: number
}

export interface InvoiceGroup {
  id: string
  monthLabel: string
  totalAmount: number
  items: InvoiceItem[]
  isPaid?: boolean
}

// 14 Unpaid invoices (default for student)
export const MOCK_UNPAID_INVOICES: InvoiceGroup[] = [
  {
    id: 'inv-unpaid-09-2026',
    monthLabel: 'Hóa đơn tháng 9/2026',
    totalAmount: 1135000,
    items: [
      { id: 'item-09-1', name: 'Học phí 09/2026', amount: 160000 },
      { id: 'item-09-2', name: 'Tiền ăn tháng 09/2026', amount: 630000 },
      { id: 'item-09-3', name: 'Phí trả trẻ trễ tháng 08/2026', amount: 60000 },
      { id: 'item-09-4', name: 'Học phẩm', amount: 50000 },
      { id: 'item-09-5', name: 'Nước uống', amount: 10000 },
      { id: 'item-09-6', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-09-7', name: 'Đồng phục', amount: 150000 },
    ],
  },
  {
    id: 'inv-unpaid-08-2026',
    monthLabel: 'Hóa đơn tháng 8/2026',
    totalAmount: 1180000,
    items: [
      { id: 'item-08-1', name: 'Học phí 08/2026', amount: 160000 },
      { id: 'item-08-2', name: 'Tiền ăn tháng 08/2026', amount: 735000 },
      { id: 'item-08-3', name: 'Học phẩm', amount: 50000 },
      { id: 'item-08-4', name: 'Nước uống', amount: 10000 },
      { id: 'item-08-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-08-6', name: 'Đồng phục', amount: 150000 },
    ],
  },
  {
    id: 'inv-unpaid-07-2026',
    monthLabel: 'Hóa đơn tháng 7/2026',
    totalAmount: 1245000,
    items: [
      { id: 'item-07-1', name: 'Học phí 07/2026', amount: 160000 },
      { id: 'item-07-2', name: 'Tiền ăn tháng 07/2026', amount: 770000 },
      { id: 'item-07-3', name: 'Phí trả trẻ trễ tháng 06/2026', amount: 30000 },
      { id: 'item-07-4', name: 'Học phẩm', amount: 50000 },
      { id: 'item-07-5', name: 'Nước uống', amount: 10000 },
      { id: 'item-07-6', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-07-7', name: 'Đồng phục', amount: 150000 },
    ],
  },
  {
    id: 'inv-unpaid-06-2026',
    monthLabel: 'Hóa đơn tháng 6/2026',
    totalAmount: 1245000,
    items: [
      { id: 'item-06-1', name: 'Học phí 06/2026', amount: 160000 },
      { id: 'item-06-2', name: 'Tiền ăn tháng 06/2026', amount: 770000 },
      { id: 'item-06-3', name: 'Phí trả trẻ trễ tháng 05/2026', amount: 30000 },
      { id: 'item-06-4', name: 'Học phẩm', amount: 50000 },
      { id: 'item-06-5', name: 'Nước uống', amount: 10000 },
      { id: 'item-06-6', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-06-7', name: 'Đồng phục', amount: 150000 },
    ],
  },
  {
    id: 'inv-unpaid-05-2026',
    monthLabel: 'Hóa đơn tháng 5/2026',
    totalAmount: 1100000,
    items: [
      { id: 'item-05-1', name: 'Học phí 05/2026', amount: 160000 },
      { id: 'item-05-2', name: 'Tiền ăn tháng 05/2026', amount: 700000 },
      { id: 'item-05-3', name: 'Học phẩm', amount: 50000 },
      { id: 'item-05-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-05-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-05-6', name: 'Bảo hiểm', amount: 100000 },
    ],
  },
  {
    id: 'inv-unpaid-04-2026',
    monthLabel: 'Hóa đơn tháng 4/2026',
    totalAmount: 1150000,
    items: [
      { id: 'item-04-1', name: 'Học phí 04/2026', amount: 160000 },
      { id: 'item-04-2', name: 'Tiền ăn tháng 04/2026', amount: 750000 },
      { id: 'item-04-3', name: 'Học phẩm', amount: 50000 },
      { id: 'item-04-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-04-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-04-6', name: 'Dã ngoại', amount: 100000 },
    ],
  },
  {
    id: 'inv-unpaid-03-2026',
    monthLabel: 'Hóa đơn tháng 3/2026',
    totalAmount: 1120000,
    items: [
      { id: 'item-03-1', name: 'Học phí 03/2026', amount: 160000 },
      { id: 'item-03-2', name: 'Tiền ăn tháng 03/2026', amount: 720000 },
      { id: 'item-03-3', name: 'Học phẩm', amount: 50000 },
      { id: 'item-03-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-03-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-03-6', name: 'Sự kiện 8/3', amount: 100000 },
    ],
  },
  {
    id: 'inv-unpaid-02-2026',
    monthLabel: 'Hóa đơn tháng 2/2026',
    totalAmount: 980000,
    items: [
      { id: 'item-02-1', name: 'Học phí 02/2026', amount: 160000 },
      { id: 'item-02-2', name: 'Tiền ăn tháng 02/2026', amount: 580000 },
      { id: 'item-02-3', name: 'Học phẩm', amount: 50000 },
      { id: 'item-02-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-02-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-02-6', name: 'Quà Tết', amount: 100000 },
    ],
  },
  {
    id: 'inv-unpaid-01-2026',
    monthLabel: 'Hóa đơn tháng 1/2026',
    totalAmount: 1100000,
    items: [
      { id: 'item-01-1', name: 'Học phí 01/2026', amount: 160000 },
      { id: 'item-01-2', name: 'Tiền ăn tháng 01/2026', amount: 700000 },
      { id: 'item-01-3', name: 'Học phẩm', amount: 50000 },
      { id: 'item-01-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-01-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-01-6', name: 'Đồng phục ấm', amount: 100000 },
    ],
  },
  {
    id: 'inv-unpaid-12-2025',
    monthLabel: 'Hóa đơn tháng 12/2025',
    totalAmount: 1200000,
    items: [
      { id: 'item-12-1', name: 'Học phí 12/2025', amount: 160000 },
      { id: 'item-12-2', name: 'Tiền ăn tháng 12/2025', amount: 800000 },
      { id: 'item-12-3', name: 'Học phẩm', amount: 50000 },
      { id: 'item-12-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-12-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-12-6', name: 'Lễ Noel', amount: 100000 },
    ],
  },
  {
    id: 'inv-unpaid-11-2025',
    monthLabel: 'Hóa đơn tháng 11/2025',
    totalAmount: 1150000,
    items: [
      { id: 'item-11-1', name: 'Học phí 11/2025', amount: 160000 },
      { id: 'item-11-2', name: 'Tiền ăn tháng 11/2025', amount: 750000 },
      { id: 'item-11-3', name: 'Học phẩm', amount: 50000 },
      { id: 'item-11-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-11-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-11-6', name: 'Ngày 20/11', amount: 100000 },
    ],
  },
  {
    id: 'inv-unpaid-10-2025',
    monthLabel: 'Hóa đơn tháng 10/2025',
    totalAmount: 1120000,
    items: [
      { id: 'item-10-1', name: 'Học phí 10/2025', amount: 160000 },
      { id: 'item-10-2', name: 'Tiền ăn tháng 10/2025', amount: 720000 },
      { id: 'item-10-3', name: 'Học phẩm', amount: 50000 },
      { id: 'item-10-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-10-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-10-6', name: 'Trung thu', amount: 100000 },
    ],
  },
  {
    id: 'inv-unpaid-09-2025',
    monthLabel: 'Hóa đơn tháng 9/2025',
    totalAmount: 1300000,
    items: [
      { id: 'item-09p-1', name: 'Học phí 09/2025', amount: 160000 },
      { id: 'item-09p-2', name: 'Tiền ăn tháng 09/2025', amount: 700000 },
      { id: 'item-09p-3', name: 'Học phẩm đầu năm', amount: 150000 },
      { id: 'item-09p-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-09p-5', name: 'Lớp năng khiếu', amount: 75000 },
      { id: 'item-09p-6', name: 'Đồng phục nhập học', amount: 200000 },
    ],
  },
  {
    id: 'inv-unpaid-08-2025',
    monthLabel: 'Hóa đơn tháng 8/2025',
    totalAmount: 1050000,
    items: [
      { id: 'item-08p-1', name: 'Học phí 08/2025', amount: 160000 },
      { id: 'item-08p-2', name: 'Tiền ăn hè 08/2025', amount: 650000 },
      { id: 'item-08p-3', name: 'Học phẩm hè', amount: 50000 },
      { id: 'item-08p-4', name: 'Nước uống', amount: 15000 },
      { id: 'item-08p-5', name: 'Lớp bơi', amount: 175000 },
    ],
  },
]

// Paid invoices (matching Hoa don 5)
export const MOCK_PAID_INVOICES: InvoiceGroup[] = [
  {
    id: 'inv-paid-09-2026',
    monthLabel: 'Hóa đơn tháng 9/2026',
    totalAmount: -6000,
    isPaid: true,
    items: [
      { id: 'pitem-1', name: 'Học phẩm', amount: -1000 },
      { id: 'pitem-2', name: 'Nước uống', amount: -2000 },
      { id: 'pitem-3', name: 'Lớp năng khiếu', amount: -3000 },
    ],
  },
  {
    id: 'inv-paid-07-2026',
    monthLabel: 'Hóa đơn tháng 7/2026',
    totalAmount: -1105000,
    isPaid: true,
    items: [
      { id: 'pitem-4', name: 'Học phí 07/2026', amount: -160000 },
      { id: 'pitem-5', name: 'Tiền ăn tháng 07/2026', amount: -630000 },
      { id: 'pitem-6', name: 'Phí trả trẻ trễ tháng 06/2026', amount: -30000 },
      { id: 'pitem-7', name: 'Học phẩm', amount: -50000 },
      { id: 'pitem-8', name: 'Nước uống', amount: -10000 },
      { id: 'pitem-9', name: 'Lớp năng khiếu', amount: -75000 },
      { id: 'pitem-10', name: 'Đồng phục', amount: -150000 },
    ],
  },
]

export function formatVND(n: number): string {
  if (n < 0) {
    return '-' + Math.abs(n).toLocaleString('vi-VN') + 'đ'
  }
  return n.toLocaleString('vi-VN') + 'đ'
}
