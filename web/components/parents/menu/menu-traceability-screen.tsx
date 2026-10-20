'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { DEFAULT_INGREDIENT, type MealIngredient } from './menu-data'

export interface MenuTraceabilityScreenProps {
  ingredient?: MealIngredient
  onBack: () => void
}

type TabKey = 'product' | 'company' | 'trace'

export function MenuTraceabilityScreen({
  ingredient = DEFAULT_INGREDIENT,
  onBack,
}: MenuTraceabilityScreenProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('product')

  const ing = ingredient || DEFAULT_INGREDIENT

  return (
    <div className="trace-screen-root">
      {/* Topbar: Back button + Title */}
      <div className="trace-topbar">
        <button className="trace-back-btn" onClick={onBack} aria-label="Quay lại thực đơn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="trace-topbar-title">Truy xuất nguồn gốc</h1>
        <div style={{ width: 36 }} />
      </div>

      <div className="trace-scroll-body">
        {/* NBC GS1 Vietnam Header Row */}
        <div className="trace-gs1-row">
          <div className="trace-gs1-logo-wrap">
            <Image
              src="/menu/nbc-gs1-logo.png"
              alt="NBC GS1 Vietnam"
              width={120}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
              className="trace-gs1-logo"
            />
          </div>
          <button type="button" className="trace-globe-btn" aria-label="Cổng thông tin GS1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>
        </div>

        {/* Main Product Card */}
        <div className="trace-main-card">
          <div className="trace-image-hero">
            <Image
              src={ing.image || '/menu/gio-lua-photo.png'}
              alt={ing.name}
              fill
              sizes="(max-width: 480px) 100vw, 400px"
              style={{ objectFit: 'cover' }}
              className="trace-hero-img"
            />
            {/* White Pagination Dot Indicator */}
            <div className="trace-pagination-indicator">
              <span className="trace-dot-pill" />
            </div>
          </div>

          <h2 className="trace-product-title">{ing.name}</h2>

          {/* GTIN & Batch Number Box */}
          <div className="trace-gtin-box">
            <div className="trace-gtin-part">
              <span className="trace-gtin-lbl">GTIN:</span>
              <span className="trace-gtin-code">{ing.gtin}</span>
            </div>
            <span className="trace-gtin-divider">·</span>
            <div className="trace-batch-part">{ing.batchNumber}</div>
          </div>

          {/* Thumbnails row */}
          <div className="trace-thumbs-row">
            <div className="trace-thumb-item active">
              <Image
                src={ing.image || '/menu/gio-lua-photo.png'}
                alt={ing.name}
                width={46}
                height={46}
                className="trace-thumb-img"
              />
            </div>
          </div>
        </div>

        {/* 3-Pill Tab Bar */}
        <div className="trace-tabs-bar">
          <button
            type="button"
            className={`trace-tab-btn ${activeTab === 'product' ? 'active' : ''}`}
            onClick={() => setActiveTab('product')}
          >
            Sản phẩm
          </button>
          <button
            type="button"
            className={`trace-tab-btn ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => setActiveTab('company')}
          >
            Doanh nghiệp
          </button>
          <button
            type="button"
            className={`trace-tab-btn ${activeTab === 'trace' ? 'active' : ''}`}
            onClick={() => setActiveTab('trace')}
          >
            Truy xuất
          </button>
        </div>

        {/* Tab 1: Sản phẩm */}
        {activeTab === 'product' && (
          <div className="trace-info-card">
            <div className="trace-card-head">
              <span className="trace-head-icon">📋</span>
              <span className="trace-head-title">THÔNG TIN SẢN PHẨM</span>
            </div>

            <div className="trace-info-rows">
              <div className="trace-row">
                <span className="trace-row-lbl">Xuất xứ</span>
                <span className="trace-row-val">{ing.origin || 'Việt Nam'}</span>
              </div>
              <div className="trace-row">
                <span className="trace-row-lbl">Khối lượng tịnh</span>
                <span className="trace-row-val">{ing.netWeight || '500g'}</span>
              </div>
              <div className="trace-row column">
                <span className="trace-row-lbl">Thành phần</span>
                <span className="trace-row-val multiline">{ing.ingredientsList}</span>
              </div>
              <div className="trace-row column">
                <span className="trace-row-lbl">Hướng dẫn sử dụng</span>
                <span className="trace-row-val multiline">{ing.usage}</span>
              </div>
              <div className="trace-row column">
                <span className="trace-row-lbl">Hướng dẫn bảo quản</span>
                <span className="trace-row-val multiline">{ing.storage}</span>
              </div>
              <div className="trace-row">
                <span className="trace-row-lbl">Hạn sử dụng</span>
                <span className="trace-row-val">{ing.shelfLife}</span>
              </div>
              <div className="trace-row column">
                <span className="trace-row-lbl">Tiêu chuẩn chất lượng</span>
                <span className="trace-row-val">{ing.qualityStandard}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Doanh nghiệp */}
        {activeTab === 'company' && (
          <div className="trace-info-card">
            <div className="trace-card-head">
              <span className="trace-head-icon">🏢</span>
              <span className="trace-head-title">THÔNG TIN DOANH NGHIỆP</span>
            </div>

            <div className="trace-info-rows">
              <div className="trace-row column">
                <span className="trace-row-lbl">Tên cơ sở sản xuất</span>
                <span className="trace-row-val bold">{ing.producer}</span>
              </div>
              <div className="trace-row">
                <span className="trace-row-lbl">Mã số thuế</span>
                <span className="trace-row-val">{ing.companyTax || '0315894210'}</span>
              </div>
              <div className="trace-row column">
                <span className="trace-row-lbl">Địa chỉ cơ sở</span>
                <span className="trace-row-val multiline">
                  {ing.companyAddress || 'Lô C2-3, Đường số 4, KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú, TP. Hồ Chí Minh'}
                </span>
              </div>
              <div className="trace-row">
                <span className="trace-row-lbl">Hotline tư vấn</span>
                <span className="trace-row-val link">{ing.companyPhone || '1900 636 828'}</span>
              </div>
              <div className="trace-row">
                <span className="trace-row-lbl">Email</span>
                <span className="trace-row-val">{ing.companyEmail || 'contact@foreverfood.vn'}</span>
              </div>
              <div className="trace-row">
                <span className="trace-row-lbl">Website</span>
                <span className="trace-row-val link">{ing.companyWebsite || 'www.foreverfood.vn'}</span>
              </div>
              <div className="trace-row column">
                <span className="trace-row-lbl">Chứng nhận chất lượng</span>
                <div className="trace-certs-badges">
                  {(ing.certifications || ['HACCP Codex 2020', 'ISO 22000:2018']).map((c) => (
                    <span key={c} className="trace-cert-badge">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Truy xuất */}
        {activeTab === 'trace' && (
          <div className="trace-info-card">
            <div className="trace-card-head">
              <span className="trace-head-icon">🔍</span>
              <span className="trace-head-title">NHẬT KÝ TRUY XUẤT NGUỒN GỐC (GS1)</span>
            </div>

            <div className="trace-info-rows">
              <div className="trace-row">
                <span className="trace-row-lbl">Mã GTIN sản phẩm</span>
                <span className="trace-row-val bold">{ing.gtin}</span>
              </div>
              <div className="trace-row">
                <span className="trace-row-lbl">Số lô sản xuất</span>
                <span className="trace-row-val">{ing.batchNumber}</span>
              </div>
              <div className="trace-row">
                <span className="trace-row-lbl">Ngày sản xuất</span>
                <span className="trace-row-val">04/10/2026</span>
              </div>
              <div className="trace-row">
                <span className="trace-row-lbl">Hạn dùng kiểm soát</span>
                <span className="trace-row-val">18/11/2026</span>
              </div>
              <div className="trace-row column">
                <span className="trace-row-lbl">Nguồn gốc thịt heo sạch</span>
                <span className="trace-row-val">Trang trại heo VietGAP An Tâm (Đồng Nai)</span>
              </div>
              <div className="trace-row column">
                <span className="trace-row-lbl">Kiểm dịch thú y</span>
                <span className="trace-row-val">Giấy chứng nhận số 0410/KD-ĐN cấp ngày 03/10/2026</span>
              </div>
              <div className="trace-row column">
                <span className="trace-row-lbl">Tổ chức chuẩn hoá</span>
                <span className="trace-row-val">Trung tâm Mã số Mã vạch Quốc gia (NBC - GS1 Việt Nam)</span>
              </div>
              <div className="trace-status-box">
                <span className="trace-status-check">✓</span>
                <span>Dữ liệu đã được thẩm tra và bảo chứng an toàn thực phẩm.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
