import { useState, useEffect, useCallback } from 'react'
import { useApp } from './context/AppContext.jsx'
import i18n from './constants/i18n.js'

import LanguageToggle from './components/ui/LanguageToggle.jsx'
import PrizePanel from './components/prize/PrizePanel.jsx'
import PrizeSelector from './components/prize/PrizeSelector.jsx'
import ParticipantPanel from './components/participant/ParticipantPanel.jsx'
import SpinWheel from './components/wheel/SpinWheel.jsx'
import HistoryPanel from './components/history/HistoryPanel.jsx'

// ---- Settings panel ----
function SettingsPanel() {
  const { eventTitle, setEventTitle, lang } = useApp()
  const t = i18n[lang]
  return (
    <div className="p-4 space-y-3">
      <label className="block text-xs font-medium text-slate-500">{t.eventTitle}</label>
      <input
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={typeof eventTitle === 'string' ? eventTitle : ''}
        onChange={e => setEventTitle(e.target.value)}
        placeholder={t.eventTitlePlaceholder}
      />
      <p className="text-xs text-slate-400">
        {lang === 'th' ? 'แสดงใน header ของรายงาน PDF' : 'Shown in the PDF report header'}
      </p>
    </div>
  )
}

// ---- Winner Modal ----
function WinnerModal({ winner, onConfirm, onCancel }) {
  const { lang } = useApp()
  const t = i18n[lang]
  const prizeName = winner.prize?.name ?? winner.prize?.nameTh ?? winner.prize?.nameEn ?? ''

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
      <div
        className="w-full max-w-sm text-center p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          borderRadius: '28px',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.25)',
        }}
      >
        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, #B8860B, #FFD700, #FFF8DC, #FFD700, #B8860B)' }} />

        {/* Glow behind emoji */}
        <div className="relative inline-block mb-5">
          <div className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)', filter: 'blur(12px)', transform: 'scale(2)' }} />
          <div className="text-6xl relative">🎉</div>
        </div>

        <h2 className="text-sm font-semibold mb-3 uppercase tracking-widest"
          style={{ color: 'rgba(255,215,0,0.7)' }}>
          {t.winnerTitle}
        </h2>

        <p className="text-3xl font-bold mb-3 leading-tight break-words text-white">
          {winner.participant.name}
        </p>

        <div className="inline-block px-4 py-1.5 rounded-full mb-8"
          style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)' }}>
          <p className="text-base font-semibold break-words"
            style={{ color: '#FFD700' }}>
            🏆 {prizeName}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-semibold transition-all hover:bg-white/10 active:scale-95"
            style={{ border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)' }}
          >
            {t.cancelSpin}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl text-white font-bold transition-all active:scale-95 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 6px 20px rgba(102,126,234,0.45)',
            }}
          >
            {t.confirmWinner}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- Tab icons (used on both desktop sidebar and mobile bar) ----
const TAB_ICONS = {
  spin: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  ),
  prizes: (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
    </svg>
  ),
  participants: (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  ),
  history: (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
}

const DESKTOP_TABS = ['prizes', 'participants', 'history', 'settings']
const MOBILE_TABS = ['spin', 'prizes', 'participants', 'history', 'settings']

function renderPanel(tab) {
  if (tab === 'prizes') return <PrizePanel />
  if (tab === 'participants') return <ParticipantPanel />
  if (tab === 'history') return <HistoryPanel />
  if (tab === 'settings') return <SettingsPanel />
  return null
}

// ---- Wheel area (shared between desktop main + mobile spin tab) ----
function WheelArea({ selectedPrizeId, onSelect, onWin }) {
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 w-full">
      <PrizeSelector selectedId={selectedPrizeId} onSelect={onSelect} />
      <SpinWheel selectedPrizeId={selectedPrizeId} onWin={onWin} />
    </div>
  )
}

// ---- App root ----
export default function App() {
  const { prizes, confirmWinner, lang } = useApp()
  const t = i18n[lang]

  const [desktopTab, setDesktopTab] = useState('prizes')
  const [mobileTab, setMobileTab] = useState('spin')
  const [selectedPrizeId, setSelectedPrizeId] = useState('')
  const [winner, setWinner] = useState(null)

  // Auto-clear prize selection when it sells out
  useEffect(() => {
    if (!selectedPrizeId) return
    const prize = prizes.find(p => p.id === selectedPrizeId)
    if (prize && prize.remainingQty === 0) setSelectedPrizeId('')
  }, [prizes, selectedPrizeId])

  const handleWin = useCallback((participant) => {
    const prize = prizes.find(p => p.id === selectedPrizeId)
    setWinner({ participant, prize })
  }, [prizes, selectedPrizeId])

  const handleConfirm = useCallback(() => {
    if (winner) confirmWinner(winner.participant.id, selectedPrizeId)
    setWinner(null)
  }, [winner, selectedPrizeId, confirmWinner])

  const getMobileTabLabel = (tab) => {
    if (tab === 'spin') return t.spinTab
    return t[tab]
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-800 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm z-20">
        <span className="font-bold text-slate-800 truncate">{t.appTitle}</span>
        <div className="ml-auto flex-shrink-0">
          <LanguageToggle />
        </div>
      </header>

      {/* ── DESKTOP layout (md+) ── */}
      <div className="hidden md:flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <nav className="flex border-b border-slate-100">
            {DESKTOP_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setDesktopTab(tab)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors
                  ${desktopTab === tab
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {TAB_ICONS[tab]}
                <span>{t[tab]}</span>
              </button>
            ))}
          </nav>
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderPanel(desktopTab)}
          </div>
        </aside>

        {/* Main wheel area */}
        <main className="flex-1 flex items-center justify-center overflow-auto">
          <WheelArea
            selectedPrizeId={selectedPrizeId}
            onSelect={setSelectedPrizeId}
            onWin={handleWin}
          />
        </main>
      </div>

      {/* ── MOBILE layout (< md) ── */}
      <div className="flex md:hidden flex-col flex-1 min-h-0 overflow-hidden">
        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {mobileTab === 'spin' && (
            <WheelArea
              selectedPrizeId={selectedPrizeId}
              onSelect={setSelectedPrizeId}
              onWin={handleWin}
            />
          )}
          {mobileTab !== 'spin' && (
            <div className="h-full flex flex-col">
              {renderPanel(mobileTab)}
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <nav className="flex border-t border-slate-200 bg-white flex-shrink-0 shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
          {MOBILE_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors
                ${mobileTab === tab
                  ? 'text-blue-500'
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {TAB_ICONS[tab]}
              <span>{getMobileTabLabel(tab)}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Winner Modal */}
      {winner && (
        <WinnerModal
          winner={winner}
          onConfirm={handleConfirm}
          onCancel={() => setWinner(null)}
        />
      )}
    </div>
  )
}
