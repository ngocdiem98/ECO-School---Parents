// ECO Design System "service tile" icons (ServiceTile `service` ids), exported
// from the design system bundle into /public/ds/services. Keyed by this app's
// own service ids (the ids of EDU_SERVICES and PARENT_SERVICES). A service the
// design system has no icon for (Góp ý, ECO School) returns undefined and keeps its glyph tile.
const DS_SERVICE_ICON: Record<string, string> = {
  fee: 'hoc-phi',
  hocba: 'hoc-ba',
  attendance: 'diem-danh',
  hoadon: 'hoa-don',
  absence: 'bao-vang',
  chat: 'trao-doi',
  timetable: 'thoi-khoa-bieu',
  thucdon: 'thuc-don',
  homework: 'bai-tap',
  bangtin: 'bang-tin',
  topup: 'nap-diem',
  hoatdong: 'hoat-dong',
  spending: 'lich-su-chi-tieu',
  nhatky: 'nhat-ky-cham-soc',
  results: 'ket-qua-hoc-tap',
  danthuoc: 'dan-thuoc',
  goodbehavior: 'phieu-be-ngoan',
  // Only in the ECO Me DS folder shipped with the reference app (not in the saved DS artifact).
  paylater: 'hoc-phi-tra-sau',
  gallery: 'thu-vien-anh',
  thuvien: 'thu-vien-anh',
}

export function dsServiceIcon(id: string): string | undefined {
  const ds = DS_SERVICE_ICON[id]
  return ds ? `/ds/services/${ds}.webp` : undefined
}
