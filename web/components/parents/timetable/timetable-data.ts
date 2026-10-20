export interface TimetablePeriod {
  time: string
  t2: string
  t3: string
  t4: string
  t5: string
  t6: string
  t7: string
}

export interface StudentTimetableConfig {
  studentId: string
  studentName: string
  studentCode: string
  className: string
  school: string
  periodRange: string
  format: 'table' | 'image'
  imageUrl?: string
  periods?: TimetablePeriod[]
}

export const STUDENT_TIMETABLES: Record<string, StudentTimetableConfig> = {
  nhu: {
    studentId: 'nhu',
    studentName: 'Huỳnh Ngọc Trúc Như',
    studentCode: '9192930041',
    className: 'Lớp 11A1',
    school: 'Trường FINVIET',
    periodRange: '18/01/2027 - 30/05/2027',
    format: 'table',
    periods: [
      {
        time: '07:00 - 07:45',
        t2: 'Toán',
        t3: 'GDQP-AN',
        t4: 'GDQP-AN',
        t5: 'Ngữ Văn',
        t6: 'Tiếng Anh',
        t7: 'Sinh hoạt',
      },
      {
        time: '07:50 - 08:35',
        t2: 'Ngữ Văn',
        t3: 'Toán',
        t4: 'Ngữ Văn',
        t5: 'Hóa học',
        t6: 'Vật lý',
        t7: 'Toán',
      },
      {
        time: '08:40 - 09:25',
        t2: 'Giáo dục thể chất',
        t3: 'Hoạt động trải nghiệm',
        t4: 'Toán',
        t5: 'Sinh học',
        t6: 'Lịch sử',
        t7: 'Địa lý',
      },
      {
        time: '09:40 - 10:25',
        t2: 'Tin học',
        t3: 'Tiếng Anh',
        t4: 'Lịch sử',
        t5: 'Địa lý',
        t6: 'GDCD',
        t7: 'Sinh hoạt lớp',
      },
      {
        time: '10:30 - 11:15',
        t2: 'Hóa học',
        t3: 'Vật lý',
        t4: 'Công nghệ',
        t5: 'Tiếng Anh',
        t6: 'Toán',
        t7: 'Tổng kết tuần',
      },
    ],
  },
  duong: {
    studentId: 'duong',
    studentName: 'Tạ Thái Dương',
    studentCode: '340000000002',
    className: 'Lớp 1A',
    school: 'Trường FINVIET',
    periodRange: '01/09/2026 - 17/01/2027',
    format: 'image',
    imageUrl: '/timetable/timetable-lop1.png',
  },
  lam: {
    studentId: 'lam',
    studentName: 'Lý Tường Lam',
    studentCode: '9192930065',
    className: 'Lớp 5B',
    school: 'Trường FINVIET',
    periodRange: '01/09/2026 - 17/01/2027',
    format: 'table',
    periods: [
      {
        time: '07:30 - 08:15',
        t2: 'Chào cờ',
        t3: 'Tiếng Việt',
        t4: 'Toán',
        t5: 'Tiếng Việt',
        t6: 'Toán',
        t7: 'Sinh hoạt lớp',
      },
      {
        time: '08:20 - 09:05',
        t2: 'Tiếng Việt',
        t3: 'Toán',
        t4: 'Tiếng Việt',
        t5: 'Toán',
        t6: 'Tiếng Việt',
        t7: 'Hoạt động trải nghiệm',
      },
      {
        time: '09:25 - 10:10',
        t2: 'Toán',
        t3: 'Tiếng Việt',
        t4: 'Khoa học',
        t5: 'Lịch sử & Địa lý',
        t6: 'Tiếng Anh',
        t7: 'Kỹ năng sống',
      },
      {
        time: '10:15 - 11:00',
        t2: 'Đạo đức',
        t3: 'Âm nhạc',
        t4: 'Mĩ thuật',
        t5: 'Thể dục',
        t6: 'Tin học',
        t7: 'Tự học',
      },
    ],
  },
  vy: {
    studentId: 'vy',
    studentName: 'Phan Khánh Vy',
    studentCode: '9192930012',
    className: 'Lớp Mầm',
    school: 'Trường Mầm Non Họa Mi',
    periodRange: '01/09/2026 - 17/01/2027',
    format: 'image',
    imageUrl: '/timetable/timetable-lop1.png',
  },
}
