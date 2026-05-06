import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventName, eventData, eventId, url } = body;

    const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

    if (!PIXEL_ID || !ACCESS_TOKEN || PIXEL_ID === 'TU_ID_AQUI') {
      // Si no están configurados, simplemente retornamos éxito para no romper la app en desarrollo
      return NextResponse.json({ success: true, message: "CAPI no configurado o falta token" });
    }

    // Get client IP and User Agent for better match quality
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const userAgent = req.headers.get('user-agent') || '';

    // Convert our custom format to Facebook Server-Side format
    const serverEvent = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: url,
          action_source: "website",
          user_data: {
            client_ip_address: ip,
            client_user_agent: userAgent,
          },
          custom_data: eventData || {},
        }
      ]
    };

    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serverEvent),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Meta CAPI Error:', data);
      return NextResponse.json({ success: false, error: data }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Meta CAPI Request Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
