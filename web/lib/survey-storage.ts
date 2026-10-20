// Survey state management & eligibility rules
// - Eligible only after at least 14 days after parents activate their first kid
// - Prompt bottom sheet appears after 30s in app, only if not submitted within 60 days
// - Fixed card in StudentScreen always visible if >= 14 days; shows latest submission time if submitted

export interface SurveySubmission {
  satisfactionScore: number
  satisfactionNote: string
  recommendScore: number
  recommendNote: string
  suggestionsNote: string
  submittedAt: string // ISO timestamp
}

export interface SurveyState {
  firstKidActivationDate: string // ISO date
  lastSubmission: SurveySubmission | null
  lastDismissedAt?: string | null // ISO timestamp when prompt bottom sheet was closed
}

const STORAGE_KEY = 'eco_school_survey_state'

// Default mock state: first kid activated on 2026-09-15 (> 23 days ago, so >= 14 days eligible)
const DEFAULT_STATE: SurveyState = {
  firstKidActivationDate: '2026-09-15T08:00:00.000Z',
  lastSubmission: null,
  lastDismissedAt: null,
}

export function getSurveyState(): SurveyState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as SurveyState
    return {
      firstKidActivationDate: parsed.firstKidActivationDate || DEFAULT_STATE.firstKidActivationDate,
      lastSubmission: parsed.lastSubmission || null,
      lastDismissedAt: parsed.lastDismissedAt || null,
    }
  } catch {
    return DEFAULT_STATE
  }
}

export function saveSurveySubmission(
  answers: Omit<SurveySubmission, 'submittedAt'>
): SurveySubmission {
  const current = getSurveyState()
  const submission: SurveySubmission = {
    ...answers,
    submittedAt: new Date().toISOString(),
  }
  const updated: SurveyState = {
    ...current,
    lastSubmission: submission,
    lastDismissedAt: null, // Clear dismiss timestamp when submitted
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // storage unavailable
    }
  }
  return submission
}

/**
 * Record that parent dismissed/closed the survey prompt bottom sheet.
 * Saves current ISO timestamp to lastDismissedAt.
 */
export function dismissSurveyPrompt(): void {
  const current = getSurveyState()
  const updated: SurveyState = {
    ...current,
    lastDismissedAt: new Date().toISOString(),
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // storage unavailable
    }
  }
}

/**
 * Calculates number of calendar days between two dates.
 * A day is counted whenever time passes 00:00:00 midnight.
 * Truncates both dates to midnight local time before calculating day difference.
 *
 * Example:
 * - Dismissed on 8/10 at 7 PM (19:00)
 * - Checked on 9/10 at 00:01 AM -> 1 calendar day passed
 * - Checked on 14/10 at 11:59 PM -> 6 calendar days passed
 * - Checked on 15/10 at 8:00 AM -> 7 calendar days passed (reappears!)
 */
export function getCalendarDaysDiff(
  fromDate: Date | string,
  toDate: Date | string = new Date()
): number {
  const d1 = new Date(fromDate)
  const d2 = new Date(toDate)
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0

  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((d2.getTime() - d1.getTime()) / msPerDay)
}

// Check if parent has passed >= 14 days since activating first kid
export function isParentEligibleForSurvey(state = getSurveyState()): boolean {
  if (!state.firstKidActivationDate) return false
  const activationTime = new Date(state.firstKidActivationDate).getTime()
  const now = Date.now()
  const daysDiff = (now - activationTime) / (1000 * 60 * 60 * 24)
  return daysDiff >= 14
}

/**
 * Check if the survey prompt bottom sheet should appear:
 * 1. Parent must be eligible (>= 14 days after activating first kid).
 * 2. If already submitted: must be >= 60 days since last submission.
 * 3. If dismissed/closed: must be >= 7 calendar days since last dismissal
 *    (counted whenever 00:00 midnight has passed 7 times).
 */
export function shouldShowSurveyPrompt(state = getSurveyState()): boolean {
  if (!isParentEligibleForSurvey(state)) return false

  // 60-day rule after submission
  if (state.lastSubmission) {
    const daysSinceSubmit = getCalendarDaysDiff(state.lastSubmission.submittedAt)
    if (daysSinceSubmit < 60) {
      return false
    }
  }

  // 7-day rule after dismissal
  if (state.lastDismissedAt) {
    const daysSinceDismiss = getCalendarDaysDiff(state.lastDismissedAt)
    if (daysSinceDismiss < 7) {
      return false
    }
  }

  return true
}

// Reset state for testing
export function resetSurveyState(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }
}

// Simulate dismissal N days ago for testing
export function simulateDismissedDaysAgo(daysAgo: number): void {
  const current = getSurveyState()
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  const updated: SurveyState = {
    ...current,
    lastDismissedAt: d.toISOString(),
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
  }
}

// Expose testing helpers to window for easy developer console testing
if (typeof window !== 'undefined') {
  ;(window as unknown as { __surveyDebug?: unknown }).__surveyDebug = {
    getSurveyState,
    shouldShowSurveyPrompt,
    dismissSurveyPrompt,
    resetSurveyState,
    simulateDismissedDaysAgo,
    getCalendarDaysDiff,
  }
}

// Format submission date nicely for display: e.g. "08/10/2026 lúc 11:20"
export function formatSurveyDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`
  } catch {
    return isoString
  }
}
