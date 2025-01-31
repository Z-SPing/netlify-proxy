exports.handler = async (event) => {
  const { method, headers, body, path } = event;

  const originalPath = path.replace(/^\/\.netlify\/functions\/proxy/, '');
  const targetUrl = `https://api.groq.com/openai${originalPath}`;

  const forwardedHeaders = new Headers();
  const allowedHeaders = ['accept', 'content-type', 'authorization'];
  Object.entries(headers).forEach(([key, value]) => {
    if (allowedHeaders.includes(key.toLowerCase())) {
      forwardedHeaders.set(key, value);
    }
  });

  let fetchOptions;
  if (method === 'GET' || method === 'HEAD') {
    fetchOptions = {
      method,
      headers: forwardedHeaders,
    };
  } else {
    fetchOptions = {
      method,
      headers: forwardedHeaders,
      body,
    };
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);

    // ...
  } catch (error) {
    console.error(`Failed to fetch: ${error}`);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
