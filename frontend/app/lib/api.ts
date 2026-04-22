// Production: Set NEXT_PUBLIC_API_URL=https://intelx-wxil.onrender.com in Vercel
// Local dev: Falls back to http://localhost:8000
const rawApiUrl =
	process.env.NEXT_PUBLIC_API_URL ??
	(process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000");

export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");