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

export const yearLabel = (startYear: number) => `${startYear} - ${startYear + 1}`

export function billsInYear(student: Student, startYear: number) {
  return student.bills.filter((b) => inSchoolYear(b.year, b.month, startYear))
}

// School years the student has bills in, newest first; the current school year
// is always offered even when it has no bills yet.
export function availableYears(student: Student, now: Date): number[] {
  const years = new Set<number>([schoolYearStart(now)])
  student.bills.forEach((b) => years.add(b.month >= 8 ? b.year : b.year - 1))
  return [...years].sort((a, b) => b - a)
}

// Last month the "Thanh toán theo tháng" chart can reach: today for the
// current school year, July for a finished one.
export function yearAnchor(now: Date, startYear: number): Date {
  return startYear === schoolYearStart(now) ? now : new Date(startYear + 1, 6, 1)
}

// Paid amount and bill counts of one school year (the current one by default).
// A bill counts as "Đã thanh toán" once at least one of its items is paid
// (fully or partly paid), and as "Chưa thanh toán" when none is paid and at
// least one item still needs paying. `hasOpenItems` tells whether anything is
// left to pay in the year (partly paid bills included).
export function summarizeYear(student: Student, now: Date, startYear = schoolYearStart(now)) {
  const bills = billsInYear(student, startYear)
  const paidItems = bills.flatMap((b) => b.items.filter((it) => it.paid))
  const paidCount = bills.filter((b) => b.items.some((it) => it.paid)).length
  const unpaidCount = bills.filter((b) => !b.items.some((it) => it.paid) && b.items.some((it) => !it.paid)).length
  return {
    startYear,
    bills,
    paidItems,
    paidAmount: sumItems(paidItems),
    totalBills: paidCount + unpaidCount,
    paidCount,
    unpaidCount,
    hasOpenItems: bills.some((b) => b.items.some((it) => !it.paid)),
  }
}
