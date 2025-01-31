exports.handler = async function(event, context) {
  try {
    const url = new URL(event.request.url);
    const pathname = url.pathname;

    if (pathname === '/' || pathname === '/index.html') {
      return {
        statusCode: 200,
        body: 'Proxy is Running！Details：https://github.com/tech-shrimp/deno-api-proxy',
        headers: {
          'Content-Type': 'text/html',
        },
      };
    }

    const targetHost = 'https://api.groq.com/openai';
    const targetUrl = new URL(pathname, targetHost).href;

    const allowedHeaders = ['accept', 'content-type', 'authorization'];
    const headers = new Headers();
    for (const [key, value] of Object.entries(event.request.headers)) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }

    const response = await fetch(targetUrl, {
      method: event.request.method,
      headers: headers,
      body: event.request.body,
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Referrer-Policy', 'no-referrer');

    return {
      statusCode: response.status,
      body: await response.blob(),
      headers: Object.fromEntries(responseHeaders),
    };
  } catch (error) {
    console.error('Failed to fetch:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
      headers: {
        'Content-Type': 'text/plain',
      },
    };
  }
};
