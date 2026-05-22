import { parseTextFile, parseExcelFile } from '../../utils/importParticipants.js'
import * as XLSX from 'xlsx'

// Helper: create a File-like object from text content
function makeTextFile(content, filename = 'names.txt') {
  return new File([content], filename, { type: 'text/plain' })
}

// Helper: create an .xlsx File from an array of rows
function makeExcelFile(rows, filename = 'names.xlsx') {
  const ws = XLSX.utils.aoa_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  return new File([buf], filename, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

// ── parseTextFile ─────────────────────────────────────────────────────────────

describe('parseTextFile', () => {
  test('parses names separated by newlines', async () => {
    const file = makeTextFile('Alice\nBob\nCharlie')
    const result = await parseTextFile(file)
    expect(result).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  test('handles Windows CRLF line endings', async () => {
    const file = makeTextFile('Alice\r\nBob\r\nCharlie\r\n')
    const result = await parseTextFile(file)
    expect(result).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  test('filters out empty lines', async () => {
    const file = makeTextFile('Alice\n\n\nBob\n')
    const result = await parseTextFile(file)
    expect(result).toEqual(['Alice', 'Bob'])
  })

  test('trims leading and trailing whitespace from each name', async () => {
    const file = makeTextFile('  Alice  \n  Bob  ')
    const result = await parseTextFile(file)
    expect(result).toEqual(['Alice', 'Bob'])
  })

  test('returns empty array for blank file', async () => {
    const file = makeTextFile('   \n   ')
    const result = await parseTextFile(file)
    expect(result).toEqual([])
  })
})

// ── parseExcelFile ────────────────────────────────────────────────────────────

describe('parseExcelFile', () => {
  test('reads names from first column', async () => {
    const file = makeExcelFile([['Alice'], ['Bob'], ['Charlie']])
    const result = await parseExcelFile(file)
    expect(result).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  test('skipFirstRow=true skips the header row', async () => {
    const file = makeExcelFile([['ชื่อ'], ['Alice'], ['Bob']])
    const result = await parseExcelFile(file, true)
    expect(result).toEqual(['Alice', 'Bob'])
  })

  test('skipFirstRow=false (default) includes header row as a name', async () => {
    const file = makeExcelFile([['ชื่อ'], ['Alice']])
    const result = await parseExcelFile(file, false)
    expect(result).toEqual(['ชื่อ', 'Alice'])
  })

  test('filters out empty cells', async () => {
    const file = makeExcelFile([['Alice'], [''], ['Bob'], [null]])
    const result = await parseExcelFile(file)
    expect(result).toEqual(['Alice', 'Bob'])
  })

  test('coerces numeric cell values to strings', async () => {
    const file = makeExcelFile([[123], ['Bob']])
    const result = await parseExcelFile(file)
    expect(result).toEqual(['123', 'Bob'])
  })
})
