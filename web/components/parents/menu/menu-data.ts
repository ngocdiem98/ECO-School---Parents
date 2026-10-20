export interface MealIngredient {
  id: string
  name: string // 'Giò lụa đặc biệt'
  producer: string // 'CÔNG TY TNHH FOREVER FOOD'
  ingredientCode: string // '8938545420453'
  gtin: string // '8938545420453'
  batchNumber: string // 'Lô 261004-01-Giò lụa đặc biệt'
  image: string // '/menu/gio-lua-photo.png'
  origin: string // 'Việt Nam'
  netWeight?: string // '500g'
  ingredientsList?: string
  usage?: string
  storage?: string
  shelfLife?: string
  qualityStandard?: string
  companyTax?: string
  companyAddress?: string
  companyPhone?: string
  companyEmail?: string
  companyWebsite?: string
  certifications?: string[]
}

export interface MealItem {
  id: string
  type: 'breakfast' | 'snack_morning' | 'afternoon' | 'dinner'
  label: string // 'Ăn sáng' | 'Ăn nhẹ' | 'Ăn xế' | 'Ăn tối'
  iconType: 'breakfast' | 'snack_morning' | 'afternoon' | 'dinner'
  dish: string
  itemCount: number
  hasIngredientsPill?: boolean
  ingredientsCount?: number
  hasGreenTick?: boolean
  ingredients?: MealIngredient[]
}

export interface DayMenu {
  dayKey: string // 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7'
  dateNum: string // '05' | '06' | ...
  fullDate: string // '05/10/2026'
  meals: MealItem[]
  attachments: { id: string; url: string; title: string }[]
}

export interface WeekMenu {
  id: string
  label: string
  dateRange: string
  days: Record<string, DayMenu>
}

export const W1_DAYS: Record<string, DayMenu> = {
  T2: {
        dayKey: 'T2',
        dateNum: '05',
        fullDate: '05/10/2026',
        meals: [
          {
            id: 'm1',
            type: 'breakfast',
            label: 'Ăn sáng',
            iconType: 'breakfast',
            dish: 'Cơm cá',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm2',
            type: 'snack_morning',
            label: 'Ăn nhẹ',
            iconType: 'snack_morning',
            dish: 'Bún',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm3',
            type: 'afternoon',
            label: 'Ăn xế',
            iconType: 'afternoon',
            dish: 'Trà sữa',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm4',
            type: 'dinner',
            label: 'Ăn tối',
            iconType: 'dinner',
            dish: 'Cháo',
            itemCount: 1,
            hasGreenTick: true,
          },
        ],
        attachments: [
          { id: 'a1', url: '/menu/meal-photo.png', title: 'Cơm cá & canh rau củ' },
          { id: 'a2', url: '/menu/meal-photo.png', title: 'Bún tươi nấu sườn' },
        ],
      },
      T3: {
        dayKey: 'T3',
        dateNum: '06',
        fullDate: '06/10/2026',
        meals: [
          {
            id: 'm5',
            type: 'breakfast',
            label: 'Ăn sáng',
            iconType: 'breakfast',
            dish: 'Bánh mì',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm6',
            type: 'snack_morning',
            label: 'Ăn nhẹ',
            iconType: 'snack_morning',
            dish: 'Cháo',
            itemCount: 1,
            hasIngredientsPill: true,
            ingredientsCount: 1,
            hasGreenTick: true,
            ingredients: [
              {
                id: 'ing1',
                name: 'Giò lụa đặc biệt',
                producer: 'CÔNG TY TNHH FOREVER FOOD',
                ingredientCode: '8938545420453',
                gtin: '8938545420453',
                batchNumber: 'Lô 261004-01-Giò lụa đặc biệt',
                image: '/menu/gio-lua-photo.png',
                origin: 'Việt Nam',
                netWeight: '500g',
                ingredientsList: 'Thịt nạc heo (85%), mỡ heo, nước mắm truyền thống, muối ăn, đường kính, tiêu sọ, hương liệu tự nhiên',
                usage: 'Dùng ăn liền, hoặc thái lát ăn kèm các món cháo, bún, bánh mì hoặc chiên hấp',
                storage: 'Bảo quản nhiệt độ 0°C - 4°C trong bao gói kín. Sau khi mở túi nên dùng hết trong 24 giờ',
                shelfLife: '45 ngày kể từ ngày sản xuất',
                qualityStandard: 'TCVN 7049:2002, Chứng nhận Chuỗi thực phẩm an toàn TP.HCM',
                companyTax: '0315894210',
                companyAddress: 'Lô C2-3, Đường số 4, KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú, TP. Hồ Chí Minh',
                companyPhone: '1900 636 828',
                companyEmail: 'contact@foreverfood.vn',
                companyWebsite: 'www.foreverfood.vn',
                certifications: ['HACCP Codex 2020', 'ISO 22000:2018', 'Chuỗi ATTP TP.HCM'],
              },
            ],
          },
          {
            id: 'm7',
            type: 'afternoon',
            label: 'Ăn xế',
            iconType: 'afternoon',
            dish: 'Hủ tíu',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm8',
            type: 'dinner',
            label: 'Ăn tối',
            iconType: 'dinner',
            dish: 'Cơm gà',
            itemCount: 1,
            hasGreenTick: true,
          },
        ],
        attachments: [
          { id: 'a3', url: '/menu/meal-photo.png', title: 'Bánh mì trứng & sữa chua' },
          { id: 'a4', url: '/menu/meal-photo.png', title: 'Cháo thịt bằm dinh dưỡng' },
        ],
      },
      T4: {
        dayKey: 'T4',
        dateNum: '07',
        fullDate: '07/10/2026',
        meals: [
          {
            id: 'm9',
            type: 'breakfast',
            label: 'Ăn sáng',
            iconType: 'breakfast',
            dish: 'Phở bò',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm10',
            type: 'snack_morning',
            label: 'Ăn nhẹ',
            iconType: 'snack_morning',
            dish: 'Bánh bao',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm11',
            type: 'afternoon',
            label: 'Ăn xế',
            iconType: 'afternoon',
            dish: 'Sữa chua trái cây',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm12',
            type: 'dinner',
            label: 'Ăn tối',
            iconType: 'dinner',
            dish: 'Cơm sườn',
            itemCount: 1,
            hasGreenTick: true,
          },
        ],
        attachments: [
          { id: 'a5', url: '/menu/meal-photo.png', title: 'Phở bò gia truyền' },
        ],
      },
      T5: {
        dayKey: 'T5',
        dateNum: '08',
        fullDate: '08/10/2026',
        meals: [
          {
            id: 'm13',
            type: 'breakfast',
            label: 'Ăn sáng',
            iconType: 'breakfast',
            dish: 'Bánh cuốn',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm14',
            type: 'snack_morning',
            label: 'Ăn nhẹ',
            iconType: 'snack_morning',
            dish: 'Súp cua',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm15',
            type: 'afternoon',
            label: 'Ăn xế',
            iconType: 'afternoon',
            dish: 'Chè bắp',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm16',
            type: 'dinner',
            label: 'Ăn tối',
            iconType: 'dinner',
            dish: 'Cơm canh chua cá lóc',
            itemCount: 1,
            hasGreenTick: true,
          },
        ],
        attachments: [
          { id: 'a6', url: '/menu/meal-photo.png', title: 'Bánh cuốn chả quế' },
        ],
      },
      T6: {
        dayKey: 'T6',
        dateNum: '09',
        fullDate: '09/10/2026',
        meals: [
          {
            id: 'm17',
            type: 'breakfast',
            label: 'Ăn sáng',
            iconType: 'breakfast',
            dish: 'Hủ tiếu Nam Vang',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm18',
            type: 'snack_morning',
            label: 'Ăn nhẹ',
            iconType: 'snack_morning',
            dish: 'Bánh flan',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm19',
            type: 'afternoon',
            label: 'Ăn xế',
            iconType: 'afternoon',
            dish: 'Nước ép dưa hấu',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm20',
            type: 'dinner',
            label: 'Ăn tối',
            iconType: 'dinner',
            dish: 'Cơm thịt kho trứng',
            itemCount: 1,
            hasGreenTick: true,
          },
        ],
        attachments: [
          { id: 'a7', url: '/menu/meal-photo.png', title: 'Hủ tiếu Nam Vang' },
        ],
      },
      T7: {
        dayKey: 'T7',
        dateNum: '10',
        fullDate: '10/10/2026',
        meals: [
          {
            id: 'm21',
            type: 'breakfast',
            label: 'Ăn sáng',
            iconType: 'breakfast',
            dish: 'Xôi gà',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm22',
            type: 'snack_morning',
            label: 'Ăn nhẹ',
            iconType: 'snack_morning',
            dish: 'Chè hạt sen',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm23',
            type: 'afternoon',
            label: 'Ăn xế',
            iconType: 'afternoon',
            dish: 'Sữa đậu nành',
            itemCount: 1,
            hasGreenTick: true,
          },
          {
            id: 'm24',
            type: 'dinner',
            label: 'Ăn tối',
            iconType: 'dinner',
            dish: 'Cơm chiên Dương Châu',
            itemCount: 1,
            hasGreenTick: true,
          },
        ],
        attachments: [
          { id: 'a8', url: '/menu/meal-photo.png', title: 'Xôi gà xé hạt sen' },
        ],
      },
}

function buildWeekMenuDays(
  startDateStr: string,
  baseDays: Record<string, DayMenu>
): Record<string, DayMenu> {
  const [dStr, mStr, yStr] = startDateStr.split('/')
  const day = parseInt(dStr, 10)
  const month = parseInt(mStr, 10)
  const year = parseInt(yStr, 10)
  const startDate = new Date(year, month - 1, day)
  const dayKeys = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  const result: Record<string, DayMenu> = {}
  dayKeys.forEach((key, idx) => {
    const cur = new Date(startDate)
    cur.setDate(startDate.getDate() + idx)
    const dateNum = String(cur.getDate()).padStart(2, '0')
    const curM = String(cur.getMonth() + 1).padStart(2, '0')
    const curY = cur.getFullYear()
    const fullDate = `${dateNum}/${curM}/${curY}`

    const baseDay = baseDays[key]
    result[key] = {
      dayKey: key,
      dateNum,
      fullDate,
      meals: baseDay ? baseDay.meals : [],
      attachments: baseDay ? baseDay.attachments : [],
    }
  })
  return result
}

export const MENU_WEEKS: WeekMenu[] = [
  {
    id: 'w1',
    label: 'Tuần : 12/10/2026 - 17/10/2026',
    dateRange: '12/10/2026 - 17/10/2026',
    days: buildWeekMenuDays('12/10/2026', W1_DAYS),
  },
  {
    id: 'w2',
    label: 'Tuần : 05/10/2026 - 10/10/2026',
    dateRange: '05/10/2026 - 10/10/2026',
    days: W1_DAYS,
  },
  {
    id: 'w3',
    label: 'Tuần : 13/07/2026 - 18/07/2026',
    dateRange: '13/07/2026 - 18/07/2026',
    days: buildWeekMenuDays('13/07/2026', W1_DAYS),
  },
  {
    id: 'w4',
    label: 'Tuần : 06/07/2026 - 11/07/2026',
    dateRange: '06/07/2026 - 11/07/2026',
    days: buildWeekMenuDays('06/07/2026', W1_DAYS),
  },
  {
    id: 'w5',
    label: 'Tuần : 29/06/2026 - 04/07/2026',
    dateRange: '29/06/2026 - 04/07/2026',
    days: buildWeekMenuDays('29/06/2026', W1_DAYS),
  },
  {
    id: 'w6',
    label: 'Tuần : 18/05/2026 - 23/05/2026',
    dateRange: '18/05/2026 - 23/05/2026',
    days: buildWeekMenuDays('18/05/2026', W1_DAYS),
  },
]

export interface WeekDayItem {
  key: string // 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7'
  dateNum: string // '21', '05', etc.
  fullDate: string // '21/09/2026'
}

export function getWeekDaysList(week: WeekMenu): WeekDayItem[] {
  const dayKeys = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  // 1. If week.days has valid dateNum for all 6 days
  if (week.days && Object.keys(week.days).length > 0) {
    const list: WeekDayItem[] = []
    let allValid = true
    for (const k of dayKeys) {
      if (week.days[k]?.dateNum) {
        list.push({
          key: k,
          dateNum: week.days[k].dateNum,
          fullDate: week.days[k].fullDate,
        })
      } else {
        allValid = false
        break
      }
    }
    if (allValid && list.length === 6) {
      return list
    }
  }

  // 2. Parse from dateRange e.g. "21/09/2026 - 26/09/2026"
  const parts = week.dateRange.split('-').map((s) => s.trim())
  if (parts.length >= 2) {
    const startStr = parts[0]
    const [dStr, mStr, yStr] = startStr.split('/')
    const day = parseInt(dStr, 10)
    const month = parseInt(mStr, 10)
    const year = parseInt(yStr, 10)

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const startDate = new Date(year, month - 1, day)
      return dayKeys.map((key, idx) => {
        const cur = new Date(startDate)
        cur.setDate(startDate.getDate() + idx)
        const dateNum = String(cur.getDate()).padStart(2, '0')
        const curM = String(cur.getMonth() + 1).padStart(2, '0')
        const curY = cur.getFullYear()
        return {
          key,
          dateNum,
          fullDate: `${dateNum}/${curM}/${curY}`,
        }
      })
    }
  }

  // 3. Fallback
  return [
    { key: 'T2', dateNum: '05', fullDate: '05/10/2026' },
    { key: 'T3', dateNum: '06', fullDate: '06/10/2026' },
    { key: 'T4', dateNum: '07', fullDate: '07/10/2026' },
    { key: 'T5', dateNum: '08', fullDate: '08/10/2026' },
    { key: 'T6', dateNum: '09', fullDate: '09/10/2026' },
    { key: 'T7', dateNum: '10', fullDate: '10/10/2026' },
  ]
}

export interface SupplierItem {
  id: string
  category: string
  name: string
  address: string
  taxCode: string
  website?: string
  certificates?: string[]
  receivedDate: string
}

export interface TransparencyDetailData {
  dishName: string
  complianceNotice: string
  qrCode: string
  blockchainHash: string
  school: {
    name: string
    address: string
    taxCode: string
  }
  caterer: {
    name: string
    address: string
    taxCode: string
    certificates: string[]
    verifiedBy: string
  }
  suppliers: SupplierItem[]
  supervision: {
    department: {
      name: string
      phone: string
      email: string
    }
    association: {
      name: string
      hotline: string
      email: string
    }
  }
}

export const TRANSPARENCY_DETAIL: TransparencyDetailData = {
  dishName: 'BÚN RIÊU',
  complianceNotice:
    'Đáp ứng đầy đủ theo Chỉ Thị 33/CT-TTg của Thủ Tướng Chính Phủ về tăng cường bảo đảm an toàn thực phẩm trong cơ sở giáo dục.',
  qrCode: '26271-B-29-0260108',
  blockchainHash:
    'E9434EC11A4C62297A8F3B5AB680CD45D0264B23383E838705CB6BC3E06701BF',
  school: {
    name: 'Trường Tiểu học Khai Minh',
    address: 'Phó Đức Chính, Phường Bến Thành, Thành phố Hồ Chí Minh, Việt Nam',
    taxCode: '0306610669',
  },
  caterer: {
    name: 'Công Ty Cổ Phần Thương Mại Dịch Vụ Á Châu Đại Thắng - Bếp ăn',
    address:
      '102 Nguyễn Xí Tầng 8, Tòa Nhà Văn Phòng Thủy Lợi 4, 102 Nguyễn Xí, Phường Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam',
    taxCode: '0303729867',
    certificates: ['ISO 22000:2018', 'Giấy phép Đăng ký Kinh doanh'],
    verifiedBy: 'Trường Tiểu học Khai Minh',
  },
  suppliers: [
    {
      id: 's1',
      category: 'Bún tươi',
      name: 'Công ty TNHH MTV Trường Đạt Kiều Trang',
      address:
        '203/31 Huỳnh Văn Nghệ Đường Huỳnh Văn Nghệ, Phường An Hội Tây, Thành phố Hồ Chí Minh, Việt Nam',
      website: 'https://buntuoikieutrang.com/',
      taxCode: '0313357921',
      certificates: ['ISO 22000:2018'],
      receivedDate: '12/10/2026',
    },
    {
      id: 's2',
      category: 'Đậu hũ / Thực phẩm',
      name: 'Công ty Cổ Phần DAFUSA Sài Gòn',
      address: '110 Trần Đại Nghĩa, Phường Tân Tạo, Thành phố Hồ Chí Minh, Việt Nam',
      taxCode: '0316929630',
      receivedDate: '12/10/2026',
    },
    {
      id: 's3',
      category: 'Rau củ quả',
      name: 'Công ty TNHH MTV rau củ quả Minh Long',
      address: '66A1, Phường Mỹ Tho, Tỉnh Đồng Tháp, Việt Nam',
      taxCode: '0311529043',
      receivedDate: '12/10/2026',
    },
    {
      id: 's4',
      category: 'Nhà phân phối nguyên liệu',
      name: 'Công Ty Cổ Phần Thương Mại Dịch Vụ Á Châu Đại Thắng - NPP',
      address:
        '102 Nguyễn Xí Tầng 8, Tòa Nhà Văn Phòng Thủy Lợi 4, 102 Nguyễn Xí, Phường Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam',
      taxCode: '0303729867',
      certificates: ['ISO 22000:2018'],
      receivedDate: '12/10/2026',
    },
    {
      id: 's5',
      category: 'Gia vị & Hàng khô',
      name: 'Công ty TNHH MTV Thương mại Dịch vụ Hân Huệ',
      address: 'C8/1A Võ Văn Vân, Xã Tân Vĩnh Lộc, Thành phố Hồ Chí Minh, Việt Nam',
      taxCode: '0305276316',
      receivedDate: '12/10/2026',
    },
    {
      id: 's6',
      category: 'Nông sản an toàn',
      name: 'Công ty TNHH Nông Sản Linh Hiếu',
      address: 'Bình Hòa 1, Phường Bình Hòa, Thành phố Hồ Chí Minh, Việt Nam',
      taxCode: '3703204147',
      certificates: ['HACCP'],
      receivedDate: '10/10/2026',
    },
  ],
  supervision: {
    department: {
      name: 'SỞ CÔNG THƯƠNG THÀNH PHỐ HỒ CHÍ MINH',
      phone: '(+84) 283 829 1670',
      email: 'hoptacthuongmai@tphcm.gov.vn',
    },
    association: {
      name: 'HỘI CÔNG NGHỆ CAO THÀNH PHỐ HỒ CHÍ MINH',
      hotline: '1900 6726',
      email: 'info@hitecha.org',
    },
  },
}

export const DEFAULT_INGREDIENT: MealIngredient = {
  id: 'ing1',
  name: 'Giò lụa đặc biệt',
  producer: 'CÔNG TY TNHH FOREVER FOOD',
  ingredientCode: '8938545420453',
  gtin: '8938545420453',
  batchNumber: 'Lô 261004-01-Giò lụa đặc biệt',
  image: '/menu/gio-lua-photo.png',
  origin: 'Việt Nam',
  netWeight: '500g',
  ingredientsList: 'Thịt nạc heo (85%), mỡ heo, nước mắm truyền thống, muối ăn, đường kính, tiêu sọ, hương liệu tự nhiên',
  usage: 'Dùng ăn liền, hoặc thái lát ăn kèm các món cháo, bún, bánh mì hoặc chiên hấp',
  storage: 'Bảo quản nhiệt độ 0°C - 4°C trong bao gói kín. Sau khi mở túi nên dùng hết trong 24 giờ',
  shelfLife: '45 ngày kể từ ngày sản xuất',
  qualityStandard: 'TCVN 7049:2002, Chứng nhận Chuỗi thực phẩm an toàn TP.HCM',
  companyTax: '0315894210',
  companyAddress: 'Lô C2-3, Đường số 4, KCN Tân Bình, P. Tây Thạnh, Q. Tân Phú, TP. Hồ Chí Minh',
  companyPhone: '1900 636 828',
  companyEmail: 'contact@foreverfood.vn',
  companyWebsite: 'www.foreverfood.vn',
  certifications: ['HACCP Codex 2020', 'ISO 22000:2018', 'Chuỗi ATTP TP.HCM'],
}
