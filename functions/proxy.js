exports.handler = async (event) => {
  const url = new URL(event.headers.get('x-nf-url') || event.headers.get('Referer') || event.headers.get('origin'));
  const pathname = url.pathname;

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

  // 根据新的路径配置，event.path为/api/{targetHost}/{targetPath}
  const path = event.path;
  const parts = path.split('/');
  const targetHost = parts[2]; // 获取目标主机，例如 'api.groq.com'
  const targetPath = parts.slice(3).join('/'); // 获取目标路径，例如 'openai/chat/completions'
  const targetUrl = `https://${targetHost}/${targetPath}`;

  // 添加调试日志
  console.log('Path:', path);
  console.log('Target Host:', targetHost);
  console.log('Target Path:', targetPath);
  console.log('Target URL:', targetUrl);

  // 发送请求到目标URL并返回响应
  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body,
    });
    
    return {
      statusCode: response.status,
      headers: response.headers.raw(),
      body: await response.text(),
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'text/plain',
      },
      body: 'Proxy error occurred. Please check the logs.',
    };
  }
};
