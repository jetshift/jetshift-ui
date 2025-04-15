# Step 1: Build the Next.js app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install

# Copy the entire project
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Use a lightweight image to serve the Next.js app
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the default Next.js port
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]
