## Memory Games - Reflex & Memory Arcade

**Memory Games** is a collection of small cognitive mini‑games built with Next.js and React to test your reflexes, working memory, and cognitive flexibility. The landing page lets you choose between three different challenges, each with its own mechanics, visuals, and keyboard controls.

### Games Included

- **Simon Says – Fast Reflex Mode**
  - Classic _Simon Says_ with a twist: you must react quickly and correctly.
  - The instructor either says **"Simon says \<action\>"** or just **"\<action\>"**.
  - **Goal**:  
    - If the phrase includes _"Simon says"_, choose the **same** action.  
    - If it does **not** include "Simon says", choose a **different** action.
  - **Actions**: `Jump`, `Clap`, `Touch Head`, `Turn Around`.
  - **Keyboard controls**:
    - `1` → Jump  
    - `2` → Clap  
    - `3` → Touch Head  
    - `4` → Turn Around
  - Reaction time gets shorter as your score increases. A progress bar shows how much time you have left.
  - High score is stored in `localStorage` under `simonSaysHighScore`.

- **Color Touching Sequence – Memory Game**
  - A color sequence memory game similar to _Simon_.
  - The game flashes a sequence of colors; you must reproduce it in the same order.
  - Each round adds one new random color to the sequence and may increase playback speed after higher rounds.
  - **Keyboard controls** (mapped to the four color pads):
    - `Q`, `W`, `A`, `S`
  - Best round reached is stored in `localStorage` under `colorGameBestScore`.

- **Signal Override – Cognitive Reflex Test**
  - A high‑speed cognitive challenge combining symbols, colors, and dynamic instructions.
  - Multiple shapes (circle, triangle, square, diamond, star) are rendered in different colors.
  - The question text can specify:
    - Only a color (e.g. “CLICK THE RED SYMBOL”),  
    - Only a shape (e.g. “CLICK THE TRIANGLE”),  
    - Both (e.g. “CLICK THE BLUE STAR”), or  
    - An **OR** condition (e.g. “CLICK RED OR GREEN”, “CLICK CIRCLE OR STAR”).
  - You must click the option that satisfies the current rule before the timer runs out.
  - Time limits shrink as your score increases (beginner → elite levels).
  - Best score is stored in `localStorage` under `signalOverrideBestScore`.

### Tech Stack

- **Framework**: Next.js (`app` router)
- **Language**: TypeScript
- **UI**:
  - Tailwind CSS (with `tailwindcss-animate` and `tw-animate-css`)
  - Radix UI primitives and custom UI components under `components/ui`
  - `lucide-react` icons
- **State & Forms**: React hooks, `react-hook-form` (available in the project)
- **Analytics**: `@vercel/analytics` integrated in the root layout

### Project Structure (High Level)

- `app/layout.tsx` – Root layout, global fonts, metadata, and Vercel Analytics.
- `app/page.tsx` – Home page (Reflex & Memory Arcade) listing the three games and linking to `/game/[gameId]`.
- `app/game/[gameId]/page.tsx` – Dynamic game page:
  - `gameId = "simon-says"`: Simon Says fast reflex game.
  - `gameId = "color-game"`: Color Memory Game (`ColorGameContainer`).
  - `gameId = "signal-override"`: Signal Override (`SignalGameContainer`).
- `components/` – Game UIs and shared UI:
  - `GameBoard`, `ControlPanel`, `ScoreBoard`, `InstructionModal` for Simon Says.
  - `ColorGame/*` for the Color Memory Game.
  - `SignalOverride/*` for the Signal Override game.
- `utils/colorGameLogic.ts` – Shared helpers for color game (color constants and sequence playback helper).

### Getting Started

#### Prerequisites

- **Node.js** (recommend LTS, e.g. 20+)
- A package manager: **npm**, **pnpm**, or **yarn**  
  (The repo includes both `package-lock.json` and `pnpm-lock.yaml`; use the manager that matches how you installed dependencies.)

#### Installation

```bash
# Using npm
npm install

# or with pnpm
pnpm install
```

#### Running the Development Server

```bash
# Using npm
npm run dev

# or with pnpm
pnpm dev
```

Then open `http://localhost:3000` in your browser. You will see the **Reflex & Memory Arcade** home page where you can select any game card to start playing.

#### Building for Production

```bash
# Build
npm run build

# Start production server
npm start
```

Adjust the commands if you use `pnpm` or `yarn`.

### Gameplay Tips

- **Simon Says**
  - Wait for the instruction to fully appear before reacting.
  - Remember: no “Simon says” means choose a **different** action.
  - Watch the reaction bar; it shrinks faster as your score grows.

- **Color Memory Game**
  - Focus on rhythm as much as color — the pattern often feels like a tune.
  - Use the keyboard (`Q`, `W`, `A`, `S`) if you find it easier than clicking.

- **Signal Override**
  - First parse whether the instruction is about **color**, **shape**, or **both**.
  - For **OR** questions, any option that satisfies either condition is valid.
  - Don’t overthink; fast pattern recognition is rewarded as the timer shrinks.

### Customization & Extensibility

- You can add more games by:
  - Adding a new entry to the `games` array in `app/page.tsx`.
  - Handling the new `gameId` inside `app/game/[gameId]/page.tsx` and rendering a new container component.
- The shared UI library under `components/ui` (buttons, dialogs, cards, etc.) makes it easy to keep any new mini‑game visually consistent.

### License

This project is currently **proprietary / personal** (no explicit OSS license file). If you plan to publish or reuse it, consider adding a license (e.g. MIT) that fits your needs.


