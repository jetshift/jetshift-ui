FROM node:20-alpine

WORKDIR /app

# Install dependencies early (for caching)
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install

# Copy source code
COPY . .

# Expose dev server port
EXPOSE 3000

# Enable hot reload
CMD ["npm", "run", "dev"]
