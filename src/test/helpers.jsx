import { render } from '@testing-library/react'
import { AppProvider } from '../context/AppContext.jsx'

export function renderWithProvider(ui) {
  return render(<AppProvider>{ui}</AppProvider>)
}

export function makeParticipant(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'Test User',
    isEligible: true,
    ...overrides,
  }
}

export function makePrize(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'Test Prize',
    totalQty: 3,
    remainingQty: 3,
    color: '#FF6B6B',
    ...overrides,
  }
}

export function makeRecord(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    prizeId: 'p1',
    prizeName: 'Test Prize',
    participantName: 'Alice',
    timestamp: new Date().toISOString(),
    ...overrides,
  }
}
