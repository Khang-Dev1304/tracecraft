# TraceCraft ✍️⚡

> **Next-Generation Interactive Algorithm & Modern AI Visualizer**
> A synchronized lockstep trace debugger bringing algorithms and AI internals to life.

---

## ✨ Features

- **Lockstep 3-Pane Debugger:** Synchronized code execution highlighting, dynamic visual stage, and real-time execution diagnostics with variable mutation tracking.
- **Dual Visual Themes:**
  - 🎨 **Sketch Hand-Drawn Mode:** Organic hand-drawn shapes powered by [Rough.js](https://roughjs.com/), graph-paper backgrounds, and Caveat typography.
  - 💎 **Clean Pro Studio Mode:** High-contrast dark blueprint layout (`#090d16`), glowing SVG elements, neon pointer pills, and JetBrains Mono code rendering.
- **Modern AI & Algorithm Modules:**
  - **Modern AI:** Transformer Self-Attention Head (Query/Key causal context window, soft-attention matrix, and Softmax Next-Token Probability distribution).
  - **Algorithms:** Bubble Sort with early termination, Binary Search with $L, M, R$ pointer convergence.
- **Mobile "Story Mode":** Resolves traditional desktop canvas scaling flaws by offering a dedicated vertical swipe/step card view for smartphones.
- **Socratic AI Step-Explainer:** Context-aware breakdowns answering *why* state mutated and providing counterfactual algorithmic analysis.
- **Full Playback Controls:** Play/Pause, single-step navigation, scrubber progress bar, speed toggling ($0.5\times$ to $4\times$), and full keyboard shortcuts (`Space`, `←`, `→`, `Home`, `End`, `R`).

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 18+ / pnpm)

### Development

```bash
# Clone the repository
git clone https://github.com/Khang-Dev1304/tracecraft.git
cd tracecraft

# Install dependencies
bun install

# Start local development server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
bun run build
bun run preview
```

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + PostCSS
- **Visualization:** Rough.js + Dynamic SVG & Canvas
- **Icons:** Lucide React
- **Deployment:** GitHub Pages & GitHub Actions CI/CD

---

## 📄 License

MIT
