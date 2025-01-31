const https = require('https');

exports.handler = async (event) => {
  const { method, headers, body, path } = event;

  const originalPath = path.replace(/^\/\.netlify\/functions\/proxy/, '');
  const targetUrl = `https://api.groq.com/openai${originalPath}`;

  const forwardedHeaders = {};
  const allowedHeaders = ['accept', 'content-type', 'authorization'];
  Object.keys(headers).forEach((key) => {
    if (allowedHeaders.includes(key.toLowerCase())) {
      forwardedHeaders[key] = headers[key];
    }
  });

  const options = {
    method,
    hostname: 'api.groq.com',
    path: originalPath,
    headers: forwardedHeaders,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    options.body = body;
  }

  try {
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        const response = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseBody,
        };
        return response; // <--- Return statement should be here
      });
    });

    req.on('error', (error) => {
      console.error(`Failed to fetch: ${error}`);
      return {
        statusCode: 500,
        body: 'Internal Server Error',
      };
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  } catch (error) {
    console.error(`Failed to fetch: ${error}`);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
