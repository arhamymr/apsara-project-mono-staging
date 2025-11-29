// Global type declarations for Next.js application
// Note: Removed ziggy-js route helper as it's Laravel/Inertia specific

declare global {
  interface Window {
    axios: typeof axios;
  }
}

export {};
