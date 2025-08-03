'use client';

import { useState } from 'react';
import { Upload, FileText, Code, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DocumentUpload } from '@/components/DocumentUpload';
import { PromptEditor } from '@/components/PromptEditor';
import { CodeGenerator } from '@/components/CodeGenerator';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  console.log('🏠 Home component initialized');
  
  const [currentStep, setCurrentStep] = useState<'input' | 'edit' | 'generate'>('input');
  const [inputType, setInputType] = useState<'text' | 'document'>('text');
  const [prompt, setPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  console.log('🏠 Home component state:', {
    currentStep,
    inputType,
    promptLength: prompt.length,
    enhancedPromptLength: enhancedPrompt.length,
    isProcessing
  });

  const handlePromptSubmit = async (userPrompt: string) => {
    console.log('📝 handlePromptSubmit called with prompt:', userPrompt);
    console.log('📝 Prompt length:', userPrompt.length);
    
    try {
      setPrompt(userPrompt);
      setEnhancedPrompt(userPrompt);
      setCurrentStep('edit');
      console.log('✅ handlePromptSubmit completed successfully');
    } catch (error) {
      console.error('❌ Error in handlePromptSubmit:', error);
    }
  };

  const handleDocumentProcess = async (processedPrompt: string) => {
    console.log('📄 handleDocumentProcess called with processed prompt:', processedPrompt);
    console.log('📄 Processed prompt length:', processedPrompt.length);
    
    try {
      setEnhancedPrompt(processedPrompt);
      setCurrentStep('edit');
      console.log('✅ handleDocumentProcess completed successfully');
    } catch (error) {
      console.error('❌ Error in handleDocumentProcess:', error);
    }
  };

  const handlePromptEdit = (editedPrompt: string) => {
    console.log('✏️ handlePromptEdit called with edited prompt:', editedPrompt);
    console.log('✏️ Edited prompt length:', editedPrompt.length);
    
    try {
      setEnhancedPrompt(editedPrompt);
      setCurrentStep('generate');
      console.log('✅ handlePromptEdit completed successfully');
    } catch (error) {
      console.error('❌ Error in handlePromptEdit:', error);
    }
  };

  const features = [
    {
      icon: Upload,
      title: 'Smart Document Processing',
      description: 'Upload PDFs, Word docs, or text files for intelligent summarization'
    },
    {
      icon: Sparkles,
      title: 'AI Prompt Enhancement',
      description: 'Groq API enhances your prompts for better code generation'
    },
    {
      icon: Code,
      title: 'Claude Code Generation',
      description: 'Advanced AI generates production-ready code from your prompts'
    },
    {
      icon: FileText,
      title: 'Live Code Preview',
      description: 'Stackblitz integration for real-time editing and testing'
    }
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
            AI Code Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into production-ready code with intelligent document processing, 
            prompt enhancement, and real-time preview capabilities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
        <div className="max-w-4xl mx-auto">
          {currentStep === 'input' && (
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <CardDescription>
                  Choose how you'd like to input your requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Type Selection */}
                <div className="flex justify-center gap-4 mb-6">
                  <Button
                    variant={inputType === 'text' ? 'default' : 'outline'}
                    onClick={() => {
                      console.log('🔘 Text input type selected');
                      setInputType('text');
                    }}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Text Prompt
                  </Button>
                  <Button
                    variant={inputType === 'document' ? 'default' : 'outline'}
                    onClick={() => {
                      console.log('🔘 Document input type selected');
                      setInputType('document');
                    }}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </Button>
                </div>

                {inputType === 'text' ? (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Describe what you want to build... (e.g., 'Create a React component for a user profile card with avatar, name, and social links')"
                      value={prompt}
                      onChange={(e) => {
                        console.log('📝 Prompt textarea changed:', e.target.value);
                        setPrompt(e.target.value);
                      }}
                      className="min-h-32 text-base"
                    />
                    <Button
                      onClick={() => handlePromptSubmit(prompt)}
                      disabled={!prompt.trim()}
                      onClick={() => {
                        console.log('🔘 Enhance Prompt button clicked');
                        console.log('🔘 Current prompt:', prompt);
                        handlePromptSubmit(prompt);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Enhance Prompt
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <DocumentUpload onProcessed={handleDocumentProcess} />
                )}

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                  <Badge variant="default">1. Input</Badge>
                  <Badge variant="outline">2. Edit</Badge>
                  <Badge variant="outline">3. Generate</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'edit' && (
            <PromptEditor
              initialPrompt={enhancedPrompt}
              onSubmit={handlePromptEdit}
              onBack={() => setCurrentStep('input')}
            />
          )}

          {currentStep === 'generate' && (
            <CodeGenerator
              prompt={enhancedPrompt}
              onBack={() => setCurrentStep('edit')}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            Powered by Claude AI, Groq API, and Stackblitz
          </p>
          <p className="text-sm">
            Built with Next.js, Tailwind CSS, and modern web technologies
          </p>
        </footer>
      </div>
    </div>
  );
}