/**
 * Mock Data & Domain Calculations: Child Development Milestones (Kindergarten)
 * Legal Standards: Thong tu 51/2020/TT-BGDDT, Thong tu 23/2010/TT-BGDDT, Nghi dinh 13/2023/ND-CP
 */

import { Student } from '@/lib/mock-data'

export type StatutoryDomain =
  | 'physical'       // The chat
  | 'cognitive'      // Nhan thuc
  | 'language'       // Ngon ngu
  | 'social_emotion' // Tinh cam & Ky nang xa hoi
  | 'aesthetic';     // Tham my (Am nhac & Tao hinh)

export interface DomainMeta {
  key: StatutoryDomain;
  labelVi: string;
  shortLabel: string;
  icon: string;
  color: string;
  description: string;
}

export const STATUTORY_DOMAINS: DomainMeta[] = [
  {
    key: 'physical',
    labelVi: 'Phát triển Thể chất',
    shortLabel: 'Thể chất',
    icon: '🏃',
    color: '#3B82F6', // Blue
    description: 'Vận động thô, vận động tinh, dinh dưỡng và vệ sinh tự lập.',
  },
  {
    key: 'cognitive',
    labelVi: 'Phát triển Nhận thức',
    shortLabel: 'Nhận thức',
    icon: '🧩',
    color: '#10B981', // Green
    description: 'Khám phá khoa học, làm quen khái niệm toán sơ đẳng và so sánh.',
  },
  {
    key: 'language',
    labelVi: 'Phát triển Ngôn ngữ',
    shortLabel: 'Ngôn ngữ',
    icon: '💬',
    color: '#F59E0B', // Amber
    description: 'Kể chuyện, nghe hiểu, vốn từ, phản xạ diễn đạt và tiền đọc viết.',
  },
  {
    key: 'social_emotion',
    labelVi: 'Tình cảm - Xã hội',
    shortLabel: 'Tình cảm - XH',
    icon: '❤️',
    color: '#EC4899', // Pink
    description: 'Tự phục vụ, chia sẻ đồ chơi, tôn trọng bạn bè và tuân thủ quy tắc.',
  },
  {
    key: 'aesthetic',
    labelVi: 'Phát triển Thẩm mỹ',
    shortLabel: 'Thẩm mỹ',
    icon: '🎨',
    color: '#8B5CF6', // Purple
    description: 'Cảm nhận cái đẹp, ca hát, vận động theo nhạc, vẽ và tạo hình sáng tạo.',
  },
]

export type MilestoneState = 'achieved' | 'awaiting_ack' | 'in_progress' | 'delayed';

export interface MilestoneItem {
  id: string;
  domain: StatutoryDomain;
  title: string;
  description: string;
  targetAgeMonths: number;
  ageBandLabel: string;
  circular23Code?: string; // Bo chuan tre 5 tuoi (TT 23/2010)
  status: MilestoneState;
  achievedDate?: string;
  evidenceUrls: string[];
  homeActivities: string[];
  lagDays?: number;
}

export interface RadarDataPoint {
  domain: StatutoryDomain;
  label: string;
  achieved: number;
  total: number;
  percentage: number;
  color: string;
  x: number;
  y: number;
}

export interface TeacherTermReport {
  term: string;
  academicYear: string;
  teacherName: string;
  generalComment: string;
  domainFeedback: {
    domain: StatutoryDomain;
    evaluation: string;
    progressBadge: 'Đạt yêu cầu' | 'Đang phát triển' | 'Cần rèn luyện';
  }[];
  date: string;
  viewed: boolean;
}

// Mock Milestones for Phan Khanh Vy (Lop La, 5-6 tuoi / 72 thang)
export const VY_MILESTONES: MilestoneItem[] = [
  // 1. The chat
  {
    id: 'vy-phy-1',
    domain: 'physical',
    title: 'Nhảy lò cò 5 bước liên tục không ngã',
    description: 'Giữ thăng bằng và tiếp đất êm bằng nửa bàn chân trên một chân.',
    targetAgeMonths: 60,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 2 - Chỉ số 9',
    status: 'achieved',
    achievedDate: '12/08/2026',
    evidenceUrls: ['/demo-run.jpg'],
    homeActivities: ['Trò chơi nhảy lò cò ô vuông', 'Chơi đuổi bắt trên bãi cỏ'],
  },
  {
    id: 'vy-phy-2',
    domain: 'physical',
    title: 'Cầm kéo cắt lượn theo đường cong uốn lượn',
    description: 'Vận động tinh phối hợp ngón tay và mắt để cắt giấy theo đường vẽ sẵn.',
    targetAgeMonths: 66,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 3 - Chỉ số 15',
    status: 'achieved',
    achievedDate: '25/08/2026',
    evidenceUrls: ['/demo-scissors.jpg'],
    homeActivities: ['Cắt dán hoa lá trang trí phòng', 'Gấp và cắt hoa giấy gấp 4'],
  },
  // 2. Nhan thuc
  {
    id: 'vy-cog-1',
    domain: 'cognitive',
    title: 'Đếm và nhận biết chữ số từ 1 đến 10',
    description: 'Đếm xuôi, ngược trong phạm vi 10 và chỉ đúng số lượng đồ vật tương ứng.',
    targetAgeMonths: 60,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 22 - Chỉ số 104',
    status: 'achieved',
    achievedDate: '05/08/2026',
    evidenceUrls: [],
    homeActivities: ['Đếm số quả táo khi đi siêu thị', 'Ghép thẻ số với hạt đậu'],
  },
  {
    id: 'vy-cog-2',
    domain: 'cognitive',
    title: 'Phân loại đồ vật theo 2-3 dấu hiệu đồng thời',
    description: 'Sắp xếp nhóm đồ vật theo màu sắc kết hợp hình dạng hoặc kích thước.',
    targetAgeMonths: 66,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 21 - Chỉ số 98',
    status: 'in_progress',
    evidenceUrls: [],
    homeActivities: ['Phân loại khối Lego theo màu và kích thước', 'Dọn đồ chơi theo ngăn'],
  },
  // 3. Ngon ngu
  {
    id: 'vy-lang-1',
    domain: 'language',
    title: 'Kể lại một câu chuyện có mở đầu, diễn biến và kết thúc',
    description: 'Sử dụng câu hoàn chỉnh với ngữ điệu tự nhiên khi thuật lại truyện ngắn.',
    targetAgeMonths: 60,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 18 - Chỉ số 72',
    status: 'achieved',
    achievedDate: '18/08/2026',
    evidenceUrls: [],
    homeActivities: ['Đọc truyện cổ tích cùng mẹ trước khi ngủ', 'Kể lại một ngày ở trường'],
  },
  {
    id: 'vy-lang-2',
    domain: 'language',
    title: 'Nhận dạng chữ cái trong tên riêng của mình',
    description: 'Chỉ đúng chữ cái P-H-A-N K-H-A-N-H V-Y trên thẻ tên cá nhân.',
    targetAgeMonths: 66,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 19 - Chỉ số 88',
    status: 'achieved',
    achievedDate: '02/09/2026',
    evidenceUrls: [],
    homeActivities: ['Tập viết tên con bằng cát', 'Tìm chữ cái trên bìa sách truyện'],
  },
  // 4. Tinh cam - Xa hoi
  {
    id: 'vy-soc-1',
    domain: 'social_emotion',
    title: 'Chủ động chào hỏi và biết nói lời cảm ơn, xin lỗi đúng lúc',
    description: 'Thể hiện thái độ lễ phép với người lớn và thân thiện với bạn bè.',
    targetAgeMonths: 60,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 8 - Chỉ số 37',
    status: 'achieved',
    achievedDate: '10/08/2026',
    evidenceUrls: [],
    homeActivities: ['Đóng vai nhân vật chào đón khách đến nhà', 'Nhắc bé nói lời cảm ơn'],
  },
  {
    id: 'vy-soc-2',
    domain: 'social_emotion',
    title: 'Biết chờ đến lượt khi tham gia trò chơi tập thể',
    description: 'Không chen lấn, tôn trọng luật chơi và nhường đồ chơi cho bạn.',
    targetAgeMonths: 66,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 11 - Chỉ số 50',
    status: 'achieved',
    achievedDate: '28/08/2026',
    evidenceUrls: [],
    homeActivities: ['Chơi cờ cá ngựa gia đình', 'Chờ lượt nhận quà'],
  },
  // 5. Tham my (Mandatory per Thong tu 51/2020)
  {
    id: 'vy-aes-1',
    domain: 'aesthetic',
    title: 'Hát đúng giai điệu và lời bài hát mẫu giáo',
    description: 'Thể hiện bài hát thiếu nhi vui tươi, đúng nhịp và biết múa phụ họa đơn giản.',
    targetAgeMonths: 60,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 24 - Chỉ số 112',
    status: 'achieved',
    achievedDate: '15/08/2026',
    evidenceUrls: ['/demo-song.mp4'],
    homeActivities: ['Cùng bé nghe nhạc và gõ đệm theo tiết tấu', 'Hát karaoke thiếu nhi'],
  },
  {
    id: 'vy-aes-2',
    domain: 'aesthetic',
    title: 'Vẽ tranh thể hiện chi tiết người thân hoặc ngôi nhà',
    description: 'Bố cục rõ ràng, biết phối màu hài hòa và có câu chuyện sau bức tranh.',
    targetAgeMonths: 66,
    ageBandLabel: 'Mẫu giáo lớn (60-72 tháng)',
    circular23Code: 'Chuẩn 25 - Chỉ số 118',
    status: 'achieved',
    achievedDate: '01/09/2026',
    evidenceUrls: ['/demo-draw.jpg'],
    homeActivities: ['Vẽ tranh tặng ông bà', 'Nặn đồ vật từ đất sét màu'],
  },
]

// Mock Milestones for Vo Pham Hieu Lam (Lop Mam, 3-4 tuoi / 46 thang)
export const LAM_MILESTONES: MilestoneItem[] = [
  // 1. The chat
  {
    id: 'lam-phy-1',
    domain: 'physical',
    title: 'Đi lên xuống cầu thang vững vàng',
    description: 'Đặt chân luân phiên bước lên từng bậc có vịn tay vịn an toàn.',
    targetAgeMonths: 36,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'achieved',
    achievedDate: '15/05/2026',
    evidenceUrls: [],
    homeActivities: ['Đi dạo cầu thang bộ khu chung cư', 'Đi bộ trên đường dốc nhẹ'],
  },
  {
    id: 'lam-phy-2',
    domain: 'physical',
    title: 'Cài và cởi cúc áo cỡ lớn độc lập',
    description: 'Phối hợp ngón tay cái và ngón trỏ để luồn cúc qua khuy áo.',
    targetAgeMonths: 40,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'delayed', // > 60 days lag (age 46m vs target 40m)
    lagDays: 85,
    evidenceUrls: [],
    homeActivities: [
      'Trò chơi "Cài áo cho gấu bông"',
      'Luyện xâu hạt cườm to qua dây len mềm',
      'Tập bóc vỏ chuối, vỏ trứng luộc',
    ],
  },
  // 2. Nhan thuc
  {
    id: 'lam-cog-1',
    domain: 'cognitive',
    title: 'Nhận biết 4 màu sắc cơ bản (Đỏ, Vàng, Xanh lam, Xanh lá)',
    description: 'Chỉ đúng đồ vật mang màu sắc khi được hỏi.',
    targetAgeMonths: 36,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'achieved',
    achievedDate: '20/06/2026',
    evidenceUrls: [],
    homeActivities: ['Tìm đồ vật màu đỏ trong phòng', 'Chơi phân loại bóng màu'],
  },
  {
    id: 'lam-cog-2',
    domain: 'cognitive',
    title: 'Nhận biết hình vuông, hình tròn, hình tam giác',
    description: 'Thả đúng khối hình vào hộp đồ chơi thông minh.',
    targetAgeMonths: 42,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'awaiting_ack',
    evidenceUrls: ['/demo-blocks.jpg'],
    homeActivities: ['Xếp hình nhà từ các khối gỗ', 'Tìm hình tròn quanh nhà'],
  },
  // 3. Ngon ngu
  {
    id: 'lam-lang-1',
    domain: 'language',
    title: 'Nói câu hoàn chỉnh gồm 5-7 từ',
    description: 'Diễn đạt rõ ràng nhu cầu của bản thân như "Mẹ ơi con muốn uống nước".',
    targetAgeMonths: 36,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'achieved',
    achievedDate: '10/06/2026',
    evidenceUrls: [],
    homeActivities: ['Hỏi chuyện con sau giờ tan lớp', 'Cùng con gọi tên các con vật'],
  },
  {
    id: 'lam-lang-2',
    domain: 'language',
    title: 'Hiểu và thực hiện yêu cầu gồm 2 hành động liên tiếp',
    description: 'Ví dụ: "Con cất gấu bông vào rổ rồi ra bàn rửa tay".',
    targetAgeMonths: 42,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'in_progress',
    evidenceUrls: [],
    homeActivities: ['Trò chơi "Thuyền trưởng bảo"', 'Nhờ bé giúp việc vặt đơn giản'],
  },
  // 4. Tinh cam - Xa hoi
  {
    id: 'lam-soc-1',
    domain: 'social_emotion',
    title: 'Tự rửa tay bằng xà phòng dưới vòi nước chảy',
    description: 'Làm ướt tay, xoa xà phòng và xả sạch bọt theo hướng dẫn của cô.',
    targetAgeMonths: 36,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'achieved',
    achievedDate: '01/07/2026',
    evidenceUrls: [],
    homeActivities: ['Vừa rửa tay vừa hát bài Happy Birthday', 'Thực hành vệ sinh ăn uống'],
  },
  {
    id: 'lam-soc-2',
    domain: 'social_emotion',
    title: 'Biết chia sẻ đồ chơi cùng bạn dưới sự gợi ý của người lớn',
    description: 'Không tranh giành đồ chơi và cùng bạn xây tháp cát.',
    targetAgeMonths: 42,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'achieved',
    achievedDate: '15/08/2026',
    evidenceUrls: [],
    homeActivities: ['Cùng chơi lắp ráp Lego', 'Chia hoa quả cho bố mẹ'],
  },
  // 5. Tham my
  {
    id: 'lam-aes-1',
    domain: 'aesthetic',
    title: 'Nhún nhảy hoặc vỗ tay theo nhịp bài hát vui tươi',
    description: 'Cảm thụ giai điệu và vận động cơ thể theo tiếng nhạc.',
    targetAgeMonths: 36,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'achieved',
    achievedDate: '25/06/2026',
    evidenceUrls: [],
    homeActivities: ['Múa theo bài "Tập thể dục buổi sáng"', 'Gõ thìa vào cốc'],
  },
  {
    id: 'lam-aes-2',
    domain: 'aesthetic',
    title: 'Sử dụng đất nặn để vo tròn, lăn dài và ấn dẹt',
    description: 'Tạo hình các viên kẹo tròn hoặc chiếc bánh quy bằng đất nặn màu.',
    targetAgeMonths: 42,
    ageBandLabel: 'Mẫu giáo bé (36-48 tháng)',
    status: 'in_progress',
    evidenceUrls: [],
    homeActivities: ['Cùng mẹ nặn bánh trôi nước', 'Chơi bột mì nặn hình con vật'],
  },
]

export const MOCK_TEACHER_REPORT: TeacherTermReport = {
  term: 'Học kỳ I',
  academicYear: '2026 - 2027',
  teacherName: 'Cô Nguyễn Thị Mai (Chủ nhiệm Lớp Lá)',
  generalComment:
    'Bé Phan Khánh Vy có tính tự lập cao, hòa đồng với bạn bè. Các kỹ năng vận động tinh và thẩm mỹ phát triển rất đồng đều, đạt chuẩn chuẩn bị vào Lớp 1 theo Thông tư 23/2010 của Bộ GD&ĐT.',
  date: '28/09/2026',
  viewed: true,
  domainFeedback: [
    {
      domain: 'physical',
      evaluation: 'Nhanh nhẹn, thăng bằng tốt, khéo léo khi cầm bút và kéo.',
      progressBadge: 'Đạt yêu cầu',
    },
    {
      domain: 'cognitive',
      evaluation: 'Nhận biết tốt mặt số và hình khối, ham học hỏi và hay đặt câu hỏi "Vì sao?".',
      progressBadge: 'Đạt yêu cầu',
    },
    {
      domain: 'language',
      evaluation: 'Kể chuyện mạch lạc, vốn từ phong phú, phát âm tròn vành rõ chữ.',
      progressBadge: 'Đạt yêu cầu',
    },
    {
      domain: 'social_emotion',
      evaluation: 'Biết nhường nhịn bạn, tuân thủ nội quy lớp học và tích cực tham gia dọn dẹp.',
      progressBadge: 'Đạt yêu cầu',
    },
    {
      domain: 'aesthetic',
      evaluation: 'Hát đúng nhạc, vẽ tranh màu sắc tươi sáng và có trí tưởng tượng tốt.',
      progressBadge: 'Đạt yêu cầu',
    },
  ],
}

/**
 * Calculates 5-axis pentagonal radar coordinates
 * Center: (cx, cy), Radius: r
 * Angles: 90 deg (Top), 18 deg (Right top), 306 deg (Right bot), 234 deg (Left bot), 162 deg (Left top)
 */
export function computeRadarPoints(
  milestones: MilestoneItem[],
  cx = 140,
  cy = 135,
  maxR = 90
): { points: RadarDataPoint[]; polygonPath: string; overallScore: number; statusText: string } {
  // Angles for 5 statutory domains
  const angles: Record<StatutoryDomain, number> = {
    physical: 90,       // Top
    cognitive: 18,      // Top Right (90 - 72 = 18)
    language: 306,      // Bottom Right (18 - 72 = -54 = 306)
    social_emotion: 234,// Bottom Left (306 - 72 = 234)
    aesthetic: 162,     // Top Left (234 - 72 = 162)
  }

  let totalAchieved = 0
  let totalCount = 0

  const points: RadarDataPoint[] = STATUTORY_DOMAINS.map((domainMeta) => {
    const domainMilestones = milestones.filter((m) => m.domain === domainMeta.key)
    const achieved = domainMilestones.filter((m) => m.status === 'achieved').length
    const total = domainMilestones.length || 1
    const percentage = Math.round((achieved / total) * 100)

    totalAchieved += achieved
    totalCount += total

    // Convert polar to cartesian (SVG y goes down)
    const angleRad = (angles[domainMeta.key] * Math.PI) / 180
    // r clamped between 25% and 100% of maxR for clean visual appearance
    const visualPercent = Math.max(25, percentage) / 100
    const r = maxR * visualPercent

    const x = cx + r * Math.cos(angleRad)
    const y = cy - r * Math.sin(angleRad) // negative because SVG y axis is inverted

    return {
      domain: domainMeta.key,
      label: domainMeta.shortLabel,
      achieved,
      total,
      percentage,
      color: domainMeta.color,
      x: Math.round(x),
      y: Math.round(y),
    }
  })

  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  const overallScore = totalCount ? Math.round((totalAchieved / totalCount) * 100) : 0

  let statusText = 'Đang trên đà phát triển'
  if (overallScore >= 80) {
    statusText = 'Đạt yêu cầu độ tuổi'
  } else if (overallScore < 60) {
    statusText = 'Cần tăng cường rèn luyện'
  }

  return { points, polygonPath, overallScore, statusText }
}

export function getStudentMilestones(studentId: string): MilestoneItem[] {
  if (studentId === 'vy') return VY_MILESTONES
  if (studentId === 'lam') return LAM_MILESTONES
  return []
}

export function getStudentAgeMonths(dobStr: string): number {
  // dob format: DD/MM/YYYY
  const parts = dobStr.split('/')
  if (parts.length < 3) return 48
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  const birthDate = new Date(year, month, day)
  const now = new Date(2026, 9, 5) // Oct 5, 2026
  const diffMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth())
  return Math.max(1, diffMonths)
}
