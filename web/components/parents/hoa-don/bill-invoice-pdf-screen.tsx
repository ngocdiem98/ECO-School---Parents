'use client'

import type { Bill } from '@/lib/mock-data'

// "Xem hóa đơn điện tử (VAT)" — opens the bill's e-invoice PDF in an inline
// viewer, with back (left) and download (right) in the top bar. The PDFs are
// static samples in public/invoices/<bill.id>.pdf, one per bill with `hasVat`.
export function BillInvoicePdfScreen({ bill, onBack }: { bill: Bill; onBack: () => void }) {
  const src = `/invoices/${bill.id}.pdf`
  return (
    <div className="screen pdf-screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại">
          ‹
        </button>
        <div className="topbar-title" style={{ paddingRight: 0 }}>
          Hóa đơn điện tử
        </div>
        <a
          className="icon-btn"
          href={src}
          download={`Hoa-don-dien-tu-thang-${bill.month}-${bill.year}.pdf`}
          aria-label="Tải về"
        >
          ⤓
        </a>
      </div>
      <iframe className="pdf-frame" src={`${src}#toolbar=0&navpanes=0`} title={`Hóa đơn điện tử tháng ${bill.month}/${bill.year}`} />
    </div>
  )
}
