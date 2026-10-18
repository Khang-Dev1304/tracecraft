export type ThemeMode = 'sketch' | 'studio';

export type ViewMode = 'desktop-3pane' | 'mobile-story';

export type StepAction =
  | 'init'
  | 'compare'
  | 'swap'
  | 'pivot'
  | 'visit'
  | 'found'
  | 'not-found'
  | 'compute'
  | 'done';

export type PrimitiveStateValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | number[]
  | string[]
  | { token: string; prob: number }[];

export interface StepState {
  arr?: number[];
  left?: number;
  right?: number;
  mid?: number;
  target?: number;
  pivotIndex?: number;
  tokens?: string[];
  probabilities?: { token: string; prob: number }[];
  i?: number;
  j?: number;
  swapped?: boolean;
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
  targets: number[]; // indices or node keys currently highlighted/manipulated
  state: StepState;
  explanation: string;
  invariant?: string;
  variableDiff?: Record<string, VariableDiffItem>;
}

export interface AlgorithmPreset {
  id: string;
  title: string;
  category: 'Algorithms' | 'Data Structures' | 'Modern AI';
  badge: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  defaultInput: string;
  code: string;
  generateTraces: (inputStr: string) => TraceStep[];
}
