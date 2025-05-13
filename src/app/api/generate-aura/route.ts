import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received data:', data);
    console.log("Data", JSON.stringify(data))
    
    // Get the backend URL from environment variables
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000/api';

    if (!backendUrl) {
      throw new Error('Backend URL is not defined in environment variables');
    }
    
    // Forward the request to the actual backend
    const response = await fetch(`${backendUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in generate-aura API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}