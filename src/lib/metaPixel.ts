export const trackMetaEvent = async (eventName: string, eventData: any = {}, isCustom = false) => {
  // Generate a unique ID for deduplication
  const eventId = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // 1. Send via Browser Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    const trackType = isCustom ? 'trackCustom' : 'track';
    (window as any).fbq(trackType, eventName, eventData, { eventID: eventId });
  }

  // 2. Send via Server (Conversions API)
  if (typeof window !== 'undefined') {
    try {
      // Fire and forget (don't block the UI)
      fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          eventData,
          eventId,
          url: window.location.href,
        }),
      }).catch(err => console.error('Failed to send Meta CAPI request:', err));
    } catch (error) {
      console.error('Failed to execute Meta CAPI fetch:', error);
    }
  }
};
