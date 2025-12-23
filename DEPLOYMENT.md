# KJM Sports Web - Deployment Guide

## Overview

This application is configured to work with a backend API served behind Nginx at the `/api` prefix. All frontend API calls use relative paths (`/api/...`) which work correctly in both development and production environments.

## Production Build

To create a production build:

```bash
npm run build
```

This generates optimized static files in the `dist/` directory.

## Nginx Configuration

The frontend should be served from the root `/` path, and the backend API should be proxied at `/api`.

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Serve the React frontend from root
    root /var/www/kjm-webapp/dist;
    index index.html;
    
    # Handle React Router - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to the Spring Boot backend
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Deployment Steps

1. **Build the frontend:**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy the `dist/` directory** to your web server (e.g., `/var/www/kjm-webapp/dist`)

3. **Configure Nginx** with the configuration above

4. **Reload Nginx:**
   ```bash
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx
   ```

5. **Clear browser cache** to ensure users get the latest version

## API Endpoints Used

The frontend makes requests to the following API endpoints (all relative to `/api`):

- `GET /api/productos` - List products
- `GET /api/categorias` - List categories  
- `GET /api/usuarios` - List users (admin only)
- `POST /api/usuarios` - Register new user
- `POST /api/usuarios/login` - User login
- `GET /api/boletas` - List receipts/invoices
- `POST /api/boletas` - Create new receipt/invoice
- `DELETE /api/productos/:id` - Delete product (admin only)
- `DELETE /api/usuarios/:id` - Delete user (admin only)
- `DELETE /api/boletas/:id` - Delete receipt (admin only)

## Development vs Production

### Development
- Runs on `http://localhost:5173` (Vite dev server)
- Vite proxy forwards `/api` requests to `http://localhost:8080`
- Hot module replacement enabled

### Production
- Static files served from Nginx
- Nginx proxies `/api` requests to Spring Boot backend
- Optimized and minified bundles

## Troubleshooting

### Issue: 404 errors when navigating directly to routes (e.g., `/productos`)
**Solution:** Ensure Nginx `try_files` directive is configured to serve `index.html` for all routes (see configuration above)

### Issue: API calls failing with CORS errors
**Solution:** Configure CORS in your Spring Boot application to allow requests from your domain

### Issue: Browser showing cached version after deployment
**Solution:** 
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Or add cache-busting query parameters to HTML links
- Vite automatically adds content hashes to JS/CSS filenames for cache busting

### Issue: "ERR_BLOCKED_BY_CLIENT" for localhost references
**Solution:** This indicates an old build is cached. Rebuild the application and clear browser cache:
```bash
rm -rf dist
npm run build
# Deploy new dist/ directory
```

## Security Notes

- All API calls use relative paths - no hardcoded URLs
- HTTPS should be configured in production (use Let's Encrypt)
- Configure appropriate CORS policies in the backend
- Set secure headers in Nginx (HSTS, X-Frame-Options, etc.)
