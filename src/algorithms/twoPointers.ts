export type TwoPointerExample = 'two-sum' | 'palindrome' | 'deduplicate'
export type TwoPointerStep = {
  stepIndex: number; phase: string; left: number; right: number; activeCodeLine: string
  explanation: string; condition: string; kind: TwoPointerExample
  values?: number[]; chars?: string[]; sum?: number; target?: number; comparison?: string
  slow?: number; fast?: number; prefix?: number[]; result?: number[] | boolean | number
  skipped?: number[]; written?: number
}
export type TwoPointerRun = { steps: TwoPointerStep[]; result: number[] | boolean | { count: number; prefix: number[] } }
const limit = 40
function record(steps: TwoPointerStep[], step: Omit<TwoPointerStep, 'stepIndex'>) { steps.push({ ...step, stepIndex: steps.length }) }
function checkArray(values: readonly number[], allowEmpty = false) {
  if ((!allowEmpty && values.length === 0) || values.length > limit || values.some(v => !Number.isSafeInteger(v))) throw new Error(`Enter ${allowEmpty ? 'up to' : '1–'}${limit} safe integer values.`)
}
function sorted(values: readonly number[]) { checkArray(values); if (values.some((v, i) => i > 0 && values[i - 1]! > v)) throw new Error('Array must be sorted in non-decreasing order.') }

export function twoSumSorted(values: readonly number[], target: number): TwoPointerRun {
  sorted(values); if (!Number.isSafeInteger(target)) throw new Error('Target must be a safe integer.')
  const steps: TwoPointerStep[] = []; let left = 0, right = values.length - 1
  record(steps, { kind:'two-sum', phase:'initialize', left,right,values:[...values],target,activeCodeLine:'init',explanation:'Start at opposite ends. Sorted order lets the sum tell us which pointer can safely move.',condition:'Maintain left < right; discarded pairs cannot be solutions.' })
  while (left < right) {
    const sum = values[left]! + values[right]!
    if (!Number.isSafeInteger(sum)) throw new Error('Pair sum exceeds safe integer precision.')
    if (sum === target) { const result = [left + 1, right + 1]; record(steps,{kind:'two-sum',phase:'found',left,right,values:[...values],sum,target,result,activeCodeLine:'found',explanation:`${values[left]} + ${values[right]} = ${target}; return the 1-based positions ${result.join(' and ')}.`,condition:`${sum} === ${target}`}); return {steps,result} }
    const moveLeft = sum < target
    record(steps,{kind:'two-sum',phase:moveLeft?'move-left':'move-right',left,right,values:[...values],sum,target,comparison:`${sum} ${moveLeft?'<':'>'} ${target}`,activeCodeLine:moveLeft?'increase-left':'decrease-right',explanation:moveLeft?`The sum is too small. Keeping the left value and moving right only lowers or preserves it, so advance left to increase the sum.`:`The sum is too large. Keeping the right value and moving left only raises or preserves it, so decrease right.`,condition:`${sum} ${moveLeft?'<':'>'} ${target}; move ${moveLeft?'left':'right'}.`})
    if (moveLeft) left++; else right--
  }
  throw new Error('No matching pair exists. Enter an array and target with exactly one solution.')
}

// Unicode code points plus ECMAScript Unicode alphanumeric categories; Java uses the matching Character.isLetterOrDigit code-point API.
const alphaNumeric = (char: string) => /[\p{L}\p{N}]/u.test(char)
export function validPalindrome(input: string): TwoPointerRun {
  const chars = Array.from(input); if (chars.length > 160) throw new Error('Use 160 Unicode code points or fewer.')
  const steps: TwoPointerStep[] = []; let left = 0, right = chars.length - 1
  const base = {kind:'palindrome' as const,chars}
  record(steps,{...base,phase:'initialize',left,right,activeCodeLine:'init',explanation:'Scan the original Unicode code points from both ends; punctuation is skipped in place.',condition:'Only Unicode letters and numbers participate in comparisons.'})
  while (left < right) {
    if (!alphaNumeric(chars[left]!)) { record(steps,{...base,phase:'skip-left',left,right,skipped:[left],activeCodeLine:'skip-left',explanation:`“${chars[left]}” is not a Unicode letter or number, so advance the left pointer.`,condition:`isLetterOrDigit(left) is false.`}); left++; continue }
    if (!alphaNumeric(chars[right]!)) { record(steps,{...base,phase:'skip-right',left,right,skipped:[right],activeCodeLine:'skip-right',explanation:`“${chars[right]}” is not a Unicode letter or number, so move the right pointer inward.`,condition:`isLetterOrDigit(right) is false.`}); right--; continue }
    const a=chars[left]!.toLocaleLowerCase('und'), b=chars[right]!.toLocaleLowerCase('und'), match=a===b
    record(steps,{...base,phase:match?'match':'mismatch',left,right,comparison:`${a} ${match?'=':'≠'} ${b}`,result:match,activeCodeLine:match?'match':'mismatch',explanation:match?`The normalized code points match; move both pointers toward the center.`:`${chars[left]} and ${chars[right]} differ after case normalization, so this is not a palindrome.`,condition:`normalize(left) ${match?'===':'!=='} normalize(right).`})
    if (!match) return {steps,result:false}; left++; right--
  }
  record(steps,{...base,phase:'complete',left,right,result:true,activeCodeLine:'finish',explanation:'The pointers met without a mismatch. The string is a palindrome under the documented normalization.',condition:'All mirrored alphanumeric code points matched.'})
  return {steps,result:true}
}

export function removeDuplicatesSorted(values: readonly number[]): TwoPointerRun {
  checkArray(values,true); if (values.some((v,i)=>i>0&&values[i-1]!>v)) throw new Error('Array must be sorted in non-decreasing order.')
  const arr=[...values], steps:TwoPointerStep[]=[]
  if (!arr.length) { record(steps,{kind:'deduplicate',phase:'complete',left:-1,right:-1,slow:-1,fast:0,values:arr,prefix:[],result:0,activeCodeLine:'finish',explanation:'The empty array has zero unique values.',condition:'No elements to scan.'}); return {steps,result:{count:0,prefix:[]}} }
  let slow=0
  record(steps,{kind:'deduplicate',phase:'initialize',left:slow,right:1,slow,fast:1,values:[...arr],prefix:[arr[0]!],activeCodeLine:'init',explanation:'The slow pointer marks the final unique value; fast scans the unread suffix.',condition:'Prefix through slow contains exactly the unique values seen so far.'})
  for(let fast=1;fast<arr.length;fast++) {
    if(arr[fast]===arr[slow]) { record(steps,{kind:'deduplicate',phase:'duplicate',left:slow,right:fast,slow,fast,values:[...arr],prefix:arr.slice(0,slow+1),activeCodeLine:'duplicate',explanation:`${arr[fast]} equals the last unique value, so skip this duplicate.`,condition:`nums[fast] === nums[slow].`}); continue }
    slow++; arr[slow]=arr[fast]!; record(steps,{kind:'deduplicate',phase:'write',left:slow,right:fast,slow,fast,values:[...arr],prefix:arr.slice(0,slow+1),written:slow,activeCodeLine:'write',explanation:`${arr[fast]} is new. Advance slow and write it into the unique prefix.`,condition:`nums[fast] !== nums[slow − 1]; extend the prefix by one.`})
  }
  const prefix=arr.slice(0,slow+1); record(steps,{kind:'deduplicate',phase:'complete',left:slow,right:arr.length,slow,fast:arr.length,values:[...arr],prefix,result:slow+1,activeCodeLine:'finish',explanation:`Finished with ${slow+1} unique values in the prefix.`,condition:'Every input element was scanned once; prefix length is slow + 1.'})
  return {steps,result:{count:slow+1,prefix}}
}

export function parseTwoPointerArray(raw:string, allowEmpty=false):number[] {
 if(!raw.trim()&&allowEmpty)return []
 const parts=raw.split(',').map(x=>x.trim()); if(parts.some(x=>!/^[-+]?\d+$/.test(x)))throw new Error('Enter comma-separated whole numbers.')
 const values=parts.map(Number); checkArray(values,allowEmpty); return values
}
