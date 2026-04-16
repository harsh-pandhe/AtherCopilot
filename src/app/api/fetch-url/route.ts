import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AtherCopilot/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: HTTP ${response.status}` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return NextResponse.json(
        { error: 'URL must point to an HTML or text page' },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Strip HTML tags and collapse whitespace
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s{2,}/g, ' ')
      .trim();

    const content = text.slice(0, 20000); // cap at 20k chars

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URL content' },
      { status: 500 }
    );
  }
}
