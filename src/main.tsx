import './index.css';

import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import the generated route tree
import { routeTree } from './routeTree.gen.ts';

const hashHistory = createHashHistory();
const router = createRouter({
  routeTree,
  history: hashHistory,
  basepath: '/',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
