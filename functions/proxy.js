exports.handler = async (event) => {
  const targetUrl = 'https://api.groq.com/openai';
  const { method, headers, body, path } = event;

  // Remove the proxy path from the original URL
  const originalPath = path.replace(/^\/\.netlify\/functions\/proxy/, '');

  // Construct the final URL by adding the original path to the target URL
  const finalUrl = `${targetUrl}${originalPath}`;

  const options = {
    method,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(finalUrl, options);
  const responseBody = await response.text();

  return {
    statusCode: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
    body: responseBody,
  };
};
