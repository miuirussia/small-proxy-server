import { resolve } from 'path';
import express from 'express';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const HOST = process.env['SPS_PROXY_HOST'] || 'localhost';
const PORT = 'SPS_PROXY_PORT' in process.env ? Number(process.env['SPS_PROXY_PORT']) : 3001;
const API_SERVICE_URL = process.env['SPS_API_SERVICE_URL'] || 'http://localhost:3000/api';
const INDEX_SERVICE_URL = process.env['SPS_INDEX_SERVICE_URL'] || 'http://localhost:3000';
const STATIC_DIR = process.env['SPS_STATIC_DIR'] || resolve('.');

app.use(morgan('dev'));

app.get('/status', (_req, res) => {
  res.status(200).send('ok!');
});

app.use('/api', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
}));

app.use('/static', express.static(STATIC_DIR));

app.use(createProxyMiddleware({
  target: INDEX_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '.*': '',
  },
}));

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
