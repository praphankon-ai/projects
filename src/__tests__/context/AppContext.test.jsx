import { renderHook, act } from '@testing-library/react'
import { AppProvider, useApp } from '../../context/AppContext.jsx'

function wrapper({ children }) {
  return <AppProvider>{children}</AppProvider>
}

// ── Prize actions ─────────────────────────────────────────────────────────────

describe('addPrize', () => {
  test('adds a prize with remainingQty equal to totalQty', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'Gold', totalQty: 3, color: '#FF0000' }))
    expect(result.current.prizes).toHaveLength(1)
    const p = result.current.prizes[0]
    expect(p.name).toBe('Gold')
    expect(p.totalQty).toBe(3)
    expect(p.remainingQty).toBe(3)
    expect(p.id).toBeTruthy()
  })

  test('assigns unique ids to multiple prizes', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'A', totalQty: 1, color: '#000' }))
    act(() => result.current.addPrize({ name: 'B', totalQty: 1, color: '#111' }))
    expect(result.current.prizes).toHaveLength(2)
    const ids = result.current.prizes.map(p => p.id)
    expect(new Set(ids).size).toBe(2)
  })
})

describe('updatePrize', () => {
  test('increases remainingQty when totalQty increases', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'X', totalQty: 2, color: '#000' }))
    const id = result.current.prizes[0].id
    act(() => result.current.updatePrize(id, { totalQty: 5 }))
    expect(result.current.prizes[0].remainingQty).toBe(5)
    expect(result.current.prizes[0].totalQty).toBe(5)
  })

  test('decreases remainingQty when totalQty decreases', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'X', totalQty: 2, color: '#000' }))
    const id = result.current.prizes[0].id
    act(() => result.current.updatePrize(id, { totalQty: 1 }))
    expect(result.current.prizes[0].remainingQty).toBe(1)
  })

  test('remainingQty does not go below 0', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'X', totalQty: 1, color: '#000' }))
    const id = result.current.prizes[0].id
    act(() => result.current.addParticipant('Alice'))
    const pId = result.current.participants[0].id
    act(() => result.current.confirmWinner(pId, id))
    // remaining is now 0; reducing totalQty more would give negative diff
    act(() => result.current.updatePrize(id, { totalQty: 1 }))
    expect(result.current.prizes[0].remainingQty).toBeGreaterThanOrEqual(0)
  })

  test('updates prize name without affecting remainingQty', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'Old', totalQty: 2, color: '#000' }))
    const id = result.current.prizes[0].id
    act(() => result.current.updatePrize(id, { name: 'New' }))
    expect(result.current.prizes[0].name).toBe('New')
    expect(result.current.prizes[0].remainingQty).toBe(2)
  })
})

describe('deletePrize', () => {
  test('removes the prize from the list', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'Del', totalQty: 1, color: '#000' }))
    const id = result.current.prizes[0].id
    act(() => result.current.deletePrize(id))
    expect(result.current.prizes).toHaveLength(0)
  })

  test('only removes the targeted prize', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'Keep', totalQty: 1, color: '#000' }))
    act(() => result.current.addPrize({ name: 'Del', totalQty: 1, color: '#111' }))
    const delId = result.current.prizes[1].id
    act(() => result.current.deletePrize(delId))
    expect(result.current.prizes).toHaveLength(1)
    expect(result.current.prizes[0].name).toBe('Keep')
  })
})

// ── Participant actions ───────────────────────────────────────────────────────

describe('addParticipant', () => {
  test('adds a participant and returns true', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    let ok
    act(() => { ok = result.current.addParticipant('Alice') })
    expect(ok).toBe(true)
    expect(result.current.participants).toHaveLength(1)
    expect(result.current.participants[0]).toMatchObject({ name: 'Alice', isEligible: true })
  })

  test('rejects empty string and returns false', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    let ok
    act(() => { ok = result.current.addParticipant('   ') })
    expect(ok).toBe(false)
    expect(result.current.participants).toHaveLength(0)
  })

  test('rejects duplicate name and returns false', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addParticipant('Alice'))
    let ok
    act(() => { ok = result.current.addParticipant('Alice') })
    expect(ok).toBe(false)
    expect(result.current.participants).toHaveLength(1)
  })

  test('trims whitespace before storing', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addParticipant('  Bob  '))
    expect(result.current.participants[0].name).toBe('Bob')
  })
})

describe('addParticipants (bulk)', () => {
  test('adds multiple names, returns {added, skipped}', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    let res
    act(() => { res = result.current.addParticipants(['Alice', 'Bob', 'Charlie']) })
    expect(res).toEqual({ added: 3, skipped: 0 })
    expect(result.current.participants).toHaveLength(3)
  })

  test('skips duplicates within the batch and against existing', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addParticipant('Alice'))
    let res
    act(() => { res = result.current.addParticipants(['Alice', 'Bob', 'Bob']) })
    expect(res.added).toBe(1)
    expect(res.skipped).toBe(2)
    expect(result.current.participants).toHaveLength(2)
  })

  test('filters out empty/whitespace lines', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    let res
    act(() => { res = result.current.addParticipants(['Alice', '', '   ', 'Bob']) })
    expect(res.added).toBe(2)
  })
})

describe('deleteParticipant', () => {
  test('removes participant by id', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addParticipant('Alice'))
    const id = result.current.participants[0].id
    act(() => result.current.deleteParticipant(id))
    expect(result.current.participants).toHaveLength(0)
  })
})

describe('resetParticipants', () => {
  test('clears all participants', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addParticipants(['A', 'B', 'C']))
    act(() => result.current.resetParticipants())
    expect(result.current.participants).toHaveLength(0)
  })
})

// ── confirmWinner ─────────────────────────────────────────────────────────────

describe('confirmWinner', () => {
  function setupWinner() {
    const hook = renderHook(() => useApp(), { wrapper })
    const { result } = hook
    act(() => result.current.addPrize({ name: 'Prize A', totalQty: 2, color: '#000' }))
    act(() => result.current.addParticipant('Alice'))
    const prizeId = result.current.prizes[0].id
    const participantId = result.current.participants[0].id
    act(() => result.current.confirmWinner(participantId, prizeId))
    return { result, prizeId, participantId }
  }

  test('sets winner participant isEligible to false', () => {
    const { result, participantId } = setupWinner()
    const p = result.current.participants.find(x => x.id === participantId)
    expect(p.isEligible).toBe(false)
  })

  test('decrements prize remainingQty by 1', () => {
    const { result, prizeId } = setupWinner()
    const prize = result.current.prizes.find(x => x.id === prizeId)
    expect(prize.remainingQty).toBe(1)
  })

  test('adds a WinnerRecord to history with correct fields', () => {
    const { result, prizeId, participantId } = setupWinner()
    expect(result.current.history).toHaveLength(1)
    const rec = result.current.history[0]
    expect(rec.prizeId).toBe(prizeId)
    expect(rec.prizeName).toBe('Prize A')
    expect(rec.participantName).toBe('Alice')
    expect(rec.timestamp).toBeTruthy()
    expect(rec.id).toBeTruthy()
  })

  test('does nothing when participant id is invalid', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'P', totalQty: 1, color: '#000' }))
    const prizeId = result.current.prizes[0].id
    act(() => result.current.confirmWinner('nonexistent', prizeId))
    expect(result.current.history).toHaveLength(0)
  })

  test('does nothing when prize id is invalid', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addParticipant('Alice'))
    const pId = result.current.participants[0].id
    act(() => result.current.confirmWinner(pId, 'nonexistent'))
    expect(result.current.history).toHaveLength(0)
  })

  test('remainingQty reaches 0 after all prizes claimed', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'P', totalQty: 1, color: '#000' }))
    act(() => result.current.addParticipant('Alice'))
    const prizeId = result.current.prizes[0].id
    const pId = result.current.participants[0].id
    act(() => result.current.confirmWinner(pId, prizeId))
    expect(result.current.prizes[0].remainingQty).toBe(0)
  })
})

// ── clearHistory ──────────────────────────────────────────────────────────────

describe('clearHistory', () => {
  test('empties the history array', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.addPrize({ name: 'P', totalQty: 2, color: '#000' }))
    act(() => result.current.addParticipant('Alice'))
    const prizeId = result.current.prizes[0].id
    const pId = result.current.participants[0].id
    act(() => result.current.confirmWinner(pId, prizeId))
    act(() => result.current.clearHistory())
    expect(result.current.history).toHaveLength(0)
  })
})
