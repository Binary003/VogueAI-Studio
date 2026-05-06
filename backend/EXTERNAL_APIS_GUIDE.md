# 📡 Required External APIs for Production

## 1️⃣ CRITICAL APIS (Must Have)

### MongoDB Database
**Purpose**: Store all user data, projects, authentication info  
**Provider**: MongoDB Atlas (cloud) or Self-hosted  
**Cost**: Free tier available (512MB storage)  
**Setup Time**: 5 minutes  
**URL**: https://www.mongodb.com/products/platform/cloud  

**What to do:**
1. Create free account
2. Create cluster in region closest to users
3. Create database user
4. Copy connection string to `.env` as `MONGO_URI`

**Example Connection String:**
```
mongodb+srv://username:password@cluster.mongodb.net/modelai_studio?retryWrites=true&w=majority
```

---

### Cloudinary (Image Storage)
**Purpose**: Store and serve generated/uploaded images  
**Provider**: Cloudinary  
**Cost**: Free tier (25GB storage, 25K transformations/month)  
**Setup Time**: 5 minutes  
**URL**: https://cloudinary.com/users/register/free  

**What to do:**
1. Sign up free account
2. Go to Dashboard → Settings
3. Copy credentials:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Add to `.env`

**Current Implementation**: ✅ Already integrated

---

## 2️⃣ AI IMAGE GENERATION APIs (Choose ONE)

### Option A: Replicate API ⭐ (Recommended - Best Value)
**Purpose**: Generate images using AI models  
**Models Available**:
- Stable Diffusion 3
- FLUX (Latest)
- Photorealistic models
- Fashion/Clothing specialized models

**Cost**: $0.001 - $0.015 per image (pay-as-you-go)  
**Free Credits**: $50 trial credits  
**Setup Time**: 10 minutes  
**URL**: https://replicate.com  

**Implementation Example:**
```javascript
// services/aiService.js
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const generateWithReplicate = async (prompt) => {
  const output = await replicate.run(
    'stability-ai/stable-diffusion-3',
    {
      input: {
        prompt: prompt,
        num_outputs: 4,
        height: 512,
        width: 512,
      },
    }
  );
  return output;
};
```

---

### Option B: OpenAI DALL-E 3 (Premium Quality)
**Purpose**: High-quality image generation  
**Model**: DALL-E 3  
**Cost**: $0.020 per image (1024x1024), $0.018 (768x768)  
**Free Credits**: $5 trial credits (first 3 months)  
**Setup Time**: 10 minutes  
**URL**: https://platform.openai.com/account/billing/overview  

**Implementation Example:**
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateWithDALLE = async (prompt) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
  });
  return response.data;
};
```

---

### Option C: Stability AI (Balance of Cost & Quality)
**Purpose**: Fast, cost-effective image generation  
**Models**: Stable Diffusion XL, Stable Diffusion 3  
**Cost**: Free tier (25 images/day), then $0.003-$0.006 per image  
**Setup Time**: 10 minutes  
**URL**: https://www.stabilityai.com  

**Implementation Example:**
```javascript
export const generateWithStabilityAI = async (prompt) => {
  const response = await fetch(
    `https://api.stability.ai/v1/text-to-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.STABILITY_AI_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 4,
        steps: 30,
      }),
    }
  );
  return response.json();
};
```

---

## 3️⃣ EMAIL SERVICE APIs (Recommended for Production)

### Option A: Gmail SMTP (Simple, Free)
**Purpose**: Send password reset, email verification  
**Cost**: Free (500 emails/day limit)  
**Setup Time**: 5 minutes  
**Limitation**: Not ideal for bulk emails  

**Setup:**
1. Enable 2-Factor Authentication on Gmail
2. Create App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@your-domain.com
```

---

### Option B: SendGrid (Professional, Recommended)
**Purpose**: Transactional email service  
**Cost**: Free tier (100 emails/day), then $19.95+/month  
**Setup Time**: 10 minutes  
**URL**: https://sendgrid.com  

**Implementation Example:**
```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: 'noreply@your-domain.com',
    subject,
    html,
  };
  return sgMail.send(msg);
};
```

---

### Option C: AWS SES (If using AWS ecosystem)
**Purpose**: Cost-effective at scale  
**Cost**: Free tier (62,000 emails/month), then $0.10 per 1,000  
**Setup Time**: 15 minutes  
**URL**: https://aws.amazon.com/ses/  

---

## 4️⃣ PAYMENT APIs (For Subscription Feature)

### Stripe (Recommended)
**Purpose**: Handle payments, subscriptions  
**Cost**: 2.9% + $0.30 per transaction  
**Setup Time**: 20 minutes  
**URL**: https://stripe.com  

**Features**:
- Subscription management
- Payment webhooks
- Test mode for development
- Customer portal

**Implementation Example:**
```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createSubscription = async (customerId, priceId) => {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
};
```

---

### Razorpay (India-friendly)
**Purpose**: Payments for Indian users  
**Cost**: 2% + charges for credit cards  
**Setup Time**: 20 minutes  
**URL**: https://razorpay.com  

---

## 5️⃣ MONITORING & ERROR TRACKING (Highly Recommended)

### Sentry
**Purpose**: Automatic error tracking and reporting  
**Cost**: Free tier (5K events/month), then $99+/month  
**Setup Time**: 10 minutes  
**URL**: https://sentry.io  

**Benefits**:
- Real-time error alerts
- Stack traces
- User context
- Session replay

**Implementation Example:**
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

---

## 6️⃣ OPTIONAL BUT USEFUL APIS

### Mailgun (Email + SMS)
**Cost**: Free tier (500 emails/month), then $0.50+  
**Use**: When you need more features than just email  

### Twilio (SMS/Voice)
**Cost**: Pay-as-you-go, $0.0075 per SMS  
**Use**: Send OTP codes, notifications  

### DataDog (Monitoring)
**Cost**: Free tier, then $15+/month  
**Use**: Performance monitoring, uptime checks  

---

## 🎯 Minimal Setup for MVP (Day 1)
```
✅ MongoDB Atlas (free)
✅ Cloudinary (free tier)
✅ Replicate API (free credits + pay-as-you-go)
✅ Gmail SMTP (free)

Total Cost: $0/month to start
Time to setup: 30 minutes
```

## 🚀 Production-Ready Setup (Month 1)
```
✅ MongoDB Atlas (paid, advanced)
✅ Cloudinary Pro ($99/month)
✅ Replicate API (pay-as-you-go)
✅ SendGrid ($19.95/month)
✅ Sentry ($99/month)
✅ Stripe (2.9% + $0.30)

Estimated Monthly Cost: $200-500
```

## 📋 Setup Checklist

- [ ] MongoDB Atlas account + cluster
- [ ] Cloudinary account + credentials
- [ ] Choose AI API (Replicate recommended)
- [ ] Get AI API key and add to `.env.production`
- [ ] Setup email service (Gmail or SendGrid)
- [ ] Add email credentials to `.env.production`
- [ ] Setup Sentry account (optional but recommended)
- [ ] Setup Stripe account (if using payments)
- [ ] Test all APIs in development
- [ ] Deploy to production server
- [ ] Configure domain and SSL
- [ ] Monitor error logs and uptime

## 🔗 Quick Links

| Service | URL | Priority |
|---------|-----|----------|
| MongoDB Atlas | https://mongodb.com/products/platform/cloud | 🔴 Critical |
| Cloudinary | https://cloudinary.com | 🔴 Critical |
| Replicate AI | https://replicate.com | 🟠 High |
| Stripe | https://stripe.com | 🟡 Medium |
| Sentry | https://sentry.io | 🟡 Medium |
| SendGrid | https://sendgrid.com | 🟡 Medium |
| Let's Encrypt SSL | https://letsencrypt.org | 🔴 Critical |

---

**Next Steps:**
1. Update `.env.production` with your API keys
2. Install production dependencies: `npm install`
3. Test locally: `npm start`
4. Deploy using PM2 or Docker
5. Monitor with Sentry and PM2
