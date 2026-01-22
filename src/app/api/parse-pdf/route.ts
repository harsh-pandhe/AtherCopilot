'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // For now, return placeholder content
    // In a real implementation, you would use a PDF parsing library like 'pdf-parse' or 'pdf2pic'
    const content = `PDF Content from: ${file.name}\n\nThis is placeholder content extracted from the PDF. In a production implementation, you would use a library like 'pdf-parse' to extract text content from PDF files.\n\nFile size: ${(file.size / 1024 / 1024).toFixed(2)} MB\nFile type: ${file.type}`;

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    );
  }
}