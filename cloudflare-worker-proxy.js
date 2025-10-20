// Cloudflare Worker to proxy GL Bajaj API requests
// Deploy this at: https://workers.cloudflare.com/
//
// This worker acts as a proxy to avoid CORS issues when accessing
// the GL Bajaj API from your frontend application.

export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return handleCORS(request);
    }

    // Configure allowed origins (update these with your domains)
    const allowedOrigins = [
      "https://yashmalik.tech",
      "https://codeblech.github.io",
      "http://localhost:5173", // Local development
      "http://localhost:4173", // Vite preview
    ];

    const origin = request.headers.get("Origin");

    // Check if origin is allowed
    if (!allowedOrigins.includes(origin)) {
      return new Response("Forbidden - Origin not allowed", { status: 403 });
    }

    try {
      const url = new URL(request.url);

      // Extract the path after /api/glbajaj
      // e.g., /api/glbajaj/Login -> /ISIMGLB/Login
      const path = url.pathname.replace(/^\/api\/glbajaj/, "/ISIMGLB");

      // Construct the target URL
      const targetUrl = `https://glbg.servergi.com:8072${path}${url.search}`;

      console.log(`Proxying request to: ${targetUrl}`);

      // Forward the request to the GL Bajaj server
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : null,
      });

      // Make the request to the target server
      const response = await fetch(modifiedRequest);

      // Get the response body
      const body = await response.text();

      // Return the response with CORS headers
      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
        },
      });
    } catch (error) {
      console.error("Proxy error:", error);
      return new Response(
        JSON.stringify({
          error: "Proxy error",
          message: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }
  },
};

function handleCORS(request) {
  const allowedOrigins = [
    "https://yashmalik.tech",
    "https://codeblech.github.io",
    "http://localhost:5173",
    "http://localhost:4173",
  ];

  const origin = request.headers.get("Origin");

  if (!allowedOrigins.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
}
