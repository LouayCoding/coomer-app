import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

export async function GET() {
  try {
    // Test fetching posts with query parameter
    const testUsername = 'maysalicious';
    
    try {
      const posts = await apiClient.fetchPosts({ 
        offset: 0,
        q: testUsername,
        service: 'onlyfans'
      });
      
      // Filter to only posts from this user
      const userPosts = posts.filter(p => p.user === testUsername);
      
      return NextResponse.json({ 
        success: true,
        method: 'Using /posts endpoint with query',
        username: testUsername,
        totalPosts: posts.length,
        userPosts: userPosts.length,
        firstUserPost: userPosts[0] || null
      });
    } catch (apiError: any) {
      return NextResponse.json({ 
        success: false,
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
