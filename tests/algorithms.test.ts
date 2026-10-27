import { describe, expect, it } from 'vitest'
import { longestUniqueSubstring, maxSumSubarray, minSizeSubarray, parseIntegerArray } from '../src/algorithms/slidingWindow'
import { parseTwoPointerArray, removeDuplicatesSorted, twoSumSorted, validPalindrome } from '../src/algorithms/twoPointers'

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

describe('Two Pointers algorithms and traces', () => {
  it('finds sorted pair indices and rejects invalid pair inputs', () => {
    expect(twoSumSorted([2, 7, 11, 15], 9).result).toEqual([1, 2])
    expect(twoSumSorted([1, 2, 4, 6, 9], 10).result).toEqual([1, 5])
    expect(() => twoSumSorted([2, 1], 3)).toThrow(/sorted/)
    expect(() => twoSumSorted([1, 2], 99)).toThrow(/No matching pair/)
    const run=twoSumSorted([2,7,11,15],9)
    expect(run.steps.some(s=>s.phase==='move-right'&&s.left===0&&s.right===3)).toBe(true)
    expect(run.steps.at(-1)?.result).toEqual([1,2])
  })
  it('compares palindrome code points while skipping punctuation', () => {
    expect(validPalindrome('A man, a plan, a canal: Panama').result).toBe(true)
    expect(validPalindrome('race a car').result).toBe(false)
    expect(validPalindrome('').result).toBe(true)
    expect(validPalindrome('.,,!').result).toBe(true)
    expect(validPalindrome('😀a😀').result).toBe(true)
  })
  it('compacts unique sorted values in the actual trace', () => {
    const run=removeDuplicatesSorted([0,0,1,1,1,2,2,3,3,4])
    expect(run.result).toEqual({count:5,prefix:[0,1,2,3,4]})
    expect(run.steps.some(s=>s.phase==='duplicate')).toBe(true)
    expect(run.steps.some(s=>s.phase==='write'&&s.prefix?.at(-1)===4)).toBe(true)
    expect(removeDuplicatesSorted([]).result).toEqual({count:0,prefix:[]})
    expect(removeDuplicatesSorted([6]).result).toEqual({count:1,prefix:[6]})
    expect(()=>removeDuplicatesSorted([2,1])).toThrow(/sorted/)
    expect(()=>parseTwoPointerArray('')).toThrow()
    expect(parseTwoPointerArray('',true)).toEqual([])
  })
})
