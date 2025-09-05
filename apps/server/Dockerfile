# Multi-stage build for the NestJS server (scaffolded)

FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies (monorepo root)
COPY package.json tsconfig.base.json ./
COPY apps/server/package.json ./apps/server/package.json
# If you add lockfiles later, copy them here for reproducible installs
# COPY package-lock.json ./
# COPY apps/server/package-lock.json ./apps/server/package-lock.json

# Note: Dependencies are not installed yet (no lockfiles and deps pending in tasks).
# This stage is mainly a scaffold; builds will succeed once deps are added in later tasks.

FROM base AS build
WORKDIR /app
COPY . .
# Generate Prisma client if schema/migrations are present
# RUN npm --workspace @oui-maitre/server run prisma:generate
# Build only the server workspace
# RUN npm --workspace @oui-maitre/server run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy built files if you ran the build above; for now we copy the repo (scaffold)
COPY . .

# Default command (will work after building and installing deps in later tasks)
CMD ["node", "apps/server/dist/main.js"]

