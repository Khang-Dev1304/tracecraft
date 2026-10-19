import type { AlgorithmPreset, TraceStep } from '../types';

export const ALGORITHM_PRESETS: AlgorithmPreset[] = [
  // ==========================================
  // Category 1: Classical Machine Learning
  // ==========================================
  {
    id: 'linear-regression',
    title: 'Linear Regression & Gradient Descent',
    category: 'Classical Machine Learning',
    difficulty: 'Beginner',
    badge: 'Optimization',
    visualType: 'regression-plot',
    formula: 'y = w \\cdot x + b, \\quad L = \\frac{1}{N}\\sum_{i=1}^N (\\hat{y}_i - y_i)^2',
    summary: 'Fits an optimal line to 2D continuous data by iteratively minimizing Mean Squared Error (MSE) using gradient descent.',
    description: 'Linear Regression models the relationship between an input feature X and a target variable y. Gradient Descent computes the partial derivatives of the MSE loss with respect to weight w and bias b, updating parameters in the opposite direction of the gradient.',
    sections: [
      {
        title: '1. The Core Objective: Minimizing Residuals',
        content: 'Given data points (X, y), our model predicts y_pred = w * x + b. For each point, the prediction error (residual) is (y_pred - y). We square these errors to heavily penalize large deviations and eliminate negative signs, producing the Mean Squared Error (MSE) objective function.',
        formula: 'MSE(w, b) = \\frac{1}{n} \\sum_{i=1}^n (w \\cdot x_i + b - y_i)^2',
        keyTakeaway: 'The MSE cost function forms a convex parabolic bowl with a single global minimum.',
      },
      {
        title: '2. Gradient Descent Derivation',
        content: 'To find the optimal w and b, we compute the gradient (vector of partial derivatives) of MSE with respect to each parameter. By the chain rule: d/dw = (2/n) * sum(x * (y_pred - y)) and d/db = (2/n) * sum(y_pred - y).',
        formula: 'w \\leftarrow w - \\alpha \\frac{\\partial L}{\\partial w}, \\quad b \\leftarrow b - \\alpha \\frac{\\partial L}{\\partial b}',
        keyTakeaway: 'The learning rate alpha controls step size. Too high causes divergence; too low slows convergence.',
      },
      {
        title: '3. Why It Matters in Modern AI',
        content: 'Linear regression with gradient descent is the conceptual foundation of all deep learning: computing predictions, calculating loss, taking gradients, and backpropagating parameter updates.',
        keyTakeaway: 'Deep neural networks are essentially stacked non-linear regressions optimized by variants of this same gradient rule.',
      },
    ],
    timeComplexity: 'O(epochs · N)',
    spaceComplexity: 'O(1) parameters',
    tags: ['Supervised', 'Regression', 'Gradient Descent', 'MSE Loss', 'NumPy'],
    defaultInput: '(1, 2.2), (2, 2.8), (3, 4.5), (4, 4.9), (5, 6.2)',
    pythonCode: `import numpy as np

def linear_regression(X, y, lr=0.06, epochs=8):
    w, b = 0.0, 0.0  # Initialize weights at zero
    n = len(X)
    
    for epoch in range(epochs):
        # 1. Forward Pass: compute predictions
        y_pred = w * X + b
        
        # 2. Compute Loss: Mean Squared Error
        loss = np.mean((y_pred - y) ** 2)
        
        # 3. Compute Gradients via Chain Rule
        grad_w = (2 / n) * np.sum(X * (y_pred - y))
        grad_b = (2 / n) * np.sum(y_pred - y)
        
        # 4. Parameter Update
        w -= lr * grad_w
        b -= lr * grad_b
        
    return w, b`,
    code: `import numpy as np

def linear_regression(X, y, lr=0.06, epochs=8):
    w, b = 0.0, 0.0  # Initialize weights
    n = len(X)
    for epoch in range(epochs):
        y_pred = w * X + b  # Forward prediction
        loss = np.mean((y_pred - y) ** 2)  # MSE Loss
        grad_w = (2 / n) * np.sum(X * (y_pred - y))
        grad_b = (2 / n) * np.sum(y_pred - y)
        w -= lr * grad_w  # Update weight
        b -= lr * grad_b  # Update bias
    return w, b`,
    generateTraces: (): TraceStep[] => {
      // Default sample 2D data points
      const points = [
        { x: 1, y: 2.2 },
        { x: 2, y: 2.8 },
        { x: 3, y: 4.5 },
        { x: 4, y: 4.9 },
        { x: 5, y: 6.2 },
      ];
      const n = points.length;
      const lr = 0.06;
      let w = 0.2;
      let b = 0.5;

      const steps: TraceStep[] = [];

      // Step 0: init
      const initPoints = points.map((p) => ({ ...p, yPred: Number((w * p.x + b).toFixed(2)) }));
      const initLoss = Number(
        (initPoints.reduce((acc, p) => acc + (p.yPred! - p.y) ** 2, 0) / n).toFixed(3)
      );

      steps.push({
        step: 0,
        totalSteps: 0,
        line: 4,
        action: 'init',
        targets: [],
        state: {
          epoch: 0,
          weight: w,
          bias: b,
          learningRate: lr,
          loss: initLoss,
          points: initPoints,
        },
        explanation: `Initialized weights at w = ${w}, b = ${b}. Starting Mean Squared Error Loss: ${initLoss}.`,
        invariant: 'Untrained random line. Gradient step counter epoch = 0.',
      });

      for (let epoch = 1; epoch <= 7; epoch++) {
        // Forward pass
        const currentPoints = points.map((p) => ({
          ...p,
          yPred: Number((w * p.x + b).toFixed(2)),
        }));
        const lossVal = Number(
          (currentPoints.reduce((acc, p) => acc + (p.yPred! - p.y) ** 2, 0) / n).toFixed(3)
        );

        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 7,
          action: 'forward',
          targets: [],
          state: {
            epoch,
            weight: Number(w.toFixed(2)),
            bias: Number(b.toFixed(2)),
            loss: lossVal,
            points: currentPoints,
          },
          explanation: `Epoch #${epoch}: Forward pass computed predictions y_pred = ${w.toFixed(2)}x + ${b.toFixed(2)}. Current MSE Loss: ${lossVal}.`,
          invariant: `MSE Loss evaluates current fit quality. Target is local/global minimum.`,
        });

        // Compute Gradients
        const gradW = Number(
          ((2 / n) * currentPoints.reduce((acc, p) => acc + p.x * (p.yPred! - p.y), 0)).toFixed(3)
        );
        const gradB = Number(
          ((2 / n) * currentPoints.reduce((acc, p) => acc + (p.yPred! - p.y), 0)).toFixed(3)
        );

        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 9,
          action: 'backward',
          targets: [],
          state: {
            epoch,
            weight: Number(w.toFixed(2)),
            bias: Number(b.toFixed(2)),
            gradW,
            gradB,
            loss: lossVal,
            points: currentPoints,
          },
          explanation: `Calculated gradients via chain rule: ∂L/∂w = ${gradW}, ∂L/∂b = ${gradB}. Negative gradient directs downhill step.`,
          invariant: 'Gradient vector ∇L points in direction of steepest ascent.',
        });

        // Update weights
        const oldW = Number(w.toFixed(2));
        const oldB = Number(b.toFixed(2));
        w = w - lr * gradW;
        b = b - lr * gradB;

        const updatedPoints = points.map((p) => ({
          ...p,
          yPred: Number((w * p.x + b).toFixed(2)),
        }));
        const newLoss = Number(
          (updatedPoints.reduce((acc, p) => acc + (p.yPred! - p.y) ** 2, 0) / n).toFixed(3)
        );

        steps.push({
          step: steps.length,
          totalSteps: 0,
          line: 11,
          action: 'update',
          targets: [],
          state: {
            epoch,
            weight: Number(w.toFixed(2)),
            bias: Number(b.toFixed(2)),
            loss: newLoss,
            points: updatedPoints,
          },
          explanation: `Parameter update: w = ${w.toFixed(2)} (changed by ${(-lr * gradW).toFixed(2)}), b = ${b.toFixed(2)}. Loss dropped to ${newLoss}.`,
          invariant: 'Loss strictly non-increasing under appropriate learning rate.',
          variableDiff: {
            w: { before: oldW, after: Number(w.toFixed(2)) },
            b: { before: oldB, after: Number(b.toFixed(2)) },
            loss: { before: lossVal, after: newLoss },
          },
        });
      }

      // Final step: converged
      steps.push({
        step: steps.length,
        totalSteps: 0,
        line: 13,
        action: 'converged',
        targets: [],
        state: {
          epoch: 8,
          weight: Number(w.toFixed(2)),
          bias: Number(b.toFixed(2)),
          loss: Number(
            (
              points.reduce(
                (acc, p) => acc + (Number((w * p.x + b).toFixed(2)) - p.y) ** 2,
                0
              ) / n
            ).toFixed(3)
          ),
          points: points.map((p) => ({
            ...p,
            yPred: Number((w * p.x + b).toFixed(2)),
          })),
        },
        explanation: `Gradient descent converged! Best fit line: y = ${w.toFixed(2)}x + ${b.toFixed(2)}. Residual variance minimized.`,
        invariant: '||∇L|| ≈ 0: Parameter weights reside at local convex minimum.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  // ==========================================
  // Category 2: Deep Learning & Neural Networks
  // ==========================================
  {
    id: 'neural-network-mlp',
    title: 'Multi-Layer Perceptron (MLP) Forward Pass',
    category: 'Deep Learning & Neural Networks',
    difficulty: 'Intermediate',
    badge: 'Feedforward',
    visualType: 'neural-network',
    formula: 'h = \\text{ReLU}(W_1 x + b_1), \\quad \\hat{y} = \\sigma(W_2 h + b_2)',
    summary: 'Propagates input activations through hidden layers with ReLU non-linearities to calculate final network predictions.',
    description: 'A Multi-Layer Perceptron (MLP) maps non-linear input features into high-dimensional representations. Traces how weighted sums and activation functions fire across artificial neurons.',
    sections: [
      {
        title: '1. Why Hidden Layers Enable Non-Linearity',
        content: 'A single linear layer can only learn linear decision boundaries (hyperplanes). By stacking layers with non-linear activation functions like ReLU (max(0, z)), deep neural networks can approximate any continuous mathematical function (Universal Approximation Theorem).',
        formula: '\\text{ReLU}(z) = \\max(0, z)',
        keyTakeaway: 'Without non-linear activations, stacking 100 linear layers collapses mathematically into just one linear layer.',
      },
      {
        title: '2. The Matrix Multiplication Step',
        content: 'For layer l, we compute z^[l] = W^[l] * a^[l-1] + b^[l], followed by element-wise activation a^[l] = g(z^[l]). Forward propagation chains these operations from input to output.',
        formula: 'z^{[1]} = W^{[1]} x + b^{[1]}, \\quad a^{[1]} = \\text{ReLU}(z^{[1]})',
        keyTakeaway: 'Matrix multiplications run in parallel on GPUs, which is why AI hardware excels at matrix tensor cores.',
      },
      {
        title: '3. Connecting Forward to Backprop',
        content: 'During inference, only the forward pass runs. During training, the prediction error generates gradients that travel backwards via the Chain Rule to update each weight matrix.',
        keyTakeaway: 'The forward activations computed here are cached in memory for use during the backward gradient pass.',
      },
    ],
    timeComplexity: 'O(∑ d_{in} · d_{out})',
    spaceComplexity: 'O(∑ d_l) activations',
    tags: ['Neural Network', 'MLP', 'ReLU', 'Forward Pass', 'PyTorch'],
    defaultInput: 'x1: 0.8, x2: 0.4',
    pythonCode: `import torch
import torch.nn as nn

class SimpleMLP(nn.Module):
    def __init__(self):
        super().__init__()
        # Input: 2 features, Hidden: 3 neurons, Output: 1 score
        self.fc1 = nn.Linear(2, 3)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(3, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # 1. Hidden Layer Linear Projection
        z1 = self.fc1(x)
        # 2. ReLU Activation
        h1 = self.relu(z1)
        # 3. Output Layer Linear Projection
        z2 = self.fc2(h1)
        # 4. Sigmoid Probability Output
        y_hat = self.sigmoid(z2)
        return y_hat`,
    code: `import torch
import torch.nn as nn

def forward_mlp(x, W1, b1, W2, b2):
    # 1. Hidden Layer Weighted Sum
    z1 = np.dot(x, W1) + b1
    # 2. Non-linear Activation (ReLU)
    h1 = np.maximum(0, z1)
    # 3. Output Layer Weighted Sum
    z2 = np.dot(h1, W2) + b2
    # 4. Sigmoid Probability Activation
    y_hat = 1 / (1 + np.exp(-z2))
    return y_hat`,
    generateTraces: (): TraceStep[] => {
      const steps: TraceStep[] = [];

      // Step 1: Input Layer
      steps.push({
        step: 0,
        totalSteps: 0,
        line: 2,
        action: 'init',
        targets: [0, 1],
        state: {
          layers: [
            {
              name: 'Input Layer',
              nodes: [
                { label: 'x₁', value: 0.8 },
                { label: 'x₂', value: 0.4 },
              ],
            },
            {
              name: 'Hidden Layer',
              nodes: [
                { label: 'h₁', value: 0 },
                { label: 'h₂', value: 0 },
                { label: 'h₃', value: 0 },
              ],
            },
            {
              name: 'Output Layer',
              nodes: [{ label: 'ŷ', value: 0 }],
            },
          ],
        },
        explanation: 'Input Layer initialized with feature vector x = [0.8, 0.4]. Ready to compute forward activation.',
        invariant: 'Input features are normalized in range [0, 1].',
      });

      // Step 2: Linear transformation into Hidden Layer (z1)
      steps.push({
        step: 1,
        totalSteps: 0,
        line: 4,
        action: 'compute',
        targets: [0, 1, 2],
        state: {
          layers: [
            {
              name: 'Input Layer',
              nodes: [
                { label: 'x₁', value: 0.8 },
                { label: 'x₂', value: 0.4 },
              ],
            },
            {
              name: 'Hidden Layer (Pre-activation z₁)',
              nodes: [
                { label: 'z₁', value: 1.12 },
                { label: 'z₂', value: -0.45 },
                { label: 'z₃', value: 0.84 },
              ],
            },
            {
              name: 'Output Layer',
              nodes: [{ label: 'ŷ', value: 0 }],
            },
          ],
        },
        explanation: 'Computed linear combination z₁ = W₁ · x + b₁. Notice node z₂ = -0.45 is negative.',
        invariant: 'Affine projection z = Wx + b preserves linear dimensionality.',
      });

      // Step 3: ReLU Activation
      steps.push({
        step: 2,
        totalSteps: 0,
        line: 6,
        action: 'forward',
        targets: [0, 1, 2],
        state: {
          layers: [
            {
              name: 'Input Layer',
              nodes: [
                { label: 'x₁', value: 0.8 },
                { label: 'x₂', value: 0.4 },
              ],
            },
            {
              name: 'Hidden Layer (Activated h₁)',
              nodes: [
                { label: 'h₁ (ReLU)', value: 1.12 },
                { label: 'h₂ (ReLU)', value: 0.0 }, // clamped by ReLU!
                { label: 'h₃ (ReLU)', value: 0.84 },
              ],
            },
            {
              name: 'Output Layer',
              nodes: [{ label: 'ŷ', value: 0 }],
            },
          ],
        },
        explanation: 'Applied ReLU activation: max(0, z). Node z₂ (-0.45) clamped to 0.0 (inactive neuron sparsity).',
        invariant: 'ReLU(z) enforces non-negativity: a ∈ [0, ∞).',
      });

      // Step 4: Output Layer projection & Sigmoid
      steps.push({
        step: 3,
        totalSteps: 0,
        line: 8,
        action: 'done',
        targets: [0],
        state: {
          loss: 0.042,
          layers: [
            {
              name: 'Input Layer',
              nodes: [
                { label: 'x₁', value: 0.8 },
                { label: 'x₂', value: 0.4 },
              ],
            },
            {
              name: 'Hidden Layer (Activated)',
              nodes: [
                { label: 'h₁', value: 1.12 },
                { label: 'h₂', value: 0.0 },
                { label: 'h₃', value: 0.84 },
              ],
            },
            {
              name: 'Output Layer (ŷ)',
              nodes: [{ label: 'ŷ (Sigmoid)', value: 0.87 }],
            },
          ],
        },
        explanation: 'Forward pass complete! Final output neuron ŷ = 0.87 (87% positive class probability). Binary Cross-Entropy Loss: 0.042.',
        invariant: 'Output normalized into valid class probability distribution via Sigmoid.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  // ==========================================
  // Category 3: Transformers & Modern LLMs
  // ==========================================
  {
    id: 'self-attention',
    title: 'Self-Attention Mechanism (Q, K, V)',
    category: 'Transformers & Modern LLMs',
    difficulty: 'Advanced',
    badge: 'Core Transformer',
    visualType: 'attention-matrix',
    formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V',
    summary: 'Calculates dynamic relevance scores between all token pairs in an input prompt to capture contextual meaning.',
    description: 'The foundation of all Modern LLMs (GPT-4, Claude, LLaMA). Each token generates Query (Q), Key (K), and Value (V) embedding vectors. The dot product of Query and Keys measures semantic compatibility.',
    sections: [
      {
        title: '1. Why Self-Attention Revolutionized NLP',
        content: 'Earlier recurrent models (RNNs/LSTMs) processed words sequentially, causing memory bottlenecks over long paragraphs. Self-Attention allows every word to interact directly with every other word in constant O(1) path length, running massively in parallel on GPUs.',
        formula: 'S_{ij} = \\frac{q_i \\cdot k_j^T}{\\sqrt{d_k}}',
        keyTakeaway: 'Attention solves the long-range dependency problem by replacing sequential recurrence with matrix dot products.',
      },
      {
        title: '2. The Role of Query, Key, and Value',
        content: 'Think of Query as a search query ("What is the subject of this sentence?"), Keys as indexed tags on words in the context, and Values as the actual semantic content retrieved when a Query and Key match.',
        keyTakeaway: 'Softmax turns dot products into a probability distribution summing to 1.0, directing the model where to focus.',
      },
      {
        title: '3. Causal Masking in Generative LLMs',
        content: 'In autoregressive generation (GPT models), tokens must not peek into the future. A lower-triangular causal mask fills future positions with -inf, so softmax zeroes them out.',
        formula: '\\text{Masked}(S_{ij}) = -\\infty \\quad \\text{if } j > i',
        keyTakeaway: 'Causal masking enforces strict temporal directionality during training and generation.',
      },
    ],
    timeComplexity: 'O(N² · d)',
    spaceComplexity: 'O(N · d) KV-Cache',
    tags: ['Transformer', 'Attention', 'Softmax', 'LLMs', 'PyTorch'],
    defaultInput: 'The, quick, brown, fox, jumps',
    pythonCode: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, d_k):
    # 1. Compute Raw Attention Scores
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    
    # 2. Apply Causal Mask (prevent looking ahead)
    seq_len = Q.size(-2)
    mask = torch.tril(torch.ones(seq_len, seq_len))
    scores = scores.masked_fill(mask == 0, float('-inf'))
    
    # 3. Softmax Normalization
    weights = F.softmax(scores, dim=-1)
    
    # 4. Weighted Sum of Values
    output = torch.matmul(weights, V)
    return output, weights`,
    code: `import torch
import torch.nn.functional as F

def forward_attention(Q, K, V, d_k):
    # 1. Scaled Dot-Product of Query & Key
    scores = torch.matmul(Q, K.T) / (d_k ** 0.5)
    # 2. Causal Masking (Lower Triangular)
    scores = apply_causal_mask(scores)
    # 3. Softmax Probabilities
    attn_weights = F.softmax(scores, dim=-1)
    # 4. Contextual Value Aggregation
    context = torch.matmul(attn_weights, V)
    return context`,
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
        explanation: `Context window initialized with ${activeTokens.length} tokens. Active Query vector projected from last token "${lastToken}".`,
        invariant: 'Autoregressive sequence: prior tokens stored in KV-Cache.',
      });

      steps.push({
        step: 1,
        totalSteps: 0,
        line: 5,
        action: 'compute',
        targets: [activeTokens.length - 1],
        state: {
          tokens: activeTokens,
          probabilities: [
            { token: 'over', prob: 0.28 },
            { token: 'high', prob: 0.18 },
            { token: 'away', prob: 0.12 },
            { token: 'through', prob: 0.08 },
          ],
        },
        explanation: `Scaled dot-product: Q · K^T / √d_k. Computes contextual correlation scores between "${lastToken}" and all prior tokens.`,
        invariant: 'Scaling by 1/√d_k prevents dot-product values from growing too large into vanishing gradient softmax regions.',
      });

      steps.push({
        step: 2,
        totalSteps: 0,
        line: 7,
        action: 'forward',
        targets: [1, 3, activeTokens.length - 1],
        state: {
          tokens: activeTokens,
          probabilities: [
            { token: 'over', prob: 0.52 },
            { token: 'high', prob: 0.20 },
            { token: 'away', prob: 0.14 },
            { token: 'onto', prob: 0.08 },
          ],
        },
        explanation: `Softmax applied across row: Highest attention score placed on subject token "fox" (44%) and verb "${lastToken}" (38%).`,
        invariant: '∑_j Attention[i, j] = 1.0 across the sequence dimension.',
      });

      steps.push({
        step: 3,
        totalSteps: 0,
        line: 9,
        action: 'done',
        targets: [activeTokens.length - 1],
        state: {
          tokens: activeTokens,
          probabilities: [
            { token: 'over', prob: 0.76 },
            { token: 'high', prob: 0.13 },
            { token: 'away', prob: 0.05 },
            { token: 'onto', prob: 0.04 },
            { token: 'into', prob: 0.02 },
          ],
        },
        explanation: `Value aggregation complete! Context vector passed to Language Model Head. Top-1 predicted next token: "over" (76% probability).`,
        invariant: 'Autoregressive generation step complete; ready to sample next token.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },
];
