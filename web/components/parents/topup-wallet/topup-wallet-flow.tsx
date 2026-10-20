'use client'

import React, { useState } from 'react'
import { TopupWalletScreen1, MOCK_TOPUP_SOURCES } from './topup-wallet-screen-1'
import { TopupWalletScreen2 } from './topup-wallet-screen-2'
import { TopupWalletScreen5 } from './topup-wallet-screen-5'
import { TransferScreen5 } from '../transfer/transfer-screen-5'

interface TopupWalletFlowProps {
  onBack: () => void
  initialAmount?: number
  onNavigateToFee?: () => void
  onNavigateToPostpaid?: () => void
}

export function TopupWalletFlow({
  onBack,
  initialAmount = 0,
  onNavigateToFee,
  onNavigateToPostpaid,
}: TopupWalletFlowProps) {
  const [step, setStep] = useState<1 | 2 | 4 | 5>(1)
  const [amount, setAmount] = useState<number>(initialAmount)
  const [selectedSourceId, setSelectedSourceId] = useState<string>('acb')
  const [showPinModal, setShowPinModal] = useState<boolean>(false)

  const selectedSource =
    MOCK_TOPUP_SOURCES.find((s) => s.id === selectedSourceId) || MOCK_TOPUP_SOURCES[0]

  // Step 1 -> Step 2
  const handleContinueToConfirm = () => {
    if (amount > 0) {
      setStep(2)
    }
  }

  // Step 2 -> Open PIN Modal (Screen 4)
  const handleOpenPin = () => {
    setShowPinModal(true)
  }

  // PIN Success -> Move to Screen 5 (Result)
  const handlePinSuccess = () => {
    setShowPinModal(false)
    setStep(5)
  }

  // Reset to top-up more
  const handleTopupMore = () => {
    setAmount(0)
    setStep(1)
  }

  return (
    <div className="eco-tr-container">
      {step === 1 && (
        <TopupWalletScreen1
          amount={amount}
          selectedSourceId={selectedSourceId}
          onAmountChange={setAmount}
          onSelectSource={setSelectedSourceId}
          onContinue={handleContinueToConfirm}
          onBack={onBack}
        />
      )}

      {step === 2 && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <TopupWalletScreen2
            amount={amount || 100000}
            selectedSource={selectedSource}
            onBack={() => setStep(1)}
            onConfirm={handleOpenPin}
          />

          {/* Screen 4: Modal Xác nhận mật khẩu overlaid on Step 2 */}
          <TransferScreen5
            isOpen={showPinModal}
            onClose={() => setShowPinModal(false)}
            onSuccess={handlePinSuccess}
          />
        </div>
      )}

      {step === 5 && (
        <TopupWalletScreen5
          amount={amount || 100000}
          sourceName={selectedSource.name}
          onGoHome={onBack}
          onTopupMore={handleTopupMore}
          onNavigateToFee={onNavigateToFee}
          onNavigateToPostpaid={onNavigateToPostpaid}
        />
      )}
    </div>
  )
}
