'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { TRANSPARENCY_DETAIL } from './menu-data'

export interface MenuDetailScreenProps {
  onBack: () => void
}

export function MenuDetailScreen({ onBack }: MenuDetailScreenProps) {
  const [lang, setLang] = useState<'VI' | 'EN'>('VI')
  const [copiedHash, setCopiedHash] = useState(false)
  const data = TRANSPARENCY_DETAIL

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(data.blockchainHash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  return (
    <div className="tfd-screen-root">
      {/* Topbar: Back Button + Title */}
      <div className="tfd-topbar">
        <button className="tfd-back-btn" onClick={onBack} aria-label="Quay lại thực đơn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="tfd-topbar-title">Suất ăn minh bạch</h1>
        <div style={{ width: 36 }} />
      </div>

      <div className="tfd-scrollable-body">
        {/* Green Hero Banner (Matching Image 4) */}
        <div className="tfd-green-banner">
          <div className="tfd-banner-top-row">
            <button
              type="button"
              className="tfd-lang-pill"
              onClick={() => setLang(lang === 'VI' ? 'EN' : 'VI')}
            >
              <span>{lang}</span>
              <span className="tfd-lang-arrow">⇅</span>
            </button>
          </div>

          <div className="tfd-banner-brand-row">
            <div className="tfd-brand-logo-wrap">
              <Image
                src="/menu/tick-xanh-logo.png"
                alt="Tick Xanh Trách Nhiệm"
                width={80}
                height={80}
                className="tfd-brand-logo"
              />
            </div>
            <div className="tfd-brand-text-col">
              <h2 className="tfd-brand-title-1">SUẤT ĂN MINH BẠCH</h2>
              <h3 className="tfd-brand-title-2">TICK XANH TRÁCH NHIỆM</h3>
              <p className="tfd-brand-copyright">
                (Bản quyền thương hiệu &quot;Tick Xanh Trách Nhiệm&quot; thuộc Sở Công Thương TP.HCM)
              </p>
            </div>
          </div>

          <div className="tfd-banner-pills-col">
            <div className="tfd-pill-white">
              <span className="tfd-pill-lbl">Mã QR:</span>
              <strong className="tfd-pill-val">{data.qrCode}</strong>
            </div>

            <div className="tfd-pill-white">
              <span className="tfd-pill-dot" />
              <strong className="tfd-pill-val">Xác thực Blockchain</strong>
            </div>
          </div>
        </div>

        {/* Meal Photo Container (Matching Image 4) */}
        <div className="tfd-photo-container">
          <div className="tfd-photo-wrap">
            <Image
              src="/menu/meal-photo.png"
              alt="Suất ăn Bún Riêu thực tế"
              fill
              sizes="(max-width: 480px) 100vw, 420px"
              priority
              style={{ objectFit: 'cover' }}
            />
            <div className="tfd-photo-star">✨</div>
          </div>
        </div>

        {/* Dish Title & Compliance Card */}
        <div className="tfd-section-card">
          <h2 className="tfd-dish-title">{data.dishName}</h2>
          <div className="tfd-compliance-box">
            <div className="tfd-compliance-icon">✓</div>
            <div className="tfd-compliance-text">{data.complianceNotice}</div>
          </div>
        </div>

        {/* Section 1: Đơn vị nhận suất ăn */}
        <div className="tfd-section-card">
          <div className="tfd-section-header">
            <span className="tfd-section-badge-icon">🏫</span>
            <h3 className="tfd-section-title">Đơn vị nhận suất ăn</h3>
          </div>
          <div className="tfd-info-box">
            <div className="tfd-entity-name">{data.school.name}</div>
            <div className="tfd-entity-addr">{data.school.address}</div>
            <div className="tfd-meta-row">
              <span className="tfd-meta-lbl">Mã số thuế:</span>
              <span className="tfd-meta-val">{data.school.taxCode}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Nhà cung cấp Suất ăn tập thể */}
        <div className="tfd-section-card">
          <div className="tfd-section-header">
            <span className="tfd-section-badge-icon">👨‍🍳</span>
            <h3 className="tfd-section-title">Nhà cung cấp Suất ăn tập thể</h3>
          </div>
          <div className="tfd-info-box">
            <div className="tfd-entity-name">{data.caterer.name}</div>
            <div className="tfd-entity-addr">{data.caterer.address}</div>
            <div className="tfd-meta-row">
              <span className="tfd-meta-lbl">Mã số thuế:</span>
              <span className="tfd-meta-val">{data.caterer.taxCode}</span>
            </div>

            <div className="tfd-certs-row">
              <span className="tfd-certs-lbl">Chứng nhận:</span>
              <div className="tfd-certs-tags">
                {data.caterer.certificates.map((cert, i) => (
                  <span key={i} className="tfd-cert-tag">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="tfd-verified-badge">
              <span className="tfd-verified-icon">🛡️</span>
              <span>NCC này được xác nhận Tick Xanh bởi {data.caterer.verifiedBy}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Nguyên liệu & Chuỗi cung ứng */}
        <div className="tfd-section-card">
          <div className="tfd-section-header between">
            <div className="tfd-header-left">
              <span className="tfd-section-badge-icon">🌱</span>
              <h3 className="tfd-section-title">Nguyên liệu &amp; Chuỗi cung ứng</h3>
            </div>
            <span className="tfd-trace-link">6 nguồn cung ứng</span>
          </div>

          <div className="tfd-suppliers-list">
            {data.suppliers.map((s, idx) => (
              <div key={s.id} className="tfd-supplier-card">
                <div className="tfd-supplier-top">
                  <span className="tfd-supplier-num">#{idx + 1}</span>
                  <span className="tfd-supplier-cat">{s.category}</span>
                </div>
                <div className="tfd-supplier-name">{s.name}</div>
                <div className="tfd-supplier-addr">{s.address}</div>

                <div className="tfd-supplier-details">
                  <div className="tfd-detail-item">
                    <span className="lbl">MST:</span>
                    <span className="val">{s.taxCode}</span>
                  </div>
                  <div className="tfd-detail-item">
                    <span className="lbl">Ngày nhận hàng:</span>
                    <span className="val highlight">{s.receivedDate}</span>
                  </div>
                </div>

                {s.certificates && s.certificates.length > 0 && (
                  <div className="tfd-supplier-certs">
                    {s.certificates.map((c, i) => (
                      <span key={i} className="tfd-mini-cert">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Xác thực Blockchain */}
        <div className="tfd-section-card">
          <div className="tfd-section-header">
            <span className="tfd-section-badge-icon">⛓️</span>
            <h3 className="tfd-section-title">Xác thực Blockchain</h3>
          </div>
          <div className="tfd-blockchain-box">
            <div className="tfd-bc-row">
              <span className="tfd-bc-lbl">Hệ thống mạng lưới:</span>
              <span className="tfd-bc-val">TrustChain - Improved</span>
            </div>
            <div className="tfd-bc-row">
              <span className="tfd-bc-lbl">Mã băm khối (Hash):</span>
            </div>
            <div className="tfd-hash-display" onClick={handleCopyHash} title="Bấm để sao chép mã Hash">
              <span className="tfd-hash-text">{data.blockchainHash}</span>
              <span className="tfd-hash-copy-btn">
                {copiedHash ? '✓ Đã sao chép' : 'Sao chép'}
              </span>
            </div>
            <div className="tfd-bc-note">
              ● Dữ liệu chuỗi cung ứng suất ăn này được lưu trữ phân tán bất biến trên Blockchain, đảm bảo tính minh bạch và không thể làm giả.
            </div>
          </div>
        </div>

        {/* Section 5: Green Tick là gì? */}
        <div className="tfd-section-card">
          <div className="tfd-section-header">
            <span className="tfd-section-badge-icon">ℹ️</span>
            <h3 className="tfd-section-title">Green Tick là gì?</h3>
          </div>
          <div className="tfd-pillars-grid">
            <div className="tfd-pillar-item">
              <div className="tfd-pillar-icon">🛡️</div>
              <div className="tfd-pillar-t">CHẤT LƯỢNG – AN TOÀN</div>
              <div className="tfd-pillar-d">Bảo đảm đúng chất lượng công bố nên an toàn thực phẩm tuyệt đối.</div>
            </div>
            <div className="tfd-pillar-item">
              <div className="tfd-pillar-icon">🔍</div>
              <div className="tfd-pillar-t">HẬU KIỂM</div>
              <div className="tfd-pillar-d">Được kiểm soát định kỳ và ngẫu nhiên liên tục tại bếp ăn.</div>
            </div>
            <div className="tfd-pillar-item">
              <div className="tfd-pillar-icon">👁️</div>
              <div className="tfd-pillar-t">MINH BẠCH</div>
              <div className="tfd-pillar-d">Kết quả kiểm soát thể hiện minh bạch, trung thực cho phụ huynh.</div>
            </div>
            <div className="tfd-pillar-item">
              <div className="tfd-pillar-icon">🤝</div>
              <div className="tfd-pillar-t">HỢP TÁC</div>
              <div className="tfd-pillar-d">Nhà cung cấp, nhà trường, chính quyền và phụ huynh cùng giám sát.</div>
            </div>
          </div>
        </div>

        {/* Section 6: Ý kiến phản hồi & Giám sát */}
        <div className="tfd-section-card">
          <div className="tfd-section-header">
            <span className="tfd-section-badge-icon">📞</span>
            <h3 className="tfd-section-title">Ý kiến phản hồi &amp; Giám sát</h3>
          </div>
          <p className="tfd-feedback-intro">
            Nếu bạn phát hiện vấn đề về an toàn thực phẩm, vui lòng liên hệ ngay với cơ quan chức năng:
          </p>

          <div className="tfd-contact-box">
            <div className="tfd-contact-unit">
              <div className="tfd-contact-name">{data.supervision.department.name}</div>
              <div className="tfd-contact-line">
                <span>Điện thoại:</span>
                <strong>{data.supervision.department.phone}</strong>
              </div>
              <div className="tfd-contact-line">
                <span>Email:</span>
                <span>{data.supervision.department.email}</span>
              </div>
            </div>

            <div className="tfd-contact-divider" />

            <div className="tfd-contact-unit">
              <div className="tfd-contact-sub-lbl">Hệ thống Tick Xanh được vận hành bởi</div>
              <div className="tfd-contact-name">{data.supervision.association.name}</div>
              <div className="tfd-contact-line">
                <span>Hotline:</span>
                <strong>{data.supervision.association.hotline}</strong>
              </div>
              <div className="tfd-contact-line">
                <span>Email:</span>
                <span>{data.supervision.association.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="tfd-bottom-actions">
          <button type="button" className="btn btn-primary" onClick={onBack}>
            Quay lại thực đơn
          </button>
        </div>
      </div>
    </div>
  )
}
