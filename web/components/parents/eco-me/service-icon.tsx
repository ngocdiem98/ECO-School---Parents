'use client'

import {
  Bell,
  BookOpen,
  Calculator,
  CalendarHeart,
  CalendarPlus,
  ClipboardCheck,
  CookingPot,
  CreditCard,
  FileText,
  GraduationCap,
  HandHeart,
  Images,
  IdCard,
  Library,
  ListChecks,
  Megaphone,
  MessageSquareHeart,
  MessagesSquare,
  NotebookText,
  Pill,
  Star,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

// Coloured app-icon tile (gradient rounded square + white glyph) used by the
// ECO Me service grids. Glyphs are lucide icons; the gradient comes from the
// service catalogue (`tint`).
const ICONS: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  wallet: Wallet,
  invoice: ClipboardCheck,
  'card-plus': CreditCard,
  calculator: Calculator,
  'book-open': BookOpen,
  'calendar-plus': CalendarPlus,
  chat: MessagesSquare,
  cloche: CookingPot,
  pill: Pill,
  care: HandHeart,
  timetable: FileText,
  tasks: ListChecks,
  megaphone: Megaphone,
  activity: CalendarHeart,
  star: Star,
  library: Library,
  notebook: NotebookText,
  'id-card': IdCard,
  gallery: Images,
  feedback: MessageSquareHeart,
  bell: Bell,
}

export function ServiceIcon({ name, tint, disabled }: { name: string; tint: [string, string]; disabled?: boolean }) {
  const Icon = ICONS[name] ?? FileText
  return (
    <span
      className={`svc-icon ${disabled ? 'is-off' : ''}`}
      style={{ background: `linear-gradient(145deg, ${tint[0]}, ${tint[1]})` }}
    >
      <Icon size={26} strokeWidth={2} color="#fff" />
    </span>
  )
}
