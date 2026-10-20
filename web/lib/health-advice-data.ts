import { Student, HealthRecord, isMamNonStudent } from './mock-data'

export type AdviceTab = 'targets' | 'meals' | 'habits'

export interface GrowthPrinciple {
  icon: string
  lead: string
  desc: string
}

export interface GrowthTarget {
  currentWeight: number
  currentHeight: number
  currentZScore: number
  targetWeight3Mo: number
  targetHeight3Mo: number
  expectedZScore3Mo: string
  weightVelocity: string
  heightVelocity: string
  adviceHeadline: string
  adviceSubtext: string
  riskAlert: string | null
  principles?: GrowthPrinciple[]
}

export interface MealRecommendation {
  mealType: string
  icon: string
  dish: string
  description: string
  keyNutrients: string[]
  schoolSynergyTip?: string
}

export interface SmartSwap {
  avoid: string
  replaceWith: string
  benefit: string
  tag: string
}

export interface MicroHabit {
  id: string
  title: string
  subtitle: string
  icon: string
  category: 'nutrition' | 'activity' | 'sleep'
  defaultChecked?: boolean
}

export interface StudentActionableAdvice {
  studentId: string
  studentName: string
  ageYears: number
  ageGroup: 'mam_non' | 'tieu_hoc' | 'trung_hoc'
  ageGroupLabel: string
  bandKey: 'under' | 'normal' | 'over' | 'obese'
  bandLabel: string
  bandColor: string
  trendSummary: string | null
  target: GrowthTarget
  meals: MealRecommendation[]
  schoolLunchSynergyNote: string
  smartSwaps: SmartSwap[]
  habits: MicroHabit[]
}

// Calculate age in completed years from DD/MM/YYYY string
function getAgeFromDob(dob: string): number {
  const parts = dob.split('/')
  if (parts.length !== 3) return 10
  const birthYear = parseInt(parts[2], 10)
  // Current app context is school year 2026
  return Math.max(1, 2026 - birthYear)
}

function zScoreBandKey(z: number): 'under' | 'normal' | 'over' | 'obese' {
  if (z < -2) return 'under'
  if (z <= 2) return 'normal'
  if (z <= 3) return 'over'
  return 'obese'
}

function zScoreBandLabel(key: string): string {
  switch (key) {
    case 'under':
      return 'Thiếu cân'
    case 'normal':
      return 'Bình thường'
    case 'over':
      return 'Thừa cân'
    case 'obese':
      return 'Béo phì'
    default:
      return 'Bình thường'
  }
}

function zScoreBandColor(key: string): string {
  switch (key) {
    case 'under':
      return '#5c7cd1'
    case 'normal':
      return '#5bb87a'
    case 'over':
      return '#d6a02c'
    case 'obese':
      return '#cc9ba1'
    default:
      return '#5bb87a'
  }
}

function computeTrendSummary(history: HealthRecord[]): string | null {
  if (!history || history.length < 2) return null
  const [latest, previous] = history
  const delta = latest.zScore - previous.zScore
  if (Math.abs(delta) < 0.15) {
    return `Z-score ổn định so với lần đo trước (${previous.recordedAt})`
  }
  const dir = delta > 0 ? 'tăng' : 'giảm'
  return `Z-score đã ${dir} ${Math.abs(delta).toFixed(1)} so với lần đo trước (${previous.recordedAt})`
}

export function getAgeSpecificPrinciples(age: number, bandKey: 'under' | 'normal' | 'over' | 'obese'): GrowthPrinciple[] {
  if (age <= 3) {
    if (bandKey === 'under') {
      return [
        { icon: '🥗', lead: '1. Dinh dưỡng phục hồi đường ruột', desc: 'Thêm 1 thìa dầu gấc/dầu oliu vào cháo, súp; thêm bữa xế phô mai dầm bơ và sữa ấm giàu năng lượng.' },
        { icon: '😊', lead: '2. Tâm lý bàn ăn tích cực', desc: 'Khen ngợi khi bé chịu ăn ngoan; tuyệt đối không quát mắng hay ép ăn dồn dập một cữ.' },
        { icon: '🏃', lead: '3. Vận động kích thích tiêu hóa', desc: 'Cho bé chạy nhảy ngoài sân, chơi đuổi bắt 30 phút trước giờ ăn 1 tiếng để tạo cảm giác đói tự nhiên.' },
        { icon: '🌙', lead: '4. Tối ưu giấc ngủ sâu & đủ giấc', desc: 'Ngủ đủ 12–14 tiếng/ngày (kể cả ngủ trưa); vào giấc ngủ đêm trước 20h30 để cơ thể tái tạo mô.' },
        { icon: '📵', lead: '5. Bàn ăn hoàn toàn không màn hình', desc: 'Tuyệt đối không bật TV/iPad để dụ ăn; rèn bé ngồi ghế ăn dặm tập trung thưởng thức hương vị.' },
      ]
    } else if (bandKey === 'over' || bandKey === 'obese') {
      return [
        { icon: '🥗', lead: '1. Dinh dưỡng kiểm soát calo rỗng', desc: 'Cắt bỏ sữa bột béo và đồ ăn dặm ngọt; chuyển sang sữa tươi không đường và rau củ hấp mềm.' },
        { icon: '😊', lead: '2. Cả gia đình cùng làm gương', desc: 'Không khí gia đình ăn uống lành mạnh; nhẹ nhàng chuyển hướng khi bé đòi ăn vặt liên tục.' },
        { icon: '🏃', lead: '3. Vận động tiêu hao năng lượng', desc: 'Cho bé chơi xe chòi chân, đá bóng nhựa, leo bậc thang an toàn 45–60 phút mỗi ngày.' },
        { icon: '🌙', lead: '4. Ngủ đêm sâu & cắt cữ sữa đêm', desc: 'Không cho ngậm bình sữa ngủ ban đêm; đảm bảo phòng ngủ yên tĩnh giúp chuyển hóa mỡ tốt.' },
        { icon: '📵', lead: '5. Bàn ăn yên tĩnh & không thiết bị số', desc: 'Quy tắc không màn hình số trong bữa ăn; rèn luyện thói quen nhai kỹ nuốt chậm.' },
      ]
    } else {
      return [
        { icon: '🥗', lead: '1. Dinh dưỡng đa dạng & tập nhai thô', desc: 'Nấu thức ăn thái hạt lựu, rèn phản xạ nhai nuốt thức ăn thô; tăng cường trái cây tươi giàu vitamin.' },
        { icon: '😊', lead: '2. Không khí gia đình vui vẻ', desc: 'Khích lệ bé tự cầm thìa xúc ăn; tạo niềm vui và sự tự lập hào hứng trong từng bữa ăn.' },
        { icon: '🏃', lead: '3. Vận động ngoài trời đều đặn', desc: 'Chạy nhảy, đá bóng nhựa, đi dạo công viên 30–45 phút mỗi ngày để hấp thu Vitamin D tự nhiên.' },
        { icon: '🌙', lead: '4. Giữ nhịp sinh học giấc ngủ vàng', desc: 'Đi ngủ đúng giờ lúc 20h30; duy trì thói quen nghe đọc truyện tranh trước khi ngủ.' },
        { icon: '📵', lead: '5. Zero Screen Time bàn ăn', desc: 'Không dùng điện thoại trong bữa ăn; tránh xa ánh sáng xanh trước giờ ngủ 1 tiếng.' },
      ]
    }
  } else {
    // 4-6 years old (and school-age)
    if (bandKey === 'under') {
      return [
        { icon: '🥗', lead: '1. Dinh dưỡng tăng cơ & bồi bổ vi chất', desc: 'Bổ sung đạm nạc (thịt bò, trứng, cá hồi, đậu hũ); thêm bữa phụ sữa tươi nguyên kem và hạt dinh dưỡng.' },
        { icon: '😊', lead: '2. Thấu hiểu tâm lý & lắng nghe con', desc: 'Trò chuyện tìm hiểu tâm lý của con sau giờ học; khích lệ con tự tin, không so sánh thể hình với bạn bè.' },
        { icon: '🏃', lead: '3. Thể thao kích thích chiều cao', desc: 'Rèn luyện thể thao vừa sức 30–45 phút/ngày (bóng rổ, chạy bộ) để kích thích trao đổi chất.' },
        { icon: '🌙', lead: '4. Ngủ đủ giấc đón đỉnh hormone GH', desc: 'Ngủ sâu giấc trước 21h30; đảm bảo 10–11 tiếng mỗi đêm để tối ưu hóa phát triển tầm vóc.' },
        { icon: '📵', lead: '5. Cân bằng thời gian số khoa học', desc: 'Giới hạn giải trí số dưới 1 giờ/ngày; thay màn hình bằng đọc sách và trò chuyện cùng cha mẹ.' },
      ]
    } else if (bandKey === 'over' || bandKey === 'obese') {
      return [
        { icon: '🥗', lead: '1. Kiểm soát calo rỗng & ăn rau trước cơm', desc: 'Cắt giảm triệt để nước ngọt, trà sữa, đồ chiên rán; thực hiện quy tắc ăn đĩa rau củ và canh trước bữa cơm.' },
        { icon: '😊', lead: '2. Tôn trọng tâm lý & không dán nhãn', desc: 'Cả nhà cùng chuyển đổi lối sống lành mạnh; không chê bai hay tạo áp lực mặc cảm về cân nặng của con.' },
        { icon: '🏃', lead: '3. Thể thao giải phóng mỡ & giảm tải khớp', desc: 'Tập bơi lội, đạp xe, đi bộ nhanh 45–60 phút mỗi ngày để tiêu hao calo mà không gây chấn thương khớp gối.' },
        { icon: '🌙', lead: '4. Ngủ sớm & ngừng ăn 2 tiếng trước ngủ', desc: 'Đi ngủ trước 21h30; tuyệt đối không ăn khuya hoặc uống sữa ngọt trước khi ngủ.' },
        { icon: '📵', lead: '5. Kỷ luật màn hình số & việc nhà', desc: 'Rút ngắn thời gian ngồi tĩnh tại trước TV/iPad; khuyến khích tham gia việc nhà và hoạt động dã ngoại cuối tuần.' },
      ]
    } else {
      return [
        { icon: '🥗', lead: '1. Dinh dưỡng cân đối & đủ chất', desc: 'Ăn đa dạng các nhóm chất (đạm, tinh bột, chất béo lành mạnh, vitamin), tăng cường rau củ quả tươi; tuyệt đối không áp dụng ăn kiêng hà khắc hay ép ăn.' },
        { icon: '😊', lead: '2. Tâm lý tích cực & thoải mái', desc: 'Xây dựng không khí gia đình vui vẻ, không dán nhãn ngoại hình hay so sánh chỉ số cân nặng, khuyến khích sự tự giác và hào hứng trong mỗi bữa ăn.' },
        { icon: '🏃', lead: '3. Rèn luyện thể chất mỗi ngày', desc: 'Khuyến khích vận động ngoài trời tối thiểu 30–45 phút mỗi ngày (chạy bộ, nhảy dây, đạp xe, bơi lội) để tăng cường chuyển hóa và hấp thụ Vitamin D tự nhiên.' },
        { icon: '🌙', lead: '4. Tối ưu giấc ngủ sâu & đúng giờ', desc: 'Đảm bảo trẻ ngủ đủ giấc trước 21h30 để đón trọn vẹn đỉnh tiết hormone tăng trưởng GH phát triển chiều cao.' },
        { icon: '📵', lead: '5. Cân bằng thời gian số & nếp sống lành mạnh', desc: 'Giới hạn thời gian dùng thiết bị điện tử dưới 1 giờ/ngày; tránh xa màn hình trước giờ ngủ để bảo vệ thị lực và nhịp sinh học tự nhiên.' },
      ]
    }
  }
}

export function getActionableHealthAdvice(
  student: Student,
  history: HealthRecord[] = student.healthHistory
): StudentActionableAdvice {
  const age = getAgeFromDob(student.dob)
  const isMamNon = isMamNonStudent(student) || age <= 5
  const isTieuHoc = !isMamNon && age <= 11
  const ageGroup: 'mam_non' | 'tieu_hoc' | 'trung_hoc' = isMamNon
    ? 'mam_non'
    : isTieuHoc
    ? 'tieu_hoc'
    : 'trung_hoc'
  const ageGroupLabel = isMamNon
    ? `Lứa tuổi Mầm non (${age} tuổi)`
    : isTieuHoc
    ? `Lứa tuổi Tiểu học (${age} tuổi)`
    : `Lứa tuổi Trung học (${age} tuổi)`

  const bandKey = zScoreBandKey(student.zScore)
  const bandLabel = zScoreBandLabel(bandKey)
  const bandColor = zScoreBandColor(bandKey)
  const trendSummary = computeTrendSummary(history)
  const principles = getAgeSpecificPrinciples(age, bandKey)

  // 1. Build Growth Target (Lộ trình 90 ngày)
  let target: GrowthTarget
  if (bandKey === 'under') {
    // Underweight: safe catch-up growth
    const addWeight = isMamNon ? 1.0 : 1.5
    const addHeight = isMamNon ? 2.4 : 2.0
    target = {
      currentWeight: student.weightKg,
      currentHeight: student.heightCm,
      currentZScore: student.zScore,
      targetWeight3Mo: +(student.weightKg + addWeight).toFixed(1),
      targetHeight3Mo: +(student.heightCm + addHeight).toFixed(1),
      expectedZScore3Mo: (student.zScore + 0.7).toFixed(1),
      weightVelocity: isMamNon ? '+350g – 450g / tháng' : '+400g – 550g / tháng',
      heightVelocity: '+0.7cm – 0.9cm / tháng',
      adviceHeadline: 'Mục tiêu: Thoát ngưỡng thiếu cân an toàn sau 90 ngày',
      adviceSubtext:
        'Tập trung phục hồi thể trạng bằng đạm chất lượng cao và chất béo lành mạnh tại bữa ăn gia đình, kết hợp củng cố hệ vi sinh đường ruột.',
      riskAlert:
        student.zScore <= -2.4
          ? 'Chỉ số Z-score đang ở vùng thiếu cân đáng kể. Ba mẹ nên chú ý bổ sung kẽm và vi chất theo chỉ dẫn bác sĩ dinh dưỡng.'
          : null,
      principles,
    }
  } else if (bandKey === 'over' || bandKey === 'obese') {
    // Overweight: maintain weight while gaining height to naturally normalize z-score
    const targetWeight = +(student.weightKg - (bandKey === 'obese' ? 0.8 : 0.2)).toFixed(1)
    const addHeight = isMamNon ? 2.0 : 1.5
    target = {
      currentWeight: student.weightKg,
      currentHeight: student.heightCm,
      currentZScore: student.zScore,
      targetWeight3Mo: targetWeight,
      targetHeight3Mo: +(student.heightCm + addHeight).toFixed(1),
      expectedZScore3Mo: (student.zScore - 0.4).toFixed(1),
      weightVelocity: 'Giữ cân hoặc giảm nhẹ ≤ 200g / tháng',
      heightVelocity: '+0.5cm – 0.8cm / tháng',
      adviceHeadline: 'Mục tiêu: Kéo dài chiều cao, kiểm soát calo rỗng',
      adviceSubtext:
        'Tuyệt đối không ép trẻ nhịn ăn. Mục tiêu là phát triển chiều cao để tỷ lệ cơ thể tự cân đối lại về ngưỡng an toàn.',
      riskAlert:
        trendSummary && trendSummary.includes('tăng')
          ? 'Z-score có xu hướng tiếp tục tăng so với lần đo trước. Cần điều chỉnh ngay thói quen ăn vặt buổi tối và đồ uống có đường.'
          : null,
      principles,
    }
  } else {
    // Normal: sustain healthy velocity
    const addWeight = isMamNon ? 0.6 : 0.8
    const addHeight = isMamNon ? 2.0 : 1.8
    target = {
      currentWeight: student.weightKg,
      currentHeight: student.heightCm,
      currentZScore: student.zScore,
      targetWeight3Mo: +(student.weightKg + addWeight).toFixed(1),
      targetHeight3Mo: +(student.heightCm + addHeight).toFixed(1),
      expectedZScore3Mo: student.zScore.toFixed(1),
      weightVelocity: '+200g – 300g / tháng',
      heightVelocity: '+0.6cm – 0.8cm / tháng',
      adviceHeadline: 'Mục tiêu: Giữ vững đà tăng trưởng và bứt phá chiều cao',
      adviceSubtext:
        'Chỉ số thể lực đang ở mức rất lý tưởng. Ba mẹ hãy tiếp tục duy trì chế độ dinh dưỡng đa dạng và thói quen rèn luyện thể thao hàng ngày.',
      riskAlert: null,
      principles,
    }
  }

  // 2. Build Vietnamese Home Meals (Thực đơn gia đình Việt)
  let meals: MealRecommendation[] = []
  let schoolLunchSynergyNote = ''

  if (isMamNon) {
    if (bandKey === 'under') {
      meals = [
        {
          mealType: 'Bữa sáng tại nhà',
          icon: '🌅',
          dish: 'Súp gà ngô non nấm hương hoặc Cháo lươn đồng bí đỏ',
          description:
            'Nấu nhuyễn mềm, giàu đạm và kẽm kích thích vị giác. Khi múc ra chén, thêm 1 thìa cà phê dầu gấc hoặc dầu oliu để tăng hấp thu vitamin.',
          keyNutrients: ['Kẽm sinh học', 'Đạm dễ tiêu', 'Dầu thực vật tốt'],
        },
        {
          mealType: 'Bữa tối gia đình',
          icon: '🍲',
          dish: 'Canh sườn hầm củ dền cà rốt + Trứng hấp đậu hũ non thịt băm',
          description:
            'Bữa ăn ấm cúng, đậm đà, dễ nhai nuốt. Đậu hũ non kết hợp thịt nạc cung cấp canxi và axit amin thiết yếu cho cơ bắp bé.',
          keyNutrients: ['Canxi & Sắt', 'Chất xơ hòa tan', 'Collagen tự nhiên'],
          schoolSynergyTip:
            'Trưa ở trường bé đã ăn cơm thịt/cá với lượng vừa phải. Bữa tối nên ưu tiên canh hầm đậm vị để bé bổ sung thêm nước và chất khoáng.',
        },
        {
          mealType: 'Bữa phụ dinh dưỡng',
          icon: '🥑',
          dish: 'Sinh tố bơ chuối sữa chua hoặc Phô mai miếng kèm chuối chín',
          description:
            'Cung cấp khoảng 180–220 kcal năng lượng sạch, không làm bé đầy bụng nhưng giúp tăng cân đều đặn.',
          keyNutrients: ['Lợi khuẩn Probiotics', 'Axit béo Omega-9', 'Kali'],
        },
      ]
      schoolLunchSynergyNote =
        'Bữa ăn bán trú mầm non thường cung cấp khoảng 50–55% năng lượng ngày. Ba mẹ bổ sung 1 bữa xế dinh dưỡng tại nhà lúc 16:30 ngay sau khi đón bé về.'
    } else {
      meals = [
        {
          mealType: 'Bữa sáng tại nhà',
          icon: '🌅',
          dish: 'Bánh canh tôm thịt nạc hoặc Cháo cá hồi nấu rau mồng tơi',
          description:
            'Vị ngọt tự nhiên từ hải sản, cung cấp năng lượng dồi dào để bé tỉnh táo tham gia các hoạt động vui chơi ở lớp.',
          keyNutrients: ['Omega-3 DHA', 'Canxi hữu cơ', 'Vitamin nhóm B'],
        },
        {
          mealType: 'Bữa tối gia đình',
          icon: '🍲',
          dish: 'Canh bí đao thịt nạc băm + Cá lóc kho nghệ + Đĩa rau củ luộc',
          description:
            'Bữa cơm gia đình thuần Việt, thanh mát giúp giải nhiệt và hỗ trợ giấc ngủ đêm sâu giấc.',
          keyNutrients: ['Curcumin nghệ', 'Chất xơ tiêu hóa', 'Đạm nạc'],
          schoolSynergyTip:
            'Ăn kèm đĩa dưa chuột hoặc cà rốt hấp mềm để tập cho bé thói quen thích ăn rau xanh tự nhiên.',
        },
        {
          mealType: 'Bữa phụ dinh dưỡng',
          icon: '🍊',
          dish: 'Sữa chua không đường trộn hoa quả tươi hoặc Nước cam ép nguyên chất',
          description:
            'Bổ sung vitamin C tự nhiên tăng đề kháng, giúp bé ít ốm vặt khi thời tiết thay đổi.',
          keyNutrients: ['Vitamin C', 'Men vi sinh', 'Flavonoid'],
        },
      ]
      schoolLunchSynergyNote =
        'Thực đơn trường mầm non đã bảo đảm năng lượng chuẩn. Ba mẹ duy trì bữa tối nhẹ nhàng, tránh ép ăn quá no sau 19h30.'
    }
  } else {
    // School-age (Tiểu học & Trung học: Đăng Khoa, Trúc Như)
    if (bandKey === 'over' || bandKey === 'obese') {
      meals = [
        {
          mealType: 'Bữa sáng khởi động',
          icon: '🌅',
          dish: 'Phở bò tái nạc nhiều hành tây (không lấy nước béo) hoặc Bánh mì nguyên cám 2 trứng ốp la',
          description:
            'Cung cấp protein dồi dào tạo cảm giác no lâu, ổn định đường huyết, tránh cảm giác đói cồn cào lúc 10h sáng.',
          keyNutrients: ['Protein chất lượng', 'Sắt tự nhiên', 'Không dầu béo'],
        },
        {
          mealType: 'Bữa tối gia đình',
          icon: '🥗',
          dish: 'Đĩa súp lơ xanh & cà rốt luộc ăn trước + Ức gà áp chảo sốt mè + 1/2 chén gạo lứt/gạo trắng',
          description:
            'Áp dụng quy tắc "ăn rau trước, cơm sau": chất xơ bao phủ dạ dày giúp kiểm soát hấp thu chất béo và tinh bột hiệu quả.',
          keyNutrients: ['Chất xơ kháng', 'Đạm nạc tinh khiết', 'Magiê'],
          schoolSynergyTip:
            'Căn-tin trường thường có nhiều món chiên rán và trà sữa. Bữa tối tại nhà cần tuyệt đối hạn chế đồ chiên ngập dầu và nước chấm ngọt.',
        },
        {
          mealType: 'Bữa phụ lành mạnh',
          icon: '🍎',
          dish: 'Táo giòn cắt lát hoặc 1 ly sữa tươi không đường tiệt trùng 180ml',
          description:
            'Giúp giải tỏa cơn đói sau giờ học mà không nạp calo rỗng. Tránh xa các loại bánh snack, trà sữa.',
          keyNutrients: ['Pectin tự nhiên', 'Canxi xương', 'Không đường thêm'],
        },
      ]
      schoolLunchSynergyNote =
        'Bữa trưa tại trường học sinh thường có xu hướng ăn vặt cùng bạn bè. Ba mẹ nên chuẩn bị sẵn bình nước lọc 1.5L và 1 phần hoa quả mang theo.'
    } else {
      meals = [
        {
          mealType: 'Bữa sáng khởi động',
          icon: '🌅',
          dish: 'Bún bò giò nạc + 1 ly sữa tươi ấm hoặc Xôi đậu phộng thịt nạc ram',
          description:
            'Cung cấp đủ năng lượng cho 5 tiết học buổi sáng, giúp não bộ tập trung cao độ và không bị mệt mỏi.',
          keyNutrients: ['Carb phức hợp', 'Canxi & Kẽm', 'Vitamin B12'],
        },
        {
          mealType: 'Bữa tối gia đình',
          icon: '🍲',
          dish: 'Cá hồi/cá thu sốt cà chua + Canh cua đồng mồng tơi + Thịt bò xào bông cải',
          description:
            'Nguồn canxi và vi chất vàng cho lứa tuổi dậy thì, thúc đẩy sự kéo dài của các đầu xương ống.',
          keyNutrients: ['Canxi từ cua đồng', 'Omega-3', 'Sắt chống thiếu máu'],
          schoolSynergyTip:
            'Bổ sung thêm 1 hộp sữa chua sau bữa tối 1 tiếng để hỗ trợ tiêu hóa trọn vẹn chất đạm từ bữa trưa và tối.',
        },
        {
          mealType: 'Bữa phụ bổ trí não',
          icon: '🥜',
          dish: 'Hạt điều sấy mộc hoặc 1 ly sữa hạt sen hạnh nhân ít đường',
          description:
            'Chất béo chưa bão hòa hỗ trợ dẫn truyền thần kinh, giảm căng thẳng trong các kỳ thi.',
          keyNutrients: ['Chất béo Omega-6/9', 'Vitamin E', 'Magiê'],
        },
      ]
      schoolLunchSynergyNote =
        'Cân bằng dinh dưỡng giữa thực đơn bán trú và gia đình giúp con duy trì thể lực dẻo dai và vóc dáng cân đối.'
    }
  }

  // 3. Smart Food Swaps (Đổi món thông minh)
  let smartSwaps: SmartSwap[] = []
  if (bandKey === 'under') {
    smartSwaps = [
      {
        avoid: 'Sữa tươi tách béo / ít đường',
        replaceWith: 'Sữa tươi nguyên kem / Sữa hạt sen óc chó',
        benefit: 'Tăng thêm 80–110 kcal năng lượng sạch và axit béo lành mạnh',
        tag: 'Tăng hấp thu',
      },
      {
        avoid: 'Nước hầm xương chỉ có nước trong',
        replaceWith: 'Cháo đặc ninh sườn rây thịt + 1 thìa dầu gấc',
        benefit: 'Chứa đạm thực sự và vitamin tan trong dầu thay vì chỉ có nước béo',
        tag: 'Bổ sung chất',
      },
      {
        avoid: 'Bánh kẹo ngọt ăn vặt trước bữa',
        replaceWith: 'Sữa chua trộn bơ tươi / Chuối dẻo sau bữa 1h',
        benefit: 'Tránh ngang dạ biếng ăn bữa chính, tối ưu hóa năng lượng bữa phụ',
        tag: 'Đúng giờ giấc',
      },
    ]
  } else if (bandKey === 'over' || bandKey === 'obese') {
    smartSwaps = [
      {
        avoid: 'Trà sữa trân châu / Nước ngọt có gas',
        replaceWith: 'Nước ép bưởi ổi không đường hoặc Trà gạo lứt mát',
        benefit: 'Cắt giảm ngay 350–450 kcal từ đường tinh luyện gây tích mỡ nội tạng',
        tag: 'Cắt calo rỗng',
      },
      {
        avoid: 'Gà rán tẩm bột chiên ngập dầu',
        replaceWith: 'Ức gà nướng mật ong sốt tỏi / Áp chảo không dầu',
        benefit: 'Giảm 65% lượng mỡ bão hòa nhưng vẫn giữ trọn vẹn độ ngon miệng',
        tag: 'Đạm nạc sạch',
      },
      {
        avoid: 'Ăn cơm trắng thật no để chống đói',
        replaceWith: 'Ăn 1 chén canh rau hoặc đĩa rau luộc trước khi ăn cơm',
        benefit: 'Tạo cảm giác no tự nhiên nhờ chất xơ, hạ chỉ số đường huyết sau ăn',
        tag: 'Thứ tự ăn đúng',
      },
    ]
  } else {
    smartSwaps = [
      {
        avoid: 'Mì ăn liền / Xúc xích chiên cổng trường',
        replaceWith: 'Bắp ngô luộc / Khoai lang hấp / Trứng luộc',
        benefit: 'Nạp năng lượng bền vững, bảo vệ hệ tiêu hóa khỏi chất bảo quản',
        tag: 'Năng lượng sạch',
      },
      {
        avoid: 'Thức khuya học bài rồi ăn mì tôm',
        replaceWith: '1 ly sữa ấm ít đường trước giờ ngủ 30 phút',
        benefit: 'Kích thích hormone melatonin giúp ngủ sâu, tối ưu phát triển chiều cao',
        tag: 'Giấc ngủ vàng',
      },
      {
        avoid: 'Uống nước ngọt khi khát sau thể thao',
        replaceWith: 'Nước dừa tươi / Nước chanh muối ấm loãng',
        benefit: 'Bù điện giải tự nhiên (Kali, Natri) nhanh hơn nước ngọt công nghiệp',
        tag: 'Bù khoáng',
      },
    ]
  }

  // 4. 7-Day Micro-Habits (Kế hoạch hành động tuần)
  let habits: MicroHabit[] = []
  if (bandKey === 'under') {
    habits = [
      {
        id: 'h_milk',
        title: 'Bổ sung 1 ly sữa ấm nguyên kem / sinh tố bơ',
        subtitle: 'Uống vào khoảng 20:30 trước khi đi ngủ 45 phút',
        icon: '🥛',
        category: 'nutrition',
        defaultChecked: true,
      },
      {
        id: 'h_play',
        title: isMamNon ? '20 phút vui chơi chạy nhảy ngoài trời' : '30 phút chơi thể thao kích thích vị giác',
        subtitle: 'Giúp bé tiêu hao năng lượng tự nhiên để ăn ngon miệng hơn vào bữa tối',
        icon: '🏃‍♂️',
        category: 'activity',
        defaultChecked: false,
      },
      {
        id: 'h_sleep',
        title: isMamNon ? 'Lên giường ngủ trước 21:15 tối' : 'Ngủ sâu giấc trước 22:30',
        subtitle: 'Đảm bảo đỉnh tiết hormone tăng trưởng (GH) trong khung giờ 22:00 – 02:00',
        icon: '😴',
        category: 'sleep',
        defaultChecked: false,
      },
    ]
  } else if (bandKey === 'over' || bandKey === 'obese') {
    habits = [
      {
        id: 'h_water',
        title: 'Uống 1 ly nước lọc lớn trước mỗi bữa ăn 10 phút',
        subtitle: 'Giúp giảm tốc độ ăn và hạn chế ăn quá no không kiểm soát',
        icon: '💧',
        category: 'nutrition',
        defaultChecked: true,
      },
      {
        id: 'h_cardio',
        title: '30–45 phút vận động ra mồ hôi mỗi ngày',
        subtitle: 'Đi bộ nhanh, nhảy dây 500 cái hoặc bơi lội sau giờ học',
        icon: '🚴‍♂️',
        category: 'activity',
        defaultChecked: false,
      },
      {
        id: 'h_screen',
        title: 'Tắt màn hình điện thoại / TV trước khi ngủ 45 phút',
        subtitle: 'Hạn chế ánh sáng xanh làm rối loạn hormone chuyển hóa melatonin và leptin',
        icon: '📵',
        category: 'sleep',
        defaultChecked: false,
      },
    ]
  } else {
    habits = [
      {
        id: 'h_dairy',
        title: 'Duy trì đủ 2 phần sữa / chế phẩm sữa mỗi ngày',
        subtitle: 'Cung cấp tối thiểu 500mg Canxi hữu cơ xây dựng khung xương chắc khỏe',
        icon: '🥛',
        category: 'nutrition',
        defaultChecked: true,
      },
      {
        id: 'h_sport',
        title: '30 phút rèn luyện thể thao yêu thích',
        subtitle: 'Bóng rổ, bơi lội, cầu lông hoặc đạp xe cùng bạn bè',
        icon: '⚽',
        category: 'activity',
        defaultChecked: true,
      },
      {
        id: 'h_rest',
        title: 'Đảm bảo ngủ đủ 8–9 tiếng mỗi đêm',
        subtitle: 'Phục hồi hệ thần kinh và tạo nền tảng cho sự phát triển toàn diện',
        icon: '😴',
        category: 'sleep',
        defaultChecked: false,
      },
    ]
  }

  return {
    studentId: student.id,
    studentName: student.name,
    ageYears: age,
    ageGroup,
    ageGroupLabel,
    bandKey,
    bandLabel,
    bandColor,
    trendSummary,
    target,
    meals,
    schoolLunchSynergyNote,
    smartSwaps,
    habits,
  }
}

export interface HabitDayInfo {
  key: string // 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7'
  dateNum: string // '05'
  fullDate: string // '05/10/2026'
}

export interface HabitWeek {
  id: string
  label: string
  dateRange: string
  isCurrent?: boolean
  daysList: HabitDayInfo[]
}

export interface DailyActivity {
  id: string
  title: string
  subtitle: string
  icon: string
}

export const LAST_6_WEEKS: HabitWeek[] = [
  {
    id: 'hw1',
    label: 'Tuần : 12/10/2026 - 17/10/2026',
    dateRange: '12/10/2026 - 17/10/2026',
    isCurrent: true,
    daysList: [
      { key: 'T2', dateNum: '12', fullDate: '12/10/2026' },
      { key: 'T3', dateNum: '13', fullDate: '13/10/2026' },
      { key: 'T4', dateNum: '14', fullDate: '14/10/2026' },
      { key: 'T5', dateNum: '15', fullDate: '15/10/2026' },
      { key: 'T6', dateNum: '16', fullDate: '16/10/2026' },
      { key: 'T7', dateNum: '17', fullDate: '17/10/2026' },
    ],
  },
  {
    id: 'hw2',
    label: 'Tuần : 05/10/2026 - 10/10/2026',
    dateRange: '05/10/2026 - 10/10/2026',
    daysList: [
      { key: 'T2', dateNum: '05', fullDate: '05/10/2026' },
      { key: 'T3', dateNum: '06', fullDate: '06/10/2026' },
      { key: 'T4', dateNum: '07', fullDate: '07/10/2026' },
      { key: 'T5', dateNum: '08', fullDate: '08/10/2026' },
      { key: 'T6', dateNum: '09', fullDate: '09/10/2026' },
      { key: 'T7', dateNum: '10', fullDate: '10/10/2026' },
    ],
  },
  {
    id: 'hw3',
    label: 'Tuần : 13/07/2026 - 18/07/2026',
    dateRange: '13/07/2026 - 18/07/2026',
    daysList: [
      { key: 'T2', dateNum: '13', fullDate: '13/07/2026' },
      { key: 'T3', dateNum: '14', fullDate: '14/07/2026' },
      { key: 'T4', dateNum: '15', fullDate: '15/07/2026' },
      { key: 'T5', dateNum: '16', fullDate: '16/07/2026' },
      { key: 'T6', dateNum: '17', fullDate: '17/07/2026' },
      { key: 'T7', dateNum: '18', fullDate: '18/07/2026' },
    ],
  },
  {
    id: 'hw4',
    label: 'Tuần : 06/07/2026 - 11/07/2026',
    dateRange: '06/07/2026 - 11/07/2026',
    daysList: [
      { key: 'T2', dateNum: '06', fullDate: '06/07/2026' },
      { key: 'T3', dateNum: '07', fullDate: '07/07/2026' },
      { key: 'T4', dateNum: '08', fullDate: '08/07/2026' },
      { key: 'T5', dateNum: '09', fullDate: '09/07/2026' },
      { key: 'T6', dateNum: '10', fullDate: '10/07/2026' },
      { key: 'T7', dateNum: '11', fullDate: '11/07/2026' },
    ],
  },
  {
    id: 'hw5',
    label: 'Tuần : 29/06/2026 - 04/07/2026',
    dateRange: '29/06/2026 - 04/07/2026',
    daysList: [
      { key: 'T2', dateNum: '29', fullDate: '29/06/2026' },
      { key: 'T3', dateNum: '30', fullDate: '30/06/2026' },
      { key: 'T4', dateNum: '01', fullDate: '01/07/2026' },
      { key: 'T5', dateNum: '02', fullDate: '02/07/2026' },
      { key: 'T6', dateNum: '03', fullDate: '03/07/2026' },
      { key: 'T7', dateNum: '04', fullDate: '04/07/2026' },
    ],
  },
  {
    id: 'hw6',
    label: 'Tuần : 18/05/2026 - 23/05/2026',
    dateRange: '18/05/2026 - 23/05/2026',
    daysList: [
      { key: 'T2', dateNum: '18', fullDate: '18/05/2026' },
      { key: 'T3', dateNum: '19', fullDate: '19/05/2026' },
      { key: 'T4', dateNum: '20', fullDate: '20/05/2026' },
      { key: 'T5', dateNum: '21', fullDate: '21/05/2026' },
      { key: 'T6', dateNum: '22', fullDate: '22/05/2026' },
      { key: 'T7', dateNum: '23', fullDate: '23/05/2026' },
    ],
  },
]

export const DEFAULT_WEEK_ACTIVITIES: DailyActivity[] = [
  {
    id: 'act1',
    title: 'Uống đủ 500ml sữa & nước ấm',
    subtitle: 'Bổ sung Canxi & Vitamin D cho xương chắc khỏe',
    icon: '🥛',
  },
  {
    id: 'act2',
    title: 'Vận động thể chất ngoài trời ≥ 30 phút',
    subtitle: 'Chạy bộ, nhảy dây, đá bóng hoặc đạp xe cùng bạn bè',
    icon: '🏃',
  },
  {
    id: 'act3',
    title: 'Đi ngủ trước 21h30 (ngủ đủ 9-10 tiếng)',
    subtitle: 'Tối ưu hormone tăng trưởng GH sản sinh trong giấc ngủ sâu',
    icon: '😴',
  },
]

export interface HabitRecommendation {
  title: string
  subtitle: string
  icon: string
}

export const HABIT_TOP_RECOMMENDATIONS: Record<number, HabitRecommendation[]> = {
  0: [
    { title: 'Ăn thêm 1 phần rau củ & trái cây tươi', subtitle: 'Bổ sung chất xơ và các loại Vitamin thiết yếu', icon: '🥗' },
    { title: 'Hạn chế bánh kẹo & nước ngọt có gas', subtitle: 'Kiểm soát đường và bảo vệ chỉ số BMI lành mạnh', icon: '🚫' },
    { title: 'Uống 1 ly sữa ấm trước khi ngủ 30 phút', subtitle: 'Bổ sung Canxi và giúp bé ngủ ngon sâu giấc', icon: '🥛' },
  ],
  1: [
    { title: 'Tập bơi hoặc đạp xe cùng gia đình', subtitle: 'Phát triển sức bền và kích thích tăng trưởng chiều cao', icon: '🚴' },
    { title: 'Tập thể dục buổi sáng 15 phút', subtitle: 'Khởi động trao đổi chất và tinh thần phấn chấn', icon: '🤸' },
    { title: 'Đi bộ hoặc chạy bộ trong công viên', subtitle: 'Hít thở không khí trong lành và hấp thụ Vitamin D', icon: '🏃' },
  ],
  2: [
    { title: 'Đọc sách 20 phút trước giờ ngủ', subtitle: 'Thư giãn trí não và nâng cao kỹ năng ngôn ngữ', icon: '📚' },
    { title: 'Đánh răng kỹ 2 lần sáng & tối', subtitle: 'Bảo vệ nụ cười trắng sáng và phòng ngừa sâu răng', icon: '🦷' },
    { title: 'Không xem TV/iPad trước giờ ngủ 1 tiếng', subtitle: 'Bảo vệ thị lực và tối ưu hormone tăng trưởng GH', icon: '📵' },
  ],
}

export interface AgeSpecificActivity {
  id: string
  title: string
  subtitle: string
  icon: string
  category: 'nutrition' | 'fitness' | 'lifestyle'
}

// 15 Hoạt động khuyến nghị dành riêng cho nhóm 2–3 tuổi (Nhà trẻ & Lớp Mầm)
export const RECOMMENDED_ACTIVITIES_AGE_2_3: AgeSpecificActivity[] = [
  { id: 'act-2-3-01', title: 'Tập nhai kỹ thức ăn thái nhỏ', subtitle: 'Rèn luyện cơ hàm và phản xạ nhai nuốt thức ăn thô', icon: '🥕', category: 'nutrition' },
  { id: 'act-2-3-02', title: 'Uống 1 cữ sữa ấm sau bữa xế', subtitle: 'Bổ sung Canxi và năng lượng phát triển xương chắc khỏe', icon: '🥛', category: 'nutrition' },
  { id: 'act-2-3-03', title: 'Ăn hết phần canh rau củ nấu mềm', subtitle: 'Bổ sung chất xơ và vitamin, phòng ngừa táo bón', icon: '🥣', category: 'nutrition' },
  { id: 'act-2-3-04', title: 'Ăn nửa quả chuối hoặc bơ dầm', subtitle: 'Hỗ trợ tiêu hóa và bổ sung axit béo lành mạnh', icon: '🥑', category: 'nutrition' },
  { id: 'act-2-3-05', title: 'Uống đủ 4–5 cốc nước nhỏ mỗi ngày', subtitle: 'Giữ ẩm cơ thể và tăng cường bài tiết chất thải', icon: '💧', category: 'nutrition' },
  { id: 'act-2-3-06', title: 'Không ăn bánh kẹo sát bữa chính', subtitle: 'Giữ cảm giác thèm ăn tự nhiên cho bữa chính ngon miệng', icon: '🚫', category: 'nutrition' },
  { id: 'act-2-3-07', title: 'Tự cầm thìa xúc ăn 10 phút đầu', subtitle: 'Rèn luyện tính tự lập và sự khéo léo của bàn tay', icon: '🥄', category: 'lifestyle' },
  { id: 'act-2-3-08', title: 'Đi dạo và chạy nhảy ngoài trời 30p', subtitle: 'Kích thích tiêu hóa và hấp thụ Vitamin D tự nhiên', icon: '🏃', category: 'fitness' },
  { id: 'act-2-3-09', title: 'Chơi đá bóng nhựa hoặc nhặt bóng', subtitle: 'Phát triển phối hợp tay mắt và khả năng thăng bằng', icon: '⚽', category: 'fitness' },
  { id: 'act-2-3-10', title: 'Đạp xe chòi chân 3 bánh trong sân', subtitle: 'Tăng cường sức mạnh cơ chân và phản xạ nhanh', icon: '🚲', category: 'fitness' },
  { id: 'act-2-3-11', title: 'Cùng ba mẹ cất đồ chơi vào rổ', subtitle: 'Hình thành nếp sống ngăn nắp và kỹ năng vận động tinh', icon: '🧸', category: 'lifestyle' },
  { id: 'act-2-3-12', title: 'Lên giường đi ngủ đúng lúc 20h30', subtitle: 'Tối ưu hóa thời gian tiết hormone tăng trưởng GH ban đêm', icon: '🌙', category: 'lifestyle' },
  { id: 'act-2-3-13', title: 'Nghe ba mẹ đọc truyện tranh trước ngủ', subtitle: 'Thư giãn trí não và làm giàu vốn từ vựng đầu đời', icon: '📚', category: 'lifestyle' },
  { id: 'act-2-3-14', title: 'Lau miệng và tập chải răng cùng ba mẹ', subtitle: 'Bảo vệ men răng sữa và phòng ngừa sâu răng sớm', icon: '🦷', category: 'lifestyle' },
  { id: 'act-2-3-15', title: 'Không xem TV/điện thoại trong bữa ăn', subtitle: 'Phòng ngừa biếng ăn thụ động và bảo vệ thị lực bé', icon: '📵', category: 'lifestyle' },
]

// 15 Hoạt động khuyến nghị dành riêng cho nhóm 4–6 tuổi (Lớp Chồi & Lớp Lá / Tiền tiểu học)
export const RECOMMENDED_ACTIVITIES_AGE_4_6: AgeSpecificActivity[] = [
  { id: 'act-4-6-01', title: 'Ăn đủ 1 bát rau xanh mỗi bữa ăn', subtitle: 'Bổ sung chất xơ, vitamin và khoáng chất tự nhiên', icon: '🥗', category: 'nutrition' },
  { id: 'act-4-6-02', title: 'Uống sữa tươi không đường/ít đường', subtitle: 'Cung cấp Canxi và Vitamin D bứt phá chiều cao', icon: '🥛', category: 'nutrition' },
  { id: 'act-4-6-03', title: 'Ăn cá hoặc tôm 2-3 lần trong tuần', subtitle: 'Bổ sung Canxi hữu cơ, đạm nạc và Omega-3 DHA', icon: '🐟', category: 'nutrition' },
  { id: 'act-4-6-04', title: 'Ăn trái cây tươi thay cho nước ngọt', subtitle: 'Cung cấp vitamin sạch và kiểm soát lượng calo rỗng', icon: '🍎', category: 'nutrition' },
  { id: 'act-4-6-05', title: 'Uống đủ 1.2 – 1.5 lít nước lọc/ngày', subtitle: 'Tăng cường trao đổi chất và duy trì năng lượng năng động', icon: '💧', category: 'nutrition' },
  { id: 'act-4-6-06', title: 'Không ăn đồ chiên rán sau 19h00', subtitle: 'Ngăn ngừa tích mỡ thừa và bảo vệ giấc ngủ ban đêm', icon: '🚫', category: 'nutrition' },
  { id: 'act-4-6-07', title: 'Tập bơi lội hoặc đạp xe 45 phút/ngày', subtitle: 'Kéo giãn cột sống và tăng cường dung tích phổi', icon: '🏊', category: 'fitness' },
  { id: 'act-4-6-08', title: 'Nhảy dây hoặc bật cao với bóng 15p', subtitle: 'Kích thích sụn tiếp hợp phát triển chiều cao tối đa', icon: '🤸', category: 'fitness' },
  { id: 'act-4-6-09', title: 'Chạy bộ và chơi thể thao cùng bạn bè', subtitle: 'Rèn luyện sức bền, phản xạ và tinh thần đồng đội', icon: '🏃', category: 'fitness' },
  { id: 'act-4-6-10', title: 'Đu xà đơn thấp hoặc leo thang dây', subtitle: 'Phát triển cơ vai, bắp tay và kéo thẳng cột sống', icon: '🧗', category: 'fitness' },
  { id: 'act-4-6-11', title: 'Tự dọn góc học tập và phòng ngủ', subtitle: 'Rèn luyện tính kỷ luật và nếp sống tự lập chuẩn bị vào lớp 1', icon: '🧹', category: 'lifestyle' },
  { id: 'act-4-6-12', title: 'Đi ngủ trước 21h30 và ngủ đủ 10 tiếng', subtitle: 'Đón trọn vẹn đỉnh tiết hormone tăng trưởng chiều cao', icon: '🌙', category: 'lifestyle' },
  { id: 'act-4-6-13', title: 'Đọc sách 20 phút trước khi đi ngủ', subtitle: 'Phát triển ngôn ngữ, tư duy logic và thư giãn tinh thần', icon: '📚', category: 'lifestyle' },
  { id: 'act-4-6-14', title: 'Đánh răng đúng cách 2 lần sáng & tối', subtitle: 'Bảo vệ nụ cười khỏe đẹp và hàm răng vĩnh viễn', icon: '🦷', category: 'lifestyle' },
  { id: 'act-4-6-15', title: 'Giới hạn giải trí số dưới 1 giờ/ngày', subtitle: 'Bảo vệ mắt sáng và duy trì lối sống vận động ngoài trời', icon: '📵', category: 'lifestyle' },
]

export function getRecommendedActivitiesByAge(dob: string): AgeSpecificActivity[] {
  const parts = dob.split('/')
  const birthYear = parts.length === 3 ? parseInt(parts[2], 10) : 2020
  const age = Math.max(1, 2026 - birthYear)
  return age <= 3 ? RECOMMENDED_ACTIVITIES_AGE_2_3 : RECOMMENDED_ACTIVITIES_AGE_4_6
}

export function getStudentAgeCategory(dob: string): { key: 'age_2_3' | 'age_4_6'; label: string; ageYears: number } {
  const parts = dob.split('/')
  const birthYear = parts.length === 3 ? parseInt(parts[2], 10) : 2020
  const age = Math.max(1, 2026 - birthYear)
  return age <= 3
    ? { key: 'age_2_3', label: '2–3 tuổi (Nhà trẻ & Mầm)', ageYears: age }
    : { key: 'age_4_6', label: '4–6 tuổi (Chồi & Lá)', ageYears: age }
}
