import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

// Provider clients will be initialized with user's API keys
function getAnthropicClient(apiKey?: string) {
  return new Anthropic({
    apiKey: apiKey || process.env.ANTHROPIC_API_KEY || '',
  });
}

function getOpenAIClient(apiKey?: string) {
  return new OpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY || '',
  });
}

function getGoogleClient(apiKey?: string) {
  return new GoogleGenerativeAI(apiKey || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '');
}

function getGroqClient(apiKey?: string) {
  return new Groq({
    apiKey: apiKey || process.env.GROQ_API_KEY || '',
  });
}

export async function POST(request: NextRequest) {
  try {
    const { modelId, prompt } = await request.json();

    if (!modelId || !prompt) {
      return NextResponse.json(
        { error: 'Missing modelId or prompt' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Route to appropriate provider (API keys from .env)
    if (modelId.includes('claude')) {
      return await handleAnthropicRequest(modelId, prompt, undefined, startTime);
    } else if (modelId.includes('gpt')) {
      return await handleOpenAIRequest(modelId, prompt, undefined, startTime);
    } else if (modelId.includes('gemini')) {
      return await handleGoogleRequest(modelId, prompt, undefined, startTime);
    } else if (modelId.includes('llama')) {
      return await handleGroqRequest(modelId, prompt, undefined, startTime);
    } else if (modelId.includes('mistral')) {
      return await handleMistralRequest(modelId, prompt, undefined, startTime);
    } else if (modelId.includes('deepseek')) {
      return await handleDeepSeekRequest(modelId, prompt, undefined, startTime);
    } else if (modelId.includes('sonar')) {
      return await handlePerplexityRequest(modelId, prompt, undefined, startTime);
    } else if (modelId.includes('grok')) {
      return await handleGrokRequest(modelId, prompt, undefined, startTime);
    } else if (modelId.includes('sarvam')) {
      return await handleSarvamRequest(modelId, prompt, undefined, startTime);
    } else if (modelId.includes('ollama') || modelId.includes('granite') || modelId.includes('llama3.2')) {
      return await handleOllamaRequest(modelId, prompt, undefined, startTime);
    }

    return NextResponse.json(
      { error: 'Unsupported model' },
      { status: 400 }
    );

  } catch (error: unknown) {
    console.error('Compare API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

async function handleAnthropicRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    const client = getAnthropicClient(apiKey);

    const modelMap: { [key: string]: string } = {
      'claude-sonnet-4': 'claude-sonnet-4-5-20250929',
      'claude-3-5-sonnet': 'claude-3-5-sonnet-20241022'
    };

    const actualModel = modelMap[modelId] || 'claude-sonnet-4-5-20250929';

    const response = await client.messages.create({
      model: actualModel,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }],
    });

    const text = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: response.usage.output_tokens,
      inputTokens: response.usage.input_tokens,
    });

  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };
    if (err.status === 401 || err.message?.includes('api_key')) {
      return NextResponse.json({
        error: 'ANTHROPIC_API_KEY_REQUIRED',
        message: 'Please add your Anthropic API key in settings to use Claude models'
      }, { status: 401 });
    }
    throw error;
  }
}

async function handleOpenAIRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    const client = getOpenAIClient(apiKey);

    const modelMap: { [key: string]: string } = {
      'gpt-4o': 'gpt-4o',
      'gpt-4-turbo': 'gpt-4-turbo-preview'
    };

    const actualModel = modelMap[modelId] || 'gpt-4o';

    const response = await client.chat.completions.create({
      model: actualModel,
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 1024,
    });

    const text = response.choices[0]?.message?.content || '';
    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: response.usage?.completion_tokens || 0,
      inputTokens: response.usage?.prompt_tokens || 0,
    });

  } catch (error: unknown) {
    const err = error as { status?: number; code?: string };
    if (err.status === 401 || err.code === 'invalid_api_key') {
      return NextResponse.json({
        error: 'OPENAI_API_KEY_REQUIRED',
        message: 'Please add your OpenAI API key in settings to use GPT models'
      }, { status: 401 });
    }
    throw error;
  }
}

async function handleGoogleRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    const genAI = getGoogleClient(apiKey);

    const modelMap: { [key: string]: string } = {
      'gemini-2-0-flash': 'gemini-2.0-flash-exp',
      'gemini-2-5-flash': 'gemini-2.5-flash'
    };

    const actualModel = modelMap[modelId] || 'gemini-2.0-flash-exp';
    const model = genAI.getGenerativeModel({ model: actualModel });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: response.usageMetadata?.candidatesTokenCount || text.split(' ').length,
      inputTokens: response.usageMetadata?.promptTokenCount || prompt.split(' ').length,
    });

  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    if (err.message?.includes('API_KEY') || err.status === 400) {
      return NextResponse.json({
        error: 'GOOGLE_API_KEY_REQUIRED',
        message: 'Please add your Google AI API key in settings to use Gemini models'
      }, { status: 401 });
    }
    throw error;
  }
}

async function handleGroqRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    const client = getGroqClient(apiKey);

    const modelMap: { [key: string]: string } = {
      'llama-3-1-70b': 'llama-3.3-70b-versatile',
      'llama-3-1-8b': 'llama-3.1-8b-instant'
    };

    const actualModel = modelMap[modelId] || 'llama-3.3-70b-versatile';

    const response = await client.chat.completions.create({
      model: actualModel,
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 1024,
    });

    const text = response.choices[0]?.message?.content || '';
    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: response.usage?.completion_tokens || 0,
      inputTokens: response.usage?.prompt_tokens || 0,
    });

  } catch (error: unknown) {
    const err = error as { status?: number; error?: { message?: string } };
    if (err.status === 401 || err.error?.message?.includes('API')) {
      return NextResponse.json({
        error: 'GROQ_API_KEY_REQUIRED',
        message: 'Please add your Groq API key in settings to use Llama models'
      }, { status: 401 });
    }
    throw error;
  }
}

async function handleMistralRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    // Using OpenAI-compatible endpoint for Mistral
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({
          error: 'MISTRAL_API_KEY_REQUIRED',
          message: 'Please add your Mistral API key in settings'
        }, { status: 401 });
      }
      throw new Error(`Mistral API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';
    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: data.usage?.completion_tokens || 0,
      inputTokens: data.usage?.prompt_tokens || 0,
    });

  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes('401')) {
      return NextResponse.json({
        error: 'MISTRAL_API_KEY_REQUIRED',
        message: 'Please add your Mistral API key in settings'
      }, { status: 401 });
    }
    throw error;
  }
}

async function handleDeepSeekRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({
          error: 'DEEPSEEK_API_KEY_REQUIRED',
          message: 'Please add your DeepSeek API key in settings'
        }, { status: 401 });
      }
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';
    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: data.usage?.completion_tokens || 0,
      inputTokens: data.usage?.prompt_tokens || 0,
    });

  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes('401')) {
      return NextResponse.json({
        error: 'DEEPSEEK_API_KEY_REQUIRED',
        message: 'Please add your DeepSeek API key in settings'
      }, { status: 401 });
    }
    throw error;
  }
}

async function handlePerplexityRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    // Perplexity uses OpenAI-compatible API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      if (response.status === 401) {
        return NextResponse.json({
          error: 'PERPLEXITY_API_KEY_REQUIRED',
          message: 'Please add your Perplexity API key to .env.local'
        }, { status: 401 });
      }
      throw new Error(`Perplexity API error: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';
    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: data.usage?.completion_tokens || 0,
      inputTokens: data.usage?.prompt_tokens || 0,
    });

  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes('401')) {
      return NextResponse.json({
        error: 'PERPLEXITY_API_KEY_REQUIRED',
        message: 'Please add your Perplexity API key to .env.local'
      }, { status: 401 });
    }
    throw error;
  }
}

async function handleGrokRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    // Grok (X.AI) uses OpenAI-compatible API
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.GROK_API_KEY || process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-2-1212',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      if (response.status === 401) {
        return NextResponse.json({
          error: 'GROK_API_KEY_REQUIRED',
          message: 'Please add your Grok (X.AI) API key to .env.local'
        }, { status: 401 });
      }
      throw new Error(`Grok API error: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';
    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: data.usage?.completion_tokens || 0,
      inputTokens: data.usage?.prompt_tokens || 0,
    });

  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes('401')) {
      return NextResponse.json({
        error: 'GROK_API_KEY_REQUIRED',
        message: 'Please add your Grok (X.AI) API key to .env.local'
      }, { status: 401 });
    }
    throw error;
  }
}

async function handleSarvamRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    // Sarvam AI API
    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.SARVAM_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      if (response.status === 401) {
        return NextResponse.json({
          error: 'SARVAM_API_KEY_REQUIRED',
          message: 'Please add your Sarvam AI API key to .env.local'
        }, { status: 401 });
      }
      throw new Error(`Sarvam API error: ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';
    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: data.usage?.completion_tokens || 0,
      inputTokens: data.usage?.prompt_tokens || 0,
    });

  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes('401')) {
      return NextResponse.json({
        error: 'SARVAM_API_KEY_REQUIRED',
        message: 'Please add your Sarvam AI API key to .env.local'
      }, { status: 401 });
    }
    throw error;
  }
}

async function handleOllamaRequest(modelId: string, prompt: string, apiKey: string | undefined, startTime: number) {
  try {
    // Ollama runs locally - default to localhost:11434
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

    const modelMap: { [key: string]: string } = {
      'ollama-llama3.2': 'llama3.2:latest',
      'ollama-granite': 'granite-code:8b'
    };

    const actualModel = modelMap[modelId] || 'llama3.2:latest';

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: actualModel,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 500) {
        return NextResponse.json({
          error: 'OLLAMA_NOT_RUNNING',
          message: 'Ollama is not running. Start it with: ollama serve'
        }, { status: 503 });
      }
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.response || '';
    const latency = Date.now() - startTime;

    return NextResponse.json({
      text,
      latency,
      tokens: text.split(' ').length,
      inputTokens: prompt.split(' ').length,
    });

  } catch (error: unknown) {
    const err = error as Error;
    if (err.message?.includes('ECONNREFUSED') || err.message?.includes('fetch failed')) {
      return NextResponse.json({
        error: 'OLLAMA_NOT_RUNNING',
        message: 'Ollama is not running locally. Start it with: ollama serve'
      }, { status: 503 });
    }
    throw error;
  }
}
