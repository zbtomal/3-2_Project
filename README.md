# JSTACK - Job Portal with Firebase Integration

Welcome to JSTACK, a modern job portal website with Firebase Firestore integration, designed to help job seekers and employers connect efficiently. This project features user authentication, job posting, and application management.

## 🚀 Features

### For Employees
- User registration and authentication
- Browse available jobs
- Apply for jobs with one click
- Track application status
- View job details and requirements

### For Employers
- User registration and authentication
- Post new job listings
- Manage posted jobs
- Review and manage job applications
- Accept or reject candidates

### Technical Features
- Firebase Authentication for secure user management
- Firebase Firestore for real-time data storage
- Responsive design for all devices
- Modern UI/UX with clean interface
- Real-time job updates

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication & Firestore)
- **Deployment**: Netlify (Frontend), Render (Backend)
- **Database**: Firebase Firestore (NoSQL)

## 📁 Project Structure

```
freelance/
├── index.html              # Main landing page
├── loginpage.html          # User login
├── register.html           # User registration
├── dashboard.html          # User dashboard
├── firebase-config.js      # Firebase configuration
├── auth.js                 # Authentication utilities
├── dashboard.js            # Dashboard functionality
├── style.css               # Main stylesheet
├── script.js               # Main JavaScript
├── toggle.js               # Mobile menu toggle
├── jobs/
│   └── job.html            # Job listing page
├── backend/
│   ├── server.js           # Express.js server
│   ├── package.json        # Backend dependencies
│   └── env.example         # Environment variables example
├── images/                 # Image assets
└── netlify.toml           # Netlify configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Firebase account
- Netlify account (for frontend deployment)
- Render account (for backend deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd freelance
   ```

2. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase config and update `firebase-config.js`

3. **Run the frontend locally**
   ```bash
   # Using Live Server (VS Code extension)
   # Or any local server
   python -m http.server 5501
   ```

4. **Run the backend locally** (optional)
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## 🌐 Deployment

### Frontend Deployment (Netlify)

1. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Sign up/Login with your GitHub account
   - Click "New site from Git"

2. **Configure build settings**
   - Repository: Your GitHub repo
   - Base directory: `freelance`
   - Build command: (leave empty)
   - Publish directory: `.`

3. **Environment Variables** (if needed)
   - Go to Site settings > Environment variables
   - Add any required environment variables

4. **Deploy**
   - Netlify will automatically deploy your site
   - Your site will be available at `https://your-site-name.netlify.app`

### Backend Deployment (Render)

1. **Connect to Render**
   - Go to [Render](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New Web Service"

2. **Configure the service**
   - Repository: Your GitHub repo
   - Root Directory: `freelance/backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add environment variables from `env.example`
   - Set `NODE_ENV=production`
   - Set `FRONTEND_URL` to your Netlify URL

4. **Deploy**
   - Render will automatically deploy your backend
   - Your API will be available at `https://your-service-name.onrender.com`

## 🔧 Configuration

### Firebase Setup

1. **Authentication**
   - Enable Email/Password authentication in Firebase Console
   - No additional configuration needed

2. **Firestore Database**
   - Create a Firestore database in test mode
   - The app will automatically create the required collections:
     - `users` - User profiles
     - `jobs` - Job listings
     - `applications` - Job applications

3. **Security Rules** (Optional)
   ```javascript
   // Firestore security rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /jobs/{jobId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /applications/{applicationId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## 📱 Usage

### For Job Seekers (Employees)
1. Register as an "Employee"
2. Browse available jobs on the dashboard
3. Click "Apply" on jobs you're interested in
4. Track your application status in "My Applications"

### For Employers
1. Register as an "Employer"
2. Post new job listings using the "Post Job" form
3. Review applications in the "Job Applications" section
4. Accept or reject candidates

## 🔒 Security Features

- Firebase Authentication for secure user login
- User role-based access control
- Secure data storage in Firestore
- Input validation and sanitization
- CORS protection for API endpoints

## 🆓 Free Services Used

- **Netlify**: Free hosting for frontend (100GB bandwidth/month)
- **Render**: Free hosting for backend (750 hours/month)
- **Firebase**: Free tier includes:
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
  - 1GB stored data
  - 10GB/month transferred

## 🐛 Troubleshooting

### Common Issues

1. **Firebase connection errors**
   - Check your Firebase config in `firebase-config.js`
   - Ensure Firestore is enabled in your Firebase project

2. **Authentication issues**
   - Verify Email/Password auth is enabled in Firebase
   - Check browser console for error messages

3. **Deployment issues**
   - Ensure all files are committed to Git
   - Check build logs in Netlify/Render
   - Verify environment variables are set correctly

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This project uses only free services and is designed to be cost-effective for small to medium-scale job portals.
