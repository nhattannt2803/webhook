const fetch = require('node-fetch').default; // nếu dùng node-fetch v3 với CommonJS
require('dotenv').config();
const sharp = require('sharp');
const { URL } = require('url');
const AbortController = require('abort-controller');

const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

module.exports = {
  recognize: async function (req, res) {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: 'Missing GOOGLE_CLOUD_VISION_API_KEY' });
      }

      const imageUrl = req.body && req.body.imageUrl;
      if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });

      // Validate URL
      let parsed;
      try {
        parsed = new URL(imageUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid protocol');
      } catch (err) {
        return res.status(400).json({ error: 'Invalid imageUrl' });
      }

      // Timeout for fetch
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000); // 10s

      const imageResp = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (!imageResp.ok) {
        return res.status(400).json({ error: `Failed to fetch image: ${imageResp.status}` });
      }

      const buffer = await imageResp.buffer();

      // Check metadata and resize if needed
      const metadata = await sharp(buffer).metadata();
      const maxWidth = 1000;
      let resizedBuffer = buffer;

      if (metadata.width && metadata.width > maxWidth) {
        resizedBuffer = await sharp(buffer)
          .resize({ width: maxWidth })
          .jpeg({ quality: 80 }) // giảm nhẹ kích thước
          .toBuffer();
      } else {
        // ensure jpeg/png acceptable size, optionally convert to jpeg
        // resizedBuffer = await sharp(buffer).toBuffer();
      }

      // Optional: enforce max bytes (ví dụ 2MB) để không gửi payload quá lớn
      const maxBytes = 2 * 1024 * 1024;
      if (resizedBuffer.length > maxBytes) {
        return res.status(413).json({ error: 'Image too large after resizing' });
      }

      const encodedImage = resizedBuffer.toString('base64');

      const requestPayload = {
        requests: [
          {
            image: { content: encodedImage },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }] // hoặc TEXT_DETECTION
          }
        ]
      };

      const visionResponse = await fetch(visionApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
        // signal: optional abort controller for this request
      });

      if (!visionResponse.ok) {
        const txt = await visionResponse.text();
        return res.status(visionResponse.status).json({ error: 'Vision API error', details: txt });
      }

      const visionResult = await visionResponse.json();
      const resp = visionResult.responses && visionResult.responses[0];
      const text = resp && resp.fullTextAnnotation ? resp.fullTextAnnotation.text : (resp && resp.textAnnotations ? resp.textAnnotations.map(t => t.description).join('\n') : '');

      return res.json({ text });
    } catch (err) {
      // distinguish abort error
      if (err.name === 'AbortError') {
        return res.status(504).json({ error: 'Timeout fetching image' });
      }
      console.error(err);
      return res.status(500).json({ error: err.message || 'Internal error' });
    }
  }
};
