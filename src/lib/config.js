export const DIGEST_API_URL = import.meta.env.VITE_DIGEST_API_URL?.trim() || ''

export function assertDigestApiConfigured() {
  if (!DIGEST_API_URL) {
    throw new Error('Digest API is not configured. Rebuild the extension with VITE_DIGEST_API_URL.')
  }
}
