import type { AlgorithmPreset, TraceStep, Language } from '../types';

export const ALGORITHM_PRESETS: AlgorithmPreset[] = [
  // ==========================================
  // Category 1: Classical Machine Learning
  // ==========================================
  {
    id: 'linear-regression',
    title: '01. Linear Regression & Gradient Descent',
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
      title: '01. Hồi quy Tuyến tính & Gradient Descent',
      category: 'Machine Learning Cổ điển',
      badge: 'Gradient Descent',
      summary: 'Khớp đường thẳng tối ưu với dữ liệu 2D bằng cách cực tiểu hóa MSE Loss thông qua thuật toán Gradient Descent.',
      description: 'Hồi quy tuyến tính mô hình hóa tương quan giữa biến đầu vào X và biến mục tiêu y. Thuật toán Gradient Descent tính gradient của hàm MSE Loss theo weight w và bias b, cập nhật tham số ngược hướng dốc để tối ưu mô hình.',
      variants: [
        { label: 'Chuẩn', value: '(1, 2.2), (2, 2.8), (3, 4.5), (4, 4.9), (5, 6.2)' },
        { label: 'Nhiễu', value: '(1, 1.4), (2, 3.8), (3, 3.1), (4, 5.9), (5, 5.2)' },
        { label: 'Ngoại lai', value: '(1, 2.0), (2, 2.5), (3, 3.0), (4, 3.5), (5, 8.5)' },
        { label: 'Dốc cao', value: '(1, 0.5), (2, 2.4), (3, 4.2), (4, 6.1), (5, 8.0)' },
      ],
      sections: [
        {
          title: '1. Mục tiêu Cốt lõi: Cực tiểu hóa Residuals (Sai số dư)',
          content: 'Với mỗi điểm dữ liệu (X, y), mô hình dự đoán y_pred = w * x + b. Phần dư residual là (y_pred - y). Ta bình phương sai số này để phạt nặng sai lệch lớn và loại bỏ dấu âm, tạo nên hàm MSE Loss (Mean Squared Error).',
          formula: 'MSE(w, b) = \\frac{1}{n} \\sum_{i=1}^n (w \\cdot x_i + b - y_i)^2',
          keyTakeaway: 'Hàm MSE Loss có dạng parabol lồi (convex), đảm bảo Gradient Descent sẽ hội tụ về điểm cực tiểu toàn cục duy nhất.',
        },
        {
          title: '2. Đạo hàm và Quy tắc Cập nhật Gradient Descent',
          content: 'Để tìm w và b tối ưu, ta tính gradient của hàm MSE Loss theo từng tham số bằng Chain Rule: d/dw = (2/n) * sum(x * (y_pred - y)) và d/db = (2/n) * sum(y_pred - y).',
          formula: 'w \\leftarrow w - \\alpha \\frac{\\partial L}{\\partial w}, \\quad b \\leftarrow b - \\alpha \\frac{\\partial L}{\\partial b}',
          keyTakeaway: 'Learning rate α quyết định bước nhảy. Nếu quá lớn thuật toán sẽ phân kỳ (diverge); nếu quá nhỏ sẽ hội tụ rất chậm.',
        },
        {
          title: '3. Tầm quan trọng trong Nền tảng Deep Learning',
          content: 'Hồi quy tuyến tính kết hợp Gradient Descent là nền tảng cốt lõi của toàn bộ Deep Learning: Forward pass tính dự đoán, tính Loss, Backpropagation lấy gradient và cập nhật weights.',
          keyTakeaway: 'Mạng nơ-ron sâu bản chất là sự xếp chồng của nhiều layers phi tuyến được tối ưu bằng các biến thể của chính thuật toán Gradient Descent này.',
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
          ? `Khởi tạo weight ban đầu w = ${w}, bias b = ${b}. MSE Loss ban đầu: ${initLoss}.`
          : `Initialized weights at w = ${w}, b = ${b}. Starting Mean Squared Error Loss: ${initLoss}.`,
        invariant: isVi
          ? 'Đường ngẫu nhiên chưa huấn luyện. Bước Gradient Descent ban đầu: epoch = 0.'
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
            ? `Epoch #${epoch}: Chạy Forward pass tính y_pred = ${w.toFixed(2)}x + ${b.toFixed(2)}. MSE Loss: ${lossVal}.`
            : `Epoch #${epoch}: Forward pass computed predictions y_pred = ${w.toFixed(2)}x + ${b.toFixed(2)}. Current MSE Loss: ${lossVal}.`,
          invariant: isVi
            ? 'Hàm MSE Loss đánh giá chất lượng khớp đường thẳng hiện tại.'
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
            ? `Tính gradient theo Chain Rule: ∂L/∂w = ${gradW}, ∂L/∂b = ${gradB}. Đi ngược hướng gradient để giảm Loss.`
            : `Calculated gradients via chain rule: ∂L/∂w = ${gradW}, ∂L/∂b = ${gradB}. Negative gradient directs downhill step.`,
          invariant: isVi
            ? 'Vector gradient ∇L chỉ hướng dốc tăng nhanh nhất; ta đi ngược lại để tìm cực tiểu.'
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
            ? `Cập nhật tham số: w = ${w.toFixed(2)}, b = ${b.toFixed(2)}. MSE Loss giảm xuống còn ${newLoss}.`
            : `Parameter update: w = ${w.toFixed(2)} (changed by ${(-lr * gradW).toFixed(2)}), b = ${b.toFixed(2)}. Loss dropped to ${newLoss}.`,
          invariant: isVi
            ? 'Hàm MSE Loss đơn điệu giảm dần dưới learning rate phù hợp.'
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
          ? `Quá trình Gradient Descent đã hội tụ! Đường hồi quy tối ưu: y = ${w.toFixed(2)}x + ${b.toFixed(2)}. Residuals đạt mức tối thiểu.`
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
    id: 'single-neuron',
    title: '01. The Artificial Neuron (Perceptron)',
    category: 'Deep Learning & Neural Networks',
    difficulty: 'Beginner',
    badge: 'Neural Building Block',
    visualType: 'single-neuron',
    formula: 'z = \\sum_{i=1}^n w_i x_i + b = \\mathbf{w}^T \\mathbf{x} + b, \\quad a = \\sigma(z) = \\frac{1}{1 + e^{-z}}',
    summary: 'The foundational atomic unit of deep learning: aggregates weighted inputs, adds a threshold bias, and fires via an activation function.',
    description: 'Inspired by biological neurons (dendrites, soma, axon), Frank Rosenblatt’s Perceptron computes a linear combination z = w^T x + b followed by an activation function a = f(z). Traces how inputs scale through synaptic weights to produce binary or probability decisions.',
    inputVariants: [
      { label: 'AND Gate (x=[1, 1])', value: 'x1: 1.0, x2: 1.0' },
      { label: 'OR Gate (x=[0, 1])', value: 'x1: 0.0, x2: 1.0' },
      { label: 'Below Threshold (x=[0, 0])', value: 'x1: 0.0, x2: 0.0' },
      { label: 'Continuous (x=[0.8, -0.5])', value: 'x1: 0.8, x2: -0.5' },
    ],
    vi: {
      title: '01. Nơ-ron Nhân tạo (Perceptron)',
      category: 'Deep Learning & Mạng Nơ-ron',
      badge: 'Viên gạch Nơ-ron',
      summary: 'Đơn vị nguyên tử nền tảng của học sâu: tổng hợp đầu vào có trọng số, cộng bias ngưỡng và kích hoạt qua hàm phi tuyến để ra quyết định.',
      description: 'Lấy cảm hứng từ nơ-ron sinh học (sợi nhánh, thân tế bào, sợi trục), Perceptron của Frank Rosenblatt tính tổ hợp tuyến tính z = w^T x + b và kích hoạt phi tuyến a = f(z). Mô phỏng từng luồng tín hiệu từ đầu vào qua trọng số đến quyết định kích hoạt.',
      variants: [
        { label: 'Cổng AND (x=[1, 1])', value: 'x1: 1.0, x2: 1.0' },
        { label: 'Cổng OR (x=[0, 1])', value: 'x1: 0.0, x2: 1.0' },
        { label: 'Dưới ngưỡng (x=[0, 0])', value: 'x1: 0.0, x2: 0.0' },
        { label: 'Liên tục (x=[0.8, -0.5])', value: 'x1: 0.8, x2: -0.5' },
      ],
      sections: [
        {
          title: '1. Cấu trúc Nơ-ron Nhân tạo (Từ Sinh học đến Toán học)',
          content: 'Lấy cảm hứng từ nơ-ron sinh học: Sợi nhánh (Dendrites) nhận tín hiệu đầu vào x_i, Khớp thần kinh (Synapses) khuếch đại hoặc làm suy giảm tín hiệu qua trọng số w_i, Thân tế bào (Soma) cộng dồn toàn bộ z = ∑ w_i x_i + b, và Sợi trục (Axon) phát xung đầu ra a = f(z).',
          formula: 'z = \\mathbf{w}^T \\mathbf{x} + b = w_1 x_1 + w_2 x_2 + \\dots + w_n x_n + b',
          keyTakeaway: 'Weights (w) quyết định tầm quan trọng của từng đặc trưng; Bias (b) điều chỉnh ngưỡng kích hoạt nơ-ron dễ hay khó phát xung.',
        },
        {
          title: '2. Các Hàm Kích hoạt: Step Function, Sigmoid và ReLU',
          content: 'Perceptron ban đầu của Rosenblatt sử dụng hàm bước nhảy (Step function) nhị phân 0 hoặc 1. Mạng nơ-ron hiện đại chuyển sang các hàm kích hoạt mượt mà có đạo hàm như Sigmoid (1 / (1 + e^-z)) hoặc ReLU (max(0, z)) để phục vụ việc tính gradient khi huấn luyện.',
          formula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad \\text{ReLU}(z) = \\max(0, z)',
          keyTakeaway: 'Tính khả vi (differentiable) của các hàm kích hoạt mượt cho phép thuật toán Gradient Descent tính đạo hàm và tinh chỉnh trọng số.',
        },
        {
          title: '3. Giới hạn Ranh giới Quyết định Tuyến tính & Bài toán XOR',
          content: 'Một nơ-ron đơn lẻ chỉ có thể tạo ra một siêu phẳng tuyến tính w1*x1 + w2*x2 + b = 0 chia không gian thành hai nửa. Nó có thể học được cổng logic AND và OR, nhưng thất bại hoàn toàn trước cổng XOR (Minsky & Papert, 1969).',
          keyTakeaway: 'Hạn chế này thúc đẩy sự ra đời của Mạng nơ-ron Đa tầng (MLP) với các tầng ẩn để giải quyết các bài toán phi tuyến phức tạp.',
        },
      ],
    },
    sections: [
      {
        title: '1. Anatomy of an Artificial Neuron (Biology to Math)',
        content: 'Inspired by biological neurons: Dendrites receive input signals x_i, Synapses apply signal strength via weights w_i, the Cell Body (Soma) computes the weighted sum z = ∑ w_i x_i + b, and the Axon fires an activation signal a = f(z).',
        formula: 'z = \\mathbf{w}^T \\mathbf{x} + b = w_1 x_1 + w_2 x_2 + \\dots + w_n x_n + b',
        keyTakeaway: 'Weights (w) scale feature importance; Bias (b) shifts the threshold for how easily the neuron fires.',
      },
      {
        title: '2. Activation Functions: From Step Function to Sigmoid & ReLU',
        content: 'Rosenblatt’s historical perceptron used a discrete step function (0 or 1). Modern deep learning requires smooth, differentiable activations like Sigmoid or ReLU so gradients can be propagated backward during gradient descent training.',
        formula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad \\text{ReLU}(z) = \\max(0, z)',
        keyTakeaway: 'Smooth differentiable activations allow infinitesimal weight nudges to produce measurable loss changes.',
      },
      {
        title: '3. The Linear Decision Boundary & The XOR Limit',
        content: 'A single neuron defines a linear decision boundary w1*x1 + w2*x2 + b = 0 dividing space into two half-planes. It easily solves AND and OR gates, but is mathematically incapable of separating the non-linear XOR function (Minsky & Papert, 1969).',
        keyTakeaway: 'Overcoming the single neuron’s linear boundary limit directly necessitated Multi-Layer Perceptrons (MLPs).',
      },
    ],
    timeComplexity: 'O(n) inputs dot-product',
    spaceComplexity: 'O(n) parameters',
    tags: ['Perceptron', 'Neural Network', 'Activation', 'Sigmoid', 'PyTorch'],
    defaultInput: 'x1: 1.0, x2: 1.0',
    pythonCode: `import numpy as np

def single_neuron(x, w, b, activation="sigmoid"):
    # 1. Linear Weighted Sum + Bias
    z = np.dot(x, w) + b
    
    # 2. Non-linear Activation
    if activation == "sigmoid":
        a = 1 / (1 + np.exp(-z))
    elif activation == "relu":
        a = np.maximum(0, z)
    elif activation == "step":
        a = 1.0 if z >= 0 else 0.0
    return z, a

# Logic AND gate weights configuration
w = np.array([1.5, 1.5])
b = -2.0
x = np.array([1.0, 1.0])
z, output = single_neuron(x, w, b, activation="sigmoid")
print(f"z = {z:.2f}, Output probability = {output:.4f}")`,
    code: `import numpy as np

def neuron(x, w, b):
    # 1. Weighted sum
    z = np.dot(x, w) + b
    # 2. Sigmoid activation
    a = 1 / (1 + np.exp(-z))
    return z, a`,
    generateTraces: (inputStr?: string, lang: Language = 'en'): TraceStep[] => {
      const isVi = lang === 'vi';
      let x1 = 1.0;
      let x2 = 1.0;

      if (inputStr) {
        const m1 = inputStr.match(/x1:\s*(-?[0-9.]+)/i);
        const m2 = inputStr.match(/x2:\s*(-?[0-9.]+)/i);
        if (m1) x1 = Number(m1[1]);
        if (m2) x2 = Number(m2[1]);
      }

      const w1 = 1.5;
      const w2 = 1.5;
      const b = -2.0;
      const weightedSum = Number((w1 * x1 + w2 * x2 + b).toFixed(2));
      const outputProb = Number((1 / (1 + Math.exp(-weightedSum))).toFixed(3));

      const steps: TraceStep[] = [];

      // Step 0: Input Signal Reception
      steps.push({
        step: 0,
        totalSteps: 0,
        line: 4,
        action: 'init',
        targets: [0, 1],
        state: {
          neuronState: {
            inputs: [
              { label: 'x₁', val: x1 },
              { label: 'x₂', val: x2 },
            ],
            weights: [w1, w2],
            bias: b,
            weightedSum: 0,
            activationName: 'Pending',
            outputVal: 0,
          },
        },
        explanation: isVi
          ? `Đầu vào x = [${x1}, ${x2}] được tiếp nhận bởi sợi nhánh (dendrites). Trọng số khớp thần kinh: w₁ = ${w1}, w₂ = ${w2}, bias ngưỡng b = ${b}.`
          : `Inputs x = [${x1}, ${x2}] received at dendrites. Synaptic weights: w₁ = ${w1}, w₂ = ${w2}, threshold bias b = ${b}.`,
        invariant: isVi
          ? 'Tín hiệu đầu vào sẵn sàng truyền qua các kết nối synap.'
          : 'Input signals ready for synaptic scaling.',
      });

      // Step 1: Synaptic Weighting (w1*x1 and w2*x2)
      steps.push({
        step: 1,
        totalSteps: 0,
        line: 5,
        action: 'compute',
        targets: [0, 1],
        state: {
          neuronState: {
            inputs: [
              { label: 'x₁', val: x1 },
              { label: 'x₂', val: x2 },
            ],
            weights: [w1, w2],
            bias: b,
            weightedSum: Number((w1 * x1 + w2 * x2).toFixed(2)),
            activationName: 'Scaling',
            outputVal: 0,
          },
        },
        explanation: isVi
          ? `Tín hiệu khuếch đại qua synap: w₁·x₁ = ${w1}·${x1} = ${(w1 * x1).toFixed(2)}, w₂·x₂ = ${w2}·${x2} = ${(w2 * x2).toFixed(2)}.`
          : `Synaptic transmission: w₁·x₁ = ${w1}·${x1} = ${(w1 * x1).toFixed(2)}, w₂·x₂ = ${w2}·${x2} = ${(w2 * x2).toFixed(2)}.`,
        invariant: isVi
          ? 'Phép nhân trọng số điều chỉnh cường độ đóng góp của từng đặc trưng.'
          : 'Synaptic scaling weights feature importance.',
      });

      // Step 2: Summation and Bias in Soma (z = w^T x + b)
      steps.push({
        step: 2,
        totalSteps: 0,
        line: 5,
        action: 'forward',
        targets: [2],
        state: {
          neuronState: {
            inputs: [
              { label: 'x₁', val: x1 },
              { label: 'x₂', val: x2 },
            ],
            weights: [w1, w2],
            bias: b,
            weightedSum,
            activationName: 'z = ∑ + b',
            outputVal: 0,
          },
        },
        explanation: isVi
          ? `Thân nơ-ron (Soma) tính tổng và cộng bias: z = (${(w1 * x1).toFixed(2)} + ${(w2 * x2).toFixed(2)}) + (${b}) = ${weightedSum}. ${weightedSum >= 0 ? 'Giá trị vượt ngưỡng kích hoạt (z ≥ 0)!' : 'Giá trị dưới ngưỡng kích hoạt (z < 0).'}`
          : `Soma aggregates inputs and adds bias: z = (${(w1 * x1).toFixed(2)} + ${(w2 * x2).toFixed(2)}) + (${b}) = ${weightedSum}. ${weightedSum >= 0 ? 'Above activation threshold (z ≥ 0)!' : 'Below threshold (z < 0).'}`,
        invariant: isVi
          ? 'Tổ hợp tuyến tính z đo khoảng cách đại số tới ranh giới quyết định.'
          : 'Affine combination z measures signed distance to decision boundary.',
      });

      // Step 3: Activation Function Firing (Sigmoid)
      steps.push({
        step: 3,
        totalSteps: 0,
        line: 7,
        action: 'done',
        targets: [3],
        state: {
          neuronState: {
            inputs: [
              { label: 'x₁', val: x1 },
              { label: 'x₂', val: x2 },
            ],
            weights: [w1, w2],
            bias: b,
            weightedSum,
            activationName: 'Sigmoid',
            outputVal: outputProb,
          },
        },
        explanation: isVi
          ? `Hàm kích hoạt Sigmoid phát xung đầu ra: a = σ(${weightedSum}) = ${outputProb} (xác suất ${(outputProb * 100).toFixed(1)}%). Nơ-ron đưa ra quyết định ${outputProb >= 0.5 ? 'KÍCH HOẠT (Output = 1)' : 'KHÔNG KÍCH HOẠT (Output = 0)'}!`
          : `Sigmoid activation fires: a = σ(${weightedSum}) = ${outputProb} (${(outputProb * 100).toFixed(1)}% confidence). Neuron decides: ${outputProb >= 0.5 ? 'FIRE (Class 1)' : 'REST (Class 0)'}!`,
        invariant: isVi
          ? 'Đầu ra được nén về đoạn [0, 1] biểu thị xác suất tin cậy của nơ-ron.'
          : 'Output compressed to [0, 1] interval representing class firing probability.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },
  {
    id: 'modern-neuron',
    title: '02. The Modern Neuron vs. Perceptron',
    category: 'Deep Learning & Neural Networks',
    difficulty: 'Beginner',
    badge: 'Activation & Calculus',
    visualType: 'modern-neuron',
    formula: '\\text{Perceptron: } a = \\text{step}(z) \\quad \\longleftrightarrow \\quad \\text{Modern Neuron: } a = \\sigma(z), \\quad \\frac{da}{dz} = a(1 - a)',
    summary: 'Reveals the revolution that unlocked deep learning: replacing the Perceptron’s rigid step function with smooth, differentiable activations (Sigmoid & ReLU) to enable Gradient Descent.',
    description: 'Frank Rosenblatt’s 1957 Perceptron computed a linear weighted sum z = w^T x + b, but passed it through a discontinuous step function where da/dz = 0 everywhere. Modern neurons substitute continuous non-linearities (Sigmoid, Tanh, ReLU) with non-zero gradients, allowing Backpropagation to guide parameter updates.',
    inputVariants: [
      { label: 'Modern Sigmoid (Smooth Gradient)', value: 'activation: sigmoid, z: 1.2' },
      { label: 'Modern ReLU (Deep Learning Standard)', value: 'activation: relu, z: 1.5' },
      { label: 'Classic Perceptron (Zero Gradient)', value: 'activation: step, z: 1.2' },
      { label: 'Vanishing Gradient Saturation', value: 'activation: sigmoid, z: 4.8' },
    ],
    vi: {
      title: '02. Nơ-ron AI Hiện đại vs. Perceptron',
      category: 'Deep Learning & Mạng Nơ-ron',
      badge: 'Hàm Kích hoạt & Đạo hàm',
      summary: 'Cú hích lịch sử khai sinh học sâu: thay thế hàm bước nhảy cụt ngủn của Perceptron bằng các hàm kích hoạt khả vi (Sigmoid & ReLU) để thuật toán Gradient Descent có thể tối ưu trọng số.',
      description: 'Perceptron (1957) tính tổng trọng số z = w^T x + b nhưng đi qua hàm bước nhảy có đạo hàm da/dz = 0 ở mọi nơi, khiến máy tính không thể học bằng đạo hàm. Nơ-ron hiện đại thay thế bằng các hàm phi tuyến liên tục (Sigmoid, Tanh, ReLU) có gradient sống, mở đường cho thuật toán Lan truyền ngược (Backpropagation).',
      variants: [
        { label: 'Modern Sigmoid (Gradient Mượt)', value: 'activation: sigmoid, z: 1.2' },
        { label: 'Modern ReLU (Chuẩn Deep Learning)', value: 'activation: relu, z: 1.5' },
        { label: 'Classic Perceptron (Gradient Bằng 0)', value: 'activation: step, z: 1.2' },
        { label: 'Triệt tiêu Gradient (Saturation)', value: 'activation: sigmoid, z: 4.8' },
      ],
      sections: [
        {
          title: '1. Lỗ hổng Chí mạng của Perceptron: Bài toán Gradient Bằng 0',
          content: 'Hàm bước nhảy Heaviside (a = 1 nếu z ≥ 0, ngược lại 0) hoàn toàn nằm ngang ở mọi điểm trừ z = 0. Đạo hàm da/dz = 0 ở khắp nơi! Khi tính gradient để tối ưu trọng số theo Chain Rule: ∂L/∂w = (∂L/∂a) * (da/dz) * (∂z/∂w) = (∂L/∂a) * 0 * x = 0. Dòng gradient hoàn toàn bị chặn đứng! Máy tính không thể dùng vi tích phân hay Gradient Descent để huấn luyện mạng Perceptron.',
          formula: '\\frac{da}{dz} = 0 \\quad (\\forall z \\ne 0) \\implies \\frac{\\partial L}{\\partial w} = 0 \\quad (\\text{Không thể học bằng Gradient Descent!})',
          keyTakeaway: 'Đạo hàm bằng 0 làm đóng băng quá trình học: thay đổi trọng số một chút không tạo ra bất kỳ phản hồi độ dốc nào.',
        },
        {
          title: '2. Giải pháp Đột phá: Hàm Kích hoạt Khả vi (Sigmoid & Tanh)',
          content: 'Năm 1986, Rumelhart, Hinton và Williams thay thế hàm bước nhảy bằng hàm Logistic Sigmoid liên tục: a = σ(z) = 1 / (1 + e^-z). Đạo hàm của Sigmoid có dạng đối xứng hình chuông tuyệt đẹp: da/dz = a * (1 - a). Nhờ đó, gradient luôn lớn hơn 0 trên miền hoạt động, cho phép thuật toán Lan truyền ngược (Backpropagation) hoạt động trơn tru.',
          formula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad \\frac{d\\sigma}{dz} = \\sigma(z)(1 - \\sigma(z)) = a(1 - a)',
          keyTakeaway: 'Hàm kích hoạt mượt mà cung cấp độ dốc (gradient) dẫn đường cho Gradient Descent trượt dốc xuống đáy mất mát tối thiểu.',
        },
        {
          title: '3. Kỷ nguyên Hiện đại: Từ Sigmoid sang ReLU (Trị dứt điểm Triệt tiêu Gradient)',
          content: 'Dù giải quyết được bài toán đạo hàm bằng 0, đạo hàm Sigmoid chỉ đạt tối đa 0.25 tại z=0 và tiến về 0 khi |z| > 4 (bão hòa). Khi nhân dồn chuỗi số thập phân này qua 10 lớp, gradient biến mất (0.25^10 ≈ 10^-6). Mạng sâu hiện đại chuyển sang ReLU (Rectified Linear Unit): a = max(0, z). Đạo hàm của ReLU là hằng số 1.0 cho mọi z > 0, cho phép mạng nơ-ron sâu hàng trăm tầng huấn luyện ổn định mà không bị suy hao tín hiệu.',
          formula: '\\text{ReLU}(z) = \\max(0, z), \\quad \\frac{d}{dz}\\text{ReLU} = 1.0 \\quad (z > 0)',
          keyTakeaway: 'Đạo hàm hằng số 1.0 của ReLU chính là động cơ cốt lõi vận hành toàn bộ kỷ nguyên Deep Learning và các mô hình Transformer hiện đại.',
        },
      ],
    },
    sections: [
      {
        title: '1. The Perceptron’s Fatal Flaw: The Zero-Gradient Problem',
        content: 'The Heaviside step function (a = 1 if z ≥ 0 else 0) is flat everywhere. Its derivative da/dz = 0 for all z ≠ 0. When computing parameter gradients via the Chain Rule: ∂L/∂w = (∂L/∂a) * (da/dz) * (∂z/∂w) = (∂L/∂a) * 0 * x = 0. The gradient signal is entirely dead! Calculus and Gradient Descent cannot train a network of step-function perceptrons.',
        formula: '\\frac{da}{dz} = 0 \\quad (\\forall z \\ne 0) \\implies \\frac{\\partial L}{\\partial w} = 0 \\quad (\\text{Dead Gradient Flow})',
        keyTakeaway: 'A zero derivative freezes the learning process: small weight tweaks produce zero feedback.',
      },
      {
        title: '2. The Modern Solution: Smooth Differentiable Activations (Sigmoid & Tanh)',
        content: 'In 1986, Rumelhart, Hinton, and Williams replaced the step function with the smooth logistic Sigmoid: a = σ(z) = 1 / (1 + e^-z). Its derivative is mathematically elegant: da/dz = a * (1 - a). Now, the gradient is non-zero, allowing infinitesimal weight changes to continuously steer the model toward lower loss.',
        formula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad \\frac{d\\sigma}{dz} = \\sigma(z)(1 - \\sigma(z)) = a(1 - a)',
        keyTakeaway: 'Smooth differentiable curves provide the continuous slope (gradient) that guides Gradient Descent downhill toward zero loss.',
      },
      {
        title: '3. From Sigmoid to ReLU: Overcoming Vanishing Gradients in Deep Nets',
        content: 'While Sigmoid revived neural networks, its derivative peaks at only 0.25 and approaches 0 when |z| > 4 (saturation). Multiplying these fractions across 10 layers causes gradients to vanish (0.25^10 ≈ 10^-6). Modern deep learning adopted ReLU: a = max(0, z). Its derivative is a clean constant 1.0 for all positive inputs, allowing networks with hundreds of layers to train without signal degradation.',
        formula: '\\text{ReLU}(z) = \\max(0, z), \\quad \\frac{d}{dz}\\text{ReLU} = 1.0 \\quad (z > 0)',
        keyTakeaway: 'ReLU’s constant gradient of 1.0 is the engine powering modern Deep Learning and Transformer architectures.',
      },
    ],
    timeComplexity: 'O(1) forward & gradient step',
    spaceComplexity: 'O(1) activations',
    tags: ['Activation Function', 'Gradient Flow', 'Sigmoid', 'ReLU', 'Perceptron vs Neuron'],
    defaultInput: 'activation: sigmoid, z: 1.2',
    pythonCode: `import numpy as np

# Comparing Perceptron vs Modern Neuron Activations and Gradients
def activation_and_gradient(z, kind="sigmoid"):
    if kind == "step":
        # Classic Perceptron: flat derivative, gradient = 0
        a = 1.0 if z >= 0 else 0.0
        grad = 0.0  # Zero gradient! Breaks backprop
    elif kind == "sigmoid":
        # Modern Sigmoid: smooth differentiable curve
        a = 1.0 / (1.0 + np.exp(-z))
        grad = a * (1.0 - a)  # Continuous gradient!
    elif kind == "relu":
        # Modern ReLU: avoids vanishing gradient
        a = max(0.0, z)
        grad = 1.0 if z > 0 else 0.0
    elif kind == "tanh":
        a = np.tanh(z)
        grad = 1.0 - a**2
    return a, grad

# Example comparison at z = 1.2
z = 1.2
for mode in ["step", "sigmoid", "relu"]:
    out, grad = activation_and_gradient(z, mode)
    print(f"[{mode.upper():7s}] Output a = {out:.4f} | Gradient da/dz = {grad:.4f}")`,
    code: `import numpy as np

def modern_neuron(z, activation="sigmoid"):
    # 1. Activation computation
    if activation == "sigmoid":
        a = 1 / (1 + np.exp(-z))
        grad = a * (1 - a)     # Smooth gradient!
    elif activation == "relu":
        a = np.maximum(0, z)
        grad = 1.0 if z > 0 else 0.0
    elif activation == "step": # Classic Perceptron
        a = 1.0 if z >= 0 else 0.0
        grad = 0.0             # Zero gradient!
    return a, grad`,
    generateTraces: (inputStr?: string, lang: Language = 'en'): TraceStep[] => {
      const isVi = lang === 'vi';
      let z = 1.2;
      let actType: 'step' | 'sigmoid' | 'relu' | 'tanh' = 'sigmoid';

      if (inputStr) {
        if (inputStr.includes('relu')) actType = 'relu';
        else if (inputStr.includes('step')) actType = 'step';
        else if (inputStr.includes('tanh')) actType = 'tanh';

        const m = inputStr.match(/z:\s*(-?[0-9.]+)/i);
        if (m) z = Number(m[1]);
      }

      const stepA = z >= 0 ? 1.0 : 0.0;
      const stepGrad = 0.0;

      const sigA = Number((1 / (1 + Math.exp(-z))).toFixed(3));
      const sigGrad = Number((sigA * (1 - sigA)).toFixed(3));

      const reluA = Number((Math.max(0, z)).toFixed(3));
      const reluGrad = z > 0 ? 1.0 : 0.0;

      const steps: TraceStep[] = [];

      // Step 0: Linear Combination z = w^T x + b
      steps.push({
        step: 0,
        totalSteps: 0,
        line: 4,
        action: 'init',
        targets: [0],
        state: {
          modernNeuronState: {
            inputs: [
              { label: 'x₁', val: 0.8 },
              { label: 'x₂', val: 0.4 },
            ],
            weights: [1.2, 0.5],
            bias: 0.04,
            zVal: z,
            activationType: 'step',
            outputVal: 0,
            gradientVal: 0,
          },
        },
        explanation: isVi
          ? `Tổng hợp tuyến tính: z = w₁·x₁ + w₂·x₂ + b = (1.2·0.8 + 0.5·0.4) + 0.04 = ${z.toFixed(2)}. Giá trị z sẵn sàng đưa qua các hàm kích hoạt để so sánh.`
          : `Linear combination computed: z = w₁·x₁ + w₂·x₂ + b = (1.2·0.8 + 0.5·0.4) + 0.04 = ${z.toFixed(2)}. Value z ready for activation comparison.`,
        invariant: isVi
          ? 'Cả Perceptron và Nơ-ron hiện đại đều dùng chung phép biến đổi tuyến tính z = w^T x + b.'
          : 'Both Perceptrons and Modern Neurons share the identical affine linear sum z = w^T x + b.',
      });

      // Step 1: The Classic Perceptron (Step Function) Evaluation
      steps.push({
        step: 1,
        totalSteps: 0,
        line: 10,
        action: 'compare',
        targets: [1],
        state: {
          modernNeuronState: {
            inputs: [
              { label: 'x₁', val: 0.8 },
              { label: 'x₂', val: 0.4 },
            ],
            weights: [1.2, 0.5],
            bias: 0.04,
            zVal: z,
            activationType: 'step',
            outputVal: stepA,
            gradientVal: stepGrad,
          },
        },
        explanation: isVi
          ? `Mô hình Perceptron Cổ điển (1957): Sử dụng hàm bước nhảy Heaviside. Với z = ${z.toFixed(2)} ≥ 0, Output a = ${stepA}. Đạo hàm da/dz = 0.000! Gradient bị triệt tiêu hoàn toàn (Zero-Gradient Problem), khiến thuật toán Gradient Descent bất lực.`
          : `Classic Perceptron (1957): Employs the Heaviside step function. For z = ${z.toFixed(2)} ≥ 0, Output a = ${stepA}. Derivative da/dz = 0.000! Dead gradient freezes Backpropagation.`,
        invariant: isVi
          ? 'Perceptron: Đạo hàm da/dz = 0 ở mọi nơi; không thể tối ưu hóa bằng vi tích phân.'
          : 'Classic Perceptron: da/dz = 0 everywhere; calculus-based learning is impossible.',
      });

      // Step 2: The Modern Neuron (Sigmoid Activation)
      steps.push({
        step: 2,
        totalSteps: 0,
        line: 6,
        action: 'forward',
        targets: [2],
        state: {
          modernNeuronState: {
            inputs: [
              { label: 'x₁', val: 0.8 },
              { label: 'x₂', val: 0.4 },
            ],
            weights: [1.2, 0.5],
            bias: 0.04,
            zVal: z,
            activationType: 'sigmoid',
            outputVal: sigA,
            gradientVal: sigGrad,
          },
        },
        explanation: isVi
          ? `Nơ-ron Hiện đại (Sigmoid): Đường cong mượt biến đổi z = ${z.toFixed(2)} thành xác suất liên tục a = ${sigA}. Đạo hàm da/dz = a(1 - a) = ${sigGrad} > 0! Gradient sống cho phép Backpropagation tính toán cập nhật trọng số.`
          : `Modern Neuron (Sigmoid): Smooth S-curve transforms z = ${z.toFixed(2)} into continuous probability a = ${sigA}. Derivative da/dz = a(1 - a) = ${sigGrad} > 0! Non-zero slope enables Gradient Descent.`,
        invariant: isVi
          ? 'Sigmoid: Tính khả vi (Differentiable) mở đường cho thuật toán Lan truyền ngược (Backpropagation).'
          : 'Sigmoid: Differentiable continuity unlocks Backpropagation and weight updates.',
      });

      // Step 3: Modern Deep Learning Standard (ReLU)
      steps.push({
        step: 3,
        totalSteps: 0,
        line: 8,
        action: 'done',
        targets: [3],
        state: {
          modernNeuronState: {
            inputs: [
              { label: 'x₁', val: 0.8 },
              { label: 'x₂', val: 0.4 },
            ],
            weights: [1.2, 0.5],
            bias: 0.04,
            zVal: z,
            activationType: actType === 'relu' ? 'relu' : 'sigmoid',
            outputVal: actType === 'relu' ? reluA : sigA,
            gradientVal: actType === 'relu' ? reluGrad : sigGrad,
          },
        },
        explanation: isVi
          ? `Chuẩn Học sâu Hiện đại (ReLU): a = max(0, ${z.toFixed(2)}) = ${reluA}. Đạo hàm da/dz = ${reluGrad}.0 (Hằng số cực đại)! Không bị bão hòa, giải quyết triệt để vấn đề Triệt tiêu Gradient (Vanishing Gradient) trong các mạng sâu hàng trăm lớp.`
          : `Modern Deep Learning Engine (ReLU): a = max(0, ${z.toFixed(2)}) = ${reluA}. Constant gradient da/dz = ${reluGrad}.0! Completely eliminates Vanishing Gradients, allowing hundreds of deep layers to learn.`,
        invariant: isVi
          ? 'Khai sinh Deep Learning: Thay thế hàm bước nhảy bằng hàm kích hoạt khả vi đã biến Perceptron thành Nơ-ron AI hiện đại.'
          : 'Foundation of Deep Learning: Swapping step functions for differentiable activations transformed Perceptrons into Modern Neurons.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },


  {
    id: 'neural-network-mlp',
    title: '03. Multi-Layer Perceptron (MLP) Forward Pass',
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
      title: '03. Mạng Nơ-ron Đa tầng (MLP) Forward Pass',
      category: 'Deep Learning & Mạng Nơ-ron',
      badge: 'Forward Pass',
      summary: 'Lan truyền activations qua các hidden layers với hàm phi tuyến ReLU để tính toán output dự đoán.',
      description: 'Mạng Multi-Layer Perceptron (MLP) ánh xạ các features đầu vào sang không gian biểu diễn nhiều chiều. Quan sát tổ hợp tuyến tính và các hàm activation lan truyền qua từng neuron.',
      variants: [
        { label: 'Chuẩn', value: 'x1: 0.8, x2: 0.4' },
        { label: 'Biên độ cao', value: 'x1: 1.5, x2: 1.2' },
        { label: 'Đầu vào âm', value: 'x1: -0.6, x2: 0.8' },
        { label: 'Điểm gốc 0', value: 'x1: 0.0, x2: 0.0' },
      ],
      sections: [
        {
          title: '1. Tại sao Hidden Layers tạo nên Tính Phi tuyến?',
          content: 'Một linear layer đơn lẻ chỉ có thể học được ranh giới quyết định tuyến tính. Bằng cách xếp chồng các layers với hàm kích hoạt phi tuyến như ReLU (max(0, z)), mạng nơ-ron có thể xấp xỉ bất kỳ hàm số liên tục nào (Universal Approximation Theorem).',
          formula: '\\text{ReLU}(z) = \\max(0, z)',
          keyTakeaway: 'Nếu không có hàm phi tuyến, việc xếp chồng 100 linear layers sẽ sụp đổ thành đúng một linear layer duy nhất.',
        },
        {
          title: '2. Phép Nhân Ma trận và Kích hoạt Neurons',
          content: 'Với mỗi layer l, ta tính z^[l] = W^[l] * a^[l-1] + b^[l], sau đó áp dụng hàm activation a^[l] = g(z^[l]). Forward pass xâu chuỗi các phép tính này từ input layer đến output layer.',
          formula: 'z^{[1]} = W^{[1]} x + b^{[1]}, \\quad a^{[1]} = \\text{ReLU}(z^{[1]})',
          keyTakeaway: 'Phép nhân ma trận chạy song song cực nhanh trên GPU với các Tensor Cores.',
        },
        {
          title: '3. Kết nối Forward Pass với Backpropagation',
          content: 'Trong giai đoạn inference, mô hình chỉ chạy Forward pass. Trong giai đoạn training, sai số output tạo ra gradient truyền ngược (Backpropagation) theo Chain Rule để cập nhật weights.',
          keyTakeaway: 'Activations từ Forward pass được lưu trong memory (cache) để tái sử dụng khi tính gradient ở pha Backpropagation.',
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

  {
    id: 'cnn-feature-map',
    title: '04. Convolutional Neural Network (CNN) 2D Feature Map',
    category: 'Deep Learning & Neural Networks',
    difficulty: 'Intermediate',
    badge: 'Computer Vision',
    visualType: 'cnn-convolution',
    formula: 'S(i, j) = (I * K)(i, j) = \\sum_{m} \\sum_{n} I(i + m, j + n) \\cdot K(m, n)',
    summary: 'Slides a learnable 3x3 filter kernel over an input image matrix to detect local visual features like edges and textures.',
    description: 'Convolutional layers use shared weights and local receptive fields to achieve translation invariance. Traces step-by-step 2D kernel sliding, element-wise dot products, bias addition, and ReLU activation.',
    inputVariants: [
      { label: 'Vertical Edge (Sobel-X)', value: 'vertical-edge' },
      { label: 'Horizontal Edge (Sobel-Y)', value: 'horizontal-edge' },
      { label: 'Ridge Filter', value: 'ridge' },
      { label: 'Identity Filter', value: 'identity' },
    ],
    vi: {
      title: '04. Mạng Nơ-ron Tích chập (CNN) & Bản đồ Đặc trưng (Feature Map)',
      category: 'Deep Learning & Mạng Nơ-ron',
      badge: 'Computer Vision',
      summary: 'Trượt kernel lọc 3x3 qua ma trận ảnh đầu vào để trích xuất các đặc trưng thị giác cục bộ như đường biên và họa tiết.',
      description: 'Tầng tích chập (Conv2d) sử dụng chia sẻ trọng số và vùng tiếp nhận cục bộ để đạt tính bất biến tịnh tiến. Trực quan hóa từng bước trượt kernel 2D, nhân tích chập vô hướng và kích hoạt ReLU.',
      variants: [
        { label: 'Đường biên dọc (Sobel-X)', value: 'vertical-edge' },
        { label: 'Đường biên ngang (Sobel-Y)', value: 'horizontal-edge' },
        { label: 'Bộ lọc Ridge', value: 'ridge' },
        { label: 'Bộ lọc Identity', value: 'identity' },
      ],
      sections: [
        {
          title: '1. Tại sao Tích chập (Convolution) tối ưu cho Thị giác Máy tính?',
          content: 'Nếu làm phẳng một bức ảnh 2D thành một vector dài để đưa vào MLP, số lượng trọng số sẽ bùng nổ lên hàng triệu tham số và làm mất hoàn toàn cấu trúc không gian 2D. Tầng tích chập dùng một kernel nhỏ (ví dụ 3x3) trượt khắp bức ảnh, chia sẻ chung trọng số cho toàn bộ vị trí.',
          formula: '(I * K)(i, j) = \\sum_{m=0}^{k-1} \\sum_{n=0}^{k-1} I(i+m, j+n) K(m, n)',
          keyTakeaway: 'Tính bất biến tịnh tiến (Translation Invariance): Một đường biên hay chi tiết được nhận diện chính xác bất kể nó nằm ở góc nào của bức ảnh.',
        },
        {
          title: '2. Bản đồ Đặc trưng (Feature Map) hình thành như thế nào?',
          content: 'Tại mỗi vị trí trượt, kernel tính tích vô hướng phần tử (element-wise multiplication) với vùng ảnh tương ứng (receptive field) rồi cộng dồn lại. Giá trị tổng này đại diện cho cường độ đặc trưng tại vị trí đó.',
          keyTakeaway: 'Kích thước đầu ra: Output = (Input - Kernel + 2*Padding) / Stride + 1. Ví dụ ảnh 5x5 qua kernel 3x3 tạo ra Feature Map 3x3.',
        },
        {
          title: '3. Kích hoạt ReLU và Tầng Gom cụm (Max Pooling)',
          content: 'Sau khi tích chập, hàm ReLU (max(0, z)) loại bỏ các giá trị âm để tăng tính phi tuyến. Tiếp đó, tầng Max Pooling lấy giá trị cực đại trong từng cửa sổ 2x2 để giảm một nửa kích thước không gian và giảm chi phí tính toán.',
          keyTakeaway: 'Các tầng tích chập đầu tiên học các đường biên/góc cơ bản; các tầng sâu hơn tổng hợp thành hình dạng, bộ phận và vật thể hoàn chỉnh.',
        },
      ],
    },
    sections: [
      {
        title: '1. Why Convolutions for Computer Vision?',
        content: 'Flattening a 2D image into a 1D vector for a standard MLP destroys 2D spatial relationships and causes an explosion of millions of redundant parameters. CNNs solve this by sliding a compact 3x3 kernel across the entire image with shared weights.',
        formula: '(I * K)(i, j) = \\sum_{m=0}^{k-1} \\sum_{n=0}^{k-1} I(i+m, j+n) K(m, n)',
        keyTakeaway: 'Translation Invariance: Features like edges, textures, or shapes are detected identically regardless of their spatial location in the frame.',
      },
      {
        title: '2. Generating the 2D Feature Map',
        content: 'At each stride position, the kernel performs an element-wise dot product with the underlying receptive field patch and sums the results into a single scalar in the output feature map.',
        keyTakeaway: 'Output Spatial Dimension Formula: Out = (Input - Kernel + 2*Padding) / Stride + 1. A 5x5 image convolved with a 3x3 kernel yields a 3x3 feature map.',
      },
      {
        title: '3. Non-Linear ReLU and Downsampling via Max Pooling',
        content: 'Following convolution, ReLU activations clamp negative responses to introduce sparsity. Downstream Max Pooling layers extract the maximum activation in 2x2 windows, reducing dimensions while retaining prominent visual features.',
        keyTakeaway: 'Early CNN layers capture low-level edges; deeper layers assemble these edges into eyes, wheels, and complex objects.',
      },
    ],
    timeComplexity: 'O(H · W · kH · kW)',
    spaceComplexity: 'O(C_{out} · H_{out} · W_{out})',
    tags: ['CNN', 'Computer Vision', 'PyTorch', 'Feature Map', 'Sobel Filter'],
    defaultInput: 'vertical-edge',
    pythonCode: `import torch
import torch.nn as nn
import numpy as np

# 1. PyTorch Convolutional Layer
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        # 1 input channel, 1 output feature map, 3x3 kernel
        self.conv = nn.Conv2d(in_channels=1, out_channels=1, kernel_size=3, stride=1, padding=0)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)

    def forward(self, x):
        x = self.conv(x)   # 2D Convolution
        x = self.relu(x)   # Non-linear activation
        x = self.pool(x)   # Downsampling
        return x

# 2. Pure NumPy 2D Convolution Operation
def conv2d_forward(image, kernel, bias=0.0):
    H, W = image.shape
    kH, kW = kernel.shape
    out_H, out_W = H - kH + 1, W - kW + 1
    feature_map = np.zeros((out_H, out_W))
    
    for r in range(out_H):
        for c in range(out_W):
            receptive_field = image[r:r+kH, c:c+kW]
            feature_map[r, c] = np.sum(receptive_field * kernel) + bias
    return feature_map`,
    code: `import torch
import torch.nn as nn

def conv2d(image, kernel, bias=0.0):
    H, W = image.shape
    kH, kW = kernel.shape
    feature_map = np.zeros((H - kH + 1, W - kW + 1))
    for r in range(H - kH + 1):
        for c in range(W - kW + 1):
            patch = image[r:r+kH, c:c+kW]
            feature_map[r, c] = np.sum(patch * kernel) + bias
    return np.maximum(0, feature_map)  # ReLU`,
    generateTraces: (_inputStr?: string, lang: Language = 'en'): TraceStep[] => {
      const isVi = lang === 'vi';
      // 5x5 input image containing a vertical boundary between high intensity (10) and low (0)
      const inputMatrix = [
        [10, 10, 10,  0,  0],
        [10, 10, 10,  0,  0],
        [10, 10, 10,  0,  0],
        [10, 10, 10,  0,  0],
        [10, 10, 10,  0,  0],
      ];
      // 3x3 Sobel Vertical Edge Detection Filter
      const kernel = [
        [1, 0, -1],
        [2, 0, -2],
        [1, 0, -1],
      ];

      const steps: TraceStep[] = [];

      // Step 0: Init at (0, 0)
      steps.push({
        step: 0,
        totalSteps: 0,
        line: 4,
        action: 'init',
        targets: [0],
        state: {
          inputMatrix,
          kernel,
          kernelPos: { r: 0, c: 0 },
          featureMap: [
            [0, null, null],
            [null, null, null],
            [null, null, null],
          ],
        },
        explanation: isVi
          ? 'Khởi tạo ma trận ảnh 5x5 và Kernel lọc biên dọc Sobel 3x3 tại vị trí (r=0, c=0). Receptive field nằm trên vùng đồng nhất nên tổng tích chập = 0.'
          : 'Initialized 5x5 image matrix and 3x3 Sobel vertical edge kernel at (r=0, c=0). Uniform receptive field yields dot product = 0.',
        invariant: isVi
          ? 'Kích thước Feature Map đầu ra: (5 - 3 + 1) x (5 - 3 + 1) = 3x3.'
          : 'Output Feature Map dimensions: (H - kH + 1) x (W - kW + 1) = 3x3.',
      });

      // Step 1: Slide to (0, 1) across the vertical edge!
      steps.push({
        step: 1,
        totalSteps: 0,
        line: 8,
        action: 'forward',
        targets: [1],
        state: {
          inputMatrix,
          kernel,
          kernelPos: { r: 0, c: 1 },
          featureMap: [
            [0, 40, null],
            [null, null, null],
            [null, null, null],
          ],
        },
        explanation: isVi
          ? 'Trượt Kernel sang vị trí (r=0, c=1). Cửa sổ bao trùm ranh giới sáng-tối! Tích vô hướng đạt giá trị cao = 40.0. Phát hiện đường biên dọc!'
          : 'Slid Kernel horizontally to (r=0, c=1). Window spans the edge transition! Dot product peaks at 40.0. Strong vertical edge detected!',
        invariant: isVi
          ? 'Tích chập nhân từng phần tử: ∑ (ReceptiveField ⊙ Kernel) = 1(10) + 2(10) + 1(10) = 40.'
          : 'Element-wise multiplication: ∑ (Patch ⊙ Kernel) = 1(10) + 2(10) + 1(10) = 40.',
      });

      // Step 2: Slide to (0, 2)
      steps.push({
        step: 2,
        totalSteps: 0,
        line: 8,
        action: 'forward',
        targets: [2],
        state: {
          inputMatrix,
          kernel,
          kernelPos: { r: 0, c: 2 },
          featureMap: [
            [0, 40, 30],
            [null, null, null],
            [null, null, null],
          ],
        },
        explanation: isVi
          ? 'Trượt Kernel sang vị trí (r=0, c=2). Hoàn thành hàng đầu tiên của Feature Map. Giá trị tích chập = 30.0.'
          : 'Slid Kernel to (r=0, c=2). Completed row 0 of Feature Map with value 30.0.',
        invariant: isVi
          ? 'Kernel trượt ngang với Stride = 1 đến khi chạm biên phải.'
          : 'Horizontal stride = 1 maintained until row boundary.',
      });

      // Step 3: Stride down to row 1, col 1 (center)
      steps.push({
        step: 3,
        totalSteps: 0,
        line: 8,
        action: 'forward',
        targets: [4],
        state: {
          inputMatrix,
          kernel,
          kernelPos: { r: 1, c: 1 },
          featureMap: [
            [0, 40, 30],
            [0, 40, 30],
            [null, null, null],
          ],
        },
        explanation: isVi
          ? 'Xuống hàng tiếp theo (Stride dọc = 1), trượt tới trung tâm (r=1, c=1). Tiếp tục phát hiện đường biên dọc với giá trị cực đại 40.0.'
          : 'Strided down to row 1, centered at (r=1, c=1). Senses vertical edge continuously with peak response 40.0.',
        invariant: isVi
          ? 'Chia sẻ tham số (Parameter sharing): Sử dụng cùng một bộ lọc 3x3 cho toàn bộ các vị trí ảnh.'
          : 'Parameter sharing: Identical 3x3 weights applied across all spatial receptive fields.',
      });

      // Step 4: Done - Full Feature Map and ReLU
      steps.push({
        step: 4,
        totalSteps: 0,
        line: 10,
        action: 'done',
        targets: [8],
        state: {
          inputMatrix,
          kernel,
          kernelPos: { r: 2, c: 2 },
          featureMap: [
            [0, 40, 30],
            [0, 40, 30],
            [0, 40, 30],
          ],
        },
        explanation: isVi
          ? 'Quá trình tích chập hoàn tất! Tạo thành Feature Map 3x3 với dải biên dọc kích hoạt mạnh ở cột giữa (40.0). Áp dụng ReLU giữ nguyên các đặc trưng tích cực.'
          : '2D Convolution complete! Generated full 3x3 Feature Map exhibiting a bright vertical activation band (40.0) where the edge exists.',
        invariant: isVi
          ? 'Bản đồ đặc trưng trích xuất thành công cạnh dọc từ ảnh gốc 5x5.'
          : 'Feature map successfully extracts structural vertical edge from raw 5x5 pixels.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  {
    id: 'house-price-mlp',
    title: '05. House Price Prediction with Neural Network',
    category: 'Deep Learning & Neural Networks',
    difficulty: 'Intermediate',
    badge: 'Regression MLP',
    visualType: 'neural-network',
    formula: '\\hat{price} = W_2 \\cdot \\text{ReLU}(W_1 \\mathbf{x} + b_1) + b_2',
    summary: 'Predicts house prices from area, bedrooms, and location score using a 3→4→1 ReLU MLP regression network.',
    description: 'A practical regression MLP maps three normalized house features (area m², bedrooms, location quality score) through a hidden ReLU layer of 4 neurons to produce a continuous price prediction in millions USD. Demonstrates how MLPs replace linear regression for non-linear real-estate patterns.',
    inputVariants: [
      { label: 'Suburban (80m², 2BR, 0.7)', value: 'area: 0.80, rooms: 0.40, loc: 0.70' },
      { label: 'City Center (120m², 3BR, 0.95)', value: 'area: 1.00, rooms: 0.75, loc: 0.95' },
      { label: 'Rural (60m², 2BR, 0.30)', value: 'area: 0.60, rooms: 0.40, loc: 0.30' },
      { label: 'Luxury (200m², 5BR, 1.0)', value: 'area: 1.00, rooms: 1.00, loc: 1.00' },
    ],
    vi: {
      title: '05. Dự đoán Giá Nhà bằng Neural Network',
      category: 'Deep Learning & Mạng Nơ-ron',
      badge: 'Regression MLP',
      summary: 'Dự đoán giá nhà từ diện tích, số phòng ngủ và điểm vị trí bằng mạng MLP hồi quy 3→4→1 với ReLU.',
      description: 'MLP hồi quy thực tế ánh xạ 3 đặc trưng nhà (diện tích m², số phòng ngủ, điểm chất lượng vị trí) qua một hidden layer ReLU 4 nơ-ron để dự đoán giá liên tục tính bằng tỷ đồng. Minh chứng cách MLP vượt qua hồi quy tuyến tính trong các bài toán bất động sản phi tuyến.',
      variants: [
        { label: 'Ngoại ô (80m², 2PN, 0.7)', value: 'area: 0.80, rooms: 0.40, loc: 0.70' },
        { label: 'Trung tâm (120m², 3PN, 0.95)', value: 'area: 1.00, rooms: 0.75, loc: 0.95' },
        { label: 'Vùng quê (60m², 2PN, 0.30)', value: 'area: 0.60, rooms: 0.40, loc: 0.30' },
        { label: 'Cao cấp (200m², 5PN, 1.0)', value: 'area: 1.00, rooms: 1.00, loc: 1.00' },
      ],
      sections: [
        {
          title: '1. Tại sao MLP tốt hơn Hồi quy Tuyến tính cho Bất động sản?',
          content: 'Giá nhà phụ thuộc vào các tương tác phi tuyến phức tạp: vị trí đắt đỏ x diện tích lớn x tầng cao → giá tăng theo hàm mũ, không tuyến tính. Hồi quy tuyến tính y = wx + b buộc phải mô hình hóa tất cả bằng một siêu phẳng phẳng. Hidden ReLU layers của MLP giúp học các ngưỡng phi tuyến như "vị trí > 0.8 AND diện tích > 0.9 → giá tăng đột biến".',
          formula: '\\text{ReLU}(z) = \\max(0, z) \\quad \\Rightarrow \\quad \\text{học ngưỡng phi tuyến}',
          keyTakeaway: 'MLP với hidden layers là "Universal Approximator": có thể xấp xỉ bất kỳ hàm số liên tục nào, kể cả đường cong giá bất động sản.',
        },
        {
          title: '2. Chuẩn hóa đặc trưng (Feature Normalization) trước khi đưa vào MLP',
          content: 'Diện tích tính bằng m² (60–300), số phòng (1–6), và điểm vị trí (0–1) có thang đo hoàn toàn khác nhau. Nếu không chuẩn hóa, gradient descent sẽ bị thiên vị nặng về đặc trưng có giá trị lớn (diện tích). Min-Max normalization đưa tất cả về [0, 1].',
          formula: 'x_{\\text{norm}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}',
          keyTakeaway: 'Batch Normalization trong deep learning hiện đại thực hiện bước chuẩn hóa này ngay bên trong từng layer.',
        },
        {
          title: '3. Hàm Mất mát MSE cho Bài toán Hồi quy',
          content: 'Khác với bài toán phân loại dùng Binary Cross-Entropy, hồi quy giá nhà dùng Mean Squared Error (MSE): tính trung bình bình phương khoảng cách giữa giá dự đoán và giá thực tế. Backpropagation cực tiểu hóa MSE theo toàn bộ tham số W₁, b₁, W₂, b₂.',
          formula: 'L_{MSE} = \\frac{1}{N} \\sum_{i=1}^N (\\hat{y}_i - y_i)^2',
          keyTakeaway: 'MSE phạt nặng sai số lớn do bình phương, thúc đẩy mô hình học cẩn thận với các nhà có giá đặc biệt.',
        },
      ],
    },
    sections: [
      {
        title: '1. Why MLP Beats Linear Regression for Real Estate',
        content: 'House prices depend on complex non-linear interactions: premium location × large area × high floor → price increases exponentially, not linearly. Linear regression y = wx + b forces all of this into a flat hyperplane. MLP hidden layers learn non-linear thresholds like "location > 0.8 AND area > 0.9 → price spikes".',
        formula: '\\text{ReLU}(z) = \\max(0, z) \\quad \\Rightarrow \\quad \\text{non-linear threshold learning}',
        keyTakeaway: 'MLP is the Universal Approximator: it can approximate any continuous function — including the complex curves of real estate prices.',
      },
      {
        title: '2. Feature Normalization Before Feeding into MLP',
        content: 'Area in m² (60–300), bedrooms (1–6), and location score (0–1) are on completely different scales. Without normalization, gradient descent is heavily biased toward the highest-magnitude feature. Min-Max normalization maps everything to [0, 1].',
        formula: 'x_{\\text{norm}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}',
        keyTakeaway: 'Modern deep learning handles this with Batch Normalization layers inside the network itself.',
      },
      {
        title: '3. MSE Loss Function for Regression',
        content: 'Unlike classification (Binary Cross-Entropy), house price regression uses Mean Squared Error (MSE): the average squared distance between predicted and actual price. Backpropagation minimizes MSE over all parameters W₁, b₁, W₂, b₂.',
        formula: 'L_{MSE} = \\frac{1}{N} \\sum_{i=1}^N (\\hat{y}_i - y_i)^2',
        keyTakeaway: 'MSE heavily penalizes large errors via squaring, driving the model to be precise on outlier-priced houses.',
      },
    ],
    timeComplexity: 'O(d_in · d_h + d_h · d_out)',
    spaceComplexity: 'O(d_h) hidden activations',
    tags: ['Neural Network', 'MLP', 'Regression', 'ReLU', 'House Price', 'PyTorch'],
    defaultInput: 'area: 0.80, rooms: 0.40, loc: 0.70',
    pythonCode: `import torch
import torch.nn as nn

class HousePriceNet(nn.Module):
    def __init__(self):
        super().__init__()
        # 3 features → 4 ReLU hidden → 1 price output
        self.net = nn.Sequential(
            nn.Linear(3, 4),
            nn.ReLU(),
            nn.Linear(4, 1)
        )

    def forward(self, x):
        return self.net(x)

# Inputs: [area_norm, rooms_norm, location_score]
x = torch.tensor([[0.80, 0.40, 0.70]])
model = HousePriceNet()
price = model(x)
print(f"Predicted price: \${price.item():.2f}M")`,
    code: `import numpy as np

def house_price_mlp(x, W1, b1, W2, b2):
    # 1. Hidden: Linear + ReLU
    z1 = np.dot(x, W1) + b1
    h1 = np.maximum(0, z1)    # ReLU
    # 2. Output: Linear (regression)
    z2 = np.dot(h1, W2) + b2
    return z2                  # price in $M`,
    generateTraces: (inputStr?: string, lang: Language = 'en'): TraceStep[] => {
      const isVi = lang === 'vi';
      let area = 0.80, rooms = 0.40, loc = 0.70;
      if (inputStr) {
        const ma = inputStr.match(/area:\s*(-?[0-9.]+)/i);
        const mr = inputStr.match(/rooms:\s*(-?[0-9.]+)/i);
        const ml = inputStr.match(/loc:\s*(-?[0-9.]+)/i);
        if (ma) area = Number(ma[1]);
        if (mr) rooms = Number(mr[1]);
        if (ml) loc = Number(ml[1]);
      }
      // Fixed weights for repeatable educational demo
      const W1 = [[0.6, 0.3, -0.2, 0.8], [0.4, 0.7, 0.5, -0.3], [0.9, 0.2, 0.6, 0.4]];
      const b1 = [-0.1, 0.2, -0.3, 0.1];
      const W2 = [0.5, 0.4, 0.3, 0.6];
      const b2 = 0.15;
      const x = [area, rooms, loc];
      const z1 = b1.map((bi, j) => Number((x[0]*W1[0][j] + x[1]*W1[1][j] + x[2]*W1[2][j] + bi).toFixed(3)));
      const h1 = z1.map(z => Number(Math.max(0, z).toFixed(3)));
      const price = Number((h1.reduce((s, h, j) => s + h * W2[j], b2)).toFixed(3));
      const inNodes = [
        { label: 'x₁', value: area, activation: isVi ? 'Diện tích' : 'Area' },
        { label: 'x₂', value: rooms, activation: isVi ? 'Phòng ngủ' : 'Rooms' },
        { label: 'x₃', value: loc, activation: isVi ? 'Vị trí' : 'Location' },
      ];
      const steps: TraceStep[] = [];

      steps.push({
        step: 0, totalSteps: 0, line: 1, action: 'init', targets: [],
        state: {
          layers: [
            { name: isVi ? 'Đặc trưng Nhà (x)' : 'House Features (x)', nodes: inNodes },
            { name: isVi ? 'Tầng ẩn ReLU' : 'Hidden Layer (ReLU)',
              nodes: [{ label: 'h₁', value: 0 }, { label: 'h₂', value: 0 }, { label: 'h₃', value: 0 }, { label: 'h₄', value: 0 }] },
            { name: isVi ? 'Giá dự đoán ($M)' : 'Predicted Price ($M)',
              nodes: [{ label: 'ŷ', value: 0, activation: isVi ? 'Đang tính...' : 'Pending' }] },
          ],
        },
        explanation: isVi
          ? `Đầu vào: Diện tích = ${area.toFixed(2)}, Phòng ngủ = ${rooms.toFixed(2)}, Vị trí = ${loc.toFixed(2)}. Sẵn sàng lan truyền tiến qua mạng hồi quy.`
          : `Input: Area = ${area.toFixed(2)}, Rooms = ${rooms.toFixed(2)}, Location = ${loc.toFixed(2)}. Ready to forward propagate through regression network.`,
        invariant: isVi ? 'Đặc trưng đầu vào đã chuẩn hóa trong [0, 1] bằng Min-Max Normalization.' : 'Input features normalized to [0, 1] via Min-Max Normalization.',
      });

      steps.push({
        step: 0, totalSteps: 0, line: 4, action: 'compute', targets: [],
        state: {
          layers: [
            { name: isVi ? 'Đặc trưng Nhà (x)' : 'House Features (x)', nodes: inNodes },
            { name: isVi ? 'Tầng ẩn — z₁ = W₁·x + b₁' : 'Hidden Layer — z₁ = W₁·x + b₁',
              nodes: [{ label: 'z₁', value: z1[0] }, { label: 'z₂', value: z1[1] }, { label: 'z₃', value: z1[2] }, { label: 'z₄', value: z1[3] }] },
            { name: isVi ? 'Giá dự đoán ($M)' : 'Predicted Price ($M)',
              nodes: [{ label: 'ŷ', value: 0, activation: isVi ? 'Đang tính...' : 'Pending' }] },
          ],
        },
        explanation: isVi
          ? `Phép chiếu affine: z₁ = W₁·x + b₁ → [${z1.map(v => v.toFixed(2)).join(', ')}]. Một số giá trị âm sẽ bị ReLU triệt tiêu.`
          : `Affine projection: z₁ = W₁·x + b₁ → [${z1.map(v => v.toFixed(2)).join(', ')}]. Negative values will be killed by ReLU.`,
        invariant: isVi ? 'Tổ hợp tuyến tính z = Wx + b bảo toàn tính tuyến tính.' : 'Linear combination z = Wx + b preserves linearity.',
      });

      steps.push({
        step: 0, totalSteps: 0, line: 6, action: 'forward', targets: [],
        state: {
          layers: [
            { name: isVi ? 'Đặc trưng Nhà (x)' : 'House Features (x)', nodes: inNodes },
            { name: isVi ? 'Tầng ẩn — h₁ = ReLU(z₁)' : 'Hidden Layer — h₁ = ReLU(z₁)',
              nodes: [{ label: 'h₁', value: h1[0], activation: 'ReLU' }, { label: 'h₂', value: h1[1], activation: 'ReLU' }, { label: 'h₃', value: h1[2], activation: 'ReLU' }, { label: 'h₄', value: h1[3], activation: 'ReLU' }] },
            { name: isVi ? 'Giá dự đoán ($M)' : 'Predicted Price ($M)',
              nodes: [{ label: 'ŷ', value: 0, activation: isVi ? 'Đang tính...' : 'Pending' }] },
          ],
        },
        explanation: isVi
          ? `ReLU triệt tiêu giá trị âm: h₁ = max(0, z₁) → [${h1.map(v => v.toFixed(2)).join(', ')}]. Tính thưa thớt giúp mạng tập trung vào tín hiệu quan trọng nhất.`
          : `ReLU kills negatives: h₁ = max(0, z₁) → [${h1.map(v => v.toFixed(2)).join(', ')}]. Sparsity focuses the network on the strongest feature signals.`,
        invariant: isVi ? 'ReLU đảm bảo h₁ ∈ [0, ∞) — gradient luôn dương với nơ-ron đang kích hoạt.' : 'ReLU ensures h₁ ∈ [0, ∞) — gradient stays positive for active neurons.',
      });

      steps.push({
        step: 0, totalSteps: 0, line: 8, action: 'done', targets: [],
        state: {
          layers: [
            { name: isVi ? 'Đặc trưng Nhà (x)' : 'House Features (x)', nodes: inNodes },
            { name: isVi ? 'Tầng ẩn (Hoàn tất)' : 'Hidden Layer (Done)',
              nodes: [{ label: 'h₁', value: h1[0] }, { label: 'h₂', value: h1[1] }, { label: 'h₃', value: h1[2] }, { label: 'h₄', value: h1[3] }] },
            { name: isVi ? 'Giá dự đoán ($M)' : 'Predicted Price ($M)',
              nodes: [{ label: 'ŷ', value: price, activation: isVi ? `$${price.toFixed(2)}M` : `$${price.toFixed(2)}M` }] },
          ],
        },
        explanation: isVi
          ? `Hoàn tất! Tầng đầu ra tuyến tính: giá = W₂·h₁ + b₂ = $${price.toFixed(2)}M. Không dùng Sigmoid vì đây là bài toán hồi quy giá trị liên tục.`
          : `Done! Output linear projection: price = W₂·h₁ + b₂ = $${price.toFixed(2)}M. No Sigmoid — this is continuous-value regression, not classification.`,
        invariant: isVi ? 'Tầng đầu ra hồi quy không có hàm kích hoạt (identity) để giá trị không bị giới hạn trong [0,1].' : 'Regression output has no activation (identity) — price is unbounded, unlike probability.',
      });

      const total = steps.length;
      return steps.map((s, idx) => ({ ...s, step: idx + 1, totalSteps: total }));
    },
  },

  {
    id: 'dog-cat-mlp',
    title: '06. Dog vs. Cat Classification (MLP Classifier)',
    category: 'Deep Learning & Neural Networks',
    difficulty: 'Intermediate',
    badge: 'Binary Classification',
    visualType: 'neural-network',
    formula: 'P(\\text{Cat}) = \\sigma(W_2 \\cdot \\text{ReLU}(W_1 \\mathbf{x} + b_1) + b_2)',
    summary: 'Classifies images as Dog or Cat from 3 visual features (texture, brightness, edge density) using a 3→4→4→1 deep MLP.',
    description: 'A two-hidden-layer MLP binary classifier that takes normalized visual features extracted from animal images and outputs a class probability via Sigmoid. Demonstrates how stacking non-linear layers enables complex decision boundaries needed to separate cats from dogs.',
    inputVariants: [
      { label: 'Likely Cat (smooth, bright)', value: 'texture: 0.2, bright: 0.8, edges: 0.3' },
      { label: 'Likely Dog (rough, dark)', value: 'texture: 0.8, bright: 0.4, edges: 0.9' },
      { label: 'Ambiguous', value: 'texture: 0.5, bright: 0.5, edges: 0.5' },
      { label: 'High Contrast Dog', value: 'texture: 0.9, bright: 0.3, edges: 1.0' },
    ],
    vi: {
      title: '06. Phân loại Chó vs. Mèo bằng MLP',
      category: 'Deep Learning & Mạng Nơ-ron',
      badge: 'Phân loại Nhị phân',
      summary: 'Phân loại ảnh là Chó hoặc Mèo từ 3 đặc trưng thị giác (kết cấu, độ sáng, mật độ cạnh) dùng MLP sâu 3→4→4→1.',
      description: 'MLP phân loại nhị phân hai hidden layers nhận đặc trưng thị giác chuẩn hóa từ ảnh động vật và xuất xác suất lớp qua Sigmoid. Minh họa cách xếp chồng các lớp phi tuyến giúp học ranh giới quyết định phức tạp để phân biệt mèo và chó.',
      variants: [
        { label: 'Khả năng là Mèo (mịn, sáng)', value: 'texture: 0.2, bright: 0.8, edges: 0.3' },
        { label: 'Khả năng là Chó (thô, tối)', value: 'texture: 0.8, bright: 0.4, edges: 0.9' },
        { label: 'Mơ hồ (50/50)', value: 'texture: 0.5, bright: 0.5, edges: 0.5' },
        { label: 'Chó tương phản cao', value: 'texture: 0.9, bright: 0.3, edges: 1.0' },
      ],
      sections: [
        {
          title: '1. Tại sao cần 2 Hidden Layers để Phân loại Chó/Mèo?',
          content: 'Chó và mèo có hình dạng lông (texture), tư thế và nét mặt khác nhau, nhưng ranh giới phân loại là phi tuyến và phức tạp. Layer 1 học các đặc trưng nguyên thủy như "có mịn không?". Layer 2 học các tổ hợp cao hơn như "mịn + mắt tròn → mèo". Chỉ một layer ẩn không đủ sức học được sự kết hợp phức tạp này.',
          formula: 'a^{[2]} = \\text{ReLU}(W^{[2]} \\cdot \\text{ReLU}(W^{[1]} x + b^{[1]}) + b^{[2]})',
          keyTakeaway: 'Mỗi layer học đặc trưng ở độ trừu tượng ngày càng cao hơn — đây là bản chất của Deep Learning.',
        },
        {
          title: '2. Hàm Sigmoid và Ý nghĩa Xác suất Lớp',
          content: 'Tầng đầu ra không dùng ReLU mà dùng Sigmoid để ép đầu ra vào [0, 1]. Giá trị này được diễn giải là P(Chó) — xác suất hình ảnh thuộc lớp Chó. Quy tắc quyết định: nếu P(Chó) > 0.5 → "Chó", ngược lại → "Mèo".',
          formula: '\\hat{y} = \\sigma(z) = \\frac{1}{1+e^{-z}} \\in (0, 1)',
          keyTakeaway: 'Binary Cross-Entropy Loss: L = -[y·log(ŷ) + (1-y)·log(1-ŷ)] — phạt nặng khi mô hình tự tin sai.',
        },
        {
          title: '3. Từ MLP đến Mạng CNN hiện đại (Bước tiếp theo)',
          content: 'MLP này nhận đặc trưng thủ công (handcrafted). Mạng CNN hiện đại (ResNet, EfficientNet) tự động trích xuất đặc trưng từ pixel gốc qua hàng chục Conv layers. MLP vẫn là "đầu phân loại" (classification head) ở cuối mọi CNN hiện đại.',
          keyTakeaway: 'MLP hiểu nguyên lý phân loại nhị phân. CNN chỉ thêm bước tự học đặc trưng từ pixel — cấu trúc quyết định vẫn là MLP Sigmoid này.',
        },
      ],
    },
    sections: [
      {
        title: '1. Why 2 Hidden Layers for Dog/Cat Classification?',
        content: 'Dogs and cats differ in fur texture, posture, and facial structure — but the decision boundary is highly non-linear. Layer 1 learns primitive features like "is it smooth?". Layer 2 combines them: "smooth + round eyes → cat". A single hidden layer cannot capture such high-order combinations.',
        formula: 'a^{[2]} = \\text{ReLU}(W^{[2]} \\cdot \\text{ReLU}(W^{[1]} x + b^{[1]}) + b^{[2]})',
        keyTakeaway: 'Each layer learns features at an increasingly abstract level — this hierarchy is the essence of Deep Learning.',
      },
      {
        title: '2. Sigmoid Output and Class Probability Interpretation',
        content: 'The output layer uses Sigmoid (not ReLU) to squash the final logit into [0, 1]. This is interpreted as P(Dog). Decision rule: if P(Dog) > 0.5 → "Dog", else → "Cat".',
        formula: '\\hat{y} = \\sigma(z) = \\frac{1}{1+e^{-z}} \\in (0, 1)',
        keyTakeaway: 'Binary Cross-Entropy Loss penalizes confident wrong predictions the most — driving the model to be accurately calibrated.',
      },
      {
        title: '3. From MLP to Modern CNN (The Next Step)',
        content: 'This MLP takes handcrafted features. Modern CNNs (ResNet, EfficientNet) automatically extract features from raw pixels through dozens of Conv layers. The MLP Sigmoid head at the end remains the same — CNNs just add automatic feature extraction before it.',
        keyTakeaway: 'Understanding this MLP is understanding the classification head of every modern vision model.',
      },
    ],
    timeComplexity: 'O(d₁·d₂ + d₂·d₃ + d₃·1)',
    spaceComplexity: 'O(d₂ + d₃) hidden activations',
    tags: ['MLP', 'Binary Classification', 'Sigmoid', 'ReLU', 'Computer Vision', 'PyTorch'],
    defaultInput: 'texture: 0.2, bright: 0.8, edges: 0.3',
    pythonCode: `import torch
import torch.nn as nn

class DogCatMLP(nn.Module):
    def __init__(self):
        super().__init__()
        # 3 visual features → 4 → 4 → 1 (Sigmoid prob)
        self.net = nn.Sequential(
            nn.Linear(3, 4), nn.ReLU(),
            nn.Linear(4, 4), nn.ReLU(),
            nn.Linear(4, 1), nn.Sigmoid(),
        )

    def forward(self, x):
        return self.net(x)

# Features: [texture_score, brightness, edge_density]
x = torch.tensor([[0.2, 0.8, 0.3]])  # likely cat
model = DogCatMLP()
prob = model(x).item()
label = "Dog" if prob > 0.5 else "Cat"
print(f"P(Dog) = {prob:.3f} → Predicted: {label}")`,
    code: `import numpy as np

def dog_cat_mlp(x, W1,b1, W2,b2, W3,b3):
    h1 = np.maximum(0, np.dot(x,W1) + b1)  # ReLU
    h2 = np.maximum(0, np.dot(h1,W2) + b2) # ReLU
    z3 = np.dot(h2, W3) + b3
    y  = 1 / (1 + np.exp(-z3))             # Sigmoid
    return y  # P(Dog)`,
    generateTraces: (inputStr?: string, lang: Language = 'en'): TraceStep[] => {
      const isVi = lang === 'vi';
      let tex = 0.2, bright = 0.8, edges = 0.3;
      if (inputStr) {
        const mt = inputStr.match(/texture:\s*(-?[0-9.]+)/i);
        const mb = inputStr.match(/bright:\s*(-?[0-9.]+)/i);
        const me = inputStr.match(/edges:\s*(-?[0-9.]+)/i);
        if (mt) tex = Number(mt[1]);
        if (mb) bright = Number(mb[1]);
        if (me) edges = Number(me[1]);
      }
      const x = [tex, bright, edges];
      const W1 = [[0.7,-0.4,0.5,0.3],[-0.6,0.8,-0.3,0.5],[0.4,-0.2,0.9,-0.6]];
      const b1 = [0.1,-0.2,0.3,-0.1];
      const W2 = [[0.5,0.3,-0.4,0.6],[-0.3,0.7,0.5,-0.2],[0.4,-0.5,0.3,0.8],[-0.2,0.4,-0.6,0.3]];
      const b2 = [-0.1,0.2,-0.3,0.1];
      const W3 = [0.6,-0.8,0.7,-0.5];
      const b3 = -0.2;
      const z1 = b1.map((bi,j)=>Number((x[0]*W1[0][j]+x[1]*W1[1][j]+x[2]*W1[2][j]+bi).toFixed(3)));
      const h1 = z1.map(z=>Number(Math.max(0,z).toFixed(3)));
      const z2 = b2.map((bi,j)=>Number((h1[0]*W2[0][j]+h1[1]*W2[1][j]+h1[2]*W2[2][j]+h1[3]*W2[3][j]+bi).toFixed(3)));
      const h2 = z2.map(z=>Number(Math.max(0,z).toFixed(3)));
      const z3 = Number((h2.reduce((s,h,j)=>s+h*W3[j],b3)).toFixed(3));
      const pDog = Number((1/(1+Math.exp(-z3))).toFixed(3));
      const label = pDog > 0.5 ? (isVi ? 'CHÓ 🐶' : 'DOG 🐶') : (isVi ? 'MÈO 🐱' : 'CAT 🐱');
      const inNodes = [
        { label: 'x₁', value: tex, activation: isVi ? 'Kết cấu' : 'Texture' },
        { label: 'x₂', value: bright, activation: isVi ? 'Độ sáng' : 'Brightness' },
        { label: 'x₃', value: edges, activation: isVi ? 'Đường cạnh' : 'Edges' },
      ];
      const steps: TraceStep[] = [];

      steps.push({
        step: 0, totalSteps: 0, line: 1, action: 'init', targets: [],
        state: {
          layers: [
            { name: isVi ? 'Đặc trưng Ảnh (x)' : 'Image Features (x)', nodes: inNodes },
            { name: isVi ? 'Tầng ẩn 1 (ReLU)' : 'Hidden Layer 1 (ReLU)',
              nodes: [{ label:'h1₁',value:0},{label:'h1₂',value:0},{label:'h1₃',value:0},{label:'h1₄',value:0}] },
            { name: isVi ? 'Tầng ẩn 2 (ReLU)' : 'Hidden Layer 2 (ReLU)',
              nodes: [{ label:'h2₁',value:0},{label:'h2₂',value:0},{label:'h2₃',value:0},{label:'h2₄',value:0}] },
            { name: isVi ? 'Xác suất P(Chó)' : 'P(Dog) Output',
              nodes: [{ label: 'ŷ', value: 0, activation: isVi ? 'Đang tính...' : 'Pending' }] },
          ],
        },
        explanation: isVi
          ? `Đặc trưng ảnh: Kết cấu=${tex.toFixed(2)}, Độ sáng=${bright.toFixed(2)}, Cạnh=${edges.toFixed(2)}. Chuẩn bị lan truyền tiến qua mạng phân loại 2 hidden layers.`
          : `Image features: Texture=${tex.toFixed(2)}, Brightness=${bright.toFixed(2)}, Edges=${edges.toFixed(2)}. Forwarding through 2-hidden-layer classifier.`,
        invariant: isVi ? 'Đặc trưng chuẩn hóa ∈ [0,1]. Mạng có cấu trúc 3→4→4→1.' : 'Features normalized ∈ [0,1]. Network architecture: 3→4→4→1.',
      });

      steps.push({
        step: 0, totalSteps: 0, line: 4, action: 'compute', targets: [],
        state: {
          layers: [
            { name: isVi ? 'Đặc trưng Ảnh (x)' : 'Image Features (x)', nodes: inNodes },
            { name: isVi ? 'Tầng ẩn 1 — z₁' : 'Hidden Layer 1 — z₁',
              nodes: z1.map((v,i)=>({label:`z₁${i+1}`,value:v})) },
            { name: isVi ? 'Tầng ẩn 2 (ReLU)' : 'Hidden Layer 2 (ReLU)',
              nodes: [{label:'h2₁',value:0},{label:'h2₂',value:0},{label:'h2₃',value:0},{label:'h2₄',value:0}] },
            { name: isVi ? 'Xác suất P(Chó)' : 'P(Dog) Output',
              nodes: [{ label: 'ŷ', value: 0, activation: isVi ? 'Đang tính...' : 'Pending' }] },
          ],
        },
        explanation: isVi
          ? `Tầng ẩn 1 tổ hợp tuyến tính: z₁ = W₁·x + b₁ → [${z1.map(v=>v.toFixed(2)).join(', ')}]. Phát hiện các đặc trưng nguyên thủy.`
          : `Hidden Layer 1 linear combination: z₁ = W₁·x + b₁ → [${z1.map(v=>v.toFixed(2)).join(', ')}]. Detecting primitive features.`,
        invariant: isVi ? 'Layer 1 học đặc trưng cấp thấp: cạnh, màu sắc, kết cấu.' : 'Layer 1 learns low-level features: edges, color, texture.',
      });

      steps.push({
        step: 0, totalSteps: 0, line: 5, action: 'forward', targets: [],
        state: {
          layers: [
            { name: isVi ? 'Đặc trưng Ảnh (x)' : 'Image Features (x)', nodes: inNodes },
            { name: isVi ? 'Tầng ẩn 1 — h₁ = ReLU(z₁)' : 'Hidden Layer 1 — h₁ = ReLU(z₁)',
              nodes: h1.map((v,i)=>({label:`h1${i+1}`,value:v,activation:'ReLU'})) },
            { name: isVi ? 'Tầng ẩn 2 — z₂' : 'Hidden Layer 2 — z₂',
              nodes: z2.map((v,i)=>({label:`z₂${i+1}`,value:v})) },
            { name: isVi ? 'Xác suất P(Chó)' : 'P(Dog) Output',
              nodes: [{ label: 'ŷ', value: 0, activation: isVi ? 'Đang tính...' : 'Pending' }] },
          ],
        },
        explanation: isVi
          ? `ReLU(z₁) → h₁=[${h1.map(v=>v.toFixed(2)).join(', ')}]. Tầng ẩn 2 phóng chiếu: z₂=[${z2.map(v=>v.toFixed(2)).join(', ')}]. Học tổ hợp đặc trưng bậc cao.`
          : `ReLU(z₁) → h₁=[${h1.map(v=>v.toFixed(2)).join(', ')}]. Layer 2 projection: z₂=[${z2.map(v=>v.toFixed(2)).join(', ')}]. Learning high-level feature combos.`,
        invariant: isVi ? 'Layer 2 học đặc trưng bậc cao: "mịn + sáng → mèo", "thô + nhiều cạnh → chó".' : 'Layer 2 learns high-level: "smooth + bright → cat", "rough + many edges → dog".',
      });

      steps.push({
        step: 0, totalSteps: 0, line: 7, action: 'compute', targets: [],
        state: {
          layers: [
            { name: isVi ? 'Đặc trưng Ảnh (x)' : 'Image Features (x)', nodes: inNodes },
            { name: isVi ? 'Tầng ẩn 1 (Hoàn tất)' : 'Hidden Layer 1 (Done)',
              nodes: h1.map((v,i)=>({label:`h1${i+1}`,value:v})) },
            { name: isVi ? 'Tầng ẩn 2 — h₂ = ReLU(z₂)' : 'Hidden Layer 2 — h₂ = ReLU(z₂)',
              nodes: h2.map((v,i)=>({label:`h2${i+1}`,value:v,activation:'ReLU'})) },
            { name: isVi ? 'Xác suất P(Chó)' : 'P(Dog) Output',
              nodes: [{ label: 'ŷ', value: 0, activation: isVi ? 'Đang tính...' : 'Pending' }] },
          ],
        },
        explanation: isVi
          ? `ReLU tầng 2: h₂=[${h2.map(v=>v.toFixed(2)).join(', ')}]. Đặc trưng bậc cao đã trích xuất, sẵn sàng cho tầng đầu ra Sigmoid.`
          : `Layer 2 ReLU: h₂=[${h2.map(v=>v.toFixed(2)).join(', ')}]. High-level features extracted, ready for Sigmoid output.`,
        invariant: isVi ? 'Mỗi hidden layer học một tầng trừu tượng mới.' : 'Each hidden layer learns a new level of abstraction.',
      });

      steps.push({
        step: 0, totalSteps: 0, line: 9, action: 'done', targets: [],
        state: {
          layers: [
            { name: isVi ? 'Đặc trưng Ảnh (x)' : 'Image Features (x)', nodes: inNodes },
            { name: isVi ? 'Tầng ẩn 1' : 'Hidden Layer 1',
              nodes: h1.map((v,i)=>({label:`h1${i+1}`,value:v})) },
            { name: isVi ? 'Tầng ẩn 2' : 'Hidden Layer 2',
              nodes: h2.map((v,i)=>({label:`h2${i+1}`,value:v})) },
            { name: isVi ? 'Kết quả Phân loại' : 'Classification Result',
              nodes: [{ label: pDog > 0.5 ? '🐶' : '🐱', value: pDog, activation: label }] },
          ],
        },
        explanation: isVi
          ? `Tầng đầu ra: z₃=${z3.toFixed(3)}, P(Chó) = σ(${z3.toFixed(3)}) = ${pDog.toFixed(3)}. Quyết định: ${label}${pDog > 0.5 ? ` (${(pDog*100).toFixed(1)}% tự tin)` : ` (${((1-pDog)*100).toFixed(1)}% là Mèo)`}.`
          : `Output: z₃=${z3.toFixed(3)}, P(Dog) = σ(${z3.toFixed(3)}) = ${pDog.toFixed(3)}. Decision: ${label}${pDog > 0.5 ? ` (${(pDog*100).toFixed(1)}% confident)` : ` (${((1-pDog)*100).toFixed(1)}% Cat)`}.`,
        invariant: isVi ? 'Sigmoid đảm bảo P(Chó) ∈ (0,1). Quy tắc: P > 0.5 → Chó, P ≤ 0.5 → Mèo.' : 'Sigmoid ensures P(Dog) ∈ (0,1). Decision rule: P > 0.5 → Dog, ≤ 0.5 → Cat.',
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
    title: '01. Self-Attention Mechanism (Q, K, V)',
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
      title: '01. Cơ chế Self-Attention (Q, K, V)',
      category: 'Transformer & Mô hình LLM',
      badge: 'Transformer Core',
      summary: 'Tính toán điểm attention liên quan ngữ cảnh động giữa tất cả các cặp tokens trong câu.',
      description: 'Nền tảng của các mô hình LLM hiện đại. Mỗi token tạo ra các vector nhúng Query (Q), Key (K) và Value (V). Tích vô hướng giữa Query và Key đo lường mức độ tương quan ngữ cảnh trong câu.',
      variants: [
        { label: 'Chuẩn', value: 'The, quick, brown, fox, jumps' },
        { label: 'Câu ngắn', value: 'AI, models, learn, patterns' },
        { label: 'Mã nguồn', value: 'def, forward, layer, loss' },
      ],
      sections: [
        {
          title: '1. Tại sao Self-Attention tạo nên Cuộc Cách mạng NLP?',
          content: 'Các kiến trúc tuần hoàn trước đây (RNN/LSTM) xử lý từng từ nối tiếp nhau, gây nghẽn memory khi gặp câu dài. Cơ chế Self-Attention cho phép mỗi từ tương tác trực tiếp với mọi từ khác trong văn bản với đường dẫn O(1), đồng thời huấn luyện song song cực nhanh trên GPU.',
          formula: 'S_{ij} = \\frac{q_i \\cdot k_j^T}{\\sqrt{d_k}}',
          keyTakeaway: 'Self-Attention giải quyết triệt để vấn đề phụ thuộc tầm xa (long-range dependency) bằng ma trận dot-product.',
        },
        {
          title: '2. Vai trò của Query, Key và Value',
          content: 'Query là câu truy vấn tìm kiếm, Keys là các thẻ chỉ mục trên mỗi token trong ngữ cảnh, và Values là thông tin ngữ nghĩa thực tế được trích xuất khi Query và Key match nhau.',
          keyTakeaway: 'Hàm Softmax chuẩn hóa dot-products thành phân phối xác suất có tổng bằng 1.0, điều hướng mô hình tập trung sự chú ý.',
        },
        {
          title: '3. Causal Masking trong Mô hình Generative LLMs',
          content: 'Trong các mô hình autoregressive (như GPT), token ở hiện tại không được phép nhìn trước tương lai. Causal mask gán các vị trí tương lai bằng -inf, khiến Softmax triệt tiêu xác suất về 0.',
          formula: '\\text{Masked}(S_{ij}) = -\\infty \\quad \\text{if } j > i',
          keyTakeaway: 'Causal mask đảm bảo nguyên tắc autoregressive một chiều trong quá trình training và generation.',
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
