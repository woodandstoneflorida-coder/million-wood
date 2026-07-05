import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      return NextResponse.json({ error: 'No DB URL found in environment variables.' });
    }
    
    // Test getClients which will trigger table creation
    const clients = await db.getClients();
    
    return NextResponse.json({ 
      success: true, 
      clientCount: clients.length,
      dbUrlExists: !!dbUrl,
      dbUrlPrefix: dbUrl.substring(0, 15) + '...'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Database connection failed', 
      message: error.message,
      stack: error.stack 
    });
  }
}
