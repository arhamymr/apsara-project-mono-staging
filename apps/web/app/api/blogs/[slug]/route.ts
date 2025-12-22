import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'http://localhost:1234';
const API_KEY = process.env.API_HUB_KEY || '';

export async function GET(
  _request: unknown,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    // Validate environment variables
    if (!API_KEY) {
      console.error('API_HUB_KEY is not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const url = `${API_BASE_URL}/api/v1/blogs/${slug}`;
    console.log('Fetching blog from:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch blog from backend', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fetch error:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
