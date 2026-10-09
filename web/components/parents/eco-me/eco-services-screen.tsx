'use client'

import { TopBar } from '@/components/parents/shared/header'
import { useServiceLauncher, type ServiceNav } from '@/components/parents/shared/use-service-launcher'
import { ServiceGrid } from './service-grid'
import { EDU_SERVICES, type EcoService } from './services'

interface EcoServicesScreenProps extends ServiceNav {
  onBack: () => void
  onOpenEcoParent: () => void
}

// "Danh sách dịch vụ" — everything behind "Xem thêm" on the ECO Me home.
// Only the "Dịch vụ giáo dục" group exists here.
export function EcoServicesScreen({ onBack, onOpenEcoParent, ...nav }: EcoServicesScreenProps) {
  const { launch, picker } = useServiceLauncher(nav)

  const pick = (s: EcoService) => {
    if (s.intent) launch(s.intent)
    else if (s.ecoParent) onOpenEcoParent()
  }

  return (
    <div className="screen">
      <TopBar title="Danh sách dịch vụ" onBack={onBack} />
      <div className="eco-section-title">Dịch vụ giáo dục</div>
      <ServiceGrid services={EDU_SERVICES} onPick={pick} />
      {picker}
    </div>
  )
}
