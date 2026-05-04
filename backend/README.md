# ModelAI Studio - Backend

A production-ready Node.js/Express backend for the ModelAI Studio AI-powered SaaS platform.

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **Bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
backend/
├── config/               # Configuration files
│   ├── db.js            # MongoDB connection
│   └── cloudinary.js    # Cloudinary setup
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── uploadController.js
│   ├── generateController.js
│   └── projectsController.js
├── models/              # Database schemas
│   ├── User.js
│   └── Project.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── uploadRoutes.js
│   ├── generateRoutes.js
│   └── projectRoutes.js
├── middlewares/         # Custom middlewares
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── uploadMiddleware.js
├── services/            # Business logic
│   └── aiService.js
├── utils/               # Helper functions
│   ├── helpers.js
│   └── responses.js
├── server.js            # Entry point
├── package.json
└── .env.example
```

## 🚀 Setup Instructions

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** v16 or higher
- **npm** or **yarn**
- **MongoDB** account (Atlas recommended)
- **Cloudinary** account

### 2. Installation

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory and add your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/modelai_studio

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 5. Production Build

```bash
npm start
```

## 📡 API Documentation

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup

Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3d5c1a2b3c4d5e6f7g8",
      "name": "John Doe",
      "email": "john@example.com",
      "plan": "free",
      "generationsUsed": 0
    }
  }
}
```

#### Login
```http
POST /api/auth/login

Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3d5c1a2b3c4d5e6f7g8",
      "name": "John Doe",
      "email": "john@example.com",
      "plan": "free",
      "generationsUsed": 0
    }
  }
}
```

#### Get Profile
```http
GET /api/auth/profile

Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "60f7b3d5c1a2b3c4d5e6f7g8",
    "name": "John Doe",
    "email": "john@example.com",
    "plan": "free",
    "generationsUsed": 0,
    "generationLimit": 10,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Image Upload Endpoint

#### Upload Image
```http
POST /api/upload

Authorization: Bearer <token>
Content-Type: multipart/form-data

[Form Data]
image: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "https://res.cloudinary.com/cloud_name/image/upload/v1234567890/modelai_uploads/abc123.jpg",
    "publicId": "modelai_uploads/abc123"
  }
}
```

### Generate Images Endpoint

#### Generate AI Images
```http
POST /api/generate

Authorization: Bearer <token>
Content-Type: application/json

{
  "imageUrl": "https://res.cloudinary.com/cloud_name/image/upload/v1234567890/modelai_uploads/abc123.jpg",
  "publicId": "modelai_uploads/abc123",
  "gender": "female",
  "bodyType": "athletic",
  "skinTone": "medium",
  "pose": "standing",
  "background": "studio"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Images generated successfully",
  "data": {
    "projectId": "60f7b3d5c1a2b3c4d5e6f7g8",
    "generatedImages": [
      {
        "url": "https://dummyimage.com/512x512/FF6B6B/FFFFFF?text=Generated+1",
        "publicId": "modelai_generated_1705320600000_0"
      },
      {
        "url": "https://dummyimage.com/512x512/4ECDC4/FFFFFF?text=Generated+2",
        "publicId": "modelai_generated_1705320600000_1"
      }
    ]
  }
}
```

### Projects Endpoints

#### Get All Projects
```http
GET /api/projects

Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "_id": "60f7b3d5c1a2b3c4d5e6f7g8",
      "userId": "60f7b3d5c1a2b3c4d5e6f7g8",
      "originalImage": {
        "url": "https://res.cloudinary.com/...",
        "publicId": "modelai_uploads/abc123"
      },
      "generatedImages": [...],
      "attributes": {
        "gender": "female",
        "bodyType": "athletic",
        "skinTone": "medium",
        "pose": "standing",
        "background": "studio"
      },
      "status": "completed",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Project by ID
```http
GET /api/projects/:id

Authorization: Bearer <token>
```

#### Delete Project
```http
DELETE /api/projects/:id

Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {}
}
```

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## 🧪 Postman Testing Guide

### 1. Import Collection

Create a new Postman collection with the following requests:

### 2. Collection Variables

Set these variables in your collection:
- `baseUrl`: `http://localhost:5000/api`
- `token`: (Generated after login)

### 3. Test Flow

1. **Signup User**
   - POST `{{baseUrl}}/auth/signup`
   - Copy token from response to `token` variable

2. **Login User**
   - POST `{{baseUrl}}/auth/login`
   - Copy token from response

3. **Get Profile**
   - GET `{{baseUrl}}/auth/profile`
   - Add header: `Authorization: Bearer {{token}}`

4. **Upload Image**
   - POST `{{baseUrl}}/upload`
   - Form Data: Select a JPG/PNG/WEBP file
   - Add header: `Authorization: Bearer {{token}}`
   - Copy `imageUrl` and `publicId` from response

5. **Generate Images**
   - POST `{{baseUrl}}/generate`
   - Use the `imageUrl` and `publicId` from upload
   - Add header: `Authorization: Bearer {{token}}`
   - Add attributes (gender, bodyType, etc.)

6. **Get All Projects**
   - GET `{{baseUrl}}/projects`
   - Add header: `Authorization: Bearer {{token}}`

7. **Delete Project**
   - DELETE `{{baseUrl}}/projects/:id`
   - Add header: `Authorization: Bearer {{token}}`

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation with Joi
- ✅ Cloudinary API key protection
- ✅ Environment variable configuration

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.0",
  "dotenv": "^16.3.1",
  "cloudinary": "^1.40.0",
  "multer": "^1.4.5-lts.1",
  "multer-storage-cloudinary": "^4.0.0",
  "helmet": "^7.0.0",
  "cors": "^2.8.5",
  "joi": "^17.10.2",
  "express-rate-limit": "^7.0.0",
  "morgan": "^1.10.0"
}
```

## 🚀 Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=5000
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret

# Deploy
git push heroku main
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

### Cloudinary Upload Fails
- Verify Cloudinary credentials
- Check folder name in upload middleware
- Ensure file size is under 5MB

### JWT Token Errors
- Verify `JWT_SECRET` is set
- Check token format in Authorization header
- Ensure token hasn't expired

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please submit pull requests.

## 📧 Support

For support, email: support@modelai.studio
