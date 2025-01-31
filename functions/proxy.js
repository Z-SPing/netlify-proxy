exports.handler = async (event) => {
  const url = new URL(event.headers.get('x-nf-url') || event.headers.get('Referer') || event.headers.get('origin'));
  const pathname = url.pathname;

  console.log('Pathname:', pathname);

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

  const targetHost = pathname.split('/')[1];
  const targetPath = pathname.split('/').slice(2).join('/');
  const targetUrl = `https://${targetHost}/${targetPath}`;

  console.log('Target URL:', targetUrl);
  console.log('Target Host:', targetHost);
  console.log('Target Path:', targetPath);

  // ... 其他代码 ...
};
