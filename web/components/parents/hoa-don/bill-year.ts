import { sumItems, type Student } from '@/lib/mock-data'

// School-year helpers shared by the Hóa đơn list (summary card) and the
// Tổng quan hóa đơn screen.

// Vietnamese school year runs Aug → Jul: Oct 2026 and Mar 2027 both belong to
// "2026 - 2027".
export function schoolYearStart(now: Date): number {
  return now.getMonth() + 1 >= 8 ? now.getFullYear() : now.getFullYear() - 1
}

export function inSchoolYear(year: number, month: number, startYear: number): boolean {
  const key = year * 12 + month
  return key >= startYear * 12 + 8 && key <= (startYear + 1) * 12 + 7
}

export const fmtDong = (n: number) => `${n.toLocaleString('vi-VN')} đồng`

// Paid amount and bill counts of the current school year. "Đã thanh toán"
// counts fully paid bills; a bill with any open item counts as "Chưa thanh
// toán", so the two counts add up to `totalBills`.
export function summarizeYear(student: Student, now: Date) {
  const startYear = schoolYearStart(now)
  const bills = student.bills.filter((b) => inSchoolYear(b.year, b.month, startYear))
  const paidItems = bills.flatMap((b) => b.items.filter((it) => it.paid))
  const unpaidCount = bills.filter((b) => b.items.some((it) => !it.paid)).length
  return {
    startYear,
    bills,
    paidItems,
    paidAmount: sumItems(paidItems),
    totalBills: bills.length,
    unpaidCount,
    paidCount: bills.length - unpaidCount,
  }
}
