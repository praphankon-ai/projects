import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrizeSelector from '../../components/prize/PrizeSelector.jsx'
import { renderWithProvider } from '../../test/helpers.jsx'

function seedPrizes(prizes) {
  localStorage.setItem('pw_prizes', JSON.stringify(prizes))
}

describe('PrizeSelector', () => {
  test('shows placeholder option when no prizes exist', () => {
    renderWithProvider(<PrizeSelector selectedId="" onSelect={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    // Placeholder text — only one option
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  test('shows available prizes with remaining qty', () => {
    seedPrizes([
      { id: 'p1', name: 'Gold', totalQty: 3, remainingQty: 3, color: '#FFD700' },
    ])
    renderWithProvider(<PrizeSelector selectedId="" onSelect={vi.fn()} />)
    expect(screen.getByRole('option', { name: /Gold \(3\)/ })).toBeInTheDocument()
  })

  test('hides prizes with remainingQty === 0', () => {
    seedPrizes([
      { id: 'p1', name: 'Available', totalQty: 2, remainingQty: 2, color: '#000' },
      { id: 'p2', name: 'SoldOut', totalQty: 1, remainingQty: 0, color: '#111' },
    ])
    renderWithProvider(<PrizeSelector selectedId="" onSelect={vi.fn()} />)
    expect(screen.queryByRole('option', { name: /SoldOut/ })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Available/ })).toBeInTheDocument()
  })

  test('calls onSelect with the chosen prize id', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    seedPrizes([
      { id: 'p1', name: 'Laptop', totalQty: 2, remainingQty: 2, color: '#000' },
    ])
    renderWithProvider(<PrizeSelector selectedId="" onSelect={onSelect} />)
    await user.selectOptions(screen.getByRole('combobox'), 'p1')
    expect(onSelect).toHaveBeenCalledWith('p1')
  })

  test('reflects selectedId as current select value', () => {
    seedPrizes([
      { id: 'p1', name: 'Watch', totalQty: 1, remainingQty: 1, color: '#000' },
    ])
    renderWithProvider(<PrizeSelector selectedId="p1" onSelect={vi.fn()} />)
    expect(screen.getByRole('combobox')).toHaveValue('p1')
  })
})
