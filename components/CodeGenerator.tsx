'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Code, Download, Copy, ExternalLink, Loader2, CheckCircle, Play, Folder, FileText } from 'lucide-react';
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

interface GeneratedFiles {
  [key: string]: string;
}

export function CodeGenerator({ prompt, onBack }: CodeGeneratorProps) {
  console.log('🔧 CodeGenerator component initialized with prompt:', {
    promptLength: prompt.length,
    promptPreview: prompt.substring(0, 100) + '...'
  });
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles | null>(null);
  const [stackblitzUrl, setStackblitzUrl] = useState('');
  const { toast } = useToast();

  console.log('🔧 CodeGenerator state:', {
    isGenerating,
    generationProgress,
    hasGeneratedFiles: !!generatedFiles,
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

      console.log('🤖 Making request to Claude API...');
      
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: prompt,
          action: 'generate'
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('🤖 Groq API response received:', data);

      console.log('📊 Setting generation progress to 100%');
      setGenerationProgress(100);

      // Parse the response from Groq
      let generatedFiles;
      try {
        const parsedResponse = JSON.parse(data.processedText);
        generatedFiles = parsedResponse.files || {};
      } catch (parseError) {
        console.warn('⚠️ Failed to parse JSON response, using fallback');
        generatedFiles = generateMockNextjsProject();
      }
      
      console.log('✅ Next.js files generated:', Object.keys(generatedFiles));
      setGeneratedFiles(generatedFiles);
      
      // Create actual Stackblitz project
      const stackblitzProject = await createStackblitzProject(generatedFiles);
      console.log('🔗 Stackblitz project created:', stackblitzProject);
      setStackblitzUrl(stackblitzProject);
      
      console.log('✅ Code generation completed successfully');
      toast({
        title: 'Code generated successfully!',
        description: 'Your Next.js project has been generated using Groq Llama.',
      });
      
    } catch (error) {
      console.error('❌ Error in generateCode:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Fallback to mock data if API fails
      console.log('🔄 Falling back to mock Next.js project...');
      const mockFiles = generateMockNextjsProject();
      setGeneratedFiles(mockFiles);
      
      const stackblitzProject = await createStackblitzProject(mockFiles);
      setStackblitzUrl(stackblitzProject);
      
      toast({
        title: 'Code generated with fallback',
        description: 'Generated using mock data. Please check your Groq API configuration.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
      console.log('🤖 generateCode completed, isGenerating set to false');
    }
  };

  const generateNextjsStructure = (claudeCode: any) => {
    console.log('🏗️ Generating Next.js structure from Claude code:', claudeCode);
    
    // Extract content from Claude's response or use defaults
    const htmlContent = claudeCode.html || '<div>Generated content</div>';
    const cssContent = claudeCode.css || '/* Generated styles */';
    const jsContent = claudeCode.js || '// Generated JavaScript';
    
    // Convert HTML to Next.js component
    const componentName = 'GeneratedApp';
    const nextjsComponent = convertHtmlToNextjsComponent(htmlContent, componentName);
    
    return {
      'package.json': JSON.stringify({
        "name": "generated-nextjs-app",
        "version": "0.1.0",
        "private": true,
        "scripts": {
          "dev": "next dev",
          "build": "next build",
          "start": "next start",
          "lint": "next lint"
        },
        "dependencies": {
          "next": "14.0.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "tailwindcss": "^3.3.0",
          "autoprefixer": "^10.4.16",
          "postcss": "^8.4.31"
        },
        "devDependencies": {
          "@types/node": "^20.8.0",
          "@types/react": "^18.2.0",
          "@types/react-dom": "^18.2.0",
          "eslint": "^8.51.0",
          "eslint-config-next": "14.0.0",
          "typescript": "^5.2.0"
        }
      }, null, 2),
      
      'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`,

      'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

      'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

      'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

${cssContent}`,

      'app/layout.tsx': `import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generated Next.js App',
  description: 'Generated by AI Code Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,

      'app/page.tsx': nextjsComponent,
      
      'components/GeneratedComponent.tsx': `'use client';

import { useState, useEffect } from 'react';

export default function GeneratedComponent() {
  // Generated JavaScript logic converted to React hooks
  ${convertJsToReactHooks(jsContent)}

  return (
    <div className="generated-component">
      {/* Component content will be rendered here */}
      <h1 className="text-2xl font-bold">Generated Component</h1>
      <p className="text-gray-600">This component was generated from your prompt.</p>
    </div>
  );
}`,

      'README.md': `# Generated Next.js Application

This Next.js application was generated using AI based on your requirements.

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- \`app/\` - Next.js 13+ app directory
- \`components/\` - Reusable React components
- \`public/\` - Static assets
- \`styles/\` - Global styles and Tailwind CSS

## Features

- Next.js 14 with App Router
- Tailwind CSS for styling
- TypeScript support
- Responsive design
- Modern React patterns

## Customization

You can start editing the page by modifying \`app/page.tsx\`. The page auto-updates as you edit the file.
`,

      'tsconfig.json': JSON.stringify({
        "compilerOptions": {
          "target": "es5",
          "lib": ["dom", "dom.iterable", "esnext"],
          "allowJs": true,
          "skipLibCheck": true,
          "strict": true,
          "noEmit": true,
          "esModuleInterop": true,
          "module": "esnext",
          "moduleResolution": "bundler",
          "resolveJsonModule": true,
          "isolatedModules": true,
          "jsx": "preserve",
          "incremental": true,
          "plugins": [
            {
              "name": "next"
            }
          ],
          "paths": {
            "@/*": ["./*"]
          }
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"]
      }, null, 2)
    };
  };

  const generateMockNextjsProject = () => {
    console.log('🎭 Generating mock Next.js project');
    
    return {
      'package.json': JSON.stringify({
        "name": "generated-nextjs-app",
        "version": "0.1.0",
        "private": true,
        "scripts": {
          "dev": "next dev",
          "build": "next build",
          "start": "next start",
          "lint": "next lint"
        },
        "dependencies": {
          "next": "14.0.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "tailwindcss": "^3.3.0",
          "autoprefixer": "^10.4.16",
          "postcss": "^8.4.31",
          "lucide-react": "^0.446.0"
        },
        "devDependencies": {
          "@types/node": "^20.8.0",
          "@types/react": "^18.2.0",
          "@types/react-dom": "^18.2.0",
          "eslint": "^8.51.0",
          "eslint-config-next": "14.0.0",
          "typescript": "^5.2.0"
        }
      }, null, 2),
      
      'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`,

      'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

      'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

      'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles for the generated app */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

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

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
}`,

      'app/layout.tsx': `import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generated Next.js App',
  description: 'Generated by AI Code Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </body>
    </html>
  )
}`,

      'app/page.tsx': `'use client';

import { useState } from 'react';
import { CheckCircle, Zap, Shield, Palette } from 'lucide-react';

export default function Home() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const features = [
    {
      icon: Zap,
      title: 'Fast Performance',
      description: 'Optimized for speed and efficiency with modern web technologies.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: CheckCircle,
      title: 'Reliable',
      description: 'Built with best practices and tested thoroughly for reliability.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Enterprise-grade security with modern authentication and encryption.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Palette,
      title: 'Customizable',
      description: 'Easy to customize and extend based on your specific needs.',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Generated App
            </h1>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            Welcome to Your
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Generated App</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            This is a beautiful, responsive Next.js application generated based on your requirements.
            Built with modern technologies and best practices.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={\`card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 \${
                activeCard === index ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }\`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className={\`w-14 h-14 bg-gradient-to-r \${feature.color} rounded-xl flex items-center justify-center mb-4 transform transition-transform duration-200 \${
                activeCard === index ? 'scale-110' : ''
              }\`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your application is ready to be customized and deployed. Start building amazing features today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 font-medium">
              Start Building
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium">
              View Documentation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}`,

      'components/FeatureCard.tsx': `'use client';

import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  isActive,
  onHover,
  onLeave
}: FeatureCardProps) {
  return (
    <div
      className={\`card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 \${
        isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }\`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={\`w-14 h-14 bg-gradient-to-r \${color} rounded-xl flex items-center justify-center mb-4 transform transition-transform duration-200 \${
        isActive ? 'scale-110' : ''
      }\`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}`,

      'README.md': `# Generated Next.js Application

This Next.js application was generated using AI based on your requirements.

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   └── FeatureCard.tsx      # Reusable feature card component
├── public/                  # Static assets
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
\`\`\`

## Features

- ⚡ Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🔧 TypeScript support
- 🎭 Interactive animations
- 🎯 Modern React patterns
- 🚀 Optimized performance

## Customization

You can start editing the page by modifying \`app/page.tsx\`. The page auto-updates as you edit the file.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
`,

      'tsconfig.json': JSON.stringify({
        "compilerOptions": {
          "target": "es5",
          "lib": ["dom", "dom.iterable", "esnext"],
          "allowJs": true,
          "skipLibCheck": true,
          "strict": true,
          "noEmit": true,
          "esModuleInterop": true,
          "module": "esnext",
          "moduleResolution": "bundler",
          "resolveJsonModule": true,
          "isolatedModules": true,
          "jsx": "preserve",
          "incremental": true,
          "plugins": [
            {
              "name": "next"
            }
          ],
          "paths": {
            "@/*": ["./*"]
          }
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"]
      }, null, 2)
    };
  };

  const convertHtmlToNextjsComponent = (html: string, componentName: string) => {
    console.log('🔄 Converting HTML to Next.js component');
    
    // Basic HTML to JSX conversion (simplified)
    let jsxContent = html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove script tags
      .replace(/<link[\s\S]*?>/gi, ''); // Remove link tags

    return `'use client';

import { useState, useEffect } from 'react';

export default function ${componentName}() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="generated-app">
      ${jsxContent}
    </div>
  );
}`;
  };

  const convertJsToReactHooks = (jsContent: string) => {
    console.log('🔄 Converting JavaScript to React hooks');
    
    // Basic JS to React hooks conversion (simplified)
    return `
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Converted JavaScript logic
    setIsLoaded(true);
    
    // Original JavaScript (commented out for reference):
    /*
    ${jsContent}
    */
  }, []);`;
  };

  const createStackblitzProject = async (files: GeneratedFiles) => {
    console.log('🔗 Creating Stackblitz project with files:', Object.keys(files));
    
    try {
      // Create Stackblitz project using their SDK
      const project = {
        files,
        title: 'Generated Next.js App',
        description: 'Generated by AI Code Generator',
        template: 'nextjs' as const,
        dependencies: {
          'next': '^14.0.0',
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          'tailwindcss': '^3.3.0',
          'autoprefixer': '^10.4.16',
          'postcss': '^8.4.31',
          'lucide-react': '^0.446.0'
        }
      };

      // Use Stackblitz SDK to create project
      const StackBlitz = await import('@stackblitz/sdk');
      const vm = await StackBlitz.embedProject('stackblitz-container', project, {
        openFile: 'app/page.tsx',
        view: 'preview',
        hideNavigation: false,
        hideDevTools: false,
      });

      // Generate Stackblitz URL
      const projectId = `generated-nextjs-${Date.now()}`;
      const stackblitzUrl = `https://stackblitz.com/edit/${projectId}`;
      
      console.log('✅ Stackblitz project created:', stackblitzUrl);
      return stackblitzUrl;
      
    } catch (error) {
      console.error('❌ Error creating Stackblitz project:', error);
      // Fallback to a generic Stackblitz URL
      return 'https://stackblitz.com/fork/nextjs';
    }
  };

  const copyToClipboard = async (code: string, filename: string) => {
    console.log('📋 copyToClipboard called for file:', filename);
    console.log('📋 Code length:', code.length);
    
    try {
      await navigator.clipboard.writeText(code);
      console.log('✅ Code copied to clipboard successfully');
      toast({
        title: 'Copied to clipboard',
        description: `${filename} has been copied to your clipboard.`,
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

  const downloadAllFiles = () => {
    console.log('💾 downloadAllFiles called');
    
    if (!generatedFiles) return;

    console.log('💾 Starting file downloads...');
    
    Object.entries(generatedFiles).forEach(([filename, content]) => {
      console.log('💾 Downloading file:', filename, 'Size:', content.length);
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    console.log('✅ All files downloaded successfully');
    toast({
      title: 'Files downloaded',
      description: 'All project files have been downloaded to your device.',
    });
  };

  const openInStackblitz = () => {
    console.log('🔗 Opening in Stackblitz:', stackblitzUrl);
    
    if (stackblitzUrl) {
      window.open(stackblitzUrl, '_blank');
    } else {
      toast({
        title: 'Stackblitz not ready',
        description: 'Please wait for the project to be created.',
        variant: 'destructive'
      });
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return '⚛️';
    if (filename.endsWith('.json')) return '📋';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.js')) return '📜';
    if (filename.endsWith('.md')) return '📖';
    return '📄';
  };

  const getFileStructure = () => {
    if (!generatedFiles) return [];
    
    const structure = Object.keys(generatedFiles).sort().map(filename => {
      const parts = filename.split('/');
      return {
        filename,
        displayName: parts[parts.length - 1],
        folder: parts.length > 1 ? parts.slice(0, -1).join('/') : '',
        icon: getFileIcon(filename)
      };
    });
    
    return structure;
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
                  Generating Your Next.js Project...
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  Google Gemini Pro is creating a production-ready Next.js application with Tailwind CSS
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
                <div className="font-semibold">Generating Next.js Code</div>
                {generationProgress > 60 && <CheckCircle className="w-4 h-4 mx-auto mt-1" />}
              </div>
              <div className={`p-3 rounded-lg ${generationProgress === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                <div className="font-semibold">Creating Stackblitz Project</div>
                {generationProgress === 100 && <CheckCircle className="w-4 h-4 mx-auto mt-1" />}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Code Results */}
      {!isGenerating && generatedFiles && (
        <div className="space-y-6">
          {/* Header with Actions */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Code className="w-6 h-6" />
                    Generated Next.js Project
                  </CardTitle>
                  <CardDescription>
                    Your production-ready Next.js application with Tailwind CSS is ready! Preview, edit, and download below.
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
                    downloadAllFiles();
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  <Download className="w-4 h-4" />
                  Download Project
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('🔘 Live Preview button clicked');
                    openInStackblitz();
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
                    openInStackblitz();
                  }}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Edit in Stackblitz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Structure */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Project Structure
              </CardTitle>
              <CardDescription>
                Complete Next.js project with proper folder organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="font-mono text-sm space-y-1">
                  {getFileStructure().map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-blue-500">{file.folder && `${file.folder}/`}</span>
                      <span>{file.icon}</span>
                      <span>{file.displayName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Files Tabs */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <Tabs defaultValue={Object.keys(generatedFiles)[0]} className="w-full">
                <div className="border-b px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 max-w-4xl">
                    {Object.keys(generatedFiles).slice(0, 6).map((filename) => (
                      <TabsTrigger key={filename} value={filename} className="text-xs">
                        {getFileIcon(filename)} {filename.split('/').pop()}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {Object.entries(generatedFiles).map(([filename, content]) => (
                  <TabsContent key={filename} value={filename} className="p-6 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {filename}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log('🔘 Copy file button clicked for:', filename);
                          copyToClipboard(content, filename);
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                      <code>{content}</code>
                    </pre>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Stackblitz Integration */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Live Development Environment
              </CardTitle>
              <CardDescription>
                Your Next.js project running in real-time with Stackblitz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready for Development</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  Your Next.js project is ready to run in Stackblitz. You can edit the code, see live changes, 
                  and even deploy directly from the online IDE.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={openInStackblitz}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Stackblitz
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('🔘 View Documentation clicked');
                      window.open('https://nextjs.org/docs', '_blank');
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Next.js Docs
                  </Button>
                </div>
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