import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  console.log('🤖 Gemini API route called');

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

    const geminiApiKey = process.env.GEMINI_API_KEY;

    console.log('🔑 Checking Gemini API key:', {
      hasApiKey: !!geminiApiKey,
      keyLength: geminiApiKey?.length || 0
    });

    if (!geminiApiKey) {
      console.error('❌ Gemini API key not configured');
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    
    let systemPrompt = '';
    let modelName = 'gemini-pro';

    console.log('🎯 Determining system prompt for action:', action);

    if (action === 'summarize') {
      console.log('📄 Using summarize system prompt');
      systemPrompt = `You are an expert technical writer. Analyze the provided document and create a structured prompt for code generation. Extract the key requirements, features, and technical specifications. Format the response as a clear, actionable prompt that a developer could use to build the described application.`;
    } else if (action === 'enhance') {
      console.log('✨ Using enhance system prompt');
      systemPrompt = `You are an expert software architect. Enhance the provided prompt by adding technical specifications, best practices, accessibility requirements, performance considerations, and modern development standards. Make the prompt more detailed and actionable for code generation.`;
    } else if (action === 'generate') {
      console.log('🔧 Using code generation system prompt');
      modelName = 'gemini-pro'; // Use Gemini Pro for code generation
      systemPrompt = `You are an expert Next.js developer. Generate a complete, production-ready Next.js 14 application with TypeScript and Tailwind CSS based on the user's requirements.

IMPORTANT: Return your response as a JSON object with this exact structure:
{
  "files": {
    "package.json": "file content here",
    "next.config.js": "file content here",
    "tailwind.config.js": "file content here",
    "app/layout.tsx": "file content here",
    "app/page.tsx": "file content here",
    "app/globals.css": "file content here",
    "components/ComponentName.tsx": "file content here"
  },
  "description": "Brief description of what was built"
}

Requirements:
- Use Next.js 14 with App Router
- TypeScript for all components
- Tailwind CSS for styling
- Modern React patterns (hooks, functional components)
- Responsive design
- Proper file structure
- Include all necessary configuration files`;
    } else if (action === 'chat') {
      console.log('💬 Using chat system prompt');
      systemPrompt = `You are an expert AI coding assistant. Help users with their programming questions, provide code examples, explain concepts, and assist with debugging. Be helpful, clear, and provide practical solutions. If asked to generate code, provide complete, working examples with proper explanations.`;
    } else {
      console.warn('⚠️ Unknown action provided:', action);
    }

    console.log('🌐 Making request to Gemini API...');
    console.log('🌐 Request payload:', {
      model: modelName,
      systemPromptLength: systemPrompt.length,
      userTextLength: text.length
    });

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: modelName });

    // Combine system prompt with user text
    const fullPrompt = `${systemPrompt}\n\nUser Request: ${text}`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const processedText = response.text();

    console.log('🌐 Gemini API response received:', {
      hasResponse: !!processedText,
      responseLength: processedText?.length || 0
    });

    console.log('✅ Returning processed text:', {
      processedTextLength: processedText.length,
      processedTextPreview: processedText.substring(0, 100) + '...'
    });

    return NextResponse.json({
      success: true,
      processedText
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    console.error('Gemini API error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Handle specific Gemini API errors
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        errorMessage = 'Invalid Gemini API key. Please check your configuration.';
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        errorMessage = 'Gemini API quota exceeded. Please try again later.';
      } else if (error.message.includes('SAFETY')) {
        errorMessage = 'Content was blocked by Gemini safety filters. Please modify your request.';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}