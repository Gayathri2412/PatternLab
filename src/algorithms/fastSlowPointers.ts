export type FastSlowExample = 'cycle' | 'middle' | 'happy'
export type FastSlowStep = {
  stepIndex:number; kind:FastSlowExample; phase:string; slow:number|null; fast:number|null
  values?:number[]; next?:Array<number|null>; cycleEntry?:number|null
  sequence?:number[]
  calculation?:string; transition?:string; explanation:string; condition:string
  activeCodeLine:string; result?:boolean|number|null
}
export type FastSlowRun={steps:FastSlowStep[];result:boolean|number|null}
const MAX_NODES=24
function add(steps:FastSlowStep[],step:Omit<FastSlowStep,'stepIndex'>){steps.push({...step,stepIndex:steps.length})}
function validateValues(values:readonly number[],allowEmpty=false){if((!allowEmpty&&!values.length)||values.length>MAX_NODES||values.some(v=>!Number.isSafeInteger(v)))throw new Error(`Enter ${allowEmpty?'up to':'1 to'} ${MAX_NODES} safe integer node values.`)}
export function parseFastSlowArray(raw:string,allowEmpty=false):number[]{if(!raw.trim()&&allowEmpty)return [];const parts=raw.split(',').map(x=>x.trim());if(parts.some(x=>!/^[-+]?\d+$/.test(x)))throw new Error('Enter comma-separated whole numbers.');const values=parts.map(Number);validateValues(values,allowEmpty);return values}
function links(n:number,entry:number|null){return Array.from({length:n},(_,i)=>i===n-1?entry:i+1)}
function next(index:number|null,edges:readonly (number|null)[]){return index===null?null:edges[index]??null}
function nodeState(kind:'cycle'|'middle',values:readonly number[],edges:readonly (number|null)[],slow:number|null,fast:number|null,phase:string,explanation:string,condition:string,activeCodeLine:string,extra:Partial<FastSlowStep>={}):Omit<FastSlowStep,'stepIndex'>{return {kind,values:[...values],next:[...edges],cycleEntry:kind==='cycle'&&edges.length?edges[edges.length-1]??null:null,slow,fast,phase,explanation,condition,activeCodeLine,...extra}}
export function detectLinkedListCycle(values:readonly number[],cycleEntry:number|null):FastSlowRun{
 validateValues(values,true);if(values.length===0){if(cycleEntry!==null)throw new Error('An empty list cannot have a cycle destination.')}else if(cycleEntry!==null&&(!Number.isInteger(cycleEntry)||cycleEntry<0||cycleEntry>=values.length))throw new Error(`Cycle destination must be an index from 0 to ${values.length-1}, or none.`)
 const edges=links(values.length,cycleEntry),steps:FastSlowStep[]=[];let slow:number|null=values.length?0:null,fast=slow
 add(steps,nodeState('cycle',values,edges,slow,fast,'initialize','Both pointers start at the head. Node identity is its index; equal values do not make two nodes the same.','slow = head; fast = head.','init'))
 while(fast!==null&&next(fast,edges)!==null){const oldSlow=slow,oldFast=fast;slow=next(slow,edges);fast=next(next(fast,edges),edges);add(steps,nodeState('cycle',values,edges,slow,fast,'advance',`Slow moves one link (${oldSlow===null?'null':`#${oldSlow}`} → ${slow===null?'null':`#${slow}`}); fast moves two links (${oldFast===null?'null':`#${oldFast}`} → ${fast===null?'null':`#${fast}`}).`, 'Advance only while fast and fast.next both exist.','advance',{transition:`slow: ${oldSlow}→${slow}; fast: ${oldFast}→${fast}`}))
  if(slow!==null&&slow===fast){add(steps,nodeState('cycle',values,edges,slow,fast,'meet',`Both references identify node #${slow}. In a finite cycle, each fast pointer lap gains one node relative to slow, so they must meet.`,`slow === fast (${slow}).`,'found',{result:true}));return {steps,result:true}}
 }
 add(steps,nodeState('cycle',values,edges,slow,fast,'complete','Fast reached the end (or there was no head), so the list has no cycle.','fast == null || fast.next == null.','finish',{result:false}));return {steps,result:false}
}
export function findListMiddle(values:readonly number[]):FastSlowRun{
 validateValues(values,true);const edges=links(values.length,null),steps:FastSlowStep[]=[];let slow:number|null=values.length?0:null,fast=slow
 add(steps,nodeState('middle',values,edges,slow,fast,'initialize','Start both references at the head. The fast pointer will move twice per slow-pointer move.','slow = head; fast = head.','init'))
 while(fast!==null&&next(fast,edges)!==null){const oldSlow=slow,oldFast=fast;slow=next(slow,edges);fast=next(next(fast,edges),edges);add(steps,nodeState('middle',values,edges,slow,fast,'advance',`Slow advances one link (${oldSlow} → ${slow}); fast advances two (${oldFast} → ${fast}).`,'fast != null && fast.next != null.','advance',{transition:`slow: ${oldSlow}→${slow}; fast: ${oldFast}→${fast}`}))}
 add(steps,nodeState('middle',values,edges,slow,fast,'complete',slow===null?'The list is empty, so there is no middle node.':`Fast reached the end; slow is at the middle node #${slow} (value ${values[slow]}). For even length, this is the second middle.`, 'Stop when fast or fast.next is null.','finish',{result:slow===null?null:values[slow]}));return {steps,result:slow===null?null:values[slow]!}
}
export function digitSquareSum(n:number):number{let total=0;for(const digit of String(n))total+=Number(digit)**2;return total}
function sumDetail(n:number){return `${Array.from(String(n),digit=>`${digit}²`).join(' + ')} = ${digitSquareSum(n)}`}
export function isHappyNumber(start:number):FastSlowRun{
 if(!Number.isSafeInteger(start)||start<1||start>1_000_000_000)throw new Error('Enter a positive whole number from 1 to 1,000,000,000.')
 const steps:FastSlowStep[]=[];let slow=start,fast=start;const sequence=[start]
 add(steps,{kind:'happy',phase:'initialize',slow,fast,sequence:[...sequence],calculation:`F(${start}) = ${sumDetail(start)}`,explanation:'Both runners start at the same number. Each link in this implicit state graph is one digit-square-sum transformation.',condition:'F(n) is the sum of the squares of n’s digits.',activeCodeLine:'init'})
 while(true){const oldSlow=slow,oldFast=fast,slowNext=digitSquareSum(slow),fastMid=digitSquareSum(fast),fastNext=digitSquareSum(fastMid);slow=slowNext;fast=fastNext
  sequence.push(fastMid,fastNext)
  add(steps,{kind:'happy',phase:'advance',slow,fast,sequence:[...sequence],calculation:`slow: F(${oldSlow}) = ${sumDetail(oldSlow)}; fast: ${oldFast} → ${fastMid} → ${fastNext} (${sumDetail(oldFast)}, then ${sumDetail(fastMid)})`,transition:`slow: ${oldSlow}→${slow}; fast: ${oldFast}→${fastMid}→${fast}`,explanation:'Advance slow by one transformation and fast by two. The trace records each actual digit-square-sum result.',condition:'slow = F(slow); fast = F(F(fast)).',activeCodeLine:'advance'})
  if(slow===1||fast===1){add(steps,{kind:'happy',phase:'happy',slow,fast,sequence:[...sequence],calculation:'A runner reached 1.',explanation:'The sequence reaches 1, which stays at 1 under the transformation. The number is happy.',condition:'slow == 1 || fast == 1.',activeCodeLine:'found',result:true});return {steps,result:true}}
  if(slow===fast){add(steps,{kind:'happy',phase:'cycle',slow,fast,sequence:[...sequence],calculation:`Both runners meet at repeated state ${slow}.`,explanation:'The runners meet at a repeated state other than 1, proving the transformations entered a cycle.',condition:'slow == fast and neither is 1.',activeCodeLine:'cycle',result:false});return {steps,result:false}}
 }
}
