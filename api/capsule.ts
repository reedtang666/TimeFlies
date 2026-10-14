// Vercel Serverless Function: Cloud Time Capsule Storage (Upstash / Vercel KV)

export default async function handler(req: any, res: any) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Read Upstash / Vercel KV credentials injected automatically by Vercel
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!kvUrl || !kvToken) {
    return res.status(503).json({
      error: 'Vercel KV / Upstash Redis not configured on server',
      fallback: true,
    });
  }

  // 1. GET: Retrieve capsule data by id
  if (req.method === 'GET') {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing id query parameter' });
    }

    try {
      const redisRes = await fetch(`${kvUrl}/get/capsule:${encodeURIComponent(id)}`, {
        headers: {
          Authorization: `Bearer ${kvToken}`,
        },
      });

      const resultData = await redisRes.json();
      if (!resultData || !resultData.result) {
        return res.status(404).json({ error: 'Capsule not found' });
      }

      let parsed = resultData.result;
      if (typeof parsed === 'string') {
        try {
          parsed = JSON.parse(parsed);
        } catch {
          // keep as string
        }
      }

      return res.status(200).json({ success: true, data: parsed });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to read from KV' });
    }
  }

  // 2. POST: Save or update capsule data
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, data } = body || {};

      if (!data) {
        return res.status(400).json({ error: 'Missing data payload' });
      }

      // Generate a friendly slug or random 6-character id if not specified
      const capsuleId = (id || `baby-${Math.random().toString(36).slice(2, 8)}`).trim().toLowerCase();

      // Store in KV with 10 years expiration (effectively permanent)
      const saveRes = await fetch(`${kvUrl}/set/capsule:${encodeURIComponent(capsuleId)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(typeof data === 'string' ? data : JSON.stringify(data)),
      });

      const saveResult = await saveRes.json();

      return res.status(200).json({
        success: true,
        id: capsuleId,
        shareUrl: `?id=${capsuleId}`,
        result: saveResult,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to save to KV' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
