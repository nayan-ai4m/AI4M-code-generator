'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Code, Download, Copy, ExternalLink, Loader2, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface CodeGeneratorProps {
  prompt: string;
  onBack: () => void;
}

export function CodeGenerator({ prompt, onBack }: CodeGeneratorProps) {
  console.log('🔧 CodeGenerator component initialized with prompt:', {
    promptLength: prompt.length,
    promptPreview: prompt.substring(0, 100) + '...'
  });
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<{
    html: string;
    css: string;
    js: string;
  } | null>(null);
  const [stackblitzUrl, setStackblitzUrl] = useState('');
  const { toast } = useToast();

  console.log('🔧 CodeGenerator state:', {
    isGenerating,
    generationProgress,
    hasGeneratedCode: !!generatedCode,
    stackblitzUrl
  });

  useEffect(() => {
    console.log('🔧 CodeGenerator useEffect triggered, calling generateCode');
    generateCode();
  }, []);

  const generateCode = async () => {
    console.log('🤖 generateCode called');
    console.log('🤖 Starting code generation process...');
    
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate generation progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          console.log('📊 Generation progress:', prev + 10);
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Simulate Claude API call
      console.log('🤖 Starting Claude API simulation...');
      // In a real implementation, you would call your Claude API endpoint
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('🤖 Claude API simulation completed');
      console.log('📊 Setting generation progress to 100%');
      setGenerationProgress(100);

      // Mock generated code (replace with actual Claude API response)
      const mockCode = {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <h1 class="text-2xl font-bold text-gray-900">My Generated App</h1>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Get Started
                    </button>
                </div>
            </div>
        </header>
        
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Your App</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    This is a beautiful, responsive web application generated based on your requirements.
                </p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Fast Performance</h3>
                    <p class="text-gray-600">Optimized for speed and efficiency with modern web technologies.</p>
                </div>
                
                <div class="card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Reliable</h3>
                    <p class="text-gray-600">Built with best practices and tested thoroughly for reliability.</p>
                </div>
                
                <div class="card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Customizable</h3>
                    <p class="text-gray-600">Easy to customize and extend based on your specific needs.</p>
                </div>
            </div>
        </main>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,
        css: `/* Custom styles for the generated app */
.card {
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

/* Animation for elements */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card {
    animation: fadeInUp 0.6s ease forwards;
}

.card:nth-child(2) {
    animation-delay: 0.1s;
}

.card:nth-child(3) {
    animation-delay: 0.2s;
}`,
        js: `// JavaScript for the generated app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Generated app loaded successfully!');
    
    // Add interactive behaviors
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Button click handler
    const button = document.querySelector('button');
    if (button) {
        button.addEventListener('click', function() {
            alert('Welcome to your generated app! You can customize this behavior.');
        });
    }
    
    // Simple form validation example
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });
        
        return isValid;
    }
    
    // Utility functions
    const utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        formatDate: function(date) {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        }
    };
    
    // Export for potential use
    window.AppUtils = utils;
});`
      };

      console.log('✅ Mock code generated:', {
        htmlLength: mockCode.html.length,
        cssLength: mockCode.css.length,
        jsLength: mockCode.js.length
      });
      
      setGeneratedCode(mockCode);
      
      // Create Stackblitz project URL (mock)
      console.log('🔗 Setting Stackblitz URL');
      setStackblitzUrl('https://stackblitz.com/edit/generated-app-preview');
      
      console.log('✅ Code generation completed successfully');
      toast({
        title: 'Code generated successfully!',
        description: 'Your code is ready for preview and download.',
      });
      
    } catch (error) {
      console.error('❌ Error in generateCode:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      toast({
        title: 'Generation failed',
        description: 'There was an error generating your code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
      console.log('🤖 generateCode completed, isGenerating set to false');
    }
  };

  const copyToClipboard = async (code: string, type: string) => {
    console.log('📋 copyToClipboard called for type:', type);
    console.log('📋 Code length:', code.length);
    
    try {
      await navigator.clipboard.writeText(code);
      console.log('✅ Code copied to clipboard successfully');
      toast({
        title: 'Copied to clipboard',
        description: `${type} code has been copied to your clipboard.`,
      });
    } catch (error) {
      console.error('❌ Error copying to clipboard:', error);
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard. Please select and copy manually.',
        variant: 'destructive'
      });
    }
  };

  const downloadCode = () => {
    console.log('💾 downloadCode called');
    
    if (!generatedCode) return;

    console.log('💾 Starting file downloads...');
    const files = [
      { name: 'index.html', content: generatedCode.html },
      { name: 'styles.css', content: generatedCode.css },
      { name: 'script.js', content: generatedCode.js }
    ];

    files.forEach(file => {
      console.log('💾 Downloading file:', file.name, 'Size:', file.content.length);
      
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    console.log('✅ All files downloaded successfully');
    toast({
      title: 'Files downloaded',
      description: 'All code files have been downloaded to your device.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mb-8">
        <Badge variant="outline">1. Input</Badge>
        <Badge variant="outline">2. Edit</Badge>
        <Badge variant="default">3. Generate</Badge>
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                  Generating Your Code...
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  Claude AI is creating production-ready code based on your requirements
                </p>
              </div>
            </div>
            
            <Progress value={generationProgress} className="h-3 mb-4" />
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className={`p-3 rounded-lg ${generationProgress > 30 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                <div className="font-semibold">Analyzing Prompt</div>
                {generationProgress > 30 && <CheckCircle className="w-4 h-4 mx-auto mt-1" />}
              </div>
              <div className={`p-3 rounded-lg ${generationProgress > 60 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                <div className="font-semibold">Generating Code</div>
                {generationProgress > 60 && <CheckCircle className="w-4 h-4 mx-auto mt-1" />}
              </div>
              <div className={`p-3 rounded-lg ${generationProgress === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                <div className="font-semibold">Optimizing</div>
                {generationProgress === 100 && <CheckCircle className="w-4 h-4 mx-auto mt-1" />}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Code Results */}
      {!isGenerating && generatedCode && (
        <div className="space-y-6">
          {/* Header with Actions */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Code className="w-6 h-6" />
                    Generated Code
                  </CardTitle>
                  <CardDescription>
                    Your production-ready code is ready! Preview, edit, and download below.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    console.log('🔘 Download All button clicked');
                    downloadCode();
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('🔘 Live Preview button clicked, opening:', stackblitzUrl);
                    window.open(stackblitzUrl, '_blank');
                  }}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Live Preview
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('🔘 Edit in Stackblitz button clicked');
                    window.open('https://stackblitz.com', '_blank');
                  }}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Edit in Stackblitz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Code Tabs */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <Tabs defaultValue="html" className="w-full">
                <div className="border-b px-6 pt-6">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="html" className="p-6 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">index.html</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('🔘 Copy HTML button clicked');
                        copyToClipboard(generatedCode.html, 'HTML');
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.html}</code>
                  </pre>
                </TabsContent>
                
                <TabsContent value="css" className="p-6 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">styles.css</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('🔘 Copy CSS button clicked');
                        copyToClipboard(generatedCode.css, 'CSS');
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.css}</code>
                  </pre>
                </TabsContent>
                
                <TabsContent value="js" className="p-6 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">script.js</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('🔘 Copy JavaScript button clicked');
                        copyToClipboard(generatedCode.js, 'JavaScript');
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.js}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Stackblitz Preview */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                Your code running in real-time with Stackblitz integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Preview Ready</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Click the button below to open your generated code in Stackblitz for live editing and testing.
                </p>
                <Button
                  onClick={() => {
                    console.log('🔘 Open in Stackblitz button clicked from preview section');
                    window.open(stackblitzUrl, '_blank');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Stackblitz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={() => {
                console.log('🔙 Edit Prompt button clicked');
                onBack();
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Edit Prompt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}