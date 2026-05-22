import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [prizes, setPrizes] = useLocalStorage('pw_prizes', [])
  const [participants, setParticipants] = useLocalStorage('pw_participants', [])
  const [history, setHistory] = useLocalStorage('pw_history', [])
  const [lang, setLang] = useLocalStorage('pw_lang', 'th')
  const [eventTitle, setEventTitle] = useLocalStorage('pw_eventTitle', '')

  // --- Prize actions ---
  const addPrize = (prize) => {
    setPrizes(prev => [...prev, {
      id: crypto.randomUUID(),
      name: prize.name,
      totalQty: prize.totalQty,
      remainingQty: prize.totalQty,
      color: prize.color,
    }])
  }

  const updatePrize = (id, updates) => {
    setPrizes(prev => prev.map(p => {
      if (p.id !== id) return p
      const qtyDiff = (updates.totalQty ?? p.totalQty) - p.totalQty
      return {
        ...p,
        ...updates,
        remainingQty: Math.max(0, p.remainingQty + qtyDiff),
      }
    }))
  }

  const deletePrize = (id) => {
    setPrizes(prev => prev.filter(p => p.id !== id))
  }

  // --- Participant actions ---
  const addParticipant = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return false
    if (participants.some(p => p.name === trimmed)) return false
    setParticipants(prev => [...prev, {
      id: crypto.randomUUID(),
      name: trimmed,
      isEligible: true,
    }])
    return true
  }

  const addParticipants = (names) => {
    const existing = new Set(participants.map(p => p.name))
    const toAdd = []
    let skipped = 0
    for (const name of names) {
      const trimmed = name.trim()
      if (!trimmed) continue
      if (existing.has(trimmed)) { skipped++; continue }
      existing.add(trimmed)
      toAdd.push({ id: crypto.randomUUID(), name: trimmed, isEligible: true })
    }
    if (toAdd.length > 0) setParticipants(prev => [...prev, ...toAdd])
    return { added: toAdd.length, skipped }
  }

  const deleteParticipant = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id))
  }

  const resetParticipants = () => setParticipants([])

  // --- Winner confirmation ---
  const confirmWinner = (participantId, prizeId) => {
    const participant = participants.find(p => p.id === participantId)
    const prize = prizes.find(p => p.id === prizeId)
    if (!participant || !prize) return

    setParticipants(prev =>
      prev.map(p => p.id === participantId ? { ...p, isEligible: false } : p)
    )
    setPrizes(prev =>
      prev.map(p => p.id === prizeId ? { ...p, remainingQty: p.remainingQty - 1 } : p)
    )
    setHistory(prev => [...prev, {
      id: crypto.randomUUID(),
      prizeId,
      // handle old data format gracefully
      prizeName: prize.name ?? prize.nameTh ?? prize.nameEn ?? '',
      participantName: participant.name,
      timestamp: new Date().toISOString(),
    }])
  }

  const clearHistory = () => setHistory([])

  return (
    <AppContext.Provider value={{
      prizes, participants, history, lang, eventTitle,
      setLang, setEventTitle,
      addPrize, updatePrize, deletePrize,
      addParticipant, addParticipants, deleteParticipant, resetParticipants,
      confirmWinner, clearHistory,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}

export default AppContext
