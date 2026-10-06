# Decido
 
**Decido - Spin to Decide**  
A focused decision-making studio and anti-procrastination engine built for people who overthink their tasks.

---

### The Problem

Decision fatigue kills momentum. You sit down with a to-do list, spend 20 minutes debating whether to fix a bug, reply to pending emails, or start a new feature, and end up opening Twitter instead.

Decido removes the friction of choosing. Put in your tasks, spin the wheel (or flip a coin for binary calls), and let the engine make the call. Once a choice is picked, Decido locks you directly into a focused Pomodoro sprint so you execute immediately without second-guessing.

---

### Key Modules

- **Decision Wheel Studio (`/spin`)**
  - High-performance HTML5 Canvas wheel with custom slice calculations, color palettes, and realistic deceleration inertia.
  - Dynamic option management: add, remove, weighted probabilities, and custom label presets (Dev Sprint, Deep Study, Quick Wins).
  - **Voice-Guided Pomodoro Sprints**: Direct handoff from wheel selection into 25m or 50m deep work blocks.
  - **Interactive Voice Coach**: Natural vocal cues (Female / Male voice synthesis or Mute mode) announcing session kickoffs, break reminders, resume cues, and completion celebrations.
  - Procedural chime harmonies synthesized via Web Audio API alongside speech prompts.

- **3D Coin Flip Engine (`/flip`)**
  - CSS 3D transform coin with dynamic rotation physics and lighting.
  - Procedural sound synthesis using the native Web Audio API (air whoosh, wobble, and tactile table landing thud—no heavy MP3 files to download).
  - Recent flips roll history with session counters and clear controls.

- **Focus Analytics & Badges (`/dashboard`)**
  - Real-time Pomodoro time accounting: logs actual elapsed seconds and hours spent in focus sessions rather than arbitrary completion clicks.
  - Milestone unlock system that tracks focus streaks, coin flips, and wheel spins.
  - 100% client-side privacy: all data stays inside your browser's `localStorage` with zero trackers.

- **Design & SEO Architecture**
  - Dark mode first (`#030712` / `#05070f`) with glassmorphic cards and crisp slate accents.
  - Comprehensive metadata and OpenGraph configuration for high search discoverability.
  - Modern typography and clean Lucide iconography throughout (no generic emojis).
  - Micro-interactions designed to feel responsive and tactile.

---

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4 + Vanilla CSS custom animations
- **Icons**: Lucide React
- **Audio & Speech**: Synthesized Web Audio API oscillators and native Web Speech API (`speechSynthesis`)
- **Animations & Effects**: Canvas Confetti, HTML5 Canvas 2D

---

### Getting Started

#### Prerequisites
- Node.js 18.18+ or later
- npm, pnpm, or yarn

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SagarNow/Decido.git
   cd Decido
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Project Structure

```
Decido/
├── src/
│   ├── app/
│   │   ├── about/          # Project backstory and methodology
│   │   ├── dashboard/      # Focus stats, timers, and milestone badges
│   │   ├── flip/           # 3D coin flip simulator
│   │   ├── spin/           # Decision wheel studio and Pomodoro runner
│   │   ├── layout.js       # Root layout, fonts, and global metadata
│   │   └── page.js         # Interactive homepage and feature showcase
│   ├── Components/
│   │   ├── Footer.jsx      # Navigation footer
│   │   ├── Main.jsx        # Landing hero and interactive preview modules
│   │   ├── Navbar.jsx      # Sticky glass navbar
│   │   ├── SpinWheel.jsx   # Canvas-based wheel physics engine
│   │   └── SpinlyLogo.jsx  # Procedural vector spinner mark
│   └── utils/
│       ├── audio.js        # Web Audio API sound synthesis engine
│       └── dashboardStore.js # LocalStorage state management and stats
├── public/                 # Static assets, favicon, and brand icons
└── package.json
```

---

### Author

Built by **Sagar**  
- GitHub: [@SagarNow](https://github.com/SagarNow)  
- LinkedIn: [Sagar Singh](https://www.linkedin.com/in/mrsagarsingh)

---

### License

This project is open-source and available under the [MIT License](LICENSE).
