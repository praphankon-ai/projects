import { renderHook, act } from '@testing-library/react'
import useLocalStorage from '../../hooks/useLocalStorage.js'

describe('useLocalStorage', () => {
  test('returns initialValue when key is not set', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  test('returns parsed value from localStorage when key exists', () => {
    localStorage.setItem('test_key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('test_key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  test('persists new value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', []))
    act(() => result.current[1](['alice', 'bob']))
    expect(JSON.parse(localStorage.getItem('test_key'))).toEqual(['alice', 'bob'])
  })

  test('supports functional updater like useState', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', [1]))
    act(() => result.current[1](prev => [...prev, 2]))
    expect(result.current[0]).toEqual([1, 2])
  })

  test('returns initialValue when stored JSON is malformed', () => {
    localStorage.setItem('bad_key', 'not-json{')
    const { result } = renderHook(() => useLocalStorage('bad_key', 99))
    expect(result.current[0]).toBe(99)
  })

  test('two hooks sharing same key stay in sync after set', () => {
    const { result: a } = renderHook(() => useLocalStorage('shared_key', 0))
    act(() => a.current[1](42))
    // Re-mount reads from localStorage — new hook should see persisted value
    const { result: b } = renderHook(() => useLocalStorage('shared_key', 0))
    expect(b.current[0]).toBe(42)
  })
})
