exports.handler = async (event) => {
  const { method, headers, body, path } = event;

  // ...

  const targetUrl = `https://api.groq.com/openai${originalPath}`;

  const forwardedHeaders = new Headers();
  const allowedHeaders = ['accept', 'content-type', 'authorization'];
  Object.entries(headers).forEach(([key, value]) => {
    if (allowedHeaders.includes(key.toLowerCase())) {
      forwardedHeaders.set(key, value);
    }
  });

  let requestBody = body;
  if (method === 'GET' || method === 'HEAD') {
    requestBody = null; // Remove request body for GET/HEAD requests
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: forwardedHeaders,
      body: requestBody,
    });

    // ...
  } catch (error) {
    console.error(`Failed to fetch: ${error}`);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
