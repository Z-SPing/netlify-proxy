exports.handler = async (event) => {
  const { httpMethod, path, headers, body } = event;

  // 定义代理规则，根据请求路径动态构建目标地址
  const targetHost = path.replace(/^\/|\/$/g, ''); // 移除路径的前后斜杠
  const targetUrl = `https://${targetHost}`;

  try {
    // 定义允许的请求头
    const allowedHeaders = ['accept', 'content-type', 'authorization'];
    const headersToForward = {};

    // 过滤并转发允许的请求头
    for (const [key, value] of Object.entries(headers)) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headersToForward[key] = value;
      }
    }

    // 构建代理请求的选项
    const options = {
      method: httpMethod,
      headers: headersToForward,
      body: body
    };

    // 发送代理请求
    const response = await fetch(targetUrl, options);

    // 处理响应
    const responseHeaders = response.headers;
    responseHeaders.set('Referrer-Policy', 'no-referrer');

    // 返回最终响应
    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: await response.text()
    };

  } catch (error) {
    console.error('代理请求失败:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Referrer-Policy': 'no-referrer'
      },
      body: `代理请求失败：${error.message}`
    };
  }
};
