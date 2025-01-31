exports.handler = async (event) => {
  const { httpMethod, path, headers, body } = event;

 // const targetPath = `https://api.groq.com/openai${path}`;
const targetPath = `https://api.groq.com/openai/v1/chat/completions${path}`;
  
  try {
    // 根据HTTP方法判断是否需要请求体
    const hasBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(httpMethod);
    const options = {
      method: httpMethod,
      headers: {
        ...headers,
        Host: 'api.groq.com',
        // 确保在GET和HEAD方法中不发送Content-Type和请求体
        ...(hasBody ? { 'Content-Type': headers['content-type'] } : {}),
      },
    };

    if (hasBody && body) {
      options.body = body;
    }

    const response = await fetch(targetPath, options);

    const responseBody = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type'),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
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
