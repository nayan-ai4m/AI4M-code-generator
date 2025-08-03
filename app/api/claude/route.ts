import { NextRequest, NextResponse } from 'next/server';

// Note: Add your Claude API key to your environment variables
// CLAUDE_API_KEY=your_claude_api_key_here

export async function POST(request: NextRequest) {
  console.log('🤖 Claude API route called');
  
  try {
    const { prompt } = await request.json();
    
    console.log('📝 Received prompt:', {
      promptLength: prompt?.length || 0,
      promptPreview: prompt?.substring(0, 100) + '...' || 'No prompt'
    });
    
    if (!prompt) {
      console.error('❌ No prompt provided in request');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const claudeApiKey = process.env.CLAUDE_API_KEY;
    
    console.log('🔑 Checking Claude API key:', {
      hasApiKey: !!claudeApiKey,
      keyLength: claudeApiKey?.length || 0
    });
    
    if (!claudeApiKey) {
      console.error('❌ Claude API key not configured');
      return NextResponse.json(
        { error: 'Claude API key not configured. Please add CLAUDE_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    console.log('🌐 Making request to Claude API...');
    console.log('🌐 Request payload:', {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messageLength: prompt.length
    });
    
    // Claude API endpoint
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `You are an expert web developer. Generate clean, production-ready HTML, CSS, and JavaScript code based on this prompt:

${prompt}

Please provide:
1. Complete HTML structure with semantic markup
2. Modern CSS with responsive design and animations
3. Interactive JavaScript with proper error handling
4. Comments explaining key functionality
5. Accessibility features (ARIA labels, proper contrast, keyboard navigation)

Format your response as JSON with 'html', 'css', and 'js' keys.`
        }]
      })
    });

    console.log('🌐 Claude API response status:', response.status);
    console.log('🌐 Claude API response ok:', response.ok);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Claude API request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      return NextResponse.json(
        { error: 'Claude API request failed', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Claude API response received:', {
      hasContent: !!data.content,
      contentLength: data.content?.[0]?.text?.length || 0
    });
    
    const generatedContent = data.content[0].text;

    // Parse the generated content to extract HTML, CSS, and JS
    // This is a simplified parser - in production, you'd want more robust parsing
    let parsedCode;
    try {
      parsedCode = JSON.parse(generatedContent);
      console.log('✅ Successfully parsed JSON response');
    } catch (parseError) {
      console.warn('⚠️ Failed to parse JSON, using fallback format:', parseError);
      // If JSON parsing fails, return the raw content
      parsedCode = {
        html: generatedContent,
        css: '/* Add your CSS here */',
        js: '// Add your JavaScript here'
      };
    }

    console.log('✅ Returning parsed code:', {
      htmlLength: parsedCode.html?.length || 0,
      cssLength: parsedCode.css?.length || 0,
      jsLength: parsedCode.js?.length || 0
    });
    
    return NextResponse.json({
      success: true,
      code: parsedCode
    });

  } catch (error) {
    console.error('Claude API error:', error);
    console.error('Claude API error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}