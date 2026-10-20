'use client'

import { useState } from 'react'
import { ProviderPickerSheet, type ProviderType } from './provider-picker-sheet'
import { FeeEcoScreen } from './fee-eco-screen'
import { FeeTheSscScreen } from './fee-the-ssc-screen'
import { FeeInvoiceSelectScreen, type FeeStudentMeta } from './fee-invoice-select-screen'
import { FeeInvoiceConfirmScreen } from './fee-invoice-confirm-screen'
import { type InvoiceItem } from '../invoice/invoice-data'

interface FeeAppProps {
  studentId: string
  onBack: () => void
}

type FeeScreenState = 'eco' | 'ssc' | 'invoice-select' | 'invoice-confirm'

export function FeeApp({ studentId, onBack }: FeeAppProps) {
  // Dong hoc phi 1: Bottom sheet appears near top of screen immediately on entry
  const [showProviderPicker, setShowProviderPicker] = useState(true)
  const [screen, setScreen] = useState<FeeScreenState>('eco')
  const [hasChosenProvider, setHasChosenProvider] = useState(false)

  // Student and invoice payment state
  const [studentMeta, setStudentMeta] = useState<FeeStudentMeta>({
    name: 'Huỳnh Ngọc Trúc Như',
    code: '9192930041',
    className: 'Lớp 11A1',
    school: 'Trường FINVIET',
    providerName: 'ECO School',
  })
  const [selectedItems, setSelectedItems] = useState<InvoiceItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [periodLabel, setPeriodLabel] = useState('Hóa đơn tháng 4/2026')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur))
    }, 2800)
  }

  // Handle provider selection from "Chọn nhà cung cấp" sheet (Dong hoc phi 1)
  const handleSelectProvider = (providerId: ProviderType) => {
    setHasChosenProvider(true)
    setShowProviderPicker(false)

    if (providerId === 'eco') {
      setStudentMeta((prev) => ({
        ...prev,
        providerName: 'ECO School',
      }))
      setScreen('eco')
    } else if (providerId === 'ssc') {
      setStudentMeta((prev) => ({
        ...prev,
        providerName: 'TheSSC',
      }))
      setScreen('ssc')
    } else {
      // VinaID fallback to ECO or lookup
      setStudentMeta((prev) => ({
        ...prev,
        providerName: 'VinaID',
      }))
      setScreen('eco')
    }
  }

  // Handle closing the provider picker sheet
  const handleCloseProviderPicker = () => {
    setShowProviderPicker(false)
    if (!hasChosenProvider) {
      onBack()
    }
  }

  // Handle student card selection or valid code submit from ECO School (Dong hoc phi 2 -> Dong hoc phi 3)
  const handleSelectEcoStudent = (
    selectedId: string,
    studentName: string,
    studentCode: string
  ) => {
    setStudentMeta({
      name: studentName,
      code: studentCode,
      className: 'Lớp 11A1',
      school: 'Trường FINVIET',
      providerName: 'ECO School',
    })
    setScreen('invoice-select')
  }

  // Handle SSC code submit from TheSSC (Dong hoc phi 4 -> Dong hoc phi 3)
  const handleSuccessSscInvoices = (info: {
    name: string
    code: string
    className: string
    school: string
  }) => {
    setStudentMeta({
      name: info.name,
      code: info.code,
      className: info.className,
      school: info.school,
      providerName: 'TheSSC',
    })
    setScreen('invoice-select')
  }

  // Handle confirm invoices selection in Dong hoc phi 3 -> Dong hoc phi 4 Review/Confirm
  const handleConfirmInvoiceSelection = (
    items: InvoiceItem[],
    total: number,
    period: string
  ) => {
    setSelectedItems(items)
    setTotalAmount(total)
    setPeriodLabel(period)
    setScreen('invoice-confirm')
  }

  // Handle final payment success
  const handleProceedPayment = () => {
    triggerToast('Thanh toán thành công')
    setTimeout(() => {
      onBack()
    }, 1500)
  }

  return (
    <div className="fee-app-root">
      {/* Screen 1: Dong hoc phi 2 (ECO School) */}
      {screen === 'eco' && (
        <FeeEcoScreen
          onBack={onBack}
          onChangeProvider={() => setShowProviderPicker(true)}
          onSelectStudentInvoice={handleSelectEcoStudent}
        />
      )}

      {/* Screen 2: Dong hoc phi 4 (TheSSC) */}
      {screen === 'ssc' && (
        <FeeTheSscScreen
          onBack={onBack}
          onChangeProvider={() => setShowProviderPicker(true)}
          onSuccessCheckInvoices={handleSuccessSscInvoices}
        />
      )}

      {/* Screen 3: Dong hoc phi 3 (Invoice Details Selection) */}
      {screen === 'invoice-select' && (
        <FeeInvoiceSelectScreen
          student={studentMeta}
          onBack={() => {
            if (studentMeta.providerName === 'TheSSC') {
              setScreen('ssc')
            } else {
              setScreen('eco')
            }
          }}
          onConfirmPayment={handleConfirmInvoiceSelection}
        />
      )}

      {/* Screen 4: Invoice Review & Confirm Payment */}
      {screen === 'invoice-confirm' && (
        <FeeInvoiceConfirmScreen
          student={studentMeta}
          selectedItems={selectedItems}
          totalAmount={totalAmount}
          periodLabel={periodLabel}
          onBack={() => setScreen('invoice-select')}
          onProceed={handleProceedPayment}
        />
      )}

      {/* Dong hoc phi 1: Provider Picker Bottom Sheet (High top docking) */}
      {showProviderPicker && (
        <ProviderPickerSheet
          onSelect={handleSelectProvider}
          onClose={handleCloseProviderPicker}
        />
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          style={{
            position: 'absolute',
            bottom: 92,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99,
          }}
        >
          <div className="eco-toast" style={{ font: 'var(--text-body-s)' }}>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  )
}

export { ProviderPickerSheet } from './provider-picker-sheet'
export { FeeEcoScreen } from './fee-eco-screen'
export { FeeTheSscScreen } from './fee-the-ssc-screen'
export { FeeInvoiceSelectScreen } from './fee-invoice-select-screen'
export { FeeInvoiceConfirmScreen } from './fee-invoice-confirm-screen'
