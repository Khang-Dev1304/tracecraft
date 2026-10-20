import { MNIST_WEIGHTS } from './mnist_trained_model';
import type { MnistDigitProb } from '../types';

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

// MNIST Standard Center-of-Mass & Bounding Box Normalization
export function centerAndNormalizeGrid(rawGrid: number[][]): number[][] {
  let rMin = 28, rMax = -1, cMin = 28, cMax = -1;
  let totalMass = 0;

  for (let r = 0; r < 28; r++) {
    for (let c = 0; c < 28; c++) {
      const val = rawGrid[r][c];
      if (val > 0.05) {
        if (r < rMin) rMin = r;
        if (r > rMax) rMax = r;
        if (c < cMin) cMin = c;
        if (c > cMax) cMax = c;
        totalMass += val;
      }
    }
  }

  // If blank or tiny spot
  if (totalMass < 1.5 || rMax < rMin || cMax < cMin) {
    return rawGrid;
  }

  const h = rMax - rMin + 1;
  const w = cMax - cMin + 1;

  // Scale bounding box into 20x20
  const scale = 20.0 / Math.max(h, w);
  const newH = Math.max(1, Math.min(20, Math.round(h * scale)));
  const newW = Math.max(1, Math.min(20, Math.round(w * scale)));

  const scaled: number[][] = Array.from({ length: newH }, () => Array(newW).fill(0));
  for (let r = 0; r < newH; r++) {
    for (let c = 0; c < newW; c++) {
      const origR = Math.min(h - 1, Math.floor(r / scale));
      const origC = Math.min(w - 1, Math.floor(c / scale));
      scaled[r][c] = rawGrid[rMin + origR][cMin + origC];
    }
  }

  // Place into 28x28 canvas centered
  const centered: number[][] = Array.from({ length: 28 }, () => Array(28).fill(0));
  const topPad = Math.floor((28 - newH) / 2);
  const leftPad = Math.floor((28 - newW) / 2);

  for (let r = 0; r < newH; r++) {
    for (let c = 0; c < newW; c++) {
      centered[topPad + r][leftPad + c] = scaled[r][c];
    }
  }

  // Shift by center of mass to exact (14, 14)
  let sumY = 0, sumX = 0, mass = 0;
  for (let r = 0; r < 28; r++) {
    for (let c = 0; c < 28; c++) {
      const v = centered[r][c];
      sumY += r * v;
      sumX += c * v;
      mass += v;
    }
  }

  if (mass > 0) {
    const cy = sumY / mass;
    const cx = sumX / mass;
    const shiftY = Math.round(14 - cy);
    const shiftX = Math.round(14 - cx);

    if (Math.abs(shiftY) <= 4 && Math.abs(shiftX) <= 4) {
      const shifted: number[][] = Array.from({ length: 28 }, () => Array(28).fill(0));
      for (let r = 0; r < 28; r++) {
        for (let c = 0; c < 28; c++) {
          const nr = r + shiftY;
          const nc = c + shiftX;
          if (nr >= 0 && nr < 28 && nc >= 0 && nc < 28) {
            shifted[nr][nc] = centered[r][c];
          }
        }
      }
      return shifted;
    }
  }

  return centered;
}

// Cached Float32Array weights
let cachedW1: Float32Array | null = null;
let cachedW2: Float32Array | null = null;
let cachedW3: Float32Array | null = null;
let cachedB1: Float32Array | null = null;
let cachedB2: Float32Array | null = null;
let cachedB3: Float32Array | null = null;

function ensureWeightsDecoded() {
  if (cachedW1 && cachedW2 && cachedW3) return;

  const decodeBase64Int8 = (b64: string): Int8Array => {
    const bin = atob(b64);
    const arr = new Int8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      const code = bin.charCodeAt(i);
      arr[i] = code > 127 ? code - 256 : code;
    }
    return arr;
  };

  const rawW1 = decodeBase64Int8(MNIST_WEIGHTS.w1_b64);
  const rawW2 = decodeBase64Int8(MNIST_WEIGHTS.w2_b64);
  const rawW3 = decodeBase64Int8(MNIST_WEIGHTS.w3_b64);

  cachedW1 = new Float32Array(rawW1.length);
  for (let i = 0; i < rawW1.length; i++) {
    cachedW1[i] = rawW1[i] * MNIST_WEIGHTS.scale1;
  }

  cachedW2 = new Float32Array(rawW2.length);
  for (let i = 0; i < rawW2.length; i++) {
    cachedW2[i] = rawW2[i] * MNIST_WEIGHTS.scale2;
  }

  cachedW3 = new Float32Array(rawW3.length);
  for (let i = 0; i < rawW3.length; i++) {
    cachedW3[i] = rawW3[i] * MNIST_WEIGHTS.scale3;
  }

  cachedB1 = Float32Array.from(MNIST_WEIGHTS.b1);
  cachedB2 = Float32Array.from(MNIST_WEIGHTS.b2);
  cachedB3 = Float32Array.from(MNIST_WEIGHTS.b3);
}

// REAL TRAINED 97.6% MNIST NEURAL NETWORK INFERENCE
export function inferRealTrainedMnist(rawGrid: number[][]): {
  logits: number[];
  probabilities: MnistDigitProb[];
  predictedDigit: number;
  confidence: number;
  hiddenActivations: number[];
  sampledInputs: { idx: number; val: number }[];
  centeredGrid: number[][];
} {
  ensureWeightsDecoded();

  const W1 = cachedW1!;
  const W2 = cachedW2!;
  const W3 = cachedW3!;
  const b1 = cachedB1!;
  const b2 = cachedB2!;
  const b3 = cachedB3!;

  // 1. Center and normalize image using MNIST standard
  const centeredGrid = centerAndNormalizeGrid(rawGrid);

  // Flatten into 784D vector
  const x = new Float32Array(784);
  let totalMass = 0;
  for (let r = 0; r < 28; r++) {
    for (let c = 0; c < 28; c++) {
      const v = centeredGrid[r][c];
      x[r * 28 + c] = v;
      totalMass += v;
    }
  }

  // Sample 8 representative inputs for the visual diagram
  const activeIndices: { idx: number; val: number }[] = [];
  for (let i = 0; i < 784; i++) {
    if (x[i] > 0.1) activeIndices.push({ idx: i, val: Number(x[i].toFixed(2)) });
  }
  activeIndices.sort((a, b) => b.val - a.val);

  const sampledInputs: { idx: number; val: number }[] = [];
  for (let i = 0; i < 8; i++) {
    if (i < activeIndices.length) {
      sampledInputs.push(activeIndices[i]);
    } else {
      sampledInputs.push({ idx: 120 + i * 45, val: 0.0 });
    }
  }
  sampledInputs.sort((a, b) => a.idx - b.idx);

  // If blank canvas
  if (totalMass < 1.5) {
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
      centeredGrid,
    };
  }

  // 2. Layer 1: 784 -> 96 (ReLU)
  const h1 = new Float32Array(96);
  for (let j = 0; j < 96; j++) {
    let sum = b1[j];
    for (let i = 0; i < 784; i++) {
      const pxVal = x[i];
      if (pxVal > 0.01) {
        sum += pxVal * W1[i * 96 + j];
      }
    }
    h1[j] = Math.max(0, sum);
  }

  // 3. Layer 2: 96 -> 48 (ReLU)
  const h2 = new Float32Array(48);
  for (let k = 0; k < 48; k++) {
    let sum = b2[k];
    for (let j = 0; j < 96; j++) {
      const hVal = h1[j];
      if (hVal > 0) {
        sum += hVal * W2[j * 48 + k];
      }
    }
    h2[k] = Math.max(0, sum);
  }

  // 4. Layer 3: 48 -> 10 (Linear Logits)
  const logits = new Float32Array(10);
  let maxLogit = -Infinity;
  for (let m = 0; m < 10; m++) {
    let sum = b3[m];
    for (let k = 0; k < 48; k++) {
      const hVal = h2[k];
      if (hVal > 0) {
        sum += hVal * W3[k * 10 + m];
      }
    }
    logits[m] = sum;
    if (sum > maxLogit) maxLogit = sum;
  }

  // 5. Softmax Probabilities
  const expScores = new Float32Array(10);
  let sumExp = 0;
  for (let m = 0; m < 10; m++) {
    const exp = Math.exp(Math.min(20, Math.max(-20, logits[m] - maxLogit)));
    expScores[m] = exp;
    sumExp += exp;
  }

  const probabilities: MnistDigitProb[] = Array.from({ length: 10 }, (_, d) => {
    const p = Number((expScores[d] / sumExp).toFixed(4));
    return {
      digit: d,
      prob: p,
      logit: Number(logits[d].toFixed(2)),
    };
  });

  // Pick winner
  let bestDigit = 0;
  let maxP = -1;
  probabilities.forEach((p) => {
    if (p.prob > maxP) {
      maxP = p.prob;
      bestDigit = p.digit;
    }
  });

  // Extract 16 representative hidden neurons from Layer 1 for the visual graph
  const hiddenActivations: number[] = [];
  for (let i = 0; i < 16; i++) {
    hiddenActivations.push(Number(h1[i * 6].toFixed(2)));
  }

  return {
    logits: Array.from(logits).map((s) => Number(s.toFixed(2))),
    probabilities,
    predictedDigit: bestDigit,
    confidence: maxP,
    hiddenActivations,
    sampledInputs,
    centeredGrid,
  };
}
