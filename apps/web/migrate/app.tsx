import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Provider from './provider';

createInertiaApp({
  title: (title) => `${title}`,
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
    ),

  setup({ el, App, props }) {
    if (import.meta.env.SSR) {
      hydrateRoot(
        el,
        <Provider>
          <App {...props} />
        </Provider>,
      );
      return;
    }

    createRoot(el).render(
      <Provider>
        <App {...props} />
      </Provider>,
    );
  },
  progress: {
    color: '#46ff71ff',
  },
});
