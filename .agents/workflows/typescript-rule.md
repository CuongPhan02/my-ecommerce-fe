---
description: Strict TypeScript rules for writing code (FE/BE), ensuring no compile errors and upfront type definitions.
---

# TypeScript Quality & Compilation Rule

When writing, refactoring, or generating code for either the Frontend (React/Vite) or Backend (logic, APIs, etc.), you MUST strictly follow these TypeScript and quality rules.

## Core Rules

1. **Upfront Type Definition (Define Before Code):**
   - Always define types, interfaces, or generic schemas _before_ writing the active logic, components, hooks, or API handlers.
   - Avoid implementing functions with implicit `any` or loose inline typings. Document the data structures first.

2. **Zero TypeScript Errors (Zero Red Lines):**
   - All written code must be 100% compliant with the project's TypeScript configuration.
   - You must never leave code with unresolved TypeScript compile-time errors or warnings (absolutely no "red squiggly lines" or compiler warnings).
   - Perform strict null checks and handle optional chaining (`?.`) or type narrowings (guards) appropriately to avoid runtime/compiler bugs.

3. **No Lazy Types:**
   - Avoid using `any` or `as any` unless absolutely necessary (e.g., mock testing third-party structures with no available typing).
   - If a type is complex, define it explicitly or use standard TypeScript utilities (`Record`, `Omit`, `Pick`, `Partial`, `NonNullable`, etc.).
   - Explicitly declare return types for critical helper functions, custom hooks, and API handlers.

4. **Verify Sourcing and Configuration:**
   - Refer to `tsconfig.json` and `tsconfig.app.json` settings to make sure imports, path aliases (e.g., `@/*`), and compiler options are fully supported.
   - Systematically ensure all imports are valid and that generic constraints match the library documentation.
