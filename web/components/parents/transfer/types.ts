export interface TransferRecipient {
  id: string
  name: string
  phone: string
  avatarLetter: string
  isEco: boolean
}

export interface PaymentSource {
  id: string
  name: string
  subtext: string
  balance?: string
  iconType: 'eco' | 'bank'
  bankName?: string
}

export interface TransferState {
  recipient: TransferRecipient
  amount: number
  note: string
  paymentSourceId: string
  step: 1 | 2 | 4 | 6 // 1: Select recipient, 2: Enter amount (Screens 2 & 3), 4: Confirm (Screen 4 with modal Screen 5), 6: Success result (Screen 6)
  showPinModal: boolean
  pin: string
}
