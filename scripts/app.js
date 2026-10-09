/* ============================================================
   EDU Parent — mock data
   ============================================================ */
const STUDENTS = {
  vy: {
    id: 'vy',
    code: '9192930059',
    name: 'Phan Khánh Vy',
    school: 'Trường Mầm non Demo',
    className: 'Lớp Lá',
    balance: 12000,
    supportsTopUp: true,
    hasLinkedInvoice: false,
    avatar: 'V',
    recentActivity: [
      { title: 'Nạp tiền', time: '10/07/2026 - 09:41', amount: '+1,000 điểm' },
      { title: 'Thêm liên kết học sinh Phan Khánh Vy | 9192930059', time: '10/07/2026 - 09:29' },
      { title: 'Đã kích hoạt thẻ học sinh Phan Khánh Vy', time: '10/07/2026 - 09:29' },
      { title: 'Đã hủy liên kết thẻ học sinh Phan Khánh Vy', time: '10/07/2026 - 09:29' }
    ],
    spending: {
      transactions: [
        { title: 'Nạp tiền', time: '10/07/2026 - 09:41', amount: '+1,000 điểm' },
        { title: 'Nạp tiền', time: '02/07/2026 - 13:52', amount: '+5,000 điểm' },
        { title: 'Nạp tiền', time: '27/05/2026 - 14:18', amount: '+1,000 điểm' },
        { title: 'Nạp tiền', time: '17/05/2026 - 16:04', amount: '+5,000 điểm' }
      ]
    },
    timetable: { available: false },
    attendance: {
      hasStats: true,
      monthLabel: 'Tháng 7, 2026',
      month: 6, year: 2026, today: 10,
      stats: { present: 0, excused: 0, unexcused: 0, late: 0 },
      log: []
    },
    homework: [],
    absence: [],
    results: null,
    invoices: { linked: false, sample: [{ name: 'Học phí 07/2026', amount: 200000 }] },
    goodBehavior: {
      yearLabel: 'Năm học 2025 - 2026',
      cycles: [
        { id: 'vygb1', type: 'week', label: 'Tuần 13/07 - 18/07/2026', status: 'dat', comment: 'Con rất ngoan, biết giúp đỡ bạn bè' },
        { id: 'vygb2', type: 'week', label: 'Tuần 06/07 - 11/07/2026', status: 'dat', comment: null },
        { id: 'vygb3', type: 'week', label: 'Tuần 29/06 - 04/07/2026', status: 'dat', comment: null },
        { id: 'vygb4', type: 'week', label: 'Tuần 22/06 - 27/06/2026', status: 'khongdat', comment: null },
        { id: 'vygb5', type: 'month', label: 'Tháng 6/2026', status: 'dat', comment: 'Con tích cực tham gia các hoạt động của lớp' }
      ],
      ranking: {
        achieved: 24, totalCycles: 30,
        top3: [
          { name: 'Trần Thị Bình', count: 28 },
          { name: 'Nguyễn Văn An', count: 26 },
          { name: 'Phan Khánh Vy', count: 24, isSelf: true }
        ],
        selfInTop3: true,
        selfRank: 3,
        totalStudents: 32
      }
    }
  },
  khoa: {
    id: 'khoa',
    code: '9192930072',
    name: 'Trần Đăng Khoa',
    school: 'Trường FINVIET',
    className: 'Lớp 10A1',
    balance: 0,
    supportsTopUp: false,
    hasLinkedInvoice: true,
    avatar: 'K',
    recentActivity: [
      { title: 'Đã điểm danh', time: 'Thứ tư 08/07/2026 - 08:21' },
      { title: 'Đã điểm danh', time: 'Thứ ba 07/07/2026 - 08:00' },
      { title: 'Đã điểm danh', time: 'Thứ sáu 03/07/2026 - 08:13' },
      { title: 'Thêm liên kết học sinh Trần Đăng Khoa | 9192930072', time: '02/07/2026 - 13:41' }
    ],
    spending: { transactions: [] },
    timetable: { available: true, period: '01/01/2026 - 16/05/2026' },
    attendance: {
      hasStats: false,
      monthLabel: 'Tháng 7, 2026',
      month: 6, year: 2026, today: 10,
      log: [
        { title: 'Đã điểm danh', time: 'Thứ tư 08/07/2026 - 08:21' },
        { title: 'Đã điểm danh', time: 'Thứ ba 07/07/2026 - 08:00' },
        { title: 'Đã điểm danh', time: 'Thứ sáu 03/07/2026 - 08:13' }
      ]
    },
    homework: [
      {
        id: 'hw1', subject: 'GDQP-AN', title: 'Tính toán', status: 'graded', score: 10,
        teacher: 'Phùng Thị Thu', assignedDate: '26/05/2026', dueDate: '14:40 29/05/2026',
        content: 'Kiểm tra chủ đề', overdue: false, comment: 'Chưa có nhận xét',
        submissionFiles: ['bai-nop-toan-1.jpg']
      },
      {
        id: 'hw2', subject: 'Toán', title: 'Bài tập nhỏ', status: 'notsubmitted', score: null,
        teacher: 'Phùng Thị Thu', assignedDate: '26/05/2026', dueDate: '14:40 29/05/2026',
        content: 'Kiểm tra chủ đề', overdue: true, comment: 'Chưa có nhận xét',
        submissionFiles: []
      }
    ],
    absence: [
      { id: 'ab1', range: '10/07/2026 - 10/07/2026', status: 'pending', time: 'Cả ngày', days: 1, note: 'con xin nghi' },
      { id: 'ab2', range: '25/06/2026 - 27/06/2026', status: 'cancelled', time: 'Buổi sáng', days: 3, note: 'Con xin nghỉ phép' }
    ],
    results: {
      year: '2025-2026',
      terms: {
        'Học kỳ I': { study: '--', behavior: '--', absentDays: '--' },
        'Học kỳ II': { study: '--', behavior: '--', absentDays: '--' },
        'Tổng kết': { study: '--', behavior: '--', absentDays: '--' }
      },
      subjects: [
        { name: 'Ngữ Văn', gtx: '--', gk: '--' },
        { name: 'Toán', gtx: '--', gk: '--' },
        { name: 'Ngoại ngữ 1', gtx: '--', gk: '--' }
      ]
    },
    invoices: {
      linked: true,
      months: [
        { label: 'Hóa đơn tháng 6/2026', total: 1355000, items: [
          { name: 'Học phí 06/2026', amount: 200000 },
          { name: 'Tiền ăn tháng 06/2026', amount: 875000 },
          { name: 'Học liệu Lịch sử', amount: 280000 }
        ]},
        { label: 'Hóa đơn tháng 7/2026', total: 1426000, items: [
          { name: 'Học phí 07/2026', amount: 200000 },
          { name: 'Tiền ăn tháng 07/2026', amount: 945000 },
          { name: 'Học liệu Lịch sử', amount: 280000 }
        ]}
      ]
    },
    goodBehavior: {
      yearLabel: 'Năm học 2025 - 2026',
      cycles: [
        { id: 'khoagb1', type: 'week', label: 'Tuần 13/07 - 18/07/2026', status: 'khongdat', comment: 'Con còn nói chuyện riêng trong giờ học' },
        { id: 'khoagb2', type: 'week', label: 'Tuần 06/07 - 11/07/2026', status: 'dat', comment: 'Con tích cực phát biểu xây dựng bài' },
        { id: 'khoagb3', type: 'month', label: 'Tháng 6/2026', status: 'dat', comment: null },
        { id: 'khoagb4', type: 'week', label: 'Tuần 22/06 - 27/06/2026', status: 'dat', comment: null },
        { id: 'khoagb5', type: 'week', label: 'Tuần 15/06 - 20/06/2026', status: 'khongdat', comment: null }
      ],
      ranking: {
        achieved: 18, totalCycles: 28,
        top3: [
          { name: 'Nguyễn Thị Mai', count: 27 },
          { name: 'Đặng Văn Hùng', count: 25 },
          { name: 'Lý Gia Bảo', count: 23 }
        ],
        selfInTop3: false,
        selfRank: 7,
        totalStudents: 25
      }
    }
  }
};

const PROVIDERS = [
  { id: 'eco', name: 'ECO School', logo: 'fin' },
  { id: 'ssc', name: 'TheSSC', logo: 'SSC' },
  { id: 'vinaid', name: 'VinaID', logo: 'ID' }
];

const AMOUNT_PRESETS = [10000, 20000, 50000, 100000, 200000, 500000];

const ICONS = {
  fee: '▣', topup: '◈', spending: '▥', timetable: '▦',
  attendance: '◷', absence: '✎', homework: '▧', results: '▨',
  page2: ['▩', '▥', '◐', '▤', '✛', '▬', '▭', '★']
};

const FEATURE_LABELS = {
  fee: 'Đóng học phí', topup: 'Nạp điểm vào thẻ', spending: 'Lịch sử chi tiêu',
  timetable: 'Thời khoá biểu', attendance: 'Theo dõi điểm danh', absence: 'Báo vắng',
  homework: 'Bài tập', results: 'Kết quả học tập', goodbehavior: 'Phiếu bé ngoan'
};

const PAGE2_LABELS = ['Học bạ số', 'Thực đơn', 'Hoạt động', 'Hóa đơn', 'Dặn thuốc', 'Bảng tin', 'Nhật ký chăm sóc', 'Phiếu bé ngoan'];

/* ============================================================
   Helpers
   ============================================================ */
function fmtMoney(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function abbreviateName(name) {
  const parts = String(name).trim().split(/\s+/);
  if (parts.length <= 1) return name;
  return parts[0] + ' ' + parts.slice(1).map(p => p[0] + '.').join(' ');
}
function studentHeaderHTML(student, opts) {
  opts = opts || {};
  const intent = opts.intent || '';
  return `
    <div class="student-header">
      <div class="avatar">${student.avatar}</div>
      <div class="info">
        <div class="student-name">${escapeHtml(student.name)}</div>
        <div class="meta">${student.code}</div>
        <div class="meta">${escapeHtml(student.className)}</div>
        <div class="meta">${escapeHtml(student.school)}</div>
      </div>
      <button class="btn-change" onclick="App.openStudentPicker('${intent}', '${student.id}')">⇄ Đổi</button>
    </div>`;
}
function topbarHTML(title, opts) {
  opts = opts || {};
  const rightBtn = opts.right
    ? `<button class="icon-btn" onclick="${opts.right.action}">${opts.right.glyph}</button>`
    : `<span class="icon-btn-ghost"></span>`;
  return `
    <div class="topbar">
      <button class="icon-btn" onclick="App.back()">‹</button>
      <div class="topbar-title">${escapeHtml(title)}</div>
      ${rightBtn}
    </div>`;
}
function tabsHTML(tabs, active, onClickFn) {
  return `<div class="tabs">${tabs.map(t => `
    <button class="tab-pill ${t.value === active ? 'active' : ''}" onclick="${onClickFn}('${t.value}')">${escapeHtml(t.label)}</button>
  `).join('')}</div>`;
}
function badgeHTML(text, variant) {
  return `<span class="badge badge--${variant}">${escapeHtml(text)}</span>`;
}
function emptyStateHTML(text) {
  return `<div class="empty-state"><div class="glyph">▢</div><div class="text">${escapeHtml(text)}</div></div>`;
}
function placeholderScreenHTML(title, note) {
  return `
    ${topbarHTML(title)}
    <div class="placeholder-box">
      <div class="glyph">▢</div>
      <div class="title">Chưa có thiết kế</div>
      <div class="sub">${escapeHtml(note || 'Phần này chưa có ảnh chụp màn hình thật trong tài liệu tham chiếu.')}</div>
    </div>`;
}

/* ============================================================
   Router core
   ============================================================ */
const App = {
  stack: [{ screen: 'home', params: {} }],
  overlay: null,        // { kind: 'sheet'|'dialog', name, params }
  formState: {},         // scratch state per-screen (fee selections, topup amount, filters...)

  current() { return this.stack[this.stack.length - 1]; },

  go(screen, params) {
    this.stack.push({ screen, params: params || {} });
    this.closeOverlay(false);
    this.render();
    this.scrollTop();
  },

  replace(screen, params) {
    this.stack[this.stack.length - 1] = { screen, params: params || {} };
    this.closeOverlay(false);
    this.render();
    this.scrollTop();
  },

  resetTo(screen, params) {
    this.stack = [{ screen, params: params || {} }];
    this.closeOverlay(false);
    this.render();
    this.scrollTop();
  },

  back() {
    if (this.stack.length > 1) this.stack.pop();
    this.closeOverlay(false);
    this.render();
    this.scrollTop();
  },

  scrollTop() {
    const root = document.getElementById('screenRoot');
    if (root) root.scrollTop = 0;
  },

  student(id) { return STUDENTS[id]; },

  /* ---------- feature entry points (used by Home + Học sinh Home) ---------- */
  openFeature(feature, studentId) {
    if (feature === 'fee') return this.startFee(studentId);
    if (feature === 'topup') return this.startTopup(studentId);
    if (feature === 'attendance') return this.go('attendance', { studentId, tab: 'diemdanh' });
    if (feature === 'absence') return this.go('absence-list', { studentId, filter: 'all' });
    if (feature === 'homework') return this.go('homework-list', { studentId, filter: 'all' });
    if (feature === 'results') return this.go('results', { studentId, term: 'Học kỳ I' });
    if (feature === 'goodbehavior') return this.go('goodbehavior', { studentId, tab: 'card' });
    return this.go(feature, { studentId });
  },

  startFee(studentId) {
    const s = this.student(studentId);
    if (!s.hasLinkedInvoice) {
      this.openSheet('fee-provider', { studentId });
    } else {
      this.go('fee-invoice', { studentId, mode: 'linked' });
    }
  },

  chooseProvider(studentId, providerId) {
    this.closeOverlay(true);
    this.go('fee-lookup', { studentId, providerId });
  },

  startTopup(studentId) {
    const s = this.student(studentId);
    if (!s.supportsTopUp) return;
    this.go('topup-amount', { studentId });
  },

  /* ---------- student picker ---------- */
  openStudentPicker(intent, currentStudentId) {
    this.openSheet('student-picker', { intent, currentStudentId });
  },

  pickStudent(intent, studentId) {
    const eligible = intent === 'topup' ? STUDENTS[studentId].supportsTopUp : true;
    this.closeOverlay(true);
    if (!eligible) return;
    if (!intent) { this.go('student', { studentId }); return; }
    this.openFeature(intent, studentId);
  },

  /* ---------- overlay (bottom sheet / dialog) ---------- */
  openSheet(name, params) {
    this.overlay = { kind: 'sheet', name, params: params || {} };
    this.renderOverlay();
  },
  openDialog(name, params) {
    this.overlay = { kind: 'dialog', name, params: params || {} };
    this.renderOverlay();
  },
  closeOverlay(skipRender) {
    this.overlay = null;
    if (!skipRender) this.renderOverlay();
  },

  render() {
    const root = document.getElementById('screenRoot');
    const { screen, params } = this.current();
    const fn = SCREENS[screen];
    root.innerHTML = `<div class="screen">${fn ? fn(params) : placeholderScreenHTML('Không tìm thấy', screen)}</div>`;
    this.renderOverlay();
  },

  renderOverlay() {
    const root = document.getElementById('overlayRoot');
    if (!this.overlay) { root.innerHTML = ''; return; }
    const { kind, name, params } = this.overlay;
    const fn = kind === 'sheet' ? SHEETS[name] : DIALOGS[name];
    const inner = fn ? fn(params) : '';
    if (kind === 'sheet') {
      root.innerHTML = `
        <div class="scrim" onclick="App.closeOverlay()"></div>
        <div class="sheet">${inner}</div>`;
    } else {
      root.innerHTML = `
        <div class="scrim"></div>
        <div class="dialog-wrap">${inner}</div>`;
    }
  }
};

/* ============================================================
   Screens: Home + Student home
   ============================================================ */
const SCREENS = {};

SCREENS.home = function () {
  const list = Object.values(STUDENTS);
  const feeStudent = list.find(s => s.hasLinkedInvoice && s.invoices.months && s.invoices.months.length);
  const unpaidCount = feeStudent ? feeStudent.invoices.months.length : 0;

  const page1 = ['fee', 'topup', 'spending', 'timetable', 'attendance', 'absence', 'homework', 'results'];

  return `
    <div class="brand-hero brand-hero--home">
      <button class="icon-btn brand-hero-help" onclick="App.go('help')">?</button>
      <h1>THẺ HỌC SINH THÔNG MINH</h1>
      <p>Bước tiến mới trong chuyển đổi số giáo dục</p>
    </div>

    <div class="icon-grid-wrap">
      <div class="icon-grid-scroller" id="homeIconScroller" onscroll="App.onHomeScroll()">
        <div class="icon-grid-page">
          ${page1.map(f => iconItemHTML(FEATURE_LABELS[f], ICONS[f], `App.openStudentPicker('${f}', null)`)).join('')}
        </div>
        <div class="icon-grid-page">
          ${PAGE2_LABELS.map((label, i) => {
            const onclick = label === 'Phiếu bé ngoan'
              ? `App.openStudentPicker('goodbehavior', null)`
              : `App.go('placeholder', {title:'${label}', note:'Icon này có trên lưới tính năng nhưng chưa có ảnh màn hình chi tiết trong tài liệu tham chiếu.'})`;
            return iconItemHTML(label, ICONS.page2[i], onclick);
          }).join('')}
        </div>
      </div>
      <div class="icon-dots" id="homeDots">
        <span class="icon-dot active"></span><span class="icon-dot"></span>
      </div>
    </div>

    <div class="section-heading">Danh sách học sinh</div>
    ${list.map(s => studentCardHTML(s)).join('')}

    ${feeStudent ? `
    <div class="pay-banner">
      <span>${unpaidCount} hoá đơn chờ thanh toán</span>
      <button onclick="App.startFee('${feeStudent.id}')">Thanh toán ›</button>
    </div>` : ''}

    <button class="btn-add-student" onclick="App.go('link-intro')">Thêm học sinh mới  +</button>
  `;
};

App.onHomeScroll = function () {
  const el = document.getElementById('homeIconScroller');
  const dots = document.getElementById('homeDots');
  if (!el || !dots) return;
  const page = Math.round(el.scrollLeft / el.clientWidth);
  [...dots.children].forEach((d, i) => d.classList.toggle('active', i === page));
};

function iconItemHTML(label, glyph, onclick, disabled) {
  return `
    <button class="icon-item" ${disabled ? 'disabled' : ''} onclick="${disabled ? '' : onclick}">
      <span class="icon-glyph">${glyph}</span>
      <span class="icon-label">${escapeHtml(label)}</span>
    </button>`;
}

function studentCardHTML(s) {
  return `
    <div class="student-card" onclick="App.go('student', {studentId:'${s.id}'})">
      <div class="student-card-head">
        <div class="avatar">${s.avatar}</div>
        <div>
          <div class="student-name">${escapeHtml(s.name)}</div>
          <div class="student-code">${s.code}</div>
        </div>
      </div>
      <div class="student-card-body">
        <div class="kv-label">Trường</div><div class="kv-value">${escapeHtml(s.school)}</div>
        <div class="kv-label">Lớp</div><div class="kv-value">${escapeHtml(s.className)}</div>
        <div class="kv-label">Số dư thẻ</div><div class="kv-value balance">${s.balance.toLocaleString('vi-VN')} điểm</div>
      </div>
    </div>`;
}

SCREENS.student = function (params) {
  const s = App.student(params.studentId);
  const page1 = ['fee', 'topup', 'spending', 'timetable', 'attendance', 'absence', 'homework', 'results'];
  return `
    <div class="topbar">
      <button class="icon-btn" onclick="App.back()">‹</button>
      <div class="topbar-title">Học sinh</div>
      <button class="icon-btn" onclick="App.go('placeholder', {title:'Cài đặt', note:'Chưa có ảnh màn hình cài đặt trong tài liệu tham chiếu.'})">⚙</button>
    </div>
    ${studentHeaderHTML(s)}
    <div class="balance-row">
      <span>Số dư thẻ</span>
      <span class="value">${s.balance.toLocaleString('vi-VN')} điểm</span>
    </div>
    <div class="icon-grid-wrap">
      <div class="icon-grid-page" style="grid-template-columns:repeat(4,1fr);">
        ${page1.map(f => {
          const disabled = f === 'topup' && !s.supportsTopUp;
          return iconItemHTML(FEATURE_LABELS[f], ICONS[f], `App.openFeature('${f}', '${s.id}')`, disabled);
        }).join('')}
      </div>
    </div>
    <div class="section-heading">Hoạt động gần đây</div>
    ${s.recentActivity.length ? s.recentActivity.map(a => `
      <div class="list-item">
        <span class="glyph">•</span>
        <div class="body">
          <div class="title">${escapeHtml(a.title)}</div>
          <div class="time">${escapeHtml(a.time)}</div>
        </div>
        ${a.amount ? `<div class="amount">${escapeHtml(a.amount)}</div>` : ''}
      </div>`).join('') : emptyStateHTML('Chưa có thông tin')}
    <div class="cta-bar sticky">
      <button class="btn btn-primary" ${s.supportsTopUp ? '' : 'disabled'} onclick="App.startTopup('${s.id}')">Nạp điểm vào thẻ</button>
    </div>
  `;
};

SCREENS.placeholder = function (params) {
  return placeholderScreenHTML(params.title || 'Chưa có thiết kế', params.note);
};

/* ============================================================
   Screens: Đóng học phí
   ============================================================ */
SCREENS['fee-lookup'] = function (params) {
  const s = App.student(params.studentId);
  const provider = PROVIDERS.find(p => p.id === params.providerId) || PROVIDERS[0];
  const key = 'fee-code-' + s.id;
  const code = App.formState[key] || '';
  return `
    ${topbarHTML('Hoá đơn học phí')}
    <div class="provider-row" style="margin:12px 16px;">
      <div class="provider-logo">${provider.logo}</div>
      <div class="name" style="flex:1;">${escapeHtml(provider.name)}</div>
      <button class="btn-link" onclick="App.openSheet('fee-provider', {studentId:'${s.id}'})">Thay đổi</button>
    </div>
    <div class="field">
      <label>Thông tin học sinh</label>
      <input type="text" class="input-box" placeholder="Mã học sinh" value="${escapeHtml(code)}"
        oninput="App.formState['${key}']=this.value; App.syncFeeLookupBtn('${s.id}')">
    </div>
    <div class="section-heading">Hoá đơn đã lưu</div>
    <div class="list-item">
      <span class="glyph">▣</span>
      <div class="body">
        <div class="title">ECO School</div>
        <div class="time">${escapeHtml(s.name)} · ${s.code}</div>
      </div>
    </div>
    <div class="section-heading">Hoá đơn mẫu</div>
    <div class="sample-invoice">
      <div class="si-head"><span>${provider.logo} PHIẾU BÁO THU TIỀN</span><span>QR</span></div>
      <div class="si-row"><span>Trường Finviet</span></div>
      <div class="si-row"><span>Tên học sinh:</span><span>Nguyễn Văn A</span></div>
      <div class="si-row"><span>Mã học sinh:</span><span class="si-highlight">9192931210 ← (ở đây)</span></div>
      <div class="si-row"><span>Lớp 11A1</span><span>Kỳ phí: 04/2026</span></div>
    </div>
    <div class="cta-bar sticky">
      <button class="btn btn-primary" id="feeLookupBtn" ${code ? '' : 'disabled'}
        onclick="App.go('fee-invoice', {studentId:'${s.id}', mode:'lookup'})">Tiếp tục</button>
    </div>
  `;
};

App.syncFeeLookupBtn = function () {
  const btn = document.getElementById('feeLookupBtn');
  const input = document.querySelector('.field input.input-box');
  if (btn && input) btn.disabled = !input.value.trim();
};

SCREENS['fee-invoice'] = function (params) {
  const s = App.student(params.studentId);
  const stateKey = 'fee-sel-' + s.id;
  if (!App.formState[stateKey]) App.formState[stateKey] = new Set();
  const sel = App.formState[stateKey];

  let total = 0;
  let bodyHTML = '';

  if (params.mode === 'lookup') {
    bodyHTML = `
      <div class="section-heading">Hoá đơn chưa thanh toán (${s.invoices.sample.length})</div>
      <div class="section-heading" style="margin-top:-4px;font-weight:400;color:var(--c-gray-500);font-size:12px;">Chọn kỳ thanh toán</div>
      <div class="invoice-group">
        ${s.invoices.sample.map((item, i) => {
          const id = 'lk' + i;
          const checked = sel.has(id);
          if (checked) total += item.amount;
          return `
          <div class="invoice-line" onclick="App.toggleFeeItem('${s.id}','${id}',${item.amount})">
            <span class="checkbox ${checked ? 'checked' : ''}">${checked ? '✓' : ''}</span>
            <span>${escapeHtml(item.name)}</span>
            <span class="amt">${fmtMoney(item.amount)}</span>
          </div>`;
        }).join('')}
      </div>`;
  } else {
    bodyHTML = `
      <div class="section-heading">Hoá đơn chưa thanh toán (${s.invoices.months.length})</div>
      <div class="section-heading" style="margin-top:-4px;font-weight:400;color:var(--c-gray-500);font-size:12px;">Chọn kỳ thanh toán</div>
      ${s.invoices.months.map((group, gi) => `
        <div class="invoice-group">
          <div class="invoice-group-head">
            <span>${escapeHtml(group.label)}</span>
            <span class="amt">${fmtMoney(group.total)}</span>
            <span class="chevron">▲</span>
          </div>
          ${group.items.map((item, ii) => {
            const id = 'g' + gi + 'i' + ii;
            const checked = sel.has(id);
            if (checked) total += item.amount;
            return `
            <div class="invoice-line" onclick="App.toggleFeeItem('${s.id}','${id}',${item.amount})">
              <span class="checkbox ${checked ? 'checked' : ''}">${checked ? '✓' : ''}</span>
              <span>${escapeHtml(item.name)}</span>
              <span class="amt">${fmtMoney(item.amount)}</span>
            </div>`;
          }).join('')}
        </div>
      `).join('')}`;
  }

  return `
    ${topbarHTML('Thông tin hoá đơn')}
    <div class="card">
      <div class="card-title">Thông tin học sinh</div>
      <div class="feedback-row"><span>${escapeHtml(s.name)}</span></div>
      <div class="feedback-row"><span class="text-muted">${s.code}</span></div>
      <div class="feedback-row"><span class="text-muted">Lớp ${escapeHtml(s.className)}</span></div>
      <div class="feedback-row"><span class="text-muted">${escapeHtml(s.school)}</span></div>
      <div class="divider"></div>
      <div class="feedback-row"><span class="text-muted">Tên dịch vụ</span><span>Thanh toán học phí</span></div>
      <div class="feedback-row"><span class="text-muted">Nhà cung cấp</span><span>ECO School</span></div>
    </div>
    ${bodyHTML}
    <div class="total-bar">
      <div>
        <div class="total-label">Tổng tiền</div>
        <div class="total-value" id="feeTotal">${fmtMoney(total)}</div>
      </div>
      <button class="btn btn-primary" ${total > 0 ? '' : 'disabled'}
        onclick="App.go('placeholder', {title:'Xác nhận thanh toán', note:'Chưa có ảnh màn hình kết quả thanh toán học phí trong tài liệu tham chiếu.'})">Xác nhận thanh toán</button>
    </div>
  `;
};

App.toggleFeeItem = function (studentId, id, amount) {
  const key = 'fee-sel-' + studentId;
  const sel = App.formState[key];
  if (sel.has(id)) sel.delete(id); else sel.add(id);
  App.render();
};

/* ============================================================
   Screens: Nạp điểm vào thẻ
   ============================================================ */
SCREENS['topup-amount'] = function (params) {
  const s = App.student(params.studentId);
  const key = 'topup-amount-' + s.id;
  if (App.formState[key] === undefined) App.formState[key] = 50000;
  const amount = App.formState[key];
  const customKey = 'topup-custom-' + s.id;
  const showCustom = !!App.formState[customKey];

  return `
    ${topbarHTML('Thông tin nạp điểm')}
    <div class="card text-center">
      <div style="font-size:30px;margin-bottom:6px;">◈</div>
      <div class="card-title" style="text-align:center;">Nạp điểm thẻ học sinh</div>
      <div class="divider"></div>
      <div class="feedback-row" style="text-align:left;"><span class="text-muted">Thông tin học sinh</span></div>
      <div class="feedback-row" style="text-align:left;"><span>${escapeHtml(s.name)}</span></div>
      <div class="feedback-row" style="text-align:left;"><span class="text-muted">${s.code}</span></div>
    </div>
    <div class="section-heading">Số điểm nạp</div>
    <div class="amount-grid">
      ${AMOUNT_PRESETS.map(v => `
        <button class="amount-opt ${!showCustom && amount === v ? 'active' : ''}"
          onclick="App.formState['${key}']=${v}; App.formState['${customKey}']=false; App.render();">
          ${v.toLocaleString('vi-VN')}
        </button>`).join('')}
    </div>
    <div class="text-center" style="margin-top:10px;">
      <button class="btn-link" onclick="App.formState['${customKey}']=true; App.render();">Nhập số điểm khác ✎</button>
    </div>
    ${showCustom ? `
      <div class="field">
        <input type="number" class="input-box" placeholder="Nhập số điểm" value="${amount}"
          oninput="App.formState['${key}']=Number(this.value)||0; document.getElementById('topupTotal').textContent=App.formState['${key}'].toLocaleString('vi-VN');">
      </div>` : ''}
    <div class="card">
      <div class="card-title" style="margin-bottom:0;">Tiện ích</div>
      <div class="feedback-row" onclick="App.go('placeholder', {title:'Nạp điểm tự động', note:'Chưa có ảnh màn hình chi tiết cho tiện ích này.'})" style="cursor:pointer;">
        <span>Kích hoạt nạp điểm tự động</span><span>›</span>
      </div>
    </div>
    <div class="total-bar">
      <div>
        <div class="total-label">Tổng điểm</div>
        <div class="total-value" id="topupTotal">${amount.toLocaleString('vi-VN')}</div>
      </div>
      <button class="btn btn-primary" onclick="App.go('topup-confirm', {studentId:'${s.id}', amount:${amount}})">Xác nhận</button>
    </div>
  `;
};

SCREENS['topup-confirm'] = function (params) {
  const s = App.student(params.studentId);
  const amount = params.amount;
  const key = 'topup-method-' + s.id;
  if (!App.formState[key]) App.formState[key] = 'bank';
  const method = App.formState[key];
  return `
    ${topbarHTML('Xác nhận giao dịch')}
    <div class="result-hero">
      <div style="font-size:26px;">◈</div>
      <div class="total-label">Tổng thanh toán</div>
      <div class="result-amount">${fmtMoney(amount)}</div>
      <span class="badge badge--outline">Nạp điểm thẻ học sinh</span>
    </div>
    <div class="card">
      <div class="feedback-row"><span class="text-muted">Mã học sinh</span><span>${s.code}</span></div>
      <div class="feedback-row"><span class="text-muted">Tên học sinh</span><span>${escapeHtml(s.name)}</span></div>
      <div class="feedback-row"><span class="text-muted">Số tiền</span><span>${fmtMoney(amount)}</span></div>
    </div>
    <div class="card" onclick="App.go('placeholder', {title:'Ưu đãi ECO Me', note:'Chưa có ảnh màn hình chọn ưu đãi.'})" style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
      <span>Ưu đãi ECO Me</span><span class="btn-link">Chọn ưu đãi</span>
    </div>
    <div class="section-heading" style="display:flex;justify-content:space-between;align-items:center;">
      <span>Chọn phương thức thanh toán</span>
      <button class="btn-link" onclick="App.go('placeholder', {title:'Phương thức thanh toán', note:'Chưa có ảnh màn hình danh sách đầy đủ phương thức thanh toán.'})">Xem thêm</button>
    </div>
    <div class="pick-row">
      <div>
        <div class="student-name">Ví ECO</div>
        <div class="meta text-muted" style="font-size:12px;">Số dư ví không đủ</div>
      </div>
      <button class="btn-mini" style="border:none;background:var(--c-black);color:#fff;padding:8px 12px;border-radius:999px;font-size:11.5px;font-weight:700;"
        onclick="App.go('placeholder', {title:'Nạp tiền vào ví', note:'Chưa có ảnh màn hình nạp tiền ví ECO.'})">Nạp tiền</button>
    </div>
    <div class="pick-row ${method === 'bank' ? 'selected' : ''}" onclick="App.formState['${key}']='bank'; App.render();">
      <div>
        <div class="student-name">Techcombank •••• 2939</div>
      </div>
      <span class="checkbox ${method === 'bank' ? 'checked' : ''}" style="border-radius:50%;">${method === 'bank' ? '✓' : ''}</span>
    </div>
    <div class="cta-bar sticky">
      <button class="btn btn-primary" onclick="App.go('topup-result', {studentId:'${s.id}', amount:${amount}})">Tiếp tục</button>
    </div>
  `;
};

SCREENS['topup-result'] = function (params) {
  const s = App.student(params.studentId);
  const amount = params.amount;
  const txId = '2859' + Math.floor(86000 + Math.random() * 900);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' 10/07/2026';
  return `
    <div class="topbar" style="justify-content:center;">
      <div class="topbar-title" style="padding-right:0;">Kết quả giao dịch</div>
    </div>
    <div class="card text-center">
      <div class="result-hero" style="padding-top:8px;">
        <div class="result-check">✓</div>
        <div class="text-muted" style="font-weight:700;">Giao dịch thành công</div>
        <div class="result-amount">${fmtMoney(amount)}</div>
        <span class="badge badge--outline">Nạp điểm thẻ học sinh</span>
      </div>
      <div class="divider"></div>
      <div class="feedback-row"><span class="text-muted">Mã giao dịch</span><span>${txId} ›</span></div>
      <div class="feedback-row"><span class="text-muted">Thời gian giao dịch</span><span>${timeStr}</span></div>
      <div class="feedback-row" style="text-align:left;"><span class="text-muted">Thông tin dịch vụ</span></div>
      <div class="feedback-row"><span class="text-muted">Mã học sinh</span><span>${s.code}</span></div>
      <div class="feedback-row"><span class="text-muted">Tên học sinh</span><span>${escapeHtml(s.name)}</span></div>
      <button class="btn-link" style="margin-top:8px;">Chia sẻ ⇪</button>
    </div>
    <div class="banner-note">
      <span style="flex:1;">Kích hoạt nạp tiền học sinh tự động — Không lo gián đoạn sinh hoạt trường</span>
      <button class="btn-mini" onclick="App.go('placeholder', {title:'Nạp tiền tự động', note:'Chưa có ảnh màn hình chi tiết.'})">Kích hoạt ngay</button>
    </div>
    <div class="section-heading">Đừng bỏ lỡ</div>
    <div class="promo-row">
      <div class="promo-card"><div class="p-title">Điện thoại trả sau</div><div class="p-price">An toàn bảo mật tối đa</div></div>
      <div class="promo-card"><div class="p-title">Bảo hiểm xe máy</div><div class="p-price">66,000đ</div></div>
      <div class="promo-card"><div class="p-title">Bảo hiểm ô tô</div><div class="p-price">480,700đ</div></div>
    </div>
    <div class="cta-bar sticky btn-row">
      <button class="btn btn-outline" onclick="App.resetTo('home')">Trang chủ</button>
      <button class="btn btn-primary" onclick="App.go('topup-amount', {studentId:'${s.id}'})">Giao dịch mới</button>
    </div>
  `;
};

/* ============================================================
   Screens: Lịch sử chi tiêu
   ============================================================ */
SCREENS.spending = function (params) {
  const s = App.student(params.studentId);
  const key = 'spend-filter-' + s.id;
  if (!App.formState[key]) App.formState[key] = '3m';
  const filter = App.formState[key];
  const txs = s.spending.transactions;
  const totalIn = txs.reduce((sum, t) => sum + (t.amount.startsWith('+') ? parseInt(t.amount.replace(/\D/g, '')) : 0), 0);

  return `
    ${topbarHTML('Lịch sử chi tiêu')}
    <div class="spend-card" onclick="App.openStudentPicker('spending', '${s.id}')">
      <div>
        <div class="name">${escapeHtml(s.name)}</div>
        <div class="code">${s.code}</div>
      </div>
      <span>›</span>
    </div>
    <div class="filter-row">
      <span class="filter-chip">Chọn ngày ▾</span>
      <span class="filter-chip ${filter === '3m' ? 'active' : ''}" onclick="App.formState['${key}']='3m'; App.render();">3 tháng</span>
      <span class="filter-chip ${filter === '6m' ? 'active' : ''}" onclick="App.formState['${key}']='6m'; App.render();">6 tháng</span>
    </div>
    <div class="section-heading">Nhật ký</div>
    <div class="summary-row">
      <div class="summary-box">Tiền vào<span class="val">${totalIn.toLocaleString('vi-VN')} điểm</span></div>
      <div class="summary-box">Tiền ra<span class="val">0 điểm</span></div>
    </div>
    ${txs.length ? txs.map(t => `
      <div class="list-item">
        <span class="glyph">◈</span>
        <div class="body">
          <div class="title">${escapeHtml(t.title)}</div>
          <div class="time">${escapeHtml(t.time)}</div>
        </div>
        <div class="amount">${escapeHtml(t.amount)}</div>
      </div>`).join('') : emptyStateHTML('Chưa có giao dịch')}
  `;
};

/* ============================================================
   Screens: Thời khoá biểu
   ============================================================ */
SCREENS.timetable = function (params) {
  const s = App.student(params.studentId);
  const t = s.timetable;
  return `
    ${topbarHTML('Thời khoá biểu')}
    ${studentHeaderHTML(s, { intent: 'timetable' })}
    ${!t.available ? emptyStateHTML('Chưa có thông tin') : `
      <div class="alert-box" style="border-style:solid;">
        <span>▦</span><span>Thời gian: ${escapeHtml(t.period)}</span>
      </div>
      <div class="card" style="height:340px;display:flex;align-items:center;justify-content:center;color:var(--c-gray-400);">
        [ Ảnh / tài liệu thời khoá biểu ]
      </div>
      <div class="text-center" style="margin-top:6px;">
        <button class="btn-link" onclick="App.go('placeholder', {title:'Tải xuống', note:'Chưa có ảnh minh hoạ file tải về thực tế.'})">⬇ Tải xuống</button>
      </div>
    `}
  `;
};

/* ============================================================
   Screens: Theo dõi điểm danh
   ============================================================ */
function buildCalendar(year, month, today) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells.map(d => d ? `<span class="day ${d === today ? 'today' : ''}">${d}</span>` : `<span class="day muted"></span>`).join('');
}

SCREENS.attendance = function (params) {
  const s = App.student(params.studentId);
  const tab = params.tab || 'diemdanh';
  const a = s.attendance;
  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const tabsBar = `
    <div class="subtabs">
      <button class="${tab === 'nhatky' ? 'active' : ''}" onclick="App.replace('attendance', {studentId:'${s.id}', tab:'nhatky'})">Nhật ký</button>
      <button class="${tab === 'diemdanh' ? 'active' : ''}" onclick="App.replace('attendance', {studentId:'${s.id}', tab:'diemdanh'})">Điểm danh</button>
    </div>`;

  if (tab === 'nhatky') {
    return `
      ${topbarHTML('Theo dõi điểm danh')}
      ${studentHeaderHTML(s, { intent: 'attendance' })}
      ${tabsBar}
      <div class="section-heading">Hoạt động gần đây</div>
      ${a.log.length ? a.log.map(l => `
        <div class="list-item">
          <span class="glyph">◷</span>
          <div class="body"><div class="title">${escapeHtml(l.title)}</div><div class="time">${escapeHtml(l.time)}</div></div>
        </div>`).join('') : emptyStateHTML('Chưa có thông tin')}
    `;
  }

  const stats = a.hasStats ? a.stats : {
    present: a.log.length, excused: 0, unexcused: 0, late: 0
  };

  return `
    ${topbarHTML('Theo dõi điểm danh')}
    ${studentHeaderHTML(s, { intent: 'attendance' })}
    ${tabsBar}
    <div class="card">
      <div class="card-title">Thống kê tháng 7</div>
      <div class="stat-grid">
        <div class="stat-item"><span class="dot filled"></span>Có mặt <b>${stats.present}</b></div>
        <div class="stat-item"><span class="dot"></span>Vắng có phép <b>${stats.excused}</b></div>
        <div class="stat-item"><span class="dot"></span>Vắng không phép <b>${stats.unexcused}</b></div>
        <div class="stat-item"><span class="dot"></span>Đến muộn <b>${stats.late}</b></div>
      </div>
    </div>
    <div class="calendar">
      <div class="calendar-head">
        <span>${a.monthLabel}</span>
        <span><button class="nav-btn">‹</button> <button class="nav-btn">›</button></span>
      </div>
      <div class="calendar-grid">
        ${weekdays.map(w => `<span class="wd">${w}</span>`).join('')}
        ${buildCalendar(a.year, a.month, a.today)}
      </div>
    </div>
    <div class="cta-bar sticky">
      <button class="btn btn-primary" onclick="App.go('absence-create', {studentId:'${s.id}'})">Báo vắng</button>
    </div>
  `;
};

/* ============================================================
   Screens: Báo vắng
   ============================================================ */
const ABSENCE_STATUS_LABEL = { pending: 'Chờ duyệt', approved: 'Đã duyệt', cancelled: 'Đã huỷ' };
const ABSENCE_STATUS_BADGE = { pending: 'outline', approved: 'filled', cancelled: 'muted' };
const ABSENCE_TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'cancelled', label: 'Đã huỷ' }
];

SCREENS['absence-list'] = function (params) {
  const s = App.student(params.studentId);
  const filter = params.filter || 'all';
  const items = s.absence.filter(a => filter === 'all' || a.status === filter);
  return `
    ${topbarHTML('Báo vắng')}
    ${studentHeaderHTML(s, { intent: 'absence' })}
    ${tabsHTML(ABSENCE_TABS, filter, `App.setAbsenceFilter_${s.id}`)}
    ${items.length ? items.map(a => `
      <div class="card">
        <div class="feedback-row"><span style="font-weight:700;">${escapeHtml(a.range)}</span>${badgeHTML(ABSENCE_STATUS_LABEL[a.status], ABSENCE_STATUS_BADGE[a.status])}</div>
        <div class="divider"></div>
        <div class="feedback-row"><span class="text-muted">Thời gian nghỉ</span><span>${escapeHtml(a.time)}</span></div>
        <div class="feedback-row"><span class="text-muted">Số ngày nghỉ</span><span>${a.days} ngày</span></div>
        <div class="feedback-row"><span class="text-muted">Nội dung</span><span>${escapeHtml(a.note)}</span></div>
      </div>`).join('') : emptyStateHTML('Chưa có đơn báo vắng')}
    <div class="cta-bar sticky">
      <button class="btn btn-primary" onclick="App.go('absence-create', {studentId:'${s.id}'})">Tạo đơn báo vắng</button>
    </div>
  `;
};
Object.keys(STUDENTS).forEach(id => {
  App['setAbsenceFilter_' + id] = function (val) { App.replace('absence-list', { studentId: id, filter: val }); };
});

SCREENS['absence-create'] = function (params) {
  const s = App.student(params.studentId);
  const key = 'absence-form-' + s.id;
  if (!App.formState[key]) App.formState[key] = { period: 'full', from: '2026-07-10', to: '2026-07-10', note: '', photos: 0 };
  const f = App.formState[key];
  return `
    ${topbarHTML('Tạo đơn báo vắng')}
    ${studentHeaderHTML(s)}
    <div class="field"><label>Hôm nay, ngày 10/07/2026</label></div>
    <div class="section-heading">Thời gian nghỉ</div>
    <div class="segmented" style="margin-top:0;">
      <button class="${f.period === 'full' ? 'active' : ''}" onclick="App.setAbsenceField('${s.id}','period','full')">Cả ngày</button>
      <button class="${f.period === 'morning' ? 'active' : ''}" onclick="App.setAbsenceField('${s.id}','period','morning')">Buổi sáng</button>
      <button class="${f.period === 'afternoon' ? 'active' : ''}" onclick="App.setAbsenceField('${s.id}','period','afternoon')">Buổi chiều</button>
    </div>
    <div class="field-row" style="margin:14px 16px;">
      <div class="field" style="margin:0;">
        <label>Từ ngày</label>
        <input type="date" class="input-box" value="${f.from}" onchange="App.setAbsenceField('${s.id}','from',this.value)">
      </div>
      <div class="field" style="margin:0;">
        <label>Đến ngày</label>
        <input type="date" class="input-box" value="${f.to}" onchange="App.setAbsenceField('${s.id}','to',this.value)">
      </div>
    </div>
    <div class="field">
      <label>Ghi chú</label>
      <textarea maxlength="256" placeholder="Nội dung *"
        oninput="App.formState['absence-form-${s.id}'].note=this.value;
                 document.getElementById('noteCount').textContent=this.value.length;
                 document.getElementById('absenceSubmitBtn').disabled=!this.value.trim();">${escapeHtml(f.note)}</textarea>
      <div class="char-count"><span id="noteCount">${f.note.length}</span>/256</div>
    </div>
    <div class="field">
      <label>Ảnh đính kèm — tối đa 10 ảnh (${f.photos}/10 ảnh)</label>
      <div class="upload-box" onclick="document.getElementById('absencePhotoInput').click()">
        <span>▤</span><span>Thư viện</span>
      </div>
      <input type="file" id="absencePhotoInput" class="hidden-input" accept="image/*" multiple
        onchange="App.addAbsencePhotos('${s.id}', this.files.length)">
    </div>
    <div class="cta-bar sticky">
      <button class="btn btn-primary" id="absenceSubmitBtn" ${f.note.trim() ? '' : 'disabled'} onclick="App.submitAbsence('${s.id}')">Nộp đơn</button>
    </div>
  `;
};

App.setAbsenceField = function (studentId, field, value) {
  const key = 'absence-form-' + studentId;
  const f = App.formState[key];
  f[field] = value;
  App.render();
};

App.addAbsencePhotos = function (studentId, count) {
  const f = App.formState['absence-form-' + studentId];
  f.photos = Math.min(10, f.photos + count);
  App.render();
};

/* ============================================================
   Screens: Bài tập
   ============================================================ */
const HW_STATUS_LABEL = { notsubmitted: 'Chưa nộp', submitted: 'Đã nộp', graded: 'Đã chấm' };
const HW_STATUS_BADGE = { notsubmitted: 'outline', submitted: 'filled', graded: 'filled' };
const HW_TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'notsubmitted', label: 'Chưa nộp' },
  { value: 'submitted', label: 'Đã nộp' },
  { value: 'graded', label: 'Đã chấm' }
];

SCREENS['homework-list'] = function (params) {
  const s = App.student(params.studentId);
  const filter = params.filter || 'all';
  const items = s.homework.filter(h => filter === 'all' || h.status === filter);
  return `
    ${topbarHTML('Bài tập')}
    ${studentHeaderHTML(s, { intent: 'homework' })}
    ${tabsHTML(HW_TABS, filter, `App.setHwFilter_${s.id}`)}
    ${items.length ? items.map(h => `
      <div class="card" onclick="App.go('homework-detail', {studentId:'${s.id}', hwId:'${h.id}'})">
        <div class="feedback-row"><span style="font-weight:700;">${escapeHtml(h.subject)}</span>${badgeHTML(HW_STATUS_LABEL[h.status], HW_STATUS_BADGE[h.status])}</div>
        <div class="feedback-row"><span>${escapeHtml(h.title)}</span></div>
        <div class="divider"></div>
        <div class="feedback-row">
          <span class="text-muted">${h.status === 'graded' ? 'Điểm: ' + h.score : ''}</span>
          <span class="text-muted" style="${h.overdue && h.status === 'notsubmitted' ? 'font-weight:700;' : ''}">${escapeHtml(h.dueDate)}${h.overdue && h.status === 'notsubmitted' ? ' (Quá hạn)' : ''} · ${escapeHtml(h.teacher)}</span>
        </div>
      </div>`).join('') : emptyStateHTML('Chưa có bài tập')}
    <div class="text-center text-muted" style="padding:14px;font-size:12.5px;">${items.length ? 'Bạn đã xem hết bài tập' : ''}</div>
  `;
};
Object.keys(STUDENTS).forEach(id => {
  App['setHwFilter_' + id] = function (val) { App.replace('homework-list', { studentId: id, filter: val }); };
});

SCREENS['homework-detail'] = function (params) {
  const s = App.student(params.studentId);
  const h = s.homework.find(x => x.id === params.hwId);
  const isDone = h.status === 'submitted' || h.status === 'graded';

  return `
    ${topbarHTML('Chi tiết bài tập')}
    ${h.overdue && !isDone ? `<div class="alert-box">⚠ Lưu ý: Bài tập đã quá hạn nộp bài</div>` : ''}
    <div class="feedback-card">
      <span class="feedback-card-tab">Nhận xét của Giáo viên</span>
      <div class="feedback-card-body">
        <div class="feedback-row"><span class="text-muted">Môn: ${escapeHtml(h.subject)}</span>${badgeHTML(HW_STATUS_LABEL[h.status], HW_STATUS_BADGE[h.status])}</div>
        <div class="feedback-row"><span class="text-muted">Giáo viên: ${escapeHtml(h.teacher)}</span></div>
        <div class="feedback-grade">
          <div><div class="g-label">Điểm</div><div>${h.score !== null ? h.score : '-'}</div></div>
          <div><div class="g-label">Nhận xét</div><div class="text-muted">${escapeHtml(h.comment)}</div></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="feedback-row"><span class="text-muted">Ngày giao</span><span>${h.assignedDate}</span></div>
      <div class="feedback-row"><span class="text-muted">Hạn nộp</span><span>${h.dueDate}</span></div>
    </div>
    <div class="section-heading">Bài tập nhỏ</div>
    <div class="card">
      <div class="feedback-row"><span class="text-muted">Nội dung bài tập:</span><button class="btn-link">Xem chi tiết</button></div>
      <div class="feedback-row"><span>${escapeHtml(h.content)}</span></div>
      <div class="text-muted" style="font-size:12.5px;margin-top:6px;">Tài liệu đính kèm:</div>
      <div class="attach-thumb">[ hình ảnh đính kèm ]</div>
      ${isDone ? `
        <div class="divider"></div>
        <div class="feedback-row"><span class="text-muted">Nội dung bài nộp:</span><button class="btn-link">Xem chi tiết</button></div>
      ` : ''}
    </div>
    <div class="cta-bar sticky">
      ${isDone
        ? `<button class="btn btn-primary" onclick="App.go('homework-submit', {studentId:'${s.id}', hwId:'${h.id}', mode:'edit'})">Chỉnh sửa bài nộp</button>`
        : `<button class="btn btn-primary" onclick="App.go('homework-submit', {studentId:'${s.id}', hwId:'${h.id}', mode:'new'})">Nộp bài tập</button>`}
    </div>
  `;
};

SCREENS['homework-submit'] = function (params) {
  const s = App.student(params.studentId);
  const h = s.homework.find(x => x.id === params.hwId);
  const key = 'hw-files-' + h.id;
  if (!App.formState[key]) App.formState[key] = h.submissionFiles.slice();
  const files = App.formState[key];
  const isEdit = params.mode === 'edit';

  return `
    ${topbarHTML('Nội dung bài nộp')}
    <div class="section-heading">Tài liệu đính kèm</div>
    <div class="upload-thumb-row">
      ${files.map((f, i) => `
        <div class="upload-thumb">
          <span>tệp</span>
          <span class="rm" onclick="App.removeHwFile('${h.id}', ${i})">✕</span>
        </div>`).join('')}
      ${!files.length ? `<div class="text-muted" style="font-size:12.5px;padding:8px 0;">Chưa có tệp nào</div>` : ''}
    </div>
    <div class="field">
      <label>Đã chọn (${files.length}) tệp</label>
      <div class="btn-row">
        <button class="btn btn-outline" onclick="document.getElementById('hwFileInputLib').click()">▤ Thư viện</button>
        <button class="btn btn-outline" onclick="document.getElementById('hwFileInputDoc').click()">▤ Tài liệu</button>
      </div>
      <input type="file" id="hwFileInputLib" class="hidden-input" accept="image/*" multiple onchange="App.addHwFiles('${h.id}', this.files)">
      <input type="file" id="hwFileInputDoc" class="hidden-input" multiple onchange="App.addHwFiles('${h.id}', this.files)">
    </div>
    <div class="cta-bar sticky">
      <button class="btn btn-primary" ${files.length ? '' : 'disabled'} onclick="App.submitHomework('${s.id}', '${h.id}', ${isEdit})">
        ${isEdit ? 'Cập nhật bài nộp' : 'Gửi bài tập'}
      </button>
    </div>
  `;
};

App.addHwFiles = function (hwId, fileList) {
  const key = 'hw-files-' + hwId;
  for (let i = 0; i < fileList.length; i++) App.formState[key].push(fileList[i].name);
  App.render();
};
App.removeHwFile = function (hwId, index) {
  App.formState['hw-files-' + hwId].splice(index, 1);
  App.render();
};
App.submitHomework = function (studentId, hwId, isEdit) {
  App.openDialog('homework-submit-success', { studentId, hwId, isEdit });
};
App.confirmHomeworkSubmit = function (studentId, hwId) {
  const s = App.student(studentId);
  const h = s.homework.find(x => x.id === hwId);
  h.status = 'submitted';
  h.submissionFiles = App.formState['hw-files-' + hwId].slice();
  App.closeOverlay(true);
  // The entry directly below 'homework-submit' is always the matching
  // 'homework-detail' (same studentId/hwId) — go back to it instead of
  // replacing, so we don't stack two identical entries back-to-back.
  App.back();
};

/* ============================================================
   Screens: Kết quả học tập
   ============================================================ */
SCREENS.results = function (params) {
  const s = App.student(params.studentId);
  const term = params.term || 'Học kỳ I';
  if (!s.results) {
    return `
      ${topbarHTML('Kết quả học tập')}
      ${studentHeaderHTML(s, { intent: 'results' })}
      ${emptyStateHTML('Chưa có kết quả học tập')}
    `;
  }
  const r = s.results;
  const t = r.terms[term];
  const terms = Object.keys(r.terms);
  return `
    ${topbarHTML('Kết quả học tập')}
    ${studentHeaderHTML(s, { intent: 'results' })}
    <div class="field" style="margin-bottom:0;"><label style="font-weight:700;">▨ Năm học ${r.year}</label></div>
    ${tabsHTML(terms.map(x => ({ value: x, label: x })), term, `App.setResultsTerm_${s.id}`)}
    <div class="section-heading">Tổng kết học kỳ</div>
    <div class="table-scroll">
      <table class="kv-table" style="margin:0 16px;width:calc(100% - 32px);">
        <thead><tr><th>Danh mục</th><th class="num">${escapeHtml(term)}</th></tr></thead>
        <tbody>
          <tr><td>Kết quả học tập</td><td class="num">${t.study}</td></tr>
          <tr><td>Kết quả hành vi</td><td class="num">${t.behavior}</td></tr>
          <tr><td>Số ngày nghỉ</td><td class="num">${t.absentDays}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="text-muted" style="font-size:11.5px;margin:10px 16px;">
      Ghi chú: T: Tốt, K: Khá, Đ: Đạt, CD: Chưa đạt / G: Giỏi, TT: Tiên tiến, XS: Xuất sắc
    </div>
    <div class="section-heading">Kết quả học tập</div>
    <div class="table-scroll">
      <table class="kv-table" style="margin:0 16px;width:calc(100% - 32px);">
        <thead><tr><th>Môn học</th><th class="num">ĐĐGTX</th><th class="num">ĐĐGK</th></tr></thead>
        <tbody>
          ${r.subjects.map(sub => `<tr><td>${escapeHtml(sub.name)}</td><td class="num">${sub.gtx}</td><td class="num">${sub.gk}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
};
Object.keys(STUDENTS).forEach(id => {
  App['setResultsTerm_' + id] = function (val) { App.replace('results', { studentId: id, term: val }); };
});

/* ============================================================
   Screens: Phiếu bé ngoan
   ============================================================ */
const GB_STATUS_LABEL = { dat: 'Đạt', khongdat: 'Không đạt' };
const GB_MEDALS = ['🥇', '🥈', '🥉'];
const GOODBEHAVIOR_TABS = [
  { value: 'card', label: 'Phiếu của con' },
  { value: 'summary', label: 'Tổng kết' }
];

SCREENS.goodbehavior = function (params) {
  const s = App.student(params.studentId);
  const tab = params.tab || 'card';
  const gb = s.goodBehavior;
  return `
    ${topbarHTML('Phiếu bé ngoan')}
    ${studentHeaderHTML(s, { intent: 'goodbehavior' })}
    ${tabsHTML(GOODBEHAVIOR_TABS, tab, `App.setGoodBehaviorTab_${s.id}`)}
    ${tab === 'summary' ? goodBehaviorSummaryHTML(gb) : goodBehaviorCardHTML(gb)}
  `;
};
Object.keys(STUDENTS).forEach(id => {
  App['setGoodBehaviorTab_' + id] = function (val) { App.replace('goodbehavior', { studentId: id, tab: val }); };
});

function goodBehaviorCardHTML(gb) {
  if (!gb.cycles.length) return emptyStateHTML('Chưa có phiếu bé ngoan');
  const latest = gb.cycles[0];
  const history = gb.cycles.slice(1);
  const isDat = latest.status === 'dat';
  return `
    <div class="gb-hero ${isDat ? '' : 'gb-hero--miss'}">
      <div class="gb-hero-icon">${isDat ? '★' : '☆'}</div>
      <div class="gb-hero-title">Phiếu bé ngoan</div>
      <div class="gb-hero-period">${escapeHtml(latest.label)}</div>
      <div class="gb-hero-msg">${isDat ? 'Con đã đạt Phiếu bé ngoan tuần này!' : 'Con chưa đạt phiếu kỳ này — cố gắng hơn ở kỳ sau nhé!'}</div>
      ${latest.comment ? `
        <div class="gb-hero-comment">
          <div class="gb-hero-comment-label">Nhận xét của cô</div>
          <div class="gb-hero-comment-text">"${escapeHtml(latest.comment)}"</div>
        </div>` : ''}
    </div>
    <div class="section-heading">Lịch sử</div>
    ${history.length ? history.map(c => `
      <div class="list-item">
        <span class="glyph">${c.status === 'dat' ? '★' : '☆'}</span>
        <div class="body"><div class="title">${escapeHtml(c.label)}</div></div>
        ${badgeHTML(GB_STATUS_LABEL[c.status], c.status === 'dat' ? 'filled' : 'muted')}
      </div>`).join('') : emptyStateHTML('Chưa có lịch sử phiếu bé ngoan')}
  `;
}

function goodBehaviorSummaryHTML(gb) {
  const r = gb.ranking;
  return `
    <div class="section-heading" style="margin-top:14px;">${escapeHtml(gb.yearLabel)}</div>
    <div class="card text-center">
      <div class="card-title" style="text-align:center;">Tổng số phiếu bé ngoan của con</div>
      <div class="gb-total">${r.achieved} / ${r.totalCycles} <span class="gb-total-unit">chu kỳ</span></div>
    </div>
    <div class="section-heading">Xếp hạng lớp (Top 3)</div>
    <div class="card">
      ${r.top3.map((item, i) => `
        <div class="feedback-row ${item.isSelf ? 'gb-rank-self' : ''}">
          <span>${GB_MEDALS[i]} ${escapeHtml(item.isSelf ? item.name : abbreviateName(item.name))}</span>
          <span style="font-weight:700;">${item.count} phiếu</span>
        </div>`).join('')}
      ${!r.selfInTop3 ? `
        <div class="divider"></div>
        <div class="feedback-row"><span class="text-muted">Vị trí của con</span><span style="font-weight:700;">#${r.selfRank}/${r.totalStudents}</span></div>
      ` : ''}
    </div>
  `;
}

/* ============================================================
   Screens: Liên kết học sinh
   ============================================================ */
SCREENS['link-intro'] = function () {
  return `
    <div class="topbar"><button class="icon-btn" onclick="App.back()">‹</button><span class="icon-btn-ghost"></span><span class="icon-btn-ghost"></span></div>
    <div class="brand-hero" style="margin-top:0;">
      <h1>THẺ HỌC SINH THÔNG MINH</h1>
      <p>Bước tiến mới trong chuyển đổi số giáo dục</p>
    </div>
    <div class="card">
      <div class="card-title">Quét hoặc nhập thông tin học sinh để liên kết</div>
      <div class="feedback-row" style="text-align:left;"><span>① Bước 1: Nhập mã học sinh và mã bảo vệ hoặc quét mã QR trên thẻ học sinh.</span></div>
      <div class="feedback-row" style="text-align:left;"><span>② Bước 2: Kiểm tra thông tin học sinh.</span></div>
      <div class="feedback-row" style="text-align:left;"><span>③ Bước 3: Nhấn "Xác nhận" để hoàn tất.</span></div>
    </div>
    <div class="push-bottom">
      <div class="cta-bar">
        <div class="btn-row" style="flex-direction:column;">
          <button class="btn btn-primary" onclick="App.go('placeholder', {title:'Quét mã QR', note:'Chưa có ảnh màn hình quét QR trong tài liệu tham chiếu.'})">Quét mã QR</button>
          <button class="btn btn-outline" style="margin-top:10px;" onclick="App.openSheet('link-code')">Nhập thông tin</button>
        </div>
      </div>
      <div class="text-center" style="margin-top:6px;padding-bottom:16px;">
        <span class="text-muted" style="font-size:12.5px;">Bạn làm hỏng, mất thẻ, </span>
        <button class="btn-link" onclick="App.go('placeholder', {title:'Cấp lại thẻ', note:'Chưa có ảnh màn hình cấp lại thẻ trong tài liệu tham chiếu.'})">Cấp lại thẻ</button>
      </div>
    </div>
  `;
};

/* ============================================================
   Screens: Hướng dẫn sử dụng
   ============================================================ */
const GUIDE_TOPICS = [
  { value: 'activate', label: 'Kích hoạt thẻ mới', title: 'Kích hoạt thẻ mới', steps: [
    'Chọn mục kích hoạt thẻ mới', 'Chọn quét mã kích hoạt', 'Quét mã QR trên thẻ học sinh', 'Xác nhận kích hoạt' ] },
  { value: 'topup', label: 'Nạp tiền vào thẻ', title: 'Nạp tiền vào thẻ', steps: [
    'Chọn mục nạp tiền vào thẻ', 'Chọn mệnh giá cần nạp. Bấm Nạp ngay', 'Chọn phương thức thanh toán', 'Xác nhận giao dịch' ] },
  { value: 'attendance', label: 'Theo dõi điểm danh', title: 'Theo dõi điểm danh', steps: [
    'Chọn Xem thêm', 'Lựa chọn học sinh cần xem', 'Chọn tab Điểm danh', 'Xem lịch điểm danh theo tháng' ] },
  { value: 'spending', label: 'Quản lý chi tiêu', title: 'Quản lý chi tiêu', steps: [
    'Chọn mục Quản lý chi tiêu', 'Theo dõi Quản lý chi tiêu của học sinh', 'Xem chi tiết giao dịch', 'Lọc theo khoảng thời gian' ] }
];

SCREENS.help = function (params) {
  const topicVal = params.topic || 'activate';
  const topic = GUIDE_TOPICS.find(t => t.value === topicVal);
  return `
    ${topbarHTML('Hướng dẫn sử dụng Thẻ học sinh')}
    ${tabsHTML(GUIDE_TOPICS, topicVal, 'App.setGuideTopic')}
    <div class="guide-topic-pill">${escapeHtml(topic.title)}</div>
    <div class="guide-steps">
      ${topic.steps.map((cap, i) => `
        <div class="guide-step">
          <div class="mock">▢</div>
          <div class="n">${i + 1}</div>
          <div class="cap">${escapeHtml(cap)}</div>
        </div>`).join('')}
    </div>
  `;
};
App.setGuideTopic = function (val) { App.replace('help', { topic: val }); };

/* ============================================================
   Bottom sheets
   ============================================================ */
const SHEETS = {};

SHEETS['student-picker'] = function (params) {
  const intent = params.intent || '';
  let list = Object.values(STUDENTS);
  if (intent === 'topup') list = list.filter(s => s.supportsTopUp);
  return `
    <div class="sheet-head">
      <span class="t">Danh sách học sinh</span>
      <button class="icon-btn" onclick="App.closeOverlay()">✕</button>
    </div>
    <div class="sheet-body">
      ${list.map(s => `
        <div class="pick-row ${s.id === params.currentStudentId ? 'selected' : ''}" onclick="App.pickStudent('${intent}', '${s.id}')">
          <div>
            <div class="student-name">${escapeHtml(s.name)}</div>
            <div class="student-code">${s.code}</div>
          </div>
          <div class="right">
            <div class="lbl">Số dư thẻ</div>
            <div class="val">${s.balance.toLocaleString('vi-VN')} điểm</div>
          </div>
        </div>`).join('')}
    </div>`;
};

SHEETS['fee-provider'] = function (params) {
  return `
    <div class="sheet-head">
      <span class="t">Chọn nhà cung cấp</span>
      <button class="icon-btn" onclick="App.closeOverlay()">✕</button>
    </div>
    <div class="sheet-body">
      <div class="search-box">⌕ <span>Tìm kiếm nhà cung cấp</span></div>
      ${PROVIDERS.map(p => `
        <div class="provider-row" onclick="App.chooseProvider('${params.studentId}', '${p.id}')">
          <div class="provider-logo">${p.logo}</div>
          <div class="name">${escapeHtml(p.name)}</div>
        </div>`).join('')}
    </div>`;
};

SHEETS['link-code'] = function () {
  return `
    <div class="sheet-head">
      <span class="t">Kích hoạt liên kết học sinh</span>
      <button class="icon-btn" onclick="App.closeOverlay()">✕</button>
    </div>
    <div class="sheet-body">
      <div class="text-muted" style="font-size:12.5px;margin:0 16px 10px;">
        Vui lòng liên hệ Hotline <b>1900 9005</b> để được hỗ trợ cung cấp mã bảo vệ
      </div>
      <div class="field">
        <input type="text" class="input-box" placeholder="Mã học sinh" id="linkCodeStudent" oninput="App.syncLinkCodeBtn()">
      </div>
      <div class="field">
        <input type="text" class="input-box" placeholder="Mã bảo vệ" id="linkCodeGuard" oninput="App.syncLinkCodeBtn()">
      </div>
      <div class="cta-bar">
        <button class="btn btn-primary" id="linkCodeBtn" disabled onclick="App.go('placeholder', {title:'Kết quả liên kết', note:'Chưa có ảnh màn hình kết quả liên kết học sinh trong tài liệu tham chiếu.'})">Xác nhận</button>
      </div>
    </div>`;
};

App.syncLinkCodeBtn = function () {
  const a = document.getElementById('linkCodeStudent');
  const b = document.getElementById('linkCodeGuard');
  const btn = document.getElementById('linkCodeBtn');
  if (a && b && btn) btn.disabled = !(a.value.trim() && b.value.trim());
};

/* ============================================================
   Dialogs (centered modals)
   ============================================================ */
const DIALOGS = {};

DIALOGS['absence-success'] = function (params) {
  return `
    <div class="dialog-card">
      <div class="d-title">Thành công</div>
      <div class="d-sub">Xin phép vắng thành công</div>
      <button class="btn btn-primary" onclick="App.confirmAbsence('${params.studentId}')">Đã hiểu</button>
    </div>`;
};

DIALOGS['homework-submit-success'] = function (params) {
  return `
    <div class="dialog-card">
      <div class="d-title">Nộp bài thành công</div>
      <div class="d-sub">Học sinh nộp bài thành công</div>
      <button class="btn btn-primary" onclick="App.confirmHomeworkSubmit('${params.studentId}', '${params.hwId}')">Đã hiểu</button>
    </div>`;
};

/* ============================================================
   Bootstrap
   ============================================================ */
window.App = App;

function setViewportHeightVar() {
  document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}

document.addEventListener('DOMContentLoaded', () => {
  setViewportHeightVar();
  window.addEventListener('resize', setViewportHeightVar);
  App.render();
});

App.submitAbsence = function (studentId) {
  App.openDialog('absence-success', { studentId });
};

App.confirmAbsence = function (studentId) {
  const s = App.student(studentId);
  const f = App.formState['absence-form-' + studentId];
  const fromParts = f.from.split('-');
  const toParts = f.to.split('-');
  const fmt = p => `${p[2]}/${p[1]}/${p[0]}`;
  s.absence.unshift({
    id: 'ab' + Date.now(),
    range: `${fmt(fromParts)} - ${fmt(toParts)}`,
    status: 'pending',
    time: f.period === 'full' ? 'Cả ngày' : f.period === 'morning' ? 'Buổi sáng' : 'Buổi chiều',
    days: 1,
    note: f.note
  });
  delete App.formState['absence-form-' + studentId];
  App.closeOverlay(true);
  App.replace('absence-list', { studentId, filter: 'all' });
};
