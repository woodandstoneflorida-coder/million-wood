const SECRET_KEY_STR = process.env.JWT_SECRET || 'million-wood-secret-key-change-in-prod-123456';

async function getCryptoKey() {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY_STR),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function encryptSession(payload: any): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  // Expire in 8 hours
  const exp = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
  const fullPayload = { ...payload, exp };

  const enc = new TextEncoder();
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(fullPayload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(`${encodedHeader}.${encodedPayload}`)
  );

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureBase64 = btoa(String.fromCharCode.apply(null, signatureArray))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signatureBase64}`;
}

export async function decryptSession(token: string): Promise<any> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const enc = new TextEncoder();
    
    // Verify signature
    const key = await getCryptoKey();
    const dataToVerify = enc.encode(`${header}.${payload}`);
    
    // Decode signature from base64url
    const sigBinary = atob(signature.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBuffer = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBuffer[i] = sigBinary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, sigBuffer, dataToVerify);
    if (!isValid) return null;

    // Decode payload
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (decodedPayload.exp && Date.now() / 1000 > decodedPayload.exp) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    return null;
  }
}
