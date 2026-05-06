# Production Setup Guide

## 🚀 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Copy `.env.production` to `.env` on production server
- [ ] Generate strong JWT_SECRET (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Set production MongoDB URI (from MongoDB Atlas)
- [ ] Configure Cloudinary production credentials
- [ ] Set CORS_ORIGIN to your frontend domain
- [ ] Configure email service (Gmail App Password or SendGrid)

### 2. Install Production Dependencies
```bash
npm install
npm install --save compression  # For response compression
npm install --save-dev pm2       # For process management
```

### 3. Database Setup
- [ ] Create MongoDB Atlas cluster (or managed MongoDB)
- [ ] Create production database indexes
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Test connection string

### 4. External APIs Required

#### Critical (Must Have):
1. **MongoDB** - Database
   - Provider: MongoDB Atlas or self-hosted
   - Free tier: Yes (mongodb.com)

2. **Cloudinary** - Image Storage
   - Provider: Cloudinary.com
   - Free tier: Yes (25GB storage)

#### For AI Image Generation (Choose One):
1. **Replicate API** (Recommended for cost)
   - URL: replicate.com
   - Models: Stable Diffusion, DALL-E alternative
   - Free tier: Yes (trial credits)

2. **OpenAI DALL-E** (Premium quality)
   - URL: openai.com/api
   - Cost: $0.016 - $0.020 per image
   - Setup: Requires API key from OpenAI

3. **Stability AI** (Good balance)
   - URL: api.stability.ai
   - Cost: Free tier available
   - Models: Stable Diffusion XL

#### For Email Service (Optional but Recommended):
1. **Gmail** (Free, limited to 500/day)
   - Generate App Password (2FA required)
   - Simple SMTP setup

2. **SendGrid** (Better for production)
   - URL: sendgrid.com
   - Free tier: Yes (100 emails/day)

3. **AWS SES** (If using AWS)
   - Cost-effective at scale
   - Requires AWS account

#### For Payments (If subscription feature):
1. **Stripe** (Recommended)
   - URL: stripe.com
   - Connect/Hosted: Yes
   - Test mode: Available

2. **Razorpay** (India-friendly)
   - URL: razorpay.com
   - Test mode: Available

#### For Error Tracking (Recommended):
- **Sentry** - Automatic error reporting
  - Free tier: 5K events/month
  - URL: sentry.io

### 5. Server Setup (Choose Hosting)

#### Option A: Docker + AWS EC2
```bash
# Install Docker
# Build and run container
docker build -t modelai-studio .
docker run -p 3000:3000 modelai-studio
```

#### Option B: Railway/Render/Heroku
```bash
# Push code to Git repository
# Connect repository to Railway/Render
# Set environment variables
# Deploy automatically
```

#### Option C: Digital Ocean / Linode
```bash
# Create Ubuntu VM
# Install Node.js & PM2
# Clone repository
# Run: pm2 start ecosystem.config.js --env production
```

### 6. Process Management with PM2

```bash
# Install globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Start PM2 on system boot
pm2 startup

# Monitor
pm2 monit
pm2 logs
```

### 7. Nginx Reverse Proxy Setup

Create `/etc/nginx/sites-available/modelai-studio`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Certificate (from Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    
    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 8. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renewal (runs daily)
sudo systemctl enable certbot.timer
```

### 9. Database Backups

```bash
# Automated backup script (add to cron)
0 2 * * * mongodump --uri="$MONGO_URI" --out=/backup/mongodb-$(date +\%Y\%m\%d)
```

### 10. Monitoring & Logging

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs

# Tail logs
pm2 logs modelai-studio-api -n 100
```

### 11. Performance Tuning

- [ ] Enable response compression (added in compressionMiddleware.js)
- [ ] Set MAX_MEMORY_RESTART to 500MB
- [ ] Configure database connection pooling
- [ ] Implement caching strategy (Redis)
- [ ] Enable HTTP/2

### 12. Security Hardening

- [ ] Change all default secrets
- [ ] Enable HTTPS only
- [ ] Configure secure cookies
- [ ] Set up rate limiting (already configured)
- [ ] Add CORS restrictions
- [ ] Implement helmet security headers (already configured)
- [ ] Regular security updates: `npm audit fix`

## 📊 Monitoring Checklist

- [ ] Set up uptime monitoring (Pingdom, UptimeRobot)
- [ ] Configure error tracking (Sentry)
- [ ] Set up log aggregation
- [ ] Monitor database performance
- [ ] Monitor API response times
- [ ] Alert on high error rates

## 🔄 Deployment Steps

1. Test locally: `npm start`
2. Update `.env` with production values
3. Push code to Git
4. SSH into production server
5. Pull latest code: `git pull origin main`
6. Install dependencies: `npm install --production`
7. Start app: `pm2 start ecosystem.config.js --env production`
8. Configure Nginx
9. Set up SSL certificate
10. Monitor logs: `pm2 logs`

## 📞 Support & Debugging

```bash
# Check app status
pm2 status

# Restart app
pm2 restart modelai-studio-api

# Stop app
pm2 stop modelai-studio-api

# Delete app from PM2
pm2 delete modelai-studio-api

# View last 100 lines of logs
pm2 logs modelai-studio-api -n 100

# Test MongoDB connection
node -e "require('./config/db.js')"
```
