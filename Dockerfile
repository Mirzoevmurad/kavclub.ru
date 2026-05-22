# Base node image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy configuration files and source code
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Build the project
RUN npm run build

# Expose port and run server
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npm start"]
