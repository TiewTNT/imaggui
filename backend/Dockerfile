FROM python:3.11-alpine

# 1) Install ImageMagick, Fontconfig and DejaVu fonts
RUN apk add --no-cache \
    imagemagick \
    fontconfig \
    libpng libjpeg-turbo libwebp libheif openjpeg tiff ghostscript \
    build-base python3-dev libffi-dev musl-dev \
    font-dejavu \
    mkfontscale mkfontdir \
    librsvg

# Rebuild font cache so ImageMagick can auto-discover DejaVu
RUN fc-cache -f

WORKDIR /app
COPY . ./backend
COPY docker ./docker
RUN pip install --no-cache-dir -r backend/requirements.txt

# ImageTragick
RUN mkdir -p /etc/ImageMagick-7 && cp docker/policy.xml /etc/ImageMagick-7/policy.xml


EXPOSE 10000
WORKDIR /app/backend/app
RUN python -m compileall .


CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"]