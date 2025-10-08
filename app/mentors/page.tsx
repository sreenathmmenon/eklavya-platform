'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Download, Calendar, Clock, Star,
  Brain, Code2, Cpu, Send, User, Sparkles,
  CheckCircle2, TrendingUp, Award, Target
} from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Mentor {
  id: string;
  name: string;
  title: string;
  tagline: string;
  avatar: string;
  expertise: string[];
  rating: number;
  sessions: number;
  pricePerHour: number;
  color: string;
  gradient: string;
  bio: string;
  achievements: string[];
}

interface Message {
  role: 'user' | 'mentor';
  content: string;
  timestamp: Date;
}

export default function MentorsPage() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const mentors: Mentor[] = [
    {
      id: 'jeff-dean',
      name: 'Jeff Dean',
      title: 'Google Senior Fellow',
      tagline: 'The mind behind TensorFlow, MapReduce, and Bigtable',
      avatar: '👨‍💻',
      expertise: ['Distributed Systems', 'Machine Learning', 'System Design', 'Performance Optimization'],
      rating: 5.0,
      sessions: 1247,
      pricePerHour: 0, // Virtual mentor - free
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bio: 'Virtual mentor trained on Jeff Dean\'s talks, papers, and engineering philosophy. Learn how to think about systems at Google scale.',
      achievements: [
        'Co-designed TensorFlow and MapReduce',
        '10+ years building Google infrastructure',
        'Pioneered distributed deep learning'
      ]
    },
    {
      id: 'karpathy',
      name: 'Andrej Karpathy',
      title: 'Former Tesla AI Director',
      tagline: 'Making neural networks understandable to everyone',
      avatar: '🧠',
      expertise: ['Deep Learning', 'Computer Vision', 'AI Education', 'PyTorch'],
      rating: 5.0,
      sessions: 892,
      pricePerHour: 0,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bio: 'Virtual mentor modeled after Karpathy\'s teaching style. Master deep learning through clear explanations and hands-on coding.',
      achievements: [
        'Built Tesla Autopilot AI stack',
        'Created legendary CS231n course',
        'YouTube educator with millions of views'
      ]
    },
    {
      id: 'arpit',
      name: 'Arpit Bhayani',
      title: 'System Design Expert',
      tagline: 'Teaching complex systems through stories',
      avatar: '⚡',
      expertise: ['System Design', 'Backend Engineering', 'Redis', 'Database Internals'],
      rating: 5.0,
      sessions: 654,
      pricePerHour: 0,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      bio: 'Virtual mentor inspired by Arpit\'s system design mastery. Learn how to build and scale production systems.',
      achievements: [
        'Taught 100K+ engineers system design',
        'Built high-scale systems at multiple startups',
        'Creator of popular system design courses'
      ]
    },
    {
      id: 'linus',
      name: 'Linus Torvalds',
      title: 'Creator of Linux & Git',
      tagline: 'The godfather of open source',
      avatar: '🐧',
      expertise: ['Operating Systems', 'Open Source', 'C Programming', 'Git'],
      rating: 5.0,
      sessions: 1523,
      pricePerHour: 0,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bio: 'Virtual mentor based on Linus\'s no-nonsense engineering philosophy. Learn what makes great code from the creator of Linux.',
      achievements: [
        'Created Linux kernel (powers billions of devices)',
        'Built Git version control system',
        '30+ years leading largest open source project'
      ]
    },
    {
      id: 'kent-beck',
      name: 'Kent Beck',
      title: 'Creator of XP & TDD',
      tagline: 'Teaching software craftsmanship through simplicity',
      avatar: '🧪',
      expertise: ['Test-Driven Development', 'Agile', 'Software Design', 'Refactoring'],
      rating: 5.0,
      sessions: 987,
      pricePerHour: 0,
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-500',
      bio: 'Virtual mentor inspired by Kent\'s patient teaching style. Master TDD, clean code, and the art of simple design.',
      achievements: [
        'Created Test-Driven Development (TDD)',
        'Co-author of Agile Manifesto',
        'Mentored thousands in Extreme Programming'
      ]
    },
    {
      id: 'paul-graham',
      name: 'Paul Graham',
      title: 'Co-founder of Y Combinator',
      tagline: 'Building startups that scale',
      avatar: '🚀',
      expertise: ['Startups', 'Product Development', 'Fundraising', 'Essays & Writing'],
      rating: 5.0,
      sessions: 1876,
      pricePerHour: 0,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
      bio: 'Virtual mentor based on Paul Graham\'s essays and startup advice. Learn how to build products people want.',
      achievements: [
        'Co-founded Y Combinator (Airbnb, Stripe, Dropbox)',
        'Funded 3000+ startups worth $600B+',
        'Legendary essayist on startups and tech'
      ]
    },
    {
      id: 'reshma',
      name: 'Reshma Saujani',
      title: 'Founder of Girls Who Code',
      tagline: 'Empowering the next generation of tech leaders',
      avatar: '💜',
      expertise: ['Diversity & Inclusion', 'Leadership', 'Tech Education', 'Advocacy'],
      rating: 5.0,
      sessions: 743,
      pricePerHour: 0,
      color: 'pink',
      gradient: 'from-pink-500 to-rose-500',
      bio: 'Virtual mentor inspired by Reshma\'s empowering approach. Build confidence, overcome imposter syndrome, and thrive in tech.',
      achievements: [
        'Founded Girls Who Code (500K+ girls reached)',
        'Champion for women in technology',
        'Author of "Brave, Not Perfect"'
      ]
    },
    {
      id: 'ballmer',
      name: 'Steve Ballmer',
      title: 'Former Microsoft CEO',
      tagline: 'Energy, passion, and competitive excellence',
      avatar: '📊',
      expertise: ['Business Strategy', 'Sales & Marketing', 'Leadership', 'Competitive Analysis'],
      rating: 5.0,
      sessions: 1234,
      pricePerHour: 0,
      color: 'indigo',
      gradient: 'from-indigo-500 to-blue-500',
      bio: 'Virtual mentor with Ballmer\'s legendary energy. Connect tech to business outcomes and think at enterprise scale.',
      achievements: [
        'Scaled Microsoft from $7.5B to $78B revenue',
        'Led Microsoft through cloud transformation',
        'Owner of LA Clippers (tech meets sports)'
      ]
    },
    {
      id: 'shigeru',
      name: 'Shigeru Miyamoto',
      title: 'Nintendo Game Designer',
      tagline: 'Creating joy through interactive experiences',
      avatar: '🎮',
      expertise: ['Game Design', 'User Experience', 'Creative Innovation', 'Prototyping'],
      rating: 5.0,
      sessions: 892,
      pricePerHour: 0,
      color: 'red',
      gradient: 'from-red-500 to-pink-500',
      bio: 'Virtual mentor based on Miyamoto\'s design philosophy. Learn to create delightful user experiences that bring joy.',
      achievements: [
        'Created Mario, Zelda, Donkey Kong franchises',
        'Holds 100+ patents in game design',
        'Revolutionized interactive entertainment'
      ]
    }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedMentor) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call Claude API with mentor persona
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          message: inputMessage,
          conversationHistory: newMessages.slice(0, -1).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const mentorMessage: Message = {
        role: 'mentor',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, mentorMessage]);
    } catch (error) {
      console.error('Error calling mentor API:', error);
      // Fallback message
      const mentorMessage: Message = {
        role: 'mentor',
        content: `I apologize, but I'm having trouble connecting right now. Please make sure your ANTHROPIC_API_KEY is set in .env.local file. Error: ${error}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, mentorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDownloadTranscript = () => {
    const transcript = messages.map(m =>
      `[${m.timestamp.toLocaleTimeString()}] ${m.role === 'user' ? 'You' : selectedMentor?.name}: ${m.content}`
    ).join('\n\n');

    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentor-${selectedMentor?.id}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
  };

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
                <h1 className="text-2xl font-bold">Virtual Mentors</h1>
                <p className="text-sm text-gray-400">Learn from legendary engineers, powered by AI</p>
              </div>
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-all"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!showChat ? (
            <motion.div
              key="mentor-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold mb-4"
                >
                  Learn from <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">Virtual Legends</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-gray-400"
                >
                  AI mentors trained on the knowledge and teaching styles of industry legends
                </motion.p>
              </div>

              {/* Mentors Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mentors.map((mentor, i) => (
                  <motion.div
                    key={mentor.id}
                    initial={{ opacity: 0, y: 50, rotateY: -20 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.5)"
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setShowChat(true);
                    }}
                  >
                    <div className={`
                      relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl
                      rounded-3xl p-8 border-2 border-white/20 group-hover:border-white/40
                      transition-all shadow-2xl overflow-hidden
                    `}>
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${mentor.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

                      {/* Avatar */}
                      <div className="relative mb-6">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="text-6xl mb-4 inline-block"
                        >
                          {mentor.avatar}
                        </motion.div>
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-400 ml-2">({mentor.sessions} sessions)</span>
                        </div>
                      </div>

                      {/* Info */}
                      <h3 className="text-2xl font-bold mb-2">{mentor.name}</h3>
                      <p className="text-purple-300 font-medium mb-3">{mentor.title}</p>
                      <p className="text-sm text-gray-400 mb-4 italic">"{mentor.tagline}"</p>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mentor.expertise.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 bg-gradient-to-r ${mentor.gradient} bg-opacity-20 rounded-full text-xs border border-white/20`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          w-full bg-gradient-to-r ${mentor.gradient} px-6 py-3 rounded-xl
                          font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all
                          flex items-center justify-center gap-2
                        `}
                      >
                        <MessageSquare className="w-5 h-5" />
                        Start Session
                      </motion.button>

                      {/* Free Badge */}
                      <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-green-300">FREE</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Benefits Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-16 grid md:grid-cols-3 gap-6"
              >
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
                  <Target className="w-12 h-12 text-blue-400 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Personalized Learning</h4>
                  <p className="text-sm text-gray-400">Each mentor adapts to your level and learning style</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
                  <Download className="w-12 h-12 text-purple-400 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Download Transcripts</h4>
                  <p className="text-sm text-gray-400">Keep every conversation as markdown for future reference</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20">
                  <Award className="w-12 h-12 text-orange-400 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Learn by Doing</h4>
                  <p className="text-sm text-gray-400">Get code reviews, system design feedback, and career advice</p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-interface"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-6xl mx-auto"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-t-3xl p-6 border-2 border-white/20 border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setShowChat(false);
                        setMessages([]);
                      }}
                      className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-all"
                    >
                      ←
                    </motion.button>

                    <div className="text-4xl">{selectedMentor?.avatar}</div>

                    <div>
                      <h3 className="text-xl font-bold">{selectedMentor?.name}</h3>
                      <p className="text-sm text-gray-400">{selectedMentor?.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadTranscript}
                      disabled={messages.length === 0}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Transcript
                    </motion.button>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedMentor?.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 bg-gradient-to-r ${selectedMentor.gradient} bg-opacity-20 rounded-full text-xs border border-white/20`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-2xl p-6 border-2 border-white/20 border-t-0 border-b-0 min-h-[500px] max-h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-6xl mb-4"
                    >
                      {selectedMentor?.avatar}
                    </motion.div>
                    <h4 className="text-2xl font-bold mb-2">Ready to learn from {selectedMentor?.name}?</h4>
                    <p className="text-gray-400 mb-6">{selectedMentor?.bio}</p>

                    <div className="space-y-2 max-w-2xl mx-auto text-left">
                      <p className="text-sm text-purple-300 font-bold">Ask me about:</p>
                      {selectedMentor?.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`
                          max-w-[70%] p-4 rounded-2xl
                          ${message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 ml-auto'
                            : 'bg-white/10 border border-white/20'
                          }
                        `}>
                          <div className="flex items-center gap-2 mb-1">
                            {message.role === 'mentor' && (
                              <span className="text-sm font-bold text-purple-300">{selectedMentor?.name}</span>
                            )}
                            {message.role === 'user' && (
                              <span className="text-sm font-bold">You</span>
                            )}
                            <span className="text-xs text-gray-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <MarkdownRenderer content={message.content} />
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
                          <div className="flex gap-2">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-b-3xl p-6 border-2 border-white/20 border-t-0">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Ask ${selectedMentor?.name} anything...`}
                    className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-all"
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`
                      bg-gradient-to-r ${selectedMentor?.gradient} px-6 py-3 rounded-xl
                      font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center gap-2
                    `}
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </motion.button>
                </div>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  Powered by Claude Sonnet 4.5 • Conversations are saved and downloadable
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
