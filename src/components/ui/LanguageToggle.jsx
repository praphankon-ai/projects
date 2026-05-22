import { useApp } from '../../context/AppContext.jsx'

export default function LanguageToggle() {
  const { lang, setLang } = useApp()

  return (
    <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
      <button
        onClick={() => setLang('th')}
        className={`px-3 py-1.5 font-medium transition-colors ${
          lang === 'th'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-slate-500 hover:bg-slate-50'
        }`}
      >
        ไทย
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1.5 font-medium transition-colors ${
          lang === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-slate-500 hover:bg-slate-50'
        }`}
      >
        EN
      </button>
    </div>
  )
}
