# Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173
CMD ["npm", "run", "start"]