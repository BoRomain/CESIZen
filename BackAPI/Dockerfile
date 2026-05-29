# Build
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npx prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/src/app.js"]
