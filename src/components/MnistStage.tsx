import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Pencil, 
  Eraser, 
  RotateCcw, 
  Sparkles, 
  Binary, 
  CheckCircle2, 
  Layers,
  ArrowRight
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
          const factor = dist === 0 ? 1.0 : dist === 1 ? 0.65 : 0.35;
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
} {
  let totalMass = 0;
  for (let r = 0; r < 28; r++) {
    for (let c = 0; c < 28; c++) totalMass += grid[r][c];
  }

  if (totalMass < 3) {
    // Empty drawing
    const evenProb = 0.1;
    const probs: MnistDigitProb[] = Array.from({ length: 10 }, (_, d) => ({
      digit: d,
      prob: evenProb,
      logit: 0,
    }));
    return { logits: Array(10).fill(0), probabilities: probs, predictedDigit: 0, confidence: evenProb };
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

  // Spread of active columns (variance)
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
  if (colVar < 6.5) rawScores[1] += 4.5; // Thin vertical stroke
  if (centerHoleFrac < 0.08 && Math.abs(topFrac - botFrac) < 0.15 && Math.abs(leftFrac - rightFrac) < 0.15) rawScores[0] += 3.5; // Hollow loop
  if (topFrac > 0.65 && rightFrac > 0.55) rawScores[7] += 3.0; // Top-heavy diagonal
  if (centerHoleFrac > 0.22) rawScores[8] += 2.0;

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
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number; val: number } | null>(null);

  // Parse digit or custom grid from inputStr or step
  useEffect(() => {
    const digitMatch = step.state.mnistState?.predictedDigit ?? selectedDigit;
    setSelectedDigit(digitMatch);
    if (step.state.mnistState?.grid) {
      setGridState(step.state.mnistState.grid);
      renderGridToCanvas(step.state.mnistState.grid);
    }
  }, [step]);

  // Render 28x28 grid onto high-res 224x224 canvas
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
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.9})`;
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    }
  }, []);

  // Initialize canvas on mount
  useEffect(() => {
    renderGridToCanvas(gridState);
  }, [renderGridToCanvas, gridState]);

  // Handle Preset Digit selection
  const handleSelectPreset = (d: number) => {
    setSelectedDigit(d);
    const newGrid = generateCanonicalDigitGrid(d);
    setGridState(newGrid);
    renderGridToCanvas(newGrid);
    if (onChangeInput) {
      onChangeInput(`digit: ${d}`);
    }
  };

  // Clear Canvas
  const handleClear = () => {
    const emptyGrid = Array.from({ length: 28 }, () => Array(28).fill(0));
    setGridState(emptyGrid);
    renderGridToCanvas(emptyGrid);
    if (onChangeInput) {
      onChangeInput('digit: 0');
    }
  };

  // Mouse & Touch Drawing on Canvas
  const drawStroke = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellR = Math.min(27, Math.max(0, Math.floor((y / canvas.height) * 28)));
    const cellC = Math.min(27, Math.max(0, Math.floor((x / canvas.width) * 28)));
    setHoveredCell({ r: cellR, c: cellC, val: gridState[cellR]?.[cellC] ?? 0 });

    ctx.lineWidth = activeTool === 'eraser' ? 24 : 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#0b0f19';
    } else {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.95)';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 6;
    }

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPointRef.current = { x, y };
  };

  // Extract 28x28 grayscale matrix from canvas when drawing completes
  const handleFinishDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Downsample from 224x224 to 28x28
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
    const result = inferMnist(newGrid);
    setSelectedDigit(result.predictedDigit);
    if (onChangeInput) {
      onChangeInput(`digit: ${result.predictedDigit}`);
    }
  };

  // Get current probabilities
  const inference = inferMnist(gridState);
  const probabilities = step.state.mnistState?.probabilities ?? inference.probabilities;
  const predicted = step.state.mnistState?.predictedDigit ?? inference.predictedDigit;
  const confidence = step.state.mnistState?.confidence ?? inference.confidence;

  // Calculate top-3 candidate digits
  const sortedProbs = [...probabilities].sort((a, b) => b.prob - a.prob);

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-3 select-none transition-all duration-300 overflow-y-auto ${
        isMaximized ? 'max-w-7xl' : 'max-w-5xl'
      }`}
    >
      {/* 1. Header Toolbar with Preset Digits & Draw Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-inherit shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-cyan-400 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MNIST 28×28 Interactive</span>
          </div>
          <span className="text-xs opacity-60 font-mono hidden sm:inline">
            {isVi ? 'Vẽ trực tiếp hoặc chọn mẫu số 0-9' : 'Draw freely or pick digits 0-9'}
          </span>
        </div>

        {/* Quick Digit Preset Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono opacity-50 mr-1 hidden md:inline">
            {isVi ? 'Mẫu nhanh:' : 'Presets:'}
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

      {/* 2. Main 3-Column Studio Pipeline */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3.5 py-3 items-center">
        {/* ========================================================= */}
        {/* COLUMN A: Interactive 28x28 Canvas & Pixel Heatmap (5 Cols) */}
        {/* ========================================================= */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl border border-inherit bg-slate-500/5 backdrop-blur-xs">
          <div className="w-full flex items-center justify-between mb-2">
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

          {/* Canvas Wrapper */}
          <div className="relative group p-1 rounded-2xl bg-slate-900 border-2 border-blue-500/40 shadow-inner">
            <canvas
              ref={canvasRef}
              width={224}
              height={224}
              onMouseDown={(e) => {
                isDrawingRef.current = true;
                drawStroke(e.clientX, e.clientY);
              }}
              onMouseMove={(e) => {
                if (isDrawingRef.current) drawStroke(e.clientX, e.clientY);
              }}
              onMouseUp={() => {
                handleFinishDrawing();
                setHoveredCell(null);
              }}
              onMouseLeave={() => {
                handleFinishDrawing();
                setHoveredCell(null);
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                if (touch) {
                  isDrawingRef.current = true;
                  drawStroke(touch.clientX, touch.clientY);
                }
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                if (isDrawingRef.current && touch) {
                  drawStroke(touch.clientX, touch.clientY);
                }
              }}
              onTouchEnd={handleFinishDrawing}
              className="w-[200px] h-[200px] sm:w-[224px] sm:h-[224px] rounded-xl cursor-crosshair touch-none"
            />
            {/* Hover coordinate badge */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono text-cyan-300 pointer-events-none">
              {hoveredCell ? `(${hoveredCell.r}, ${hoveredCell.c}): ${hoveredCell.val.toFixed(2)}` : '28×28 Grayscale'}
            </div>
          </div>

          <p className="text-[11px] font-mono opacity-60 mt-2 text-center">
            {isVi ? 'Kéo chuột để vẽ số bất kỳ (0 - 9)' : 'Draw any digit with mouse or touch'}
          </p>
        </div>

        {/* ========================================================= */}
        {/* COLUMN B: Neural Architecture & Feature Flow (3 Cols)     */}
        {/* ========================================================= */}
        <div className="md:col-span-3 flex flex-col items-center justify-center p-3 rounded-2xl border border-inherit bg-slate-500/5 backdrop-blur-xs space-y-3">
          <span className="text-xs font-mono font-bold flex items-center gap-1.5 opacity-80 self-start">
            <Layers className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span>{isVi ? 'Trích xuất Đặc trưng' : 'Feature Flattening'}</span>
          </span>

          {/* 1D Vector Unrolling Preview (784 dimensions) */}
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono opacity-70">
              <span>Vector x ∈ ℝ⁷⁸⁴</span>
              <span>28×28 = 784</span>
            </div>
            <div className="w-full h-4 rounded-md bg-slate-900 border border-slate-700 p-0.5 flex gap-0.5 overflow-hidden">
              {gridState.flat().slice(100, 220).map((val, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: val > 0.1 ? `rgba(56, 189, 248, ${Math.min(1, val * 1.5)})` : '#1e293b',
                  }}
                  className="flex-1 h-full rounded-xs transition-colors"
                />
              ))}
            </div>
          </div>

          {/* Flow Arrow */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 animate-pulse">
            <ArrowRight className="w-3.5 h-3.5 rotate-90 md:rotate-0" />
            <span>W₁·x + b₁ (ReLU)</span>
          </div>

          {/* Hidden Feature Detectors Sample (16 Neurons) */}
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono opacity-70">
              <span>{isVi ? 'Tầng ẩn (16 detectors)' : 'Hidden Layer (16 units)'}</span>
              <span className="text-cyan-400">ReLU</span>
            </div>
            <div className="grid grid-cols-8 gap-1 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              {Array.from({ length: 16 }).map((_, idx) => {
                const isActive = (idx * 7 + selectedDigit * 3) % 5 !== 0;
                const actVal = isActive ? Number((0.2 + ((idx * 31 + selectedDigit * 17) % 80) / 100).toFixed(2)) : 0;
                return (
                  <div
                    key={idx}
                    title={`Neuron h${idx + 1}: ${actVal} (${actVal > 0 ? 'Active' : 'Clamped'})`}
                    className={`h-5 rounded-md flex items-center justify-center font-mono text-[9px] font-bold transition-all ${
                      actVal > 0
                        ? 'bg-blue-600/30 border border-blue-400 text-cyan-300'
                        : 'bg-slate-800/40 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {actVal > 0 ? actVal.toFixed(1) : '0'}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flow Arrow */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 animate-pulse">
            <ArrowRight className="w-3.5 h-3.5 rotate-90 md:rotate-0" />
            <span>W₂·h + b₂ (Softmax)</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN C: Top-10 Softmax Distribution & Verdict (4 Cols)  */}
        {/* ========================================================= */}
        <div className="md:col-span-4 flex flex-col justify-between p-3 rounded-2xl border border-inherit bg-slate-500/5 backdrop-blur-xs h-full space-y-3">
          {/* Winner Prediction Banner */}
          <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isVi ? 'Dự đoán Số' : 'Predicted Digit'}</span>
              </div>
              <div className="text-2xl font-display font-black text-emerald-300 mt-0.5">
                {isVi ? `Chữ số ${predicted}` : `Digit ${predicted}`}
              </div>
              <div className="text-[11px] font-mono opacity-80 text-emerald-200">
                {isVi ? `Độ tin cậy: ${(confidence * 100).toFixed(1)}%` : `Confidence: ${(confidence * 100).toFixed(1)}%`}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-3xl font-display font-black text-emerald-300 shadow-md">
              {predicted}
            </div>
          </div>

          {/* 10 Softmax Probability Bars */}
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between text-[11px] font-mono opacity-70 mb-1">
              <span>{isVi ? 'Phân phối Softmax (0 - 9)' : 'Softmax Distribution (0 - 9)'}</span>
              <span>∑ P = 100%</span>
            </div>

            {probabilities.map((item) => {
              const isWinner = item.digit === predicted;
              return (
                <div key={item.digit} className="flex items-center gap-2 text-xs font-mono">
                  {/* Digit Label */}
                  <span
                    className={`w-5 text-center font-bold rounded-sm ${
                      isWinner ? 'text-emerald-400 font-black scale-110' : 'opacity-60'
                    }`}
                  >
                    {item.digit}
                  </span>

                  {/* Bar Container */}
                  <div className="flex-1 h-3.5 rounded-full bg-slate-900/60 border border-slate-800 overflow-hidden relative">
                    <div
                      style={{ width: `${Math.max(3, item.prob * 100)}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        isWinner
                          ? 'bg-linear-to-r from-emerald-500 to-cyan-400 shadow-sm'
                          : 'bg-slate-700/60'
                      }`}
                    />
                  </div>

                  {/* Percentage Text */}
                  <span
                    className={`w-12 text-right font-medium ${
                      isWinner ? 'text-emerald-300 font-bold' : 'opacity-50 text-[11px]'
                    }`}
                  >
                    {(item.prob * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Footer Step Invariant Summary */}
      <div className="mt-2 pt-2 border-t border-inherit flex items-center justify-between text-[11px] font-mono opacity-80">
        <span className="flex items-center gap-1.5">
          <Binary className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
          <span>
            {isVi
              ? `Hàm Softmax chuẩn hóa 10 điểm logit thành phân phối xác suất hợp lệ: P(${predicted}) = ${(confidence * 100).toFixed(1)}%.`
              : `Softmax normalizes 10 raw logits into a valid probability distribution: P(${predicted}) = ${(confidence * 100).toFixed(1)}%.`}
          </span>
        </span>
        <span className="hidden sm:inline opacity-60">
          Top-2: {sortedProbs[1]?.digit} ({(sortedProbs[1]?.prob * 100).toFixed(1)}%)
        </span>
      </div>
    </div>
  );
};
