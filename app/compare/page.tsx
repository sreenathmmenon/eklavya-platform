'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Send, Copy, Check, TrendingUp,
  Clock, DollarSign, Sparkles, Code2, MessageSquare,
  Activity, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Model {
  id: string;
  name: string;
  provider: string;
  providerKey: 'anthropic' | 'openai' | 'google' | 'groq' | 'mistral' | 'deepseek';
  color: string;
  gradient: string;
  icon: string;
  pricing: string;
  contextWindow: string;
}

interface StreamingResponse {
  modelId: string;
  text: string;
  isComplete: boolean;
  startTime: number;
  endTime?: number;
  latency?: number;
  tokens: number;
  cost: number;
  status: 'pending' | 'streaming' | 'complete' | 'error';
  error?: string;
}

export default function ComparePage() {
  const [prompt, setPrompt] = useState('Explain quantum computing in simple terms and give a code example');
  const [responses, setResponses] = useState<Map<string, StreamingResponse>>(new Map());
  const [isComparing, setIsComparing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [, setForceUpdate] = useState(0);
  const models: Model[] = [
    {
      id: 'claude-sonnet-4-5',
      name: 'Claude Sonnet 4.5',
      provider: 'Anthropic',
      providerKey: 'anthropic',
      color: '#8B5CF6',
      gradient: 'from-purple-500 to-pink-500',
      icon: '🧠',
      pricing: '$3.00',
      contextWindow: '200K'
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      providerKey: 'anthropic',
      color: '#A78BFA',
      gradient: 'from-purple-400 to-pink-400',
      icon: '💜',
      pricing: '$3.00',
      contextWindow: '200K'
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      providerKey: 'openai',
      color: '#10B981',
      gradient: 'from-green-500 to-emerald-500',
      icon: '⚡',
      pricing: '$2.50',
      contextWindow: '128K'
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      providerKey: 'openai',
      color: '#34D399',
      gradient: 'from-emerald-400 to-green-400',
      icon: '🚀',
      pricing: '$10.00',
      contextWindow: '128K'
    },
    {
      id: 'gemini-2-0-flash',
      name: 'Gemini 2.0 Flash',
      provider: 'Google',
      providerKey: 'google',
      color: '#3B82F6',
      gradient: 'from-blue-500 to-cyan-500',
      icon: '✨',
      pricing: '$0.30',
      contextWindow: '1M'
    },
    {
      id: 'gemini-2-5-flash',
      name: 'Gemini 2.5 Flash',
      provider: 'Google',
      providerKey: 'google',
      color: '#60A5FA',
      gradient: 'from-blue-400 to-cyan-400',
      icon: '💎',
      pricing: '$0.40',
      contextWindow: '1M'
    },
    {
      id: 'llama-3-1-70b',
      name: 'Llama 3.1 70B',
      provider: 'Meta (via Groq)',
      providerKey: 'groq',
      color: '#F59E0B',
      gradient: 'from-orange-500 to-red-500',
      icon: '🦙',
      pricing: '$0.80',
      contextWindow: '128K'
    },
    {
      id: 'llama-3-1-8b',
      name: 'Llama 3.1 8B',
      provider: 'Meta (via Groq)',
      providerKey: 'groq',
      color: '#FB923C',
      gradient: 'from-orange-400 to-red-400',
      icon: '🔥',
      pricing: '$0.20',
      contextWindow: '128K'
    },
    {
      id: 'mistral-large',
      name: 'Mistral Large',
      provider: 'Mistral',
      providerKey: 'mistral',
      color: '#EC4899',
      gradient: 'from-pink-500 to-rose-500',
      icon: '⚔️',
      pricing: '$2.00',
      contextWindow: '128K'
    },
    {
      id: 'deepseek-v3',
      name: 'DeepSeek V3',
      provider: 'DeepSeek',
      providerKey: 'deepseek',
      color: '#06B6D4',
      gradient: 'from-cyan-500 to-teal-500',
      icon: '🌊',
      pricing: '$0.14',
      contextWindow: '64K'
    },
    {
      id: 'sonar-pro',
      name: 'Sonar Pro',
      provider: 'Perplexity',
      providerKey: 'perplexity',
      color: '#8B5CF6',
      gradient: 'from-violet-500 to-purple-500',
      icon: '🔍',
      pricing: '$1.00',
      contextWindow: '128K'
    },
    {
      id: 'grok-2-1212',
      name: 'Grok 2',
      provider: 'X.AI',
      providerKey: 'grok',
      color: '#000000',
      gradient: 'from-gray-800 to-black',
      icon: '𝕏',
      pricing: '$5.00',
      contextWindow: '128K'
    },
    {
      id: 'sarvam-m',
      name: 'Sarvam M',
      provider: 'Sarvam AI',
      providerKey: 'sarvam',
      color: '#FF6B35',
      gradient: 'from-orange-600 to-red-600',
      icon: '🇮🇳',
      pricing: '$0.50',
      contextWindow: '32K'
    },
    {
      id: 'ollama-llama3.2',
      name: 'Llama 3.2 (Local)',
      provider: 'Ollama',
      providerKey: 'ollama',
      color: '#4ADE80',
      gradient: 'from-green-400 to-emerald-400',
      icon: '🏠',
      pricing: 'FREE',
      contextWindow: '128K'
    },
    {
      id: 'ollama-granite',
      name: 'Granite Code 8B (Local)',
      provider: 'Ollama',
      providerKey: 'ollama',
      color: '#86EFAC',
      gradient: 'from-emerald-300 to-green-300',
      icon: '💻',
      pricing: 'FREE',
      contextWindow: '8K'
    }
  ];

  // Initialize with some models selected
  useEffect(() => {
    setSelectedModels(new Set(['claude-sonnet-4-5', 'gpt-4o', 'gemini-2-0-flash', 'llama-3-1-70b']));
  }, []);

  // Force chart updates during streaming
  useEffect(() => {
    if (isComparing) {
      const interval = setInterval(() => {
        setForceUpdate(prev => prev + 1);
      }, 500); // Update charts every 500ms while comparing

      return () => clearInterval(interval);
    }
  }, [isComparing]);

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };

  const fetchModelResponse = async (modelId: string, index: number) => {
    const startTime = Date.now();
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    // Initialize response
    setResponses(prev => {
      const newMap = new Map(prev);
      newMap.set(modelId, {
        modelId,
        text: '',
        isComplete: false,
        startTime,
        tokens: 0,
        cost: 0,
        status: 'streaming'
      });
      return newMap;
    });

    // Stagger starts
    const baseDelay = 50 + (index * 100);
    await new Promise(resolve => setTimeout(resolve, baseDelay));

    try {
      // Call API to get response
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId,
          prompt
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || data.error);
      }

      const fullText = data.text;
      const words = fullText.split(' ');
      const chunkSize = Math.floor(Math.random() * 3) + 2; // 2-4 words per chunk

      // Stream words in chunks
      for (let i = 0; i < words.length; i += chunkSize) {
        const currentText = words.slice(0, i + chunkSize).join(' ');

        setResponses(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(modelId)!;
          newMap.set(modelId, {
            ...existing,
            text: currentText,
            tokens: currentText.split(' ').length,
          });
          return newMap;
        });

        // Variable delay between chunks (simulate network)
        await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 70));
      }

      // Mark complete
      const endTime = Date.now();
      const latency = data.latency || (endTime - startTime);
      const tokens = data.tokens || fullText.split(' ').length;
      const pricingStr = model.pricing.replace('$', '');
      const cost = (tokens / 1000000) * parseFloat(pricingStr);

      setResponses(prev => {
        const newMap = new Map(prev);
        newMap.set(modelId, {
          modelId,
          text: fullText,
          isComplete: true,
          startTime,
          endTime,
          latency,
          tokens,
          cost,
          status: 'complete'
        });
        return newMap;
      });

      // Force re-render for charts
      setForceUpdate(prev => prev + 1);

    } catch (error: unknown) {
      console.error(`Error fetching response for ${modelId}:`, error);

      const err = error as Error;
      let errorMessage = err.message;
      if (errorMessage.includes('API_KEY_REQUIRED')) {
        errorMessage = `Please add your ${model.provider} API key in settings (⚙️) to use this model`;
      }

      setResponses(prev => {
        const newMap = new Map(prev);
        newMap.set(modelId, {
          modelId,
          text: '',
          isComplete: true,
          startTime,
          endTime: Date.now(),
          latency: Date.now() - startTime,
          tokens: 0,
          cost: 0,
          status: 'error',
          error: errorMessage
        });
        return newMap;
      });
    }
  };

  const handleCompare = async () => {
    if (selectedModels.size === 0) return;

    setIsComparing(true);
    setResponses(new Map());

    // Start all selected models fetching in parallel
    const selectedModelsList = Array.from(selectedModels);
    const promises = selectedModelsList.map((modelId, index) => {
      return fetchModelResponse(modelId, index);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error in comparison:', error);
    } finally {
      setIsComparing(false);
    }
  };

  const handleCopy = (text: string, modelId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(modelId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getModelById = (id: string) => models.find(m => m.id === id);

  // Prepare chart data - ONLY show completed responses (bars appear as models finish)
  const chartData = Array.from(responses.values())
    .filter(r => r.status === 'complete' && r.latency && r.latency > 0)
    .map(r => {
      const latency = r.latency || 0;
      const tokens = r.tokens || 0;
      const cost = (r.cost || 0) * 1000;
      return {
        name: getModelById(r.modelId)?.name.split(' ').slice(0, 2).join(' ') || r.modelId,
        latency,
        tokens,
        cost,
        color: getModelById(r.modelId)?.color || '#8B5CF6',
        isComplete: true
      };
    })
    .sort((a, b) => a.latency - b.latency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-8 h-8 text-purple-400" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">Model Comparison Arena</h1>
                <p className="text-sm text-gray-400">Real API calls to all providers • Compare 16 models side-by-side</p>
              </div>
            </a>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">{selectedModels.size} models selected</p>
                <p className="text-xs text-gray-500">{responses.size} responding</p>
              </div>
              <a
                href="/"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-all border border-white/20"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12">
        {/* Model Selection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Select Models to Compare
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {models.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleModel(model.id)}
                className={`
                  cursor-pointer bg-gradient-to-br rounded-xl p-4 border-2 transition-all
                  ${selectedModels.has(model.id)
                    ? `${model.gradient} border-white/40 shadow-lg`
                    : 'from-white/5 to-white/0 border-white/10 opacity-50'
                  }
                `}
              >
                <div className="text-2xl mb-2">{model.icon}</div>
                <h3 className="text-sm font-bold mb-1">{model.name}</h3>
                <p className="text-xs text-gray-300">{model.provider}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <DollarSign className="w-3 h-3" />
                  <span>{model.pricing}/1M</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Prompt Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">Enter Your Prompt</h3>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What do you want to ask all models? Try: 'Write a Python function to calculate fibonacci series'"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:border-purple-500/50 transition-all mb-4 resize-none"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompare}
              disabled={isComparing || !prompt.trim() || selectedModels.size === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isComparing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Activity className="w-5 h-5" />
                  </motion.div>
                  Streaming Responses...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Compare {selectedModels.size} Models
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Real-time Charts */}
        <AnimatePresence>
          {responses.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 grid md:grid-cols-3 gap-4"
            >
              {/* Latency Chart */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold">Response Time (ms)</h3>
                </div>
                <ResponsiveContainer width="100%" height={240} key={`latency-${chartData.length}`}>
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#F3F4F6', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis tick={{ fill: '#F3F4F6', fontSize: 11, fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
                      itemStyle={{ color: '#F3F4F6' }}
                      formatter={(value: number) => `${value}ms`}
                      cursor={false}
                    />
                    <Bar dataKey="latency" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#F3F4F6', fontSize: 10 }} maxBarSize={80}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Token Count Chart */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold">Tokens Generated</h3>
                </div>
                <ResponsiveContainer width="100%" height={240} key={`tokens-${chartData.length}`}>
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#F3F4F6', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis tick={{ fill: '#F3F4F6', fontSize: 11, fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
                      itemStyle={{ color: '#F3F4F6' }}
                      formatter={(value: number) => `${value} tokens`}
                      cursor={false}
                    />
                    <Bar dataKey="tokens" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#F3F4F6', fontSize: 10 }} maxBarSize={80}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Cost Chart */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="font-bold">Cost ($0.001)</h3>
                </div>
                <ResponsiveContainer width="100%" height={240} key={`cost-${chartData.length}`}>
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#F3F4F6', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis tick={{ fill: '#F3F4F6', fontSize: 11, fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
                      itemStyle={{ color: '#F3F4F6' }}
                      formatter={(value: number) => `$${(value / 1000).toFixed(6)}`}
                      cursor={false}
                    />
                    <Bar
                      dataKey="cost"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={80}
                      label={{
                        position: 'top',
                        fill: '#F3F4F6',
                        fontSize: 10,
                        formatter: (value: number) => `$${(value / 1000).toFixed(4)}`
                      }}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streaming Response Grid */}
        <AnimatePresence mode="popLayout">
          {responses.size > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {Array.from(responses.values()).map((response, i) => {
                const model = getModelById(response.modelId);
                if (!model) return null;

                return (
                  <motion.div
                    key={response.modelId}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white/20"
                  >
                    {/* Model Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{model.icon}</span>
                        <div>
                          <h4 className="font-bold">{model.name}</h4>
                          <p className="text-xs text-gray-400">{model.provider}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Streaming indicator */}
                        {response.status === 'streaming' && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 bg-green-400 rounded-full"
                          />
                        )}

                        {response.status === 'complete' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCopy(response.text, response.modelId)}
                            className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-all"
                          >
                            {copiedId === response.modelId ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Response Text - with Markdown Rendering */}
                    <div className="bg-black/20 rounded-xl p-4 mb-4 min-h-[300px] max-h-[400px] overflow-y-auto">
                      {response.status === 'error' ? (
                        <div className="flex items-start gap-3 text-yellow-400">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-1" />
                          <div className="text-sm">
                            <p className="font-bold mb-1">API Key Required</p>
                            <p className="text-gray-300">{response.error}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="prose-invert prose-sm max-w-none">
                          {response.status === 'streaming' ? (
                            <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                              {response.text}
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-2 h-4 bg-purple-400 ml-1"
                              />
                            </p>
                          ) : (
                            <MarkdownRenderer content={response.text} />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Metrics */}
                    {response.status !== 'error' && (
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span className="text-gray-400">Latency</span>
                          </div>
                          <p className="font-bold">
                            {response.isComplete
                              ? `${response.latency}ms`
                              : `${Date.now() - response.startTime}ms...`
                            }
                          </p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <Code2 className="w-3 h-3 text-purple-400" />
                            <span className="text-gray-400">Tokens</span>
                          </div>
                          <p className="font-bold">{response.tokens}</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <DollarSign className="w-3 h-3 text-green-400" />
                            <span className="text-gray-400">Cost</span>
                          </div>
                          <p className="font-bold">${response.cost.toFixed(6)}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold mb-2 text-cyan-300">🎓 Learning Objectives</h3>
              <p className="text-sm text-gray-300 mb-3">
                This comparison tool helps you learn about LLM providers, models, and prompt engineering through REAL API responses:
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Compare Providers:</strong> See real differences in how Anthropic, OpenAI, Google, Meta respond</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Model Trade-offs:</strong> Understand speed vs detail, cost vs quality trade-offs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Prompt Engineering:</strong> Same prompt → different responses. Learn which model fits your use case</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span><strong>Cost Analysis:</strong> Real pricing comparison: DeepSeek ($0.14) vs GPT-4 ($10.00) per 1M tokens</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8"
        >
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-purple-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Enterprise-Grade Model Comparison</h3>
              <p className="text-gray-300 mb-4">
                Compare responses from 16 different AI models across 10 providers including Anthropic, OpenAI, Google, Meta,
                Mistral, DeepSeek, Perplexity, Grok, Sarvam, and Ollama. All responses are REAL API calls - learn from
                actual model differences, not simulations.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm border border-purple-500/30">
                  🎯 16 AI Models
                </span>
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm border border-purple-500/30">
                  🌐 10 Providers Supported
                </span>
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm border border-purple-500/30">
                  ⚡ Real-time Response Streaming
                </span>
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm border border-purple-500/30">
                  💰 Cost & Token Analysis
                </span>
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm border border-purple-500/30">
                  📊 Performance Charts
                </span>
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm border border-purple-500/30">
                  🎓 Educational Platform
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
