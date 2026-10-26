# Contributing to PatternLab

Thanks for helping make interview patterns easier to understand.

## Development

1. Install Node.js 20+ and pnpm 11.25+, then run `pnpm install`.
2. Start with `pnpm dev`.
3. Before submitting, run `pnpm typecheck`, `pnpm test`, and `pnpm build`.

## Guidelines

- Keep algorithm generators pure and represent only real state transitions.
- Separate stable results from the selected playback step.
- Include validation for assumptions required by an algorithm.
- Give trace events stable IDs that map to Java lines.
- Test default results, edge cases, invalid inputs, and trace invariants.
- Use semantic HTML, keyboard focus, and responsive layouts.
- Keep unsupported future patterns marked as coming soon.

Open a pull request with a short summary, the checks you ran, and screenshots for visible UI changes when available.
