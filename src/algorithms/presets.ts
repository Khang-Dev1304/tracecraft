import type { AlgorithmPreset, TraceStep } from '../types';

export const ALGORITHM_PRESETS: AlgorithmPreset[] = [
  // ==========================================
  // Category 1: Foundations & Sorting
  // ==========================================
  {
    id: 'bubble-sort',
    title: 'Bubble Sort (Adaptive)',
    category: 'Foundations & Sorting',
    difficulty: 'Beginner',
    badge: 'Adjacent Swaps',
    summary: 'Compares adjacent items and swaps them if out of order, stopping early if array is already sorted.',
    description: 'Iteratively sweeps through the array, comparing adjacent pairs and bubbling the largest unplaced element to the end. Features an early-exit optimization flag that terminates in O(n) when no swaps occur.',
    timeComplexity: 'O(n) best / O(n²) worst',
    spaceComplexity: 'O(1) auxiliary',
    tags: ['Array', 'In-Place', 'Stable', 'Comparison'],
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

      steps.push({
        step: 0,
        totalSteps: 0,
        line: 1,
        action: 'init',
        targets: [],
        state: { arr: [...arr], i: 0, j: 0, swapped: false },
        explanation: `Initialized array with ${n} elements. Ready to begin sorting passes.`,
        invariant: 'Initial unsorted state. Outer pass counter i = 0.',
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
          explanation: `Starting Pass #${i + 1}. Last ${i} element(s) are already locked in sorted positions.`,
          invariant: `Suffix arr[${n - i}..${n - 1}] is guaranteed sorted.`,
        });

        for (let j = 0; j < n - i - 1; j++) {
          const val1 = currentArr[j];
          const val2 = currentArr[j + 1];

          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 6,
            action: 'compare',
            targets: [j, j + 1],
            state: { arr: [...currentArr], i, j, swapped },
            explanation: `Comparing adjacent pair: arr[${j}] = ${val1} and arr[${j + 1}] = ${val2}.`,
            invariant: `Verifying local order between indices ${j} and ${j + 1}.`,
          });

          if (val1 > val2) {
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
              explanation: `${val1} > ${val2}: Inversion found. Swapping arr[${j}] and arr[${j + 1}].`,
              invariant: `Inversion corrected. Local pair now non-decreasing.`,
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
            explanation: `Zero swaps occurred in Pass #${i + 1}. Adaptive early-exit triggered: array is fully sorted!`,
            invariant: 'Array is monotonically ordered. Terminated in optimal pass.',
          });
          break;
        }
      }

      steps.push({
        step: steps.length,
        totalSteps: 0,
        line: 13,
        action: 'done',
        targets: Array.from({ length: n }, (_, k) => k),
        state: { arr: [...currentArr] },
        explanation: `Sorting complete! All ${n} elements are in non-decreasing order.`,
        invariant: '∀ k ∈ [0, n-2]: arr[k] ≤ arr[k+1]',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'Foundations & Sorting',
    difficulty: 'Beginner',
    badge: 'Incremental Build',
    summary: 'Builds a sorted subarray one element at a time by shifting larger items to the right.',
    description: 'Maintains a sorted prefix at the beginning of the array. For each new element, scans backwards through the sorted segment and inserts it into its correct position.',
    timeComplexity: 'O(n) best / O(n²) worst',
    spaceComplexity: 'O(1) auxiliary',
    tags: ['Array', 'In-Place', 'Adaptive', 'Online'],
    defaultInput: '7, 3, 9, 2, 6',
    code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j]; // Shift right
      j = j - 1;
    }
    arr[j + 1] = key; // Place key
  }
  return arr;
}`,
    generateTraces: (inputStr: string): TraceStep[] => {
      const parsed = inputStr
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n));
      const arr = parsed.length > 0 ? parsed : [7, 3, 9, 2, 6];
      const n = arr.length;
      const current = [...arr];
      const steps: TraceStep[] = [];

      steps.push({
        step: 0,
        totalSteps: 0,
        line: 1,
        action: 'init',
        targets: [0],
        state: { arr: [...current], i: 1 },
        explanation: `Initial state: Prefix arr[0..0] (${current[0]}) is trivially sorted.`,
        invariant: 'Prefix of length 1 is sorted.',
      });

      for (let i = 1; i < n; i++) {
        const key = current[i];
        let j = i - 1;

        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 3,
          action: 'pivot',
          targets: [i],
          state: { arr: [...current], i, key, j },
          explanation: `Picking key = arr[${i}] (${key}) to insert into sorted prefix arr[0..${i - 1}].`,
          invariant: `Prefix arr[0..${i - 1}] is sorted. Key ${key} ready for insertion.`,
        });

        while (j >= 0 && current[j] > key) {
          const shiftedVal = current[j];
          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 5,
            action: 'compare',
            targets: [j, j + 1],
            state: { arr: [...current], i, j, key },
            explanation: `arr[${j}] = ${shiftedVal} > key (${key}). Shifting ${shiftedVal} right to index ${j + 1}.`,
            invariant: 'Creating open slot for key by right-shifting larger elements.',
          });

          current[j + 1] = shiftedVal;
          j = j - 1;

          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 6,
            action: 'swap',
            targets: [j + 1, j + 2],
            state: { arr: [...current], i, j, key },
            explanation: `Shifted element to index ${j + 2}. Vacant slot moved left to index ${j + 1}.`,
            invariant: 'Partial shift complete.',
          });
        }

        current[j + 1] = key;
        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 9,
          action: 'visit',
          targets: [j + 1],
          state: { arr: [...current], i, j: j + 1, key },
          explanation: `Placed key (${key}) into final position at arr[${j + 1}]. Prefix arr[0..${i}] is now sorted.`,
          invariant: `Prefix arr[0..${i}] is monotonically sorted.`,
        });
      }

      steps.push({
        step: steps.length,
        totalSteps: 0,
        line: 11,
        action: 'done',
        targets: Array.from({ length: n }, (_, k) => k),
        state: { arr: [...current] },
        explanation: 'Insertion sort completed across all elements.',
        invariant: 'Entire array is fully sorted.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  {
    id: 'quick-sort',
    title: 'QuickSort (Lomuto)',
    category: 'Foundations & Sorting',
    difficulty: 'Intermediate',
    badge: 'Divide & Conquer',
    summary: 'Partitions array around a pivot element so smaller items lie to the left and larger to the right.',
    description: 'Selects the rightmost element as the pivot, maintains a partition boundary pointer i, and scans through with pointer j. Swaps elements into the smaller partition before placing the pivot.',
    timeComplexity: 'O(n log n) avg / O(n²) worst',
    spaceComplexity: 'O(log n) call stack',
    tags: ['Divide & Conquer', 'Recursive', 'Partitioning'],
    defaultInput: '6, 2, 9, 3, 7, 5',
    code: `function partition(arr, low, high) {
  let pivot = arr[high]; // Last element as pivot
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1; // Pivot final position
}`,
    generateTraces: (inputStr: string): TraceStep[] => {
      const parsed = inputStr
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n));
      const arr = parsed.length > 0 ? parsed : [6, 2, 9, 3, 7, 5];
      const current = [...arr];
      const steps: TraceStep[] = [];
      const low = 0;
      const high = current.length - 1;
      const pivot = current[high];

      steps.push({
        step: 0,
        totalSteps: 0,
        line: 2,
        action: 'init',
        targets: [high],
        state: { arr: [...current], pivotIndex: high, pivot },
        explanation: `Selected pivot arr[${high}] = ${pivot}. Partition range [${low}..${high}].`,
        invariant: `Partitioning range [${low}..${high}] around pivot ${pivot}.`,
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        const val = current[j];

        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 5,
          action: 'compare',
          targets: [j, high],
          state: { arr: [...current], i, j, pivotIndex: high, pivot },
          explanation: `Comparing arr[${j}] = ${val} with pivot (${pivot}).`,
          invariant: `All elements in arr[0..${Math.max(-1, i)}] are < pivot.`,
        });

        if (val < pivot) {
          i++;
          const swap1 = current[i];
          const swap2 = current[j];
          current[i] = swap2;
          current[j] = swap1;

          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 7,
            action: 'swap',
            targets: [i, j],
            state: { arr: [...current], i, j, pivotIndex: high, pivot },
            explanation: `${val} < ${pivot}: Incremented i to ${i} and swapped arr[${i}] (${swap1}) with arr[${j}] (${swap2}).`,
            invariant: `Extended partition of elements smaller than pivot up to index ${i}.`,
          });
        }
      }

      // Place pivot in correct spot
      const finalPivotIdx = i + 1;
      const oldVal = current[finalPivotIdx];
      current[finalPivotIdx] = current[high];
      current[high] = oldVal;

      steps.push({
        step: steps.length,
        totalSteps: 0,
        line: 10,
        action: 'swap',
        targets: [finalPivotIdx, high],
        state: { arr: [...current], pivotIndex: finalPivotIdx, pivot },
        explanation: `Placed pivot ${pivot} into its exact final sorted position at index ${finalPivotIdx}.`,
        invariant: `∀ k < ${finalPivotIdx}: arr[k] < pivot, and ∀ k > ${finalPivotIdx}: arr[k] ≥ pivot.`,
      });

      steps.push({
        step: steps.length,
        totalSteps: 0,
        line: 11,
        action: 'done',
        targets: [finalPivotIdx],
        state: { arr: [...current], pivotIndex: finalPivotIdx },
        explanation: `Partition step complete! Pivot ${pivot} is locked at index ${finalPivotIdx}. Sub-arrays left and right recurse next.`,
        invariant: 'Lomuto partition boundary confirmed.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  // ==========================================
  // Category 2: Search & Pointers
  // ==========================================
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Search & Pointers',
    difficulty: 'Beginner',
    badge: 'Two-Pointer Halving',
    summary: 'Locates target in a sorted collection by repeatedly halving search intervals.',
    description: 'Finds the exact index of a target element in a monotonic array by comparing against the midpoint element and discarding the half where the target cannot exist.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1) auxiliary',
    tags: ['Sorted Array', 'Divide & Conquer', 'Pointers'],
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
          invariant: `Remaining search space length: ${right - left + 1} elements.`,
        });

        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 6,
          action: 'compare',
          targets: [mid],
          state: { arr: [...rawArr], left, right, mid, target },
          explanation: `Evaluating condition: arr[mid] (${midVal}) === target (${target}).`,
          invariant: `Comparing arr[${mid}] against target ${target}.`,
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
            invariant: `Target located at index ${mid}. O(log n) convergence achieved.`,
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
          explanation: `Pointers crossed (left=${left} > right=${right}). Target ${target} is not in the array.`,
          invariant: 'Search space exhausted without match.',
        });
      }

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  {
    id: 'two-pointer-sum',
    title: 'Two-Sum (Sorted)',
    category: 'Search & Pointers',
    difficulty: 'Beginner',
    badge: 'Opposite Pointers',
    summary: 'Finds two numbers in a sorted array that sum to a given target using two inward-moving pointers.',
    description: 'Starting with pointers at opposite ends of a sorted array, calculates their sum. If the sum is too small, advances the left pointer; if too large, retreats the right pointer.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) auxiliary',
    tags: ['Two Pointers', 'Array', 'LeetCode 167'],
    defaultInput: '2, 7, 11, 15, 19 | target: 18',
    code: `function twoSumSorted(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) {
      left++; // Need a larger sum
    } else {
      right--; // Need a smaller sum
    }
  }
  return [];
}`,
    generateTraces: (inputStr: string): TraceStep[] => {
      let rawArr = [2, 7, 11, 15, 19];
      let target = 18;

      if (inputStr.includes('|')) {
        const parts = inputStr.split('|');
        const numPart = parts[0]
          .split(',')
          .map((s) => Number(s.trim()))
          .filter((n) => !Number.isNaN(n));
        if (numPart.length > 0) rawArr = numPart.sort((a, b) => a - b);
        const targetMatch = parts[1].match(/-?\d+/);
        if (targetMatch) target = Number(targetMatch[0]);
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
        explanation: `Initialize left = 0 (arr[0]=${rawArr[0]}), right = ${right} (arr[${right}]=${rawArr[right]}). Target = ${target}.`,
        invariant: 'Two pointers at opposing boundaries.',
      });

      let found = false;

      while (left < right) {
        const sum = rawArr[left] + rawArr[right];

        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 5,
          action: 'compare',
          targets: [left, right],
          state: { arr: [...rawArr], left, right, target, curr: sum },
          explanation: `Summing arr[${left}] (${rawArr[left]}) + arr[${right}] (${rawArr[right]}) = ${sum}. Target is ${target}.`,
          invariant: `Current sum evaluated against target ${target}.`,
        });

        if (sum === target) {
          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 6,
            action: 'found',
            targets: [left, right],
            state: { arr: [...rawArr], left, right, target, curr: sum },
            explanation: `Exact sum matched! arr[${left}] (${rawArr[left]}) + arr[${right}] (${rawArr[right]}) = ${target}.`,
            invariant: `Solution found at indices [${left}, ${right}].`,
          });
          found = true;
          break;
        }

        if (sum < target) {
          left++;
          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 8,
            action: 'visit',
            targets: [left, right],
            state: { arr: [...rawArr], left, right, target, curr: sum },
            explanation: `Sum ${sum} < target ${target}. Advancing left pointer to ${left} to increase sum.`,
            invariant: 'Eliminated left index: no paired right value can satisfy target.',
          });
        } else {
          right--;
          steps.push({
            step: steps.length,
            totalSteps: 0,
            line: 10,
            action: 'visit',
            targets: [left, right],
            state: { arr: [...rawArr], left, right, target, curr: sum },
            explanation: `Sum ${sum} > target ${target}. Retreating right pointer to ${right} to decrease sum.`,
            invariant: 'Eliminated right index: no paired left value can satisfy target.',
          });
        }
      }

      if (!found) {
        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 13,
          action: 'not-found',
          targets: [],
          state: { arr: [...rawArr], left, right, target },
          explanation: `Pointers met without finding any pair summing to ${target}.`,
          invariant: 'No valid pair exists.',
        });
      }

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  // ==========================================
  // Category 3: Modern AI & LLMs
  // ==========================================
  {
    id: 'ai-next-token',
    title: 'Self-Attention & Next-Token Logits',
    category: 'Modern AI & LLMs',
    difficulty: 'Advanced',
    badge: 'Transformer / LLM',
    summary: 'Visualizes causal attention weights across context tokens and the resulting softmax next-token probability distribution.',
    description: 'Traces the transformer forward pass: projecting query and key vectors from prompt context, computing scaled dot-product attention scores, applying causal masking, and projecting final logits onto vocabulary tokens.',
    timeComplexity: 'O(N² · d) attention',
    spaceComplexity: 'O(N · d) KV-Cache',
    tags: ['Transformer', 'Attention', 'Softmax', 'LLMs'],
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
