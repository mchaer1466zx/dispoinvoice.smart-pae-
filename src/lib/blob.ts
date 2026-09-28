// Lightweight wrapper to re-export Vercel Blob helpers used across the app.
// This lets other modules import from '@/lib/blob' instead of directly from
// '@vercel/blob', keeping imports consistent and easier to mock in tests.

export { put, del } from "@vercel/blob";
