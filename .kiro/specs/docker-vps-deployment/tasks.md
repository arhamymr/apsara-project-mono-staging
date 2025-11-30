# Implementation Plan

- [x] 1. Update Next.js configuration for standalone output



  - [x] 1.1 Modify next.config.mjs to add output: 'standalone'

    - Add `output: 'standalone'` to the Next.js config object
    - Keep existing `transpilePackages` configuration
    - _Requirements: 1.4_

- [x] 2. Create Docker configuration for Next.js web app


  - [x] 2.1 Create Dockerfile for web app (apps/web)


    - Create `Dockerfile` in project root targeting web app
    - Stage 1 (base): Use node:20-alpine, enable corepack for pnpm
    - Stage 2 (deps): Copy package files, install dependencies with pnpm
    - Stage 3 (builder): Copy source, build with turbo, prune for standalone
    - Stage 4 (runner): Copy standalone output, set non-root user, configure CMD
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4_

- [x] 3. Create Docker configuration for Mastra AI backend



  - [x] 3.1 Create Dockerfile.mastra for Mastra app

    - Create `Dockerfile.mastra` in project root
    - Use node:22-alpine (Mastra requires Node 22+)
    - Install dependencies with pnpm
    - Build Mastra app with `mastra build`
    - Run with `mastra start` command
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 4. Create shared Docker files



  - [x] 4.1 Create .dockerignore file

    - Exclude node_modules, .git, .next, .turbo, .mastra and other unnecessary files
    - Optimize build context size for faster builds
    - _Requirements: 4.4_

- [x] 5. Create Docker Compose configuration



  - [x] 5.1 Create docker-compose.yml with both services

    - Define `web` service for Next.js app (port 3000)
    - Define `mastra` service for AI backend (port 4111)
    - Configure restart policy to unless-stopped for both
    - Configure env_file for .env support
    - Set up service dependencies if needed
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 2.1_
  - [x] 5.2 Create .env.example template


    - Document required environment variables for both services
    - Include NODE_ENV, PORT, HOSTNAME defaults
    - Include Mastra-specific variables (API keys, database URL)
    - _Requirements: 2.3, 3.3_

- [x] 6. Create Docker cleanup scripts for VPS storage management



  - [x] 6.1 Create scripts/docker-cleanup.sh

    - Remove unused Docker images (dangling images)
    - Remove stopped containers
    - Remove unused volumes
    - Remove build cache
    - Add option for aggressive cleanup (all unused images)
    - _Requirements: 4.4_

  - [x] 6.2 Create scripts/deploy.sh for automated deployment

    - Pull latest code
    - Build new images
    - Stop old containers
    - Start new containers
    - Run cleanup after successful deployment
    - _Requirements: 3.1, 4.4_

- [x] 7. Create deployment documentation


  - [x] 7.1 Create DOCKER.md with deployment instructions


    - Document build commands for both services
    - Document run commands
    - Document environment variable configuration
    - Include VPS deployment steps
    - Explain how web and mastra services interact
    - Document cleanup commands and automation
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 8. Checkpoint - Verify Docker build works



  - Ensure Docker build completes successfully for both services
  - Verify containers start and applications are accessible
  - Verify cleanup script works correctly
  - Ask the user if questions arise
