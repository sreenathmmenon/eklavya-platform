# Eklavya - AI-Powered Education & Mentoring Platform

> **Learn AI • Compare Models • Virtual Mentorship**

---

## 🌟 The Story Behind Eklavya

In the ancient Indian epic Mahabharata, Eklavya learned archery by practicing in front of a statue of the legendary master Dronacharya. Without direct access to the guru, he became one of the greatest archers through dedication and self-learning.

**Today, you can't access tech legends directly. But their AI-powered virtual versions can be YOUR mentors — 24/7.**

---

## What Is This?

Eklavya is an interactive AI learning platform with three core features:

### 1. 📚 **Interactive Learning**
Learn AI concepts through hands-on lessons with real-time feedback:
- **Prompt Engineering Fundamentals**: Compare basic vs well-structured prompts side-by-side
- **RAG (Retrieval Augmented Generation)**: Paste your own documents and see how context improves AI responses
- **Claude API Integration**: Real-time token tracking, cost analysis, and production-ready examples

### 2. ⚖️ **Model Comparison Arena**
Compare up to 16 AI models in real-time with a single prompt:
- **Live API calls** to Anthropic, OpenAI, Google, Meta, Mistral, DeepSeek, Perplexity, Grok, Sarvam, and Ollama
- **Side-by-side responses** streaming in real-time
- **Performance charts** showing response time, cost, and token usage
- **Data-driven decisions** for choosing the right model for your use case

### 3. 🧠 **Virtual Mentorship**
Chat with AI personas of legendary tech leaders:
- **Jeff Dean** (Google Senior Fellow) - Distributed Systems, ML at Scale
- **Andrej Karpathy** (Ex-Tesla AI Director) - Deep Learning, Neural Networks
- **Arpit Bhayani** (System Design Expert) - Backend, Scalability
- **Linus Torvalds** (Creator of Linux & Git) - Open Source, Kernel Development
- **Kent Beck** (Creator of XP & TDD) - Software Craftsmanship
- **Paul Graham** (Y Combinator Co-founder) - Startups, Product
- **Reshma Saujani** (Girls Who Code Founder) - Diversity in Tech
- **Steve Ballmer** (Former Microsoft CEO) - Business & Tech Strategy
- **Shigeru Miyamoto** (Creator of Mario & Zelda) - Game Design, UX

---

## Why This Matters

### For Students & Developers
- **Free access** to learn from virtual versions of tech legends
- **Learn by comparing**: See how different prompts and models perform
- **Hands-on practice**: Interactive lessons with real AI APIs
- **Custom context**: Test RAG with your own documents

### For Enterprises
- **Evaluate AI models** in minutes, not weeks
- **Data-driven decisions**: See actual API responses, costs, and performance
- **Cost optimization**: Test prompts and models before production deployment
- **Training platform**: Educate teams on prompt engineering, RAG, and AI APIs

### For the Ecosystem
- **Democratizes AI education**: Anyone can learn and experiment
- **Transparent comparisons**: Real API responses, not marketing claims
- **Open access**: Test 16+ models without needing multiple API keys

---

## Tech Stack

### Frontend
- **Next.js 14** - App Router, React Server Components, TypeScript
- **Tailwind CSS** - Modern, responsive design with glassmorphism effects
- **Framer Motion** - Smooth animations and transitions
- **Monaco Editor** - VS Code-style code editor in browser

### Backend
- **Claude Sonnet 4.5** - Latest Anthropic model powering mentors and lessons
- **Next.js API Routes** - Serverless functions for AI integrations
- **Multiple AI Providers** - Anthropic, OpenAI, Google, Groq, and more

### Features
- **Real-time API calls** with live streaming responses
- **Token & cost tracking** for production planning
- **Custom RAG context** - paste any document
- **Markdown rendering** with syntax highlighting
- **Responsive design** - works on desktop, tablet, mobile

---

## Getting Started

### Prerequisites
- **Node.js 18+**
- **Anthropic API Key** - Get from [console.anthropic.com](https://console.anthropic.com)
- (Optional) Additional API keys for model comparison feature

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sreenathmmenon/eklavya-platform.git
cd eklavya-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Add your API keys to .env.local
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here (optional)
GEMINI_API_KEY=your_key_here (optional)

# 5. Run development server
npm run dev

# 6. Open browser
open http://localhost:3000
```

### Project Structure

```
eklavya-platform/
├── app/
│   ├── page.tsx              # Homepage
│   ├── learn/
│   │   └── page.tsx          # Learning dashboard with 3 interactive lessons
│   ├── mentors/
│   │   └── page.tsx          # Virtual mentor chat interface
│   ├── compare/
│   │   └── page.tsx          # Model comparison arena
│   └── api/
│       ├── chat/route.ts     # Claude chat with mentor personas
│       └── compare/route.ts  # Multi-model comparison API
├── components/
│   └── MarkdownRenderer.tsx  # Syntax highlighting for code blocks
└── README.md
```

---

## Key Features

### 1. **Learning Platform**
- **Prompt Engineering**: See how structured prompts improve responses
- **RAG Demo**: Paste your own context and ask questions about it
- **API Integration**: Real-time token counting and cost tracking
- **Example content**: Anthropic's AI candidate guidance pre-loaded

### 2. **Model Comparison**
- **16 models** from 10 providers compared side-by-side
- **Live charts** showing latency, cost, and token usage
- **Real API responses** (not simulations)
- **Select 2-16 models** to compare simultaneously

### 3. **Virtual Mentors**
- **9 legendary personalities** with unique teaching styles
- **Context-aware conversations** with history tracking
- **Markdown formatting** for code examples and explanations
- **Rotating display** on homepage (3 mentors shown at a time)

---

## Pricing

**Free for users** - You only pay for your own AI provider API usage:
- Anthropic Claude: ~$3-15 per 1M tokens
- OpenAI GPT-4: ~$5-15 per 1M tokens
- Google Gemini: ~$0.35-1 per 1M tokens

The platform itself has no subscription fees. Bring your own API keys and experiment freely.

---

## Use Cases

### For Learning
- **Students**: Learn prompt engineering, RAG, and AI APIs through hands-on practice
- **Developers**: Test different approaches before implementing in production
- **Educators**: Demonstrate AI concepts with live, interactive examples

### For Business
- **Model Selection**: Compare 16 models to find the best fit for your use case
- **Cost Optimization**: Test prompts to reduce token usage and API costs
- **Team Training**: Educate engineers on AI best practices
- **POC Development**: Prototype with different models quickly

### For Research
- **Benchmark Models**: Compare performance across providers
- **Prompt Testing**: A/B test different prompt structures
- **RAG Evaluation**: Test context injection strategies

---

## Roadmap

- [x] Interactive learning lessons (Prompt Engineering, RAG, Claude API)
- [x] 9 virtual mentor personalities
- [x] 16-model comparison arena
- [x] Real-time token & cost tracking
- [x] Custom RAG context input
- [ ] Multi-language support
- [ ] Advanced prompt patterns lessons
- [ ] Agent orchestration examples
- [ ] Code execution sandbox

---

## Contributing

This is currently a solo project, but contributions are welcome! Feel free to:
- Report bugs via GitHub Issues
- Suggest new features or mentor personalities
- Submit pull requests for improvements

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

Inspired by the timeless Eklavya story from the Mahabharata, this platform aims to democratize access to world-class AI education and mentorship.

Special thanks to the legendary tech leaders whose teaching styles inspired the virtual mentor personas.

---

**Learn AI • Compare Models • Virtual Mentorship**

*Built with Next.js 14 and Claude Sonnet 4.5*
