import { MNIST_CNN_WEIGHTS } from './mnist_cnn_model';
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
      if (val > 0.08) {
        if (r < rMin) rMin = r;
        if (r > rMax) rMax = r;
        if (c < cMin) cMin = c;
        if (c > cMax) cMax = c;
        totalMass += val;
      }
    }
  }

  // If blank or tiny spot
  if (totalMass < 1.0 || rMax < rMin || cMax < cMin) {
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
      const origR = Math.max(0, Math.min(h - 1, Math.floor(r / scale)));
      const origC = Math.max(0, Math.min(w - 1, Math.floor(c / scale)));
      scaled[r][c] = rawGrid[rMin + origR]?.[cMin + origC] ?? 0;
    }
  }
  // Place into 28x28 canvas centered
  const centered: number[][] = Array.from({ length: 28 }, () => Array(28).fill(0));
  const topPad = Math.floor((28 - newH) / 2);
  const leftPad = Math.floor((28 - newW) / 2);

  for (let r = 0; r < newH; r++) {
    for (let c = 0; c < newW; c++) {
      const tr = topPad + r;
      const tc = leftPad + c;
      if (tr >= 0 && tr < 28 && tc >= 0 && tc < 28) {
        centered[tr][tc] = scaled[r]?.[c] ?? 0;
      }
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
            shifted[nr][nc] = centered[r]?.[c] ?? 0;
          }
        }
      }
      return shifted;
    }
  }

  return centered;
}

// Decode base64 int8 weights for FC1
let cachedFc1Int8: Int8Array | null = null;
let cachedFc1B: Float32Array | null = null;
let cachedFc2B: Float32Array | null = null;

function ensureCnnDecoded() {
  if (cachedFc1Int8) return;

  const bin = atob(MNIST_CNN_WEIGHTS.fc1_w_b64);
  const arr = new Int8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    const code = bin.charCodeAt(i);
    arr[i] = code > 127 ? code - 256 : code;
  }
  cachedFc1Int8 = arr;
  cachedFc1B = Float32Array.from(MNIST_CNN_WEIGHTS.fc1_b);
  cachedFc2B = Float32Array.from(MNIST_CNN_WEIGHTS.fc2_b);
}

// ULTRA CONVOLUTIONAL NEURAL NETWORK (CNN) INFERENCE
// 99.4% Test Accuracy + Data Augmentation
export function inferRealTrainedMnist(rawGrid: number[][]): {
  logits: number[];
  probabilities: MnistDigitProb[];
  predictedDigit: number;
  confidence: number;
  hiddenActivations: number[];
  sampledInputs: { idx: number; val: number }[];
  centeredGrid: number[][];
} {
  ensureCnnDecoded();

  // 1. Center and normalize image using MNIST standard
  const centeredGrid = centerAndNormalizeGrid(rawGrid);

  // Check mass
  let totalMass = 0;
  for (let r = 0; r < 28; r++) {
    for (let c = 0; c < 28; c++) {
      totalMass += centeredGrid[r][c];
    }
  }

  // Sample 8 representative inputs for the visual diagram
  const flat = centeredGrid.flat();
  const activeIndices: { idx: number; val: number }[] = [];
  for (let i = 0; i < 784; i++) {
    if (flat[i] > 0.08) activeIndices.push({ idx: i, val: Number(flat[i].toFixed(2)) });
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

  // Blank canvas
  if (totalMass < 1.0) {
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

  const conv1_w = MNIST_CNN_WEIGHTS.conv1_w;
  const conv1_b = MNIST_CNN_WEIGHTS.conv1_b;
  const conv2_w = MNIST_CNN_WEIGHTS.conv2_w;
  const conv2_b = MNIST_CNN_WEIGHTS.conv2_b;
  const fc1_w = cachedFc1Int8!;
  const fc1_scale = MNIST_CNN_WEIGHTS.fc1_scale;
  const fc1_b = cachedFc1B!;
  const fc2_w = MNIST_CNN_WEIGHTS.fc2_w;
  const fc2_b = cachedFc2B!;

  // 2. Conv1: 1 -> 16 (3x3, pad 1) + ReLU + MaxPool(2) -> 14x14x16
  const pool1 = Array.from({ length: 16 }, () => new Float32Array(196));

  for (let oc = 0; oc < 16; oc++) {
    const w = conv1_w[oc][0];
    const bias = conv1_b[oc];
    const out = pool1[oc];

    for (let py = 0; py < 14; py++) {
      for (let px = 0; px < 14; px++) {
        let maxVal = 0;
        for (let dy = 0; dy < 2; dy++) {
          const r = py * 2 + dy;
          for (let dx = 0; dx < 2; dx++) {
            const c = px * 2 + dx;
            let sum = bias;
            for (let kr = -1; kr <= 1; kr++) {
              const inR = r + kr;
              if (inR >= 0 && inR < 28) {
                const row = centeredGrid[inR];
                if (row) {
                  const wRow = w[kr + 1];
                  for (let kc = -1; kc <= 1; kc++) {
                    const inC = c + kc;
                    if (inC >= 0 && inC < 28) {
                      const pxVal = row[inC] ?? 0;
                      if (pxVal > 0) {
                        sum += pxVal * wRow[kc + 1];
                      }
                    }
                  }
                }
              }
            }
            if (sum > maxVal) maxVal = sum;
          }
        }
        out[py * 14 + px] = maxVal;
      }
    }
  }

  // 3. Conv2: 16 -> 32 (3x3, pad 1) + ReLU + MaxPool(2) -> 7x7x32 (1568 flattened)
  const flatCnn = new Float32Array(1568);

  for (let oc = 0; oc < 32; oc++) {
    const kernels = conv2_w[oc];
    const bias = conv2_b[oc];

    for (let py = 0; py < 7; py++) {
      for (let px = 0; px < 7; px++) {
        let maxVal = 0;
        for (let dy = 0; dy < 2; dy++) {
          const r = py * 2 + dy;
          for (let dx = 0; dx < 2; dx++) {
            const c = px * 2 + dx;
            let sum = bias;
            for (let ic = 0; ic < 16; ic++) {
              const inChannel = pool1[ic];
              const kw = kernels[ic];
              for (let kr = -1; kr <= 1; kr++) {
                const inR = r + kr;
                if (inR >= 0 && inR < 14) {
                  const rOffset = inR * 14;
                  const kwRow = kw[kr + 1];
                  for (let kc = -1; kc <= 1; kc++) {
                    const inC = c + kc;
                    if (inC >= 0 && inC < 14) {
                      sum += inChannel[rOffset + inC] * kwRow[kc + 1];
                    }
                  }
                }
              }
            }
            if (sum > maxVal) maxVal = sum;
          }
        }
        flatCnn[oc * 49 + (py * 7 + px)] = maxVal;
      }
    }
  }

  // 4. FC1: 1568 -> 64 (ReLU)
  const h1 = new Float32Array(64);
  for (let j = 0; j < 64; j++) {
    let sum = fc1_b[j];
    for (let i = 0; i < 1568; i++) {
      const fVal = flatCnn[i];
      if (fVal > 0) {
        sum += fVal * (fc1_w[i * 64 + j] * fc1_scale);
      }
    }
    h1[j] = Math.max(0, sum);
  }

  // 5. FC2: 64 -> 10 (Output Logits)
  const logits = new Float32Array(10);
  let maxLogit = -Infinity;
  for (let m = 0; m < 10; m++) {
    let sum = fc2_b[m];
    for (let j = 0; j < 64; j++) {
      sum += h1[j] * fc2_w[j][m];
    }
    logits[m] = sum;
    if (sum > maxLogit) maxLogit = sum;
  }

  // 6. Softmax Normalization
  let sumExp = 0;
  const expScores = new Float32Array(10);
  for (let m = 0; m < 10; m++) {
    const e = Math.exp(Math.min(20, Math.max(-20, logits[m] - maxLogit)));
    expScores[m] = e;
    sumExp += e;
  }

  const probabilities: MnistDigitProb[] = Array.from({ length: 10 }, (_, d) => ({
    digit: d,
    prob: Number((expScores[d] / sumExp).toFixed(4)),
    logit: Number(logits[d].toFixed(2)),
  }));

  // Winner digit
  let bestDigit = 0;
  let maxP = 0;
  probabilities.forEach((p) => {
    if (isFinite(p.prob) && p.prob > maxP) {
      maxP = p.prob;
      bestDigit = p.digit;
    }
  });
  const safeConfidence = isFinite(maxP) && maxP > 0 ? maxP : 0.1;

  // Extract 16 representative hidden neurons from FC1 for the visual diagram
  const hiddenActivations: number[] = [];
  for (let i = 0; i < 16; i++) {
    hiddenActivations.push(Number(h1[i * 4].toFixed(2)));
  }

  return {
    logits: Array.from(logits).map((s) => Number(s.toFixed(2))),
    probabilities,
    predictedDigit: bestDigit,
    confidence: safeConfidence,
    hiddenActivations,
    sampledInputs,
    centeredGrid,
  };
}
