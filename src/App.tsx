import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ThemeMode, ViewMode, AlgorithmPreset, TraceStep, AppView } from './types';
import { ALGORITHM_PRESETS } from './algorithms/presets';
import { Header } from './components/Header';
import { PlayerControls } from './components/PlayerControls';
import { VisualStage } from './components/VisualStage';
import { CodePane } from './components/CodePane';
import { DiagnosticsPane } from './components/DiagnosticsPane';
import { MobileStoryMode } from './components/MobileStoryMode';
import { CatalogView } from './components/CatalogView';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('sketch');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop-3pane');
  const [appRoute, setAppRoute] = useState<AppView>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#visualizer')) {
      return 'visualizer';
    }
    return 'catalog';
  });

  const [selectedPreset, setSelectedPreset] = useState<AlgorithmPreset>(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('id=')) {
      const match = window.location.hash.match(/id=([a-zA-Z0-9_-]+)/);
      if (match) {
        const found = ALGORITHM_PRESETS.find((p) => p.id === match[1]);
        if (found) return found;
      }
    }
    return ALGORITHM_PRESETS[0];
  });

  const [inputStr, setInputStr] = useState<string>(selectedPreset.defaultInput);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Sync hash changes (browser back/forward button)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#visualizer')) {
        setAppRoute('visualizer');
        const match = hash.match(/id=([a-zA-Z0-9_-]+)/);
        if (match) {
          const found = ALGORITHM_PRESETS.find((p) => p.id === match[1]);
          if (found && found.id !== selectedPreset.id) {
            setSelectedPreset(found);
            setInputStr(found.defaultInput);
            setCurrentStepIndex(0);
            setIsPlaying(false);
          }
        }
      } else {
        setAppRoute('catalog');
        setIsPlaying(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [selectedPreset.id]);

  // Generate trace steps memoized
  const traces: TraceStep[] = useMemo(() => {
    try {
      const generated = selectedPreset.generateTraces(inputStr);
      return generated.length > 0
        ? generated
        : [
            {
              step: 1,
              totalSteps: 1,
              line: 1,
              action: 'init',
              targets: [],
              state: {},
              explanation: 'No traces available for this input.',
            },
          ];
    } catch (err) {
      console.error('Error generating traces:', err);
      return [
        {
          step: 1,
          totalSteps: 1,
          line: 1,
          action: 'init',
          targets: [],
          state: {},
          explanation: 'Failed to parse input or generate execution steps.',
        },
      ];
    }
  }, [selectedPreset, inputStr]);

  const currentStep = traces[currentStepIndex] || traces[0];
  const totalSteps = traces.length;

  // Handlers
  const handleNext = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const handlePrev = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleFirst = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  const handleLast = useCallback(() => {
    setCurrentStepIndex(totalSteps - 1);
    setIsPlaying(false);
  }, [totalSteps]);

  const handleSeek = useCallback(
    (stepNum: number) => {
      const targetIdx = Math.max(0, Math.min(stepNum - 1, totalSteps - 1));
      setCurrentStepIndex(targetIdx);
    },
    [totalSteps]
  );

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev && currentStepIndex >= totalSteps - 1) {
        setCurrentStepIndex(0);
      }
      return !prev;
    });
  }, [currentStepIndex, totalSteps]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleSelectPreset = useCallback((preset: AlgorithmPreset) => {
    setSelectedPreset(preset);
    setInputStr(preset.defaultInput);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    window.location.hash = `#visualizer?id=${preset.id}`;
  }, []);

  const handleOpenFromCatalog = useCallback((preset: AlgorithmPreset) => {
    setSelectedPreset(preset);
    setInputStr(preset.defaultInput);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setAppRoute('visualizer');
    window.location.hash = `#visualizer?id=${preset.id}`;
  }, []);

  const handleBackToCatalog = useCallback(() => {
    setIsPlaying(false);
    setAppRoute('catalog');
    window.location.hash = '#catalog';
  }, []);

  // Timer loop for autoplay
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(200, 1000 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, speed, totalSteps]);

  // Global keyboard shortcuts (only in visualizer view)
  useEffect(() => {
    if (appRoute !== 'visualizer') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'Home') {
        e.preventDefault();
        handleFirst();
      } else if (e.code === 'End') {
        e.preventDefault();
        handleLast();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appRoute, handleTogglePlay, handleNext, handlePrev, handleFirst, handleLast, handleReset]);

  const isSketch = theme === 'sketch';

  // If on Catalog Route, render the rich categorized Curriculum / Catalog View
  if (appRoute === 'catalog') {
    return (
      <CatalogView
        theme={theme}
        onSelectAlgorithm={handleOpenFromCatalog}
        onToggleTheme={() => setTheme(isSketch ? 'studio' : 'sketch')}
      />
    );
  }

  // Otherwise, render the Interactive Studio
  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isSketch
          ? 'bg-sketch-grid text-[#282828] sketch-theme'
          : 'bg-studio-grid text-slate-100 studio-theme dark'
      }`}
    >
      {/* Top Navigation & App Bar */}
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(isSketch ? 'studio' : 'sketch')}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode((prev) =>
            prev === 'desktop-3pane' ? 'mobile-story' : 'desktop-3pane'
          )
        }
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
        inputStr={inputStr}
        onChangeInput={(val) => {
          setInputStr(val);
          setCurrentStepIndex(0);
        }}
        onReset={handleReset}
        onBackToCatalog={handleBackToCatalog}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 flex overflow-hidden">
        {viewMode === 'mobile-story' ? (
          // Mobile Story Card Layout
          <div className="flex-1 overflow-y-auto py-4">
            <MobileStoryMode
              theme={theme}
              preset={selectedPreset}
              step={currentStep}
              currentStep={currentStepIndex + 1}
              totalSteps={totalSteps}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onNextStep={handleNext}
              onPrevStep={handlePrev}
              onSeek={handleSeek}
            />
          </div>
        ) : (
          // Synchronized 3-Pane Desktop Studio Layout
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Left Column: Code Pane (4 cols) */}
            <div className="hidden lg:block lg:col-span-4 h-full overflow-hidden">
              <CodePane
                theme={theme}
                code={selectedPreset.code}
                activeLine={currentStep.line}
                step={currentStep}
              />
            </div>

            {/* Center Column: Visual Stage (5 cols) */}
            <div className="col-span-1 lg:col-span-5 h-full overflow-hidden flex flex-col">
              <VisualStage
                theme={theme}
                step={currentStep}
                category={selectedPreset.category}
              />
            </div>

            {/* Right Column: Diagnostics & Invariants (3 cols) */}
            <div className="hidden md:block col-span-1 lg:col-span-3 h-full overflow-hidden">
              <DiagnosticsPane
                theme={theme}
                step={currentStep}
                algorithmTitle={selectedPreset.title}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Player Controls Bar */}
      {viewMode === 'desktop-3pane' && (
        <PlayerControls
          theme={theme}
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          speed={speed}
          onTogglePlay={handleTogglePlay}
          onNextStep={handleNext}
          onPrevStep={handlePrev}
          onFirstStep={handleFirst}
          onLastStep={handleLast}
          onSeek={handleSeek}
          onChangeSpeed={setSpeed}
        />
      )}
    </div>
  );
};

export default App;
