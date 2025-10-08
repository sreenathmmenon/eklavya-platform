'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Sparkles, TrendingUp, Code, Zap, Award, Target, Brain, Rocket, Star, GitCompare } from 'lucide-react';
import Link from 'next/link';

const allMentors = [
  {
    name: 'Jeff Dean',
    role: 'Google Senior Fellow',
    expertise: 'Distributed Systems',
    avatar: '👨‍💻',
    color: 'from-blue-500 to-cyan-500',
    sessions: '1,234'
  },
  {
    name: 'Andrej Karpathy',
    role: 'Ex-Tesla AI Director',
    expertise: 'Neural Networks',
    avatar: '🧠',
    color: 'from-purple-500 to-pink-500',
    sessions: '987'
  },
  {
    name: 'Arpit Bhayani',
    role: 'System Design Expert',
    expertise: 'Architecture',
    avatar: '🏗️',
    color: 'from-orange-500 to-red-500',
    sessions: '756'
  },
  {
    name: 'Linus Torvalds',
    role: 'Creator of Linux & Git',
    expertise: 'Open Source',
    avatar: '🐧',
    color: 'from-green-500 to-emerald-500',
    sessions: '2,104'
  },
  {
    name: 'Kent Beck',
    role: 'Creator of XP & TDD',
    expertise: 'Software Craft',
    avatar: '🧪',
    color: 'from-yellow-500 to-orange-500',
    sessions: '892'
  },
  {
    name: 'Paul Graham',
    role: 'Y Combinator Co-founder',
    expertise: 'Startups',
    avatar: '🚀',
    color: 'from-pink-500 to-rose-500',
    sessions: '1,567'
  },
  {
    name: 'Reshma Saujani',
    role: 'Girls Who Code Founder',
    expertise: 'Diversity & Code',
    avatar: '💻',
    color: 'from-purple-400 to-pink-400',
    sessions: '643'
  },
  {
    name: 'Steve Ballmer',
    role: 'Former Microsoft CEO',
    expertise: 'Business & Tech',
    avatar: '📊',
    color: 'from-blue-600 to-indigo-600',
    sessions: '1,891'
  },
  {
    name: 'Shigeru Miyamoto',
    role: 'Creator of Mario & Zelda',
    expertise: 'Game Design',
    avatar: '🎮',
    color: 'from-red-500 to-yellow-500',
    sessions: '1,023'
  },
];

const stats = [
  { label: 'Cost Reduction', value: '98%', icon: TrendingUp, color: 'text-emerald-400' },
  { label: 'ROI in 4 Weeks', value: '79x', icon: Sparkles, color: 'text-yellow-400' },
  { label: 'Faster Learning', value: '5x', icon: Zap, color: 'text-cyan-400' },
  { label: 'Projects Built', value: '12+', icon: Code, color: 'text-purple-400' },
];

export default function Home() {
  // Rotate mentors every 5 seconds
  const [mentorStartIndex, setMentorStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMentorStartIndex((prev) => (prev + 3) % allMentors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get 3 mentors to display (wrapping around)
  const displayedMentors = [
    allMentors[mentorStartIndex],
    allMentors[(mentorStartIndex + 1) % allMentors.length],
    allMentors[(mentorStartIndex + 2) % allMentors.length],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-8">
        {/* Floating Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-16 bg-white/5 backdrop-blur-xl rounded-3xl p-4 border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-3xl">🎯</span>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 text-transparent bg-clip-text">Eklavya AI</h1>
              <p className="text-purple-300 text-sm font-medium">Virtual Legends • Real Learning</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/learn">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm transition-all font-medium border border-white/10 flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Start Learning
              </motion.button>
            </Link>
            <Link href="/mentors">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-purple-500/50 flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Meet Mentors
              </motion.button>
            </Link>
            <Link href="/compare">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm transition-all font-medium border border-white/10 flex items-center gap-2"
              >
                <GitCompare className="w-5 h-5" />
                Compare Models
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center mb-24 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <span className="text-8xl">🎓</span>
            </motion.div>
            <h2 className="text-8xl font-black text-white mb-6 leading-tight tracking-tight">
              Learn AI from
              <br />
              <motion.span
                className="bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%_auto]"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Virtual Legends
              </motion.span>
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl text-purple-100 mb-12 max-w-4xl mx-auto font-light leading-relaxed"
            >
              World-class AI mentorship for everyone. <span className="font-bold text-yellow-300">98% cheaper</span> than ₹2.33L bootcamps.
              <br />
              Learn from <span className="font-semibold text-cyan-300">9 legendary mentors</span>: <span className="font-semibold text-pink-300">Jeff Dean</span>, <span className="font-semibold text-purple-300">Karpathy</span>, <span className="font-semibold text-orange-300">Linus Torvalds</span>, <span className="font-semibold text-yellow-300">Paul Graham</span> & more.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-6 justify-center flex-wrap"
          >
            <Link href="/learn">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-purple-500/50 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Rocket className="w-6 h-6" />
                  Start Learning Free
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </Link>
            <Link href="/mentors">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xl backdrop-blur-xl transition-all border-2 border-white/20 hover:border-white/40"
              >
                <span className="flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  Meet Your Mentors
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32 max-w-6xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 1 + i * 0.1, type: "spring" }}
              whileHover={{
                scale: 1.1,
                rotateY: 10,
                boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.5)"
              }}
              className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all cursor-pointer"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
              />
              <div className="relative">
                <stat.icon className={`w-10 h-10 ${stat.color} mb-4 group-hover:scale-110 transition-transform`} />
                <motion.div
                  className="text-5xl font-black text-white mb-3"
                  whileHover={{ scale: 1.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-purple-200 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Virtual Mentors Section - Premium Cards */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h3
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              className="text-7xl font-black text-white mb-6"
            >
              Your <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">Virtual</span> Mentors
            </motion.h3>
            <p className="text-2xl text-purple-200 max-w-3xl mx-auto mb-4">
              Learn from the legends. Get 1-on-1 guidance. Download every session.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
              <Sparkles className="w-4 h-4" />
              <span>Showing {mentorStartIndex / 3 + 1} of {Math.ceil(allMentors.length / 3)} • Auto-rotating every 5s</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {displayedMentors.map((mentor, i) => (
              <motion.div
                key={`${mentor.name}-${mentorStartIndex}`}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ delay: i * 0.2, type: "spring", damping: 15 }}
                whileHover={{ y: -20 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className={`absolute -inset-2 bg-gradient-to-r ${mentor.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-75 transition-all duration-500`} />

                {/* Card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-10 border-2 border-white/20 group-hover:border-white/40 transition-all shadow-2xl">
                  {/* Avatar */}
                  <motion.div
                    className={`w-28 h-28 bg-gradient-to-br ${mentor.color} rounded-3xl flex items-center justify-center text-5xl mb-6 mx-auto shadow-2xl`}
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {mentor.avatar}
                  </motion.div>

                  {/* Info */}
                  <div className="text-center mb-6">
                    <h4 className="text-3xl font-black text-white mb-2">{mentor.name}</h4>
                    <p className="text-purple-200 mb-2 font-medium">{mentor.role}</p>
                    <div className="inline-block px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                      <p className="text-cyan-300 text-sm font-bold">{mentor.expertise}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-2 mb-6 text-yellow-300">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                    <span className="text-white ml-2 font-bold">({mentor.sessions} sessions)</span>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 bg-gradient-to-r ${mentor.color} hover:shadow-2xl text-white rounded-2xl text-lg font-bold transition-all`}
                  >
                    Book Session - ₹500
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Learning & Mentorship Split */}
        <div className="mb-32 max-w-7xl mx-auto">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-7xl font-black text-white text-center mb-20"
          >
            Two Ways to <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">Level Up</span>
          </motion.h3>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Learning Path */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-all" />
              <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-2xl rounded-3xl p-12 border-2 border-white/20 group-hover:border-cyan-400/50 transition-all">
                <BookOpen className="w-20 h-20 text-cyan-300 mb-8" />
                <h4 className="text-4xl font-black text-white mb-6">12-Week AI Course</h4>
                <p className="text-purple-100 text-xl mb-8 leading-relaxed">
                  Interactive lessons • Live coding • Real projects • Gamification
                </p>
                <div className="space-y-4 mb-10">
                  {[
                    { icon: Brain, text: 'Prompt Engineering & RAG' },
                    { icon: Code, text: 'Agentic AI & MCP' },
                    { icon: Target, text: 'Production MLOps' },
                    { icon: Rocket, text: '12 Shippable Projects' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-4 text-white">
                      <div className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-cyan-300" />
                      </div>
                      <span className="text-lg font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link href="/learn">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-black text-xl shadow-2xl transition-all"
                  >
                    Start Free Week 1 → ₹3,000/year
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Mentorship */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-all" />
              <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-2xl rounded-3xl p-12 border-2 border-white/20 group-hover:border-pink-400/50 transition-all">
                <Users className="w-20 h-20 text-pink-300 mb-8" />
                <h4 className="text-4xl font-black text-white mb-6">1-on-1 Mentorship</h4>
                <p className="text-purple-100 text-xl mb-8 leading-relaxed">
                  Personal guidance • Code reviews • Career advice • Downloadable sessions
                </p>
                <div className="space-y-4 mb-10">
                  {[
                    { icon: Code, text: 'Live Code Reviews' },
                    { icon: Brain, text: 'System Design Sessions' },
                    { icon: Target, text: 'Career Guidance' },
                    { icon: Award, text: 'Download Transcripts' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-4 text-white">
                      <div className="w-10 h-10 bg-pink-400/20 rounded-lg flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-pink-300" />
                      </div>
                      <span className="text-lg font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link href="/mentors">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-black text-xl shadow-2xl transition-all"
                  >
                    Book Mentor → From ₹200
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Final CTA - Eklavya Story */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto mb-20"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-3xl blur-3xl opacity-30 animate-pulse" />
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-16 border-2 border-white/20 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-8"
            >
              🏹
            </motion.div>
            <h3 className="text-5xl font-black text-white mb-6 leading-tight">
              The Eklavya Story
            </h3>
            <p className="text-2xl text-purple-100 mb-4 leading-relaxed max-w-3xl mx-auto">
              Eklavya learned archery without direct access to the master. He imagined guidance from Dronacharya's statue and became legendary.
            </p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 mb-10">
              You can't access tech legends directly. But their AI-powered virtual versions can be YOUR mentors — 24/7.
            </p>
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
              <p className="text-xl text-white mb-2">
                Built with <span className="font-bold text-cyan-300">Next.js 14</span> + <span className="font-bold text-orange-300">React</span> •
                Powered by <span className="font-bold text-purple-300">Claude Sonnet 4.5</span>
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                  <p className="text-sm font-semibold text-purple-200">
                    🏆 Built for Accel + Anthropic AI Dev Day Hackathon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
