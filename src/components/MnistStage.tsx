import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Pencil, 
  Eraser, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import type { ThemeMode, TraceStep, Language } from '../types';
import { inferRealTrainedMnist } from '../algorithms/mnist_engine';
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
export function inferMnist(grid: number[][]) {
  return inferRealTrainedMnist(grid);
}

export const MnistStage: React.FC<MnistStageProps> = ({
  theme,
  step: _step,
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
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  // Live real-time inference result state from real trained 97.6% model
  const [liveResult, setLiveResult] = useState(() =>
    inferMnist(Array.from({ length: 28 }, () => Array(28).fill(0)))
  );

  // Initialize clean blank canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);
  // Clear Canvas
  const handleClear = () => {
    const emptyGrid: number[][] = Array.from({ length: 28 }, () => Array(28).fill(0));
    setLiveResult(inferMnist(emptyGrid));
    setHasDrawn(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    if (onChangeInput) {
      onChangeInput('digit: draw');
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

    const inf = inferMnist(newGrid);
    setLiveResult(inf);
  }, []);

  // Pointer & Mouse Drawing (Isolated from stage panning with stopPropagation)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setHasDrawn(true);
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
            <span>PyTorch 97.6% Trained Model</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-[10px] font-mono font-bold animate-pulse">
            <Radio className="w-3 h-3" />
            <span>{isVi ? 'Dự đoán Real-time 60fps' : 'Live Real-time 60fps'}</span>
          </div>
        </div>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          title={isVi ? 'Xóa bảng vẽ để vẽ số mới' : 'Clear canvas to draw a new digit'}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span>{isVi ? 'Xóa bảng vẽ (↺)' : 'Clear Pad (↺)'}</span>
        </button>
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
          {/* Interactive Canvas (Direct Freehand Drawing) */}
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
            {/* Prompt watermark when canvas is blank */}
            {!hasDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3 opacity-70">
                <Pencil className="w-7 h-7 text-cyan-400 mb-1.5 animate-bounce" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {isVi ? 'Vẽ trực tiếp lên đây' : 'Draw directly here'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {isVi ? 'Dùng chuột hoặc cảm ứng (0 - 9)' : 'Mouse or touch (0 - 9)'}
                </span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-mono text-cyan-300 pointer-events-none">
              28×28 Input
            </div>
          </div>

          {/* Real-time Status & Live Winner Card */}
          <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex-1 pr-2">
              <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{hasDrawn ? (isVi ? 'Dự đoán Real-time' : 'Live Prediction') : (isVi ? 'Trạng thái' : 'Status')}</span>
              </div>
              <div className="text-xl font-display font-black text-emerald-300">
                {hasDrawn
                  ? (isVi ? `Chữ số ${predicted}` : `Digit ${predicted}`)
                  : (isVi ? 'Chờ vẽ số...' : 'Waiting for draw...')}
              </div>
              <div className="text-[10px] font-mono text-emerald-200/80">
                {hasDrawn
                  ? `${(confidence * 100).toFixed(1)}% ${isVi ? 'độ tin cậy' : 'confidence'}`
                  : (isVi ? 'Hãy vẽ số vào bảng ở trên' : 'Draw any digit on pad above')}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-display font-black shadow-md transition-all ${
              hasDrawn
                ? 'bg-emerald-500/20 border-2 border-emerald-400/70 text-emerald-300 scale-105'
                : 'bg-slate-800/40 border border-dashed border-slate-700 text-slate-500'
            }`}>
              {hasDrawn ? predicted : '—'}
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
