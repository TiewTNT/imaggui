FROM alpine:latest

# Install curl and cron
RUN apk add --no-cache curl busybox-suid

# Set working directory
WORKDIR /

# Copy files into container
COPY duck.sh /duck.sh
COPY .env /.env
COPY crontab.txt /etc/crontabs/root

# Give permissions
RUN chmod +x /duck.sh

# Start cron in foreground
CMD ["crond", "-f"]