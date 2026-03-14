# Fashion E-commerce Admin Dashboard (Frontend)

![Project Screenshot](https://ik.imagekit.io/htnacim0q/media-ak-shop/setting/Screenshot_2.png)

This project is the Frontend interface for a Fashion E-commerce platform, featuring comprehensive administrative capabilities. It is built on the **Next.js 16** (App Router) framework, delivering high performance and a modern user interface.

## 🚀 Tech Stack

The project utilizes cutting-edge technologies within the React ecosystem:

### Core Framework & Language

- **[Next.js 16.1.1](https://nextjs.org/)**: A powerful React framework with App Router for building SSR/SSG applications.
- **[React 19.2.3](https://react.dev/)**: The core UI library using Javascript/Typescript.
- **[TypeScript 5](https://www.typescriptlang.org/)**: Provides type-safety for the codebase, minimizing runtime errors.

### UI & Styling

- **[Tailwind CSS v4](https://tailwindcss.com/)**: A utility-first CSS framework for rapid and modern styling.
- **[Radix UI](https://www.radix-ui.com/)**: Unstyled UI primitives (headless UI) that ensure accessibility.
- **[Lucide React](https://lucide.dev/)** & **[Tabler Icons](https://tabler.io/icons)**: Comprehensive and beautiful icon libraries for the interface.
- **[Next Themes](https://github.com/pacocoursey/next-themes)**: Supports Light/Dark mode toggling.
- **[Framer Motion](https://www.framer.com/motion/)**: A declarative motion and animation library (via the `motion` package).

### State Management & Data Fetching

- **[Zustand 5](https://zustand-demo.pmnd.rs/)**: A small, fast, and scalable bearbones global state-management solution.
- **[TanStack Query (React Query) v5](https://tanstack.com/query/latest)**: Powerful asynchronous state management, server-state fetching, caching, and synchronization.
- **[Nuqs 2](https://nuqs.47ng.com/)**: Type-safe URL state management (keeping state in the URL query string).

### Form & Validation

- **[React Hook Form 7](https://react-hook-form.com/)**: Performant, flexible, and extensible forms with easy-to-use validation.
- **[Zod 4](https://zod.dev/)**: TypeScript-first schema declaration and validation library.

### Other Tools

- **[Axios](https://axios-http.com/)**: Promise-based HTTP client for the browser and node.js to interact with Backend APIs.
- **[Recharts](https://recharts.org/)**: A composable charting library built on React components.
- **[OAuth Google](https://react-oauth.vercel.app/)**: Google Account sign-in integration.

## 📂 Project Structure & Architecture

The project adopts the **Feature-Sliced Design** architecture, a structure commonly used in Next.js applications that makes the codebase more scalable and easier to maintain compared to traditional structures.

```text
ecommerce-fashion-fe/
├── public/                 # Static assets (images, fonts, robots.txt, etc.)
├── src/
│   ├── app/                # Next.js App Router (Routes, pages, layouts)
│   ├── components/         # Shared UI components (Base components: Button, Input, Modal, UI Library...)
│   ├── config/             # System configurations (e.g., axios instances, env variables config)
│   ├── constants/          # Constant definitions, default variables (magic strings, enums).
│   ├── features/           # ★ THE MOST IMPORTANT DIRECTORY: Contains feature-based modules (Auth, Dashboard, Products...)
│   │   └── [feature-name]/     Example: auth
│   │       ├── api/                # API call functions (axios/fetch requests) for this feature
│   │       ├── components/         # UI components specific to this feature
│   │       ├── hooks/              # Custom hooks for feature-specific logic
│   │       └── schemas/            # Zod validation schemas (if applicable)
│   ├── hooks/              # Shared (global) custom React hooks
│   ├── lib/                # Utilities and third-party library wrappers (utils, formatters, twMerge...)
│   ├── mock/               # Mock data for local development without an active API
│   ├── providers/          # React Context Providers (QueryClientProvider, ThemeProvider, GoogleOAuthProvider...)
│   └── store/              # Global state definitions (Zustand stores used across the app)
├── package.json            # Dependencies and npm scripts
├── .env                    # Environment variables
└── tailwind.config.* / postcss.config.* / eslint.config.*
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (Version >= 20.x is recommended)
- npm, yarn, pnpm, or bun.

### Installation

1. Clone the repository:

```bash
git clone <repository_url>
cd ecommerce-fashion-fe
```

2. Install the necessary dependencies (choose one):

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. (Required) Environment Variables Configuration:
   Create a `.env.local` file at the root of the project (same level as `package.json`) and configure it according to the project's requirements (you can copy from a `.env.example` if available, or check the required variables within the project).

### Development Server

After installing the dependencies, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page will auto-update as you edit files (Hot Reloading).

### Production Build

To create an optimized production build and preview it:

```bash
npm run build
npm run start
```

## 📜 Available Scripts

- `npm run dev`: Starts the application in development mode.
- `npm run build`: Builds the app for production (optimizes the output).
- `npm run start`: Starts the production server after a successful build.
- `npm run lint`: Runs ESLint to catch and report errors/warnings based on configured rules.
- `npm run analyze`: Analyzes the build bundle size using Next.js analyzer plugins.

## 🤝 Contribution Guidelines

- Always run `npm run lint` before committing code to ensure there are no ESLint violations.
- Place logic inside the appropriate feature folder (`src/features`) rather than dumping everything into the root directories or generic folders.
- Before creating a new UI component, check `src/components` to see if a reusable component already exists.
