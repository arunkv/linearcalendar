/**
 * Netlify Function: google-refresh
 *
 * Uses a refresh token to obtain a new access token.
 * The client_secret never leaves this server-side function.
 *
 * POST body: { refresh_token: string }
 * Response:  { access_token, expires_in, token_type }
 */
export default async function handler(req, context) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { refresh_token } = body
  if (!refresh_token || typeof refresh_token !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing refresh token' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const params = new URLSearchParams({
    refresh_token,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    grant_type: 'refresh_token',
  })

  const googleRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  const data = await googleRes.json()

  if (!googleRes.ok) {
    return new Response(JSON.stringify({ error: data.error_description || 'Token refresh failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
