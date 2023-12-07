import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const port = 6541
const targetUrl = 'https://basaribet.work';
const localUrl = 'http://localhost:3679'; // veya istediğiniz yerel URL

app.use(
  '*',
  (req, res, next) => {
    // Önceki URL'i sakla
    const originalUrl = req.originalUrl;

    // Middleware'yi çalıştır
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    })(req, res, () => {
      // Middleware sonrasında, URL'ler arasındaki farka bak
      const isRedirect = req.originalUrl !== originalUrl;

      if (isRedirect) {
        // Eğer bir yönlendirme varsa ve originalUrl farklıysa, localUrl ile replace yap
        req.url = req.url.replace(targetUrl, localUrl);
        console.log('Yönlendirme işlemi gerçekleşti. Yeni URL:', req.url);
      } else {
        console.log('Yönlendirme olmadı.');
      }

      // Diğer middleware'leri devam ettir
      next();
    });
  }
);

app.listen(port, () => {
  console.log('Proxy server is running on http://localhost:'+port);
});
