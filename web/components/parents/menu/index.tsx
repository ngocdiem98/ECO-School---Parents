'use client'

import { useState } from 'react'
import { MenuScreen } from './menu-screen'
import type { MealIngredient } from './menu-data'
import { MenuDetailScreen } from './menu-detail-screen'
import { MenuTraceabilityScreen } from './menu-traceability-screen'

interface MenuAppProps {
  studentId: string
  onBack: () => void
}

type MenuStep = 'menu' | 'detail' | 'traceability'

// Thực đơn: weekly menu by meal, "Minh bạch thực phẩm" detail and the GS1
// ingredient traceability screen (from the reference app).
export function MenuApp({ studentId, onBack }: MenuAppProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId)
  const [step, setStep] = useState<MenuStep>('menu')
  const [ingredient, setIngredient] = useState<MealIngredient | null>(null)

  if (step === 'detail') return <MenuDetailScreen onBack={() => setStep('menu')} />
  if (step === 'traceability')
    return <MenuTraceabilityScreen ingredient={ingredient || undefined} onBack={() => setStep('menu')} />

  return (
    <MenuScreen
      studentId={selectedStudentId}
      onBack={onBack}
      onSelectStudent={setSelectedStudentId}
      onOpenTransparencyDetail={() => setStep('detail')}
      onOpenTraceabilityDetail={(ing) => {
        setIngredient(ing || null)
        setStep('traceability')
      }}
    />
  )
}

export { MenuScreen, MenuDetailScreen, MenuTraceabilityScreen }
export type { MealIngredient }
