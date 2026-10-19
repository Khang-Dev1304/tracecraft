import type { AlgorithmPreset, TraceStep, Language } from '../types';

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
    inputVariants: [
      { label: 'Standard', value: '(1, 2.2), (2, 2.8), (3, 4.5), (4, 4.9), (5, 6.2)' },
      { label: 'Noisy', value: '(1, 1.4), (2, 3.8), (3, 3.1), (4, 5.9), (5, 5.2)' },
      { label: 'Outlier', value: '(1, 2.0), (2, 2.5), (3, 3.0), (4, 3.5), (5, 8.5)' },
      { label: 'Steep', value: '(1, 0.5), (2, 2.4), (3, 4.2), (4, 6.1), (5, 8.0)' },
    ],
    vi: {
      title: 'Hồi quy Tuyến tính & Hạ Gradient',
      category: 'Học máy Cổ điển',
      badge: 'Tối ưu hóa',
      summary: 'Khớp đường thẳng tối ưu với dữ liệu 2D liên tục bằng cách cực tiểu hóa sai số toàn phương trung bình (MSE) qua thuật toán hạ gradient.',
      description: 'Hồi quy tuyến tính mô hình hóa tương quan giữa biến đặc trưng đầu vào X và biến mục tiêu y. Thuật toán Hạ Gradient tính đạo hàm riêng của hàm mất mát MSE theo trọng số w và độ lệch b, cập nhật tham số ngược hướng dốc gradient để tìm đáy tối ưu.',
      variants: [
        { label: 'Chuẩn', value: '(1, 2.2), (2, 2.8), (3, 4.5), (4, 4.9), (5, 6.2)' },
        { label: 'Nhiễu', value: '(1, 1.4), (2, 3.8), (3, 3.1), (4, 5.9), (5, 5.2)' },
        { label: 'Ngoại lai', value: '(1, 2.0), (2, 2.5), (3, 3.0), (4, 3.5), (5, 8.5)' },
        { label: 'Dốc cao', value: '(1, 0.5), (2, 2.4), (3, 4.2), (4, 6.1), (5, 8.0)' },
      ],
      sections: [
        {
          title: '1. Mục tiêu Cốt lõi: Cực tiểu hóa Sai số Dư (Residuals)',
          content: 'Với mỗi điểm dữ liệu (X, y), mô hình dự đoán y_pred = w * x + b. Phần dư là (y_pred - y). Ta bình phương sai số này để loại bỏ dấu âm và phạt nặng sai lệch lớn, tạo nên hàm mất mát Sai số Toàn phương Trung bình (MSE).',
          formula: 'MSE(w, b) = \\frac{1}{n} \\sum_{i=1}^n (w \\cdot x_i + b - y_i)^2',
          keyTakeaway: 'Hàm mất mát MSE có dạng parabol lồi (convex), đảm bảo chỉ tồn tại một nghiệm cực tiểu toàn cục duy nhất.',
        },
        {
          title: '2. Đạo hàm và Quy tắc Cập nhật Hạ Gradient',
          content: 'Để tìm w và b tối ưu, ta tính vector đạo hàm riêng (gradient) của hàm MSE theo từng tham số theo quy tắc chuỗi: d/dw = (2/n) * sum(x * (y_pred - y)) và d/db = (2/n) * sum(y_pred - y).',
          formula: 'w \\leftarrow w - \\alpha \\frac{\\partial L}{\\partial w}, \\quad b \\leftarrow b - \\alpha \\frac{\\partial L}{\\partial b}',
          keyTakeaway: 'Tốc độ học α quyết định bước nhảy. Nếu quá lớn thuật toán sẽ phân kỳ; nếu quá nhỏ sẽ hội tụ rất chậm.',
        },
        {
          title: '3. Tầm quan trọng trong Nền tảng Học Sâu',
          content: 'Hồi quy tuyến tính kết hợp hạ gradient là viên gạch nền tảng của toàn bộ AI hiện đại: tính lan truyền xuôi, tính hàm mất mát, lấy đạo hàm ngược và lan truyền cập nhật trọng số.',
          keyTakeaway: 'Mạng nơ-ron sâu bản chất là sự xếp chồng của nhiều phép biến đổi phi tuyến được tối ưu bằng các biến thể của thuật toán hạ gradient.',
        },
      ],
    },
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
    generateTraces: (inputStr?: string, lang: Language = 'en'): TraceStep[] => {
      const isVi = lang === 'vi';
      let points = [
        { x: 1, y: 2.2 },
        { x: 2, y: 2.8 },
        { x: 3, y: 4.5 },
        { x: 4, y: 4.9 },
        { x: 5, y: 6.2 },
      ];
      if (inputStr) {
        const matches = [...inputStr.matchAll(/\(?\s*([0-9.]+)\s*[,:]\s*([0-9.]+)\s*\)?/g)];
        if (matches.length >= 2) {
          points = matches.map((m) => ({ x: Number(m[1]), y: Number(m[2]) }));
        }
      }
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
        explanation: isVi
          ? `Khởi tạo trọng số ban đầu: w = ${w}, b = ${b}. Sai số mất mát MSE ban đầu: ${initLoss}.`
          : `Initialized weights at w = ${w}, b = ${b}. Starting Mean Squared Error Loss: ${initLoss}.`,
        invariant: isVi
          ? 'Đường ngẫu nhiên chưa huấn luyện. Bước hạ gradient ban đầu: epoch = 0.'
          : 'Untrained random line. Gradient step counter epoch = 0.',
      });

      for (let epoch = 1; epoch <= 7; epoch++) {
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
          explanation: isVi
            ? `Epoch #${epoch}: Lan truyền xuôi tính dự đoán y_pred = ${w.toFixed(2)}x + ${b.toFixed(2)}. Mất mát MSE: ${lossVal}.`
            : `Epoch #${epoch}: Forward pass computed predictions y_pred = ${w.toFixed(2)}x + ${b.toFixed(2)}. Current MSE Loss: ${lossVal}.`,
          invariant: isVi
            ? 'Độ dốc của hàm mất mát đánh giá chất lượng khớp đường thẳng hiện tại.'
            : `MSE Loss evaluates current fit quality. Target is local/global minimum.`,
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
          explanation: isVi
            ? `Tính gradient theo quy tắc chuỗi: ∂L/∂w = ${gradW}, ∂L/∂b = ${gradB}. Hướng ngược gradient chỉ đường dốc xuống đáy bát.`
            : `Calculated gradients via chain rule: ∂L/∂w = ${gradW}, ∂L/∂b = ${gradB}. Negative gradient directs downhill step.`,
          invariant: isVi
            ? 'Vector gradient ∇L chỉ hướng dốc tăng nhanh nhất; ta đi ngược lại để cực tiểu hóa hàm số.'
            : 'Gradient vector ∇L points in direction of steepest ascent.',
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
          explanation: isVi
            ? `Cập nhật tham số: w = ${w.toFixed(2)} (thay đổi ${(-lr * gradW).toFixed(2)}), b = ${b.toFixed(2)}. Mất mát MSE giảm xuống còn ${newLoss}.`
            : `Parameter update: w = ${w.toFixed(2)} (changed by ${(-lr * gradW).toFixed(2)}), b = ${b.toFixed(2)}. Loss dropped to ${newLoss}.`,
          invariant: isVi
            ? 'Hàm mất mát đơn điệu giảm dần dưới tốc độ học phù hợp.'
            : 'Loss strictly non-increasing under appropriate learning rate.',
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
        explanation: isVi
          ? `Hạ gradient đã hội tụ! Đường khớp tối ưu: y = ${w.toFixed(2)}x + ${b.toFixed(2)}. Phần dư sai số đạt mức tối thiểu.`
          : `Gradient descent converged! Best fit line: y = ${w.toFixed(2)}x + ${b.toFixed(2)}. Residual variance minimized.`,
        invariant: isVi
          ? '||∇L|| ≈ 0: Vector trọng số đã chạm đáy cực tiểu lồi.'
          : '||∇L|| ≈ 0: Parameter weights reside at local convex minimum.',
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
    inputVariants: [
      { label: 'Standard', value: 'x1: 0.8, x2: 0.4' },
      { label: 'High Drive', value: 'x1: 1.5, x2: 1.2' },
      { label: 'Negative In', value: 'x1: -0.6, x2: 0.8' },
      { label: 'Zero In', value: 'x1: 0.0, x2: 0.0' },
    ],
    vi: {
      title: 'Mạng Nơ-ron Đa tầng (MLP) Lan truyền Xuôi',
      category: 'Học sâu & Mạng Nơ-ron',
      badge: 'Lan truyền tiến',
      summary: 'Truyền các giá trị kích hoạt qua các tầng ẩn với hàm phi tuyến ReLU để tính toán xác suất phân loại đầu ra.',
      description: 'Mạng Perceptron Đa tầng (MLP) ánh xạ các đặc trưng đầu vào phi tuyến sang không gian biểu diễn chiều cao. Quan sát tổ hợp tuyến tính và các hàm kích hoạt lan truyền qua từng nơ-ron nhân tạo.',
      variants: [
        { label: 'Chuẩn', value: 'x1: 0.8, x2: 0.4' },
        { label: 'Biên độ cao', value: 'x1: 1.5, x2: 1.2' },
        { label: 'Đầu vào âm', value: 'x1: -0.6, x2: 0.8' },
        { label: 'Điểm gốc 0', value: 'x1: 0.0, x2: 0.0' },
      ],
      sections: [
        {
          title: '1. Tại sao Tầng Ẩn tạo nên Tính Phi tuyến tính?',
          content: 'Một tầng tuyến tính đơn lẻ chỉ có thể học được ranh giới quyết định tuyến tính (siêu phẳng). Bằng cách xếp chồng các tầng với các hàm kích hoạt phi tuyến như ReLU (max(0, z)), mạng nơ-ron có thể xấp xỉ bất kỳ hàm số toán học liên tục nào (Định lý Xấp xỉ Phổ quát).',
          formula: '\\text{ReLU}(z) = \\max(0, z)',
          keyTakeaway: 'Nếu không có hàm phi tuyến, việc xếp chồng 100 tầng tuyến tính sẽ sụp đổ về mặt toán học thành đúng một tầng tuyến tính duy nhất.',
        },
        {
          title: '2. Phép Nhân Ma trận và Kích hoạt Nơ-ron',
          content: 'Với mỗi tầng l, ta tính z^[l] = W^[l] * a^[l-1] + b^[l], sau đó áp dụng hàm kích hoạt a^[l] = g(z^[l]). Phép lan truyền tiến xâu chuỗi các phép tính này từ tầng đầu vào đến tầng đầu ra.',
          formula: 'z^{[1]} = W^{[1]} x + b^{[1]}, \\quad a^{[1]} = \\text{ReLU}(z^{[1]})',
          keyTakeaway: 'Phép nhân ma trận chạy song song cực nhanh trên GPU, giải thích lý do vì sao chip phần cứng AI được tối ưu hóa cho các lõi tensor ma trận.',
        },
        {
          title: '3. Kết nối Lan truyền Xuôi với Lan truyền Ngược (Backprop)',
          content: 'Trong giai đoạn suy luận (inference), mô hình chỉ chạy lan truyền xuôi. Trong giai đoạn huấn luyện, sai số đầu ra tạo ra gradient truyền ngược theo Chain Rule để cập nhật từng ma trận trọng số.',
          keyTakeaway: 'Các giá trị kích hoạt được lưu tạm trong bộ nhớ (cache) để tái sử dụng trong pha lan truyền ngược.',
        },
      ],
    },
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
    generateTraces: (_inputStr?: string, lang: Language = 'en'): TraceStep[] => {
      const isVi = lang === 'vi';
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
              name: isVi ? 'Tầng Đầu vào (Input)' : 'Input Layer',
              nodes: [
                { label: 'x₁', value: 0.8 },
                { label: 'x₂', value: 0.4 },
              ],
            },
            {
              name: isVi ? 'Tầng Ẩn (Hidden)' : 'Hidden Layer',
              nodes: [
                { label: 'h₁', value: 0 },
                { label: 'h₂', value: 0 },
                { label: 'h₃', value: 0 },
              ],
            },
            {
              name: isVi ? 'Tầng Đầu ra (Output)' : 'Output Layer',
              nodes: [{ label: 'ŷ', value: 0 }],
            },
          ],
        },
        explanation: isVi
          ? 'Tầng đầu vào khởi tạo với vector đặc trưng x = [0.8, 0.4]. Sẵn sàng tính toán lan truyền tiến.'
          : 'Input Layer initialized with feature vector x = [0.8, 0.4]. Ready to compute forward activation.',
        invariant: isVi
          ? 'Đặc trưng đầu vào được chuẩn hóa trong khoảng [0, 1].'
          : 'Input features are normalized in range [0, 1].',
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
              name: isVi ? 'Tầng Đầu vào' : 'Input Layer',
              nodes: [
                { label: 'x₁', value: 0.8 },
                { label: 'x₂', value: 0.4 },
              ],
            },
            {
              name: isVi ? 'Tầng Ẩn (Giá trị z₁)' : 'Hidden Layer (Pre-activation z₁)',
              nodes: [
                { label: 'h₁', value: 1.12 },
                { label: 'h₂', value: -0.45 },
                { label: 'h₃', value: 0.84 },
              ],
            },
            {
              name: isVi ? 'Tầng Đầu ra' : 'Output Layer',
              nodes: [{ label: 'ŷ', value: 0 }],
            },
          ],
        },
        explanation: isVi
          ? 'Tính tổ hợp tuyến tính z₁ = W₁ · x + b₁. Lưu ý nơ-ron h₂ = -0.45 mang giá trị âm.'
          : 'Computed linear combination z₁ = W₁ · x + b₁. Notice node h₂ = -0.45 is negative.',
        invariant: isVi
          ? 'Phép chiếu affine z = Wx + b bảo toàn tính tuyến tính không gian.'
          : 'Affine projection z = Wx + b preserves linear dimensionality.',
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
              name: isVi ? 'Tầng Đầu vào' : 'Input Layer',
              nodes: [
                { label: 'x₁', value: 0.8 },
                { label: 'x₂', value: 0.4 },
              ],
            },
            {
              name: isVi ? 'Tầng Ẩn (Đã kích hoạt ReLU)' : 'Hidden Layer (Activated h₁)',
              nodes: [
                { label: 'h₁', value: 1.12, activation: 'ReLU' },
                { label: 'h₂', value: 0.0, activation: 'ReLU' }, // clamped by ReLU!
                { label: 'h₃', value: 0.84, activation: 'ReLU' },
              ],
            },
            {
              name: isVi ? 'Tầng Đầu ra' : 'Output Layer',
              nodes: [{ label: 'ŷ', value: 0 }],
            },
          ],
        },
        explanation: isVi
          ? 'Áp dụng hàm kích hoạt ReLU: max(0, z). Nơ-ron h₂ (-0.45) bị triệt tiêu về 0.0 (tính thưa thớt của ReLU).'
          : 'Applied ReLU activation: max(0, z). Node h₂ (-0.45) clamped to 0.0 (inactive neuron sparsity).',
        invariant: isVi
          ? 'ReLU(z) ép giá trị không âm: a ∈ [0, ∞).'
          : 'ReLU(z) enforces non-negativity: a ∈ [0, ∞).',
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
              name: isVi ? 'Tầng Đầu vào' : 'Input Layer',
              nodes: [
                { label: 'x₁', value: 0.8 },
                { label: 'x₂', value: 0.4 },
              ],
            },
            {
              name: isVi ? 'Tầng Ẩn (Hoàn tất)' : 'Hidden Layer (Activated)',
              nodes: [
                { label: 'h₁', value: 1.12 },
                { label: 'h₂', value: 0.0 },
                { label: 'h₃', value: 0.84 },
              ],
            },
            {
              name: isVi ? 'Tầng Đầu ra (Sigmoid)' : 'Output Layer',
              nodes: [{ label: 'ŷ', value: 0.87, activation: 'Sigmoid' }],
            },
          ],
        },
        explanation: isVi
          ? 'Lan truyền xuôi hoàn tất! Nơ-ron đầu ra ŷ = 0.87 (87% xác suất nhãn dương). Mất mát Binary Cross-Entropy: 0.042.'
          : 'Forward pass complete! Final output neuron ŷ = 0.87 (87% positive class probability). Binary Cross-Entropy Loss: 0.042.',
        invariant: isVi
          ? 'Đầu ra được chuẩn hóa thành phân phối xác suất hợp lệ qua hàm Sigmoid.'
          : 'Output normalized into valid class probability distribution via Sigmoid.',
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
    inputVariants: [
      { label: 'Standard', value: 'The, quick, brown, fox, jumps' },
      { label: 'Short Prompt', value: 'AI, models, learn, patterns' },
      { label: 'Code Tokens', value: 'def, forward, layer, loss' },
    ],
    vi: {
      title: 'Cơ chế Tự chú ý (Self-Attention: Q, K, V)',
      category: 'Transformers & Mô hình LLM',
      badge: 'Lõi Transformer',
      summary: 'Tính toán điểm số liên quan ngữ cảnh động giữa tất cả các cặp token trong văn bản đầu vào để nắm bắt ngữ nghĩa sâu.',
      description: 'Nền tảng của toàn bộ các Mô hình Ngôn ngữ Lớn (LLMs). Mỗi token tạo ra các vector nhúng Query (Q), Key (K) và Value (V). Tích vô hướng giữa Query và Key đo lường mức độ tương thích ngữ nghĩa trong câu.',
      variants: [
        { label: 'Chuẩn', value: 'The, quick, brown, fox, jumps' },
        { label: 'Câu ngắn', value: 'AI, models, learn, patterns' },
        { label: 'Mã nguồn', value: 'def, forward, layer, loss' },
      ],
      sections: [
        {
          title: '1. Tại sao Self-Attention tạo nên Cuộc Cách mạng Xử lý Ngôn ngữ?',
          content: 'Các mô hình tuần hoàn trước đây (RNN/LSTM) xử lý từng từ nối tiếp nhau, gây nghẽn bộ nhớ khi gặp câu dài. Cơ chế Tự chú ý cho phép mỗi từ tương tác trực tiếp với mọi từ khác trong văn bản với đường dẫn hằng số O(1), đồng thời huấn luyện song song quy mô lớn trên GPU.',
          formula: 'S_{ij} = \\frac{q_i \\cdot k_j^T}{\\sqrt{d_k}}',
          keyTakeaway: 'Attention giải quyết triệt để vấn đề phụ thuộc ngữ cảnh tầm xa bằng cách thay thế đệ quy tuần hoàn bằng các phép nhân tích vô hướng ma trận.',
        },
        {
          title: '2. Vai trò của Query, Key và Value',
          content: 'Query giống như một câu truy vấn tìm kiếm ("Chủ ngữ của hành động này là gì?"), Keys đóng vai trò như các thẻ chỉ mục trên mỗi từ trong ngữ cảnh, và Values là nội dung ngữ nghĩa thực tế được trích xuất khi Query và Key khớp nhau.',
          keyTakeaway: 'Hàm Softmax chuyển đổi tích vô hướng thành phân phối xác suất có tổng bằng 1.0, điều hướng mô hình tập trung sự chú ý vào đâu.',
        },
        {
          title: '3. Mặt nạ Nhân quả (Causal Masking) trong Mô hình LLM Tạo sinh',
          content: 'Trong các mô hình sinh tự hồi quy (như GPT), token ở hiện tại không được phép nhìn trước tương lai. Mặt nạ nhân quả tam giác dưới gán các vị trí tương lai bằng -vô cùng (-inf), khiến Softmax triệt tiêu xác suất về 0.',
          formula: '\\text{Masked}(S_{ij}) = -\\infty \\quad \\text{if } j > i',
          keyTakeaway: 'Mặt nạ nhân quả đảm bảo nguyên tắc định hướng thời gian một chiều nghiêm ngặt trong quá trình huấn luyện và sinh từ.',
        },
      ],
    },
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
    generateTraces: (inputStr?: string, lang: Language = 'en'): TraceStep[] => {
      const isVi = lang === 'vi';
      const raw = inputStr || 'The, quick, brown, fox, jumps';
      const tokens = raw
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
        explanation: isVi
          ? `Cửa sổ ngữ cảnh khởi tạo với ${activeTokens.length} tokens. Vector truy vấn Query được chiếu từ token cuối cùng "${lastToken}".`
          : `Context window initialized with ${activeTokens.length} tokens. Active Query vector projected from last token "${lastToken}".`,
        invariant: isVi
          ? 'Chuỗi tự hồi quy: các token trước đó được lưu trữ trong KV-Cache.'
          : 'Autoregressive sequence: prior tokens stored in KV-Cache.',
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
        explanation: isVi
          ? `Tích vô hướng tỉ lệ: Q · K^T / √d_k. Đo lường mức độ tương quan ngữ cảnh giữa từ "${lastToken}" với các từ trước đó.`
          : `Scaled dot-product: Q · K^T / √d_k. Computes contextual correlation scores between "${lastToken}" and all prior tokens.`,
        invariant: isVi
          ? 'Chia tỉ lệ cho 1/√d_k ngăn giá trị tích vô hướng quá lớn rơi vào vùng gradient biến mất của Softmax.'
          : 'Scaling by 1/√d_k prevents dot-product values from growing too large into vanishing gradient softmax regions.',
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
        explanation: isVi
          ? `Áp dụng Softmax: Điểm chú ý cao nhất tập trung vào chủ ngữ "fox" (44%) và động từ "${lastToken}" (38%).`
          : `Softmax applied across row: Highest attention score placed on subject token "fox" (44%) and verb "${lastToken}" (38%).`,
        invariant: isVi
          ? '∑_j Attention[i, j] = 1.0 trên toàn bộ chiều của chuỗi.'
          : '∑_j Attention[i, j] = 1.0 across the sequence dimension.',
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
        explanation: isVi
          ? `Tổng hợp giá trị Value hoàn tất! Vector ngữ cảnh được chuyển qua Language Model Head. Token tiếp theo có xác suất cao nhất: "over" (76%).`
          : `Value aggregation complete! Context vector passed to Language Model Head. Top-1 predicted next token: "over" (76% probability).`,
        invariant: isVi
          ? 'Bước sinh tự hồi quy hoàn tất; sẵn sàng chọn mẫu cho token tiếp theo.'
          : 'Autoregressive generation step complete; ready to sample next token.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },
];

// Helper getters for localized preset content
export function getPresetTitle(preset: AlgorithmPreset, lang: Language): string {
  return lang === 'vi' && preset.vi ? preset.vi.title : preset.title;
}

export function getPresetCategory(preset: AlgorithmPreset, lang: Language): string {
  return lang === 'vi' && preset.vi ? preset.vi.category : preset.category;
}

export function getPresetSummary(preset: AlgorithmPreset, lang: Language): string {
  return lang === 'vi' && preset.vi ? preset.vi.summary : preset.summary;
}

export function getPresetDescription(preset: AlgorithmPreset, lang: Language): string {
  return lang === 'vi' && preset.vi ? preset.vi.description : preset.description;
}

export function getPresetBadge(preset: AlgorithmPreset, lang: Language): string {
  return lang === 'vi' && preset.vi ? preset.vi.badge : preset.badge;
}

export function getPresetSections(preset: AlgorithmPreset, lang: Language) {
  return lang === 'vi' && preset.vi ? preset.vi.sections : preset.sections;
}

export function getPresetVariants(preset: AlgorithmPreset, lang: Language) {
  return lang === 'vi' && preset.vi && preset.vi.variants ? preset.vi.variants : preset.inputVariants;
}
