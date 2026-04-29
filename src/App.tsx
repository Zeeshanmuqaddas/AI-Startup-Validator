import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AgentLoadingState } from './components/AgentLoadingState';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { evaluateStartupIdea, type EvaluationResponse } from './lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, ArrowRight, Lightbulb } from 'lucide-react';

export default function App() {
  const [idea, setIdea] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!idea.trim()) return;
    
    setIsEvaluating(true);
    setError(null);
    setEvaluation(null);

    try {
      const response = await evaluateStartupIdea(idea);
      setEvaluation(response);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred during evaluation.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setEvaluation(null);
    setIdea("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col font-sans selection:bg-zinc-200">
      
      <header className="px-6 py-8 md:px-12 md:py-12 max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-lg">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-medium tracking-tight text-zinc-900">Validator & Investor Brain</h1>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Multi-Agent AI Pipeline</p>
          </div>
        </div>
        {evaluation && (
          <button 
            onClick={handleReset}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-2 bg-white border border-zinc-200 rounded-full shadow-sm hover:shadow transition-all"
          >
            Analyze New Idea
          </button>
        )}
      </header>

      <main className="flex-1 px-4 md:px-12 max-w-7xl w-full mx-auto flex flex-col pt-4 pb-20">
        <AnimatePresence mode="wait">
          
          {!isEvaluating && !evaluation && (
            <motion.div 
              key="input-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto my-12"
            >
              <div className="text-center mb-10 space-y-4">
                <h2 className="font-serif text-5xl md:text-6xl text-zinc-900 leading-tight tracking-tight">
                  Pitch your<br/><span className="text-zinc-400 italic">startup idea.</span>
                </h2>
                <p className="text-zinc-500 md:text-lg max-w-xl mx-auto leading-relaxed">
                  Our multi-agent system acts as VC investors, market analysts, and legal experts to tear down, evaluate, and score your concept.
                </p>
              </div>

              <div className="w-full relative shadow-2xl shadow-zinc-200/50 rounded-3xl overflow-hidden bg-white border border-zinc-200 focus-within:border-zinc-400 focus-within:ring-4 focus-within:ring-zinc-100 transition-all">
                <div className="absolute top-5 left-5 text-zinc-400">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <textarea 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="E.g., An AI-powered SaaS that automates compliance checks for real estate brokers in the US and EU using satellite imagery..."
                  className="w-full h-48 md:h-64 p-6 pl-14 resize-none bg-transparent outline-none text-zinc-800 placeholder:text-zinc-400 text-lg md:text-xl leading-relaxed font-serif"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                  <span className="hidden md:inline-block text-xs font-semibold uppercase tracking-widest text-zinc-400">Press ⌘ + Enter</span>
                  <button 
                    onClick={handleAnalyze}
                    disabled={!idea.trim()}
                    className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-sm"
                  >
                    <span>Analyze Idea</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl w-full text-center text-sm">
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {isEvaluating && (
            <motion.div 
              key="loading-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center my-24"
            >
              <AgentLoadingState />
            </motion.div>
          )}

          {evaluation && !isEvaluating && (
            <motion.div 
              key="results-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <EvaluationDashboard evaluation={evaluation} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
