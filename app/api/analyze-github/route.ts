import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { githubData } = await request.json();

    if (!githubData) {
      return NextResponse.json(
        { error: 'Missing GitHub data' },
        { status: 400 }
      );
    }

    const analysisPrompt = `You are an AI skill assessment expert. Analyze this developer's GitHub activity and provide a comprehensive AI readiness assessment.

GitHub Data:
${JSON.stringify(githubData, null, 2)}

Provide a detailed analysis in JSON format:
{
  "aiReadiness": {
    "score": <0-100>,
    "level": "<beginner|intermediate|advanced|expert>",
    "summary": "2-3 sentence summary of their AI readiness"
  },
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "gaps": [
    {
      "area": "gap area",
      "description": "what's missing",
      "recommendation": "how to improve"
    }
  ],
  "recommendedPath": {
    "startWeek": <1-12>,
    "focus": "what to focus on first",
    "estimatedTimeline": "how long to become proficient"
  },
  "topProjects": [
    {
      "name": "project name",
      "relevance": "why it's relevant to AI",
      "skills": ["skill1", "skill2"]
    }
  ]
}

Be specific, actionable, and encouraging.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: analysisPrompt,
      }],
    });

    const analysisText = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Try to parse JSON from response
    let analysis;
    try {
      // Handle markdown code blocks
      let jsonText = analysisText.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      // If JSON parsing fails, return raw text
      analysis = {
        raw: analysisText,
        error: 'Failed to parse structured response'
      };
    }

    return NextResponse.json({
      analysis,
      usage: response.usage,
    });

  } catch (error: any) {
    console.error('GitHub analysis API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
