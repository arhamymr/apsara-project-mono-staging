'use client';

/**
 * Backward Compatibility Re-export Module
 *
 * This file maintains the original import path for consumers while the
 * WebContainer implementation has been refactored into smaller, focused modules.
 *
 * Module structure:
 * - webcontainer/singleton.ts      - WebContainer instance management (one per page)
 * - webcontainer/boilerplate.ts    - React + Vite template for sandbox projects
 * - webcontainer/utils.ts          - File tree conversion and hashing utilities
 * - webcontainer/file-validator.ts - Package.json validation and fixes
 * - webcontainer/dev-server.ts     - Dev server startup and dependency installation
 * - webcontainer/use-webcontainer.ts - Main hook orchestrating the sandbox lifecycle
 */
export { useWebContainer } from './webcontainer';
export type { SandboxStatus, UseWebContainerOptions, UseWebContainerReturn } from './webcontainer';
