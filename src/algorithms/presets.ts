import type { AlgorithmPreset, TraceStep } from '../types';

export const ALGORITHM_PRESETS: AlgorithmPreset[] = [
  {
    id: 'bubble-sort',
    title: 'Bubble Sort (Adaptive)',
    category: 'Algorithms',
    badge: 'Sorting',
    description: 'Iteratively steps through array, compares adjacent elements, and swaps if out of order. Stops early if no swaps occurred.',
    timeComplexity: 'O(n) best / O(n²) worst',
    spaceComplexity: 'O(1)',
    defaultInput: '5, 2, 8, 1, 4',
    code: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    generateTraces: (inputStr: string): TraceStep[] => {
      const parsed = inputStr
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n));
      const arr = parsed.length > 0 ? parsed : [5, 2, 8, 1, 4];
      const n = arr.length;
      const steps: TraceStep[] = [];

      // Step 0: init
      steps.push({
        step: 0,
        totalSteps: 0,
        line: 1,
        action: 'init',
        targets: [],
        state: { arr: [...arr], i: 0, j: 0, swapped: false },
        explanation: `Initialized array with ${n} elements. Ready to begin sorting passes.`,
        invariant: 'Unsorted array of size n.',
      });

      const currentArr = [...arr];

      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 4,
          action: 'init',
          targets: [],
          state: { arr: [...currentArr], i, j: 0, swapped: false },
          explanation: `Starting Pass #${i + 1}. Last ${i} element(s) are already in their final sorted positions.`,
          invariant: `Suffix arr[${n - i}..${n - 1}] is fully sorted.`,
        });

        for (let j = 0; j < n - i - 1; j++) {
          const val1 = currentArr[j];
          const val2 = currentArr[j + 1];

          // Compare step
          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 6,
            action: 'compare',
            targets: [j, j + 1],
            state: { arr: [...currentArr], i, j, swapped },
            explanation: `Comparing arr[${j}] = ${val1} with arr[${j + 1}] = ${val2}.`,
            invariant: `Elements arr[${j}] and arr[${j + 1}] evaluated.`,
          });

          if (val1 > val2) {
            // Swap
            currentArr[j] = val2;
            currentArr[j + 1] = val1;
            swapped = true;

            steps.push({
              step: steps.length,
              totalSteps: 0,
              line: 7,
              action: 'swap',
              targets: [j, j + 1],
              state: { arr: [...currentArr], i, j, swapped: true },
              explanation: `${val1} > ${val2}: Swapped arr[${j}] and arr[${j + 1}]. Flag swapped set to true.`,
              invariant: `Order restored between arr[${j}] and arr[${j + 1}].`,
              variableDiff: {
                [`arr[${j}]`]: { before: val1, after: val2 },
                [`arr[${j + 1}]`]: { before: val2, after: val1 },
                swapped: { before: false, after: true },
              },
            });
          }
        }

        if (!swapped) {
          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 11,
            action: 'done',
            targets: [],
            state: { arr: [...currentArr], i, swapped: false },
            explanation: `No swaps occurred in Pass #${i + 1}. Early termination condition met: array is sorted!`,
            invariant: 'Entire array is now monotonically non-decreasing.',
          });
          break;
        }
      }

      // Final step
      steps.push({
        step: steps.length,
        totalSteps: 0,
        line: 13,
        action: 'done',
        targets: Array.from({ length: n }, (_, k) => k),
        state: { arr: [...currentArr] },
        explanation: `Sorting completed successfully in ${steps.length} discrete execution steps.`,
        invariant: '∀ k ∈ [0, n-2]: arr[k] ≤ arr[k+1]',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Algorithms',
    badge: 'Divide & Conquer',
    description: 'Finds target position in sorted array by repeatedly halving search interval between left and right pointers.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    defaultInput: '1, 3, 5, 9, 14, 21, 35 | target: 14',
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid; // Target found
    }
    if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  return -1; // Not found
}`,
    generateTraces: (inputStr: string): TraceStep[] => {
      let rawArr = [1, 3, 5, 9, 14, 21, 35];
      let target = 14;

      if (inputStr.includes('|')) {
        const parts = inputStr.split('|');
        const numPart = parts[0]
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => !Number.isNaN(n));
        if (numPart.length > 0) rawArr = numPart.sort((a, b) => a - b);
        const targetMatch = parts[1].match(/-?\d+/);
        if (targetMatch) target = Number(targetMatch[0]);
      } else {
        const numPart = inputStr
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => !Number.isNaN(n));
        if (numPart.length > 0) rawArr = numPart.sort((a, b) => a - b);
      }

      const steps: TraceStep[] = [];
      let left = 0;
      let right = rawArr.length - 1;

      steps.push({
        step: 0,
        totalSteps: 0,
        line: 2,
        action: 'init',
        targets: [left, right],
        state: { arr: [...rawArr], left, right, target },
        explanation: `Initialize left pointer at index 0 and right pointer at index ${right}. Target = ${target}.`,
        invariant: 'If target exists, it is strictly within arr[left..right].',
      });

      let found = false;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midVal = rawArr[mid];

        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 5,
          action: 'pivot',
          targets: [mid],
          state: { arr: [...rawArr], left, right, mid, target },
          explanation: `Calculated midpoint: mid = ⌊(${left} + ${right}) / 2⌋ = ${mid}. arr[${mid}] = ${midVal}.`,
          invariant: `Search space length: ${right - left + 1} elements.`,
        });

        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 6,
          action: 'compare',
          targets: [mid],
          state: { arr: [...rawArr], left, right, mid, target },
          explanation: `Evaluating condition: arr[mid] (${midVal}) === target (${target}).`,
          invariant: `Comparing arr[${mid}] against target.`,
        });

        if (midVal === target) {
          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 7,
            action: 'found',
            targets: [mid],
            state: { arr: [...rawArr], left, right, mid, target },
            explanation: `Match confirmed! arr[${mid}] equals ${target}. Target found at index ${mid}.`,
            invariant: `Target located at index ${mid}. Execution completes in O(log n).`,
          });
          found = true;
          break;
        }

        if (midVal < target) {
          const oldLeft = left;
          left = mid + 1;
          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 10,
            action: 'visit',
            targets: [mid],
            state: { arr: [...rawArr], left, right, mid, target },
            explanation: `arr[mid] (${midVal}) < target (${target}). Target must lie to the right. Adjust left = ${left}.`,
            invariant: 'Eliminated left half [0..mid].',
            variableDiff: {
              left: { before: oldLeft, after: left },
            },
          });
        } else {
          const oldRight = right;
          right = mid - 1;
          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 12,
            action: 'visit',
            targets: [mid],
            state: { arr: [...rawArr], left, right, mid, target },
            explanation: `arr[mid] (${midVal}) > target (${target}). Target must lie to the left. Adjust right = ${right}.`,
            invariant: `Eliminated right half [mid..${rawArr.length - 1}].`,
            variableDiff: {
              right: { before: oldRight, after: right },
            },
          });
        }
      }

      if (!found) {
        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 15,
          action: 'not-found',
          targets: [],
          state: { arr: [...rawArr], left, right, target },
          explanation: `Pointers crossed (left=${left} > right=${right}). Target ${target} does not exist in array.`,
          invariant: 'Search space exhausted without finding target.',
        });
      }

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  {
    id: 'ai-next-token',
    title: 'Self-Attention & Next-Token Logits',
    category: 'Modern AI',
    badge: 'Transformer / LLM',
    description: 'Visualizes causal attention head scores, context token interactions, and softmax next-token probability distribution.',
    timeComplexity: 'O(N² · d) attention',
    spaceComplexity: 'O(N · d) KV-Cache',
    defaultInput: 'The, quick, brown, fox, jumps',
    code: `// Causal Self-Attention & Softmax Logits
function forwardAttention(tokens) {
  const Q = computeQuery(tokens.last);
  const K = computeKeys(tokens);
  const scores = dotProduct(Q, K) / Math.sqrt(d_k);
  const causalMasked = applyCausalMask(scores);
  const attentionWeights = softmax(causalMasked);
  const logits = projectVocabulary(attentionWeights);
  const nextTokenProbs = softmax(logits);
  return sampleTopCandidate(nextTokenProbs);
}`,
    generateTraces: (inputStr: string): TraceStep[] => {
      const tokens = inputStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const activeTokens = tokens.length > 0 ? tokens : ['The', 'quick', 'brown', 'fox', 'jumps'];
      const lastToken = activeTokens[activeTokens.length - 1];

      const steps: TraceStep[] = [];

      // Step 1: Input tokens into embedding
      steps.push({
        step: 0,
        totalSteps: 0,
        line: 2,
        action: 'init',
        targets: [activeTokens.length - 1],
        state: {
          tokens: activeTokens,
          probabilities: [
            { token: 'over', prob: 0.12 },
            { token: 'high', prob: 0.10 },
            { token: 'away', prob: 0.08 },
            { token: 'through', prob: 0.05 },
          ],
        },
        explanation: `Received context window of ${activeTokens.length} tokens: [${activeTokens.map((t) => `"${t}"`).join(', ')}]. Active Query generated from last token "${lastToken}".`,
        invariant: 'Autoregressive context window: each token attends only to prior positions.',
      });

      // Step 2: Compute Q & K vectors
      steps.push({
        step: 1,
        totalSteps: 0,
        line: 4,
        action: 'compute',
        targets: [activeTokens.length - 1],
        state: {
          tokens: activeTokens,
          probabilities: [
            { token: 'over', prob: 0.25 },
            { token: 'high', prob: 0.15 },
            { token: 'away', prob: 0.12 },
            { token: 'through', prob: 0.08 },
          ],
        },
        explanation: `Projecting token "${lastToken}" into Query vector Q. Fetching Key vectors K from KV-Cache for all ${activeTokens.length} positions.`,
        invariant: 'Q · K^T scaled dot-product measures contextual relevance.',
      });

      // Step 3: Scaled dot-product attention
      steps.push({
        step: 2,
        totalSteps: 0,
        line: 5,
        action: 'compare',
        targets: [1, 3, activeTokens.length - 1],
        state: {
          tokens: activeTokens,
          probabilities: [
            { token: 'over', prob: 0.48 },
            { token: 'high', prob: 0.22 },
            { token: 'away', prob: 0.15 },
            { token: 'onto', prob: 0.09 },
          ],
        },
        explanation: `Attention Head weights: High cross-attention between subject "fox" (0.42) and verb "${lastToken}" (0.38). Scaling factor 1/√d applied.`,
        invariant: 'Softmax(Q · K^T / √d) sums to 1.0 across sequence dimension.',
      });

      // Step 4: Causal masking verification
      steps.push({
        step: 3,
        totalSteps: 0,
        line: 6,
        action: 'pivot',
        targets: [activeTokens.length - 1],
        state: {
          tokens: activeTokens,
          probabilities: [
            { token: 'over', prob: 0.65 },
            { token: 'high', prob: 0.18 },
            { token: 'away', prob: 0.09 },
            { token: 'onto', prob: 0.05 },
          ],
        },
        explanation: 'Applying lower-triangular causal mask to prevent information leakage from future tokens.',
        invariant: 'Attention score mask[-∞] enforces strict autoregressive causality.',
      });

      // Step 5: Vocabulary projection and final softmax distribution
      steps.push({
        step: 4,
        totalSteps: 0,
        line: 9,
        action: 'done',
        targets: [activeTokens.length - 1],
        state: {
          tokens: activeTokens,
          probabilities: [
            { token: 'over', prob: 0.74 },
            { token: 'high', prob: 0.14 },
            { token: 'away', prob: 0.06 },
            { token: 'onto', prob: 0.04 },
            { token: 'into', prob: 0.02 },
          ],
        },
        explanation: `Vocabulary LM Head output: Softmax logits concentrated on "over" (74.0% probability) following "${lastToken}".`,
        invariant: 'Top-1 greedy candidate selected: "over" completing the idiom.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },
];
