'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // For now, return a placeholder response
    // In a real implementation, you would fetch the URL content
    const content = `Content from URL: ${url}\n\nThis is placeholder content. In a production implementation, you would use a library like 'cheerio' or 'puppeteer' to extract text content from web pages.`;

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URL content' },
      { status: 500 }
    );
  }
}