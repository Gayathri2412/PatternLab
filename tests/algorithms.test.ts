import { describe, expect, it } from 'vitest'
import { longestUniqueSubstring, maxSumSubarray, minSizeSubarray, parseIntegerArray } from '../src/algorithms/slidingWindow'

describe('trace-driven sliding window algorithms', () => {
  it('finds the default fixed window and handles edge cases', () => {
    const run = maxSumSubarray([2, 1, 5, 1, 3, 2], 3)
    expect(run.result).toMatchObject({ value: 9, start: 2, slice: [5, 1, 3] })
    expect(run.steps.at(-1)?.phase).toBe('complete')
    expect(maxSumSubarray([-8, -2, -5], 1).result.value).toBe(-2)
    expect(maxSumSubarray([1, 3, 2], 3).result.value).toBe(6)
    expect(maxSumSubarray([4], 1).result.value).toBe(4)
    expect(() => maxSumSubarray([], 1)).toThrow()
    expect(() => maxSumSubarray([1, 2], 0)).toThrow()
    expect(() => maxSumSubarray([1, 2], 3)).toThrow()
    expect(() => maxSumSubarray([Number.MAX_SAFE_INTEGER, 1], 2)).toThrow(/safe integer precision/)
  })
  it('uses last-seen indices without moving left backward, in code points', () => {
    const run = longestUniqueSubstring('abcabcbb')
    expect(run.result).toMatchObject({ value: 3, text: 'abc', start: 0 })
    expect(longestUniqueSubstring('abba').result.value).toBe(2)
    expect(longestUniqueSubstring('abcdef').result.value).toBe(6)
    expect(longestUniqueSubstring('').result.value).toBe(0)
    expect(longestUniqueSubstring('😀a😀').result).toMatchObject({ value: 2, text: '😀a' })
    expect(run.steps.every((step, i, all) => i === 0 || step.left >= all[i - 1]!.left)).toBe(true)
    expect(run.steps.some(step => step.activeCodeLine === 'duplicate')).toBe(true)
  })
  it('shrinks positive windows and handles no solution', () => {
    const run = minSizeSubarray([2, 3, 1, 2, 4, 3], 7)
    expect(run.result).toMatchObject({ value: 2, slice: [4, 3], start: 4 })
    expect(minSizeSubarray([1, 1], 5).result.value).toBe(0)
    expect(minSizeSubarray([7], 7).result.value).toBe(1)
    expect(() => minSizeSubarray([2, 0, 1], 2)).toThrow(/positive/)
    expect(() => minSizeSubarray([2, -1], 2)).toThrow(/positive/)
  })
  it('rejects malformed and unsafe array input', () => {
    expect(parseIntegerArray('2, -1, 5')).toEqual([2, -1, 5])
    expect(() => parseIntegerArray('')).toThrow()
    expect(() => parseIntegerArray('1, x')).toThrow()
    expect(() => parseIntegerArray('9007199254740992')).toThrow()
  })
})
