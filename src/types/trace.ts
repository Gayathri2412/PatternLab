export type ExampleId = 'max-sum' | 'longest-substring' | 'min-subarray'
export type LineId = 'init' | 'seed' | 'expand' | 'duplicate' | 'shrink' | 'update' | 'finish'
export type TraceStep = {
  stepIndex: number; phase: 'initialize' | 'expand' | 'shrink' | 'complete'
  left: number; right: number; currentSum?: number; bestValue?: number
  enteringIndex?: number | null; leavingIndex?: number | null
  activeCodeLine: LineId; explanation: string; condition: string
  windowText?: string; seen?: Array<[string, number]>; found?: boolean
}
export type AlgorithmResult = { value: number; start: number; end: number; slice: number[]; text?: string }
export type AlgorithmRun = { steps: TraceStep[]; result: AlgorithmResult }
export type ExampleDefinition = { id: ExampleId; title: string; short: string; complexity: string; space: string; java: string; supported: boolean }
