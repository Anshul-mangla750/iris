/**
 * AI Service HTTP Client — proxies requests to the FastAPI AI service.
 * Falls back gracefully when the AI service is not running.
 */
import axios from 'axios';
import config from '../config.js';

const ai = axios.create({
  baseURL: config.aiServiceUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Safe GET from AI service — returns null on failure (never throws).
 */
export async function aiGet(path, params = {}) {
  try {
    const res = await ai.get(path, { params });
    return res.data;
  } catch {
    return null;
  }
}

/**
 * Safe POST to AI service — returns null on failure.
 */
export async function aiPost(path, body = {}) {
  try {
    const res = await ai.post(path, body);
    return res.data;
  } catch {
    return null;
  }
}

/**
 * Safe PATCH to AI service.
 */
export async function aiPatch(path, body = {}) {
  try {
    const res = await ai.patch(path, body);
    return res.data;
  } catch {
    return null;
  }
}

/**
 * Safe DELETE to AI service.
 */
export async function aiDelete(path) {
  try {
    const res = await ai.delete(path);
    return res.data;
  } catch {
    return null;
  }
}

/**
 * Proxy stream (for camera MJPEG).
 */
export async function aiStream(path) {
  return ai.get(path, { responseType: 'stream' });
}

export default ai;
