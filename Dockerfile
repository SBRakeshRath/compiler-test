# --- Stage 1: Build Stage ---
    FROM node:current-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    
    # Install dependencies (including devDependencies for build)
    RUN npm install
    
    COPY . .
    
    # Build the TypeScript code
    RUN npm run build
    
    # --- Stage 2: Production Stage ---
    FROM node:current-alpine
    
    WORKDIR /app
    
    # Copy only the package.json and package-lock.json for production dependencies
    COPY package*.json ./
    
    # Install ONLY production dependencies
    RUN npm install --production
    
    # Copy the built JavaScript from the builder stage
    COPY --from=builder /app/dist ./dist
    
    EXPOSE 8080
    
    CMD [ "npm", "start" ]