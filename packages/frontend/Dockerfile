FROM node:20-slim AS base

RUN apt-get update && apt-get install ca-certificates -y

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.11.0 --activate && pnpm add -g turbo@^2

ARG CI
ENV CI $CI

FROM base AS base_build
COPY pnpm-workspace.yaml pnpm-lock.yaml .npmrc /app/
COPY ./packages/ /app/packages
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store/ pnpm --filter=. --filter='./packages/*' install --frozen-lockfile
FROM base_build AS app_build
COPY .eslintrc.cjs package.json Dockerfile docker-compose.yml turbo.json /app/
COPY ./apps/frontend/ /app/apps/frontend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store/ pnpm --filter=frontend install --frozen-lockfile
RUN turbo run build --filter=frontend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store/ pnpm --filter=frontend --prod deploy /prod/frontend

#FROM base AS finalize
#COPY --from=app_build /prod/frontend /prod/frontend
WORKDIR /prod/frontend
CMD ["pnpm", "start"]
