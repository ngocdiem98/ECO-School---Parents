export type BulletinCategory =
  | 'all'
  | 'general'
  | 'study-plan'
  | 'menu'
  | 'event'
  | 'holiday'
  | 'timetable'

export interface BulletinTab {
  id: BulletinCategory
  label: string
}

export interface BulletinPost {
  id: string
  category: Exclude<BulletinCategory, 'all'>
  categoryLabel: string
  timestamp: string
  title: string
  excerpt: string
  thumbnail?: string
  detailImage?: string
  pdfPreviewImage?: string
  fullContent: string
}

export const BULLETIN_TABS: BulletinTab[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'general', label: 'Thông báo chung' },
  { id: 'study-plan', label: 'Kế hoạch học tập' },
  { id: 'menu', label: 'Thực đơn' },
  { id: 'event', label: 'Sự kiện' },
  { id: 'holiday', label: 'Lịch nghỉ' },
  { id: 'timetable', label: 'Thời khóa biểu' },
]

export interface BulletinStudentProfile {
  id: string
  name: string
  code: string
  className: string
  school: string
}

export const BULLETIN_STUDENT_PROFILES: Record<string, BulletinStudentProfile> = {
  duong: {
    id: 'duong',
    name: 'Tạ Thái Dương',
    code: '340000000002',
    className: 'Lớp 1A',
    school: 'Trường FINVIET',
  },
  nhu: {
    id: 'nhu',
    name: 'Huỳnh Ngọc Trúc Như',
    code: '9192930041',
    className: 'Lớp 11A1',
    school: 'Trường FINVIET',
  },
  vy: {
    id: 'vy',
    name: 'Phan Khánh Vy',
    code: '9192930059',
    className: 'Lớp Mầm 1',
    school: 'Trường FINVIET',
  },
  lam: {
    id: 'lam',
    name: 'Lý Tường Lam',
    code: '9192930065',
    className: 'Lớp Chồi 2',
    school: 'Trường Mầm non Demo',
  },
  khoa: {
    id: 'khoa',
    name: 'Phạm Đăng Khoa',
    code: '731205864129',
    className: 'Lớp Mầm',
    school: 'Demo Soha',
  },
}

export const MOCK_BULLETIN_POSTS: BulletinPost[] = [
  {
    id: 'bul-0',
    category: 'timetable',
    categoryLabel: 'Thời khóa biểu',
    timestamp: '16:23 07/10/2026',
    title: 'Thời khóa biểu: 08/06/2026 - 13/06/2026 Cập nhật',
    excerpt:
      'Kính gửi Quý phụ huynh, Nhà trường kính gửi Quý phụ huynh và giáo viên thời khóa biểu tuần này, xin vui lòng xem chi tiết...',
    pdfPreviewImage: '/bulletin/timetable-pdf-preview.png',
    fullContent: [
      'Kính gửi Quý phụ huynh,',
      'Nhà trường kính gửi Quý phụ huynh và giáo viên thời khóa biểu tuần này, xin vui lòng xem chi tiết trong file đính kèm.',
      'Trân trọng!',
    ].join('\n\n'),
  },
  {
    id: 'bul-1',
    category: 'general',
    categoryLabel: 'Thông báo chung',
    timestamp: '10:01 29/09/2026',
    title: '🔔 TRƯỜNG LIÊN CẤP FINVIET TƯNG BỪNG CHÀO ĐÓN NĂM HỌC MỚI 2026 – 2027 🔔',
    excerpt:
      '✨ VỮNG BƯỚC TRI THỨC – TỰ TIN HỘI NHẬP & TIÊN PHONG CÔNG NGHỆ ✨Kính gửi Quý phụ huynh, Quý thầ...',
    fullContent: [
      '**✨ VỮNG BƯỚC TRI THỨC – TỰ TIN HỘI NHẬP & TIÊN PHONG CÔNG NGHỆ ✨**',
      'Kính gửi Quý phụ huynh, Quý thầy cô giáo cùng toàn thể các em học sinh thân mến! 💖',
      'Khi sắc vàng mùa thu ngập tràn trên từng con phố cũng là lúc tiếng trống trường rộn rã điểm nhịp cho một hành trình mới. Trường Phổ thông Liên cấp Finviet hân hoan chào đón toàn thể các em học sinh từ **Lớp 1 đến Lớp 12** chính thức bước vào năm học mới 2026 – 2027! 🏫🎒',
      'Mỗi cấp học tại Finviet là một chặng đường ghi dấu sự trưởng thành đầy tự hào của các em:',
      '🌱 **Khối Tiểu học (Lớp 1 – Lớp 5):** Nồng nhiệt chào đón các tân học sinh Lớp 1 chập chững bước vào ngưỡng cửa tri thức. Chúc các con sẽ có những năm tháng đầu đời tràn ngập tiếng cười, sự tự tin và niềm vui khám phá mỗi ngày.',
      '🌿 **Khối THCS (Lớp 6 – Lớp 9):** Chào đón các em học sinh Lớp 6 bước vào cấp học mới, nơi các em rèn luyện tư duy độc lập, trau dồi kiến thức đa chiều và rèn giũa kỹ năng thế kỷ 21.',
      '🌳 **Khối THPT (Lớp 10 – Lớp 12):** Chào mừng các bạn học sinh Lớp 10 gia nhập đại gia đình THPT Finviet, cùng các anh chị khối 11, 12 tiếp tục bứt phá bản thân, tích lũy bản lĩnh và hành trang vững chắc để tự tin chinh phục những giảng đường đại học mơ ước.',
      '🌐 TIÊN PHONG TRƯỜNG HỌC THÔNG MINH – ĐỒNG HÀNH TOÀN DIỆN CÙNG PHỤ HUYNH',
      'Bước vào năm học 2026 – 2027, Trường Liên cấp Finviet tiếp tục phát huy và nâng tầm môi trường giáo dục số hóa hiện đại thông qua hệ sinh thái ứng dụng ECO School:',
      '**07:30 – 08:30:** Nghi thức chào cờ, tuyên bố lý do, đọc thư Chủ tịch nước gửi ngành giáo dục nhân ngày khai trường.',
      '**08:30 – 08:45:** Diễn văn khai giảng của Ban Giám hiệu & Tiếng trống khai trường ngân vang.',
      '**08:45 – 09:30:** Chương trình văn nghệ đặc sắc do thầy trò các khối lớp biểu diễn.',
      '**09:30 – 10:30:** Học sinh di chuyển về lớp sinh hoạt đầu năm, gặp gỡ Giáo viên chủ nhiệm và nhận thời khóa biểu.',
      '📝 LƯU Ý DÀNH CHO QUÝ PHỤ HUYNH VÀ CÁC EM HỌC SINH',
      '**Trang phục:** Học sinh mặc lễ phục/đồng phục Finviet chỉnh tề, đi giày quai hậu/giày thể thao lịch sự (học sinh đeo khăn quàng đỏ đối với bậc Tiểu học và THCS).',
      '**Đúng giờ:** Đề nghị các em học sinh có mặt trước 07:00 để ổn định vị trí và xếp hàng theo sơ đồ khối lớp.',
      '**Liên kết ứng dụng:** Quý phụ huynh vui lòng kiểm tra và kích hoạt ứng dụng **ECO School** trên điện thoại để cập nhật kịp thời các thông báo đón/trả và kế hoạch học tập của con em mình.',
      '🎉 Chúc toàn thể các thầy cô giáo, các bậc phụ huynh và các em học sinh một năm học mới 2026 – 2027 tràn đầy năng lượng, ngập tràn niềm vui và gặt hái thật nhiều thành tích xuất sắc! 🌟',
      '📍 **HỆ THỐNG TRƯỜNG LIÊN CẤP FINVIET**',
      '📍 **Địa chỉ:** Số 34 Hoàng Việt, Phường Tân Sơn Nhất, TP. Hồ Chí Minh',
      '📧 **Email:** admin@thptfinviet.edu.vn',
    ].join('\n\n'),
  },
  {
    id: 'bul-2',
    category: 'holiday',
    categoryLabel: 'Lịch nghỉ',
    timestamp: '19:21 18/08/2026',
    title: 'Lịch nghỉ lễ 2/9',
    excerpt:
      '🔔 Nội dung notification nghỉ lễ 2/9Title: 🇻🇳 Thông báo nghỉ lễ Quốc khánh 2/9Body: Nhân dịp Quốc kh...',
    fullContent: [
      '🇻🇳 **Thông báo nghỉ lễ Quốc khánh 2/9**',
      'Nhân dịp Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam (02/09), Trường FINVIET trân trọng thông báo lịch nghỉ lễ đến Quý phụ huynh và toàn thể học sinh:',
      '• **Thời gian nghỉ:** Từ ngày 01/09/2026 đến hết ngày 02/09/2026.',
      '• **Thời gian đi học trở lại:** Thứ Năm, ngày 03/09/2026.',
      'Kính chúc Quý phụ huynh và gia đình kỳ nghỉ lễ vui vẻ, an toàn và hạnh phúc!',
    ].join('\n\n'),
  },
  {
    id: 'bul-3',
    category: 'general',
    categoryLabel: 'Thông báo chung',
    timestamp: '15:14 09/08/2026',
    title: 'THÔNG BÁO NGÀY TỰU TRƯỜNG',
    excerpt:
      'TRƯỜNG FINVIET trân trọng thông báo đến toàn thể học sinh:📅 Ngày tựu trường: 25/08/2026👔...',
    thumbnail: '/bulletin/thumb-tuu-truong.png',
    detailImage: '/bulletin/banner-tuu-truong-full.png',
    fullContent: [
      '**TRƯỜNG FINVIET** trân trọng thông báo đến toàn thể học sinh:',
      '📅 **Ngày tựu trường: 25/08/2026**',
      '👔 **Trang phục:** Học sinh mặc đúng quy định:',
      'Quần tây',
      'Áo sơ mi',
      'Giày bata trắng',
      'Kính đề nghị **toàn thể học sinh thực hiện đúng quy định về trang phục** và chuẩn bị đầy đủ để sẵn sàng cho ngày tựu trường.',
      '🌟 **Chúc các em có một ngày tựu trường vui vẻ, tràn đầy năng lượng và một năm học mới thật nhiều thành công!**',
    ].join('\n\n'),
  },
  {
    id: 'bul-4',
    category: 'event',
    categoryLabel: 'Sự kiện',
    timestamp: '10:00 20/07/2026',
    title: '🎉 CHÀO MỪNG HỌC SINH ĐẾN VỚI NĂM HỌC MỚI 2026–2027',
    excerpt:
      'Kính chào Quý Phụ huynh và các em học sinh,Nhà trường trân trọng thông báo chương trình "Chào...',
    thumbnail: '/bulletin/thumb-flag.png',
    detailImage: '/bulletin/thumb-flag.png',
    fullContent: [
      'Kính chào Quý Phụ huynh và các em học sinh,',
      'Nhà trường trân trọng thông báo chương trình **"Chào mừng học sinh đến với năm học mới 2026–2027"** cùng chuỗi hoạt động trải nghiệm CLB nghệ thuật, thể thao và STEM.',
      'Rất mong sự hiện diện của Quý phụ huynh và các em học sinh!',
    ].join('\n\n'),
  },
  {
    id: 'bul-5',
    category: 'general',
    categoryLabel: 'Thông báo chung',
    timestamp: '08:50 03/07/2026',
    title: 'THÔNG BÁO ĐIỂM CHUẨN TRÚNG TUYỂN LỚP 10',
    excerpt:
      'THÔNG BÁO ĐIỂM CHUẨN TRÚNG TUYỂN LỚP 10-------------------------------Điểm chuẩn t...',
    thumbnail: '/bulletin/thumb-diem-chuan.png',
    detailImage: '/bulletin/thumb-diem-chuan.png',
    fullContent: [
      '**THÔNG BÁO ĐIỂM CHUẨN TRÚNG TUYỂN LỚP 10 NĂM HỌC 2026 - 2027**',
      '• **Nguyện vọng 1:** 24.75 điểm',
      '• **Nguyện vọng 2:** 25.25 điểm',
      '• **Nguyện vọng 3:** 25.50 điểm',
      'Chúc mừng các em học sinh đã xuất sắc trúng tuyển vào Trường FINVIET!',
    ].join('\n\n'),
  },
  {
    id: 'bul-6',
    category: 'general',
    categoryLabel: 'Thông báo chung',
    timestamp: '01:49 02/07/2026',
    title: 'Ngày mai, toàn thể học sinh được nghỉ học',
    excerpt:
      'THÔNG BÁOKính gửi quý phụ huynh và các em học sinh,Nhà trường xin thông báo: Ngày mai, toàn thể học...',
    fullContent: [
      '**THÔNG BÁO**',
      'Kính gửi Quý phụ huynh và các em học sinh,',
      'Nhà trường xin thông báo: Ngày mai, toàn thể học sinh được nghỉ học để Hội đồng Sư phạm nhà trường tổ chức hội nghị tổng kết công tác bồi dưỡng chuyên môn hè. Các em học sinh sẽ quay trở lại học tập bình thường vào ngày kế tiếp.',
    ].join('\n\n'),
  },
  {
    id: 'bul-7',
    category: 'event',
    categoryLabel: 'Sự kiện',
    timestamp: '14:33 12/06/2026',
    title: '[12/06/26] 🎉 THÔNG BÁO SỰ KIỆN',
    excerpt:
      'Trường FINVIETKính gửi: Quý phụ huynh và học sinhNhà trường trân trọng thông báo sự kiện đặ...',
    thumbnail: '/bulletin/thumb-su-kien.png',
    detailImage: '/bulletin/thumb-su-kien.png',
    fullContent: [
      '**Trường FINVIET**',
      'Kính gửi: Quý phụ huynh và học sinh',
      'Nhà trường trân trọng thông báo sự kiện đặc biệt Đêm Gala Tổng kết & Tri ân **"Tỏa Sáng Ưc Mơ"** dành cho học sinh toàn trường.',
      '• **Thời gian:** 18:00 ngày 15/06/2026',
      '• **Địa điểm:** Hội trường lớn Trường FINVIET.',
    ].join('\n\n'),
  },
  {
    id: 'bul-8',
    category: 'menu',
    categoryLabel: 'Thực đơn',
    timestamp: '14:08 12/06/2026',
    title: '[12/06/26] 🍽️ THỰC ĐƠN TUẦN',
    excerpt:
      'Trường FINVIETThời gian áp dụng: 17/6/2026 – 21/6/2026Thứ Hai (17/6)Sáng: Bún bò Huế, sữa...',
    thumbnail: '/bulletin/thumb-thuc-don.png',
    detailImage: '/bulletin/thumb-thuc-don.png',
    fullContent: [
      '**Trường FINVIET** — Thời gian áp dụng: **17/6/2026 – 21/6/2026**',
      '• **Thứ Hai (17/6):** Sáng: Bún bò Huế, sữa tươi | Trưa: Cơm trắng, thịt kho trứng, canh rau ngót.',
      '• **Thứ Ba (18/6):** Sáng: Phở gà, chuối chín | Trưa: Cơm trắng, cá hồi sốt cam, canh bí đỏ.',
      '• **Thứ Tư (19/6):** Sáng: Nui nấu thịt bằm | Trưa: Cơm trắng, gà rô ti, canh cải ngọt.',
    ].join('\n\n'),
  },
  {
    id: 'bul-9',
    category: 'study-plan',
    categoryLabel: 'Kế hoạch học tập',
    timestamp: '14:06 12/06/2026',
    title: '[12/06/26] 📚 KẾ HOẠCH HỌC TẬP',
    excerpt:
      'Trường FINVIETKính gửi: Quý phụ huynh và học sinhNhà trường xin thông báo kế hoạch học tập trong tuầ...',
    fullContent: [
      '**Trường FINVIET**',
      'Kính gửi: Quý phụ huynh và học sinh',
      'Nhà trường xin thông báo kế hoạch học tập trong tuần từ ngày **15/06/2026 đến 20/06/2026**:',
      '• Ôn tập kiến thức trọng tâm môn Toán và Tiếng Việt.',
      '• Thực hành hoạt động ngoại khóa STEM và Tiếng Anh giao tiếp.',
      '• Phụ huynh vui lòng nhắc nhở các con chuẩn bị đầy đủ dụng cụ học tập.',
    ].join('\n\n'),
  },
]
