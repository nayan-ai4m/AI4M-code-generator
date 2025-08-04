'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Code, MessageSquare, Loader2, Edit3, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCodeMode?: boolean;
  codeContext?: string;
}

interface ChatInterfaceProps {
  onGenerateCode: (prompt: string) => void;
}

export function ChatInterface({ onGenerateCode }: ChatInterfaceProps) {
  console.log('💬 ChatInterface component initialized');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `# Welcome to AI Assistant! 👋

I'm your intelligent coding companion. I can help you with:

## 💻 **Code Generation & Development**
- Create complete applications and components
- Debug and fix code issues
- Explain programming concepts
- Review and optimize code

## 🗣️ **General Assistance**
- Answer questions on any topic
- Provide explanations and tutorials
- Help with problem-solving
- Offer suggestions and recommendations

### How to use:
- **Regular chat**: Just type your message and press Enter
- **Code mode**: Click the 🔧 **Code** button before sending to generate code
- **Edit code**: Use the edit feature on any code response to modify it

What would you like to work on today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    'Explain how React hooks work',
    'Create a responsive navbar component',
    'Help me debug this JavaScript error',
    'Build a todo app with TypeScript',
    'Show me CSS Grid best practices',
    'Create a REST API with Node.js'
  ];

  const sendMessage = async (message: string, codeMode: boolean = false, contextMessage?: Message) => {
    if (!message.trim()) return;

    console.log('💬 Sending message:', { message, codeMode, hasContext: !!contextMessage });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      isCodeMode: codeMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsCodeMode(false);
    setIsLoading(true);

    try {
      console.log('🤖 Making request to API...');
      
      // Determine the action based on mode and context
      let action = 'chat';
      let requestContent = message;
      
      if (codeMode) {
        action = 'generate';
      } else if (contextMessage) {
        // For code editing, we need to provide context
        action = 'enhance';
        requestContent = `Previous code context:\n${contextMessage.content}\n\nModification request: ${message}`;
      }
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: requestContent,
          action: action
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('🤖 API response received:', data);

      let assistantContent = data.processedText || 'Sorry, I couldn\'t process your request.';
      
      // If this was a code editing request, format the response appropriately
      if (contextMessage) {
        assistantContent = `## Updated Code\n\n${assistantContent}`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        isCodeMode: codeMode,
        codeContext: contextMessage?.content
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('❌ Error in chat:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '## Error\n\nSorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Chat Error',
        description: 'Failed to get response from AI. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCode = (messageId: string) => {
    setEditingMessageId(messageId);
    setEditPrompt('');
  };

  const submitEdit = async (originalMessage: Message) => {
    if (!editPrompt.trim()) return;
    
    await sendMessage(editPrompt, false, originalMessage);
    setEditingMessageId(null);
    setEditPrompt('');
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied to clipboard',
        description: 'Message has been copied to your clipboard.',
      });
    } catch (error) {
      console.error('❌ Error copying to clipboard:', error);
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard.',
        variant: 'destructive'
      });
    }
  };

  const downloadCode = (content: string, filename: string = 'code.txt') => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Code downloaded',
      description: `${filename} has been downloaded to your device.`,
    });
  };

  const hasCodeBlocks = (content: string) => {
    return content.includes('```');
  };

  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const matches = [];
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      matches.push({
        language: match[1] || 'text',
        code: match[2].trim()
      });
    }
    
    return matches;
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text';
      
      return !inline ? (
        <div className="relative">
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            className="rounded-lg !mt-2 !mb-2"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-70 hover:opacity-100"
            onClick={() => copyMessage(String(children))}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }: any) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-900 dark:text-gray-100">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-medium mt-4 mb-2 text-gray-900 dark:text-gray-100">{children}</h3>,
    p: ({ children }: any) => <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300">{children}</ol>,
    li: ({ children }: any) => <li className="ml-2">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-3 bg-blue-50 dark:bg-blue-950/20 rounded-r">
        {children}
      </blockquote>
    ),
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    a: ({ href, children }: any) => (
      <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-2xl flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          AI Assistant
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-4">
          {quickPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => sendMessage(prompt)}
              className="text-xs hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              {prompt}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              <div className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.isCodeMode && (
                      <Badge variant="secondary" className="text-xs">
                        <Code className="w-3 h-3 mr-1" />
                        Code
                      </Badge>
                    )}
                  </div>
                  
                  <div
                    className={`rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown components={MarkdownComponents}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons for assistant messages */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                        className="h-8 px-3 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      
                      {hasCodeBlocks(message.content) && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCode(message.id)}
                            className="h-8 px-3 text-xs"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit Code
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const codeBlocks = extractCodeBlocks(message.content);
                              if (codeBlocks.length > 0) {
                                downloadCode(codeBlocks[0].code, `code.${codeBlocks[0].language}`);
                              }
                            }}
                            className="h-8 px-3 text-xs"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Edit Code Section */}
              {editingMessageId === message.id && (
                <div className="ml-12 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Edit3 className="w-4 h-4" />
                    Edit Code
                  </h4>
                  <Textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Describe how you want to modify the code... (e.g., 'Add error handling', 'Make it responsive', 'Add TypeScript types')"
                    className="mb-3 min-h-[80px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => submitEdit(message)}
                      disabled={!editPrompt.trim()}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Apply Changes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMessageId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-w-[85%]">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white/50 dark:bg-slate-800/50">
          <div className="flex gap-2 mb-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isCodeMode ? "Describe the code you want to generate..." : "Ask me anything or request code generation..."}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(inputMessage, isCodeMode);
                  }
                }}
                disabled={isLoading}
                className={`pr-24 ${isCodeMode ? 'border-orange-300 bg-orange-50 dark:bg-orange-950/20' : ''}`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant={isCodeMode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsCodeMode(!isCodeMode)}
                  className={`h-7 px-2 ${isCodeMode ? 'bg-orange-600 hover:bg-orange-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title={isCodeMode ? "Switch to chat mode" : "Switch to code mode"}
                >
                  <Code className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => sendMessage(inputMessage, isCodeMode)}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="h-7 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {isCodeMode && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                  <Code className="w-3 h-3 mr-1" />
                  Code Mode Active
                </Badge>
              )}
            </div>
            <span>{inputMessage.length} characters</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}