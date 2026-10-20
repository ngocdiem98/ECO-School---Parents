import { MOCK_STUDENTS, type Student } from '@/lib/mock-data'

export interface SpendingStudent {
  id: string
  name: string
  code: string
  balance: number
}

export interface SpendingTransaction {
  id: string
  studentId: string
  title: string
  timestamp: string
  amount: number
  type: 'topup' | 'spend'
  date: string // YYYY-MM-DD for date filtering
}

// The roster and the transactions come from the app's own students
// (Student.spending, read at render time so a top-up shows up immediately).
export function getSpendingStudents(): SpendingStudent[] {
  return MOCK_STUDENTS.map((s) => ({ id: s.id, name: s.name, code: s.code, balance: s.balance }))
}

const pad = (n: number) => String(n).padStart(2, '0')

export function getSpendingTransactions(student: Student): SpendingTransaction[] {
  return [...student.spending]
    .sort((a, b) => b.at.localeCompare(a.at))
    .map((t) => ({
      id: t.id,
      studentId: student.id,
      title: t.title,
      timestamp: `${t.at.slice(8, 10)}/${t.at.slice(5, 7)}/${t.at.slice(0, 4)} - ${t.at.slice(11, 16)}`,
      amount: t.amount,
      type: t.amount > 0 ? 'topup' : 'spend',
      date: t.at.slice(0, 10),
    }))
}

// ISO date `months` months before today (period filters 3 / 6 tháng).
export function isoMonthsAgo(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 'dd/mm/yyyy' (date picker output) -> ISO.
export function ddmmyyyyToIso(v: string): string {
  const [d, m, y] = v.split('/')
  return `${y}-${m}-${d}`
}
