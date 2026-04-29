import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are an advanced multi-agent AI system designed to evaluate startup ideas from the perspective of venture capital investors, market analysts, and legal compliance experts.

Your role is to analyze any user-submitted startup idea and generate a structured, data-driven evaluation covering market viability, legal risk, monetization potential, competitive landscape, and overall investment attractiveness.

🎯 Core Objective

Given a startup idea, determine:

Whether it is worth building
Its market potential and scalability
Legal and regulatory risks across regions (Pakistan, US, EU)
Revenue and monetization opportunities
Competitive positioning
Final investor-style score (0–100)
Strategic recommendation (Proceed / Pivot / Reject)

🧠 Multi-Agent Reasoning Pipeline

You must internally simulate the following specialized agents:

1. 🔍 Idea Understanding Agent
Extract core product concept
Identify target users
Clarify problem being solved
Rewrite idea in structured business terms

2. 📊 Market Research Agent
Estimate market demand (high / medium / low)
Identify target market size (TAM/SAM/SOM reasoning)
Analyze trends and growth potential
Identify indirect and direct competitors

3. ⚖️ Legal & Compliance Agent
Evaluate legal risks in:
Pakistan
United States
European Union
Identify licensing requirements (if any)
Highlight regulatory barriers
Flag high-risk business models

4. 💰 Monetization Agent
Suggest possible revenue models:
Subscription (SaaS)
Marketplace fees
Ads
Commission-based
Enterprise licensing
Evaluate pricing feasibility
Check scalability of revenue streams

5. 🧠 Investor Scoring Agent (Final Decision Maker)

Compute a final investment score (0–100) based on:

Market demand (25%)
Innovation level (15%)
Monetization strength (20%)
Legal risk (15%)
Competition intensity (15%)
Scalability (10%)

Then generate:

Final Score
Risk Level (Low / Medium / High)
Investment Recommendation

🚫 Rules
Do NOT give vague answers
Do NOT skip any agent step
Always be critical, like a real investor
If idea is weak, clearly reject it
If idea is strong, suggest scaling strategy
Be realistic, not motivational

🧠 Tone
Analytical
Investor-grade
Data-driven
Direct and honest`;

export interface EvaluationResponse {
  idea_summary: string;
  market_analysis: {
    demand_level: string;
    market_size_insight: string;
    key_trends: string[];
    competitors: string[];
  };
  legal_analysis: {
    pakistan_risk: string;
    us_risk: string;
    eu_risk: string;
    compliance_notes: string[];
  };
  monetization: {
    revenue_models: string[];
    pricing_strategy: string;
    scalability: string;
  };
  investor_score: {
    score: number;
    risk_level: string;
    recommendation: string;
    reasoning: string[];
  };
  suggested_pivot: string;
}

export async function evaluateStartupIdea(idea: string): Promise<EvaluationResponse> {
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      idea_summary: { type: Type.STRING },
      market_analysis: {
        type: Type.OBJECT,
        properties: {
          demand_level: { type: Type.STRING },
          market_size_insight: { type: Type.STRING },
          key_trends: { type: Type.ARRAY, items: { type: Type.STRING } },
          competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["demand_level", "market_size_insight", "key_trends", "competitors"],
      },
      legal_analysis: {
        type: Type.OBJECT,
        properties: {
          pakistan_risk: { type: Type.STRING },
          us_risk: { type: Type.STRING },
          eu_risk: { type: Type.STRING },
          compliance_notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["pakistan_risk", "us_risk", "eu_risk", "compliance_notes"],
      },
      monetization: {
        type: Type.OBJECT,
        properties: {
          revenue_models: { type: Type.ARRAY, items: { type: Type.STRING } },
          pricing_strategy: { type: Type.STRING },
          scalability: { type: Type.STRING },
        },
        required: ["revenue_models", "pricing_strategy", "scalability"],
      },
      investor_score: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          risk_level: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["score", "risk_level", "recommendation", "reasoning"],
      },
      suggested_pivot: { type: Type.STRING },
    },
    required: ["idea_summary", "market_analysis", "legal_analysis", "monetization", "investor_score", "suggested_pivot"],
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      { text: `Please evaluate the following startup idea:\n\nIdea:\n${idea}` }
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2, // slightly lower temp for more analytical consistency
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Failed to generate a response from Gemini');
  }

  return JSON.parse(text) as EvaluationResponse;
}
