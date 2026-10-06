import app from '../server.ts';

export default function handler(req: any, res: any) {
  try {
    // 1. Mark body as parsed if Vercel Node runtime pre-parsed it
    if (req.body && typeof req.body === 'object') {
      (req as any)._body = true;
    }

    // 2. Restore original requested API route if Vercel rewrote req.url
    const matchedPath = req.headers?.['x-matched-path'] || req.headers?.['x-vercel-matched-path'];
    if (matchedPath && typeof matchedPath === 'string' && !matchedPath.includes('index.html')) {
      req.url = matchedPath;
    } else if (req.url === '/api' || req.url === '/api/' || req.url?.startsWith('/api/index')) {
      const orig = req.headers?.['x-original-url'] || req.headers?.['x-forwarded-uri'];
      if (orig && typeof orig === 'string') {
        req.url = orig;
      }
    }

    return app(req, res);
  } catch (err: any) {
    console.error('[Vercel Serverless Handler Error]:', err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'সার্ভার সার্ভারলেস এক্সিকিউশনে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        error: err?.message || String(err)
      });
    }
  }
}
