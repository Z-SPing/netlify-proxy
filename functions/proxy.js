exports.handler = async (event) => {
  const { method, headers, body, path } = event;

  // Remove the proxy path from the original URL
  const originalPath = path.replace(/^\/\.netlify\/functions\/proxy/, '');

  // Construct the final URL by adding the original path to the target URL
  const targetUrl = `https://api.groq.com/openai${originalPath}`;

  // Create a new headers object to forward selected headers
  const forwardedHeaders = new Headers();
  const allowedHeaders = ['accept', 'content-type', 'authorization'];
  for (const [key, value] of headers.entries()) {
    if (allowedHeaders.includes(key.toLowerCase())) {
      forwardedHeaders.set(key, value);
    }
  }

  try {
    // Forward the request to the target API endpoint
    const response = await fetch(targetUrl, {
      method,
      headers: forwardedHeaders,
      body,
    });

    // Create a new response object to return to the client
    const responseBody = await response.text();
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Referrer-Policy', 'no-referrer');

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: responseBody,
    };
  } catch (error) {
    console.error('Failed to fetch:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
