import { useState, useRef } from 'react'
import { parseTextFile, parseExcelFile } from '../../utils/importParticipants.js'
import { useApp } from '../../context/AppContext.jsx'
import i18n from '../../constants/i18n.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

export default function ImportModal({ onClose }) {
  const { addParticipants, lang } = useApp()
  const t = i18n[lang]
  const fileInputRef = useRef(null)
  const fileRef = useRef(null)

  const [names, setNames] = useState([])
  const [skipHeader, setSkipHeader] = useState(false)
  const [isXlsx, setIsXlsx] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState('')

  const parseFile = async (file, skip = skipHeader) => {
    setError('')
    try {
      const ext = file.name.toLowerCase()
      const excel = ext.endsWith('.xlsx') || ext.endsWith('.xls')
      setIsXlsx(excel)
      const parsed = excel
        ? await parseExcelFile(file, skip)
        : await parseTextFile(file)
      setNames(parsed)
    } catch {
      setError('Cannot read file. Please check the format.')
      setNames([])
    }
  }

  const handleFile = (file) => {
    if (!file) return
    fileRef.current = file
    parseFile(file, skipHeader)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSkipChange = (checked) => {
    setSkipHeader(checked)
    if (fileRef.current && isXlsx) parseFile(fileRef.current, checked)
  }

  const handleConfirm = () => {
    const result = addParticipants(names)
    alert(t.importResult(result.added, result.skipped))
    onClose()
  }

  return (
    <Modal title={t.importTitle} onClose={onClose}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.xlsx,.xls"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
        <svg className="w-10 h-10 mx-auto mb-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm text-slate-500">{t.dropOrClick}</p>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {isXlsx && (
        <label className="flex items-center gap-2 mt-3 text-sm text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={skipHeader}
            onChange={e => handleSkipChange(e.target.checked)}
            className="rounded"
          />
          {t.skipHeader}
        </label>
      )}

      {names.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium text-slate-700">{t.foundNames(names.length)}</p>
          <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 scrollbar-thin text-sm">
            {names.slice(0, 50).map((name, i) => (
              <div key={i} className="px-3 py-1.5 text-slate-700">{name}</div>
            ))}
            {names.length > 50 && (
              <div className="px-3 py-1.5 text-slate-400 italic">
                +{names.length - 50} more...
              </div>
            )}
          </div>
          <Button onClick={handleConfirm} className="w-full">
            {t.confirm} ({names.length})
          </Button>
        </div>
      )}
    </Modal>
  )
}
