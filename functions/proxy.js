exports.handler = async (event) => {
  const { method, headers, body, path } = event;

  console.log(`Received request: ${method} ${path}`);

  // Remove the proxy path from the original URL
  const originalPath = path.replace(/^\/\.netlify\/functions\/proxy/, '');

  // Construct the final URL by adding the original path to the target URL
  const targetUrl = `https://api.groq.com/openai${originalPath}`;
  console.log(`Target URL: ${targetUrl}`);

  // Create a new headers object to forward selected headers
  const forwardedHeaders = new Headers();
  const allowedHeaders = ['accept', 'content-type', 'authorization'];
  Object.entries(headers).forEach(([key, value]) => {
    if (allowedHeaders.includes(key.toLowerCase())) {
      forwardedHeaders.set(key, value);
    }
  });
  console.log(`Forwarded headers: ${JSON.stringify(forwardedHeaders)}`);

  try {
    // Forward the request to the target API endpoint
    const response = await fetch(targetUrl, {
      method,
      headers: forwardedHeaders,
      body,
    });
    console.log(`Response status: ${response.status}`);

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
    console.error(`Failed to fetch: ${error}`);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
