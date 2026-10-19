export type ThemeMode = 'sketch' | 'studio';

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
  | 'attention-matrix'
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

export type PrimitiveStateValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | number[]
  | string[]
  | DataPoint[]
  | NeuralLayer[]
  | { token: string; prob: number }[];

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
  generateTraces: (inputStr: string) => TraceStep[];
}
