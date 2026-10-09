'use client'

import { useState } from 'react'
import { PROVIDERS, getStudent, type Provider } from '@/lib/mock-data'
import { ProviderPickerSheet } from './provider-picker-sheet'
import { FeeLookupScreen } from './fee-lookup-screen'
import { FeeInvoiceScreen } from './fee-invoice-screen'

interface FeeAppProps {
  studentId: string
  onBack: () => void
}

// Mirrors App.startFee()/App.chooseProvider() in ../../../scripts/app.js:
// a student with no linked invoice sees the provider picker first (as a
// sheet, before any Fee screen exists yet — closing it without picking
// exits back to wherever Fee was opened from, same as dismissing the
// vanilla sheet leaves you on the screen underneath). A linked student
// skips straight to the invoice screen.
type FeeScreen = 'lookup' | 'invoice'

export function FeeApp({ studentId, onBack }: FeeAppProps) {
  const student = getStudent(studentId)
  const [provider, setProvider] = useState<Provider>(PROVIDERS[0])
  const [showProviderPicker, setShowProviderPicker] = useState(!student?.hasLinkedInvoice)
  const [screen, setScreen] = useState<FeeScreen | null>(student?.hasLinkedInvoice ? 'invoice' : null)
  const [code, setCode] = useState('')

  if (!student) return null

  if (showProviderPicker) {
    return (
      <div className="screen">
        {screen === 'lookup' && (
          <FeeLookupScreen
            student={student}
            provider={provider}
            code={code}
            onCodeChange={setCode}
            onBack={onBack}
            onChangeProvider={() => setShowProviderPicker(true)}
            onContinue={() => setScreen('invoice')}
          />
        )}
        <ProviderPickerSheet
          onSelect={(p) => {
            setProvider(p)
            setShowProviderPicker(false)
            setScreen('lookup')
          }}
          onClose={() => (screen ? setShowProviderPicker(false) : onBack())}
        />
      </div>
    )
  }

  if (screen === 'invoice') {
    return (
      <FeeInvoiceScreen
        student={student}
        mode={student.hasLinkedInvoice ? 'linked' : 'lookup'}
        onBack={onBack}
      />
    )
  }

  return (
    <FeeLookupScreen
      student={student}
      provider={provider}
      code={code}
      onCodeChange={setCode}
      onBack={onBack}
      onChangeProvider={() => setShowProviderPicker(true)}
      onContinue={() => setScreen('invoice')}
    />
  )
}
