# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build


# Stage 2: Python backend with built frontend and ImageMagick
FROM python:3.11-alpine

# 1) Install ImageMagick, Fontconfig and DejaVu fonts
RUN apk add --no-cache \
      imagemagick \
      fontconfig \
      libpng libjpeg-turbo libwebp libheif openjpeg tiff ghostscript \
      build-base python3-dev libffi-dev musl-dev\
      font-dejavu \
      mkfontscale \
      mkfontdir 

# Rebuild font cache so ImageMagick can auto-discover DejaVu
RUN fc-cache -f

WORKDIR /app
COPY backend ./backend
COPY --from=frontend-builder /app/frontend/build ./frontend/build
RUN pip install --no-cache-dir -r backend/requirements.txt

EXPOSE 10000
WORKDIR backend/app
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"]