#!/bin/sh

# Load .env file
set -a
. /.env
set +a

# Now use the values
echo "Updating DuckDNS for $DUCKDNS_DOMAIN..."
curl -k "https://www.duckdns.org/update?domains=$DUCKDNS_DOMAIN&token=$DUCKDNS_TOKEN&ip=" >> /var/log/duckdns.log 2>&1
