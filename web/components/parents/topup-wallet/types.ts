export interface TopupBankSource {
  id: string
  name: string
  feeText: string
  iconType: 'acb' | 'agribank' | 'bank'
  accountMask: string
}

export interface TopupWalletState {
  amount: number
  selectedSourceId: string
  step: 1 | 2 | 4 | 5 // 1: Enter amount & source, 2: Confirmation, 4: PIN Modal over 2, 5: Result Screen
  showPinModal: boolean
  pin: string
}
