# PatternLab

PatternLab is a free, open-source learning platform for coding interview patterns. It teaches by showing real algorithm state as you step through an example. Sliding Window and Two Pointers each have three interactive visualizations.

## Screenshots

Screenshots will be added after the first release. No screenshots are included yet.

## Features

- Trace-driven fixed-size maximum sum, longest unique substring, and minimum-size subarray labs.
- Editable inputs, validation, playback, speed control, keyboard navigation, and step timeline.
- Keyboard shortcuts: Space toggles playback; Left and Right Arrow move between steps. Shortcuts pause while focus is in an input, select, or text area.
- Java reference implementations with stable trace-to-line IDs.
- Two Pointers labs for sorted Two Sum II, Valid Palindrome, and Remove Duplicates from Sorted Array, with direction-aware and same-direction pointer traces.
- Pattern guide, invariant explanations, complexity, learning recap, and curated problem links.
- Responsive dark/light interface and placeholder navigation for future patterns.

## Stack and prerequisites

React, TypeScript strict mode, Vite, CSS, Lucide, Vitest, and React Testing Library. Install Node.js 20+ and pnpm 11.25+.

## Install and run

```sh
pnpm install
pnpm dev
```

## Commands

```sh
pnpm typecheck  # strict TypeScript check
pnpm test       # unit and component tests
pnpm build      # production static build
pnpm lint       # ESLint
```

## Architecture

`src/algorithms/slidingWindow.ts` and `src/algorithms/twoPointers.ts` contain pure algorithms that return results and typed ordered traces. `src/types/trace.ts` defines the Sliding Window trace contract; Two Pointers uses a suitable pattern-specific typed trace. `src/data/examples.ts` registers Sliding Window labs and Java reference code; `src/data/patterns.ts` registers available and coming-soon navigation entries. `src/App.tsx` hosts the shared application shell and preserves the established Sliding Window experience, while `src/TwoPointers.tsx` renders its pattern-specific trace and Java walkthrough inside that shell. Both use trace-driven playback with independent state and cleanup.

### Trace-driven visualizations

Each algorithm performs its actual state transitions and records the resulting variables, indexes, condition, explanation, and stable Java line ID. The presentation only renders a selected recorded step; it does not animate an invented execution. The separate `result` value does not depend on the selected playback step.

### Add a future pattern

1. Register the pattern in `src/data/patterns.ts` and define typed trace and stable result types; keep pattern-specific renderers where the shared trace model is not suitable.
2. Add a pure trace generator and focused tests.
3. Register pattern metadata, examples, code, and problems in data modules.
4. Render its trace through shared playback and shell components, adding only pattern-specific visualization UI.
5. Add the pattern to the registry/sidebar. Keep coming-soon entries explicitly nonfunctional until their generator exists.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Use descriptive types, explain invariants, keep algorithms pure, and run typecheck, tests, and build before opening a pull request.

## Current limitations

- Progress is local to the current session and is not persisted.
- Future pattern links are placeholders.
- Java is reference code; the app does not execute arbitrary Java.
- Unicode indices use code points in the TypeScript visualization and Java code walkthrough.
- The visualizer limits input length to preserve readable traces.
- No screenshots or deployment URL are available yet.

## Roadmap

1. Persist optional local learning progress.
2. Add more tests and visual walkthroughs as each pattern is implemented.

LeetCode® problem names and links refer to their original owners. PatternLab is an independent educational project and is not affiliated with LeetCode.
