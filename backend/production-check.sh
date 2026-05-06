#!/bin/bash

# Production Deployment Checklist & Setup Script
# Run this script to verify all production requirements

echo "🚀 ModelAI Studio - Production Readiness Check"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
check_item() {
    local item=$1
    local command=$2
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $item"
    else
        echo -e "${RED}✗${NC} $item"
    fi
}

# Check Node.js
check_item "Node.js installed" "node --version"

# Check npm
check_item "npm installed" "npm --version"

# Check Git
check_item "Git installed" "git --version"

# Check if node_modules exists
check_item "Dependencies installed" "test -d node_modules"

# Check .env file
check_item ".env file exists" "test -f .env"

# Check .env.production file
check_item ".env.production template exists" "test -f .env.production"

# Check PM2 globally installed
check_item "PM2 installed globally" "pm2 --version"

# Check if ecosystem.config.js exists
check_item "PM2 ecosystem config exists" "test -f ecosystem.config.js"

echo ""
echo "================================================"
echo "📋 Configuration Checklist:"
echo "================================================"
echo ""

# Check environment variables
check_mongodb() {
    if grep -q "MONGO_URI=" .env.production; then
        if grep -q "mongodb+srv://" .env.production; then
            echo -e "${GREEN}✓${NC} MongoDB URI configured (Production)"
        else
            echo -e "${YELLOW}⚠${NC} MongoDB URI might not be production (check .env.production)"
        fi
    else
        echo -e "${RED}✗${NC} MongoDB URI not configured"
    fi
}

check_jwt() {
    if grep -q "JWT_SECRET=" .env.production; then
        local jwt_val=$(grep "JWT_SECRET=" .env.production | cut -d'=' -f2)
        if [ ${#jwt_val} -lt 32 ]; then
            echo -e "${YELLOW}⚠${NC} JWT_SECRET might be too short (< 32 chars)"
        else
            echo -e "${GREEN}✓${NC} JWT_SECRET configured (Production-length)"
        fi
    else
        echo -e "${RED}✗${NC} JWT_SECRET not configured"
    fi
}

check_cloudinary() {
    if grep -q "CLOUDINARY_CLOUD_NAME=" .env.production && \
       grep -q "CLOUDINARY_API_KEY=" .env.production && \
       grep -q "CLOUDINARY_API_SECRET=" .env.production; then
        echo -e "${GREEN}✓${NC} Cloudinary credentials configured"
    else
        echo -e "${RED}✗${NC} Cloudinary credentials missing"
    fi
}

check_ai_api() {
    if grep -q "REPLICATE_API_KEY=" .env.production || \
       grep -q "OPENAI_API_KEY=" .env.production || \
       grep -q "STABILITY_AI_KEY=" .env.production; then
        echo -e "${GREEN}✓${NC} AI API key configured"
    else
        echo -e "${YELLOW}⚠${NC} No AI API key found (required for image generation)"
    fi
}

check_cors() {
    if grep -q "CORS_ORIGIN=" .env.production; then
        echo -e "${GREEN}✓${NC} CORS origin configured"
    else
        echo -e "${YELLOW}⚠${NC} CORS_ORIGIN not configured (using default)"
    fi
}

check_mongodb
check_jwt
check_cloudinary
check_ai_api
check_cors

echo ""
echo "================================================"
echo "🔧 Required External APIs:"
echo "================================================"
echo ""
echo "1. MongoDB Atlas - https://mongodb.com/products/platform/cloud"
echo "   Status: $(grep -q 'mongodb+srv://' .env.production && echo '✓ Configured' || echo '✗ Not configured')"
echo ""
echo "2. Cloudinary - https://cloudinary.com"
echo "   Status: $(grep -q 'CLOUDINARY_API_KEY=' .env.production && grep -q 'CLOUDINARY_API_KEY=your' .env.production && echo '✗ Not configured' || echo '✓ Configured')"
echo ""
echo "3. AI Image Generation (Choose one):"
echo "   - Replicate: https://replicate.com"
echo "   - OpenAI DALL-E: https://openai.com/api"
echo "   - Stability AI: https://stabilityai.com"
echo "   Status: $(grep -q 'REPLICATE_API_KEY=' .env.production && grep -q 'REPLICATE_API_KEY=your' .env.production && echo '✗ Not configured' || echo '✓ Configured')"
echo ""
echo "4. Email Service (Optional but recommended):"
echo "   - Gmail SMTP (free)"
echo "   - SendGrid: https://sendgrid.com"
echo "   Status: $(grep -q 'SMTP_HOST=' .env.production && grep -v '^#' .env.production | grep 'SMTP_HOST=' | grep -q '^$' && echo '✗ Not configured' || echo '✓ Configured')"
echo ""
echo "5. Error Tracking (Recommended):"
echo "   - Sentry: https://sentry.io"
echo "   Status: $(grep -q 'SENTRY_DSN=' .env.production && grep -q 'SENTRY_DSN=https' .env.production && echo '✓ Configured' || echo '✗ Not configured')"
echo ""

echo "================================================"
echo "🚀 Quick Start Commands:"
echo "================================================"
echo ""
echo "Development:"
echo "  npm run dev"
echo ""
echo "Production (with PM2):"
echo "  npm run prod"
echo ""
echo "View Production Logs:"
echo "  npm run prod-logs"
echo ""
echo "Stop Production:"
echo "  npm run prod-stop"
echo ""

echo "================================================"
echo "📚 Documentation:"
echo "================================================"
echo ""
echo "Production Setup: PRODUCTION_SETUP.md"
echo "External APIs: EXTERNAL_APIS_GUIDE.md"
echo "API Endpoints: Check Postman collection"
echo ""

echo "================================================"
echo "⚠️  Before Going Live:"
echo "================================================"
echo ""
echo "1. Update .env.production with real credentials"
echo "2. Generate secure JWT_SECRET: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo "3. Configure MongoDB Atlas cluster"
echo "4. Setup Cloudinary account"
echo "5. Choose and setup AI API (Replicate recommended)"
echo "6. Configure email service"
echo "7. Setup domain and SSL certificate (Let's Encrypt)"
echo "8. Configure reverse proxy (Nginx)"
echo "9. Setup monitoring (PM2, Sentry)"
echo "10. Test all endpoints from Postman collection"
echo ""

echo "================================================"
echo "✅ Checklist Complete!"
echo "================================================"
echo ""
