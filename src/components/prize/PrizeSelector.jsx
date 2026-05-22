import { useApp } from '../../context/AppContext.jsx'
import i18n from '../../constants/i18n.js'

export default function PrizeSelector({ selectedId, onSelect }) {
  const { prizes, lang } = useApp()
  const t = i18n[lang]
  const available = prizes.filter(p => p.remainingQty > 0)

  return (
    <div className="w-full max-w-sm">
      <select
        value={selectedId}
        onChange={e => onSelect(e.target.value)}
        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium bg-white focus:outline-none focus:border-blue-400 cursor-pointer transition-colors appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2364748B'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '18px',
          paddingRight: '40px',
        }}
      >
        <option value="">{t.selectPrizePlaceholder}</option>
        {available.map(prize => {
          const name = prize.name ?? prize.nameTh ?? prize.nameEn ?? ''
          return (
            <option key={prize.id} value={prize.id}>
              {name} ({prize.remainingQty})
            </option>
          )
        })}
      </select>
    </div>
  )
}
