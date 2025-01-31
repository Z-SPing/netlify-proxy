// proxy.js

exports.handler = async function(event, context) {
  try {
    const url = new URL(event.request.url);
    const pathname = url.pathname;

    // 处理根路径请求
    if (pathname === '/' || pathname === '/index.html') {
      return {
        statusCode: 200,
        body: 'Proxy is Running！Details：https://github.com/tech-shrimp/deno-api-proxy',
        headers: {
          'Content-Type': 'text/html',
        },
      };
    }

    // 构建目标URL
    const targetHost = 'https://api.groq.com/openai';
    const targetUrl = new URL(pathname, targetHost).href;

    // 处理请求头
    const allowedHeaders = ['accept', 'content-type', 'authorization'];
    const headers = new Headers();
    for (const [key, value] of Object.entries(event.request.headers)) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }

    // 转发请求
    const response = await fetch(targetUrl, {
      method: event.request.method,
      headers: headers,
      body: event.request.body,
    });

    // 处理响应头
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Referrer-Policy', 'no-referrer');

    return {
      statusCode: response.status,
      body: await response.blob(),
      headers: Object.fromEntries(responseHeaders),
    };
  } catch (error) {
    console.error('Failed to fetch:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
      headers: {
        'Content-Type': 'text/plain',
      },
    };
  }
};
