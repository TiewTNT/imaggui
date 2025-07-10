# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build


# Stage 2: Python backend with built frontend and ImageMagick
FROM python:3.11-alpine

# Install ImageMagick and any Python dependencies
RUN apk add --no-cache \
    imagemagick \
    build-base

WORKDIR /app

# Copy backend
COPY backend ./backend

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Install Python deps from requirements.txt
RUN pip install -r backend/requirements.txt

# Expose whatever port your Python server runs on (assume 10000)
EXPOSE 10000

WORKDIR backend/app

# Start your server
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"]
