export function exportWinnersPDF(history, eventTitle, lang) {
  if (history.length === 0) return false

  const today = new Date().toLocaleString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const title = (typeof eventTitle === 'string' ? eventTitle : '') ||
    (lang === 'th' ? 'รายชื่อผู้ได้รับรางวัล' : 'Winner Announcement')

  const colPrize = lang === 'th' ? 'รางวัล' : 'Prize'
  const colWinner = lang === 'th' ? 'ผู้ได้รับรางวัล' : 'Winner'
  const colDate = lang === 'th' ? 'วันที่-เวลา' : 'Date/Time'
  const generated = lang === 'th' ? 'พิมพ์เมื่อ' : 'Generated'

  const getPrizeName = (r) => r.prizeName ?? r.prizeNameTh ?? r.prizeNameEn ?? ''

  const tableRows = history
    .map(
      (r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${getPrizeName(r)}</td>
        <td>${r.participantName}</td>
        <td>${new Date(r.timestamp).toLocaleString('th-TH')}</td>
      </tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Noto Sans Thai', sans-serif; padding: 36px; color: #1E293B; }
    h1 { text-align: center; font-size: 22px; margin-bottom: 6px; }
    .sub { text-align: center; color: #64748B; font-size: 13px; margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { background: #3B82F6; color: #fff; padding: 10px 12px; text-align: left; }
    td { padding: 9px 12px; border-bottom: 1px solid #E2E8F0; }
    tr:nth-child(even) td { background: #F8FAFC; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="sub">${generated}: ${today}</p>
  <table>
    <thead>
      <tr>
        <th style="width:48px">#</th>
        <th>${colPrize}</th>
        <th>${colWinner}</th>
        <th style="width:160px">${colDate}</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
  <script>window.onload = () => window.print()<\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return false
  win.document.write(html)
  win.document.close()
  return true
}
