import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  console.log("🤖 OpenAI GPT-4 API route called");

  try {
    const { text, action } = await request.json();

    console.log("📝 Received request:", {
      textLength: text?.length || 0,
      action,
      textPreview: text?.substring(0, 100) + "..." || "No text",
    });

    if (!text || !action) {
      console.error("❌ Missing required parameters:", {
        hasText: !!text,
        hasAction: !!action,
      });
      return NextResponse.json(
        { error: "Text and action are required" },
        { status: 400 }
      );
    }

    const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;

    console.log("🔑 Checking Azure OpenAI credentials:", {
      hasApiKey: !!azureApiKey,
      hasEndpoint: !!azureEndpoint,
    });

    if (!azureApiKey || !azureEndpoint) {
      console.error("❌ Azure OpenAI credentials not configured");
      return NextResponse.json(
        {
          error:
            "Azure OpenAI credentials not configured. Please add AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT to your environment variables.",
        },
        { status: 500 }
      );
    }

    // Initialize OpenAI client with Azure configuration
    const openai = new OpenAI({
      apiKey: azureApiKey,
      baseURL: `${azureEndpoint}/openai/deployments/gpt-4.1`,
      defaultQuery: { "api-version": "2025-01-01-preview" },
      defaultHeaders: { "api-key": azureApiKey },
    });

    let systemPrompt = "";
    let model = "gpt-4"; // Using GPT-4

    console.log("🎯 Determining system prompt for action:", action);

    if (action === "summarize") {
      console.log("📄 Using summarize system prompt");
      systemPrompt = `You are an expert technical writer. Analyze the provided document and create a structured prompt for code generation. Extract the key requirements, features, and technical specifications. Format the response as a clear, actionable prompt that a developer could use to build the described application.`;
    } else if (action === "enhance") {
      console.log("✨ Using enhance system prompt");
      systemPrompt = `You are an expert software architect. Enhance the provided prompt by adding technical specifications, best practices, accessibility requirements, performance considerations, and modern development standards. Make the prompt more detailed and actionable for code generation.`;
    } else if (action === "generate") {
      console.log("🔧 Using code generation system prompt");
      systemPrompt = `You are an expert full-stack developer specializing in modern web development. Generate complete, production-ready code based on the user's requirements.

CRITICAL: You MUST return your response as a valid JSON object with this EXACT structure:
{
  "files": {
    "package.json": "file content here",
    "next.config.js": "file content here", 
    "tailwind.config.js": "file content here",
    "postcss.config.js": "file content here",
    "tsconfig.json": "file content here",
    "app/layout.tsx": "file content here",
    "app/page.tsx": "file content here",
    "app/globals.css": "file content here",
    "components/ComponentName.tsx": "file content here",
    "README.md": "file content here"
  },
  "description": "Brief description of what was built",
  "stackblitzConfig": {
    "title": "Project Title",
    "description": "Project description",
    "template": "nextjs"
  }
}

Requirements:
- Use Next.js 14 with App Router and TypeScript
- Use Tailwind CSS for styling with modern design
- Create responsive, accessible components
- Include proper error handling and loading states
- Generate clean, well-commented code
- Include all necessary configuration files
- Make it production-ready with best practices
- Ensure all files have complete, working content

IMPORTANT: Your response must be ONLY the JSON object, no additional text or markdown formatting.`;
    } else if (action === "chat") {
      console.log("💬 Using chat system prompt");
      systemPrompt = `You are GPT-4, an advanced AI assistant. You are helpful, knowledgeable, and provide clear, accurate responses. When discussing code or technical topics, use proper markdown formatting with code blocks. Be conversational but professional, and provide detailed explanations when helpful.`;
    } else if (action === "edit") {
      console.log("✏️ Using code editing system prompt");
      systemPrompt = `You are an expert code editor using GPT-4. The user will provide existing code and a modification request. Your task is to:

1. Understand the existing code structure and functionality
2. Apply the requested modifications while maintaining code quality
3. Return the response as a JSON object with the updated files
4. Use proper markdown formatting in explanations

CRITICAL: Return your response as a valid JSON object:
{
  "files": {
    "filename.ext": "updated file content"
  },
  "explanation": "Brief explanation of changes made",
  "changes": ["list of key changes"]
}

Always format your response with:
- Complete updated code files
- Clear explanations of modifications
- Comments highlighting key changes`;
    } else {
      console.warn("⚠️ Unknown action provided:", action);
      systemPrompt = `You are GPT-4, an advanced AI assistant. Provide helpful, accurate responses using proper markdown formatting when appropriate.`;
    }

    console.log("🌐 Making request to OpenAI API...");
    console.log("🌐 Request payload:", {
      model,
      systemPromptLength: systemPrompt.length,
      userTextLength: text.length,
    });

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
      top_p: 1,
    });

    console.log("🌐 OpenAI API response received:", {
      hasChoices: !!completion.choices,
      choicesLength: completion.choices?.length || 0,
    });

    const processedText =
      completion.choices[0]?.message?.content || "No response generated";

    console.log("✅ Returning processed text:", {
      processedTextLength: processedText.length,
      processedTextPreview: processedText.substring(0, 100) + "...",
    });

    return NextResponse.json({
      success: true,
      processedText,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    console.error(
      "OpenAI API error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Handle specific OpenAI API errors
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage =
          "Invalid OpenAI API key. Please check your configuration.";
      } else if (
        error.message.includes("quota") ||
        error.message.includes("429")
      ) {
        errorMessage = "OpenAI API quota exceeded. Please try again later.";
      } else if (error.message.includes("model")) {
        errorMessage =
          "The requested model is not available. Please contact support.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Network connection to OpenAI API failed. Please check your internet connection and try again.";
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
