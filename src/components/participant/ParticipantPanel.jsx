import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import i18n from '../../constants/i18n.js'
import Button from '../ui/Button.jsx'
import ImportModal from './ImportModal.jsx'

export default function ParticipantPanel() {
  const { participants, addParticipant, deleteParticipant, resetParticipants, lang } = useApp()
  const t = i18n[lang]

  const [inputName, setInputName] = useState('')
  const [showImport, setShowImport] = useState(false)

  const eligibleCount = participants.filter(p => p.isEligible).length
  const wonCount = participants.length - eligibleCount

  const handleAdd = (e) => {
    e.preventDefault()
    if (!inputName.trim()) return
    addParticipant(inputName)
    setInputName('')
  }

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) resetParticipants()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Stats */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex gap-4 text-xs text-slate-500">
        <span className="font-medium text-blue-600">{eligibleCount} {t.eligible}</span>
        {wonCount > 0 && <span>{wonCount} {t.won}</span>}
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="p-4 border-b border-slate-100 flex gap-2">
        <input
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={t.participantName}
          value={inputName}
          onChange={e => setInputName(e.target.value)}
        />
        <Button type="submit" disabled={!inputName.trim()}>{t.add}</Button>
      </form>

      {/* Action buttons */}
      <div className="px-4 pb-3 flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => setShowImport(true)} className="flex-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          {t.importFile}
        </Button>
        {participants.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-400 hover:text-red-600 hover:bg-red-50">
            {t.resetParticipants}
          </Button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-slate-100">
        {participants.length === 0 && (
          <p className="p-6 text-center text-slate-400 text-sm">{t.noParticipants}</p>
        )}
        {participants.map(p => (
          <div
            key={p.id}
            className={`flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 ${!p.isEligible ? 'opacity-50' : ''}`}
          >
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${p.isEligible ? 'bg-green-400' : 'bg-slate-300'}`}
            />
            <span className="flex-1 text-sm text-slate-700 truncate">{p.name}</span>
            {!p.isEligible && (
              <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-full">
                {t.wonBadge}
              </span>
            )}
            {p.isEligible && (
              <button
                onClick={() => deleteParticipant(p.id)}
                className="p-1 text-slate-300 hover:text-red-400 transition-colors rounded flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </div>
  )
}
