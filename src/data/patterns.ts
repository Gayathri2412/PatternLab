export type PatternRegistration = { id: string; number: string; title: string; status: 'available' | 'coming-soon' }

export const patternRegistry: PatternRegistration[] = [
  { id: 'sliding-window', number: '01', title: 'Sliding Window', status: 'available' },
  { id: 'two-pointers', number: '02', title: 'Two Pointers', status: 'available' },
  { id: 'fast-slow-pointers', number: '03', title: 'Fast & Slow Pointers', status: 'available' },
  { id: 'merge-intervals', number: '04', title: 'Merge Intervals', status: 'coming-soon' },
  { id: 'cyclic-sort', number: '05', title: 'Cyclic Sort', status: 'coming-soon' },
  { id: 'in-place-reversal', number: '06', title: 'In-place Reversal', status: 'coming-soon' },
  { id: 'tree-bfs', number: '07', title: 'Tree BFS', status: 'coming-soon' },
  { id: 'tree-dfs', number: '08', title: 'Tree DFS', status: 'coming-soon' },
  { id: 'two-heaps', number: '09', title: 'Two Heaps', status: 'coming-soon' },
  { id: 'subsets', number: '10', title: 'Subsets', status: 'coming-soon' },
  { id: 'modified-binary-search', number: '11', title: 'Modified Binary Search', status: 'coming-soon' },
  { id: 'top-k-elements', number: '12', title: 'Top K Elements', status: 'coming-soon' },
  { id: 'k-way-merge', number: '13', title: 'K-way Merge', status: 'coming-soon' },
  { id: 'backtracking', number: '14', title: 'Backtracking', status: 'coming-soon' }
]
