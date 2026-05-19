---
description: Custom project architecture rules specifying directory structure, framework rules, state management, and styling for portfolio App.
---

# Jovee App Architecture & Folder Structure Rules

You must strictly follow the architectural conventions defined below for this project when creating or modifying any codebase.

## 1. Project Technology Stack

- **Core Framework:** React 19, Vite 8, TypeScript 6.
- **Routing:** TanStack Router (`@tanstack/react-router`) with file-based routing.
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with custom transition/animations (`tailwindcss-animate`, `tw-animate-css`).
- **State Management:** Zustand for client state, TanStack Query (`@tanstack/react-query`) for server/cache state.
- **Forms & Validation:** `react-hook-form` + Zod schemas (`zod`).
- **UI Base:** `@base-ui/react` (headless primitives), `lucide-react` (icons), and Framer Motion (`framer-motion`).

## 2. Directory Structure Conventions

Always place files in their correct semantic location inside `src/`:

- **UI Primitives (`src/components/ui/`):**
  - Holds highly reusable, low-level UI elements (e.g., `sheet.tsx`, `select.tsx`, `otp-field.tsx`, `popover.tsx`).
  - Keep them pure, stateless if possible, and highly customizable via props.

- **Shared Components (`src/components/shared/`):**
  - Components or layouts shared across multiple domains/features.

- **Feature-Based Domains (`src/features/[feature-name]/`):**
  - Follow domain-driven feature structures. E.g., `src/features/physical-sim-activation/components/`.
  - All hooks, helper functions, api services, and local stores specific to a feature must reside inside their respective feature folder.

- **File-Based Routing (`src/routes/`):**
  - Handled by TanStack Router. Files here are mapped to public or private routes.
  - Follow TanStack routing conventions (e.g., `_auth.signup.tsx`, `_app.profile/index.tsx`). Do not write heavy rendering logic here; keep routes clean and import page components from `features` or `components`.

- **Global Client State (`src/stores/`):**
  - Global Zustand stores (e.g., authentications, global app preferences).

- **Global Utilities & Styles:**
  - `src/lib/utils.ts`: Place standard helper utilities here. Always import the `cn` function from `@/lib/utils` to merge Tailwind classes safely.
  - `src/styles/`: Contains custom styles and Tailwind directives.

## 3. Styling & Layout Rules

- **Utility-First:** Use Tailwind CSS v4 utility classes.
- **Dynamic Classes:** Always use `cn(...)` from `@/lib/utils` for conditional class joining to prevent styling duplication or override bugs.
- **Typography Scale:** Keep H1-H6 absolute sizing consistent across all screens. Do not use ad-hoc font-sizes.
- **Responsive Layout:**
  - Design mobile-first or ensure responsive safety from 320px up to 4K resolutions.
  - Squeeze margins, padding, and text sizing down aggressively on mobile to prevent content spilling or visual breaking.
  - **Mobile 2-Column Grid Exception:** For less complex cards containing low information (e.g., simple blog items, simple projects, simple lists), **always display them in 2 columns (`grid-cols-2`) on mobile**. Only use 1 column (`grid-cols-1`) for highly complex, multi-interactive cards.
  - **Aggressive Mobile Densification:** When rendering 2-column cards on mobile, optimize screen real estate like a native application: hide unimportant data (subtitles, secondary descriptions, minor badges) and reduce paddings/fonts to the absolute readable minimums to avoid text wrapping.
- **No Line Wrap on Controls:** Action buttons, tabs, menu items, and primary links must strictly use the `whitespace-nowrap` class to stay aligned in a single line.
- **Body Scroll Lock for Overlays:** When any modal, popup, dialog, drawer, or sidebar is active/opened, the main page body background scroll **MUST be disabled** (`document.body.style.overflow = "hidden"`). The scroll lock must be safely restored to the original value when the overlay closes or unmounts.

## 4. Forms and Schema Validation

- Always use `zod` for validating form inputs and API response schemas.
- Integrate validation schemas into `react-hook-form` using `@hookform/resolvers/zod`.

## 5. API Integration & "Grill-Me" Schema Definition Rule

- **Relentless "Grill-Me" Session for API calls:** Before writing or modifying any new API integration, request handling, or data-fetching hooks (e.g. TanStack Query hooks, Axios/Fetch calls), you **MUST initiate a strict "grill-me" session** with the user.
- **Detailed Response Field Mapping:** Relentlessly interview/ask the user to provide the exact JSON structure of the API response, detailing each field, its exact type, and whether it can be null or optional.
- **Strict Data Consistency:** This upfront grill-me session ensures that TypeScript models, Zod validation schemas, and mock data types match the backend exactly.
- **Meticulous Refactoring & Audit of Mock Data:** If you build the UI first using mock/placeholder data, the second the API definition becomes available, you **MUST meticulously cross-reference, audit, and refactor the entire UI data structure** against the exact API schema to guarantee no discrepancies, type leaks, or unhandled data states.

## 6. React Performance, Rendering & Re-render Prevention

- **Prevent Redundant Re-renders:** When writing or editing any component (especially those involving API logic, data mutations, creates, updates, state changes, or list rendering), you **MUST proactively audit its rendering lifecycle**.
- **Infinite Loop Prevention:** Never allow code that triggers infinite rendering loops (e.g., modifying state inside a `useEffect` that depends on that same state or on unstable reference dependencies).
- **Stabilize References (`useCallback` / `useMemo`):**
  - Wrap callback handlers in `useCallback` if they are passed as props to memoized child components or used in `useEffect` dependency arrays.
  - Wrap heavy computations or unstable array/object definitions inside `useMemo`.
  - Move static configuration arrays, schemas, or default states outside the component completely.
  - Ensure all `useEffect` dependency arrays are strictly accurate and minimal.
- **Server State Optimization:** Fully leverage TanStack Query's caching, selector patterns (`select`), and built-in loading/fetching flags rather than manually mapping fetch states to local React states.
- **Derived State Over Duplicate State:** Never sync props to state or duplicate state variables. Always compute derived values on-the-fly during render.
- **Audit Requirement:** Do not write code that "just works" but is unoptimized. Every component logic must be analyzed for performance and reference stability.
