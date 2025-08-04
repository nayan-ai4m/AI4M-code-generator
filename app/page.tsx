"use client";

import { useState } from "react";
import { Upload, FileText, Code, Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DocumentUpload } from "@/components/DocumentUpload";
import { PromptEditor } from "@/components/PromptEditor";
import { CodeGenerator } from "@/components/CodeGenerator";
import { ChatInterface } from "@/components/ChatInterface";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  console.log("🏠 Home component initialized");

  const [currentView, setCurrentView] = useState<"chat" | "legacy">("chat");
  const { toast } = useToast();

  console.log("🏠 Home component state:", {
    currentView,
  });

  const handleChatGenerate = (chatPrompt: string) => {
    console.log("💬 handleChatGenerate called with prompt:", chatPrompt);
    console.log("💬 Chat prompt length:", chatPrompt.length);

    try {
      setPrompt(chatPrompt);
      setEnhancedPrompt(chatPrompt);
      setCurrentStep("generate");
      console.log("✅ handleChatGenerate completed successfully");
    } catch (error) {
      console.error("❌ Error in handleChatGenerate:", error);
    }
  };
  const features = [
    {
      icon: Upload,
      title: "Smart Document Processing",
      description:
        "Upload PDFs, Word docs, or text files for intelligent summarization",
    },
    {
      icon: Sparkles,
      title: "AI Prompt Enhancement",
      description: "Groq API enhances your prompts for better code generation",
    },
    {
      icon: Code,
      title: "Claude Code Generation",
      description:
        "Advanced AI generates production-ready code from your prompts",
    },
    {
      icon: FileText,
      title: "Live Code Preview & Editing",
      description: "Stackblitz integration for real-time editing and testing",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            AI For Solutions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into production-ready code with intelligent
            document processing, prompt enhancement, and real-time preview
            capabilities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Interface */}
        <div className="max-w-6xl mx-auto">
          {/* View Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={currentView === "chat" ? "default" : "outline"}
              onClick={() => setCurrentView("chat")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              AI Chat Assistant
            </Button>
            <Button
              variant={currentView === "legacy" ? "default" : "outline"}
              onClick={() => setCurrentView("legacy")}
              className="flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Legacy Mode
            </Button>
          </div>

          {currentView === "chat" ? (
            <ChatInterface onGenerateCode={handleChatGenerate} />
          ) : (
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Legacy Mode</CardTitle>
                <CardDescription>
                  Traditional step-by-step code generation workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Legacy mode functionality can be implemented here if needed.
                </p>
                <Button
                  onClick={() => setCurrentView("chat")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Try New Chat Interface
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p className="mb-2">Powered by Google Gemini and Stackblitz</p>
        </footer>
      </div>
    </div>
  );
}
