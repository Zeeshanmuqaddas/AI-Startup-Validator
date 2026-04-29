import { motion } from 'motion/react';
import type { EvaluationResponse } from '../lib/gemini';
import { Globe2, ShieldAlert, BadgeDollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  evaluation: EvaluationResponse;
}

export function EvaluationDashboard({ evaluation }: Props) {
  const { investor_score, idea_summary, market_analysis, legal_analysis, monetization, suggested_pivot } = evaluation;

  const scoreColor = 
    investor_score.score >= 80 ? 'text-emerald-600' : 
    investor_score.score >= 50 ? 'text-yellow-600' : 
    'text-red-600';

  const scoreBg = 
    investor_score.score >= 80 ? 'bg-emerald-50' : 
    investor_score.score >= 50 ? 'bg-yellow-50' : 
    'bg-red-50';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl w-full mx-auto pb-24 space-y-8"
    >
      {/* Hero Section: Score & Recommendation */}
      <section className="col-span-full border border-zinc-200 rounded-3xl bg-white overflow-hidden shadow-sm flex flex-col md:flex-row">
        <div className={`md:w-1/3 flex flex-col items-center justify-center p-12 shrink-0 ${scoreBg}`}>
          <div className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-4">Investment Score</div>
          <div className={`font-serif text-8xl md:text-9xl tracking-tighter leading-none ${scoreColor}`}>
            {investor_score.score}
          </div>
          <div className="mt-6 inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-black/10 text-sm font-semibold text-zinc-900 shadow-sm">
            Risk: {investor_score.risk_level}
          </div>
        </div>
        <div className="p-10 md:w-2/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-200 bg-zinc-50/50">
          <h2 className="text-sm uppercase tracking-widest text-zinc-500 font-bold mb-2">Recommendation</h2>
          <div className="text-3xl md:text-4xl font-serif text-zinc-900 mb-6 font-medium leading-tight text-balance">
            {investor_score.recommendation}
          </div>
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Reasoning</h3>
            <ul className="space-y-2 text-sm text-zinc-700">
              {investor_score.reasoning.map((reason, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-zinc-300 mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Idea Summary */}
      <section className="bg-zinc-900 text-zinc-100 p-8 rounded-3xl">
        <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Executive Summary</h2>
        <p className="text-lg md:text-xl font-serif leading-relaxed text-zinc-300">
          {idea_summary}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Market Analysis */}
        <section className="border border-zinc-200 bg-white rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <h2 className="text-sm uppercase tracking-widest text-zinc-900 font-bold">Market Potential</h2>
          </div>
          
          <div className="space-y-6 flex-1">
            <div>
              <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-1">Demand Level</div>
              <div className="font-medium text-zinc-900">{market_analysis.demand_level}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-1">Market Size</div>
              <div className="text-sm text-zinc-700">{market_analysis.market_size_insight}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-2">Key Trends</div>
              <ul className="space-y-1">
                {market_analysis.key_trends.map((trend, i) => (
                  <li key={i} className="text-sm text-zinc-700 border-l-2 border-zinc-200 pl-3 py-0.5">{trend}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-2">Competitors</div>
              <div className="flex flex-wrap gap-2">
                {market_analysis.competitors.length > 0 ? market_analysis.competitors.map((comp, i) => (
                  <span key={i} className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-md">
                    {comp}
                  </span>
                )) : <span className="text-sm text-zinc-500">None identified</span>}
              </div>
            </div>
          </div>
        </section>

        {/* Monetization */}
        <section className="border border-zinc-200 bg-white rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
            <h2 className="text-sm uppercase tracking-widest text-zinc-900 font-bold">Monetization</h2>
          </div>
          
          <div className="space-y-6 flex-1">
            <div>
              <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-2">Revenue Models</div>
              <div className="flex flex-col gap-2">
                {monetization.revenue_models.map((model, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-zinc-700 bg-zinc-50 border border-zinc-100 px-3 py-2 rounded-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                    {model}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-1">Pricing Strategy</div>
              <div className="text-sm text-zinc-700 leading-relaxed">{monetization.pricing_strategy}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-1">Scalability</div>
              <div className="text-sm text-zinc-700 leading-relaxed bg-zinc-50/80 p-3 rounded-lg border border-zinc-100">
                {monetization.scalability}
              </div>
            </div>
          </div>
        </section>

        {/* Legal Risk */}
        <section className="border border-zinc-200 bg-white rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-sm uppercase tracking-widest text-zinc-900 font-bold">Legal & Compliance Risk</h2>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">US Risk</div>
                <div className="text-sm text-zinc-800">{legal_analysis.us_risk}</div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">EU Risk</div>
                <div className="text-sm text-zinc-800">{legal_analysis.eu_risk}</div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Pakistan Risk</div>
                <div className="text-sm text-zinc-800">{legal_analysis.pakistan_risk}</div>
              </div>
            </div>
            {legal_analysis.compliance_notes.length > 0 && (
              <div>
                <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-2">Compliance Notes</div>
                <ul className="space-y-2">
                  {legal_analysis.compliance_notes.map((note, i) => (
                    <li key={i} className="text-xs text-zinc-600 flex gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Suggested Pivot */}
      {suggested_pivot && (
        <section className="bg-zinc-100 border border-zinc-200 text-zinc-900 p-8 md:p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-zinc-900" />
          <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3">Strategic Suggestion / Pivot</h2>
          <p className="text-lg text-zinc-800 font-medium">
            {suggested_pivot}
          </p>
        </section>
      )}

    </motion.div>
  );
}
