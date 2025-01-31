const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { httpMethod, headers, body, queryStringParameters } = event;

  // 构建目标API的URL
  const targetUrl = 'https://api.groq.com/openai';

  // 设置请求选项
  const requestOptions = {
    method: httpMethod,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    requestOptions.body = body;
  }

  if (queryStringParameters) {
    const queryParams = new URLSearchParams(queryStringParameters).toString();
    targetUrl += `?${queryParams}`;
  }

  try {
    // 发送请求到目标API
    const response = await fetch(targetUrl, requestOptions);

    // 获取响应数据
    const responseData = await response.text();

    // 返回响应
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
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
