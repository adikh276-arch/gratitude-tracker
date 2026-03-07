#!/bin/sh
set -e

echo "Injecting runtime environment variables..."

# Replace placeholders in index.html and all JS files in the static folder
# Using | as delimiter because DATABASE_URL contains / and &
find /usr/share/nginx/html/gratitude_tracker -type f \( -name "*.html" -o -name "*.js" \) -exec sed -i "s|__VITE_DATABASE_URL__|${DATABASE_URL}|g" {} +
find /usr/share/nginx/html/gratitude_tracker -type f \( -name "*.html" -o -name "*.js" \) -exec sed -i "s|__VITE_NEON_PROJECT_ID__|${NEON_PROJECT_ID}|g" {} +
find /usr/share/nginx/html/gratitude_tracker -type f \( -name "*.html" -o -name "*.js" \) -exec sed -i "s|__VITE_NEON_API_KEY__|${NEON_API_KEY}|g" {} +

echo "Injection complete. Starting Nginx..."

exec "$@"
