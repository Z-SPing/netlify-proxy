exports.handler = async (event) => {
//  const targetUrl = 'https://api.groq.com/openai';
  const targetUrl = 'https://api.groq.com/';
  const { method, headers, body } = event;

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

  const response = await fetch(targetUrl, options);
  const responseBody = await response.text();

  return {
    statusCode: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
    body: responseBody,
  };
};
