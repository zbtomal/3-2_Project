#!/bin/bash

echo "🚀 JSTACK Job Portal Deployment Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm is installed: $(npm --version)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up Firebase project and update firebase-config.js"
echo "2. Deploy frontend to Netlify"
echo "3. Deploy backend to Render"
echo ""
echo "📖 For detailed instructions, see README.md"
echo ""
echo "🔗 Useful links:"
echo "- Firebase Console: https://console.firebase.google.com/"
echo "- Netlify: https://netlify.com"
echo "- Render: https://render.com" 