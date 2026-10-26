import type { AlgorithmRun, TraceStep } from '../types/trace'

function add(steps: TraceStep[], step: Omit<TraceStep, 'stepIndex'>): void { steps.push({ ...step, stepIndex: steps.length }) }
function complete(steps: TraceStep[], left: number, right: number, explanation: string, currentSum?: number, bestValue?: number, windowText?: string): void {
  add(steps, { phase: 'complete', left, right, currentSum, bestValue, activeCodeLine: 'finish', explanation, condition: 'All candidates have been processed; return the best recorded answer.', windowText })
}

export function maxSumSubarray(values: readonly number[], k: number): AlgorithmRun {
  if (!values.length || values.some(v => !Number.isSafeInteger(v))) throw new Error('Enter at least one safe integer.')
  if (!Number.isInteger(k) || k < 1 || k > values.length) throw new Error(`K must be between 1 and ${values.length}.`)
  const steps: TraceStep[] = []; let sum = 0
  add(steps, { phase: 'initialize', left: 0, right: k - 1, currentSum: 0, bestValue: Number.NEGATIVE_INFINITY, enteringIndex: null, leavingIndex: null, activeCodeLine: 'init', explanation: `Start with an empty sum, then add the first ${k} elements to form the initial fixed-width window.`, condition: 'The first window ends at index K − 1.', windowText: '' })
  for (let i = 0; i < k; i++) { sum += values[i]!; if (!Number.isSafeInteger(sum)) throw new Error('The window sum exceeds JavaScript safe integer precision. Use smaller values.'); add(steps, { phase: 'initialize', left: 0, right: k - 1, currentSum: sum, bestValue: Number.NEGATIVE_INFINITY, enteringIndex: i, leavingIndex: null, activeCodeLine: 'seed', explanation: `Add ${values[i]} at index ${i}; this builds the first window sum directly.`, condition: `Include each element while i < K (${i} < ${k}).` }) }
  let best = sum, bestStart = 0
  add(steps, { phase: 'initialize', left: 0, right: k - 1, currentSum: sum, bestValue: best, activeCodeLine: 'update', explanation: `The initial window sums to ${sum}, so it becomes the first best candidate.`, condition: 'The initial sum is the first complete candidate.', windowText: values.slice(0, k).join(', ') })
  for (let right = k; right < values.length; right++) {
    const left = right - k + 1, leaving = right - k, before = best
    sum = sum - values[leaving]! + values[right]!
    if (!Number.isSafeInteger(sum)) throw new Error('The window sum exceeds JavaScript safe integer precision. Use smaller values.')
    if (sum > best) { best = sum; bestStart = left }
    add(steps, { phase: 'expand', left, right, currentSum: sum, bestValue: best, enteringIndex: right, leavingIndex: leaving, activeCodeLine: 'expand', explanation: `Slide one place: subtract outgoing ${values[leaving]} and add incoming ${values[right]}. Every shared element cancels, so this equals recomputing the new window. ${best > before ? `The new sum ${sum} sets a maximum.` : `The best remains ${best}.`}`, condition: `${sum} > ${before} is ${sum > before}; update the best only on a strict improvement.`, windowText: values.slice(bestStart, bestStart + k).join(', ') })
  }
  complete(steps, values.length - k, values.length - 1, `Finished: the maximum sum is ${best}, from indices ${bestStart}–${bestStart + k - 1}.`, sum, best, values.slice(bestStart, bestStart + k).join(', '))
  return { steps, result: { value: best, start: bestStart, end: bestStart + k - 1, slice: values.slice(bestStart, bestStart + k) } }
}

export function longestUniqueSubstring(input: string): AlgorithmRun {
  const chars = Array.from(input)
  if (chars.length > 160) throw new Error('Use 160 Unicode code points or fewer for a readable trace.')
  const steps: TraceStep[] = []; const last = new Map<string, number>(); let left = 0, best = 0, bestStart = 0
  add(steps, { phase: 'initialize', left: 0, right: -1, bestValue: 0, activeCodeLine: 'init', explanation: 'Represent the string as Unicode code points so displayed indices match the algorithm. Begin with an empty valid window.', condition: 'Process each code point exactly once from left to right.', seen: [] })
  for (let right = 0; right < chars.length; right++) {
    const ch = chars[right]!, previous = last.get(ch), oldLeft = left
    if (previous !== undefined && previous >= left) {
      left = previous + 1
      add(steps, { phase: 'shrink', left, right, bestValue: best, activeCodeLine: 'duplicate', explanation: `“${ch}” was last seen at ${previous} inside the current window. Jump left to ${left}; indices before it are still valid and must not be revisited.`, condition: `lastSeen(“${ch}”) ≥ left (${previous} ≥ ${oldLeft}) is true; move left past the duplicate.`, seen: [...last, [ch, previous]] })
    } else {
      add(steps, { phase: 'expand', left, right, bestValue: best, activeCodeLine: 'expand', explanation: `“${ch}” is new to the active window, so extending right keeps all characters unique.`, condition: previous === undefined ? `“${ch}” has not appeared before.` : `${previous} < ${left}; the old occurrence is outside this window.` , seen: [...last] })
    }
    last.set(ch, right)
    const length = right - left + 1
    const improved = length > best
    if (improved) { best = length; bestStart = left }
    add(steps, { phase: 'expand', left, right, bestValue: best, activeCodeLine: 'update', explanation: `${improved ? 'Record' : 'Keep'} “${chars.slice(bestStart, bestStart + best).join('')}” as the best substring so far (length ${best}). The map stores each character’s latest index.`, condition: `${length} > previous best is ${improved}; ${improved ? 'update the best' : 'keep the best'}.`, windowText: chars.slice(bestStart, bestStart + best).join(''), seen: [...last] })
  }
  const text = chars.slice(bestStart, bestStart + best).join('')
  complete(steps, left, chars.length - 1, `Finished: the longest unique substring has length ${best}${best ? ` (“${text}”)` : ''}.`, undefined, best, text)
  return { steps, result: { value: best, start: bestStart, end: bestStart + best - 1, slice: [], text } }
}

export function minSizeSubarray(values: readonly number[], target: number): AlgorithmRun {
  if (!values.length || values.some(v => !Number.isSafeInteger(v))) throw new Error('Enter at least one safe integer.')
  if (values.some(v => v <= 0)) throw new Error('Every array element must be a positive integer for this shrinking-window algorithm.')
  if (!Number.isSafeInteger(target) || target <= 0) throw new Error('Target must be a positive safe integer.')
  const steps: TraceStep[] = []; let left = 0, sum = 0, best = Number.POSITIVE_INFINITY, bestStart = -1, bestEnd = -1
  add(steps, { phase: 'initialize', left: 0, right: -1, currentSum: 0, bestValue: 0, activeCodeLine: 'init', explanation: 'Start with an empty window. Positive values make the sum monotonic as the window expands or shrinks.', condition: 'Expand right, then shrink while the target is met.' })
  for (let right = 0; right < values.length; right++) {
    sum += values[right]!
    if (!Number.isSafeInteger(sum)) throw new Error('The running sum exceeds JavaScript safe integer precision. Use smaller values.')
    add(steps, { phase: 'expand', left, right, currentSum: sum, bestValue: best === Infinity ? 0 : best, enteringIndex: right, activeCodeLine: 'expand', explanation: `Include ${values[right]} at index ${right}; the running sum is ${sum}.`, condition: `${sum} ≥ ${target} is ${sum >= target}; shrink only while true.`, windowText: bestStart >= 0 ? values.slice(bestStart, bestEnd + 1).join(', ') : '' })
    while (sum >= target) {
      const length = right - left + 1
      if (length < best) { best = length; bestStart = left; bestEnd = right }
      add(steps, { phase: 'shrink', left, right, currentSum: sum, bestValue: best, activeCodeLine: 'update', explanation: `The window reaches the target. Record length ${length}, then try removing its leftmost positive value to find a shorter valid window.`, condition: `${sum} ≥ ${target}; a valid candidate exists.`, found: true, windowText: values.slice(bestStart, bestEnd + 1).join(', ') })
      const leaving = left; sum -= values[left]!; left++
      add(steps, { phase: 'shrink', left, right, currentSum: sum, bestValue: best, leavingIndex: leaving, activeCodeLine: 'shrink', explanation: `Remove ${values[leaving]}. Because values are positive, the sum decreases; if it drops below target, no further shrink is valid for this right boundary.`, condition: `After removing the left value, ${sum} ≥ ${target} is ${sum >= target}.`, windowText: values.slice(bestStart, bestEnd + 1).join(', ') })
    }
  }
  const found = best !== Infinity, text = found ? values.slice(bestStart, bestEnd + 1).join(', ') : ''
  complete(steps, left, values.length - 1, found ? `Finished: the shortest qualifying window has length ${best}, containing [${text}].` : `Finished: no contiguous subarray reaches ${target}.`, sum, found ? best : 0, text)
  return { steps, result: { value: found ? best : 0, start: bestStart, end: bestEnd, slice: found ? values.slice(bestStart, bestEnd + 1) : [] } }
}

export function parseIntegerArray(raw: string): number[] {
  const parts = raw.split(',').map(v => v.trim())
  if (!raw.trim() || parts.some(v => !/^-?\d+$/.test(v))) throw new Error('Enter comma-separated whole numbers, for example: 2, 1, 5.')
  if (parts.length > 40) throw new Error('Use 40 array elements or fewer for a readable trace.')
  const values = parts.map(Number)
  if (values.some(v => !Number.isSafeInteger(v))) throw new Error('Every value must be a safe integer.')
  return values
}
