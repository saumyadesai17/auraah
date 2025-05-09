# Aura - Discover Your Connection

Aura is a mobile-first web application designed for exploring and discovering "auras" associated with various people, places, and brands. It offers an interactive and engaging way to find connections with different entities. Built with Next.js and TypeScript, Aura provides a modern and responsive user experience.

## Features

*   **Explore Tab (`/explore`)**:
    *   Interactive, swipeable cards (Tinder-style) for discovering auras.
    *   Each card displays an aura's visual representation, name, and a brief description.
    *   Users can swipe right to "like" or left to "dislike" an aura.
    *   Functionality to reset the card stack once all auras have been viewed.
*   **Discover Tab (`/discover`)**:
    *   Tag-based navigation system to browse auras by categories: People (real and fictional), Places (real and fictional), and Brands.
    *   Dynamic routing to detailed aura pages (e.g., `/discover/tagId`).
    *   Each aura detail page showcases the specific aura and a horizontally scrollable list of similar tags.
    *   Seamless navigation between similar auras within the single-page application.
    *   Breadcrumb navigation to keep track of the discovery path.
*   **Interests Tab (`/interests`)**:
    *   A "Coming Soon" page, indicating future development for personalized interest discovery.
*   **General**:
    *   Mobile-first responsive design.
    *   Built with Next.js App Router for optimized routing and server components.
    *   Type-safe codebase with TypeScript.
    *   Smooth animations and transitions using Framer Motion.
    *   Styled with Tailwind CSS for a utility-first approach.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (using App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)

## Folder Structure

A brief overview of the key directories:

```
.
├── public/              # Static assets (images, SVGs)
├── src/
│   ├── app/             # Next.js App Router (pages, layouts)
│   │   ├── (tabs)/      # Route groups for main tabs (explore, discover, interests)
│   │   └── globals.css  # Global styles
│   ├── components/      # Reusable React components
│   │   ├── discover/    # Components specific to the Discover tab
│   │   ├── explore/     # Components specific to the Explore tab
│   │   └── navigation/  # Navigation components (e.g., BottomTabBar)
│   └── lib/             # Utility functions and data (e.g., mockAuras, data fetching)
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/vibe-caarya/aura.git
    cd aura
    ```
2.  Install NPM packages:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

## Development Commands

*   **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

*   **Build for production:**
    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    ```

*   **Start the production server:**
    ```bash
    npm run start
    # or
    yarn start
    # or
    pnpm start
    ```

*   **Lint the project:**
    ```bash
    npm run lint
    # or
    yarn lint
    # or
    pnpm lint
    ```

---

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).