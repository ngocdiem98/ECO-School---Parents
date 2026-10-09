'use client'

import { useState } from 'react'
import { TopBar } from '@/components/parents/shared/header'

interface HelpAppProps {
  onBack: () => void
}

// Mirrors SCREENS.help / GUIDE_TOPICS. The step "mock" boxes are placeholder
// glyphs in the vanilla screen too — there are no real step screenshots in
// the reference photo set for this guide content.
const GUIDE_TOPICS = [
  {
    value: 'activate',
    label: 'Kích hoạt thẻ mới',
    title: 'Kích hoạt thẻ mới',
    steps: ['Chọn mục kích hoạt thẻ mới', 'Chọn quét mã kích hoạt', 'Quét mã QR trên thẻ học sinh', 'Xác nhận kích hoạt'],
  },
  {
    value: 'topup',
    label: 'Nạp tiền vào thẻ',
    title: 'Nạp tiền vào thẻ',
    steps: ['Chọn mục nạp tiền vào thẻ', 'Chọn mệnh giá cần nạp. Bấm Nạp ngay', 'Chọn phương thức thanh toán', 'Xác nhận giao dịch'],
  },
  {
    value: 'attendance',
    label: 'Theo dõi điểm danh',
    title: 'Theo dõi điểm danh',
    steps: ['Chọn Xem thêm', 'Lựa chọn học sinh cần xem', 'Chọn tab Điểm danh', 'Xem lịch điểm danh theo tháng'],
  },
  {
    value: 'spending',
    label: 'Quản lý chi tiêu',
    title: 'Quản lý chi tiêu',
    steps: ['Chọn mục Quản lý chi tiêu', 'Theo dõi Quản lý chi tiêu của học sinh', 'Xem chi tiết giao dịch', 'Lọc theo khoảng thời gian'],
  },
]

export function HelpApp({ onBack }: HelpAppProps) {
  const [topicVal, setTopicVal] = useState('activate')
  const topic = GUIDE_TOPICS.find((t) => t.value === topicVal)!

  return (
    <div className="screen">
      <TopBar title="Hướng dẫn sử dụng Thẻ học sinh" onBack={onBack} />
      <div className="tabs">
        {GUIDE_TOPICS.map((t) => (
          <button
            key={t.value}
            className={`tab-pill ${topicVal === t.value ? 'active' : ''}`}
            onClick={() => setTopicVal(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="guide-topic-pill">{topic.title}</div>
      <div className="guide-steps">
        {topic.steps.map((cap, i) => (
          <div className="guide-step" key={i}>
            <div className="mock">▢</div>
            <div className="n">{i + 1}</div>
            <div className="cap">{cap}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
