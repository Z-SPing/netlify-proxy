exports.handler = async (event) => {
  const { httpMethod, path, headers, body } = event;

  const targetPath = `https://api.groq.com/openai${path}`;

  try {
    const response = await fetch(targetPath, {
      method: httpMethod,
      headers: {
        ...headers,
        Host: 'api.groq.com',
      },
      body: body,
    });

    const responseBody = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type'),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE'
      },
      body: responseBody,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: `错误：${error.message}`,
    };
  }
};
