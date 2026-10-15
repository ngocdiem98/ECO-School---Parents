'use client'

import { useState } from 'react'
import { MOCK_STUDENTS, getStudent, sumItems, type Bill } from '@/lib/mock-data'
import { StudentPickerSheet } from '@/components/parents/shared/student-picker-sheet'
import { BillOverviewScreen } from './bill-overview-screen'
import { availableYears, billsInYear, schoolYearStart } from './bill-year'
import { BillInvoicePdfScreen } from './bill-invoice-pdf-screen'
import { BillListScreen, type BillTab } from './bill-list-screen'
import { BillSelectScreen } from './bill-select-screen'
import { BillConfirmScreen } from './bill-confirm-screen'
import { BillResultScreen, type BillPaymentResult } from './bill-result-screen'

interface HoaDonAppProps {
  studentId: string
  onBack: () => void
  // "Trang chủ" on Kết quả giao dịch.
  onGoHome: () => void
}

type HoaDonScreen = 'overview' | 'list' | 'invoice' | 'select' | 'confirm' | 'result'

// "Hóa đơn" has no vanilla counterpart in scripts/app.js — it is built from
// the screenshots in the task (list → Thông tin hóa đơn → Xác nhận giao
// dịch). The list is the entry screen. The "Đã thanh toán" tab links to Tổng
// quan hóa đơn đã đóng (back returns to that tab), and "Xem hóa đơn" on a
// fully paid bill opens its e-invoice PDF. Like AbsenceApp, it mutates the
// student's mock data in place (marks the chosen BillItems paid) and bumps a
// version counter to re-render. Paying ends on Kết quả giao dịch.
//
// `selected` holds BillItem ids across the select/confirm screens. It always
// starts empty: both the main CTA and "Thanh toán ngay" on a partly paid bill
// open the select screen with every open item unchecked.
export function HoaDonApp({ studentId, onBack, onGoHome }: HoaDonAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [screen, setScreen] = useState<HoaDonScreen>('list')
  const [tab, setTab] = useState<BillTab>('unpaid')
  // School year filter on the list (start year); the overview follows it.
  const [year, setYear] = useState(() => schoolYearStart(new Date()))
  const [focusBillId, setFocusBillId] = useState<string | null>(null)
  const [scrollToList, setScrollToList] = useState(false)
  // Where the select screen's back button returns to.
  const [selectOrigin, setSelectOrigin] = useState<'list' | 'overview'>('list')
  const [invoiceBill, setInvoiceBill] = useState<Bill | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showPicker, setShowPicker] = useState(false)
  const [result, setResult] = useState<BillPaymentResult | null>(null)
  const [, setVersion] = useState(0)

  const student = getStudent(selectedStudentId)
  if (!student) return null

  const selectedItems = student.bills.flatMap((b) => b.items.filter((it) => selected.has(it.id)))

  const handlePay = () => {
    // Snapshot what is being paid before marking it paid, for the result screen.
    const groups = student.bills
      .map((bill) => ({ bill, items: bill.items.filter((it) => selected.has(it.id)) }))
      .filter((g) => g.items.length > 0)
    setResult({
      txId: '2859' + Math.floor(86000 + Math.random() * 900),
      timeStr:
        new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
        ' ' +
        new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      amount: sumItems(selectedItems),
      groups,
    })
    selectedItems.forEach((it) => {
      it.paid = true
    })
    setVersion((v) => v + 1)
    setScreen('result')
  }

  // Changing the school year reloads whichever screen shows it (list or overview).
  const changeYear = (y: number) => {
    setYear(y)
    setSelected(new Set())
    setFocusBillId(null)
  }

  const openList = (nextTab: BillTab, billId: string | null = null, scroll = false) => {
    setTab(nextTab)
    setFocusBillId(billId)
    setScrollToList(scroll)
    setScreen('list')
  }

  return (
    <>
      {screen === 'overview' && (
        <BillOverviewScreen
          // Remount per student/year so the chart/donut selections reset.
          key={`${student.id}-${year}`}
          student={student}
          year={year}
          years={availableYears(student, new Date())}
          onYearChange={changeYear}
          onBack={() => {
            setScrollToList(false)
            setScreen('list')
          }}
          // "Xem chi tiết ›": paid tab, scrolled down to the list.
          onOpenPaid={() => openList('paid', null, true)}
        />
      )}

      {screen === 'list' && (
        <BillListScreen
          student={student}
          tab={tab}
          year={year}
          years={availableYears(student, new Date())}
          onYearChange={changeYear}
          focusBillId={focusBillId}
          scrollToList={scrollToList}
          onTabChange={(t) => {
            setFocusBillId(null)
            setTab(t)
          }}
          onBack={onBack}
          onOpenOverview={() => setScreen('overview')}
          onChangeStudent={() => setShowPicker(true)}
          onPay={() => {
            setSelected(new Set())
            setSelectOrigin('list')
            setScreen('select')
          }}
          onViewInvoice={(bill) => {
            setInvoiceBill(bill)
            setScreen('invoice')
          }}
        />
      )}

      {screen === 'invoice' && invoiceBill && (
        <BillInvoicePdfScreen
          bill={invoiceBill}
          onBack={() => {
            // Land back on the same bill in the list.
            setFocusBillId(invoiceBill.id)
            setScreen('list')
          }}
        />
      )}

      {screen === 'select' && (
        <BillSelectScreen
          student={student}
          bills={billsInYear(student, year)}
          selected={selected}
          onSelectedChange={setSelected}
          onBack={() => setScreen(selectOrigin)}
          onContinue={() => setScreen('confirm')}
        />
      )}

      {screen === 'confirm' && (
        <BillConfirmScreen
          student={student}
          bills={student.bills}
          selected={selected}
          total={sumItems(selectedItems)}
          onBack={() => setScreen('select')}
          onContinue={handlePay}
        />
      )}

      {showPicker && (
        <StudentPickerSheet
          students={MOCK_STUDENTS.filter((s) => s.bills.length > 0)}
          selectedStudentId={selectedStudentId}
          onSelect={(s) => {
            setSelectedStudentId(s.id)
            setYear(schoolYearStart(new Date()))
            setSelected(new Set())
            openList('unpaid')
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      {screen === 'result' && result && (
        <BillResultScreen
          student={student}
          result={result}
          onGoHome={onGoHome}
          onNewTransaction={() => {
            setSelected(new Set())
            openList('unpaid')
          }}
        />
      )}
    </>
  )
}
