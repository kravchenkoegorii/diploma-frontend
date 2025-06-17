import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Providers } from './providers/index.tsx';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { STAGE, STAGES } from './constants/index.ts';
import VConsole from 'vconsole';

if (import.meta.env.VITE_STAGE === 'development') {
  console.log('import.meta.env.VITE_STAGE', import.meta.env.VITE_STAGE);
  new VConsole({ maxLogNumber: 1000 });
}

declare global {
  interface BigInt {
    toJSON(): number;
  }
}

BigInt.prototype.toJSON = function () {
  return Number(this);
};

const routers = {
  [STAGES.DEVELOPMENT]: HashRouter,
  [STAGES.STAGING]: HashRouter,
  [STAGES.PRODUCTION]: BrowserRouter,
};

const Router = routers[STAGE];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <Router>
        <App />
      </Router>
    </Providers>
  </StrictMode>
);
