import { useApp } from '../../context/AppContext.jsx'
import i18n from '../../constants/i18n.js'
import Button from '../ui/Button.jsx'
import { exportWinnersExcel } from '../../utils/exportExcel.js'
import { exportWinnersPDF } from '../../utils/exportPDF.js'

export default function HistoryPanel() {
  const { history, clearHistory, eventTitle, lang } = useApp()
  const t = i18n[lang]

  const handleExportExcel = () => {
    if (history.length === 0) { alert(t.emptyHistoryExport); return }
    exportWinnersExcel(history, lang)
  }

  const handleExportPDF = () => {
    if (history.length === 0) { alert(t.emptyHistoryExport); return }
    const opened = exportWinnersPDF(history, eventTitle, lang)
    if (!opened) alert('Please allow popups to export PDF.')
  }

  const handleClear = () => {
    if (window.confirm(t.clearHistoryConfirm)) clearHistory()
  }

  // resolve prize name from either new or old data format
  const getPrizeName = (r) => r.prizeName ?? r.prizeNameTh ?? r.prizeNameEn ?? ''

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-100 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={handleExportExcel} className="flex-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {t.exportExcel}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleExportPDF} className="flex-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
          </svg>
          {t.exportPDF}
        </Button>
        {history.length > 0 && (
          <Button size="sm" variant="ghost" onClick={handleClear} className="text-red-400 hover:text-red-600 hover:bg-red-50 w-full">
            {t.clearHistory}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {history.length === 0 ? (
          <p className="p-6 text-center text-slate-400 text-sm">{t.noHistory}</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-500 w-8">{t.col_no}</th>
                <th className="px-3 py-2 text-left font-medium text-slate-500">{t.col_prize}</th>
                <th className="px-3 py-2 text-left font-medium text-slate-500">{t.col_winner}</th>
                <th className="px-3 py-2 text-left font-medium text-slate-500">{t.col_datetime}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-3 py-2 text-slate-700 font-medium">{getPrizeName(r)}</td>
                  <td className="px-3 py-2 text-slate-700">{r.participantName}</td>
                  <td className="px-3 py-2 text-slate-400 whitespace-nowrap">
                    {new Date(r.timestamp).toLocaleString('th-TH', {
                      month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
