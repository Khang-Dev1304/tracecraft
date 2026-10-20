export type ThemeMode = 'sketch' | 'studio';

export type Language = 'en' | 'vi';
export type ViewMode = 'desktop-3pane' | 'mobile-story';

export type AppView = 'catalog' | 'visualizer';

export type StudioTab = 'trace' | 'theory';

export type AICategory =
  | 'Classical Machine Learning'
  | 'Deep Learning & Neural Networks'
  | 'Transformers & Modern LLMs';

export type AlgorithmCategory = AICategory;
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type VisualType =
  | 'regression-plot'
  | 'neural-network'
  | 'single-neuron'
  | 'modern-neuron'
  | 'attention-matrix'
  | 'cnn-convolution'
  | 'mnist-interactive'
  | 'array-bars';

export type StepAction =
  | 'init'
  | 'forward'
  | 'loss'
  | 'backward'
  | 'update'
  | 'converged'
  | 'compare'
  | 'swap'
  | 'pivot'
  | 'visit'
  | 'found'
  | 'compute'
  | 'done';

export interface DataPoint {
  x: number;
  y: number;
  yPred?: number;
}

export interface NeuralNode {
  label: string;
  value: number;
  activation?: string;
}

export interface NeuralLayer {
  name: string;
  nodes: NeuralNode[];
}

export interface SingleNeuronState {
  inputs: { label: string; val: number }[];
  weights: number[];
  bias: number;
  weightedSum: number;
  activationName: string;
  outputVal: number;
}

export interface BioNeuronState {
  membraneVoltage: number; // in mV, e.g. -70, -55, +40, -80, -70
  phase: 'resting' | 'depolarization' | 'peak' | 'repolarization' | 'refractory';
  naChannels: 'closed' | 'open' | 'inactivated';
  kChannels: 'closed' | 'open';
  dendriteInputs: number[];
  stimulusCurrent: number; // in pA
  history: { t: number; mv: number }[];
}

export interface ModernNeuronState {
  inputs: { label: string; val: number }[];
  weights: number[];
  bias: number;
  zVal: number;
  activationType: 'step' | 'sigmoid' | 'relu' | 'tanh';
  outputVal: number;
  gradientVal: number; // da/dz
}

export interface MnistDigitProb {
  digit: number;
  prob: number;
  logit: number;
}

export interface MnistState {
  grid: number[][];
  flattenedSample: number[];
  hiddenLayer: number[];
  probabilities: MnistDigitProb[];
  predictedDigit: number;
  confidence: number;
  activePhase: 'draw' | 'flatten' | 'hidden' | 'softmax' | 'result';
}

export type PrimitiveStateValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | number[]
  | string[]
  | number[][]
  | (number | null)[][]
  | { r: number; c: number }
  | DataPoint[]
  | NeuralLayer[]
  | SingleNeuronState
  | ModernNeuronState
  | BioNeuronState
  | { token: string; prob: number }[]
  | MnistState;
export interface StepState {
  epoch?: number;
  loss?: number;
  weight?: number;
  bias?: number;
  learningRate?: number;
  gradW?: number;
  gradB?: number;
  points?: DataPoint[];
  layers?: NeuralLayer[];
  tokens?: string[];
  probabilities?: { token: string; prob: number }[];
  arr?: number[];
  i?: number;
  j?: number;
  inputMatrix?: number[][];
  kernel?: number[][];
  featureMap?: (number | null)[][];
  kernelPos?: { r: number; c: number };
  neuronState?: SingleNeuronState;
  modernNeuronState?: ModernNeuronState;
  bioNeuronState?: BioNeuronState;
  mnistState?: MnistState;
  [key: string]: PrimitiveStateValue;
}

export interface VariableDiffItem {
  before: PrimitiveStateValue;
  after: PrimitiveStateValue;
}

export interface TraceStep {
  step: number;
  totalSteps: number;
  line: number; // 1-based active line in code
  action: StepAction;
  targets: number[]; // indices or keys currently highlighted/manipulated
  state: StepState;
  explanation: string;
  invariant?: string;
  variableDiff?: Record<string, VariableDiffItem>;
}

export interface LessonSection {
  title: string;
  content: string;
  formula?: string;
  keyTakeaway?: string;
}

export interface LocalizedPresetInfo {
  title: string;
  category: string;
  badge: string;
  summary: string;
  description: string;
  sections: LessonSection[];
  variants?: { label: string; value: string }[];
}

export interface AlgorithmPreset {
  id: string;
  title: string;
  category: AICategory;
  difficulty: DifficultyLevel;
  badge: string;
  visualType: VisualType;
  formula: string;
  summary: string;
  description: string;
  sections: LessonSection[];
  timeComplexity: string;
  spaceComplexity: string;
  defaultInput: string;
  inputVariants?: { label: string; value: string }[];
  tags: string[];
  pythonCode: string;
  code: string; // for display in code pane
  vi?: LocalizedPresetInfo;
  generateTraces: (inputStr?: string, lang?: Language) => TraceStep[];
}
