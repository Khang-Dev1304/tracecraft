import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ThemeMode, ViewMode, AlgorithmPreset, TraceStep, AppView, StudioTab, AICategory, Language } from './types';
import { ALGORITHM_PRESETS } from './algorithms/presets';
import { NavRail } from './components/NavRail';
import { LessonSidebar } from './components/LessonSidebar';
import { TopBar } from './components/TopBar';
import { VisualStage } from './components/VisualStage';
import { RightPanels } from './components/RightPanels';
import { DockPlayer } from './components/DockPlayer';
import { LessonGuide } from './components/LessonGuide';
import { MobileStoryMode } from './components/MobileStoryMode';
import { CatalogView } from './components/CatalogView';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('sketch');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop-3pane');
  const [studioTab, setStudioTab] = useState<StudioTab>('trace');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('vi');
  const [appRoute, setAppRoute] = useState<AppView>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#visualizer')) {
      return 'visualizer';
    }
    return 'visualizer'; // Directly opens the stunning studio by default, just like VizLearn!
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
      } else if (hash === '#catalog') {
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
      const generated = selectedPreset.generateTraces(inputStr, language);
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
          explanation: 'Failed to generate execution steps.',
        },
      ];
    }
  }, [selectedPreset, inputStr, language]);

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
    setAppRoute('visualizer');
    window.location.hash = `#visualizer?id=${preset.id}`;
  }, []);

  const handleSelectCategoryFromRail = useCallback((cat: AICategory | 'All') => {
    const found = ALGORITHM_PRESETS.find((p) => cat === 'All' || p.category === cat);
    if (found) {
      handleSelectPreset(found);
    }
  }, [handleSelectPreset]);

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

  // Global keyboard shortcuts
  useEffect(() => {
    if (appRoute !== 'visualizer') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
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

  const isDark = theme === 'studio';

  // If on Catalog Route
  if (appRoute === 'catalog') {
    return (
      <div className="animate-page-enter">
        <CatalogView
          theme={theme}
          onSelectAlgorithm={handleSelectPreset}
          onToggleTheme={() => setTheme(isDark ? 'sketch' : 'studio')}
          language={language}
          onSelectLanguage={setLanguage}
        />
      </div>
    );
  }

  // Unified VizLearn-aligned studio architecture
  return (
    <div
      className={`h-screen w-screen flex overflow-hidden font-sans select-none transition-colors duration-300 animate-page-enter ${
        isDark
          ? 'bg-[#090d16] text-slate-100 dark bg-viz-dots-dark'
          : 'bg-[#fbfbfb] text-slate-800 bg-viz-dots'
      }`}
    >
      {/* 1. Leftmost Slim Navigation Rail */}
      <NavRail
        theme={theme}
        onToggleTheme={() => setTheme(isDark ? 'sketch' : 'studio')}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSelectCategory={handleSelectCategoryFromRail}
        onGoHome={() => {
          setAppRoute('catalog');
          window.location.hash = '#catalog';
        }}
      />

      {/* 2. Docked Curriculum Lesson Sidebar with smooth slide transition */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden flex shrink-0 ${
          sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        }`}
      >
        <LessonSidebar
          theme={theme}
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          language={language}
        />
      </div>

      {/* 3. Main Center Workspace + TopBar + Right Panels */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Breadcrumb & Segmented Pill Switcher */}
        <TopBar
          theme={theme}
          onToggleTheme={() => setTheme(isDark ? 'sketch' : 'studio')}
          viewMode={viewMode}
          onToggleViewMode={() =>
            setViewMode((prev) =>
              prev === 'desktop-3pane' ? 'mobile-story' : 'desktop-3pane'
            )
          }
          selectedPreset={selectedPreset}
          studioTab={studioTab}
          onSelectStudioTab={setStudioTab}
          onReset={handleReset}
          language={language}
          onSelectLanguage={setLanguage}
        />
        {/* Content Body with smooth tab and stage transitions */}
        <div key={studioTab} className="flex-1 flex flex-col overflow-hidden animate-tab-enter">
          {studioTab === 'theory' ? (
            // Explain / Lesson Guide Tab
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <LessonGuide
              theme={theme}
              preset={selectedPreset}
              onLaunchVisualizer={() => setStudioTab('trace')}
              language={language}
            />
          </div>
        ) : viewMode === 'mobile-story' ? (
          // Mobile Story View
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
          // Desktop Studio: Center Spacious Stage + Right Stacked Cards
          <div className="flex-1 flex overflow-hidden">
            {/* Center Area: Stage + Bottom Dock Player */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              <div key={selectedPreset.id} className="flex-1 flex flex-col overflow-hidden animate-stage-swap">
                <VisualStage
                  theme={theme}
                  step={currentStep}
                  category={selectedPreset.category}
                  onChangeInput={(val) => {
                    setInputStr(val);
                    setCurrentStepIndex(0);
                  }}
                  language={language}
                />
              </div>

              {/* Bottom Floating Dock Player */}
              <DockPlayer
                theme={theme}
                currentStep={currentStepIndex + 1}
                totalSteps={totalSteps}
                isPlaying={isPlaying}
                speed={speed}
                onTogglePlay={handleTogglePlay}
                onNextStep={handleNext}
                onPrevStep={handlePrev}
                onReset={handleReset}
                onSeek={handleSeek}
                onChangeSpeed={setSpeed}
                language={language}
              />
            </div>

            {/* Right Stacked Panels: Code, Inputs, Step Log */}
            <RightPanels
              theme={theme}
              preset={selectedPreset}
              step={currentStep}
              activeLine={currentStep.line}
              inputStr={inputStr}
              onChangeInput={(val) => {
                setInputStr(val);
                setCurrentStepIndex(0);
              }}
              language={language}
            />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
