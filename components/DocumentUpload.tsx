'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onProcessed: (processedPrompt: string) => void;
}

export function DocumentUpload({ onProcessed }: DocumentUploadProps) {
  console.log('📄 DocumentUpload component initialized');
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  console.log('📄 DocumentUpload state:', {
    isDragOver,
    isProcessing,
    uploadProgress,
    selectedFileName: selectedFile?.name || 'none',
    selectedFileSize: selectedFile?.size || 0
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    console.log('🖱️ Drag over event triggered');
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    console.log('🖱️ Drag leave event triggered');
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    console.log('🖱️ Drop event triggered');
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('📁 Files dropped:', files.length);
    
    if (files.length > 0) {
      console.log('📁 Processing first dropped file:', files[0].name);
      handleFileSelection(files[0]);
    } else {
      console.warn('⚠️ No files found in drop event');
    }
  }, []);

  const handleFileSelection = (file: File) => {
    console.log('📁 handleFileSelection called with file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      console.log('✅ Allowed types:', allowedTypes);
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF, Word document, or text file.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      console.error('❌ File too large:', file.size, 'bytes');
      console.log('📏 Size limit: 10MB (10485760 bytes)');
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB.',
        variant: 'destructive'
      });
      return;
    }

    console.log('✅ File validation passed, setting selected file');
    setSelectedFile(file);
  };

  const processDocument = async () => {
    console.log('🔄 processDocument called');
    
    if (!selectedFile) return;

    console.log('🔄 Starting document processing for:', selectedFile.name);
    
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          console.log('📊 Upload progress:', prev + 10);
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate document processing with Groq API
      // In a real implementation, you would:
      console.log('🤖 Starting Groq API simulation...');
      // 1. Upload the file to your backend
      console.log('📤 Step 1: Upload file to backend (simulated)');
      // 2. Extract text from the document
      console.log('📄 Step 2: Extract text from document (simulated)');
      // 3. Send to Groq API for summarization
      console.log('🧠 Step 3: Send to Groq API for summarization (simulated)');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setUploadProgress(100);

      // Mock processed prompt (replace with actual Groq API response)
      const mockProcessedPrompt = `Based on the uploaded document, create a modern web application with the following requirements:

1. User authentication system with login/signup
2. Dashboard with data visualization
3. CRUD operations for managing records
4. Responsive design for mobile and desktop
5. Search and filtering capabilities
6. Export functionality for data

Please implement this using React, TypeScript, and Tailwind CSS with proper error handling and loading states.`;

      console.log('✅ Mock processed prompt generated:', mockProcessedPrompt.substring(0, 100) + '...');
      console.log('📊 Final upload progress: 100%');
      
      toast({
        title: 'Document processed successfully',
        description: 'Your document has been analyzed and converted to a structured prompt.',
      });

      setTimeout(() => {
        console.log('🔄 Calling onProcessed callback with processed prompt');
        onProcessed(mockProcessedPrompt);
      }, 500);

    } catch (error) {
      console.error('❌ Error in processDocument:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      toast({
        title: 'Processing failed',
        description: 'There was an error processing your document. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      console.log('🔄 processDocument completed, isProcessing set to false');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isDragOver ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <Upload className={`w-8 h-8 ${
                isDragOver ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              }`} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragOver ? 'Drop your file here' : 'Upload your document'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Supports PDF, Word, and Text files (max 10MB)
              </p>
            </div>

            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                console.log('📁 File input changed');
                const file = e.target.files?.[0];
                if (file) {
                  console.log('📁 File selected from input:', file.name);
                  handleFileSelection(file);
                } else {
                  console.warn('⚠️ No file selected from input');
                }
              }}
            />
            
            <Button
              variant="outline"
              onClick={() => {
                console.log('🔘 Browse Files button clicked');
                document.getElementById('file-upload')?.click();
              }}
              className="mt-4"
            >
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected File */}
      {selectedFile && (
        <Card className="bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {!isProcessing && (
                <Button
                  onClick={() => {
                    console.log('🔘 Process Document button clicked');
                    processDocument();
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  Process Document
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Processing your document...
                </h3>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  {uploadProgress < 50 ? 'Extracting text...' : 
                   uploadProgress < 90 ? 'Analyzing content...' : 
                   'Generating structured prompt...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}