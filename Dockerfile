# Stage 1: Base image for Bun
FROM oven/bun:1 as base

# Set the working directory
WORKDIR /app

# Copy the root lock file and package manifest
COPY bun.lockb ./

# Copy the entire project (monorepo structure)
COPY . .

# Install dependencies for all workspaces (using Bun in this case)
RUN bun install

# Stage 2: Backend Build
FROM base as backend

WORKDIR /app/backend

# Copy only the frontend code
COPY --from=base /app/packages/backend ./

# Expose the port (assuming your backend runs on port 3000)
EXPOSE 3000

# Command to start the backend
CMD ["bun", "start"]

# Stage 3: Frontend Build (Next.js)
FROM node:18-alpine as frontend

WORKDIR /app/frontend

# Copy only the frontend code
COPY --from=base /app/packages/frontend ./

# Install frontend dependencies
RUN npm install

# Build the frontend
RUN npm run build

# Expose the port (assuming Next.js default port 3000)
EXPOSE 3000

# Command to run the frontend
CMD ["npm", "start"]

# Stage 4: Final Stage for running both (optional, for simpler dev setup)
FROM base as final

WORKDIR /app

# Expose both frontend and backend ports
EXPOSE 3000 3001

# Optionally run both frontend and backend concurrently
CMD ["sh", "-c", "cd /app/pacakges/backend && bun run src/index.ts & cd /app/packages/frontend && npm run start"]
