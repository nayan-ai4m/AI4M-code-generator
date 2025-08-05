import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🤖 Groq API route called");

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

    const groqApiKey = process.env.GROQ_API_KEY;

    console.log("🔑 Checking Groq API key:", {
      hasApiKey: !!groqApiKey,
      keyLength: groqApiKey?.length || 0,
      keyPrefix: groqApiKey?.substring(0, 7) + "..." || "none",
    });

    if (!groqApiKey) {
      console.error("❌ Groq API key not configured");
      return NextResponse.json(
        {
          error:
            "Groq API key not configured. Please add GROQ_API_KEY to your environment variables.",
        },
        { status: 500 }
      );
    }

    let systemPrompt = "";
    let modelName = "llama3-8b-8192";

    console.log("🎯 Determining system prompt for action:", action);

    if (action === "summarize") {
      console.log("📄 Using summarize system prompt");
      systemPrompt = `You are an expert technical writer. Analyze the provided document and create a structured prompt for code generation. Extract the key requirements, features, and technical specifications. Format the response as a clear, actionable prompt that a developer could use to build the described application.`;
    } else if (action === "enhance") {
      console.log("✨ Using enhance system prompt");
      systemPrompt = `You are an expert software architect. Enhance the provided prompt by adding technical specifications, best practices, accessibility requirements, performance considerations, and modern development standards. Make the prompt more detailed and actionable for code generation.`;
    } else if (action === "generate") {
      console.log("🔧 Using code generation system prompt");
      systemPrompt = `You are an expert full-stack developer. Generate complete, production-ready code based on the user's requirements.

IMPORTANT: Always format your response with proper markdown including:
- Use \`\`\`language code blocks for all code
- Include clear explanations before and after code blocks
- Use proper headings (##, ###) to organize your response
- Provide complete, working examples
- Include comments in your code explaining key functionality

Requirements:
- Write clean, modern code following best practices
- Include proper error handling and validation
- Make code responsive and accessible
- Use modern frameworks and libraries when appropriate
- Provide clear documentation and usage instructions`;
    } else if (action === "chat") {
      console.log("💬 Using chat system prompt");
      systemPrompt = `You are an expert AI assistant. You are helpful, harmless, and honest. Provide clear, accurate, and helpful responses to user questions. When discussing code or technical topics, use proper markdown formatting with code blocks. Be conversational but professional.`;
    } else if (action === "edit") {
      console.log("✏️ Using code editing system prompt");
      systemPrompt = `You are an expert code editor. The user will provide existing code and a modification request. Your task is to:

1. Understand the existing code structure and functionality
2. Apply the requested modifications while maintaining code quality
3. Provide the updated code with clear explanations of what changed
4. Use proper markdown formatting with code blocks
5. Explain the changes made and why they were necessary

Always format your response with:
- A brief explanation of the changes
- The updated code in proper markdown code blocks
- Comments highlighting the key modifications
- Any additional notes or recommendations`;
    } else {
      console.warn("⚠️ Unknown action provided:", action);
      systemPrompt = `You are an expert AI assistant. Provide helpful, accurate responses using proper markdown formatting.`;
    }

    console.log("🌐 Making request to Groq API...");
    console.log("🌐 Request payload:", {
      model: modelName,
      systemPromptLength: systemPrompt.length,
      userTextLength: text.length,
    });

    let response;
    try {
      response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
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
            stream: false,
          }),
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }
      );
    } catch (fetchError) {
      console.error("❌ Network error connecting to Groq API:", fetchError);
      return NextResponse.json(
        {
          error:
            "Unable to connect to Groq API. Please check your internet connection and try again.",
          details:
            fetchError instanceof Error ? fetchError.message : "Network error",
        },
        { status: 503 }
      );
    }

    console.log("🌐 Groq API response status:", response.status);
    console.log("🌐 Groq API response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Groq API request failed:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      return NextResponse.json(
        { error: "Groq API request failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("🌐 Groq API response received:", {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length || 0,
    });

    const processedText =
      data.choices[0]?.message?.content || "No response generated";

    console.log("✅ Returning processed text:", {
      processedTextLength: processedText.length,
      processedTextPreview: processedText.substring(0, 100) + "...",
    });

    return NextResponse.json({
      success: true,
      processedText,
    });
  } catch (error) {
    console.error("Groq API error:", error);
    console.error(
      "Groq API error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Handle specific Groq API errors
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      if (
        error.message.includes("API_KEY_INVALID") ||
        error.message.includes("401")
      ) {
        errorMessage = "Invalid Groq API key. Please check your configuration.";
      } else if (
        error.message.includes("QUOTA_EXCEEDED") ||
        error.message.includes("429")
      ) {
        errorMessage = "Groq API quota exceeded. Please try again later.";
      } else if (error.message.includes("model_decommissioned")) {
        errorMessage =
          "The requested model has been decommissioned. Please contact support.";
      } else if (
        error.message.includes("fetch failed") ||
        error.message.includes("SocketError")
      ) {
        errorMessage =
          "Network connection to Groq API failed. Please check your internet connection and try again.";
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
