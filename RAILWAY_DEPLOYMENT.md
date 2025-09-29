# Railway Deployment Guide

## Environment Variables Required

### For Local Development:
Create these `.env` files in your project:

**Backend `.env` file** (in `backend/` directory):
```
MYSQLDATABASE=salesforce
MYSQLUSER=root
MYSQLPASSWORD=your_local_password
MYSQLHOST=localhost
MYSQLPORT=3306
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env` file** (in `frontend/` directory):
```
REACT_APP_API_URL=http://localhost:5000
```

### For Railway Production:
Set these environment variables in Railway dashboard:

**Backend Environment Variables:**
- `MYSQLDATABASE` - Your database name (from Railway MySQL service)
- `MYSQLUSER` - Database username (from Railway MySQL service)
- `MYSQLPASSWORD` - Database password (from Railway MySQL service)
- `MYSQLHOST` - Database host (from Railway MySQL service)
- `MYSQLPORT` - Database port (from Railway MySQL service)
- `PORT` - Server port (Railway will set this automatically)
- `FRONTEND_URL` - Your frontend Railway URL (e.g., https://your-frontend.railway.app)

**Frontend Environment Variables:**
- `REACT_APP_API_URL` - Your backend Railway URL (e.g., https://your-backend.railway.app)

## Deployment Steps:

1. **Create Railway Account**: Sign up at railway.app
2. **Create New Project**: Create a new project in Railway
3. **Add Database**: Add a MySQL database service
4. **Deploy Backend**: 
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Add environment variables
5. **Deploy Frontend**:
   - Create another service for frontend
   - Set root directory to `frontend`
   - Add environment variables
   - Set build command: `npm run build`
   - Set start command: `npm run serve`

## Important Notes:
- Make sure to update your frontend URL in the backend CORS configuration
- Use Railway's provided database credentials
- The frontend will be served as a static site
- Both services need to be connected to the same project
