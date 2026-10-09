import { abbreviateName, type GoodBehavior } from '@/lib/mock-data'

const MEDALS = ['🥇', '🥈', '🥉']

// "Open Question" from phieu-be-ngoan-parent-flow-spec.md, mục I — resolved
// with the user: when the latest cycle is "Không đạt", still show the hero
// card (don't hide it), but switch to a lighter/muted variant with a gentle
// encouragement message instead of the celebratory dark card.
//
// Ranking (Top 3) lives here rather than on the "Tổng kết" tab per later
// user direction, so parents see both "con's latest card" and "how con
// ranks" without switching tabs.
//
// Two "Open Question" decisions from phieu-be-ngoan-parent-flow-spec.md,
// mục II, resolved with the user before implementing:
// 1. Top-3 privacy: classmates other than the parent's own child are shown
//    with abbreviated names ("Trần T. B."), never full names — the child's
//    own name is always shown in full since the parent already knows it.
// 2. Rank outside Top 3: shown as an exact ordinal ("#7/25"), not a
//    qualitative bucket like "top 30%".
export function PhieuCuaConScreen({ goodBehavior }: { goodBehavior: GoodBehavior }) {
  const r = goodBehavior.ranking

  if (!goodBehavior.cycles.length) {
    return (
      <div className="empty-state">
        <div className="glyph">▢</div>
        <div className="text">Chưa có phiếu bé ngoan</div>
      </div>
    )
  }

  const [latest] = goodBehavior.cycles
  const isDat = latest.status === 'dat'

  return (
    <>
      <div className={`gb-hero ${isDat ? '' : 'gb-hero--miss'}`}>
        <div className="gb-hero-icon">{isDat ? '★' : '☆'}</div>
        <div className="gb-hero-title">Phiếu bé ngoan</div>
        <div className="gb-hero-period">{latest.label}</div>
        <div className="gb-hero-msg">
          {isDat
            ? 'Con đã đạt Phiếu bé ngoan tuần này!'
            : 'Con chưa đạt phiếu kỳ này — cố gắng hơn ở kỳ sau nhé!'}
        </div>
        {latest.comment && (
          <div className="gb-hero-comment">
            <div className="gb-hero-comment-label">Nhận xét của cô</div>
            <div className="gb-hero-comment-text">&quot;{latest.comment}&quot;</div>
          </div>
        )}
      </div>

      <div className="section-heading">Xếp hạng lớp (Top 3)</div>
      <div className="card">
        {r.top3.map((item, i) => (
          <div className={`feedback-row ${item.isSelf ? 'gb-rank-self' : ''}`} key={item.name}>
            <span>
              {MEDALS[i]} {item.isSelf ? item.name : abbreviateName(item.name)}
            </span>
            <span style={{ fontWeight: 700 }}>{item.count} phiếu</span>
          </div>
        ))}
        {!r.selfInTop3 && (
          <>
            <div className="divider" />
            <div className="feedback-row">
              <span className="text-muted">Vị trí của con</span>
              <span style={{ fontWeight: 700 }}>
                #{r.selfRank}/{r.totalStudents}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="gb-rank-note">
        Bảng xếp hạng sẽ được cập nhật mới mỗi tuần. Dữ liệu mới nhất là {r.asOfLabel.toLowerCase()}
      </div>

      <div className="section-heading">Vị trí bé đạt được</div>
      <div className="card">
        <div className="feedback-row">
          <span>{MEDALS[0]} Vị trí Nhất</span>
          <span style={{ fontWeight: 700 }}>{r.positionsAchieved.first} lần</span>
        </div>
        <div className="feedback-row">
          <span>{MEDALS[1]} Vị trí Nhì</span>
          <span style={{ fontWeight: 700 }}>{r.positionsAchieved.second} lần</span>
        </div>
        <div className="feedback-row">
          <span>{MEDALS[2]} Vị trí Ba</span>
          <span style={{ fontWeight: 700 }}>{r.positionsAchieved.third} lần</span>
        </div>
      </div>
    </>
  )
}
