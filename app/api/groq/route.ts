import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🧠 Groq API route called');

  try {
    const { text, action } = await request.json();

    console.log('📝 Received request:', {
      textLength: text?.length || 0,
      action,
      textPreview: text?.substring(0, 100) + '...' || 'No text'
    });

    if (!text || !action) {
      console.error('❌ Missing required parameters:', { hasText: !!text, hasAction: !!action });
      return NextResponse.json(
        { error: 'Text and action are required' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    console.log('🔑 Checking Groq API key:', {
      hasApiKey: !!groqApiKey,
      keyLength: groqApiKey?.length || 0
    });

    if (!groqApiKey) {
      console.error('❌ Groq API key not configured');
      return NextResponse.json(
        { error: 'Groq API key not configured. Please add GROQ_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    let systemPrompt = '';

    console.log('🎯 Determining system prompt for action:', action);

    if (action === 'summarize') {
      console.log('📄 Using summarize system prompt');
      systemPrompt = `You are an expert technical writer. Analyze the provided document and create a structured prompt for code generation. Extract the key requirements, features, and technical specifications. Format the response as a clear, actionable prompt that a developer could use to build the described application.`;
    } else if (action === 'enhance') {
      console.log('✨ Using enhance system prompt');
      systemPrompt = `You are an expert software architect. Enhance the provided prompt by adding technical specifications, best practices, accessibility requirements, performance considerations, and modern development standards. Make the prompt more detailed and actionable for code generation.`;
    } else {
      console.warn('⚠️ Unknown action provided:', action);
    }

    console.log('🌐 Making request to Groq API...');
    console.log('🌐 Request payload:', {
      model: 'mixtral-8x7b-32768',
      max_tokens: 2000,
      temperature: 0.7,
      systemPromptLength: systemPrompt.length,
      userTextLength: text.length
    });

    // Groq API endpoint
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    console.log('🌐 Groq API response status:', response.status);
    console.log('🌐 Groq API response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Groq API request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      return NextResponse.json(
        { error: 'Groq API request failed', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Groq API response received:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length || 0,
      messageLength: data.choices?.[0]?.message?.content?.length || 0
    });

    const processedText = data.choices[0].message.content;

    console.log('✅ Returning processed text:', {
      processedTextLength: processedText.length,
      processedTextPreview: processedText.substring(0, 100) + '...'
    });

    return NextResponse.json({
      success: true,
      processedText
    });

  } catch (error) {
    console.error('Groq API error:', error);
    console.error('Groq API error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}