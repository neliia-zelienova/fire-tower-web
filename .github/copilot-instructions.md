# 🧠 Project Context

This project is a **Next.js web app** that replicates the **board game Fire Tower**.  
It uses:

- **Next.js** (React + TypeScript)
- **Prisma** for database access
- **WebSockets** for real-time multiplayer synchronization

The goal is to provide an online version of the Fire Tower board game with live multiplayer interactions, persistent game state, and an intuitive, visually appealing interface.

---

# 🎯 Copilot’s Responsibilities

## 1. Code Improvement

- Suggest cleaner, more idiomatic **TypeScript** and **React** patterns.
- Refactor repetitive or overly complex code.
- Identify potential bugs, race conditions, or performance bottlenecks (especially around WebSocket logic and Prisma queries).
- Optimize rendering and state management for multiplayer updates.

## 2. Design & UI Enhancement

- Proactively propose **better UI or UX approaches** when current design could be improved (e.g., layout, animations, accessibility, clarity).
- Use **modern UI best practices**: clean, minimal, game-themed but functional interface.
- Suggest **color palette**, **component structure**, or **animation tweaks** if they improve player experience.
- Keep design consistent with the **Fire Tower** aesthetic (nature + fire theme, strategic board feel).

## 3. Architecture Awareness

- Respect **Next.js conventions**: server/client components, routing, and API routes.
- Follow **Prisma best practices** (e.g., efficient queries, correct use of relations, type-safe models).
- Ensure **WebSocket logic** (state sync, room management, and event handling) is clean, modular, and scalable.

## 4. Documentation & Comments

- Add or improve inline comments when the code’s intent isn’t clear.
- Generate meaningful docstrings for exported functions or modules.

---

# 💡 Style Preferences

- Clean, readable code (focus on clarity over cleverness).
- Consistent formatting (**Prettier**-style).
- TypeScript **strict mode** respected.
- Functional **React components with hooks**.
- Use **Tailwind CSS** or **CSS Modules** for styling (confirm if unsure).
- Prefer **composable UI patterns** (custom hooks, reusable components).

---

# 🧩 Example Prompts Copilot Should Understand

> “Add WebSocket event handling for player turns.”  
> “Improve this component’s layout to look more like a game board.”  
> “Refactor this Prisma query to reduce round trips.”  
> “Add hover animation and visual feedback when a tile is selected.”  
> “Suggest a better way to display the turn order visually.”

---

# ✅ Key Goals for Copilot

- Keep gameplay smooth and responsive in real-time.
- Maintain a visually appealing, thematic interface.
- Help improve both **code quality** and **design quality** proactively.
