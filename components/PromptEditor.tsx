"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Edit3,
  Save,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface PromptEditorProps {
  initialPrompt: string;
  onSubmit: (prompt: string) => void;
  onBack: () => void;
}

export function PromptEditor({
  initialPrompt,
  onSubmit,
  onBack,
}: PromptEditorProps) {
  console.log("✏️ PromptEditor component initialized with:", {
    initialPromptLength: initialPrompt.length,
    initialPromptPreview: initialPrompt.substring(0, 100) + "...",
  });

  const [prompt, setPrompt] = useState(initialPrompt);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [hasEnhanced, setHasEnhanced] = useState(false);
  const { toast } = useToast();

  console.log("✏️ PromptEditor state:", {
    promptLength: prompt.length,
    isEnhancing,
    hasEnhanced,
  });

  const enhancePrompt = async () => {
    console.log("🚀 enhancePrompt called");
    console.log(
      "🚀 Current prompt before enhancement:",
      prompt.substring(0, 100) + "..."
    );

    setIsEnhancing(true);

    try {
      console.log("🤖 Starting Groq API enhancement...");
      
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt,
          action: 'enhance'
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('🤖 Groq API response received:', data);

      const enhancedPrompt = data.processedText || prompt;

      console.log('✅ Enhanced prompt generated:', enhancedPrompt.substring(0, 100) + '...');
      console.log('📊 Enhanced prompt length:', enhancedPrompt.length);

      setPrompt(enhancedPrompt);
      setHasEnhanced(true);

      console.log('✅ Prompt state updated, hasEnhanced set to true');

      toast({
        title: 'Prompt enhanced successfully',
        description: 'Your prompt has been optimized using Groq Llama.',
      });
    } catch (error) {
      console.error('❌ Error in enhancePrompt:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Fallback to mock enhancement if API fails
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock enhanced prompt as fallback
      const enhancedPrompt = `${prompt}

## Enhanced Requirements:

### Technical Specifications:
- Use modern React with TypeScript and functional components
- Implement proper error boundaries and loading states
- Follow WCAG accessibility guidelines
- Ensure mobile-first responsive design
- Include comprehensive PropTypes or TypeScript interfaces

### Code Quality:
- Write clean, modular, and well-commented code
- Follow consistent naming conventions
- Implement proper separation of concerns
- Include basic unit tests with Jest/React Testing Library

### Styling & UX:
- Use Tailwind CSS for styling with design system approach
- Implement smooth transitions and micro-interactions
- Follow modern UI/UX best practices
- Ensure cross-browser compatibility

### Performance:
- Optimize for Core Web Vitals
- Implement lazy loading where appropriate
- Minimize bundle size and optimize assets
- Use proper React optimization techniques (memo, useMemo, useCallback)

Please generate production-ready code that follows these enhanced specifications.`;

      console.log(
        "✅ Enhanced prompt generated:",
        enhancedPrompt.substring(0, 100) + "..."
      );
      console.log("📊 Enhanced prompt length:", enhancedPrompt.length);

      setPrompt(enhancedPrompt);
      setHasEnhanced(true);

      toast({
        title: 'Enhancement completed with fallback',
        description: 'Used fallback enhancement. Please check your Groq API configuration.',
        variant: 'destructive'
      });
    } finally {
      setIsEnhancing(false);
      console.log("🚀 enhancePrompt completed, isEnhancing set to false");
    }
  };

  const handleSubmit = () => {
    console.log("📤 handleSubmit called");
    console.log("📤 Current prompt:", prompt.substring(0, 100) + "...");

    if (!prompt.trim()) {
      console.warn("⚠️ Empty prompt detected");
      toast({
        title: "Empty prompt",
        description: "Please provide a prompt before proceeding.",
        variant: "destructive",
      });
      return;
    }

    console.log("✅ Prompt validation passed, calling onSubmit");
    onSubmit(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mb-8">
        <Badge variant="outline">1. Input</Badge>
        <Badge variant="default">2. Edit</Badge>
        <Badge variant="outline">3. Generate</Badge>
      </div>

      <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Edit3 className="w-6 h-6" />
                Edit Your Prompt
              </CardTitle>
              <CardDescription>
                Review and refine your prompt before generating code.
                {!hasEnhanced &&
                  " Click 'Enhance' for AI-powered improvements."}
              </CardDescription>
            </div>
            {hasEnhanced && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Enhanced
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Prompt Editor */}
          <div className="space-y-4">
            <label
              htmlFor="prompt"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Code Generation Prompt
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => {
                console.log(
                  "📝 Prompt textarea changed, new length:",
                  e.target.value.length
                );
                setPrompt(e.target.value);
              }}
              style={{
                minHeight: "5rem",
                maxHeight: "10rem",
                height: `${Math.min(
                  400,
                  24 +
                    prompt.split("\n").length * 24 +
                    Math.floor(prompt.length / 60) * 24
                )}px`,
                overflow: "auto",
              }}
              placeholder="Describe what you want to build..."
              className="text-base leading-relaxed"
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{prompt.length} characters</span>
              <span>
                {prompt.split(/\s+/).filter((word) => word.length > 0).length}{" "}
                words
              </span>
            </div>
          </div>

          {/* Enhancement Panel */}
          {!hasEnhanced && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                        AI Enhancement Available
                      </h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Let our AI add technical specifications and best
                        practices to your prompt
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      console.log("🔘 Enhance button clicked");
                      enhancePrompt();
                    }}
                    disabled={isEnhancing}
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
                  >
                    {isEnhancing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Enhance
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                console.log("🔙 Back button clicked");
                onBack();
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={() => {
                console.log("🔘 Generate Code button clicked");
                handleSubmit();
              }}
              disabled={!prompt.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Generate Code
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
            💡 Tips for Better Code Generation
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Be specific about the technology stack you want to use</li>
            <li>
              • Include details about styling preferences and UI requirements
            </li>
            <li>• Mention any specific features or functionality you need</li>
            <li>
              • Specify if you need responsive design or accessibility features
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
