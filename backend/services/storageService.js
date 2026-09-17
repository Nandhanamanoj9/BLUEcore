import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { getStorageBucket, isFirebaseMockMode } from '../config/firebase.js';

export async function uploadFileToStorage(file, folder = 'quotes', subFolder = '') {
  if (!file) return null;

  const timestamp = Date.now();
  const randomId = crypto.randomUUID().slice(0, 8);
  const ext = path.extname(file.originalname).toLowerCase();
  const safeBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeFilename = `${safeBaseName}_${timestamp}_${randomId}${ext}`;

  // Build storage path
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  let storagePath = `${folder}/${safeFilename}`;
  if (folder === 'quotes' && subFolder) {
    storagePath = `${folder}/${year}/${month}/${subFolder}/${safeFilename}`;
  } else if (subFolder) {
    storagePath = `${folder}/${subFolder}/${safeFilename}`;
  }

  const bucket = getStorageBucket();

  // If live Firebase Storage is available
  if (bucket && !isFirebaseMockMode()) {
    const fileRef = bucket.file(storagePath);
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Make public or get public URL if bucket permissions allow, or signed URL
    let fileUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
    try {
      const [signedUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-09-2030'
      });
      fileUrl = signedUrl;
    } catch (e) {
      // Fall back to standard storage URL
    }

    return {
      originalName: file.originalname,
      fileName: safeFilename,
      storagePath,
      fileUrl,
      contentType: file.mimetype,
      size: file.size
    };
  }

  // Fallback mode: save locally to backend/uploads for development
  const localUploadDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(localUploadDir)) {
    fs.mkdirSync(localUploadDir, { recursive: true });
  }

  // Persist file buffer to local disk
  if (file.buffer) {
    try {
      fs.writeFileSync(path.join(localUploadDir, safeFilename), file.buffer);
    } catch (writeErr) {
      console.error('[Storage Error] Failed to write file locally:', writeErr.message);
    }
  }

  let fullUrl = null;

  // 1. High-speed Direct Image CDN for images (Instant zero-wait direct loading on mobile)
  if (file.buffer && file.mimetype && file.mimetype.startsWith('image/')) {
    try {
      const base64 = file.buffer.toString('base64');
      const imgForm = new FormData();
      imgForm.append('key', '6d207e02198a847aa98d0a2a901485a5');
      imgForm.append('action', 'upload');
      imgForm.append('source', base64);
      imgForm.append('format', 'json');

      const imgRes = await fetch('https://freeimage.host/api/1/upload', {
        method: 'POST',
        body: imgForm,
        signal: AbortSignal.timeout(8000)
      });

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        if (imgData?.image?.url) {
          fullUrl = imgData.image.url; // e.g. https://iili.io/xyz.jpg (direct high-speed Cloudflare CDN)
        }
      }
    } catch (imgErr) {
      console.warn('[Storage] Image CDN upload skipped:', imgErr.message);
    }
  }

  // 2. Documents / fallback cloud upload
  if (!fullUrl && file.buffer) {
    try {
      const blob = new Blob([file.buffer], { type: file.mimetype || 'application/octet-stream' });
      const formData = new FormData();
      formData.append('file', blob, safeFilename);

      const cloudRes = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(7000)
      });

      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        if (cloudData?.data?.url) {
          fullUrl = cloudData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        }
      }
    } catch (mirrorErr) {
      console.warn('[Storage] Cloud mirror upload skipped:', mirrorErr.message);
    }
  }

  // Fallback to local network IP if cloud upload is unreachable
  if (!fullUrl) {
    const port = process.env.PORT || 5000;
    let localIp = 'localhost';
    try {
      const { networkInterfaces } = await import('os');
      const nets = networkInterfaces();
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          if ((net.family === 'IPv4' || net.family === 4) && !net.internal) {
            localIp = net.address;
            break;
          }
        }
        if (localIp !== 'localhost') break;
      }
    } catch (e) {
      // fallback to localhost
    }

    const backendBase = process.env.BACKEND_PUBLIC_URL || `http://${localIp}:${port}`;
    fullUrl = `${backendBase.replace(/\/+$/, '')}/uploads/${safeFilename}`;
  }

  return {
    originalName: file.originalname,
    fileName: safeFilename,
    storagePath: `uploads/${safeFilename}`,
    fileUrl: fullUrl,
    contentType: file.mimetype,
    size: file.size
  };
}

export default {
  uploadFileToStorage
};
