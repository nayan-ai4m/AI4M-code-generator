import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  console.log('📤 Upload API route called');
  
  try {
    const data = await request.formData();
    console.log('📋 FormData received, extracting file...');
    
    const file: File | null = data.get('file') as unknown as File;

    console.log('📁 File extraction result:', {
      hasFile: !!file,
      fileName: file?.name || 'No file',
      fileSize: file?.size || 0,
      fileType: file?.type || 'No type'
    });
    
    if (!file) {
      console.error('❌ No file received in request');
      return NextResponse.json(
        { error: 'No file received' },
        { status: 400 }
      );
    }

    console.log('🔍 Starting file validation...');
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    console.log('🔍 Checking file type:', {
      fileType: file.type,
      allowedTypes
    });
    
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, Word, and text files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    console.log('🔍 Checking file size:', {
      fileSize: file.size,
      limitBytes: 10 * 1024 * 1024
    });
    
    if (file.size > 10 * 1024 * 1024) {
      console.error('❌ File too large:', file.size, 'bytes');
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log('✅ File validation passed');
    console.log('📄 Converting file to buffer...');
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('📄 Buffer created, size:', buffer.length, 'bytes');
    
    // Save file temporarily (in production, you'd use cloud storage)
    const filename = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'tmp', filename);
    
    console.log('💾 Saving file temporarily:', {
      filename,
      path
    });
    
    await writeFile(path, buffer);
    console.log('✅ File saved successfully');

    // Extract text from file based on type
    console.log('📄 Starting text extraction for type:', file.type);
    let extractedText = '';
    
    if (file.type === 'text/plain') {
      console.log('📄 Extracting text from plain text file');
      extractedText = buffer.toString('utf-8');
      console.log('📄 Text extracted, length:', extractedText.length);
    } else if (file.type === 'application/pdf') {
      console.log('📄 PDF detected - using placeholder extraction');
      // For PDF extraction, you'd use a library like pdf-parse
      // For now, return a placeholder
      extractedText = 'PDF content extraction would be implemented here using a library like pdf-parse';
    } else if (file.type.includes('word')) {
      console.log('📄 Word document detected - using placeholder extraction');
      // For Word document extraction, you'd use a library like mammoth
      // For now, return a placeholder
      extractedText = 'Word document content extraction would be implemented here using a library like mammoth';
    }

    console.log('✅ Text extraction completed:', {
      extractedTextLength: extractedText.length,
      extractedTextPreview: extractedText.substring(0, 100) + '...'
    });
    
    const result = {
      success: true,
      filename,
      extractedText,
      fileSize: file.size,
      fileType: file.type
    };
    
    console.log('✅ Upload processing completed successfully:', {
      filename: result.filename,
      fileSize: result.fileSize,
      fileType: result.fileType,
      extractedTextLength: result.extractedText.length
    });
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Upload error:', error);
    console.error('Upload error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}