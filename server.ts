import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

// Auto-bootstrap TSX runner if executed directly via `node server.ts`
if (!process.env._TSX_BOOTSTRAPPED && !process.execArgv.some((a) => a.includes('tsx'))) {
  const child = spawn(
    process.execPath,
    ['--import', 'tsx', fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    {
      stdio: 'inherit',
      env: { ...process.env, _TSX_BOOTSTRAPPED: '1' },
    }
  );
  process.on('SIGTERM', () => child.kill('SIGTERM'));
  process.on('SIGINT', () => child.kill('SIGINT'));
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 0);
  });
  // Halt parent execution while child runs
  await new Promise(() => {});
}

// Below this point, TSX module resolution is active in the runtime
const { default: dotenv } = await import('dotenv');
dotenv.config();

const { default: express } = await import('express');
const { createServerApp } = await import('./server/src/index');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, 'dist');

// Cloud Run injects PORT (e.g. 8080); local dev uses 3000
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction =
  process.env.NODE_ENV === 'production' ||
  Boolean(process.env.K_SERVICE) ||
  fs.existsSync(path.join(distPath, 'index.html'));

async function startServer() {
  const app = createServerApp();

  if (!isProduction) {
    // Mount Vite dev server middlewares for local development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`🇮🇳  BHARATPULSE AI - Server running on port ${PORT}`);
    console.log(`     Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`     India's AI Operating System for Future Cities`);
    console.log(`==================================================\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start BharatPulse server:', err);
  process.exit(1);
});
