# --- Stage 1: Build Stage ---
    FROM node:current-alpine AS builder

    WORKDIR /app
    
    # Copy dependency definitions
    COPY package*.json ./
    
    # Install all dependencies (including devDependencies)
    RUN npm install
    
    # Copy the rest of the source code
    COPY . .
    
    # Build the TypeScript project
    RUN npm run build
    
    # --- Stage 2: Production Stage ---
    FROM ubuntu:latest
    
    # Install Node.js, npm, and curl
    RUN apt-get update \
      && apt-get install -y nodejs npm curl \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*
    
    # Download and install the delirium binary
    RUN curl -L -o /usr/local/bin/delirium "https://storage.googleapis.com/delirium-runner/delirium-1.0.0" \
      && chmod +x /usr/local/bin/delirium
    
    WORKDIR /app
    
    # Copy only package files and install production dependencies
    COPY package*.json ./
    RUN npm install --production
    
    # Copy the compiled output from the builder
    COPY --from=builder /app/dist ./dist
    
    # Expose app port
    EXPOSE 8080
    
    # Start the app
    CMD ["npm", "start"]
    