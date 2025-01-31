exports.handler = async (event) => {
  const url = new URL(event.headers.get('x-nf-url') || event.headers.get('Referer') || event.headers.get('origin'));
  const pathname = url.pathname;

  // 如果请求路径是'/'或'/index.html'，返回一个简单的响应
  if (pathname === '/' || pathname === '/index.html') {
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'text/html',
        'Referrer-Policy': 'no-referrer'
      },
      body: 'Proxy is Running！Details：https://github.com/tech-shrimp/deno-api-proxy'
    };
  }

  // 提取目标主机和路径
  const targetHost = pathname.split('/')[1];
  const targetPath = pathname.split('/').slice(2).join('/');
  const targetUrl = `https://${targetHost}/${targetPath}`;

  try {
    // 处理请求头，过滤允许的头信息
    const headers = new Headers();
    const allowedHeaders = ['accept', 'content-type', 'authorization'];
    for (const [key, value] of event.headers) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }

    // 发送请求到目标URL
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: headers,
      body: event.body
    });

    // 处理响应头
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Referrer-Policy', 'no-referrer');

    // 返回响应
    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: await response.text()
    };

  } catch (error) {
    console.error('Failed to fetch:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Internal Server Error'
    };
  }
};
