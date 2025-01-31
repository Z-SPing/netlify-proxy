const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { httpMethod, headers, body, path } = event;

  // 构建目标 API 的 URL
  const targetUrl = `https://api.groq.com/openai${path}`;

  // 设置请求选项
  const requestOptions = {
    method: httpMethod,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(JSON.parse(body)) : undefined,
  };

  try {
    // 发送请求到目标 API
    const response = await fetch(targetUrl, requestOptions);

    // 获取响应数据
    const responseData = await response.text();

    // 返回响应
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
      body: responseData,
    };
  } catch (error) {
    console.error('Error in proxy:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while proxying the request' }),
    };
  }
};
