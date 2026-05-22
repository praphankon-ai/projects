import * as XLSX from 'xlsx'

export function exportWinnersExcel(history, lang) {
  if (history.length === 0) return false

  const today = new Date().toISOString().slice(0, 10)
  const headers =
    lang === 'th'
      ? ['#', 'ชื่อรางวัล', 'ผู้ได้รับรางวัล', 'วันที่-เวลา']
      : ['#', 'Prize Name', 'Winner', 'Date/Time']

  const getPrizeName = (r) => r.prizeName ?? r.prizeNameTh ?? r.prizeNameEn ?? ''

  const rows = history.map((r, i) => [
    i + 1,
    getPrizeName(r),
    r.participantName,
    new Date(r.timestamp).toLocaleString('th-TH'),
  ])

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  ws['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 30 }, { wch: 22 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, lang === 'th' ? 'ผู้ได้รับรางวัล' : 'Winners')
  XLSX.writeFile(wb, `winner-report-${today}.xlsx`)
  return true
}
