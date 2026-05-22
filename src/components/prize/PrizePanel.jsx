import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import i18n from '../../constants/i18n.js'
import Button from '../ui/Button.jsx'
import Modal from '../ui/Modal.jsx'

const WHEEL_COLORS = [
  '#3B82F6', '#EF4444', '#22C55E', '#F59E0B', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
]

function getNextColor(existingPrizes) {
  const used = new Set(existingPrizes.map(p => p.color))
  return WHEEL_COLORS.find(c => !used.has(c)) ?? WHEEL_COLORS[existingPrizes.length % WHEEL_COLORS.length]
}

const EMPTY_FORM = { name: '', totalQty: 1 }

export default function PrizePanel() {
  const { prizes, addPrize, updatePrize, deletePrize, lang } = useApp()
  const t = i18n[lang]

  const [showAdd, setShowAdd] = useState(false)
  const [editPrize, setEditPrize] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addPrize({
      name: form.name.trim(),
      totalQty: Math.max(1, Number(form.totalQty)),
      color: getNextColor(prizes),
    })
    setForm(EMPTY_FORM)
    setShowAdd(false)
  }

  const handleEditOpen = (prize) => {
    setEditPrize(prize)
    setForm({ name: prize.name ?? prize.nameTh ?? '', totalQty: prize.totalQty })
  }

  const handleEditSave = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    updatePrize(editPrize.id, {
      name: form.name.trim(),
      totalQty: Math.max(1, Number(form.totalQty)),
    })
    setEditPrize(null)
    setForm(EMPTY_FORM)
  }

  const handleDelete = (prize) => {
    if (window.confirm(t.deleteConfirm)) deletePrize(prize.id)
  }

  const closeModal = () => {
    setShowAdd(false)
    setEditPrize(null)
    setForm(EMPTY_FORM)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100">
        <Button onClick={() => setShowAdd(true)} className="w-full">
          + {t.addPrize}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-slate-100">
        {prizes.length === 0 && (
          <p className="p-6 text-center text-slate-400 text-sm">{t.noPrizes}</p>
        )}
        {prizes.map(prize => {
          const displayName = prize.name ?? prize.nameTh ?? prize.nameEn ?? ''
          return (
            <div key={prize.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: prize.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{displayName}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {prize.remainingQty === 0 ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 font-medium">
                    {t.soldOut}
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                    {prize.remainingQty}/{prize.totalQty}
                  </span>
                )}
                <button
                  onClick={() => handleEditOpen(prize)}
                  className="p-1 text-slate-400 hover:text-blue-500 transition-colors rounded"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(prize)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {(showAdd || editPrize) && (
        <Modal title={editPrize ? t.edit : t.addPrize} onClose={closeModal}>
          <form onSubmit={editPrize ? handleEditSave : handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{t.prizeName}</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder={lang === 'th' ? 'เช่น โทรศัพท์มือถือ' : 'e.g. Smartphone'}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">{t.totalQty}</label>
              <input
                type="number"
                min="1"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.totalQty}
                onChange={e => setForm(f => ({ ...f, totalQty: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={closeModal} className="flex-1">{t.cancel}</Button>
              <Button type="submit" className="flex-1">{editPrize ? t.save : t.add}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
