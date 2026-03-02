FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

FROM base AS dev_deps
RUN npm install --production=false

FROM base AS build
COPY --from=dev_deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS release
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE ${PORT}
CMD ["node", "dist/main.js"]