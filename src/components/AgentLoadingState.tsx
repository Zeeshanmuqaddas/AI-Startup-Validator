import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Search, Scale, Coins, LineChart, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 'idea', icon: Bot, label: 'Idea Understanding Agent', desc: 'Extracting core concept & users' },
  { id: 'market', icon: Search, label: 'Market Research Agent', desc: 'Estimating demand & market size' },
  { id: 'legal', icon: Scale, label: 'Legal & Compliance Agent', desc: 'Evaluating regional risks' },
  { id: 'money', icon: Coins, label: 'Monetization Agent', desc: 'Structuring revenue models' },
  { id: 'score', icon: LineChart, label: 'Investor Scoring Agent', desc: 'Computing investment score' }
];

export function AgentLoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simulate progressing through the agents slowly so the user sees the process happening
    const timer = setInterval(() => {
      setCurrentStep(s => {
        if (s >= steps.length) {
          clearInterval(timer);
          return s;
        }
        return s + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-zinc-50 border border-zinc-200 rounded-2xl w-full max-w-xl mx-auto shadow-sm">
      <div className="mb-6">
        <h3 className="font-serif text-2xl text-zinc-900 tracking-tight">Simulating Multi-Agent Pipeline</h3>
        <p className="text-zinc-500 text-sm text-center mt-1">Analyzing your idea from every angle...</p>
      </div>

      <div className="w-full space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          const isPending = index > currentStep;
          const Icon = step.icon;

          return (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isPending ? 0.4 : 1, y: 0 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${isActive ? 'bg-zinc-100 border border-zinc-200' : ''}`}
            >
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${
                  isComplete ? 'bg-zinc-900 border-zinc-900 text-white' : 
                  isActive ? 'bg-white border-zinc-300 text-zinc-900 shadow-sm' : 
                  'bg-transparent border-dashed border-zinc-300 text-zinc-400'
                }`}
              >
                {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              
              <div className="flex-1">
                <div className={`text-sm font-semibold ${isActive ? 'text-zinc-900' : 'text-zinc-700'}`}>
                  {step.label}
                </div>
                <div className="text-xs text-zinc-500">{step.desc}</div>
              </div>
              
              {isActive && (
                <div className="flex space-x-1">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
