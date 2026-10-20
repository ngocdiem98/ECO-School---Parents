'use client'

import React, { useState } from 'react'
import { TransferRecipient } from './types'
import { TransferScreen1, MOCK_RECIPIENT_THU } from './transfer-screen-1'
import { TransferScreen2 } from './transfer-screen-2'
import { TransferScreen4 } from './transfer-screen-4'
import { TransferScreen5 } from './transfer-screen-5'
import { TransferScreen6 } from './transfer-screen-6'

interface TransferMoneyFlowProps {
  onBack: () => void
  initialRecipient?: TransferRecipient
  initialAmount?: number
  onNavigateToFee?: () => void
  onNavigateToPostpaid?: () => void
}

export function TransferMoneyFlow({
  onBack,
  initialRecipient = MOCK_RECIPIENT_THU,
  initialAmount = 0,
  onNavigateToFee,
  onNavigateToPostpaid,
}: TransferMoneyFlowProps) {
  const [step, setStep] = useState<1 | 2 | 4 | 6>(1)
  const [recipient, setRecipient] = useState<TransferRecipient>(initialRecipient)
  const [amount, setAmount] = useState<number>(initialAmount)
  const [note, setNote] = useState<string>('')
  const [selectedSourceId, setSelectedSourceId] = useState<string>('eco')
  const [showPinModal, setShowPinModal] = useState<boolean>(false)

  // Step 1: Select recipient
  const handleSelectRecipient = (rec: TransferRecipient) => {
    setRecipient(rec)
    setStep(2)
  }

  // Step 2: Amount entered -> Continue to Confirmation
  const handleContinueToConfirm = () => {
    if (amount > 0) {
      setStep(4)
    }
  }

  // Step 4: Confirm -> Open PIN Modal (Screen 5)
  const handleOpenPin = () => {
    setShowPinModal(true)
  }

  // Step 5: PIN Success -> Move to Screen 6 (Kết quả giao dịch)
  const handlePinSuccess = () => {
    setShowPinModal(false)
    setStep(6)
  }

  // Step 6 Actions
  const handleTransferMore = () => {
    setAmount(0)
    setNote('')
    setStep(1)
  }

  return (
    <div className="eco-tr-container">
      {step === 1 && (
        <TransferScreen1
          onBack={onBack}
          onSelectRecipient={handleSelectRecipient}
        />
      )}

      {step === 2 && (
        <TransferScreen2
          recipient={recipient}
          amount={amount}
          note={note}
          onBack={() => setStep(1)}
          onAmountChange={setAmount}
          onNoteChange={setNote}
          onContinue={handleContinueToConfirm}
        />
      )}

      {step === 4 && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <TransferScreen4
            recipient={recipient}
            amount={amount}
            note={note}
            selectedSourceId={selectedSourceId}
            onSelectSource={setSelectedSourceId}
            onBack={() => setStep(2)}
            onConfirm={handleOpenPin}
          />

          {/* Modal PIN (Screen 5) overlaid on top of Screen 4 */}
          <TransferScreen5
            isOpen={showPinModal}
            onClose={() => setShowPinModal(false)}
            onSuccess={handlePinSuccess}
          />
        </div>
      )}

      {step === 6 && (
        <TransferScreen6
          recipient={recipient}
          amount={amount || 100000}
          onGoHome={onBack}
          onTransferMore={handleTransferMore}
          onNavigateToFee={onNavigateToFee}
          onNavigateToPostpaid={onNavigateToPostpaid}
        />
      )}
    </div>
  )
}
