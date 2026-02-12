# Use Apache instead of Caddy
FROM php:8.4-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    libpq-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Install PHP extensions for a normal Laravel app
RUN docker-php-ext-install pdo_mysql pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip intl

# Configure PHP uploads
RUN echo "upload_max_filesize=512M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size=512M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_file_uploads=20" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/uploads.ini

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . /var/www/html

# Fix git dubious ownership issue
RUN git config --global --add safe.directory /var/www/html

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
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/public \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Build Filament assets (no caching yet - needs runtime env vars)
RUN php artisan filament:assets

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set ServerName to suppress warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Configure Apache DocumentRoot
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf \
    && echo '<Directory /var/www/html/public>\n\
    AllowOverride All\n\
    Require all granted\n\
    </Directory>' >> /etc/apache2/sites-available/000-default.conf

# Expose port
EXPOSE 80

# Create an entrypoint script to handle runtime operations
RUN echo '#!/bin/bash\n\
    set -e\n\
    echo "Starting Laravel application..."\n\
    mkdir -p /var/www/html/storage/app/livewire-tmp\n\
    mkdir -p /var/www/html/storage/app/public\n\
    chown -R www-data:www-data /var/www/html/storage\n\
    chmod -R 775 /var/www/html/storage\n\
    php artisan config:clear\n\
    php artisan cache:clear\n\
    php artisan config:cache\n\
    php artisan route:cache\n\
    php artisan view:cache\n\
    php artisan filament:cache\n\
    php artisan icon:cache\n\
    composer dump-autoload -o\n\
    echo "Laravel application ready!"\n\
    echo "Starting Apache..."\n\
    exec "$@"' > /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
