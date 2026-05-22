import * as XLSX from 'xlsx'

export async function parseTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const names = e.target.result
        .split('\n')
        .map(l => l.replace(/\r/g, '').trim())
        .filter(l => l.length > 0)
      resolve(names)
    }
    reader.onerror = () => reject(new Error('Cannot read file'))
    reader.readAsText(file, 'UTF-8')
  })
}

export async function parseExcelFile(file, skipFirstRow = false) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
        const start = skipFirstRow ? 1 : 0
        const names = rows
          .slice(start)
          .map(row => String(row[0] ?? '').trim())
          .filter(name => name.length > 0)
        resolve(names)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Cannot read file'))
    reader.readAsArrayBuffer(file)
  })
}
