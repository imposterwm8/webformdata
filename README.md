  # Repository Guidelines

  ## Project Structure & Module Organization
  The Solid entry point is `src/index.tsx`, which renders `App.tsx` into `index.html`. Group new features inside `src/
  ` using domain folders (for example, `src/forms/`) and collocate their components, hooks, and styles. Shared static
  assets that should be processed by Vite belong in `src/assets/`; files placed in `public/` (favicons, manifest) are
  copied verbatim at build time. Adjust document-level metadata through `index.html`, and update `vite.config.ts` or
  the `tsconfig.*` files only when build behavior must change.

 ## dont start dev servers

  ## Coding Style & Naming Conventions
  TypeScript compilation runs in strict mode; address type errors directly instead of resorting to `any`. Stick to 2-
  space indentation and single quotes in TSX as seen in `src/App.tsx`. Solid components and providers use `PascalCase`
  (`FormWizard.tsx`), signals/helpers use `camelCase`, and CSS class names remain kebab-cased (`.read-the-docs`).
  Import local assets relatively (e.g., `import icon from './assets/icon.svg'`) and favor small, focused components
  over nested JSX blocks.
