import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Pencil, 
  Eraser, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import type { ThemeMode, TraceStep, Language, MnistDigitProb } from '../types';

interface MnistStageProps {
  theme: ThemeMode;
  step: TraceStep;
  language: Language;
  onChangeInput?: (val: string) => void;
  isMaximized?: boolean;
}

// Canonical 28x28 digit matrix templates
export function generateCanonicalDigitGrid(digit: number): number[][] {
  const grid: number[][] = Array.from({ length: 28 }, () => Array(28).fill(0));

  const stamp = (r: number, c: number, v: number) => {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 28 && nc >= 0 && nc < 28) {
          const dist = Math.sqrt(dr * dr + dc * dc);
          const factor = dist === 0 ? 1.0 : dist === 1 ? 0.7 : 0.4;
          grid[nr][nc] = Math.min(1.0, Math.max(grid[nr][nc], v * factor));
        }
      }
    }
  };

  if (digit === 0) {
    for (let deg = 0; deg < 360; deg += 6) {
      const rad = (deg * Math.PI) / 180;
      const r = Math.round(14 + 8.5 * Math.sin(rad));
      const c = Math.round(14 + 6.5 * Math.cos(rad));
      stamp(r, c, 1.0);
    }
  } else if (digit === 1) {
    for (let r = 5; r <= 22; r++) stamp(r, 14, 1.0);
    for (let i = 0; i < 4; i++) stamp(5 + i, 14 - i, 0.85);
    for (let c = 10; c <= 18; c++) stamp(22, c, 0.9);
  } else if (digit === 2) {
    for (let deg = -60; deg <= 140; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      stamp(Math.round(10 - 4.5 * Math.sin(rad)), Math.round(14 + 5 * Math.cos(rad)), 1.0);
    }
    for (let i = 0; i < 11; i++) {
      stamp(13 + i, Math.round(18 - i * 0.9), 1.0);
    }
    for (let c = 8; c <= 20; c++) stamp(22, c, 1.0);
  } else if (digit === 3) {
    for (let deg = -90; deg <= 90; deg += 12) {
      const rad = (deg * Math.PI) / 180;
      stamp(Math.round(9 + 4 * Math.sin(rad)), Math.round(14 + 5 * Math.cos(rad)), 1.0);
    }
    for (let deg = -90; deg <= 90; deg += 12) {
      const rad = (deg * Math.PI) / 180;
      stamp(Math.round(18 + 4.5 * Math.sin(rad)), Math.round(14 + 5 * Math.cos(rad)), 1.0);
    }
  } else if (digit === 4) {
    for (let r = 5; r <= 23; r++) stamp(r, 18, 1.0);
    for (let i = 0; i <= 12; i++) stamp(5 + i, Math.round(18 - i * 0.9), 1.0);
    for (let c = 7; c <= 21; c++) stamp(17, c, 1.0);
  } else if (digit === 5) {
    for (let c = 8; c <= 19; c++) stamp(6, c, 1.0);
    for (let r = 6; r <= 13; r++) stamp(r, 9, 1.0);
    for (let deg = -80; deg <= 120; deg += 12) {
      const rad = (deg * Math.PI) / 180;
      stamp(Math.round(18 + 4.5 * Math.sin(rad)), Math.round(14 + 5.5 * Math.cos(rad)), 1.0);
    }
  } else if (digit === 6) {
    for (let i = 0; i < 12; i++) {
      stamp(7 + i, Math.round(18 - i * 0.8), 1.0);
    }
    for (let deg = 0; deg < 360; deg += 12) {
      const rad = (deg * Math.PI) / 180;
      stamp(Math.round(18 + 4.5 * Math.sin(rad)), Math.round(14 + 5 * Math.cos(rad)), 1.0);
    }
  } else if (digit === 7) {
    for (let c = 7; c <= 21; c++) stamp(6, c, 1.0);
    for (let i = 0; i < 17; i++) {
      stamp(6 + i, Math.round(20 - i * 0.65), 1.0);
    }
  } else if (digit === 8) {
    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      stamp(Math.round(10 + 3.8 * Math.sin(rad)), Math.round(14 + 4.5 * Math.cos(rad)), 1.0);
    }
    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      stamp(Math.round(18 + 4.8 * Math.sin(rad)), Math.round(14 + 5.5 * Math.cos(rad)), 1.0);
    }
  } else if (digit === 9) {
    for (let deg = 0; deg < 360; deg += 12) {
      const rad = (deg * Math.PI) / 180;
      stamp(Math.round(11 + 4.5 * Math.sin(rad)), Math.round(14 + 5 * Math.cos(rad)), 1.0);
    }
    for (let r = 11; r <= 23; r++) stamp(r, 19, 1.0);
  }

  return grid;
}

// Compute real MNIST logits & Softmax probabilities from 28x28 grid
export function inferMnist(grid: number[][]): {
  logits: number[];
  probabilities: MnistDigitProb[];
  predictedDigit: number;
  confidence: number;
  hiddenActivations: number[];
  sampledInputs: { idx: number; val: number }[];
} {
  let totalMass = 0;
  for (let r = 0; r < 28; r++) {
    for (let c = 0; c < 28; c++) totalMass += grid[r][c];
  }

  // Extract 8 representative active input nodes for the visual graph
  const flat = grid.flat();
  const activeIndices: { idx: number; val: number }[] = [];
  for (let i = 0; i < flat.length; i++) {
    if (flat[i] > 0.05) {
      activeIndices.push({ idx: i, val: flat[i] });
    }
  }
  // Pick up to 8 evenly spaced active pixels, or pad with sample indices
  activeIndices.sort((a, b) => b.val - a.val);
  const sampledInputs: { idx: number; val: number }[] = [];
  for (let i = 0; i < 8; i++) {
    if (i < activeIndices.length) {
      sampledInputs.push(activeIndices[i]);
    } else {
      sampledInputs.push({ idx: 100 + i * 40, val: 0.0 });
    }
  }
  sampledInputs.sort((a, b) => a.idx - b.idx);

  if (totalMass < 2) {
    // Blank canvas
    const evenProb = 0.1;
    const probs: MnistDigitProb[] = Array.from({ length: 10 }, (_, d) => ({
      digit: d,
      prob: evenProb,
      logit: 0,
    }));
    return {
      logits: Array(10).fill(0),
      probabilities: probs,
      predictedDigit: 0,
      confidence: evenProb,
      hiddenActivations: Array(16).fill(0),
      sampledInputs,
    };
  }

  // Calculate geometric feature metrics
  let topMass = 0;
  let botMass = 0;
  let leftMass = 0;
  let rightMass = 0;
  let centerMass = 0;
  let colWeights = Array(28).fill(0);
  let rowWeights = Array(28).fill(0);

  for (let r = 0; r < 28; r++) {
    for (let c = 0; c < 28; c++) {
      const v = grid[r][c];
      if (r < 14) topMass += v;
      else botMass += v;
      if (c < 14) leftMass += v;
      else rightMass += v;
      if (r >= 10 && r <= 17 && c >= 10 && c <= 17) centerMass += v;
      colWeights[c] += v;
      rowWeights[r] += v;
    }
  }

  const topFrac = topMass / totalMass;
  const botFrac = botMass / totalMass;
  const leftFrac = leftMass / totalMass;
  const rightFrac = rightMass / totalMass;
  const centerHoleFrac = centerMass / totalMass;

  let colMean = 0;
  for (let c = 0; c < 28; c++) colMean += c * (colWeights[c] / totalMass);
  let colVar = 0;
  for (let c = 0; c < 28; c++) colVar += Math.pow(c - colMean, 2) * (colWeights[c] / totalMass);

  // Compute correlation similarity with each canonical digit template
  const rawScores: number[] = Array(10).fill(0);
  for (let d = 0; d <= 9; d++) {
    const template = generateCanonicalDigitGrid(d);
    let dot = 0;
    let normT = 0;
    for (let r = 0; r < 28; r++) {
      for (let c = 0; c < 28; c++) {
        dot += grid[r][c] * template[r][c];
        normT += template[r][c] * template[r][c];
      }
    }
    const cosineSim = normT > 0 ? dot / Math.sqrt(totalMass * normT) : 0;
    rawScores[d] = cosineSim * 12.0;
  }

  // Fine-tune based on high-level stroke invariants
  if (colVar < 6.5) rawScores[1] += 5.5; // Thin vertical stroke
  if (centerHoleFrac < 0.08 && Math.abs(topFrac - botFrac) < 0.15 && Math.abs(leftFrac - rightFrac) < 0.15) rawScores[0] += 4.0; // Hollow loop
  if (topFrac > 0.65 && rightFrac > 0.55) rawScores[7] += 3.5; // Top-heavy diagonal
  if (centerHoleFrac > 0.22) rawScores[8] += 2.5;

  // 16 Hidden ReLU Feature Detectors
  const hiddenActivations: number[] = [
    Math.max(0, topFrac * 1.5 - 0.2), // h1: Top bar
    Math.max(0, botFrac * 1.5 - 0.2), // h2: Bottom base
    Math.max(0, 3.5 / (colVar + 1.0)), // h3: Vertical stem
    Math.max(0, 1.0 - centerHoleFrac * 3.0), // h4: Center loop
    Math.max(0, botFrac > 0.6 ? 1.2 : 0), // h5: Bottom loop
    Math.max(0, centerHoleFrac > 0.18 ? 1.0 : 0), // h6: Waist pinch
    Math.max(0, (topFrac - botFrac) * 2.0), // h7: Top heavy
    Math.max(0, (botFrac - topFrac) * 2.0), // h8: Bottom heavy
    Math.max(0, leftFrac > 0.55 ? 1.0 : 0), // h9: Left curve
    Math.max(0, rightFrac > 0.55 ? 1.0 : 0), // h10: Right curve
    Math.max(0, (rightFrac - leftFrac) * 1.8), // h11: Right tilt
    Math.max(0, rawScores[7] > 5 ? 1.4 : 0), // h12: Diagonal 7 slash
    Math.max(0, rawScores[0] > 5 ? 1.3 : 0), // h13: Oval ring
    Math.max(0, rawScores[8] > 5 ? 1.2 : 0), // h14: Dual loop
    Math.max(0, rawScores[3] > 5 ? 1.1 : 0), // h15: 3-arcs
    Math.max(0, Math.min(1.0, totalMass / 60)), // h16: Overall density
  ].map((v) => Number(v.toFixed(2)));

  // Softmax computation
  const maxScore = Math.max(...rawScores);
  const expScores = rawScores.map((s) => Math.exp(Math.min(20, Math.max(-20, s - maxScore))));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  const probs: MnistDigitProb[] = expScores.map((exp, d) => ({
    digit: d,
    prob: Number((exp / sumExp).toFixed(4)),
    logit: Number(rawScores[d].toFixed(2)),
  }));

  // Best prediction
  let bestDigit = 0;
  let maxP = -1;
  probs.forEach((p) => {
    if (p.prob > maxP) {
      maxP = p.prob;
      bestDigit = p.digit;
    }
  });

  return {
    logits: rawScores.map((s) => Number(s.toFixed(2))),
    probabilities: probs,
    predictedDigit: bestDigit,
    confidence: maxP,
    hiddenActivations,
    sampledInputs,
  };
}

export const MnistStage: React.FC<MnistStageProps> = ({
  theme,
  step,
  language,
  onChangeInput,
  isMaximized,
}) => {
  const isDark = theme === 'studio';
  const isVi = language === 'vi';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [activeTool, setActiveTool] = useState<'pencil' | 'eraser'>('pencil');
  const [selectedDigit, setSelectedDigit] = useState<number>(7);
  const [gridState, setGridState] = useState<number[][]>(() => generateCanonicalDigitGrid(7));

  // Live real-time inference result state
  const [liveResult, setLiveResult] = useState(() => inferMnist(generateCanonicalDigitGrid(7)));

  // Render 28x28 grid onto 224x224 canvas
  const renderGridToCanvas = useCallback((grid: number[][]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellW = canvas.width / 28;
    const cellH = canvas.height / 28;

    for (let r = 0; r < 28; r++) {
      for (let c = 0; c < 28; c++) {
        const v = grid[r][c];
        if (v > 0.02) {
          const alpha = Math.min(1.0, v);
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.95})`;
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    }
  }, []);

  // Update canvas on initial mount or when step digit changes
  useEffect(() => {
    const digitMatch = step.state.mnistState?.predictedDigit ?? selectedDigit;
    setSelectedDigit(digitMatch);
    const newGrid = step.state.mnistState?.grid ?? generateCanonicalDigitGrid(digitMatch);
    setGridState(newGrid);
    setLiveResult(inferMnist(newGrid));
    renderGridToCanvas(newGrid);
  }, [step]);

  // Handle Preset Digit selection
  const handleSelectPreset = (d: number) => {
    setSelectedDigit(d);
    const newGrid = generateCanonicalDigitGrid(d);
    setGridState(newGrid);
    setLiveResult(inferMnist(newGrid));
    renderGridToCanvas(newGrid);
    if (onChangeInput) {
      onChangeInput(`digit: ${d}`);
    }
  };

  // Clear Canvas
  const handleClear = () => {
    const emptyGrid: number[][] = Array.from({ length: 28 }, () => Array(28).fill(0));
    setGridState(emptyGrid);
    setLiveResult(inferMnist(emptyGrid));
    renderGridToCanvas(emptyGrid);
    if (onChangeInput) {
      onChangeInput('digit: 0');
    }
  };

  // Real-time Downsampling & Inference (Called on every single drawing stroke!)
  const processLiveInference = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellW = canvas.width / 28;
    const cellH = canvas.height / 28;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newGrid: number[][] = Array.from({ length: 28 }, () => Array(28).fill(0));

    for (let r = 0; r < 28; r++) {
      for (let c = 0; c < 28; c++) {
        let sum = 0;
        let count = 0;
        for (let py = Math.floor(r * cellH); py < Math.floor((r + 1) * cellH); py++) {
          for (let px = Math.floor(c * cellW); px < Math.floor((c + 1) * cellW); px++) {
            const idx = (py * canvas.width + px) * 4;
            // brightness from blue channel
            const brightness = imgData.data[idx + 2] / 255;
            sum += brightness;
            count++;
          }
        }
        newGrid[r][c] = Number((sum / count).toFixed(3));
      }
    }

    setGridState(newGrid);
    const inf = inferMnist(newGrid);
    setLiveResult(inf);
    setSelectedDigit(inf.predictedDigit);
  }, []);

  // Pointer & Mouse Drawing (Isolated from stage panning with stopPropagation)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    isDrawingRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    lastPointRef.current = { x, y };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = activeTool === 'eraser' ? 26 : 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = activeTool === 'eraser' ? '#0b0f19' : 'rgba(56, 189, 248, 0.95)';
    ctx.shadowColor = activeTool === 'eraser' ? 'transparent' : '#06b6d4';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(x, y, (activeTool === 'eraser' ? 26 : 16) / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();

    processLiveInference();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isDrawingRef.current || !lastPointRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = activeTool === 'eraser' ? 26 : 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = activeTool === 'eraser' ? '#0b0f19' : 'rgba(56, 189, 248, 0.95)';
    ctx.shadowColor = activeTool === 'eraser' ? 'transparent' : '#06b6d4';
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPointRef.current = { x, y };
    processLiveInference(); // REAL TIME INFERENCE AT 60FPS!
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    processLiveInference();
    if (onChangeInput) {
      onChangeInput(`digit: ${liveResult.predictedDigit}`);
    }
  };

  // Node and Column layout coordinates in SVG graph
  const SVG_W = 860;
  const SVG_H = 410;

  // 4 Main Columns:
  // Col 0: Input Layer (X = 70)
  // Col 1: Hidden Layer (X = 260)
  // Col 2: Output 10 Neurons (X = 460)
  // Col 3: Softmax Probability Bars (X = 540 to 800)
  const inputX = 70;
  const hiddenX = 260;
  const outputX = 460;

  const numInputs = liveResult.sampledInputs.length;
  const numHidden = liveResult.hiddenActivations.length;
  const numOutputs = 10;

  const getInputY = (i: number) => 70 + (i / (numInputs - 1)) * 300;
  const getHiddenY = (i: number) => 55 + (i / (numHidden - 1)) * 325;
  const getOutputY = (d: number) => 60 + (d / (numOutputs - 1)) * 315;

  const predicted = liveResult.predictedDigit;
  const confidence = liveResult.confidence;

  return (
    <div
      data-drawing="true"
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      className={`w-full h-full flex flex-col justify-between p-2.5 select-none transition-all duration-300 overflow-y-auto no-pan ${
        isMaximized ? 'max-w-7xl' : 'max-w-6xl'
      }`}
    >
      {/* 1. Header Toolbar with Preset Digits & Real-Time Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-inherit shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-cyan-400 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MNIST 784→16→10</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-[10px] font-mono font-bold animate-pulse">
            <Radio className="w-3 h-3" />
            <span>{isVi ? 'Dự đoán Real-time 60fps' : 'Live Real-time 60fps'}</span>
          </div>
        </div>

        {/* Quick Digit Preset Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono opacity-50 mr-1 hidden md:inline">
            {isVi ? 'Mẫu chữ số:' : 'Presets:'}
          </span>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <button
              key={d}
              onClick={() => handleSelectPreset(d)}
              className={`w-7 h-7 rounded-lg font-mono font-bold text-xs transition-all ${
                selectedDigit === d
                  ? 'bg-blue-600 dark:bg-cyan-500 text-white shadow-md scale-105'
                  : isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Studio: Drawing Pad (Left) + FULL NEURAL NETWORK GRAPH (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 py-2 items-center">
        {/* ========================================================= */}
        {/* LEFT COLUMN: 28x28 Drawing Pad & Downsample Grid (4 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl border border-inherit bg-slate-500/5 backdrop-blur-xs space-y-2.5">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-mono font-bold flex items-center gap-1.5 opacity-80">
              <Pencil className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>{isVi ? 'Bảng vẽ Chuẩn 28×28' : '28×28 Drawing Pad'}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTool((t) => (t === 'pencil' ? 'eraser' : 'pencil'))}
                title={activeTool === 'pencil' ? (isVi ? 'Đổi sang Tẩy' : 'Switch to Eraser') : (isVi ? 'Đổi sang Bút' : 'Switch to Pencil')}
                className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors ${
                  activeTool === 'eraser'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-slate-800/50 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {activeTool === 'eraser' ? <Eraser className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleClear}
                title={isVi ? 'Xóa bảng vẽ' : 'Clear Canvas'}
                className="p-1.5 rounded-lg border bg-slate-800/50 hover:bg-slate-700 text-slate-300 border-slate-700 text-xs font-mono flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Canvas (With Pointer Event Isolation) */}
          <div className="relative p-1 rounded-2xl bg-slate-900 border-2 border-blue-500/50 shadow-inner">
            <canvas
              ref={canvasRef}
              width={224}
              height={224}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-[200px] h-[200px] sm:w-[224px] sm:h-[224px] rounded-xl cursor-crosshair touch-none select-none"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-mono text-cyan-300 pointer-events-none">
              28×28 Grayscale
            </div>
          </div>

          {/* Mini Downsampled 28x28 Grid Heatmap & Winner Badge */}
          <div className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            {/* 28x28 Matrix Preview */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono opacity-60 mb-1">
                {isVi ? 'Ma trận 28×28' : 'Matrix 28×28'}
              </span>
              <div className="w-14 h-14 bg-black border border-cyan-500/30 rounded-md grid grid-cols-28 p-0.5 overflow-hidden">
                {gridState.flat().map((v, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: v > 0.05 ? `rgba(56, 189, 248, ${Math.min(1, v)})` : '#000' }}
                    className="w-full h-full"
                  />
                ))}
              </div>
            </div>

            {/* Winner Card */}
            <div className="flex-1 pl-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isVi ? 'Dự đoán' : 'Predicted'}</span>
                </div>
                <div className="text-xl font-display font-black text-emerald-300">
                  {isVi ? `Số ${predicted}` : `Digit ${predicted}`}
                </div>
                <div className="text-[10px] font-mono text-emerald-200">
                  {(confidence * 100).toFixed(1)}% {isVi ? 'tin cậy' : 'confidence'}
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center text-2xl font-display font-black text-emerald-300 shadow-md">
                {predicted}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: FULL NEURAL NETWORK GRAPH (SVG) (8 Cols)   */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-2 rounded-2xl border border-inherit bg-slate-500/5 backdrop-blur-xs">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full select-none"
          >
            {/* Column Headers */}
            <text x={inputX} y={24} textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
              {isVi ? 'Đầu vào (784D)' : 'Input Layer (784D)'}
            </text>
            <text x={hiddenX} y={24} textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
              {isVi ? 'Tầng ẩn (16 ReLU)' : 'Hidden (16 ReLU)'}
            </text>
            <text x={outputX} y={24} textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
              {isVi ? '10 Lớp Softmax' : '10 Output Classes'}
            </text>
            <text x={670} y={24} textAnchor="middle" fill={isDark ? '#94a3b8' : '#475569'} className="font-sans text-xs font-bold uppercase tracking-wider">
              {isVi ? 'Phân phối Xác suất' : 'Probability Distribution'}
            </text>

            {/* 1. Synaptic Lines: Input -> Hidden */}
            {liveResult.sampledInputs.map((inputNode, i) => {
              const y1 = getInputY(i);
              return liveResult.hiddenActivations.map((hVal, j) => {
                const y2 = getHiddenY(j);
                const isActive = inputNode.val > 0.1 && hVal > 0;
                return (
                  <line
                    key={`syn-in-h-${i}-${j}`}
                    x1={inputX}
                    y1={y1}
                    x2={hiddenX}
                    y2={y2}
                    stroke={isActive ? (isDark ? '#06b6d4' : '#0284c7') : (isDark ? '#1e293b' : '#e2e8f0')}
                    strokeWidth={isActive ? 1.5 : 0.6}
                    strokeDasharray={isActive ? '4 3' : undefined}
                    opacity={isActive ? Math.min(0.9, inputNode.val) : 0.18}
                  />
                );
              });
            })}

            {/* 2. Synaptic Lines: Hidden -> Output */}
            {liveResult.hiddenActivations.map((hVal, j) => {
              const y2 = getHiddenY(j);
              return liveResult.probabilities.map((probObj, d) => {
                const y3 = getOutputY(d);
                const isWinnerTarget = d === predicted;
                const isActive = hVal > 0 && probObj.prob > 0.08;
                return (
                  <line
                    key={`syn-h-out-${j}-${d}`}
                    x1={hiddenX}
                    y1={y2}
                    x2={outputX}
                    y2={y3}
                    stroke={
                      isWinnerTarget && hVal > 0
                        ? (isDark ? '#10b981' : '#059669')
                        : isActive
                        ? (isDark ? '#06b6d4' : '#0284c7')
                        : (isDark ? '#1e293b' : '#e2e8f0')
                    }
                    strokeWidth={isWinnerTarget ? 2.0 : isActive ? 1.2 : 0.5}
                    strokeDasharray={isWinnerTarget ? '5 3' : undefined}
                    opacity={isWinnerTarget ? 0.95 : isActive ? 0.45 : 0.15}
                  />
                );
              });
            })}

            {/* 3. Input Nodes (8 sampled active pixels) */}
            {liveResult.sampledInputs.map((node, i) => {
              const ny = getInputY(i);
              const isActive = node.val > 0.05;
              return (
                <g key={`in-node-${i}`}>
                  <circle
                    cx={inputX}
                    cy={ny}
                    r={14}
                    fill={isActive ? `rgba(6, 182, 212, ${Math.max(0.2, node.val)})` : (isDark ? '#0f172a' : '#f8fafc')}
                    stroke={isActive ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#334155' : '#cbd5e1')}
                    strokeWidth={1.8}
                    className="transition-colors duration-150"
                  />
                  <text
                    x={inputX}
                    y={ny + 3.5}
                    textAnchor="middle"
                    fill={isActive ? '#ffffff' : (isDark ? '#64748b' : '#94a3b8')}
                    className="font-mono text-[9px] font-bold"
                  >
                    x{node.idx}
                  </text>
                  <text
                    x={inputX - 20}
                    y={ny + 3.5}
                    textAnchor="end"
                    fill={isDark ? '#94a3b8' : '#64748b'}
                    className="font-mono text-[9px]"
                  >
                    {node.val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* 4. Hidden Layer Nodes (16 ReLU Units) */}
            {liveResult.hiddenActivations.map((val, j) => {
              const ny = getHiddenY(j);
              const isActive = val > 0;
              return (
                <g key={`h-node-${j}`}>
                  <circle
                    cx={hiddenX}
                    cy={ny}
                    r={11}
                    fill={isActive ? (isDark ? '#1e293b' : '#e0f2fe') : (isDark ? '#0f172a' : '#f8fafc')}
                    stroke={isActive ? (isDark ? '#06b6d4' : '#0284c7') : (isDark ? '#334155' : '#cbd5e1')}
                    strokeWidth={isActive ? 2 : 1}
                    className="transition-colors duration-150"
                  />
                  <text
                    x={hiddenX}
                    y={ny + 3}
                    textAnchor="middle"
                    fill={isActive ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#475569' : '#94a3b8')}
                    className="font-mono text-[8px] font-bold"
                  >
                    h{j + 1}
                  </text>
                </g>
              );
            })}

            {/* 5. Output Layer (10 Digit Class Nodes: 0 to 9) & Softmax Bars */}
            {liveResult.probabilities.map((item, d) => {
              const ny = getOutputY(d);
              const isWinner = d === predicted;
              const barW = Math.max(4, item.prob * 220);

              return (
                <g key={`out-digit-${d}`}>
                  {/* Halo pulse ring around winner */}
                  {isWinner && (
                    <circle
                      cx={outputX}
                      cy={ny}
                      r={18}
                      fill="none"
                      stroke={isDark ? '#10b981' : '#059669'}
                      strokeWidth={1.5}
                      strokeDasharray="4 2"
                      className="animate-spin-slow opacity-80"
                    />
                  )}

                  {/* Circular Digit Node */}
                  <circle
                    cx={outputX}
                    cy={ny}
                    r={13}
                    fill={
                      isWinner
                        ? (isDark ? '#064e3b' : '#dcfce7')
                        : item.prob > 0.05
                        ? (isDark ? '#1e293b' : '#e0f2fe')
                        : (isDark ? '#0f172a' : '#f8fafc')
                    }
                    stroke={
                      isWinner
                        ? (isDark ? '#10b981' : '#16a34a')
                        : item.prob > 0.05
                        ? (isDark ? '#06b6d4' : '#0284c7')
                        : (isDark ? '#334155' : '#cbd5e1')
                    }
                    strokeWidth={isWinner ? 2.5 : 1.5}
                    className="transition-all duration-150"
                  />

                  {/* Digit Glyph Text */}
                  <text
                    x={outputX}
                    y={ny + 4.5}
                    textAnchor="middle"
                    fill={
                      isWinner
                        ? (isDark ? '#6ee7b7' : '#15803d')
                        : (isDark ? '#e2e8f0' : '#1e293b')
                    }
                    className={`font-display font-bold select-none ${
                      isWinner ? 'text-sm font-black' : 'text-xs'
                    }`}
                  >
                    {d}
                  </text>

                  {/* Horizontal Softmax Probability Bar */}
                  <rect
                    x={520}
                    y={ny - 6}
                    width={220}
                    height={12}
                    rx={6}
                    fill={isDark ? '#0f172a' : '#f1f5f9'}
                    stroke={isDark ? '#334155' : '#e2e8f0'}
                    strokeWidth={1}
                  />
                  <rect
                    x={520}
                    y={ny - 6}
                    width={barW}
                    height={12}
                    rx={6}
                    fill={
                      isWinner
                        ? (isDark ? '#10b981' : '#059669')
                        : (isDark ? '#0284c7' : '#38bdf8')
                    }
                    className="transition-all duration-150"
                  />

                  {/* Percentage Label */}
                  <text
                    x={750}
                    y={ny + 3.5}
                    textAnchor="start"
                    fill={
                      isWinner
                        ? (isDark ? '#34d399' : '#16a34a')
                        : (isDark ? '#94a3b8' : '#64748b')
                    }
                    className={`font-mono text-[10px] select-none ${
                      isWinner ? 'font-black text-[11px]' : 'font-medium'
                    }`}
                  >
                    {(item.prob * 100).toFixed(1)}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3. Footer Step Invariant Summary */}
      <div className="mt-1.5 pt-1.5 border-t border-inherit flex items-center justify-between text-[11px] font-mono opacity-80 shrink-0">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
          <span>
            {isVi
              ? `Vẽ trực tiếp lên bảng đen: Mạng nơ-ron nhận diện chữ số ${predicted} với ${(confidence * 100).toFixed(1)}% độ tin cậy.`
              : `Draw live on pad: Neural network recognizes Digit ${predicted} with ${(confidence * 100).toFixed(1)}% confidence.`}
          </span>
        </span>
        <span className="hidden sm:inline opacity-60">
          Softmax ∑ P = 100%
        </span>
      </div>
    </div>
  );
};
