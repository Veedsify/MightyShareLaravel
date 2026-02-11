# Use PHP-FPM instead of Apache for Caddy
FROM php:8.4-fpm

# Set working directory
WORKDIR /app

# Install system dependencies including Caddy
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libssl-dev \
    libicu-dev \
    libsasl2-dev \
    pkg-config \
    zip \
    unzip \
    nodejs \
    npm \
    sqlite3 \
    libsqlite3-dev \
    libpq-dev \
    debian-keyring \
    debian-archive-keyring \
    apt-transport-https \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt-get update \
    && apt-get install -y caddy \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Install PHP extensions including MongoDB and intl
RUN docker-php-ext-install pdo_mysql pdo_sqlite pdo_pgsql mbstring exif pcntl bcmath gd zip intl

# Configure PHP uploads
RUN echo "upload_max_filesize=512M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size=512M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_file_uploads=20" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/uploads.ini

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . /app

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Build assets
RUN bun install && bun run build

# Create necessary directories for Livewire/Filament file uploads
RUN mkdir -p storage/app/public \
    && mkdir -p storage/app/livewire-tmp \
    && mkdir -p storage/framework/cache \
    && mkdir -p storage/framework/views \
    && mkdir -p storage/framework/sessions \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache

# Create storage link
RUN php artisan storage:link || true

# Set permissions (AFTER creating directories)
RUN chown -R www-data:www-data /app \
    && chmod -R 755 /app \
    && chmod -R 775 /app/storage \
    && chmod -R 775 /app/bootstrap/cache

# Build Filament assets (no caching yet - needs runtime env vars)
RUN php artisan filament:assets

# Create Caddyfile
RUN echo ':80 {\n\
    root * /app/public\n\
    encode gzip\n\
    php_fastcgi localhost:9000\n\
    file_server\n\
    }' > /etc/caddy/Caddyfile

# Expose port
EXPOSE 80

# Create an entrypoint script to handle runtime operations
RUN echo '#!/bin/bash\n\
    set -e\n\
    echo "Starting Laravel application..."\n\
    mkdir -p /app/storage/app/livewire-tmp\n\
    mkdir -p /app/storage/app/public\n\
    chown -R www-data:www-data /app/storage\n\
    chmod -R 775 /app/storage\n\
    php artisan config:clear\n\
    php artisan cache:clear\n\
    php artisan config:cache\n\
    php artisan route:cache\n\
    php artisan view:cache\n\
    php artisan filament:cache\n\
    php artisan icon:cache\n\
    composer dump-autoload -o\n\
    echo "Laravel application ready!"\n\
    echo "Starting PHP-FPM..."\n\
    php-fpm -D\n\
    echo "Starting Caddy..."\n\
    exec "$@"' > /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
