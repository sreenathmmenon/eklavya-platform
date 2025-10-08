'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Code2, Brain, Zap, Trophy, Flame,
  Star, ChevronRight, Play, CheckCircle2, Lock,
  Award, Target, TrendingUp, Sparkles, Lightbulb, User,
  ChevronLeft, Menu, Copy, Database
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { LESSON_CONTENT } from './lesson-content';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Lesson {
  id: string;
  week: number;
  title: string;
  description: string;
  xp: number;
  duration: string;
  completed: boolean;
  locked: boolean;
  topics: string[];
}

interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lessonsCompleted: number;
  totalLessons: number;
}

export default function LearnPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [code, setCode] = useState('# Write your code here\n');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Prompt testing states
  const [isTesting, setIsTesting] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [userPromptText, setUserPromptText] = useState('');
  const [userContext, setUserContext] = useState(''); // For RAG custom context
  const [studentResponse, setStudentResponse] = useState('');
  const [idealPrompt, setIdealPrompt] = useState('');
  const [idealResponse, setIdealResponse] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [apiUsage, setApiUsage] = useState<any>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const userProgress: UserProgress = {
    level: 3,
    xp: 2450,
    xpToNextLevel: 3000,
    streak: 7,
    lessonsCompleted: 12,
    totalLessons: 48
  };

  const curriculum: Lesson[] = [
    // Week 1: Foundation
    {
      id: '1-1',
      week: 1,
      title: 'Prompt Engineering Fundamentals',
      description: 'Master the art of crafting effective prompts for Claude',
      xp: 100,
      duration: '45 min',
      completed: true,
      locked: false,
      topics: ['Zero-shot prompts', 'Few-shot learning', 'Chain of thought']
    },
    {
      id: '1-2',
      week: 1,
      title: 'RAG Architecture Basics',
      description: 'Build your first Retrieval Augmented Generation system',
      xp: 150,
      duration: '60 min',
      completed: true,
      locked: false,
      topics: ['Vector embeddings', 'Semantic search', 'Context injection']
    },
    {
      id: '1-3',
      week: 1,
      title: 'Building with Claude API',
      description: 'Integrate Claude into your applications',
      xp: 120,
      duration: '50 min',
      completed: false,
      locked: false,
      topics: ['API setup', 'Streaming responses', 'Error handling']
    },
    {
      id: '1-4',
      week: 1,
      title: 'Model Context Protocol (MCP)',
      description: 'Connect Claude to external tools and data sources',
      xp: 150,
      duration: '60 min',
      completed: false,
      locked: false,
      topics: ['MCP servers', 'Tool integration', 'Custom resources']
    },
    // Week 2: Intermediate
    {
      id: '2-1',
      week: 2,
      title: 'Advanced Prompt Patterns',
      description: 'XML tags, multi-step reasoning, and persona design',
      xp: 180,
      duration: '70 min',
      completed: false,
      locked: false,
      topics: ['XML structure', 'Role prompting', 'Output formatting']
    },
    {
      id: '2-2',
      week: 2,
      title: 'Production RAG Systems',
      description: 'Scale RAG with chunking strategies and re-ranking',
      xp: 200,
      duration: '80 min',
      completed: false,
      locked: false,
      topics: ['Chunking strategies', 'Hybrid search', 'Re-ranking']
    },
    {
      id: '2-3',
      week: 2,
      title: 'Agent Design Patterns',
      description: 'Build AI agents that can take actions',
      xp: 220,
      duration: '90 min',
      completed: false,
      locked: true,
      topics: ['Tool use', 'ReAct pattern', 'Agent loops']
    },
    // Week 3: Advanced
    {
      id: '3-1',
      week: 3,
      title: 'Multi-Agent Systems',
      description: 'Orchestrate multiple AI agents working together',
      xp: 250,
      duration: '100 min',
      completed: false,
      locked: true,
      topics: ['Agent coordination', 'Task delegation', 'Result synthesis']
    },
    {
      id: '3-2',
      week: 3,
      title: 'Code Generation at Scale',
      description: 'Generate production-ready code with AI',
      xp: 280,
      duration: '110 min',
      completed: false,
      locked: true,
      topics: ['Code context', 'Testing generation', 'Refactoring']
    },
  ];

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowHint(false);
    setHint('');

    // Load starter code if available
    const lessonContent = LESSON_CONTENT[lesson.id];
    if (lessonContent) {
      setCode(lessonContent.starterCode);
    } else {
      setCode('# Write your code here\n');
    }
  };

  const handleTestPrompt = async () => {
    if (!selectedLesson || !userPromptText.trim()) {
      alert('Please enter a prompt to test!');
      return;
    }

    setIsTesting(true);
    setShowComparison(true);

    try {
      if (selectedLesson.id === '1-1') {
        // Prompt Engineering: Compare user prompt vs ideal prompt
        const idealPromptText = generateIdealPrompt(userPromptText);
        setIdealPrompt(idealPromptText);

        const [studentResult, idealResult] = await Promise.all([
          fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mentorId: 'claude-direct',
              message: userPromptText,
              conversationHistory: []
            })
          }).then(r => r.json()),

          fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mentorId: 'claude-direct',
              message: idealPromptText,
              conversationHistory: []
            })
          }).then(r => r.json())
        ]);

        setStudentResponse(studentResult.response || 'Error getting response');
        setIdealResponse(idealResult.response || 'Error getting response');

      } else if (selectedLesson.id === '1-2') {
        // RAG: Compare without context vs with context

        // Use user's custom context OR fallback to default knowledge base
        const defaultKnowledgeBase = [
          "Python is a high-level programming language created by Guido van Rossum in 1991. It's used for web development, data science, machine learning, automation, and scripting.",
          "JavaScript is a programming language primarily used for web development. It runs in browsers and enables interactive web pages. It was created in 1995.",
          "Python uses dynamic typing and has simple, readable syntax. It's popular for data science with libraries like NumPy, Pandas, and TensorFlow.",
          "JavaScript is single-threaded and event-driven. It's used for both frontend (React, Vue) and backend (Node.js) development."
        ];

        const contextToUse = userContext.trim()
          ? userContext
          : defaultKnowledgeBase.join('\n\n');

        // Without RAG: just the question
        const noRagPrompt = userPromptText;

        // With RAG: add context
        const ragPrompt = `Context from knowledge base:
${contextToUse}

Question: ${userPromptText}

Answer based on the context provided above.`;

        setIdealPrompt(ragPrompt);

        const [noRagResult, ragResult] = await Promise.all([
          fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mentorId: 'claude-direct',
              message: noRagPrompt,
              conversationHistory: []
            })
          }).then(r => r.json()),

          fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mentorId: 'claude-direct',
              message: ragPrompt,
              conversationHistory: []
            })
          }).then(r => r.json())
        ]);

        setStudentResponse(noRagResult.response || 'Error getting response');
        setIdealResponse(ragResult.response || 'Error getting response');

      } else if (selectedLesson.id === '1-3') {
        // Claude API: Just show response with stats
        const result = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mentorId: 'claude-direct',
            message: userPromptText,
            conversationHistory: []
          })
        }).then(r => r.json());

        const stats = result.usage || {};
        setApiUsage(stats); // Store usage for display at bottom

        const apiStatsText = `**API Call Statistics:**
- Input Tokens: ${stats.input_tokens || 'N/A'}
- Output Tokens: ${stats.output_tokens || 'N/A'}
- Total Tokens: ${(stats.input_tokens || 0) + (stats.output_tokens || 0)}
- Estimated Cost: $${((stats.input_tokens || 0) * 0.000003 + (stats.output_tokens || 0) * 0.000015).toFixed(6)}
- Model: claude-sonnet-4-5-20250929`;

        setStudentResponse(result.response || 'Error getting response');
        setIdealPrompt(apiStatsText);
        setIdealResponse('This lesson demonstrates live Claude API integration with real token usage and cost tracking!');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Error testing prompt:', error);
      alert('Error testing prompt. Please try again!');
    } finally {
      setIsTesting(false);
    }
  };

  const generateIdealPrompt = (userPrompt: string): string => {
    // Extract the core task from user's prompt
    const task = userPrompt.trim();

    // Generate structured prompt
    return `You are an expert educator with deep knowledge across all domains.

Task: ${task}

Please provide your response following this structure:
1. **Clear Definition**: Explain the core concept in 1-2 sentences
2. **Key Points**: List 2-3 essential principles or components
3. **Practical Example**: Provide a concrete example (code if relevant, real-world scenario otherwise)
4. **Common Pitfalls**: Mention 1-2 common mistakes or misconceptions

Keep your response:
- Concise (under 400 words)
- Well-organized with clear sections
- Educational and easy to understand
- Include code blocks if the task involves programming

Format your response in markdown for readability.`;
  };

  const handleGetHint = async () => {
    if (!selectedLesson) return;

    setIsLoadingHint(true);
    setShowHint(true);

    const lessonContent = LESSON_CONTENT[selectedLesson.id];
    if (!lessonContent) {
      setHint('No hints available for this lesson yet.');
      setIsLoadingHint(false);
      return;
    }

    try {
      // Call Claude API for personalized hint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: 'karpathy', // Use Karpathy for teaching hints
          message: `${lessonContent.aiHintPrompt}\n\nCurrent code:\n\`\`\`python\n${code}\n\`\`\`\n\nGive a helpful hint (not the full solution).`,
          conversationHistory: []
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setHint(data.response);
    } catch (error) {
      console.error('Error getting hint:', error);
      setHint('💡 Try breaking down the problem into smaller steps. Look at the instructions again and tackle one requirement at a time!');
    } finally {
      setIsLoadingHint(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-2xl font-bold">Learning Dashboard</h1>
          </div>

          {/* Progress Stats */}
          <div className="flex items-center gap-6">
            {/* Streak */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-full border border-orange-500/30"
            >
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-bold">{userProgress.streak} day streak</span>
            </motion.div>

            {/* XP */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-4 py-2 rounded-full border border-purple-500/30"
            >
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">{userProgress.xp} XP</span>
            </motion.div>

            {/* Level */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 rounded-full border border-cyan-500/30"
            >
              <Trophy className="w-5 h-5 text-cyan-400" />
              <span className="font-bold">Level {userProgress.level}</span>
            </motion.div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative h-2 bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(userProgress.xp / userProgress.xpToNextLevel) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"
          />
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12">
        <div className={`grid gap-8 transition-all duration-300 ${
          sidebarCollapsed
            ? 'grid-cols-1'
            : selectedLesson
              ? 'lg:grid-cols-[280px_1fr]'
              : 'grid-cols-1'
        }`}>
          {/* Left Column: Curriculum (Dynamic Size) */}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-purple-200">Progress</span>
                </div>
                <p className="text-3xl font-bold">{Math.round((userProgress.lessonsCompleted / userProgress.totalLessons) * 100)}%</p>
                <p className="text-xs text-gray-400 mt-1">{userProgress.lessonsCompleted}/{userProgress.totalLessons} lessons</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-orange-200">Streak</span>
                </div>
                <p className="text-3xl font-bold">{userProgress.streak}</p>
                <p className="text-xs text-gray-400 mt-1">days in a row</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                  <span className="text-sm text-cyan-200">Level</span>
                </div>
                <p className="text-3xl font-bold">{userProgress.level}</p>
                <p className="text-xs text-gray-400 mt-1">AI Apprentice</p>
              </div>
            </motion.div>

            {/* Curriculum List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold">12-Week Curriculum</h2>
              </div>

              <div className={`${selectedLesson ? 'space-y-3' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
              <AnimatePresence mode="popLayout">
                {curriculum.map((lesson, i) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: lesson.locked ? 1 : 1.02, x: lesson.locked ? 0 : 5 }}
                    onClick={() => !lesson.locked && handleLessonSelect(lesson)}
                    className={`
                      relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl
                      rounded-2xl border-2 transition-all cursor-pointer
                      ${selectedLesson ? 'p-4' : 'p-6'}
                      ${lesson.locked
                        ? 'border-white/5 opacity-50 cursor-not-allowed'
                        : lesson.completed
                          ? 'border-green-500/30 hover:border-green-500/50'
                          : selectedLesson?.id === lesson.id
                            ? 'border-purple-500/50 bg-purple-500/10'
                            : 'border-white/10 hover:border-white/20'
                      }
                    `}
                  >
                    {/* Week Badge */}
                    <div className="absolute -top-3 -left-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center font-bold border-4 border-slate-950">
                        W{lesson.week}
                      </div>
                    </div>

                    <div className="ml-6 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{lesson.title}</h3>
                          {lesson.completed && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                          {lesson.locked && <Lock className="w-5 h-5 text-gray-500" />}
                        </div>

                        <p className="text-sm text-gray-400 mb-3">{lesson.description}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            {lesson.xp} XP
                          </span>
                          <span>{lesson.duration}</span>
                        </div>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {lesson.topics.map((topic, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-200 border border-purple-500/30"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {!lesson.locked && !lesson.completed && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="ml-4 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                          <Play className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              </div>
            </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Column: Lesson Content / Code Editor */}
          <div className="relative">
            {/* Collapse/Expand Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -left-4 top-0 z-10 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </motion.button>

            <div className="sticky top-24 h-fit">
            <AnimatePresence mode="wait">
              {selectedLesson ? (
                <motion.div
                  key="lesson-content"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 space-y-6"
                >
                  {/* Lesson Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
                        <p className="text-sm text-gray-400">Week {selectedLesson.week} • {selectedLesson.duration}</p>
                      </div>
                    </div>
                    <p className="text-gray-300">{selectedLesson.description}</p>
                  </div>

                  {/* Interactive Exercise */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-lg font-bold">
                        {selectedLesson.id === '1-1' ? 'Try Your Own Prompt' : 'Interactive Exercise'}
                      </h3>
                      {!['1-1', '1-2', '1-3'].includes(selectedLesson.id) && (
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-xs font-semibold text-yellow-300">
                          🚧 Coming Soon
                        </span>
                      )}
                    </div>

                    {selectedLesson.id === '1-2' && (
                      <>
                        {/* RAG Explanation Section */}
                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4 space-y-3">
                          <p className="text-sm text-gray-300">
                            💡 <strong>What is RAG (Retrieval Augmented Generation)?</strong>
                          </p>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            RAG is a technique where you <strong>inject relevant context</strong> into the AI's prompt before asking a question.
                            Instead of relying on the AI's general knowledge, you provide specific information (documents, database records, company policies)
                            so the AI can give <strong>accurate, context-aware answers</strong>.
                          </p>

                          <div className="grid md:grid-cols-2 gap-3 mt-3">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                              <p className="text-red-300 font-semibold text-xs mb-2">❌ Without RAG:</p>
                              <ul className="text-xs text-gray-400 space-y-1">
                                <li>• AI uses only pre-trained knowledge</li>
                                <li>• Generic, may be outdated answers</li>
                                <li>• Can't access your specific data</li>
                                <li>• Risk of hallucinations</li>
                              </ul>
                            </div>

                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                              <p className="text-green-300 font-semibold text-xs mb-2">✅ With RAG:</p>
                              <ul className="text-xs text-gray-400 space-y-1">
                                <li>• AI gets relevant context first</li>
                                <li>• Specific, accurate answers</li>
                                <li>• Works with YOUR documents/data</li>
                                <li>• Grounded in provided facts</li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 mt-2">
                            <p className="text-cyan-300 font-semibold text-xs mb-2">🚀 Real-World Use Cases:</p>
                            <ul className="text-xs text-gray-400 space-y-1 ml-4">
                              <li>• <strong>Customer Support:</strong> Chatbot with company knowledge base</li>
                              <li>• <strong>Code Q&A:</strong> Ask questions about your codebase</li>
                              <li>• <strong>Legal/Medical:</strong> Query specific documents safely</li>
                              <li>• <strong>Research:</strong> Analyze papers, reports, databases</li>
                            </ul>
                          </div>

                          <div className="bg-black/20 rounded-lg p-3 mt-2">
                            <p className="text-xs text-cyan-300 font-semibold mb-1">What you'll learn in this demo:</p>
                            <ul className="text-xs text-gray-400 space-y-1 ml-4">
                              <li>• See the difference: Generic AI vs Context-Aware AI</li>
                              <li>• How to structure RAG prompts (context + question)</li>
                              <li>• When RAG is essential (custom data, accuracy-critical tasks)</li>
                            </ul>
                          </div>
                        </div>

                        {/* Custom Context Input for RAG */}
                        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-xl overflow-hidden">
                          <div className="bg-cyan-500/20 px-4 py-3 border-b border-cyan-500/30 flex items-center justify-between">
                            <h4 className="font-bold text-cyan-200 flex items-center gap-2">
                              <Database className="w-5 h-5" />
                              📚 Your Context (RAG Knowledge Base)
                            </h4>
                            <button
                              onClick={() => setUserContext('')}
                              className="text-xs text-cyan-400 hover:text-cyan-300 px-3 py-1 bg-black/20 rounded-lg"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="p-4 space-y-2">
                            <p className="text-xs text-gray-400 mb-2">
                              📝 <strong>Paste any text here</strong> (docs, article, code, notes). Claude will use THIS as context to answer your question.
                            </p>
                            <div className="space-y-2">
                              <textarea
                                value={userContext}
                                onChange={(e) => setUserContext(e.target.value)}
                                placeholder="Paste your context here:
• Copy text from a Wikipedia article
• Paste company documentation
• Add code from your project
• Include research paper excerpts

Click 'Load Example' below to see a real-world example!"
                                className="w-full h-48 bg-black/30 text-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono text-xs rounded-lg border border-cyan-500/20"
                              />
                              <button
                                onClick={() => setUserContext(`At Anthropic, we use Claude every day, so we're looking for candidates who excel at collaborating with AI.

Here's when and how to use Claude (or other AI tools) when applying to and interviewing with Anthropic. Where it makes sense, we invite you to use Claude to show us more of you: your unique perspective, skills, and experiences.

How to collaborate with Claude during each stage of our process:

When applying (resume, cover letter, application questions): Please create your first draft yourself, then use Claude to refine it. We want to see your real experience, but Claude can polish how you communicate about your work.
Example prompt: "Please review my resume and the job description. Identify the experiences I should highlight in my cover letter that align most with the job requirements."

During take-home assessments: Complete these without Claude unless we indicate otherwise. We'd like to assess your unique skills and strengths. We'll be clear when AI is allowed (example: "You may use Claude for this coding challenge").

Preparing for interviews: Use Claude to research Anthropic, practice your answers, and prepare questions for us.
Example prompt: "Create a study guide for interviewing for this job. Outline key topics I should review, including AI safety concepts, Anthropic's research focus, and typical technical or behavioral questions I might encounter."

During live interviews: This is all you–no AI assistance unless we indicate otherwise. We're curious to see how you think through problems in real time. If you require any accommodations for your interviews, please let your recruiter know early in the process.`)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg text-xs font-semibold text-purple-200 hover:bg-purple-500/30 transition-all"
                              >
                                📄 Load Example: Anthropic's AI Candidate Guidance
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gray-400">
                                {userContext.length} characters • {Math.ceil(userContext.length / 4)} tokens approx
                              </span>
                              {!userContext && (
                                <span className="text-yellow-400 ml-auto">
                                  ⚠️ No context provided - will use default knowledge base
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-cyan-300 italic mt-2">
                              💡 RAG works by injecting your context before the question. Try it: paste a doc, then ask something about it!
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10">
                          <div className="bg-slate-800/50 px-4 py-2 border-b border-white/10">
                            <span className="text-sm text-gray-400">Ask a question about your context</span>
                          </div>
                          <textarea
                            value={userPromptText}
                            onChange={(e) => setUserPromptText(e.target.value)}
                            placeholder={userContext
                              ? "Ask anything about the context you pasted above:\n• Summarize the main points\n• What are the key takeaways?\n• Explain [specific topic] from the text"
                              : "Try asking (using default knowledge base):\n• What is Python used for?\n• Tell me about JavaScript\n• What's the difference between Python and JavaScript?"}
                            className="w-full h-32 bg-slate-900 text-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono text-sm"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleTestPrompt}
                          disabled={isTesting || !userPromptText.trim()}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Sparkles className="w-5 h-5" />
                          {isTesting ? 'Comparing RAG vs No-RAG...' : 'Compare: Without RAG vs With RAG'}
                        </motion.button>
                      </>
                    )}

                    {selectedLesson.id === '1-3' && (
                      <>
                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4 space-y-2">
                          <p className="text-sm text-gray-300">
                            💡 <strong>Live Claude API Demo</strong>
                          </p>
                          <p className="text-xs text-gray-400">
                            See real Claude API calls with token usage, latency, and cost tracking!
                          </p>
                          <div className="bg-black/20 rounded-lg p-3 mt-2">
                            <p className="text-xs text-cyan-300 font-semibold mb-1">What you'll learn:</p>
                            <ul className="text-xs text-gray-400 space-y-1 ml-4">
                              <li>• How to make production API calls to Claude</li>
                              <li>• Understanding token usage (input vs output tokens)</li>
                              <li>• Cost optimization: Monitor and predict API expenses</li>
                              <li>• Real-world metrics for production apps</li>
                            </ul>
                          </div>
                        </div>

                        <div className="bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10">
                          <div className="bg-slate-800/50 px-4 py-2 border-b border-white/10">
                            <span className="text-sm text-gray-400">Enter any prompt</span>
                          </div>
                          <textarea
                            value={userPromptText}
                            onChange={(e) => setUserPromptText(e.target.value)}
                            placeholder="Try anything:
• Write a Python function for binary search
• Explain async/await in JavaScript
• Design a database schema for an e-commerce app"
                            className="w-full h-32 bg-slate-900 text-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono text-sm"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleTestPrompt}
                          disabled={isTesting || !userPromptText.trim()}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Code2 className="w-5 h-5" />
                          {isTesting ? 'Calling Claude API...' : 'Call Claude API (See Tokens, Cost, Latency)'}
                        </motion.button>
                      </>
                    )}

                    {selectedLesson.id === '1-1' && (
                      <>
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4 space-y-2">
                      <p className="text-sm text-gray-300">
                        💡 <strong>How is this different from Model Comparison?</strong>
                      </p>
                      <ul className="text-xs text-gray-400 mt-2 space-y-1 ml-4">
                        <li>• <strong>Model Comparison:</strong> Same prompt → Different models → Choose best AI</li>
                        <li>• <strong>Prompt Learning:</strong> Different prompts → Same model → Write better prompts</li>
                      </ul>
                      <div className="bg-black/20 rounded-lg p-3 mt-2">
                        <p className="text-xs text-cyan-300 font-semibold mb-1">What you'll learn:</p>
                        <ul className="text-xs text-gray-400 space-y-1 ml-4">
                          <li>• Structure prompts for clarity and specificity</li>
                          <li>• Add role, context, and format requirements</li>
                          <li>• Get 3-5x better outputs with proper prompting</li>
                          <li>• Apply to code, analysis, creative writing, and more</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10">
                      <div className="bg-slate-800/50 px-4 py-2 border-b border-white/10 flex items-center justify-between">
                        <span className="text-sm text-gray-400">Enter any question or task</span>
                        <span className="text-xs text-cyan-400">● Prompt Playground</span>
                      </div>

                      <textarea
                        value={userPromptText}
                        onChange={(e) => setUserPromptText(e.target.value)}
                        placeholder="Examples:
• Explain microservices architecture
• Write Python code for fibonacci sequence
• Imagine you are a CTO, explain technical debt
• What is recursion?

Try anything - theoretical concepts, code questions, creative tasks!"
                        className="w-full h-64 bg-slate-900 text-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono text-sm"
                      />
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTestPrompt}
                      disabled={isTesting || !userPromptText.trim()}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-5 h-5" />
                      {isTesting ? 'Comparing Prompts with Claude...' : 'Compare: My Prompt vs Well-Structured Prompt'}
                    </motion.button>
                    </>
                    )}

                    {/* Coming Soon Card for non-interactive lessons */}
                    {!['1-1', '1-2', '1-3'].includes(selectedLesson.id) && (
                      <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-2 border-yellow-500/30 rounded-2xl p-8 text-center">
                        <div className="text-6xl mb-4">🚧</div>
                        <h3 className="text-2xl font-bold text-yellow-300 mb-2">Coming Soon!</h3>
                        <p className="text-gray-400 mb-4">
                          This advanced lesson is currently under development.
                        </p>
                        <div className="bg-black/30 rounded-lg p-4 text-left">
                          <p className="text-sm font-semibold text-yellow-300 mb-2">What you'll learn:</p>
                          <ul className="text-xs text-gray-400 space-y-1">
                            {selectedLesson.topics.map((topic, idx) => (
                              <li key={idx}>• {topic}</li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-xs text-gray-500 mt-4 italic">
                          💡 Try our interactive lessons: Prompt Engineering, RAG Architecture, or Claude API!
                        </p>
                      </div>
                    )}

                    {/* XP Reward - Shown for all lessons */}
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between mt-6">
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-yellow-400" />
                        <span className="text-sm">Complete to earn</span>
                      </div>
                      <span className="text-2xl font-bold text-yellow-400">+{selectedLesson.xp} XP</span>
                    </div>

                    {/* Comparison Display - Shown for all lessons */}
                    <AnimatePresence>
                      {showComparison && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="space-y-6 mt-6"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-xl font-bold">Comparison Results</h3>
                          </div>

                          {/* Educational Explanation Banner */}
                          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-xl p-6">
                            {selectedLesson.id === '1-1' && (
                              <div className="space-y-3">
                                <h4 className="font-bold text-blue-300 flex items-center gap-2">
                                  <Lightbulb className="w-5 h-5" />
                                  How Prompt Engineering Works
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                                    <p className="text-orange-300 font-semibold mb-1">❌ Your Original Prompt:</p>
                                    <p className="text-gray-300 text-xs">Sent directly to Claude as-is, without structure or guidance.</p>
                                  </div>
                                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                    <p className="text-green-300 font-semibold mb-1">✅ Well-Structured Prompt:</p>
                                    <p className="text-gray-300 text-xs">Enhanced with clear instructions, structure, format requirements, and examples for better output.</p>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400 italic">💡 Notice how the structured prompt produces more detailed, organized, and helpful responses!</p>
                              </div>
                            )}

                            {selectedLesson.id === '1-2' && (
                              <div className="space-y-3">
                                <h4 className="font-bold text-blue-300 flex items-center gap-2">
                                  <Lightbulb className="w-5 h-5" />
                                  How RAG (Retrieval Augmented Generation) Works
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                                    <p className="text-orange-300 font-semibold mb-1">❌ Without RAG:</p>
                                    <p className="text-gray-300 text-xs">Claude answers using only its training data (knowledge cutoff: Jan 2025). May give generic or outdated answers.</p>
                                  </div>
                                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                    <p className="text-green-300 font-semibold mb-1">✅ With RAG Context:</p>
                                    <p className="text-gray-300 text-xs">We retrieve relevant info from our knowledge base and inject it into the prompt. Claude answers based on YOUR specific data!</p>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400 italic">💡 RAG lets you give Claude access to private documents, databases, or real-time data it wasn't trained on!</p>
                              </div>
                            )}

                            {selectedLesson.id === '1-3' && (
                              <div className="space-y-3">
                                <h4 className="font-bold text-blue-300 flex items-center gap-2">
                                  <Lightbulb className="w-5 h-5" />
                                  Understanding Tokens & Claude API
                                </h4>

                                {/* Token Concept Explanation */}
                                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4 space-y-2">
                                  <p className="text-cyan-300 font-semibold text-sm">🧩 What are Tokens?</p>
                                  <p className="text-gray-300 text-xs leading-relaxed">
                                    Tokens are the basic units AI models use to process text. Think of them as "word pieces":
                                  </p>
                                  <ul className="text-xs text-gray-400 space-y-1 ml-4">
                                    <li>• <strong className="text-gray-300">"Hello"</strong> = 1 token</li>
                                    <li>• <strong className="text-gray-300">"Hello world"</strong> = 2 tokens</li>
                                    <li>• <strong className="text-gray-300">"ChatGPT"</strong> = 2 tokens (Chat + GPT)</li>
                                    <li>• <strong className="text-gray-300">"anthropic"</strong> = 2 tokens (anthrop + ic)</li>
                                  </ul>
                                  <p className="text-gray-300 text-xs italic mt-2">
                                    Rule of thumb: 1 token ≈ 4 characters or ≈ 0.75 words in English
                                  </p>
                                </div>

                                {/* How Tokens are Calculated */}
                                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 space-y-2">
                                  <p className="text-purple-300 font-semibold text-sm">📊 How Token Counting Works</p>
                                  <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="bg-black/20 rounded p-2">
                                      <p className="text-orange-300 font-semibold mb-1">Input Tokens:</p>
                                      <p className="text-gray-400">What YOU send to Claude (your prompt + any context)</p>
                                    </div>
                                    <div className="bg-black/20 rounded p-2">
                                      <p className="text-green-300 font-semibold mb-1">Output Tokens:</p>
                                      <p className="text-gray-400">What CLAUDE sends back (the AI's response)</p>
                                    </div>
                                  </div>
                                  <p className="text-gray-300 text-xs mt-2">
                                    <strong>Total Cost = (Input Tokens × $0.003/1K) + (Output Tokens × $0.015/1K)</strong>
                                  </p>
                                </div>

                                {/* Why Tokens Matter */}
                                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                                  <p className="text-amber-300 font-semibold text-sm">💰 Why Tokens are Important</p>
                                  <ul className="text-xs text-gray-300 space-y-1.5 ml-4">
                                    <li>• <strong>Cost Control:</strong> You pay per token, so shorter prompts = lower cost</li>
                                    <li>• <strong>Context Limits:</strong> Claude has a 200K token context window (≈150K words)</li>
                                    <li>• <strong>Performance:</strong> Fewer tokens = faster responses</li>
                                    <li>• <strong>Production Planning:</strong> Predict monthly costs: 1M tokens/day = ~$45-75/month</li>
                                  </ul>
                                </div>

                                {/* Real Example */}
                                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                                  <p className="text-green-300 font-semibold text-sm">💡 Real-World Example</p>
                                  <p className="text-gray-300 text-xs">
                                    <strong>Scenario:</strong> Customer support chatbot handling 1,000 conversations/day
                                  </p>
                                  <div className="bg-black/20 rounded p-3 mt-2 text-xs font-mono">
                                    <p className="text-gray-400">Average input: 150 tokens (user question + context)</p>
                                    <p className="text-gray-400">Average output: 300 tokens (Claude's answer)</p>
                                    <p className="text-green-300 mt-2">Daily cost: (150 × $0.003 + 300 × $0.015) × 1000 = $4.95</p>
                                    <p className="text-green-300">Monthly cost: $4.95 × 30 = <strong className="text-green-200">~$148.50</strong></p>
                                  </div>
                                </div>

                                <p className="text-xs text-cyan-400 italic">💡 Try different prompts below and watch how token counts change!</p>
                              </div>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Left Response Box */}
                            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl border border-orange-500/30 overflow-hidden">
                              <div className="bg-orange-500/20 px-4 py-3 border-b border-orange-500/30">
                                <h4 className="font-bold text-orange-200 flex items-center gap-2">
                                  <User className="w-5 h-5" />
                                  {selectedLesson.id === '1-2' ? 'Without RAG' : selectedLesson.id === '1-3' ? 'Claude Response' : 'Your Prompt'}
                                </h4>
                              </div>
                              <div className="p-4 space-y-4">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-gray-400">Response:</p>
                                    {studentResponse && (
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(studentResponse);
                                          setShowCopyToast(true);
                                          setTimeout(() => setShowCopyToast(false), 2000);
                                        }}
                                        className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
                                      >
                                        <Copy className="w-3 h-3" />
                                        Copy
                                      </button>
                                    )}
                                  </div>
                                  <div className="bg-black/30 rounded-lg p-4 text-sm h-96 overflow-y-auto">
                                    {isTesting ? (
                                      <div className="flex gap-2 items-center h-full justify-center">
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-2 h-2 bg-orange-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-orange-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-orange-400 rounded-full" />
                                      </div>
                                    ) : studentResponse ? (
                                      <MarkdownRenderer content={studentResponse} />
                                    ) : (
                                      <div className="text-gray-500 h-full flex items-center justify-center">Waiting for response...</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Response Box */}
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-green-500/30 overflow-hidden">
                              <div className="bg-green-500/20 px-4 py-3 border-b border-green-500/30">
                                <h4 className="font-bold text-green-200 flex items-center gap-2">
                                  <CheckCircle2 className="w-5 h-5" />
                                  {selectedLesson.id === '1-2' ? 'With RAG Context' : selectedLesson.id === '1-3' ? 'API Stats' : 'Well-Structured'}
                                </h4>
                              </div>
                              <div className="p-4 space-y-4">
                                {/* For API lesson, show stats first */}
                                {selectedLesson.id === '1-3' && idealPrompt && (
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-xs text-gray-400">📊 API Metrics:</p>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(idealPrompt);
                                          setShowCopyToast(true);
                                          setTimeout(() => setShowCopyToast(false), 2000);
                                        }}
                                        className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                                      >
                                        <Copy className="w-3 h-3" />
                                        Copy
                                      </button>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-4 text-sm">
                                      <MarkdownRenderer content={idealPrompt} />
                                    </div>
                                  </div>
                                )}

                                {/* For other lessons or response section */}
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-gray-400">
                                      {selectedLesson.id === '1-3' ? '💡 Key Insight:' : 'Response:'}
                                    </p>
                                    {idealResponse && (
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(idealResponse);
                                          setShowCopyToast(true);
                                          setTimeout(() => setShowCopyToast(false), 2000);
                                        }}
                                        className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                                      >
                                        <Copy className="w-3 h-3" />
                                        Copy
                                      </button>
                                    )}
                                  </div>
                                  <div className={`bg-black/30 rounded-lg p-4 text-sm ${selectedLesson.id === '1-3' ? '' : 'h-96'} overflow-y-auto`}>
                                    {isTesting ? (
                                      <div className="flex gap-2 items-center h-full justify-center">
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-2 h-2 bg-green-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-green-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-green-400 rounded-full" />
                                      </div>
                                    ) : idealResponse ? (
                                      <MarkdownRenderer content={idealResponse} />
                                    ) : (
                                      <div className="text-gray-500 h-full flex items-center justify-center">Waiting for response...</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* FULL-WIDTH TOKEN ANALYSIS WIDGET (Only for Lesson 1-3) */}
                          {selectedLesson.id === '1-3' && apiUsage && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl border-2 border-purple-500/30 overflow-hidden"
                            >
                              {/* Header */}
                              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-6 py-4 border-b border-purple-500/30">
                                <h3 className="text-lg font-bold text-purple-200 flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-yellow-400" />
                                  Complete Token & Cost Analysis for This API Call
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">See exactly how your prompt translates to tokens and cost</p>
                              </div>

                              {/* Analysis Grid */}
                              <div className="p-6 grid md:grid-cols-3 gap-4">
                                {/* INPUT Column */}
                                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/30">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-orange-500/20 p-2 rounded-lg">
                                      <User className="w-4 h-4 text-orange-400" />
                                    </div>
                                    <p className="font-bold text-orange-300 text-sm">INPUT</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-2xl font-bold text-orange-200">{apiUsage.input_tokens}</p>
                                      <p className="text-xs text-gray-400">tokens</p>
                                    </div>
                                    <div className="pt-2 border-t border-orange-500/20">
                                      <p className="text-sm text-gray-300">≈ {Math.round(apiUsage.input_tokens * 0.75)} words*</p>
                                      <p className="text-xs text-gray-500">Your prompt length</p>
                                    </div>
                                    <div className="pt-2 border-t border-orange-500/20">
                                      <p className="text-sm font-semibold text-orange-300">${(apiUsage.input_tokens * 0.000003).toFixed(6)}</p>
                                      <p className="text-xs text-gray-500">Input cost ($3 per 1M tokens)</p>
                                    </div>
                                    <p className="text-xs text-gray-500 italic mt-3 pt-2 border-t border-orange-500/10">
                                      * Includes API overhead (message structure, role labels, etc.) beyond just your prompt text
                                    </p>
                                  </div>
                                </div>

                                {/* OUTPUT Column */}
                                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/30">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-green-500/20 p-2 rounded-lg">
                                      <Brain className="w-4 h-4 text-green-400" />
                                    </div>
                                    <p className="font-bold text-green-300 text-sm">OUTPUT</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-2xl font-bold text-green-200">{apiUsage.output_tokens}</p>
                                      <p className="text-xs text-gray-400">tokens</p>
                                    </div>
                                    <div className="pt-2 border-t border-green-500/20">
                                      <p className="text-sm text-gray-300">≈ {Math.round(apiUsage.output_tokens * 0.75)} words</p>
                                      <p className="text-xs text-gray-500">Claude's response length</p>
                                    </div>
                                    <div className="pt-2 border-t border-green-500/20">
                                      <p className="text-sm font-semibold text-green-300">${(apiUsage.output_tokens * 0.000015).toFixed(6)}</p>
                                      <p className="text-xs text-gray-500">Output cost ($15 per 1M tokens)</p>
                                    </div>
                                  </div>
                                </div>

                                {/* TOTAL Column */}
                                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-purple-500/20 p-2 rounded-lg">
                                      <Target className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <p className="font-bold text-purple-300 text-sm">TOTAL</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-2xl font-bold text-purple-200">{apiUsage.input_tokens + apiUsage.output_tokens}</p>
                                      <p className="text-xs text-gray-400">tokens</p>
                                    </div>
                                    <div className="pt-2 border-t border-purple-500/20">
                                      <p className="text-sm text-gray-300">≈ {Math.round((apiUsage.input_tokens + apiUsage.output_tokens) * 0.75)} words</p>
                                      <p className="text-xs text-gray-500">Combined length</p>
                                    </div>
                                    <div className="pt-2 border-t border-purple-500/20">
                                      <p className="text-lg font-bold text-purple-200">${((apiUsage.input_tokens * 0.000003) + (apiUsage.output_tokens * 0.000015)).toFixed(6)}</p>
                                      <p className="text-xs text-gray-500">Complete API call cost</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Production Scale Projection */}
                              <div className="px-6 pb-6">
                                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                                  <p className="text-sm font-semibold text-cyan-300 mb-2">💡 Production Scale Projection:</p>
                                  <div className="grid md:grid-cols-3 gap-4 text-xs">
                                    <div className="bg-black/20 rounded p-2">
                                      <p className="text-gray-400">1,000 calls/day</p>
                                      <p className="text-cyan-300 font-bold">${(((apiUsage.input_tokens * 0.000003) + (apiUsage.output_tokens * 0.000015)) * 1000).toFixed(2)}/day</p>
                                    </div>
                                    <div className="bg-black/20 rounded p-2">
                                      <p className="text-gray-400">30,000 calls/month</p>
                                      <p className="text-cyan-300 font-bold">${(((apiUsage.input_tokens * 0.000003) + (apiUsage.output_tokens * 0.000015)) * 30000).toFixed(2)}/month</p>
                                    </div>
                                    <div className="bg-black/20 rounded p-2">
                                      <p className="text-gray-400">365,000 calls/year</p>
                                      <p className="text-cyan-300 font-bold">${(((apiUsage.input_tokens * 0.000003) + (apiUsage.output_tokens * 0.000015)) * 365000).toFixed(2)}/year</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl rounded-3xl p-16 border-2 border-white/10 text-center"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block mb-6"
                  >
                    <BookOpen className="w-24 h-24 text-purple-400/50" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">Select a lesson to begin</h3>
                  <p className="text-gray-500">Choose from the curriculum on the left to start learning</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 rounded-2xl shadow-2xl shadow-green-500/50 flex items-center gap-3 z-50"
          >
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold">Lesson Complete!</p>
              <p className="text-sm">+150 XP earned</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Toast Notification */}
      <AnimatePresence>
        {showCopyToast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-8 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-xl shadow-2xl shadow-blue-500/50 flex items-center gap-3 z-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-semibold text-sm">Copied to clipboard!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
